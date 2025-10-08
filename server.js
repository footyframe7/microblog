// server.js (BACKEND KODU)

const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000; // Sunucumuz 3000 numaralı portta çalışacak

// Middleware'ler (Yardımcı Fonksiyonlar)
app.use(cors()); // Frontend'den gelen istekleri kabul etmek için ZORUNLU
app.use(express.json()); // Gelen JSON verisini okuyabilmek için

// ÖRNEK TEST YOLU: Sunucunun çalışıp çalışmadığını kontrol etmek için
app.get('/api/test', (req, res) => {
    // BURAYA GEREKLİ API MANTIĞI EKLENECEKTİR
    res.json({ message: "Backend çalışıyor! Bağlantı başarılı." });
});

// Sunucuyu Başlat
app.listen(port, () => {
    console.log(`Backend sunucusu http://localhost:${port} adresinde çalışıyor...`);
});