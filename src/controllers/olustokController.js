const { runQuery, pool } = require('../config/db');

// Ölü stoklar (90+ gün)
const getOluStok = async (req, res) => {
  try {
    const data = await runQuery(
      `SELECT u.UrunAdi,
              d.DepoAdi,
              ds.MevcutAdet,
              DATE_FORMAT(ds.SonIslemTarihi, '%Y-%m-%d') AS SonIslemTarihi,
              DATEDIFF(NOW(), ds.SonIslemTarihi) AS BeklemeSuresi
       FROM depo_stok ds
       JOIN urunler u ON u.UrunID = ds.UrunID
       JOIN depolar d ON d.DepoID = ds.DepoID
       WHERE ds.MevcutAdet > 0
         AND DATEDIFF(NOW(), ds.SonIslemTarihi) >= 90
       ORDER BY BeklemeSuresi DESC
       LIMIT 100`
    );
    
    res.json(data);
  } catch (error) {
    console.error('Ölü stok error:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
};

// Stok yaşlandırma
const getStokYaslandirma = async (req, res) => {
  try {
    const stokDepoId = Number(req.query.stok_depo_id || 0);
    let filter = '';
    if (stokDepoId > 0) {
      filter = `AND s.DepoID = ${pool.escape(stokDepoId)}`;
    }
    
    const data = await runQuery(
      `SELECT CASE
                WHEN DATEDIFF(NOW(), s.SonIslemTarihi) > 180 THEN 'Tehlikeli Stok (>180 gün)'
                WHEN DATEDIFF(NOW(), s.SonIslemTarihi) > 90 THEN 'Yavaşlayan Stok (90-180 gün)'
                ELSE 'Hareketli Stok (<90 gün)'
              END AS Durum,
              SUM(s.MevcutAdet) AS ToplamAdet
       FROM depo_stok s
       WHERE s.MevcutAdet > 0 ${filter}
       GROUP BY Durum
       ORDER BY FIELD(Durum,
         'Hareketli Stok (<90 gün)', 'Yavaşlayan Stok (90-180 gün)', 'Tehlikeli Stok (>180 gün)')`
    );
    
    res.json(data);
  } catch (error) {
    console.error('Stok yaşlandırma error:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
};

// Stok yaşlandırma detay
const getStokYaslandirmaDetay = async (req, res) => {
  try {
    const { kategori = '180+', depo = '' } = req.query;
    let cond = '> 180';
    if (kategori === '0-90') cond = 'BETWEEN 0 AND 90';
    else if (kategori === '91-180') cond = 'BETWEEN 91 AND 180';
    
    let depoFilterStok = '';
    if (depo) {
      depoFilterStok = `AND d.DepoAdi = ${pool.escape(depo)}`;
    }
    
    const data = await runQuery(
      `SELECT u.UrunAdi,
              d.DepoAdi,
              s.MevcutAdet,
              DATE_FORMAT(s.GirisTarihi, '%Y-%m-%d') AS GirisTarihi,
              DATEDIFF(NOW(), s.GirisTarihi) AS BeklemeGun,
              (s.MevcutAdet * IFNULL(u.BirimFiyat,0)) AS StokDegeri
       FROM depo_stok s
       JOIN urunler u ON s.UrunID = u.UrunID
       JOIN depolar d ON s.DepoID = d.DepoID
       WHERE s.MevcutAdet > 0
         AND DATEDIFF(NOW(), s.GirisTarihi) ${cond} ${depoFilterStok}
       ORDER BY StokDegeri DESC`
    );
    
    res.json(data);
  } catch (error) {
    console.error('Stok yaşlandırma detay error:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
};

// Stok ürün listesi
const getStokUrunListesi = async (req, res) => {
  try {
    const stokDepoId = Number(req.query.stok_depo_id || 0);
    let filter = '';
    if (stokDepoId > 0) {
      filter = `AND ds.DepoID = ${pool.escape(stokDepoId)}`;
    }
    
    const data = await runQuery(
      `SELECT u.UrunAdi,
              d.DepoAdi,
              ds.MevcutAdet,
              DATEDIFF(NOW(), ds.SonIslemTarihi) AS BeklemeGun,
              CASE
                WHEN DATEDIFF(NOW(), ds.SonIslemTarihi) > 180 THEN 'Tehlikeli'
                WHEN DATEDIFF(NOW(), ds.SonIslemTarihi) > 90 THEN 'Yavaşlayan'
                ELSE 'Hareketli'
              END AS Durum
       FROM depo_stok ds
       JOIN urunler u ON ds.UrunID = u.UrunID
       JOIN depolar d ON ds.DepoID = d.DepoID
       WHERE ds.MevcutAdet > 0 ${filter}
       ORDER BY BeklemeGun DESC
       LIMIT 10`
    );
    
    res.json(data);
  } catch (error) {
    console.error('Stok ürün listesi error:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
};

module.exports = {
  getOluStok,
  getStokYaslandirma,
  getStokYaslandirmaDetay,
  getStokUrunListesi
};

