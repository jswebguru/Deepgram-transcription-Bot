const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please insert the name']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please insert the valid email']
    },
    password: {
        type: String,
        require: [true, 'Please provide the password'],
        minlength: 8, 
        select: false
    }
});


userSchema.methods.correctPassword = async (userInputPassword, userPasswordHashedDB)=>{
    return await bcrypt.compare(userInputPassword, userPasswordHashedDB);
}


const User = mongoose.model('User', userSchema);

module.exports = User;