// server.js (BACKEND KODU - MONGODB BAĞLANTISI GÜNCEL)

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000; // Render'ın PORT'unu kullan

// !!! KENDİ BAĞLANTI ADRESİNİZ (ŞİFRE YOK) !!!
const MONGO_URI = `mongodb+srv://footyframe7:${process.env.MONGO_PASSWORD}@footyframe7.ghw9c2z.mongodb.net/microblogDB?retryWrites=true&w=majority&appName=footyframe7`;

// MongoDB Bağlantısı
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı.'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));


// **********************************************
// MONGODB POST MODELİ
// **********************************************
const PostSchema = new mongoose.Schema({
    authorName: String,
    authorHandle: String,
    authorAvatar: String,
    content: { type: String, required: true },
    timestamp: { type: String, default: new Date().toLocaleString('tr-TR') },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    isLiked: { type: Boolean, default: false }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);


// Middleware'ler
app.use(cors()); 
app.use(express.json()); 


// Render'ın ana sayfa (/) isteğini karşıla (HATA ÇÖZÜMÜ)
app.get('/', (req, res) => {
    res.send('Microblog Backend API is Running! Use /api/posts to access data.');
});


// **********************************************
// API YOLLARI (ROUTES)
// **********************************************

// 1. Tüm gönderileri getir (GET)
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // En yeniyi en üste getir
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Veri tabanından veri çekilemedi." });
    }
});

// 2. Yeni gönderi ekle (POST)
app.post('/api/posts', async (req, res) => {
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: "Gönderi kaydedilemedi." });
    }
});

// 3. Gönderiyi sil (DELETE)
app.delete('/api/posts/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: "Gönderi silinemedi." });
    }
});

// 4. Beğeniyi değiştir (POST / LIKE)
app.post('/api/posts/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post bulunamadı.' });

        post.isLiked = !post.isLiked;
        post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;

        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: "Beğeni güncellenemedi." });
    }
});

// Sunucuyu Başlat
app.listen(port, () => {
    console.log(`Backend sunucusu http://localhost:${port} adresinde çalışıyor...`);
});