const Sevkiyat = require('../models/sevkiyatModel');

exports.sevkiyatOlustur = async (req, res) => {
    const { depo_id, tedarikci_id, miktar } = req.body;

    try {
        const depo = await Sevkiyat.depoBilgisiGetir(depo_id);
        const tedarikci = await Sevkiyat.tedarikciBilgisiGetir(tedarikci_id);

        if (depo.doluluk_orani + miktar > 80) {
            return res.status(400).json({ 
                hata: "SENARYO 1: Depo doluluk orani %80 limitini astigi icin sevkiyat reddedildi." 
            });
        }

        if (tedarikci.puan < 50) {
            return res.status(400).json({ 
                hata: "SENARYO 2: Tedarikci performans puani riskli (%50 alti) oldugu icin islem reddedildi." 
            });
        }

        const yeniId = await Sevkiyat.ekle(req.body);
        res.status(201).json({ mesaj: "Sevkiyat basariyla eklendi", id: yeniId });

    } catch (error) {
        res.status(500).json({ hata: error.message });
    }
};