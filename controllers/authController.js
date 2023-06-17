const User = require('../model/User');
const {
    BadRequestError,
    NotFoundError,
    NotAcceptableError,
    UnauthorizedError
} = require('../error');
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

    const oneDay = 1000 * 60 * 60 * 24;//1millisecond x 60sec x 60min x 24 hr

    req.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay)
    });
    
    res.status(StatusCodes.CREATED).json({user, token});
}

const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        throw new NotAcceptableError("Can't accept blank fields, provide an email and a password to login");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new NotFoundError("The email that you have provide is not registered with us");
    }

    const passwordIsCorrect = user.comparePasswords(password);

    if(!passwordIsCorrect){
        // throw new UnauthorizedError("Password is incorrect");
    }

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({user, token});
}

const logout = async (req, res) => {
    res.json("logged out");
}

module.exports = {
    register,
    login,
    logout
};
