const {CustomErrorAPI} = require("../error");

const errorHandler = (err, req, res, next) => {
    if(err instanceof CustomErrorAPI){
        res.status(err.statusCode).json(err.message);
    }
    res.status(500).json("There was an issue with the server, please try again later...");
}

module.exports = errorHandler;
