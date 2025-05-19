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
    console.log('Перехід до кроку:', currentStep + 1);
    
    // Перевіряємо введені дані
    if (currentStep === 1) {
        const nameInput = document.getElementById('nameInput');
        const name = nameInput.value.trim();
        console.log('Введене ім\'я:', name);
        
        if (!name) {
            alert('Будь ласка, введіть ваше ім\'я');
            return;
        }
        userData.name = name;
    } else if (currentStep === 2) {
        const positionInput = document.getElementById('positionInput');
        const position = positionInput.value.trim();
        console.log('Введена посада:', position);
        
        if (!position) {
            alert('Будь ласка, введіть вашу посаду');
            return;
        }
        userData.position = position;
    }

    // Приховуємо поточний крок
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const nextStepElement = document.getElementById(`step${currentStep + 1}`);
    
    if (currentStepElement && nextStepElement) {
        currentStepElement.style.display = 'none';
        nextStepElement.style.display = 'block';
        console.log('Кроки успішно змінені');
    } else {
        console.error('Не знайдено елементи кроків:', {
            current: currentStepElement,
            next: nextStepElement
        });
    }
}

// Функція для повернення до попереднього кроку
function prevStep(currentStep) {
    console.log('Повернення до кроку:', currentStep - 1);
    
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const prevStepElement = document.getElementById(`step${currentStep - 1}`);
    
    if (currentStepElement && prevStepElement) {
        currentStepElement.style.display = 'none';
        prevStepElement.style.display = 'block';
        console.log('Повернення успішне');
    } else {
        console.error('Не знайдено елементи кроків:', {
            current: currentStepElement,
            prev: prevStepElement
        });
    }
}

// Функція для завершення авторизації
function completeAuth() {
    console.log('Завершення авторизації');
    
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    console.log('Введене місто:', city);
    
    if (!city) {
        alert('Будь ласка, введіть ваше місто');
        return;
    }
    userData.city = city;

    // Оновлюємо інформацію на головному екрані
    const userNameElement = document.getElementById('userName');
    const userPositionElement = document.getElementById('userPosition');
    const userCityElement = document.getElementById('userCity');
    
    if (userNameElement && userPositionElement && userCityElement) {
        userNameElement.textContent = userData.name;
        userPositionElement.textContent = userData.position;
        userCityElement.textContent = userData.city;
        console.log('Інформація користувача оновлена');
    } else {
        console.error('Не знайдено елементи для відображення інформації');
    }

    // Приховуємо екран авторизації і показуємо головний екран
    const authScreen = document.getElementById('authScreen');
    const mainScreen = document.getElementById('mainScreen');
    
    if (authScreen && mainScreen) {
        authScreen.style.display = 'none';
        mainScreen.style.display = 'block';
        console.log('Екрани успішно змінені');
    } else {
        console.error('Не знайдено екрани');
    }

    // Відправляємо дані в Telegram
    try {
        tg.sendData(JSON.stringify({
            type: 'auth_complete',
            userData: userData
        }));
        console.log('Дані успішно відправлені в Telegram');
    } catch (error) {
        console.error('Помилка при відправці даних:', error);
    }
}

// Функція для відправки повідомлення
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
        // Додаємо повідомлення на сторінку
        addMessage(message);
        
        // Відправляємо дані в Telegram
        try {
            tg.sendData(JSON.stringify({
                type: 'message',
                text: message,
                userData: userData
            }));
            console.log('Повідомлення успішно відправлено');
        } catch (error) {
            console.error('Помилка при відправці повідомлення:', error);
        }
        
        // Очищаємо поле вводу
        input.value = '';
    }
}

// Функція для додавання повідомлення на сторінку
function addMessage(text) {
    const messagesDiv = document.getElementById('messages');
    if (messagesDiv) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.textContent = text;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        console.log('Повідомлення додано на сторінку');
    } else {
        console.error('Не знайдено контейнер для повідомлень');
    }
}

// Обробка натискання Enter в полі вводу
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        console.log('Обробник Enter додано');
    } else {
        console.error('Не знайдено поле вводу повідомлення');
    }
});

// Встановлюємо тему відповідно до налаштувань Telegram
document.body.style.backgroundColor = tg.themeParams.bg_color;
document.body.style.color = tg.themeParams.text_color; 