const express = require('express');
const router = express.Router();
const maliyetController = require('../controllers/maliyetController');

// 7. satır: maliyetController içindeki ismin birebir aynısı olmalı
router.get('/trend', maliyetController.getMaliyetTrend);
router.get('/karsilastir', maliyetController.getMaliyetKarsilastir);

module.exports = router;
