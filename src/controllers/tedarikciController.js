const { runQuery } = require('../config/db');

exports.getTedarikciMatrix = async (req, res) => {
    try {
        const data = await runQuery(
            `SELECT 
                t.FirmaAdi,
                AVG(mk.GecikmeGun) AS OrtalamaGecikme,
                AVG(mk.KusurluOrani) AS OrtalamaKusur
             FROM tedarikciler t
             LEFT JOIN mal_kabul mk ON t.TedarikciID = mk.TedarikciId
             GROUP BY t.TedarikciID, t.FirmaAdi`
        );
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};