const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getSingleProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controllers/productController');

router.route('/').get(getAllProducts).post(createProduct);
router.route('/uploadImage').post(uploadImage);
router.route('/:id').get(getSingleProducts).put(updateProduct).delete(deleteProduct);

module.exports = router;