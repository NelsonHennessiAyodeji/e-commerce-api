const User = require('../model/User');
const { BadRequestError } = require('../error');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    const emailAlreadyExists = await User.find({email});

    if(!emailAlreadyExists){
        throw new BadRequestError("The email that you have provided has already been registered, please use a different one");
    }

    const isFirstAccount = (await User.countDocuments({}) === 0);
    const role = isFirstAccount? 'admin' : 'user';

    const user = await User.create({name, email, password, role});

    if(!user){
        throw new BadRequestError("Please provide a valid username/email/password");
    }

    const token = user.createJWT();
    
    res.status(StatusCodes.OK).json({user, token});
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
