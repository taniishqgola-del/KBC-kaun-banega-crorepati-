class KBCGame {
    constructor() {
        this.questions = [
            {
                question: "Which of these is the capital of India?",
                options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
                correct: 1,
                prize: 1000
            },
            {
                question: "Who wrote the Indian National Anthem?",
                options: ["Bankim Chandra", "Rabindranath Tagore", "Sarojini Naidu", "Maulana Azad"],
                correct: 1,
                prize: 2000
            },
            {
                question: "What is the chemical symbol for Gold?",
                options: ["Ag", "Au", "Go", "Gd"],
                correct: 1,
                prize: 3000
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correct: 1,
                prize: 5000
            },
            {
                question: "Who invented the telephone?",
                options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"],
                correct: 1,
                prize: 10000
            },
            {
                question: "What is the largest mammal in the world?",
                options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
                correct: 1,
                prize: 20000
            },
            {
                question: "In which year did India gain independence?",
                options: ["1945", "1947", "1950", "1942"],
                correct: 1,
                prize: 40000
            },
            {
                question: "What is the square root of 144?",
                options: ["10", "12", "14", "16"],
                correct: 1,
                prize: 80000
            },
            {
                question: "Which gas do plants absorb from the atmosphere?",
                options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                correct: 2,
                prize: 160000
            },
            {
                question: "Who was the first Prime Minister of India?",
                options: ["Indira Gandhi", "Jawaharlal Nehru", "Rajiv Gandhi", "Lal Bahadur Shastri"],
                correct: 1,
                prize: 320000
            },
            {
                question: "What is the longest river in the world?",
                options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
                correct: 1,
                prize: 640000
            },
            {
                question: "Which element has the atomic number 1?",
                options: ["Helium", "Hydrogen", "Lithium", "Oxygen"],
                correct: 1,
                prize: 1250000
            }
        ];

        this.currentQuestionIndex = 0;
        this.currentWinnings = 0;
        this.timer = 20;
        this.timerInterval = null;
        this.gameActive = false;

        this.initializeElements();
        this.startGame();
    }

    // ✅ NEW: Shuffle Question
    shuffleQuestion(question) {
        let options = question.options.map((opt, i) => ({
            text: opt,
            isCorrect: i === question.correct
        }));

        options.sort(() => Math.random() - 0.5);

        let newCorrectIndex = options.findIndex(opt => opt.isCorrect);

        return {
            question: question.question,
            options: options.map(opt => opt.text),
            correct: newCorrectIndex,
            prize: question.prize
        };
    }

    initializeElements() {
        this.questionText = document.getElementById('questionText');
        this.optionsGrid = document.getElementById('optionsGrid');
        this.currentAmount = document.getElementById('currentAmount');
        this.levelDisplay = document.getElementById('levelDisplay');
        this.timerText = document.getElementById('timerText');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.finalAmount = document.getElementById('finalAmount');
        this.restartBtn = document.getElementById('restartBtn');

        this.restartBtn.addEventListener('click', () => this.restartGame());
    }

    startGame() {
        this.gameActive = true;
        this.currentQuestionIndex = 0;
        this.currentWinnings = 0;
        this.updateDisplay();
        this.showQuestion();
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame(true, "You Won!");
            return;
        }

        const originalQ = this.questions[this.currentQuestionIndex];
        this.currentShuffledQuestion = this.shuffleQuestion(originalQ);

        this.questionText.textContent = this.currentShuffledQuestion.question;
        this.generateOptions(this.currentShuffledQuestion);
        this.startTimer();
        this.levelDisplay.textContent = `Level ${this.currentQuestionIndex + 1}`;
    }

    generateOptions(question) {
        this.optionsGrid.innerHTML = '';

        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;

            btn.addEventListener('click', () =>
                this.selectAnswer(index, question.correct)
            );

            this.optionsGrid.appendChild(btn);
        });
    }

    startTimer() {
        this.timer = 20;
        this.timerText.textContent = this.timer;

        this.timerInterval = setInterval(() => {
            this.timer--;
            this.timerText.textContent = this.timer;

            if (this.timer <= 0) {
                clearInterval(this.timerInterval);
                this.endGame(false, "Time's up!");
            }
        }, 1000);
    }

    selectAnswer(selectedIndex, correctIndex) {
        if (!this.gameActive) return;

        clearInterval(this.timerInterval);

        if (selectedIndex === correctIndex) {
            this.currentWinnings = this.questions[this.currentQuestionIndex].prize;
            this.updateDisplay();

            setTimeout(() => {
                this.currentQuestionIndex++;
                this.showQuestion();
            }, 1000);
        } else {
            this.endGame(false, "Wrong Answer!");
        }
    }

    updateDisplay() {
        this.currentAmount.textContent = this.currentWinnings.toLocaleString();
    }

    endGame(won, message) {
        this.gameActive = false;
        clearInterval(this.timerInterval);

        this.finalAmount.textContent = this.currentWinnings;
        this.gameOverModal.style.display = 'flex';
    }

    restartGame() {
        this.gameOverModal.style.display = 'none';
        this.startGame();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new KBCGame();
});
