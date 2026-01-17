const express = require('express');
const router = express.Router();
const tedarikciController = require('../controllers/tedarikciController');

// 'getTedarikciMatrix' isminin controller ile aynı olduğundan emin oluyoruz
router.get('/matrix', tedarikciController.getTedarikciMatrix);

module.exports = router;