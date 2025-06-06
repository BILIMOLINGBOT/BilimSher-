const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const BOT_TOKEN = 'SIZNING_BOT_TOKENINGIZ_HOZIR_BU YERGA_QO\'YING';

// Profil rasm olish endpointi
app.post('/getUserPhoto', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'userId kerak' });

    // 1. User profil rasm ma'lumotlarini olish
    const photosResponse = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos`,
      { params: { user_id: userId, limit: 1 } }
    );

    if (!photosResponse.data.ok || photosResponse.data.result.total_count === 0) {
      return res.json({ photoUrl: null });  // Profil rasmi yo'q
    }

    // 2. Birinchi profil rasmning file_id sini olish
    // (photos[0][0] - eng kichik o'lchamdagi rasm)
    const fileId = photosResponse.data.result.photos[0][0].file_id;

    // 3. File path olish
    const fileResponse = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile`,
      { params: { file_id: fileId } }
    );

    if (!fileResponse.data.ok) {
      return res.json({ photoUrl: null });
    }

    const filePath = fileResponse.data.result.file_path;

    // 4. To'liq URL yaratish
    const photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    // 5. Frontendga URL ni yuborish
    res.json({ photoUrl });

  } catch (error) {
    console.error('Xato:', error.message);
    res.status(500).json({ error: 'Serverda xato yuz berdi' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi`);
});