// Ініціалізація Telegram WebApp
let tg = window.Telegram.WebApp;

// Розгортаємо WebApp на весь екран
tg.expand();

// Змінні для зберігання даних користувача
let userData = {
    name: '',
    age: '',
    email: ''
};

// Питання для вікторини
const quizQuestions = [
    {
        question: "Яка столиця України?",
        answers: ["Львів", "Київ", "Харків", "Одеса"],
        correct: 1
    },
    {
        question: "Яка найдовша річка в Україні?",
        answers: ["Дніпро", "Дунай", "Дністер", "Південний Буг"],
        correct: 0
    },
    {
        question: "Яка найвища гора в Україні?",
        answers: ["Говерла", "Піп Іван", "Петрос", "Бребенескул"],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;
let currentStep = 1;

// Ініціалізація після завантаження DOM
document.addEventListener('DOMContentLoaded', function() {
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Ініціалізація обробників подій
    initEventHandlers();
});

function initEventHandlers() {
    // Обробники для авторизації
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const completeButton = document.querySelector('.complete-auth');
    
    nextButtons.forEach(button => {
        button.addEventListener('click', nextStep);
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', prevStep);
    });
    
    if (completeButton) {
        completeButton.addEventListener('click', completeAuth);
    }
}

function nextStep() {
    const currentStepElement = document.getElementById('step' + currentStep);
    const nextStepElement = document.getElementById('step' + (currentStep + 1));

    if (!currentStepElement || !nextStepElement) return;

    // Зберігаємо дані поточного кроку
    const input = currentStepElement.querySelector('input');
    if (input) {
        if (currentStep === 1) userData.name = input.value;
        if (currentStep === 2) userData.age = input.value;
        if (currentStep === 3) userData.email = input.value;
    }

    currentStepElement.style.display = 'none';
    nextStepElement.style.display = 'block';
    currentStep++;
}

function prevStep() {
    const currentStepElement = document.getElementById('step' + currentStep);
    const prevStepElement = document.getElementById('step' + (currentStep - 1));

    if (!currentStepElement || !prevStepElement) return;

    currentStepElement.style.display = 'none';
    prevStepElement.style.display = 'block';
    currentStep--;
}

function completeAuth() {
    console.log('Complete auth clicked');
    const authScreen = document.querySelector('.auth-screen');
    const quizScreen = document.querySelector('.quiz-screen');
    const userInfo = document.querySelector('.user-info');
    
    if (!authScreen || !quizScreen || !userInfo) {
        console.error('Required elements not found');
        return;
    }
    
    // Оновлюємо інформацію про користувача
    userInfo.innerHTML = `
        <p><strong>Ім'я:</strong> ${userData.name}</p>
        <p><strong>Вік:</strong> ${userData.age}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
    `;
    
    // Показуємо вікторину
    authScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    
    // Запускаємо перше питання
    showQuestion();
}

function showQuestion() {
    const questionContainer = document.querySelector('.question-container');
    const progressBar = document.querySelector('.progress');
    
    if (!questionContainer || !progressBar) {
        console.error('Question elements not found');
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    
    // Оновлюємо прогрес
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Створюємо HTML для питання
    questionContainer.innerHTML = `
        <h3>${question.question}</h3>
        <div class="answers-container">
            ${question.answers.map((answer, index) => `
                <button class="answer-button" onclick="checkAnswer(${index})">
                    ${answer}
                </button>
            `).join('')}
        </div>
    `;
}

function checkAnswer(selectedIndex) {
    const question = quizQuestions[currentQuestion];
    const buttons = document.querySelectorAll('.answer-button');
    
    // Блокуємо всі кнопки
    buttons.forEach(button => button.disabled = true);
    
    // Показуємо правильну відповідь
    buttons[question.correct].classList.add('correct');
    if (selectedIndex !== question.correct) {
        buttons[selectedIndex].classList.add('incorrect');
    }
    
    // Оновлюємо рахунок
    if (selectedIndex === question.correct) {
        score++;
    }
    
    // Показуємо наступне питання через 1.5 секунди
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizQuestions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showResults() {
    const quizScreen = document.querySelector('.quiz-screen');
    const resultScreen = document.querySelector('.result-screen');
    
    if (!quizScreen || !resultScreen) {
        console.error('Result elements not found');
        return;
    }
    
    // Оновлюємо результати
    document.querySelector('.correct-answers').textContent = score;
    document.querySelector('.total-questions').textContent = quizQuestions.length;
    
    // Показуємо екран результатів
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    
    // Відправляємо результати в Telegram
    tg.sendData(JSON.stringify({
        type: 'quiz_results',
        user: userData,
        score: score,
        total: quizQuestions.length
    }));
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    
    const resultScreen = document.querySelector('.result-screen');
    const quizScreen = document.querySelector('.quiz-screen');
    
    if (!resultScreen || !quizScreen) {
        console.error('Quiz elements not found');
        return;
    }
    
    resultScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    
    showQuestion();
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