const express = require('express');
const router = express.Router();
const bildirimController = require('../controllers/bildirimController');
router.get('/son', bildirimController.getSonBildirimler);
module.exports = router;