const { runQuery } = require('../config/db');

const getBolgesel = async (req, res) => {
  try {
    const { start = '2024-01-01', end = '2025-12-31' } = req.query;
    
    const data = await runQuery(
      `SELECT s.VarisSehri AS Sehir, COUNT(*) AS SevkiyatSayisi
       FROM sevkiyatlar s
       WHERE s.CikisTarihi BETWEEN ? AND ?
       GROUP BY s.VarisSehri`,
      [start, end]
    );
    
    res.json(data);
  } catch (error) {
    console.error('Bölgesel error:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
};


const getHaritaKPI = async (req, res) => {
  try {
    const { start = '2024-01-01', end = '2025-12-31' } = req.query;
    
    const data = await runQuery(
      `SELECT
         (SELECT COUNT(*) FROM sevkiyatlar s1 WHERE s1.CikisTarihi BETWEEN ? AND ?) AS Simdi,
         (SELECT COUNT(*) FROM sevkiyatlar s2
          WHERE s2.CikisTarihi BETWEEN DATE_SUB(?, INTERVAL DATEDIFF(?, ?) + 1 DAY)
            AND DATE_SUB(?, INTERVAL 1 DAY)) AS Once`,
      [start, end, start, end, start, start]
    );
    
    res.json(data);
  } catch (error) {
    console.error('Harita KPI error:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
};


const getHaritaFlow = async (req, res) => {
  try {
    const { start = '2024-01-01', end = '2025-12-31' } = req.query;
    
    const data = await runQuery(
      `SELECT d.DepoAdi AS CikisDepo,
              d.Enlem AS DepoEnlem,
              d.Boylam AS DepoBoylam,
              s.VarisSehri,
              COALESCE(s.SehirEnlem, 39.0) AS SehirEnlem,
              COALESCE(s.SehirBoylam, 35.0) AS SehirBoylam,
              COUNT(*) AS Hacim,
              ROUND(
                (SUM(CASE WHEN s.GecikmeGun > 0 OR s.HasarDurumu = 'Var' THEN 1 ELSE 0 END) / COUNT(*)) * 100,
                2
              ) AS RiskOrani
       FROM sevkiyatlar s
       JOIN depolar d ON s.CikisDepoID = d.DepoID
       WHERE s.CikisTarihi BETWEEN ? AND ?
       GROUP BY d.DepoAdi, d.Enlem, d.Boylam, s.VarisSehri, s.SehirEnlem, s.SehirBoylam
       HAVING COUNT(*) >= 5
       ORDER BY Hacim DESC`,
      [start, end]
    );
    
    res.json(data);
  } catch (error) {
    console.error('Harita flow error:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
};

module.exports = {
  getBolgesel,
  getHaritaKPI,
  getHaritaFlow
};

