let num1, num2, operator, answer;

function generateProblem() {
  const operators = ["+", "-"];
  operator = operators[Math.floor(Math.random() * operators.length)];

  num1 = Math.floor(Math.random() * 900000) + 100000;
  num2 = Math.floor(Math.random() * 90000) + 10000;

  if (operator === "-" && num2 > num1) {
    [num1, num2] = [num2, num1];
  }

  if (operator === "+") answer = num1 + num2;
  else if (operator === "-") answer = num1 - num2;
  else if (operator === "×") answer = num1 * num2;

  const num1Len = num1.toString().length;
  const num2Len = num2.toString().length;
  const maxLength = num1Len + num2Len;

  const table = document.getElementById("quiz-table");
  table.innerHTML = "";

  // 1. 자릿수 레이블
  const units = ["억", "천만", "백만", "십만", "만", "천", "백", "십", "일"];
  const labelRow = document.createElement("tr");
  labelRow.className = "label";
  const emptyCells = Array(Math.max(0, maxLength - units.length)).fill("<td></td>").join('');
  const unitCells = units.slice(-maxLength).map(u => `<td>${u}</td>`).join('');
  labelRow.innerHTML = `<td></td>` + emptyCells + unitCells;
  table.appendChild(labelRow);

  // 2. 첫 번째 수 (문제 숫자)
  const row1 = document.createElement("tr");
  row1.innerHTML = `<td></td>` + pad(num1, maxLength).split('').map(d => `<td>${d}</td>`).join('');
  table.appendChild(row1);

  // 3. 두 번째 수 + 연산자
  const row2 = document.createElement("tr");
  row2.innerHTML = `<td class="operator-cell">${operator}</td>` + pad(num2, maxLength).split('').map(d => `<td>${d}</td>`).join('');
  table.appendChild(row2);

  if (operator === "×") {
    const num2Digits = pad(num2, num2Len).split('').reverse(); // 일의 자리부터 접근
    const num1Str = num1.toString();
    const partials = [];

    // 자리수별 곱셈 결과를 배열로 저장
    for (let i = 0; i < num2Digits.length; i++) {
      const digit = parseInt(num2Digits[i]);
      const rawPartial = (num1 * digit).toString();
      const shifted = ' '.repeat(i) + rawPartial.padStart(maxLength - i, ' ');
      partials.push(shifted);
    }

    // separator 줄 추가
    const separator2 = document.createElement("tr");
    separator2.className = "separator-row";
    separator2.innerHTML = `<td></td>` + Array(maxLength).fill("<td></td>").join('');
    table.appendChild(separator2);

    partials.forEach((partial, rowIdx) => {
      const row = document.createElement("tr");

      const sliced = partial.slice(0, maxLength - rowIdx); // 왼쪽으로 슬라이스!
      row.innerHTML = Array.from({ length: maxLength }).map((_, idx) => {
        if (idx < rowIdx) {
          return `<td class="empty-cell"></td>`; // 앞쪽은 빈칸
        }
        const ch = sliced[idx - rowIdx];
        return ch === ' ' || ch === undefined ? `<td class="empty-cell"></td>` :
        `<td><input type="text" class="midstep" value="${ch}" disabled style="width:100%; text-align:center; background:#eef;" /></td>`;
        }).join('');

      table.appendChild(row);
    });
    document.getElementById("result").textContent = "";
  }
  const answerTable = document.getElementById("answer-table");
  answerTable.innerHTML = "";
  const answerRow = document.createElement("tr");

  answerRow.innerHTML = `<td>=</td>` + Array.from({ length: maxLength }).map(() =>
    `<td><input type="text" class="final-answer" inputmode="numeric" maxlength="1" style="width:100%; text-align:center;" /></td>`
  ).join('');
  answerTable.appendChild(answerRow);
}



// 숫자를 왼쪽 정렬로 채워주는 도우미
function pad(number, length) {
  return number.toString().padStart(length, ' ');
}

function checkAnswer() {
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
