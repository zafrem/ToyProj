let num1, num2, answer;

function makeRightAlignedCells(digits, totalLen) {
  const empty = Array(Math.max(0, totalLen - digits.length)).fill('<td></td>').join('');
  const cells = digits.map(d => `<td>${d}</td>`).join('');
  return empty + cells;
}

function generateMultiplication() {
  num1 = Math.floor(Math.random() * 9000) + 1000;
  num2 = Math.floor(Math.random() * 90) + 10;
  answer = num1 * num2;

  const num1Digits = num1.toString().split('');
  const num2Digits = num2.toString().split('');
  const maxLength = Math.max(num1Digits.length, num2Digits.length + 1) + 2;

  // 문제(quiz-table)
  document.getElementById("quiz-table").innerHTML =
    `<tr><td class="highlight-column"></td>${makeRightAlignedCells(num1Digits, maxLength)}</tr>` +
    `<tr><td class="highlight-column">×</td>${makeRightAlignedCells(num2Digits, maxLength)}</tr>`;

  // 중간 곱(mid-table)
  const midTable = document.getElementById("mid-table");
  midTable.innerHTML = '';
  const reversed = num2Digits.slice().reverse();
  reversed.forEach((digit, idx) => {
    const partial = (num1 * parseInt(digit)).toString().padStart(maxLength - idx, ' ');
const row = `<tr><td class="highlight-column"></td>${partial.split('').map(ch =>
  ch === ' '
    ? `<td class="empty-cell"></td>`  // 공백도 td로 표현
    : `<td><input type="text" class="midstep" inputmode="numeric" maxlength="1" /></td>`
).join('')}</tr>`;
    midTable.innerHTML += row;
  });

  // 정답(answer-table)
  const answerStr = answer.toString().padStart(maxLength, ' ');
  document.getElementById("answer-table").innerHTML =
    `<tr><td class="highlight-column">=</td>${answerStr.split('').map(ch =>
      ch === ' '
        ? ''
        : `<td><input type="text" class="final-answer" inputmode="numeric" maxlength="1" /></td>`
    ).join('')}</tr>`;
}

function checkMultiplicationAnswer() {
  const inputs = document.querySelectorAll(".final-answer");
  const userInput = Array.from(inputs).map(input => input.value).join('');
  const user = parseInt(userInput.trim());
  const result = document.getElementById("result");

  if (user === answer) {
    result.textContent = "정답입니다! 🎉";
    result.style.color = "green";
  } else {
    result.textContent = `틀렸어요. 정답은 ${answer}입니다.`;
    result.style.color = "red";
  }
}
