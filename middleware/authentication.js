const { verifyToken } = require("../utilities");
const { UnauthenticatedError, UnauthorizedError } = require("../error");

const authenticateUser = (req, res, next) => {
    const {token} = req.signedCookies;

    if(!token){
        throw new UnauthenticatedError("Invalid Token");
    }

    const {userName, userEmail, userRole, userId} = verifyToken(token);
    req.user = {userName, userEmail, userRole, userId};
    next();
};

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.userRole)){
            throw new UnauthorizedError("You are not high level enough to access this route");
        }

        next();
    }
};

module.exports = {
    authenticateUser,
    authorizePermissions
};
