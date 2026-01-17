const db = require('../config/db');

const Depo = {
    tumunuGetir: async () => {
        const [satirlar] = await db.query("SELECT * FROM depolar");
        return satirlar;
    },
    dolulukGuncelle: async (id, yeniOran) => {
        return db.query("UPDATE depolar SET doluluk_orani = ? WHERE id = ?", [yeniOran, id]);
    }
};

module.exports = Depo;