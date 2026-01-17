const express = require('express');
const router = express.Router();
const personelController = require('../controllers/personelController');
router.get('/analiz', personelController.getPersonelAnalizi);
module.exports = router;