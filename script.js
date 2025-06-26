const timerDisplay = document.getElementById('timer-display');
const statusDisplay = document.getElementById('status-display');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');

let timer;
let timeLeft;
let isPaused = true;
let currentSession = 'work'; // 'work' or 'short-break' or 'long-break'
let workSessionsCompleted = 0;

const WORK_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
const LONG_BREAK_TIME = 15 * 60; // 15 minutes

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
    if (currentSession === 'work') {
        statusDisplay.textContent = '作業時間';
    } else if (currentSession === 'short-break') {
        statusDisplay.textContent = '短い休憩';
    } else {
        statusDisplay.textContent = '長い休憩';
    }
}

function startTimer() {
    if (!isPaused) return;

    isPaused = false;
    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            playNotificationSound();
            nextSession();
        }
    }, 1000);
}

function pauseTimer() {
    isPaused = true;
    clearInterval(timer);
}

function resetTimer() {
    pauseTimer();
    workSessionsCompleted = 0;
    currentSession = 'work';
    timeLeft = WORK_TIME;
    updateDisplay();
}

function nextSession() {
    if (currentSession === 'work') {
        workSessionsCompleted++;
        if (workSessionsCompleted % 4 === 0) {
            currentSession = 'long-break';
            timeLeft = LONG_BREAK_TIME;
        } else {
            currentSession = 'short-break';
            timeLeft = SHORT_BREAK_TIME;
        }
    } else {
        currentSession = 'work';
        timeLeft = WORK_TIME;
    }
    updateDisplay();
    startTimer();
}

function playNotificationSound() {
    const audio = new Audio('https://www.soundjay.com/buttons/beep-07.wav'); // Example sound
    audio.play();
}

// Initial setup
resetTimer();

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
