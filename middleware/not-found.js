const notFound = (req, res, next) => {
    res.status(400).json("The route that you have entered is not found on this server");
}

module.exports = notFound;
