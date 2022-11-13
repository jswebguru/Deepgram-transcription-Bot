const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const path = require('path');
const fs = require('fs');

const UserModel = require('../Model/User'); 
const getTranscript = require('../deepgram');
const formatFileSize = require('../Utils/formatFileSize');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');

dotenv.config({
    path: '../config.env'
})
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        const filePath = path.resolve(__dirname, '../videos');
        if(fs.existsSync(filePath)){
            cb(null, filePath);
        }else{
            fs.mkdir(filePath, (err)=>{
                if(err){
                    return console.error(err);
                }
                
                cb(null, filePath);
            })
        }
    },
    filename: (req, file, cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage
});

router.get('/', (req, res)=>{
    res.status(200).json({
        message: `Welcome to ${req.originalUrl} :D`
    });
});

router.post('/signup', (async(req, res, next)=>{

    const {name, email, password} = req.body;

    

    if(name === '' || email === '' || password === ''){
        return next(new AppError('Name, email, or password is not inserted!', 400))
    }
    
    const passwordEncrypt = await bcrypt.hash(password, 12);

    await UserModel.create({
        name,
        email,
        password: passwordEncrypt
    });

    res.status(200).json({
        name,
        message: 'User successfully created.'
    });
        
}));


router.post('/signin', catchAsync(async (req, res, next)=>{

    const {email, password} = req.body;

    if(!email || !password){
        return next(new AppError('Please provide email and password', 401));
    }

    const user = await UserModel.findOne({
        email
    })
    .select('+password');

    if(!user){
        return next(new AppError('Email or password is incorrect', 401));
    }

    const isValidate = await user.correctPassword(password, user.password);
    
    if(!isValidate){
        return next(new AppError('Email or password is incorrect', 401));
    }

    createSendToken(user._id, req, res);

    res.status(200).json({
        message: 'Login sucess',
        // token
    });

}));


router.get('/home', isLoggin, catchAsync(async(req, res, next)=>{
    const {id} = res.locals.user;

    const user = await UserModel.findById(id);

    if(!user){
        return next(new AppError( 'No user found  in database', 403));
    }

    res.status(200).json({
        message: 'You allowed!',
        name: user.name,
        isLogin: true
    });
}));


router.post('/upload', isLoggin, upload.single('video'), generateTranscript, saveTheVideoMetadata, catchAsync(async(req, res, next)=>{

    const {originalname, size} = req.file;
    const fileSizeReadableFormat = formatFileSize(size);
    const fileId = res.locals.fileid;
    const transcription = res.locals.transcript;
 
    if(!fileId && !transcription){
        return next(new AppError( 'fileId and transcription is null', 501));
    }
    
    res.status(200).json({
        message: "Successfully uploaded files",
        fileId,
        filename: originalname,
        size: fileSizeReadableFormat,
        transcription
    });
        
}));


router.get('/downloadTranscript/:fileid', catchAsync(async (req, res, next)=>{
    
    const pathMetadata = path.resolve(__dirname, '../video_metadata/data.json');
    const fileId = req.params.fileid;

    const metadataObject = JSON.parse(await fs.promises.readFile(pathMetadata, 'utf8', (err, data)=>{
        if(err){
            return next(new AppError('Error reading the file', 500));
        }

        return data;
        
    }));

    const fileMetadata = metadataObject.find((el)=>{
        return el.videoId === fileId;
    });

    if(!fileMetadata){
        return next(new AppError('Transcript not found', 404));
    }

    const filePath = fileMetadata.pathFileTranscript;
    res.download(filePath, (err)=>{
        if(err){
            res.send({
                error: err,
                message: 'Error downloading the file'
            });
        }
    });

}));


// router.get('/video', (req, res)=>{
//     const range = req.headers.range;
//     if (!range) {
//         res.status(400).send("Range not provided");
//     }
//     const videoPath = path.resolve(__dirname, '../videos/1667876936122-Dedsec live wallpaper.mp4');
//     const videoSize = fs.statSync(videoPath).size;
//     const chunkSize = 10 ** 6; // 1 mb
//     const start = Number(range.replace(/\D/g, ""));
//     const end = Math.min(start + chunkSize, videoSize - 1);
//     const contentLength = end - start + 1;
//     const headers = {
//         "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//         "Accept-Ranges": "bytes",
//         "Content-Length": contentLength,
//         "Content-Type": "video/mp4",
//     };
//     res.writeHead(206, headers);
//     const videoStream = fs.createReadStream(videoPath, { start, end });
//     videoStream.pipe(res);
// });


router.get('/logout', (req, res)=>{

    res.cookie('jwt','loggedout', {
        // 10 seconds
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        message: 'Successfully log out!',
        isLogin: false
    });
});







function createToken(id){
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: '1d'
    });
}


function createSendToken(id, req, res){
    const token = createToken(id);

    const cookieOptions = {
        expire: 360000 + Date.now(),
        // expires: (new Date(Date.now()+ 86400*1000)).toUTCString(),
        httpOnly: true
    }

    res.cookie('jwt', token, cookieOptions);
}


async function isLoggin(req, res, next){
    // const authHeaders = req.headers['authorization'];
    // if(!authHeaders){
    //     return res.status(403).json({
    //         message: `You're not logged in!`
    //     });
    // }
    // const token = authHeaders.split(' ')[1];

    const token = req.cookies.jwt;

    jwt.verify(token, process.env.TOKEN_SECRET, (err, data)=>{
        if(err){
            return res.status(403).json({
                message: 'Not allowed',
                isLogin: false
            });
        }
        // console.log(data);
        res.locals.user = data;
        next();
    });
}

async function generateTranscript(req, res, next){
    try {

        const filePath = req.file.path;
        const transcript = await getTranscript(filePath);
        res.locals.transcript = transcript.data;
        res.locals.filePath = transcript.fileLocation;
        
        next();

    } catch (error) {
        console.log(error);
    }
}

async function saveTheVideoMetadata(req, res, next){
    try {
        
        const filePath = path.resolve(__dirname, '../video_metadata');
        const pathMetadataFile = path.resolve(__dirname, '../video_metadata/data.json');

        const pathFileTranscript = res.locals.filePath;

        const videoId = uuidv4();
        // res.locals.fileid = videoId;

        const videoObject = [
            {
                videoId,
                pathFileTranscript,
                ...req.file
            }
        ];
    
        if(fs.existsSync(filePath)){


            
            if(fs.existsSync(pathMetadataFile)){
                const dataFile = await fs.promises.readFile(pathMetadataFile, 'utf8', (err, data)=>{
                    if(!err){
                        return data;
                    }
                });

                const dataFileObject = JSON.parse(dataFile);
                dataFileObject.push(...videoObject);

                const dataFileObjectJSON = JSON.stringify(dataFileObject);

                fs.writeFile(pathMetadataFile, dataFileObjectJSON, (err)=>{
                    if(err){
                        throw err;
                    }
                });

                return next();
            }

            if(!fs.existsSync(pathMetadataFile)){

                const videoJSON = JSON.stringify(videoObject);
                
                fs.writeFile(pathMetadataFile, videoJSON, (err)=>{
                    if(err){
                        throw err;
                    }
                });
                return next();
            }



        }else{
            fs.mkdir(filePath, (err)=>{
                if(err){
                    throw err;
                }

                const videoJSON = JSON.stringify(videoObject);
    
                fs.writeFile(pathMetadataFile, videoJSON, (err)=>{
                    if(err){
                        throw err;
                    }
                });
            });

            return next();
        }
        
        // next();

    } catch (error) {
        console.log(error);
    }
}


// function formatFileSize(bytes,decimalPoint) {
//     if(bytes == 0) return '0 Bytes';
//     const k = 1000,
//         dm = decimalPoint || 2,
//         sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
//         i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
// }


module.exports = router;
