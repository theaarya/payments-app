const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin123@cluster0.szkw0fa.mongodb.net/');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 5,
        maxLength: 15
    },
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 25,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 25,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    }
});

const User = mongoose.model('User',userSchema);

module.exports = {
    User
}