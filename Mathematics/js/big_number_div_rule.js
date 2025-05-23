let divisor, dividend, quotient;

function generateDivision() {
  const quizTable = document.getElementById("quiz-table");
  quizTable.innerHTML = "";

  // 두 자리 ÷ 두 자리로 구성
  divisor = Math.floor(Math.random() * 90) + 10;
  quotient = Math.floor(Math.random() * 90) + 10;
  dividend = divisor * quotient;

  const dividendStr = dividend.toString();
  const quotientStr = quotient.toString();
  const digitCount = dividendStr.length;

  // 1. 몫 입력칸 (윗줄)
  const answerRow = document.createElement("tr");
  answerRow.innerHTML = `<td></td><td colspan="${digitCount}" style="text-align:center;">` +
    quotientStr.split('').map(() =>
      `<input type="text" class="final-answer" inputmode="numeric" maxlength="1" style="width: 30px; text-align: center;" />`
    ).join('') +
    `</td>`;
  quizTable.appendChild(answerRow);

  // 2. 긴 나눗셈 아래 줄
  const problemRow = document.createElement("tr");
  problemRow.innerHTML = `<td class="highlight-column" rowspan="1" style="font-weight: bold;">${divisor}</td>` +
    dividendStr.split('').map(d => `<td>${d}</td>`).join('');
  quizTable.appendChild(problemRow);
}

function checkDivisionAnswer() {
  const inputs = document.querySelectorAll(".final-answer");
  const userInput = Array.from(inputs).map(input => input.value).join('');
  const user = parseInt(userInput.trim());
  const result = document.getElementById("result");

  if (user === quotient) {
    result.textContent = "정답입니다! 🎉";
    result.style.color = "green";
  } else {
    result.textContent = `틀렸어요. 정답은 ${quotient}입니다.`;
    result.style.color = "red";
  }
}
