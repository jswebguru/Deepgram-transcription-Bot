const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRouter = require('../Router/UserRoute');

dotenv.config({
    path: path.resolve(__dirname, '../config.env')
});

const app = express();

(async()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Database connected!');
    } catch (error) {
        console.log(error);
    }

})();


app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())
app.use('/api/v1/user', userRouter);
app.all('*', (req, res)=>{
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server`
    });
});

app.get('/', (req, res)=>{
    res.status(200).json({
        message: 'Welcome to the server'
    });
});

const port = process.env.PORT || 8000;
const server = app.listen(port, ()=>{
    console.log(`Port is running on ${port}`);
});

process.on('unhandledRejection', (err)=>{
    console.log('Unhandle Rejection. Server is shutting down..');
    console.log(err.name, err.message);
    server.close(()=>{
        process.exit();
    })
})