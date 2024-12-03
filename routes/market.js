const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');


router.get('/market', marketController.getPrices);

router.get('/market/search',marketController.searchPrices);

module.exports = router;
