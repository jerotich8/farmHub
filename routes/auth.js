const express = require ('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authen');

router.post('/register',authController.registerFarmer);

router.post ('/login', authController.loginFarmer);

router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;