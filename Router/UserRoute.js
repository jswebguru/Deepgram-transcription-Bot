const express = require('express');
const UserModel = require('../Model/User'); 

const router = express.Router();



router.get('/', (req, res)=>{
    res.status(200).json({
        message: `Welcome to ${req.originalUrl} :D`
    });
});

router.post('/signup', async(req, res)=>{
    try {
        
        const name = req.body.name;
        const email = req.body.email;
        const passwordEncrypt = await bcrypt.hash(req.body.password, 12);
    
        await UserModel.create({
            name,
            email,
            password: passwordEncrypt
        });
    
        res.status(200).json({
            name,
            message: 'User successfully created.'
        });
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Error'
        })
    }

});

router.post('/signin', async (req,res)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            throw Error('Please provide email and password')
        }

        const user = await UserModel.findOne({
            email: 'mfitrie78@gmail.com'
        })
        .select('+password');
    
        const isValidate = await user.correctPassword(password, user.password);
        
        if(!user || !isValidate){
            throw Error('Email or password is incorrect');
        }
    
        res.status(200).json({
            message: 'Login sucess'
        })
        
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
});

module.exports = router;
