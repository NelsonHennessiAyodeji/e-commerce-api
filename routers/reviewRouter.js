const express = require('express');
const router = express.Router();
const {
    getAllReviews,
    getSingleReview,
    createReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

router.route('/').get(getAllReviews).post(authenticateUser, createReview);
router.route('/:id').get(getSingleReview).put(authenticateUser, updateReview).delete(authenticateUser, deleteReview);

module.exports = router;