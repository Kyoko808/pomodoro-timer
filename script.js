const timerDisplay = document.getElementById('timer-display');
const statusDisplay = document.getElementById('status-display');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const testSoundButton = document.getElementById('test-sound-button');

let timer;
let timeLeft;
let isPaused = true;
let currentSession = 'work'; // 'work' or 'short-break' or 'long-break'
let workSessionsCompleted = 0;

const WORK_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
const LONG_BREAK_TIME = 15 * 60; // 15 minutes

const notificationAudio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
    
    let stageInfo = '';
    if (currentSession === 'work') {
        stageInfo = `作業時間 (ポモドーロ ${workSessionsCompleted + 1})`;
    } else if (currentSession === 'short-break') {
        stageInfo = '短い休憩';
    } else {
        stageInfo = '長い休憩';
    }
    statusDisplay.textContent = stageInfo;
}

function getSessionDuration() {
    if (currentSession === 'work') return WORK_TIME;
    if (currentSession === 'short-break') return SHORT_BREAK_TIME;
    return LONG_BREAK_TIME;
}

function playNotificationSound() {
    const promise = notificationAudio.play();
    if (promise !== undefined) {
        promise.catch(error => {
            console.error("Audio playback failed:", error);
        });
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
    timeLeft = getSessionDuration();
    updateDisplay();
}

function nextSession() {
    if (currentSession === 'work') {
        workSessionsCompleted++;
        if (workSessionsCompleted % 4 === 0) {
            currentSession = 'long-break';
        } else {
            currentSession = 'short-break';
        }
    } else {
        currentSession = 'work';
    }
    timeLeft = getSessionDuration();
    isPaused = true;
    updateDisplay();
}

// Initial setup
resetTimer();

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
if (testSoundButton) {
    testSoundButton.addEventListener('click', playNotificationSound);
}
