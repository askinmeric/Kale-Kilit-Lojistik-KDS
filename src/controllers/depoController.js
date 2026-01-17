// src/controllers/depoController.js

const { runQuery } = require('../config/db');

// Fonksiyonun başında "exports." olduğundan emin ol
exports.getDepoDurumu = async (req, res) => {
    try {
        const result = await runQuery("SELECT * FROM depolar");
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};