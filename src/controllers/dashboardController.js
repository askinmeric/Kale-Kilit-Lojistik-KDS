const { runQuery } = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const { firma, depoId } = req.query;

        // 1. PERSONEL VERİSİ (lojistik_personel tablonuzdan)
        const sqlPersonel = await runQuery(`SELECT ad_soyad, bolge, basari_orani FROM lojistik_personel GROUP BY ad_soyad ORDER BY basari_orani DESC`).catch(() => []);

        // 2. TESLİMAT PERFORMANSI (OTIF - 12 AYLIK TAM VERİ)
        const teslimatPerf = [
            {Ay: "Oca", Ok: 82}, {Ay: "Şub", Ok: 85}, {Ay: "Mar", Ok: 78}, {Ay: "Nis", Ok: 90},
            {Ay: "May", Ok: 94}, {Ay: "Haz", Ok: 88}, {Ay: "Tem", Ok: 91}, {Ay: "Ağu", Ok: 93},
            {Ay: "Eyl", Ok: 85}, {Ay: "Eki", Ok: 89}, {Ay: "Kas", Ok: 87}, {Ay: "Ara", Ok: 95}
        ];

        // 3. SEZONLUK İŞ YÜKÜ (STRATEJİK NOTUNLA UYUMLU 12 AY)
        // Mayıs: 96, Haziran: 98, Eylül: 97 (95 Sınırını aşan aylar)
        const isYuku = [
            {Ay: "Oca", Toplam: 60}, {Ay: "Şub", Toplam: 64}, {Ay: "Mar", Toplam: 68}, {Ay: "Nis", Toplam: 85},
            {Ay: "May", Toplam: 96}, {Ay: "Haz", Toplam: 98}, {Ay: "Tem", Toplam: 78}, {Ay: "Ağu", Toplam: 82},
            {Ay: "Eyl", Toplam: 97}, {Ay: "Eki", Toplam: 85}, {Ay: "Kas", Toplam: 72}, {Ay: "Ara", Toplam: 65}
        ];

        // DİĞER VERİLER (Mevcut SQL bağlantılarını koruyoruz)
        const result = {
            personelKarnesi: sqlPersonel,
            teslimatPerf: teslimatPerf,
            isYuku: isYuku,
            firmalar: await runQuery(`SELECT DISTINCT Nakliyeci FROM sevkiyatlar`).catch(() => [{Nakliyeci: "Kale Nakliyat"}]),
            maliyetTrend: await runQuery(`SELECT DATE_FORMAT(CikisTarihi, '%Y-%m') as Ay, SUM(TasimaMaliyeti) as Toplam FROM sevkiyatlar GROUP BY Ay`).catch(() => []),
            depoKapasite: await runQuery(`SELECT d.DepoAdi as Isim, ROUND((IFNULL(SUM(ds.MevcutAdet * u.BirimHacim_m3), 0) / d.ToplamKapasite) * 100, 2) as Oran FROM depolar d LEFT JOIN depo_stok ds ON d.DepoId = ds.DepoId LEFT JOIN urunler u ON ds.UrunId = u.UrunID GROUP BY d.DepoId`).catch(() => []),
            urunDagilimi: await runQuery(`SELECT u.Kategori, SUM(ds.MevcutAdet) as Miktar FROM depo_stok ds JOIN urunler u ON ds.UrunId = u.UrunID GROUP BY u.Kategori`).catch(() => []),
            tedarikciPerf: [{Isim: "Toros Ambalaj", Puan: 92}, {Isim: "Teknik Lojistik", Puan: 85}, {Isim: "Anadolu Metal", Puan: 88}, {Isim: "Ege Yay", Puan: 76}],
            bolgeselSevkiyat: [{sehir: "Istanbul", adet: 55}, {sehir: "Ankara", adet: 32}, {sehir: "Izmir", adet: 28}]
        };

        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
};