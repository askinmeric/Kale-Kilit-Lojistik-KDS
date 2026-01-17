// src/routes/depoRoutes.js
const express = require('express');
const router = express.Router();
// Controller'ı bu şekilde içe aktardığından emin ol
const depoController = require('../controllers/depoController');

// HATA BURADAYDI: depoController içindeki fonksiyonun adını kontrol et
router.get('/', depoController.getDepoDurumu); 

module.exports = router;