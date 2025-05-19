from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

TOKEN = 'ТВОЙ_ТОКЕН_ТУТ'  # Токен бота від @BotFather
WEBAPP_URL = 'https://kultup.github.io/quizBot'  # URL вашого веб-додатку на GitHub Pages

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton(
            "Відкрити додаток",
            web_app=WebAppInfo(url=WEBAPP_URL)
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        'Вітаю! Натисніть кнопку нижче, щоб відкрити веб-додаток:',
        reply_markup=reply_markup
    )

def main():
    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.run_polling()

if __name__ == '__main__':
    main() 