require('dotenv').config(); // .env faylni o‘qish uchun

const express = require('express');
const fetch = require('node-fetch');
const app = express();

const BOT_TOKEN = process.env.BOT_TOKEN; // .env dan o‘qiladi

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN .env faylida aniqlanmagan!');
  process.exit(1);
}

app.get('/profile-photo', async (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'user_id kerak' });
  }

  try {
    const photoRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${userId}&limit=1`);
    const photoData = await photoRes.json();

    if (!photoData.ok || photoData.result.total_count === 0) {
      return res.json({ message: 'Rasm topilmadi' });
    }

    const fileId = photoData.result.photos[0][0].file_id;

    const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileRes.json();

    if (!fileData.ok) {
      return res.json({ message: 'Fayl topilmadi' });
    }

    const filePath = fileData.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    res.json({ file_url: fileUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

app.listen(3000, () => {
  console.log('Server http://localhost:3000 da ishga tushdi');
});