const db = require('../config/db');

const Tedarikci = {
    tumunuGetir: async () => {
        const [satirlar] = await db.query("SELECT * FROM tedarikciler");
        return satirlar;
    }
};

module.exports = Tedarikci;