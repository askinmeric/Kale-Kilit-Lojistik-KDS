const { runQuery } = require('../config/db');

exports.getMaliyetTrend = async (req, res) => {
    try {
        const data = await runQuery(
            `SELECT 
                DATE_FORMAT(CikisTarihi, '%Y-%m') AS Ay,
                SUM(TasimaMaliyeti) AS ToplamMaliyet,
                AVG(TasimaMaliyeti) AS OrtalamaMaliyet
             FROM sevkiyatlar
             GROUP BY Ay
             ORDER BY Ay ASC`
        );
        res.json(data);
    } catch (error) {
        console.error("Maliyet Sorgu Hatası:", error);
        res.status(500).json({ error: 'Sunucu hatası', details: error.message });
    }
};

exports.getMaliyetKarsilastir = async (req, res) => {
    try {
        const { start, end } = req.query;
        const data = await runQuery(
            `SELECT 
                DATE_FORMAT(CikisTarihi, '%Y-%m') AS Ay,
                SUM(TasimaMaliyeti) AS Maliyet
             FROM sevkiyatlar
             WHERE CikisTarihi BETWEEN ? AND ?
             GROUP BY Ay`,
            [`${start}-01`, `${end}-31`]
        );
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};