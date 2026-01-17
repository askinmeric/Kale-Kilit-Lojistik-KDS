const express = require('express');
const router = express.Router();
const sevkiyatController = require('../controllers/sevkiyatController');

router.post('/ekle', sevkiyatController.sevkiyatOlustur);

module.exports = router;