const express = require('express');  
const axios = require('axios');  
const cors = require('cors');  
  
const app = express();  
const PORT = process.env.PORT || 3000;  
  
// Bu yerga o'zingizning haqiqiy bot tokeningizni qo'ying
const BOT_TOKEN = '7862555162:AAGpCSy47LVQxeZNHI_U5Sz93Q6ss2oY15Q';  
  
// Middleware  
app.use(cors()); // Frontend boshqa domen/portda bo'lsa kerak bo'ladi  
app.use(express.json());  
  
// Oddiy test uchun root endpoint  
app.get('/', (req, res) => {  
  res.send('Telegram Mini App backend ishlayapti');  
});  
  
// Telegram bot orqali foydalanuvchiga xabar yuborish endpointi  
app.post('/send-message', async (req, res) => {  
  const { chat_id, text } = req.body;  
  
  if (!chat_id || !text) {  
    return res.status(400).json({ error: "chat_id va text kerak" });  
  }  
  
  try {  
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;  
    const response = await axios.post(url, {  
      chat_id,  
      text,  
    });  
    res.json({ ok: true, result: response.data.result });  
  } catch (error) {  
    console.error('Telegram API error:', error.response?.data || error.message);  
    res.status(500).json({ error: "Telegram API bilan bog'lanishda xatolik yuz berdi" });  
  }  
});  
  
app.listen(PORT, () => {  
  console.log(`Server http://localhost:${PORT} da ishlayapti`);  
});