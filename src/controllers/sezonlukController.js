const { runQuery } = require('../config/db');

// Sezonluk iş yükü
const getSezonluk = async (req, res) => {
  try {
    const { start = '2024-01-01', end = '2025-12-31' } = req.query;
    
    const data = await runQuery(
      `SELECT DATE_FORMAT(CikisTarihi, '%Y-%m') AS Ay,
              COUNT(*) AS IsYuku
       FROM sevkiyatlar
       WHERE CikisTarihi BETWEEN ? AND ?
       GROUP BY Ay
       ORDER BY Ay`,
      [start, end]
    );
    
    // Ay isimlerini ekle
    const ayIsimleri = {
      '01': 'Ocak', '02': 'Şubat', '03': 'Mart', '04': 'Nisan',
      '05': 'Mayıs', '06': 'Haziran', '07': 'Temmuz', '08': 'Ağustos',
      '09': 'Eylül', '10': 'Ekim', '11': 'Kasım', '12': 'Aralık'
    };
    
    const formattedData = data.map(item => {
      const [yil, ay] = item.Ay.split('-');
      return {
        ...item,
        AyIsmi: `${ayIsimleri[ay]} ${yil}`
      };
    });
    
    res.json(formattedData);
  } catch (error) {
    console.error('Sezonluk error:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
};

// İş yükü sezonluk (sevkiyat + mal kabul)
const getIsyukuSezonluk = async (req, res) => {
  try {
    const data = await runQuery(
      `SELECT Ay,
              SUM(IslemSayisi) AS ToplamIslem
       FROM (
         SELECT DATE_FORMAT(CikisTarihi, '%Y-%m') AS Ay, COUNT(*) AS IslemSayisi
         FROM sevkiyatlar
         WHERE CikisTarihi IS NOT NULL
         GROUP BY DATE_FORMAT(CikisTarihi, '%Y-%m')
         UNION ALL
         SELECT DATE_FORMAT(Tarih, '%Y-%m') AS Ay, COUNT(*) AS IslemSayisi
         FROM mal_kabul
         WHERE Tarih IS NOT NULL
         GROUP BY DATE_FORMAT(Tarih, '%Y-%m')
       ) AS combined
       GROUP BY Ay
       ORDER BY Ay ASC`
    );
    
    res.json(data);
  } catch (error) {
    console.error('İş yükü sezonluk error:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
};

module.exports = {
  getSezonluk,
  getIsyukuSezonluk
};

