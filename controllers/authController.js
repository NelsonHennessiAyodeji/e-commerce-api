const {StatusCodes} = require('http-status-codes');

const register = async (req, res) => {
    res.status(StatusCodes.OK).json("Registered");
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