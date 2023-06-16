const CustomErrorAPI = require('./CustomErrorAPI');

class NotFoundError extends CustomErrorAPI{
    constructor(message){
        super(message);
        this.statusCode = 404;
    }
}

module.exports = NotFoundError;
