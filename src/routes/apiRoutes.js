const express = require('express');
const router = express.Router();
const personelController = require('../controllers/personelController');
const dashboardController = require('../controllers/dashboardController');

// Dashboard verileri için (Mevcut grafik verilerin)
router.get('/dashboard/all-stats', dashboardController.getDashboardStats);

// PERSONEL CRUD İŞLEMLERİ (RESTful standartlarında)
router.get('/personel', personelController.getAllPersonel);      // Listeleme (READ)
router.post('/personel', personelController.addPersonel);        // Ekleme (CREATE)
router.delete('/personel/:id', personelController.deletePersonel); // Silme (DELETE)

module.exports = router;