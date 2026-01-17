const db = require('../config/db');

const Maliyet = {
    aylikMaliyetleriGetir: async () => {
        const [satirlar] = await db.query("SELECT ay, toplam_maliyet FROM tasima_maliyetleri ORDER BY ay ASC");
        return satirlar;
    }
};

module.exports = Maliyet;