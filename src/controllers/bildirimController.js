const { runQuery } = require('../config/db');

exports.getSonBildirimler = async (req, res) => {
    try {
        const data = await runQuery(
            `SELECT Baslik, Mesaj, Tarih, Öncelik 
             FROM bildirimler 
             ORDER BY Tarih DESC LIMIT 5`
        );
        res.json(data);
    } catch (error) {
        console.error("Bildirim Sorgu Hatası:", error);
        res.status(500).json({ error: 'Bildirimler alınamadı' });
    }
};