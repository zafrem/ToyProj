const startSound = new Audio('sounds/start.mp3');
const stopSound = new Audio('sounds/pause.mp3');
const switchSound = new Audio('sounds/switch.mp3');
const completeSound = new Audio('sounds/complete.mp3');

const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type') || 'Timer';
const workSeconds = parseInt(urlParams.get('work')) || 1500;
const breakSeconds = parseInt(urlParams.get('break')) || 300;
const repeatCount = parseInt(urlParams.get('repeat')) || 4;

const toggleButton = document.getElementById('start');
const backButton = document.getElementById('back');
const timerDisplay = document.getElementById('timer');
const quoteDisplay = document.getElementById('quote');

document.getElementById('title').textContent = type;

let isWork = true;
let interval = null;
let cycleCount = 0;
let remainingSeconds = workSeconds;

function startTimer() {
  setBackground();
  interval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();

    if (remainingSeconds <= 0) {
      clearInterval(interval);
      if (isWork) cycleCount++;
      if (cycleCount >= repeatCount && !isWork) {
        toggleButton.textContent = 'Finished';
        completeSound.play();
        return;
      }
      isWork = !isWork;
      remainingSeconds = isWork ? workSeconds : breakSeconds;
      showRandomQuote();
      switchSound.play();
      startTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
  document.body.style.backgroundColor = "#333";
}

function toggleTimer() {
  if (interval === null) {
    startTimer();
    toggleButton.textContent = 'Stop';
    startSound.play();
  } else {
    stopTimer();
    toggleButton.textContent = 'Pause';
    stopSound.play();
  }
}

function setBackground() {
  document.body.style.backgroundColor = isWork ? '#ffc1c1' : '#c1ffd7';
}

function updateTimerDisplay() {
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  if (hours > 0) {
    timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } else {
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}

const quotes = [
  "Stay focused and never give up.",
  "Small steps every day.",
  "Progress, not perfection.",
  "Discipline is the bridge between goals and success.",
  "One task at a time, one day at a time.",
  "Success is built on consistency.",
  "Don’t stop when you’re tired. Stop when you’re done.",
  "The future depends on what you do today."
];

function showRandomQuote() {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  quoteDisplay.textContent = `"${random}"`;
}

if (toggleButton) toggleButton.addEventListener('click', toggleTimer);
if (timerDisplay) timerDisplay.addEventListener('click', toggleTimer);
if (backButton) backButton.addEventListener('click', () => window.history.back());

updateTimerDisplay();
showRandomQuote();

document.body.addEventListener('click', (event) => {
  const tag = event.target.tagName;
  if (tag !== 'BUTTON') {
    toggleTimer();
  }
});
