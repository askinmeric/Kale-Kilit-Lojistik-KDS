const express = require('express');
const router = express.Router();
const {
  getTeslimatTrend,
  getTeslimatKPI,
  getOtifDetay
} = require('../controllers/otifController');

router.get('/trend', getTeslimatTrend);
router.get('/kpi', getTeslimatKPI);
router.get('/detay', getOtifDetay);

module.exports = router;

