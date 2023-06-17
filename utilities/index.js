const {
    createJWT,
    verifyToken,
} = require('./jwt');
const attachCookiesToResponse = require('./cookie');

module.exports = {
    createJWT,
    verifyToken,
    attachCookiesToResponse
};