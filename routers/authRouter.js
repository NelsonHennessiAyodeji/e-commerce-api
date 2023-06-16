const express = require('express');
const router = express.Router();

router.get('./register', register);
router.get('/login', login);
router.get('/logout', logout);

module.exports = router;
