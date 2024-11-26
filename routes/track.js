const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const authenticateToken = require('../middleware/authen');

router.post('/yield-tracking',authenticateToken,trackController.createYield);

router.get('/yield-tracking',authenticateToken,trackController.getYield);

module.exports = router;