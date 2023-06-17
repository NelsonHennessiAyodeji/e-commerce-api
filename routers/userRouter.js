const express = require('express');
const router = express();
const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
} = require('../controllers/userController');

router.route('/').get(getAllUsers);
router.route('/showMe').get(showCurrentUser);
router.route('/updateUser').put(updateUser);
router.route('/updateUserPassword').put(updateUserPassword);
router.route('/:id').get(getSingleUser);

module.exports = router;