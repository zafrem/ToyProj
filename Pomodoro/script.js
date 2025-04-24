const timerDisplay = document.getElementById('timer');
const toggleButton = document.getElementById('start');
const backButton = document.getElementById('back');
const quoteDisplay = document.getElementById('quote');

let isWork = true;
let interval = null;
let remainingSeconds = 25 * 60;

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

function updateTimerDisplay() {
  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const seconds = String(remainingSeconds % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function setBackground() {
  document.body.style.backgroundColor = isWork ? '#ffc1c1' : '#c1ffd7';
}

function startTimer() {
  setBackground();
  interval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();

    if (remainingSeconds <= 0) {
      clearInterval(interval);
      isWork = !isWork;
      remainingSeconds = isWork ? 25 * 60 : 5 * 60;
      showRandomQuote();
      startTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
}

function toggleTimer() {
  if (interval === null) {
    toggleButton.textContent = 'Stop';
    startTimer();
  } else {
    toggleButton.textContent = 'Start';
    stopTimer();
  }
}

toggleButton.addEventListener('click', toggleTimer);
timerDisplay.addEventListener('click', toggleTimer);
backButton.addEventListener('click', () => window.history.back());

updateTimerDisplay();
showRandomQuote();
