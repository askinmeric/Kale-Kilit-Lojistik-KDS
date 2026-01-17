# Kale Kilit Lojistik Karar Destek Sistemi (KDS)

Bu proje, bir lojistik firmasının operasyonel verilerini yönetmek ve stratejik kararlar almasını sağlamak amacıyla geliştirilmiş bir **RESTful API** uygulamasıdır.

## 🛠️ Teknik Özellikler
- **Mimari:** Katı MVC (Model-View-Controller)
- **Backend:** Node.js (Express)
- **Frontend:** EJS, Bootstrap, Chart.js, Leaflet.js
- **Veritabanı:** MySQL (WampServer)

## 🚀 İş Kuralları (Özel Senaryolar)
1. **Risk Sınırı:** Bir personelin risk puanı 100 birimi aşamaz. Aksi takdirde sistem kayıt işlemini reddeder.
2. **Altın Personel Koruması:** %100 başarı oranına sahip personeller stratejik öneme sahip olduğu için sistemden silinemez.

## 📡 API Endpoints (Uç Noktalar)
- `GET /api/personel`: Tüm personelleri listeler.
- `POST /api/personel`: Yeni personel kaydı oluşturur.
- `DELETE /api/personel/:id`: Personel kaydını siler.
- `GET /api/dashboard/all-stats`: Grafik verilerini döndürür.

## ⚙️ Kurulum
1. `npm install` komutu ile bağımlılıkları yükleyin.
2. `.env.example` dosyasını `.env` olarak kopyalayın ve bilgilerinizi girin.
3. `node app.js` ile sunucuyu başlatın.