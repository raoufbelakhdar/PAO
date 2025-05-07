// Flashcard functionality
let currentFlashcards = [];
let currentFlashcardIndex = 0;
let flashcardScores = {};
let revealed = false;

function startFlashcards() {
    const mode = document.getElementById('flashcard-mode').value;
    currentFlashcards = [];

    // Collect flashcards according to mode
    if (mode === 'all' || mode === 'characters') {
        Object.keys(characters).forEach(code => {
            currentFlashcards.push({
                type: 'Character',
                code,
                name: characters[code].name,
                image: characters[code].image
            });
        });
    }
    
    if (mode === 'all' || mode === 'actions') {
        Object.keys(actions).forEach(code => {
            currentFlashcards.push({
                type: 'Action',
                code,
                name: actions[code].name,
                image: actions[code].image
            });
        });
    }
    
    if (mode === 'all' || mode === 'objects') {
        Object.keys(objects).forEach(code => {
            currentFlashcards.push({
                type: 'Object',
                code,
                name: objects[code].name,
                image: objects[code].image
            });
        });
    }

    // Always shuffle the flashcards
    shuffleArray(currentFlashcards);

    currentFlashcardIndex = 0;
    flashcardScores = {};
    showFlashcard();
    document.getElementById('flashcard-area').style.display = 'block';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showFlashcard() {
    if (currentFlashcardIndex >= currentFlashcards.length) {
        endFlashcardSession();
        return;
    }
    
    const card = currentFlashcards[currentFlashcardIndex];
    
    document.getElementById('flashcard-image').src = card.image;
    
    // Hide code and name initially
    document.getElementById('flashcard-code').textContent = "";
    document.getElementById('flashcard-type').textContent = card.type;
    document.getElementById('flashcard-name').textContent = card.name;
    document.getElementById('flashcard-name').style.display = 'block';
    
    // Update progress
    document.getElementById('flashcard-progress').value = (currentFlashcardIndex / currentFlashcards.length) * 100;
    document.getElementById('flashcard-count').textContent = `${currentFlashcardIndex + 1}/${currentFlashcards.length}`;

    revealed = false;
}

function revealFlashcard() {
    if (!revealed) {
        const card = currentFlashcards[currentFlashcardIndex];
        
        document.getElementById('flashcard-code').textContent = card.code;
        
        revealed = true;
    }
}

function nextFlashcard() {
    currentFlashcardIndex++;
    showFlashcard();
}

function rateFlashcard(rating) {
    const currentCode = currentFlashcards[currentFlashcardIndex].code;
    flashcardScores[currentCode] = (flashcardScores[currentCode] || 0) + rating;
    nextFlashcard();
}

function endFlashcardSession() {
    alert('Flashcard session complete!');
    document.getElementById('flashcard-area').style.display = 'none';
}



// Quiz functionality
let quizQuestions = [];
let currentQuestionIndex = 0;
let quizScore = 0;

function startQuiz() {
    const quizType = document.getElementById('quiz-type').value;
    const quizLength = parseInt(document.getElementById('quiz-length').value);
    
    quizQuestions = generateQuizQuestions(quizType, quizLength);
    currentQuestionIndex = 0;
    quizScore = 0;
    
    showQuestion();
    document.getElementById('quiz-area').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'none';
}

function generateQuizQuestions(type, length) {
    const questions = [];
    const allItems = [
        ...Object.entries(characters).map(([code, item]) => ({ ...item, code, type: 'Character' })),
        ...Object.entries(actions).map(([code, item]) => ({ ...item, code, type: 'Action' })),
        ...Object.entries(objects).map(([code, item]) => ({ ...item, code, type: 'Object' }))
    ];
    
    for (let i = 0; i < length; i++) {
        const item = allItems[Math.floor(Math.random() * allItems.length)];
        let question, correctAnswer, options;
        
        if (type === 'code-to-pao' || (type === 'mixed' && Math.random() > 0.5)) {
            question = `What is the ${item.type.toLowerCase()} for code ${item.code}?`;
            correctAnswer = item.name;

            options = [correctAnswer];
            while (options.length < 4) {
                const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
                if (!options.includes(randomItem.name)) {
                    options.push(randomItem.name);
                }
            }
        } else {
            question = `What is the code for ${item.type.toLowerCase()}: ${item.name}?`;
            correctAnswer = item.code;

            options = [correctAnswer];
            while (options.length < 4) {
                const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
                if (!options.includes(randomItem.code)) {
                    options.push(randomItem.code);
                }
            }
        }

        options = options.sort(() => Math.random() - 0.5);
        
        questions.push({
            question,
            correctAnswer,
            options,
            code: item.code
        });
    }
    
    return questions;
}

function showQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        showQuizResults();
        return;
    }
    
    const question = quizQuestions[currentQuestionIndex];
    document.getElementById('quiz-question').textContent = question.question;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'quiz-option';
        optionElement.textContent = option;
        optionElement.onclick = function() {
            checkAnswer(option, question.correctAnswer);
        };
        optionsContainer.appendChild(optionElement);
    });
    
    // Update progress
    document.getElementById('quiz-progress').value = (currentQuestionIndex / quizQuestions.length) * 100;
    document.getElementById('quiz-count').textContent = `${currentQuestionIndex + 1}/${quizQuestions.length}`;
    document.getElementById('quiz-feedback').textContent = '';
    document.getElementById('next-question-btn').style.display = 'none';
}

function checkAnswer(selectedAnswer, correctAnswer) {
    const options = document.querySelectorAll('.quiz-option');
    let isCorrect = selectedAnswer === correctAnswer;
    
    if (isCorrect) {
        quizScore++;
    }
    
    options.forEach(option => {
        option.style.pointerEvents = 'none';
        if (option.textContent === correctAnswer) {
            option.classList.add('correct');
        } else if (option.textContent === selectedAnswer && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    document.getElementById('quiz-feedback').textContent = isCorrect 
        ? 'Correct! 🎉' 
        : `Incorrect. The correct answer is: ${correctAnswer}`;
    
    document.getElementById('next-question-btn').style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

function showQuizResults() {
    document.getElementById('quiz-area').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    
    const scorePercentage = Math.round((quizScore / quizQuestions.length) * 100);
    document.getElementById('quiz-score').innerHTML = `
        <h4>Your Score: ${quizScore}/${quizQuestions.length} (${scorePercentage}%)</h4>
        <progress value="${quizScore}" max="${quizQuestions.length}"></progress>
    `;
    
    const missedQuestions = quizQuestions.filter((q, i) => {
        return i >= quizScore;
    });
    
    if (missedQuestions.length > 0) {
        let missedHtml = '<h4>Review these:</h4><ul>';
        missedQuestions.slice(0, 5).forEach(q => {
            missedHtml += `<li>${q.question} → ${q.correctAnswer}</li>`;
        });
        missedHtml += '</ul>';
        document.getElementById('quiz-missed').innerHTML = missedHtml;
    } else {
        document.getElementById('quiz-missed').innerHTML = '<p>Perfect score! 🎉</p>';
    }
}


// Speed Test functionality (RETHINKED)
let speedFlashcards = [];
let currentSpeedIndex = 0;
let speedTimer;
let speedDifficulty = 5000; // Default 5s
let speedCorrect = 0;
let speedWrong = 0;

function startSpeedTest() {
    const difficulty = document.getElementById('speed-difficulty').value;
    speedFlashcards = [];

    // Collect all flashcards
    Object.keys(characters).forEach(code => {
        speedFlashcards.push({
            type: 'Character',
            code,
            name: characters[code].name,
            image: characters[code].image
        });
    });
    Object.keys(actions).forEach(code => {
        speedFlashcards.push({
            type: 'Action',
            code,
            name: actions[code].name,
            image: actions[code].image
        });
    });
    Object.keys(objects).forEach(code => {
        speedFlashcards.push({
            type: 'Object',
            code,
            name: objects[code].name,
            image: objects[code].image
        });
    });

    shuffleArray(speedFlashcards);

    if (difficulty === 'easy') {
        speedDifficulty = 5000;
    } else if (difficulty === 'medium') {
        speedDifficulty = 3000;
    } else {
        speedDifficulty = 1000;
    }

    currentSpeedIndex = 0;
    speedCorrect = 0;
    speedWrong = 0;
    document.getElementById('speed-correct').textContent = 0;
    document.getElementById('speed-wrong').textContent = 0;
    document.getElementById('speed-time').textContent = 0;
    document.getElementById('speed-area').style.display = 'block';

    showSpeedFlashcard();
}

function showSpeedFlashcard() {
    if (currentSpeedIndex >= speedFlashcards.length) {
        clearInterval(speedTimer);
        alert('Speed Test Complete!');
        document.getElementById('speed-area').style.display = 'none';
        return;
    }

    const card = speedFlashcards[currentSpeedIndex];
    
    // SHOW ONLY image and type
    document.getElementById('speed-code').textContent = ""; // hide number
    document.getElementById('speed-type').textContent = card.type;
    document.getElementById('speed-image').src = card.image;
    document.getElementById('speed-answer').value = "";
    

    let timeLeft = speedDifficulty / 1000;
    document.getElementById('speed-time').textContent = timeLeft;

    clearInterval(speedTimer);
    speedTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('speed-time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(speedTimer);
            markSpeedAnswer(false);
        }
    }, 1000);
}

function showSpeedFlashcard() {
    if (currentSpeedIndex >= speedFlashcards.length) {
        clearInterval(speedTimer);
        alert('Speed Test Complete!');
        document.getElementById('speed-area').style.display = 'none';
        return;
    }

    const card = speedFlashcards[currentSpeedIndex];
    
    // SHOW ONLY image and type
    document.getElementById('speed-code').textContent = ""; // hide number
    document.getElementById('speed-type').textContent = card.type;
    document.getElementById('speed-image').src = card.image;
    document.getElementById('speed-name').textContent = card.name || "";
    const answerInput = document.getElementById('speed-answer');
    answerInput.value = "";
    answerInput.focus();

    answerInput.oninput = () => {
        const value = answerInput.value.trim();
        if (value.length === 2) {
            validateSpeedAnswer(value);
        }
    };

    answerInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = answerInput.value.trim();
            validateSpeedAnswer(value);
        }
    };

    let timeLeft = speedDifficulty / 1000;
    document.getElementById('speed-time').textContent = timeLeft;

    clearInterval(speedTimer);
    speedTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('speed-time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(speedTimer);
            markSpeedAnswer(false);
        }
    }, 1000);
}

function validateSpeedAnswer(userInput) {
    clearInterval(speedTimer);
    const correctCode = speedFlashcards[currentSpeedIndex].code;

    if (userInput === correctCode) {
        markSpeedAnswer(true);
    } else {
        markSpeedAnswer(false);
    }
}


function markSpeedAnswer(correct) {
    if (correct) {
        speedCorrect++;
        document.getElementById('speed-correct').textContent = speedCorrect;
    } else {
        speedWrong++;
        document.getElementById('speed-wrong').textContent = speedWrong;
    }
    currentSpeedIndex++;
    showSpeedFlashcard();
}



// Story Challenge functionality (PAO sequence version)

let currentStoryItems = [];

function generateChallenge() {
    const length = parseInt(document.getElementById('story-length').value, 10);
    if (isNaN(length) || length < 1) return;

    // Separate pools
    const characterItems = [];
    const actionItems = [];
    const objectItems = [];

    Object.keys(characters).forEach(code => {
        characterItems.push({
            code,
            type: 'Character',
            name: characters[code].name
        });
    });
    Object.keys(actions).forEach(code => {
        actionItems.push({
            code,
            type: 'Action',
            name: actions[code].name
        });
    });
    Object.keys(objects).forEach(code => {
        objectItems.push({
            code,
            type: 'Object',
            name: objects[code].name
        });
    });

    shuffleArray(characterItems);
    shuffleArray(actionItems);
    shuffleArray(objectItems);

    currentStoryItems = [];

    // Generate sequence: Character ➔ Action ➔ Object ➔ repeat
    for (let i = 0; i < length; i++) {
        if (i % 3 === 0) {
            currentStoryItems.push(characterItems.pop());
        } else if (i % 3 === 1) {
            currentStoryItems.push(actionItems.pop());
        } else {
            currentStoryItems.push(objectItems.pop());
        }
    }

    // Display code sequence
    const codeSequenceContainer = document.getElementById('code-sequence');
    codeSequenceContainer.innerHTML = '';
    currentStoryItems.forEach(item => {
        const bubble = document.createElement('div');
        bubble.className = 'code-bubble';
        bubble.textContent = item.code;
        codeSequenceContainer.appendChild(bubble);
    });

    document.getElementById('story-review').style.display = 'none';
    document.getElementById('story-challenge-area').style.display = 'block';
}

function showExpectedItems() {
    if (!currentStoryItems || currentStoryItems.length === 0) return;

    const comparisonContainer = document.getElementById('story-comparison');
    comparisonContainer.innerHTML = '';

    currentStoryItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'story-comparison-item';
        card.innerHTML = `
            <div class="story-comparison-code">${item.code}</div>
            <div class="story-comparison-pao">${item.type}: ${item.name}</div>
            <div class="story-self-check">
                <button onclick="markSelfCheck(this, true)">✅ I remembered</button>
                <button onclick="markSelfCheck(this, false)">❌ I forgot</button>
            </div>
        `;
        comparisonContainer.appendChild(card);
    });

    document.getElementById('story-review').style.display = 'block';
}

function markSelfCheck(button, remembered) {
    const parent = button.parentElement;
    parent.innerHTML = remembered
        ? '<span style="color: #10b981; font-weight: bold;">✅ Remembered</span>'
        : '<span style="color: #ef4444; font-weight: bold;">❌ Forgot</span>';
}

// Utility: shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
