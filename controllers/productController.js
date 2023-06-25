const Product = require('../model/Product');
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require('../error');

const getAllProducts = async (req, res) => {
    const products = await Product.find({}).populate('user', 'name');

    if(!products){
        throw new NotFoundError("We could not find any products, maybe try creating some");
    }

    res.status(StatusCodes.OK).json(products);
};

const getSingleProducts = async (req, res) => {
    const {id: productId} = req.params;
    const product = await Product.findOne({_id: productId}).populate('user', 'name');

    if(!product){
        throw new NotFoundError(`There is no product with id: ${productId}`)
    }

    res.status(StatusCodes.OK).json(product);
};

const createProduct = async (req, res) => {
    const product = await Product.create({
        ...req.body,
        user: req.user.userId,
        featured: false,
        freeShipping: false,
        averageRating: 0,
        numOfReviews: 0
    });

    if(!product){
        throw new BadRequestError("Please provide necesary product information");
    }

    res.status(StatusCodes.CREATED).json(product);
};

const updateProduct = async (req, res) => {
    const {id: productId} = req.params;
    const product = await Product.findOneAndUpdate({_id: productId}, {...req.body}, {new: true, runValidators: true});

    if(!product){
        throw new NotFoundError(`Could not find product with id: ${productId}`);
    }

    res.status(StatusCodes.OK).json(product);
};

const deleteProduct = async (req, res) => {
    const {id: productId} = req.params;
    const product = await Product.findOne({_id: productId});

    if(!product){
        throw new NotFoundError(`Could not find product with id: ${productId}`);
    }

    //await product.remove();
    
    res.status(StatusCodes.OK).json({mag:"Deleted a product", product: product});
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