const { runQuery } = require('../config/db');

// Teslimat trendi (OTIF)
const getTeslimatTrend = async (req, res) => {
  try {
    const { start = '2024-01-01', end = '2025-12-31' } = req.query;
    
    const data = await runQuery(
      `SELECT DATE_FORMAT(s.CikisTarihi, '%Y-%m') AS Ay,
              COUNT(*) AS ToplamSevkiyat,
              SUM(CASE WHEN s.TeslimatDurumu IN ('Tam Zamanında', 'Zamanında')
                       AND s.Durum IN ('Tamamlandı', 'Teslim Edildi')
                  THEN 1 ELSE 0 END) AS BasariliTeslimat
       FROM sevkiyatlar s
       WHERE s.CikisTarihi BETWEEN ? AND ?
       GROUP BY Ay
       ORDER BY Ay`,
      [start, end]
    );
    
    res.json(data);
  } catch (error) {
    console.error('Teslimat trend error:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
};

// Teslimat KPI
const getTeslimatKPI = async (req, res) => {
  try {
    const { start = '2024-01-01', end = '2025-12-31' } = req.query;
    
    const data = await runQuery(
      `SELECT
         (SELECT COUNT(*) FROM sevkiyatlar WHERE CikisTarihi BETWEEN ? AND ?) AS SimdiToplam,
         (SELECT SUM(CASE WHEN TeslimatDurumu IN ('Tam Zamanında', 'Zamanında')
                      AND Durum IN ('Tamamlandı', 'Teslim Edildi')
                 THEN 1 ELSE 0 END)
          FROM sevkiyatlar WHERE CikisTarihi BETWEEN ? AND ?) AS SimdiBasarili,
         (SELECT COUNT(*) FROM sevkiyatlar
          WHERE CikisTarihi BETWEEN DATE_SUB(?, INTERVAL DATEDIFF(?, ?) + 1 DAY)
            AND DATE_SUB(?, INTERVAL 1 DAY)) AS OnceToplam,
         (SELECT SUM(CASE WHEN TeslimatDurumu IN ('Tam Zamanında', 'Zamanında')
                      AND Durum IN ('Tamamlandı', 'Teslim Edildi')
                 THEN 1 ELSE 0 END)
          FROM sevkiyatlar
          WHERE CikisTarihi BETWEEN DATE_SUB(?, INTERVAL DATEDIFF(?, ?) + 1 DAY)
            AND DATE_SUB(?, INTERVAL 1 DAY)) AS OnceBasarili`,
      [start, end, start, end, start, end, start, start, start, end, start, start]
    );
    
    res.json(data);
  } catch (error) {
    console.error('Teslimat KPI error:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
};

// OTIF detay (kırılım)
const getOtifDetay = async (req, res) => {
  try {
    const { start = '2024-01-01', end = '2025-12-31' } = req.query;
    
    const data = await runQuery(
      `SELECT DATE_FORMAT(s.CikisTarihi, '%Y-%m') AS Donem,
              COUNT(*) AS Toplam,
              SUM(CASE WHEN s.TeslimatDurumu IN ('Tam Zamanında', 'Zamanında')
                       AND s.Durum IN ('Tamamlandı', 'Teslim Edildi')
                       AND (s.HasarDurumu IS NULL OR s.HasarDurumu = 'Yok')
                  THEN 1 ELSE 0 END) AS ZamanindaTam,
              SUM(CASE WHEN s.GecikmeGun > 0 THEN 1 ELSE 0 END) AS Gecikmeli,
              SUM(CASE WHEN s.HasarDurumu = 'Var' THEN 1 ELSE 0 END) AS Hasarli,
              SUM(CASE WHEN s.EvrakDurumu = 'Eksik' THEN 1 ELSE 0 END) AS EvrakEksik
       FROM sevkiyatlar s
       WHERE s.CikisTarihi BETWEEN ? AND ?
       GROUP BY Donem
       ORDER BY Donem`,
      [start, end]
    );
    
    res.json(data);
  } catch (error) {
    console.error('OTIF detay error:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
};

module.exports = {
  getTeslimatTrend,
  getTeslimatKPI,
  getOtifDetay
};

