const db = require('../config/db');

const Sevkiyat = {
    ekle: async (veri) => {
        const { depo_id, tedarikci_id, miktar } = veri;
        const [sonuc] = await db.query(
            "INSERT INTO sevkiyatlar (depo_id, tedarikci_id, miktar) VALUES (?, ?, ?)",
            [depo_id, tedarikci_id, miktar]
        );
        return sonuc.insertId;
    },
    depoBilgisiGetir: async (id) => {
        const [satirlar] = await db.query("SELECT * FROM depolar WHERE id = ?", [id]);
        return satirlar[0];
    },
    tedarikciBilgisiGetir: async (id) => {
        const [satirlar] = await db.query("SELECT * FROM tedarikciler WHERE id = ?", [id]);
        return satirlar[0];
    }
};

module.exports = Sevkiyat;