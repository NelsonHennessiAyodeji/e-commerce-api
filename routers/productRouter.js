const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getSingleProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

router.route('/').get(getAllProducts).post(createProduct);
router.route('/:id').get(getSingleProducts).put(updateProduct).delete(deleteProduct);

module.exports = router;