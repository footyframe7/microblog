// server.js (BACKEND KODU)

const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000; 

// Middleware'ler (Yardımcı Fonksiyonlar)
app.use(cors()); 
app.use(express.json()); 

// **********************************************
// ÖNEMLİ: TEST AMAÇLI STATİK VERİ DİZİSİ
// Bu, MongoDB kurulana kadar geçici verimizdir.
// **********************************************
let testData = [
    { _id: 'test_1', authorName: 'Sistem', authorHandle: '@admin', authorAvatar: 'https://i.ibb.co/L9H8bXJ/default-avatar.png', content: 'Render sunucusu BAĞLANDI! Artık internetten veri çekiyoruz.', timestamp: new Date().toLocaleString('tr-TR'), likes: 0, comments: 0, isLiked: false },
];


// Render'ın ana sayfa (/) isteğini karşıla (HATA ÇÖZÜMÜ)
app.get('/', (req, res) => {
    res.send('Microblog Backend API is Running! Use /api/posts to access data.');
});

// **********************************************
// API YOLLARI (ROUTES)
// **********************************************

// Tüm gönderileri getir (GET)
app.get('/api/posts', (req, res) => {
    res.json(testData);
});

// Yeni gönderi ekle (POST)
app.post('/api/posts', (req, res) => {
    const newPost = {
        _id: Date.now().toString(),
        authorName: req.body.authorName || 'Anonim',
        authorHandle: req.body.authorHandle || '@anonim',
        authorAvatar: req.body.authorAvatar || 'https://i.ibb.co/L9H8bXJ/default-avatar.png',
        content: req.body.content,
        timestamp: new Date().toLocaleString('tr-TR'),
        likes: 0,
        comments: 0,
        isLiked: false
    };
    testData.push(newPost);
    res.status(201).json(newPost);
});

// Sunucuyu Başlat
app.listen(port, () => {
    console.log(`Backend sunucusu http://localhost:${port} adresinde çalışıyor...`);
});