const params = new URLSearchParams(window.location.search);
const type = params.get("type");
const first = parseInt(params.get("first") || "1");
const second = parseInt(params.get("second") || "1");
const page = parseInt(params.get("page") || "1");
const timeLimit = parseInt(params.get("time") || (60 + (first + second) * 5));
let timeLeft = timeLimit;

if ((type === "sub" || type === "div") && first < second) {
  alert("❌ 뺄셈과 나눗셈은 첫 번째 수의 자리수가 두 번째 수보다 크거나 같아야 합니다.");
  throw new Error("Invalid digit setting for subtraction or division.");
}

let isSubmitted = false;

function getRange(digits) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return [min, max];
}

function generateProblem(type, firstDigits, secondDigits) {
  const [minA, maxA] = getRange(firstDigits);
  const [minB, maxB] = getRange(secondDigits);

  let a = Math.floor(Math.random() * (maxA - minA + 1)) + minA;
  let b = Math.floor(Math.random() * (maxB - minB + 1)) + minB;

  if (type === "sub" && a < b) [a, b] = [b, a];
  if (type === "div") {
    const minK = Math.ceil(minA / b);
    const maxK = Math.floor(maxA / b);
    const k = Math.floor(Math.random() * (maxK - minK + 1)) + minK;
    a = b * k;
  }

  const operator = { add: "+", sub: "-", mul: "×", div: "÷" }[type];
  const expression = type === "mul" ? `${a}*${b}` :
                     type === "div" ? `${a}/${b}` :
                     `${a}${operator}${b}`;
  return { a, b, operator, expression, answer: eval(expression) };
}

const container = document.getElementById("question-container");
const problems = [];
let onesCount = 0;

for (let i = 1; i <= 9; i++) {
  let prob;
  let attempt = 0;

  do {
    prob = generateProblem(type, first, second);
    attempt++;
    if (attempt > 10) break;
  } while (prob.answer === 1 && onesCount >= 1);

  if (prob.answer === 1) onesCount++;
  problems.push(prob);

  const div = document.createElement("div");
  div.className = "question";
  div.innerHTML = `
    <div class="problem-line">
      <span class="no">${(page - 1) * 9 + i}.</span>
      <span class="num">${prob.a}</span>
      <span class="op">${prob.operator}</span>
      <span class="num">${prob.b}</span>
      <span class="eq">=</span>
      <input type="number" class="answer" data-index="${i - 1}" inputmode="numeric" />
    </div>
  `;
  container.appendChild(div);
}

const inputs = document.querySelectorAll(".answer");
inputs.forEach((input, idx) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputs[idx + 1];
      if (nextInput) {
        nextInput.focus();
      } else {
        document.getElementById("submitBtn").click();
      }
    }
  });
});

const pageIndicator = document.getElementById("page-indicator");
pageIndicator.textContent = `${page} / 6 페이지`;

function checkAnswers() {
  let correct = 0;
  inputs.forEach((input, idx) => {
    const userAnswer = input.value.trim();
    const correctAnswer = problems[idx].answer.toString();

    if (userAnswer === correctAnswer) {
      input.style.backgroundColor = "#d4fcd4";
      correct++;
    } else {
      input.style.backgroundColor = "#ffd6d6";
    }
  });
  return correct === problems.length;
}

document.getElementById("submitBtn").onclick = () => {
  isSubmitted = true;
  const allCorrect = checkAnswers();
  const correctCount = problems.filter((p, i) => {
    return inputs[i].value.trim() === p.answer.toString();
  }).length;

  const user = firebase.auth().currentUser;
  if (user) {
    // 결과 저장
    firebase.firestore().collection("math")
      .doc("fth_role_log")
      .collection(user.uid)
      .add({
        uid: user.uid,
        type,
        first,
        second,
        page,
        correctCount,
        timestamp: new Date(),
        timeUsed: timeLimit - timeLeft
      })
      .then(() => console.log("결과 저장 완료"))
      .catch((err) => console.error("결과 저장 실패", err));

    // 틀린 문제 저장
    const wrongProblemsRef = firebase.firestore()
      .collection("wrongProblems")
      .doc(user.uid)
      .collection("list");

    problems.forEach((prob, i) => {
      const userAnswer = inputs[i].value.trim();
      const correctAnswer = prob.answer.toString();

      if (userAnswer !== correctAnswer) {
        const problemId = `${type}_${prob.a}_${prob.operator}_${prob.b}`;
        wrongProblemsRef.doc(problemId).set({
          problem: prob,
          input: userAnswer,
          correct: correctAnswer,
          timestamp: new Date()
        });
      }
    });
  }

  if (allCorrect) {
    alert("🎉 모두 정답입니다!");
  } else {
    alert("❗틀린 문제가 있어요. 다시 확인해보세요.");
  }
};


function movePage(offset) {
  if (!isSubmitted) {
    alert("먼저 제출 버튼을 눌러 정답을 확인해주세요!");
    return;
  }

  const newPage = page + offset;
  if (newPage < 1 || newPage > 6) return;

  window.location.href = `binary_4th_rule_operation.html?type=${type}&first=${first}&second=${second}&time=${timeLimit}&page=${newPage}`;
}

// ✅ 타이머 실행
const timer = document.getElementById("timer");
if (timer) {
  timer.style.display = "inline-block";
  function updateTimer() {
    const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const sec = String(timeLeft % 60).padStart(2, "0");
    timer.textContent = `${min}:${sec}`;
    if (timeLeft > 0) {
      timeLeft--;
      setTimeout(updateTimer, 1000);
    }
  }
  updateTimer();
}
