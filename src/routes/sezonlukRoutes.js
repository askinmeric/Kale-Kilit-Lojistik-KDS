const express = require('express');
const router = express.Router();
const {
  getSezonluk,
  getIsyukuSezonluk
} = require('../controllers/sezonlukController');

// Root path için hem / hem de boş string kabul et
router.get('/', getSezonluk);
router.get('', getSezonluk);
router.get('/isyuku', getIsyukuSezonluk);

module.exports = router;

