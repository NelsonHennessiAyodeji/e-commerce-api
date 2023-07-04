const Review = require("../model/Review");
const Product = require("../model/Product");
const searchPermissions = require("../utilities/searchPermissions");
const {
  NotFoundError,
  BadRequestError,
  NotAcceptableError
} = require("../error");
const { StatusCodes } = require("http-status-codes");

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price"
  });
  if (!reviews) {
    throw new NotFoundError("No reviews were found");
  }
  res.status(StatusCodes.OK).json(reviews);
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFoundError(`There is no review with id of ${reviewId}`);
  }

  res.status(StatusCodes.OK).json(review);
};

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const { userId } = req.user;

  const productExists = await Product.find({ _id: productId });
  if (!productExists) {
    throw new NotFoundError("The product doesnt exists");
  }

  //Although there is a code in the Review schema that allows me to do this, but nothing spoil sha
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: userId
  });

  if (alreadySubmitted) {
    throw new NotAcceptableError(
      "You have already submitted a review, please try to edit your review if needed"
    );
  }

  const review = await Review.create({ ...req.body, user: userId });

  if (!review) {
    throw new BadRequestError(
      "Please make sure your inputs are follwing rquested inputs"
    );
  }

  res.status(StatusCodes.CREATED).json(review);
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  //TODO: check if the product and category exists

  searchPermissions(req.user, review.user);

  review.title = req.body.title;
  review.rating = req.body.rating;
  review.comment = req.body.comment;

  await review.save();
  res.status(StatusCodes.OK).json(review);
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFoundError(`There is no review with id of ${reviewId}`);
  }

  //remove( is deprecated)
  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Deleted Review", review });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  const reviews = await Review.find({ product: productId });

  if (!product) {
    throw new NotFoundError("This product does not exists");
  }

  if (reviews.length === 0) {
    throw new NotFoundError(
      "There are no reviews associated with this product"
    );
  }

  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
};
