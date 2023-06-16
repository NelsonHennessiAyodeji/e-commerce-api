const User = require('../model/User');
const { BadRequestError } = require('../error');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
    const user = User.create({...req.body});

    if(!user){
        throw new BadRequestError("Please provide a valid username/email/password");
    }
    
    res.status(StatusCodes.OK).json(user);
}

const login = async (req, res) => {
    res.status(StatusCodes.OK).json("logged in");
}

const logout = async (req, res) => {
    res.status(StatusCodes.OK).json("logged out");
}

module.exports = {
    register,
    login,
    logout
};
