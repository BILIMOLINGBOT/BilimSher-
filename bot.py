from aiogram import Bot, Dispatcher, types
from aiogram.types import WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
from aiogram.utils import executor

# Siz bergan token
TOKEN = "8185938514:AAFoesK3lEKc2fRKGuGDQvCanWjpVpZW5a8"

bot = Bot(token=TOKEN)
dp = Dispatcher(bot)

@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    web_app_url = "https://bilim-app.glitch.me"  # Mini app URL

    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    button = KeyboardButton(text="📘 Darsni ochish", web_app=WebAppInfo(url=web_app_url))
    keyboard.add(button)

    await message.answer("Assalomu alaykum!\nQuyidagi tugmani bosing:", reply_markup=keyboard)

if __name__ == '__main__':
    executor.start_polling(dp)