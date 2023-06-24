const { StatusCodes } = require("http-status-codes")

const getAllProducts = async (req, res) => {
    res.status(StatusCodes.OK).json("All products");
};

const getSingleProducts = async (req, res) => {
    res.status(StatusCodes.OK).json("All product");
};

const createProduct = async (req, res) => {
    res.status(StatusCodes.OK).json("All product");
};

const updateProduct = async (req, res) => {
    res.status(StatusCodes.OK).json("All product");
};

const deleteProduct = async (req, res) => {
    res.status(StatusCodes.OK).json("All product");
};

const uploadImage = async (req, res) => {
    res.status(StatusCodes.OK).json("Uploaded an image");
};

module.exports = {
    getAllProducts,
    getSingleProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
};