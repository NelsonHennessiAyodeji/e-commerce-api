const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a username"],
        minLength: 3,
        maxLength: 25
    },
    email: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        minLength: 11,
        maxLength: 50
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: 6
    },
    userRole: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = async function () {
    return jwt.sign(
        {
            userName: this.name,
            userEmail: this.email,
            userPassword: this.password,
            userRole: this.userRole
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME
        }
    );
};

module.exports = mongoose.model('User', UserSchema);
