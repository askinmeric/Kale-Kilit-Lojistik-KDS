const { runQuery } = require('../config/db');

// 1. READ: Tüm personelleri listele
exports.getAllPersonel = async (req, res) => {
    try {
        const rows = await runQuery('SELECT * FROM lojistik_personel ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Liste çekilemedi' });
    }
};

// 2. CREATE: Yeni personel ekle (Senaryo 1 İçerir)
exports.addPersonel = async (req, res) => {
    const { ad_soyad, bolge, basari_orani, risk_puani } = req.body;

    // --- ÖZEL SENARYO 1: Risk Puanı Kontrolü ---
    // İş Kuralı: Risk puanı 100'den büyük bir personel sisteme kaydedilemez.
    if (risk_puani > 100) {
        return res.status(400).json({ error: 'HATA: Risk puanı 100 kritik sınırını aşamaz!' });
    }

    try {
        const sql = `INSERT INTO lojistik_personel (ad_soyad, bolge, basari_orani, risk_puani) VALUES (?, ?, ?, ?)`;
        await runQuery(sql, [ad_soyad, bolge, basari_orani, risk_puani]);
        res.status(201).json({ message: 'Personel başarıyla eklendi.' });
    } catch (error) {
        res.status(500).json({ error: 'Kayıt sırasında hata oluştu.' });
    }
};

// 3. DELETE: Personel sil (Senaryo 2 İçerir)
exports.deletePersonel = async (req, res) => {
    const { id } = req.params;

    try {
        // Önce personelin başarısını kontrol et
        const person = await runQuery('SELECT basari_orani FROM lojistik_personel WHERE id = ?', [id]);
        
        if (person.length === 0) return res.status(404).json({ error: 'Personel bulunamadı.' });

        // --- ÖZEL SENARYO 2: Başarılı Personel Koruma ---
        // İş Kuralı: Başarı oranı %100 olan "Altın Personel" sistemden silinemez.
        if (person[0].basari_orani >= 100) {
            return res.status(403).json({ error: 'HATA: %100 başarıya sahip kritik personel silinemez!' });
        }

        await runQuery('DELETE FROM lojistik_personel WHERE id = ?', [id]);
        res.json({ message: 'Personel silindi.' });
    } catch (error) {
        res.status(500).json({ error: 'Silme işlemi başarısız.' });
    }
};