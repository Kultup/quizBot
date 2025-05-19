from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, CallbackQueryHandler
import os
from dotenv import load_dotenv

# Завантажуємо змінні середовища з .env файлу
load_dotenv()

# Отримуємо токен та URL з змінних середовища
TOKEN = os.getenv('BOT_TOKEN')
WEBAPP_URL = os.getenv('WEBAPP_URL')

if not TOKEN:
    raise ValueError("Не знайдено токен бота. Перевірте файл .env")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton(
            "🎯 Почати вікторину",
            web_app=WebAppInfo(url=WEBAPP_URL)
        )],
        [InlineKeyboardButton(
            "ℹ️ Інформація",
            callback_data='info'
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "👋 *Вітаю! Я бот для проведення вікторин про Україну!*\n\n"
        "🎮 *Що я вмію:*\n"
        "• Проводити цікаві вікторини\n"
        "• Перевіряти ваші знання\n"
        "• Нагороджувати за успіхи\n\n"
        "🎯 *Готові почати?*\n"
        "Натисніть кнопку нижче 👇",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if query.data == 'info':
        await query.message.reply_text(
            "🎯 *Інформація про вікторину*\n\n"
            "📝 *Формат вікторини:*\n"
            "• Вікторина складається з 10 питань\n"
            "• На кожне питання є 4 варіанти відповіді\n"
            "• За правильну відповідь ви отримуєте 1 бал\n"
            "• Після завершення ви побачите свій результат\n\n"
            "🏆 *Система оцінювання:*\n"
            "• 9-10 балів: 🥇 Золото\n"
            "• 7-8 балів: 🥈 Срібло\n"
            "• 5-6 балів: 🥉 Бронза\n"
            "• Менше 5: 📚 Ще потрібно вчитися\n\n"
            "🎮 *Як почати:*\n"
            "Натисніть кнопку 'Почати вікторину' нижче 👇",
            parse_mode='Markdown'
        )

def main():
    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(button_handler))
    app.run_polling()

if __name__ == '__main__':
    main() 