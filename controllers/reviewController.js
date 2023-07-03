const { NotFoundError, BadRequestError } = require('../error');
const Review = require('../model/Review');
const Product = require('../model/Product');
const { StatusCodes } = require("http-status-codes");
const searchPermissions = require('../utilities/searchPermissions');

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({}).populate('user', 'name').populate('product', 'name');
    if(!reviews){
        throw new NotFoundError("No reviews were found");
    }
    res.status(StatusCodes.OK).json(reviews);
};

const getSingleReview = async (req, res) => {
    const {id: reviewId} = req.params;
    const review = await Review.findOne({_id: reviewId});

    if(!review){
        throw new NotFoundError(`There is no review with id of ${reviewId}`);
    }

    res.status(StatusCodes.OK).json(review);
};

const createReview = async (req, res) => {
    const {product: productId} = req.body;
    req.body.user = req.user.userId;
    
    const productExists = Product.find({_id: productId});
    if(!productExists){
        throw new NotFoundError("The product doesnt exists");
    }

    const review = await Review.create({...req.body});

    if(!review){
        throw new BadRequestError("Please make sure your inputs are follwing rquested inputs");
    }

    res.status(StatusCodes.CREATED).json(review);
};

const updateReview = async (req, res) => {
    const {id: reviewId} = req.params;
    const review = await Review.findOne({_id: reviewId});
//TODO: check if the product and category exists

    searchPermissions(req.user, review.user);

    review.title = req.body.title;
    review.rating = req.body.rating;
    review.comment = req.body.comment;

    await review.save();
    res.status(StatusCodes.OK).json(review);
};

const deleteReview = async (req, res) => {
    const {id: reviewId} = req.params;
    const review = await Review.findOne({_id: reviewId});

    if(!review){
        throw new NotFoundError(`There is no review with id of ${reviewId}`);

    }
    res.status(StatusCodes.OK).json("Deleted Review" + review);
};

const getSingleProductReview = async (req, res) => {
    const {id: productId} = req.params;
    
}

module.exports = {
    getAllReviews,
    getSingleReview,
    createReview,
    updateReview,
    deleteReview
};