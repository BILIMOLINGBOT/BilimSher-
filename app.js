// .env fayldan konfiguratsiyalarni o'qish uchun
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Middleware lar
app.use(cors());
app.use(express.json());

// .env dan o'qilgan token va port
const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

// Telegram foydalanuvchining profil rasm URL sini olish endpointi
app.post('/getUserPhoto', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId kerak' });
    }

    // Telegram API dan user profile photos olish
    const photosResponse = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos`,
      { params: { user_id: userId, limit: 1 } }
    );

    if (!photosResponse.data.ok || photosResponse.data.result.total_count === 0) {
      return res.json({ photoUrl: null }); // Profil rasmi yo'q
    }

    // Birinchi rasmning file_id sini olish
    const fileId = photosResponse.data.result.photos[0][0].file_id;

    // File path olish
    const fileResponse = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile`,
      { params: { file_id: fileId } }
    );

    if (!fileResponse.data.ok) {
      return res.json({ photoUrl: null });
    }

    const filePath = fileResponse.data.result.file_path;

    // To'liq rasm URL sini yaratish
    const photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    // Frontendga yuborish
    res.json({ photoUrl });

  } catch (error) {
    console.error('Xato:', error.message);
    res.status(500).json({ error: 'Serverda xato yuz berdi' });
  }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi`);
});