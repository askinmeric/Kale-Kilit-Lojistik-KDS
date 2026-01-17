const express = require('express');
const router = express.Router();
const {
  getOluStok,
  getStokYaslandirma,
  getStokYaslandirmaDetay,
  getStokUrunListesi
} = require('../controllers/olustokController');

// Root path için hem / hem de boş string kabul et
router.get('/', getOluStok);
router.get('', getOluStok);
router.get('/yaslandirma', getStokYaslandirma);
router.get('/yaslandirma-detay', getStokYaslandirmaDetay);
router.get('/urun-listesi', getStokUrunListesi);

module.exports = router;

