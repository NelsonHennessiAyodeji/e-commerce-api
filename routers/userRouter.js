const express = require('express');
const router = express();
const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication');
const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
} = require('../controllers/userController');

router.route('/').get(authenticateUser, authorizePermissions, getAllUsers);
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').put(authenticateUser, authorizePermissions, updateUser);
router.route('/updateUserPassword').put(authenticateUser, updateUserPassword);
router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;