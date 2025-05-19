// Ініціалізація Telegram WebApp
const tg = window.Telegram.WebApp;

// Розгортаємо WebApp на весь екран
tg.expand();

// Змінні для зберігання даних користувача
let userData = {
    name: '',
    position: '',
    city: ''
};

// Функція для переходу до наступного кроку
function nextStep(currentStep) {
    // Перевіряємо введені дані
    if (currentStep === 1) {
        const name = document.getElementById('nameInput').value.trim();
        if (!name) {
            alert('Будь ласка, введіть ваше ім\'я');
            return;
        }
        userData.name = name;
    } else if (currentStep === 2) {
        const position = document.getElementById('positionInput').value.trim();
        if (!position) {
            alert('Будь ласка, введіть вашу посаду');
            return;
        }
        userData.position = position;
    }

    // Приховуємо поточний крок
    document.getElementById(`step${currentStep}`).style.display = 'none';
    // Показуємо наступний крок
    document.getElementById(`step${currentStep + 1}`).style.display = 'block';
}

// Функція для повернення до попереднього кроку
function prevStep(currentStep) {
    // Приховуємо поточний крок
    document.getElementById(`step${currentStep}`).style.display = 'none';
    // Показуємо попередній крок
    document.getElementById(`step${currentStep - 1}`).style.display = 'block';
}

// Функція для завершення авторизації
function completeAuth() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        alert('Будь ласка, введіть ваше місто');
        return;
    }
    userData.city = city;

    // Оновлюємо інформацію на головному екрані
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('userPosition').textContent = userData.position;
    document.getElementById('userCity').textContent = userData.city;

    // Приховуємо екран авторизації і показуємо головний екран
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'block';

    // Відправляємо дані в Telegram
    tg.sendData(JSON.stringify({
        type: 'auth_complete',
        userData: userData
    }));
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
            text: message,
            userData: userData
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