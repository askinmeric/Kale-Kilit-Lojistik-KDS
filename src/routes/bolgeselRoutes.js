const express = require('express');
const router = express.Router();
const {
  getBolgesel,
  getHaritaKPI,
  getHaritaFlow
} = require('../controllers/bolgeselController');

// Root path için hem / hem de boş string kabul et
router.get('/', getBolgesel);
router.get('', getBolgesel);
router.get('/kpi', getHaritaKPI);
router.get('/flow', getHaritaFlow);

module.exports = router;

