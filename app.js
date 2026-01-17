/**
 * KALE KİLİT LOJİSTİK KDS - ANA SUNUCU DOSYASI
 * Sunucu Tabanlı Programlama - MVC Mimarisi ve RESTful API Tasarımı
 */

require('dotenv').config(); // .env dosyasındaki değişkenleri yükle
const express = require('express');
const path = require('path');
const app = express();

// 1. GÖRÜNÜM MOTORU (VIEW ENGINE) AYARLARI
// Klasör yapındaki (310) konuma göre 'views' ana dizindedir
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. ARA YAZILIMLAR (MIDDLEWARES)
app.use(express.json()); // JSON formatındaki API isteklerini okumak için
app.use(express.urlencoded({ extended: true })); // Form verilerini okumak için
app.use(express.static(path.join(__dirname, 'public'))); // CSS ve JS dosyaları için

// 3. ROTA (ROUTE) TANIMLAMALARI
// API uç noktaları MVC standartlarına göre src/routes/apiRoutes.js dosyasındadır
const apiRoutes = require('./src/routes/apiRoutes');
app.use('/api', apiRoutes);

// 4. SAYFA YÖNLENDİRMELERİ (MVC VIEWS)
// Kullanıcı arayüzü sayfalarını burada render ediyoruz
app.get('/', (req, res) => res.render('index'));
app.get('/maliyet-trendi', (req, res) => res.render('maliyet'));
app.get('/depo-kapasite', (req, res) => res.render('depo-durumu'));
app.get('/tedarikci-analizi', (req, res) => res.render('tedarikci'));
app.get('/teslimat-performansi', (req, res) => res.render('teslimat'));
app.get('/sezonluk-is-yuku', (req, res) => res.render('is-yuku'));

// CRUD İşlemleri için Personel Yönetim Sayfası
app.get('/personel-yonetimi', (req, res) => res.render('personel-yonetimi'));

// 5. HATA YÖNETİMİ (404 Not Found)
app.use((req, res) => {
    res.status(404).render('index', { error: 'Aradığınız sayfa bulunamadı.' });
});

// 6. SUNUCUYU BAŞLAT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`KALE KİLİT LOJİSTİK KDS AKTİF`);
    console.log(`Sunucu http://localhost:${PORT} portunda çalışıyor...`);
    console.log(`MVC Mimarisi ve REST API Hazır.`);
    console.log(`===========================================`);
});