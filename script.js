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
        this.lifelinesUsed = {
            fiftyFifty: false,
            skip: false
        };

        this.initializeElements();
        this.startGame();
    }

    initializeElements() {
        this.questionText = document.getElementById('questionText');
        this.questionContainer = document.getElementById('questionContainer');
        this.optionsGrid = document.getElementById('optionsGrid');
        this.currentAmount = document.getElementById('currentAmount');
        this.levelDisplay = document.getElementById('levelDisplay');
        this.timerText = document.getElementById('timerText');
        this.timerPath = document.getElementById('timer-path');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.finalAmount = document.getElementById('finalAmount');
        this.finalMessage = document.getElementById('finalMessage');
        this.restartBtn = document.getElementById('restartBtn');
        this.lifeline50 = document.getElementById('lifeline50');
        this.lifelineSkip = document.getElementById('lifelineSkip');

        // Event listeners
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.lifeline50.addEventListener('click', () => this.useFiftyFifty());
        this.lifelineSkip.addEventListener('click', () => this.useSkip());
    }

    startGame() {
        this.gameActive = true;
        this.currentQuestionIndex = 0;
        this.currentWinnings = 0;
        this.lifelinesUsed = { fiftyFifty: false, skip: false };
        this.updateDisplay();
        this.showQuestion();
        this.resetLifelinesUI();
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame(true, "Congratulations! You won ₹12,500,000!");
            return;
        }

        const q = this.questions[this.currentQuestionIndex];
        this.questionText.textContent = q.question;
        this.generateOptions(q);
        this.startTimer();
        this.updateLevelDisplay();
    }

    generateOptions(question) {
        this.optionsGrid.innerHTML = '';
        const options = [...question.options];

        // Apply 50-50 if used
        if (this.lifelinesUsed.fiftyFifty && this.currentQuestionIndex === this.fiftyFiftyQuestionIndex) {
            const incorrectOptions = options.filter((_, i) => i !== question.correct);
            const randomIncorrect = incorrectOptions[Math.floor(Math.random() * 2)];
            options.splice(options.indexOf(randomIncorrect), 1);
        }

        options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            btn.dataset.index = index;
            btn.addEventListener('click', () => this.selectAnswer(index, question.correct));
            this.optionsGrid.appendChild(btn);
        });
    }

    startTimer() {
        this.timer = 20;
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.timer--;
            this.updateTimerDisplay();
            
            if (this.timer <= 0) {
                clearInterval(this.timerInterval);
                this.answerTimeout();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        this.timerText.textContent = this.timer;
        const dashOffset = (1 - (this.timer / 20)) * 100;
        this.timerPath.style.strokeDashoffset = dashOffset;
    }

    selectAnswer(selectedIndex, correctIndex) {
        if (!this.gameActive) return;

        clearInterval(this.timerInterval);
        this.disableOptions();

        const buttons = this.optionsGrid.querySelectorAll('.option-btn');
        
        if (selectedIndex === correctIndex) {
            buttons[correctIndex].classList.add('correct');
            this.currentWinnings = this.questions[this.currentQuestionIndex].prize;
            this.updateDisplay();
            
            setTimeout(() => {
                this.currentQuestionIndex++;
                this.showQuestion();
            }, 1500);
        } else {
            buttons[selectedIndex].classList.add('wrong');
            if (correctIndex !== -1) {
                buttons[correctIndex].classList.add('correct');
            }
            setTimeout(() => this.endGame(false), 1500);
        }
    }

    answerTimeout() {
        this.disableOptions();
        const buttons = this.optionsGrid.querySelectorAll('.option-btn');
        const correctIndex = this.questions[this.currentQuestionIndex].correct;
        buttons[correctIndex].classList.add('correct');
        
        setTimeout(() => this.endGame(false, "Time's up!"), 1500);
    }

    disableOptions() {
        const buttons = this.optionsGrid.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.style.pointerEvents = 'none';
        });
    }

    useFiftyFifty() {
        if (this.lifelinesUsed.fiftyFifty || !this.gameActive) return;
        
        this.lifelinesUsed.fiftyFifty = true;
        this.fiftyFiftyQuestionIndex = this.currentQuestionIndex;
        this.lifeline50.classList.add('used');
        
        // Regenerate options with 50-50 applied
        const question = this.questions[this.currentQuestionIndex];
        this.generateOptions(question);
    }

    useSkip() {
        if (this.lifelinesUsed.skip || !this.gameActive) return;
        
        this.lifelinesUsed.skip = true;
        this.lifelineSkip.classList.add('used');
        
        clearInterval(this.timerInterval);
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    updateDisplay() {
        this.currentAmount.textContent = this.currentWinnings.toLocaleString();
    }

    updateLevelDisplay() {
        this.levelDisplay.textContent = `Level ${this.currentQuestionIndex + 1}`;
    }

    resetLifelinesUI() {
        this.lifeline50.classList.remove('used');
        this.lifelineSkip.classList.remove('used');
    }

    endGame(won, message = "Wrong Answer!") {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        
        this.finalAmount.textContent = this.currentWinnings.toLocaleString();
        this.finalMessage.textContent = message;
        this.gameOverModal.style.display = 'flex';
        
        // Celebration effect
        if (won) {
            document.getElementById('celebration').style.display = 'block';
            this.showConfetti();
        }
    }

    showConfetti() {
        // Simple confetti effect
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1001';
            confetti.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear forwards`;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    restartGame() {
        this.gameOverModal.style.display = 'none';
        document.getElementById('celebration').style.display = 'none';
        this.startGame();
    }
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new KBCGame();
});
