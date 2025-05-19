// Ініціалізація Telegram WebApp
const tg = window.Telegram.WebApp;

// Розгортаємо WebApp на весь екран
tg.expand();

// Отримуємо дані користувача
const user = tg.initDataUnsafe?.user;
if (user) {
    document.getElementById('userName').textContent = user.first_name || 'Користувач';
}

// Функція для відправки повідомлення
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
        // Додаємо повідомлення на сторінку
        addMessage(message);
        
        // Відправляємо дані в Telegram
        tg.sendData(JSON.stringify({
            type: 'message',
            text: message
        }));
        
        // Очищаємо поле вводу
        input.value = '';
    }
}

// Функція для додавання повідомлення на сторінку
function addMessage(text) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = text;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Обробка натискання Enter в полі вводу
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Встановлюємо тему відповідно до налаштувань Telegram
document.body.style.backgroundColor = tg.themeParams.bg_color;
document.body.style.color = tg.themeParams.text_color; 