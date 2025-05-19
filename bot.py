from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, CallbackQueryHandler
import os
from dotenv import load_dotenv
import logging

# Налаштування логування
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Завантажуємо змінні середовища з .env файлу
load_dotenv()

# Отримуємо токен та URL з змінних середовища
TOKEN = os.getenv('BOT_TOKEN')
WEBAPP_URL = os.getenv('WEBAPP_URL')

if not TOKEN:
    raise ValueError("Не знайдено токен бота. Перевірте файл .env")

if not WEBAPP_URL:
    raise ValueError("Не знайдено URL веб-додатку. Перевірте файл .env")

if not WEBAPP_URL.startswith('https://'):
    raise ValueError("URL веб-додатку повинен починатися з https://")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
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
    except Exception as e:
        logger.error(f"Помилка при відправці повідомлення: {e}")
        await update.message.reply_text(
            "😔 Вибачте, сталася помилка. Спробуйте пізніше або зверніться до адміністратора."
        )

async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
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
    except Exception as e:
        logger.error(f"Помилка при обробці кнопки: {e}")
        await query.message.reply_text(
            "😔 Вибачте, сталася помилка. Спробуйте пізніше або зверніться до адміністратора."
        )

def main():
    try:
        app = ApplicationBuilder().token(TOKEN).build()
        app.add_handler(CommandHandler("start", start))
        app.add_handler(CallbackQueryHandler(button_handler))
        
        logger.info("Бот запущено")
        app.run_polling()
    except Exception as e:
        logger.error(f"Помилка при запуску бота: {e}")

if __name__ == '__main__':
    main() 