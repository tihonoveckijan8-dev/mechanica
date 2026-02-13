document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ЛОГИКА ВКЛАДОК (Tabs) ---
    const mainTabsContainer = document.getElementById('mainTabs');
    const contentArea = document.querySelector('.glass-content');

    // Функция переключения под-вкладок
    function activateSubTab(subBtn) {
        if (!subBtn) return;
        const parentPane = subBtn.closest('.tab-pane');
        const targetId = subBtn.dataset.sub;
        
        parentPane.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
        parentPane.querySelectorAll('.subtab-pane').forEach(p => p.classList.remove('active'));
        
        subBtn.classList.add('active');
        document.getElementById(targetId)?.classList.add('active');
    }

    // Функция переключения главных вкладок
    function activateMainTab(tabBtn) {
        const targetId = tabBtn.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tabBtn.classList.add('active');
        
        tabBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        const targetPane = document.getElementById(targetId);
        if(targetPane) {
            targetPane.classList.add('active');
            // Активируем первую под-вкладку по умолчанию
            const firstSub = targetPane.querySelector('.subtab-btn');
            const activeSub = targetPane.querySelector('.subtab-btn.active');
            if(!activeSub && firstSub) activateSubTab(firstSub);
        }
    }

    // Делегирование событий
    mainTabsContainer.addEventListener('click', e => {
        const btn = e.target.closest('.tab-btn');
        if(btn) activateMainTab(btn);
    });

    contentArea.addEventListener('click', e => {
        const btn = e.target.closest('.subtab-btn');
        if(btn) activateSubTab(btn);
    });

    // --- 2. ДАННЫЕ ДЛЯ ТЕСТА (Quiz Data) ---
    // Строго по тексту Сивухина
    const quizData = [
        {
            question: "Что является единственным критерием правильности физической теории?",
            options: ["Математическая красота", "Логическая непротиворечивость", "Опыт", "Мнение авторитетных ученых"],
            correct: 2 // Индекс правильного ответа (0, 1, 2...)
        },
        {
            question: "Как меняется знак аксиального вектора при инверсии координат?",
            options: ["Меняется на противоположный", "Не меняется", "Становится мнимым", "Зависит от системы отсчета"],
            correct: 1
        },
        {
            question: "Сколько степеней свободы имеет свободное абсолютно твёрдое тело?",
            options: ["3", "5", "6", "Бесконечно много"],
            correct: 2
        },
        {
            question: "Какая сила является причиной возникновения прецессии гироскопа?",
            options: ["Сила Кориолиса", "Момент внешних сил", "Центробежная сила", "Сила трения"],
            correct: 1
        },
        {
            question: "Чему равна первая космическая скорость для Земли?",
            options: ["7.9 км/с", "11.2 км/с", "16.7 км/с", "300 000 км/с"],
            correct: 0
        },
        {
            question: "Какой закон лежит в основе 1-го закона Кеплера?",
            options: ["Закон сохранения импульса", "Закон всемирного тяготения", "Закон Гука", "Закон Архимеда"],
            correct: 1
        },
        {
            question: "Что утверждает принцип относительности Галилея?",
            options: ["Скорость света постоянна", "Время течет по-разному в разных ИСО", "Механические законы одинаковы во всех ИСО", "Энергия эквивалентна массе"],
            correct: 2
        },
        {
            question: "Как направлен вектор угловой скорости?",
            options: ["По касательной к траектории", "Вдоль радиуса", "Вдоль оси вращения (по правилу буравчика)", "Против движения"],
            correct: 2
        }
    ];

    // --- 3. ЛОГИКА ТЕСТА (Quiz Logic) ---
    const startBtn = document.getElementById('startQuizBtn');
    const modal = document.getElementById('quizModal');
    const closeBtn = document.getElementById('closeQuiz');
    const quizBody = document.getElementById('quizBody');
    const quizResult = document.getElementById('quizResult');
    
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = []; // Хранит выбор пользователя для Review
    let isReviewMode = false; // Режим просмотра ошибок

    // Открытие/Закрытие модального окна
    startBtn.addEventListener('click', () => {
        resetQuiz();
        modal.classList.add('visible');
        renderQuestion();
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('visible');
    });

    function resetQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = new Array(quizData.length).fill(null);
        isReviewMode = false;
        quizBody.classList.remove('hidden');
        quizResult.classList.add('hidden');
    }

    function renderQuestion() {
        const qData = quizData[currentQuestionIndex];
        const total = quizData.length;
        
        // Обновление UI
        document.getElementById('qNumber').innerText = `Вопрос ${currentQuestionIndex + 1} из ${total}`;
        document.getElementById('qText').innerText = qData.question;
        
        // Прогресс бар
        const progressPercent = ((currentQuestionIndex) / total) * 100;
        document.getElementById('quizProgress').style.width = `${progressPercent}%`;

        // Рендер опций
        const optionsContainer = document.getElementById('optionsList');
        optionsContainer.innerHTML = '';

        qData.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            
            // Если режим просмотра ошибок
            if(isReviewMode) {
                btn.classList.add('disabled');
                if (index === qData.correct) {
                    btn.classList.add('correct'); // Показываем правильный
                }
                if (index === userAnswers[currentQuestionIndex] && index !== qData.correct) {
                    btn.classList.add('wrong'); // Показываем ошибку пользователя
                }
            } else {
                // Обычный режим - клик
                btn.onclick = () => handleAnswer(index, btn);
            }
            optionsContainer.appendChild(btn);
        });

        // Добавляем кнопку "Далее" в режиме Review
        if(isReviewMode) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn-primary';
            nextBtn.innerText = currentQuestionIndex === total - 1 ? "Завершить просмотр" : "Далее";
            nextBtn.style.marginTop = '20px';
            nextBtn.style.width = '100%';
            nextBtn.onclick = () => {
                if(currentQuestionIndex < total - 1) {
                    currentQuestionIndex++;
                    renderQuestion();
                } else {
                    showResults();
                }
            };
            optionsContainer.appendChild(nextBtn);
        }
    }

    function handleAnswer(selectedIndex, btnElement) {
        // Блокируем повторные клики
        const allBtns = document.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.classList.add('disabled'));

        userAnswers[currentQuestionIndex] = selectedIndex;
        const correctIndex = quizData[currentQuestionIndex].correct;

        if(selectedIndex === correctIndex) {
            btnElement.classList.add('correct');
            score++;
        } else {
            btnElement.classList.add('wrong');
            // Подсветить правильный ответ для обучения
            allBtns[correctIndex].classList.add('correct');
        }

        // Задержка перед следующим вопросом
        setTimeout(() => {
            if(currentQuestionIndex < quizData.length - 1) {
                currentQuestionIndex++;
                renderQuestion();
            } else {
                showResults();
            }
        }, 1200);
    }

    function showResults() {
        quizBody.classList.add('hidden');
        quizResult.classList.remove('hidden');
        
        const percent = Math.round((score / quizData.length) * 100);
        document.getElementById('scoreValue').innerText = `${percent}%`;
        
        let msg = '';
        if(percent === 100) msg = "Блестяще! Вы готовы к экзамену.";
        else if(percent >= 70) msg = "Хороший результат.";
        else msg = "Рекомендуется повторить материал.";
        
        document.getElementById('scoreText').innerText = msg;
    }

    // Обработчики кнопок результата
    document.getElementById('retryBtn').addEventListener('click', () => {
        resetQuiz();
        renderQuestion();
    });

    document.getElementById('reviewBtn').addEventListener('click', () => {
        isReviewMode = true;
        currentQuestionIndex = 0;
        quizResult.classList.add('hidden');
        quizBody.classList.remove('hidden');
        renderQuestion();
    });
});
