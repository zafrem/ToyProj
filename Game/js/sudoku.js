let problem = [];
let solution = [];
let inputs = [];

function loadRandomPuzzle() {
  fetch('../data/sudoku-data.json')
    .then(res => res.json())
    .then(data => {
      const index = Math.floor(Math.random() * data.length);
      const puzzle = data[index];
      problem = puzzle.problem;
      solution = puzzle.solution;

      const label = document.getElementById('difficulty-label');
      label.textContent = `난이도: ${puzzle.difficulty === 'easy' ? 'Easy 🟢' : 'Hard 🔴'}`;

      renderBoard();
    });
}


function renderBoard() {
  const board = document.getElementById('sudoku-board');
  board.innerHTML = '';
  inputs = [];

  for (let row = 0; row < 9; row++) {
    inputs[row] = [];
    for (let col = 0; col < 9; col++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.classList.add('cell');

      if (problem[row][col] !== '') {
        input.value = problem[row][col];
        input.disabled = true;
        input.classList.add('fixed');
      }

      input.style.border = '1px solid #ccc'
      inputs[row][col] = input;
      if (col % 3 === 0) input.style.borderLeft = '2px solid black';
      if (col === 8) input.style.borderRight = '2px solid black';
      if (row % 3 === 0) input.style.borderTop = '2px solid black';
      if (row === 8) input.style.borderBottom = '2px solid black';

      board.appendChild(input);

    }
  }

}

let checkCount = 0;

function checkSolution() {
  checkCount++;
  document.getElementById('check-count').textContent = `Check your answer: ${checkCount} Count`;

  let correct = true;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = inputs[row][col].value;
      if (parseInt(val) !== solution[row][col]) {
        inputs[row][col].classList.add('wrong');
        correct = false;
      } else {
        inputs[row][col].classList.remove('wrong');
      }
    }
  }

  if (correct) {
    alert('Correct answer! 🎉');
  }
}

window.onload = () => {
  loadRandomPuzzle();
  document.getElementById('reload-btn').onclick = loadRandomPuzzle;
  document.getElementById('back-btn').onclick = () => window.location.href = '../index.html';
};
