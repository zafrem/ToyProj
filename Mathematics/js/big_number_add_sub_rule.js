let num1, num2, operator, answer, carryOvers = [];

// Get URL parameters for difficulty configuration
function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    digits: parseInt(urlParams.get('digits')) || 5,
    operation: urlParams.get('operation') || 'add'
  };
}

function generateProblem() {
  const params = getUrlParams();
  const digits = params.digits;
  const operation = params.operation;
  
  // Update title based on parameters
  const title = document.getElementById("problem-title");
  if (title) {
    const opName = operation === 'add' ? 'Addition' : 'Subtraction';
    title.textContent = `${digits}-digit Vertical ${opName}`;
  }

  // Clear previous helper if exists  
  const existingHelper = document.getElementById("calculation-helper");
  if (existingHelper) {
    existingHelper.remove();
  }

  // Clear previous result
  const result = document.getElementById("result");
  if (result) {
    result.textContent = "";
  }
  
  // Set operator based on URL parameter
  operator = operation === 'add' ? '+' : '-';

  // Generate numbers based on difficulty level
  const maxNum1 = Math.pow(10, digits) - 1;
  const minNum1 = Math.pow(10, digits - 1);
  const maxNum2 = Math.pow(10, Math.max(digits - 1, 2)) - 1;
  const minNum2 = Math.pow(10, Math.max(digits - 2, 1));

  num1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1)) + minNum1;
  num2 = Math.floor(Math.random() * (maxNum2 - minNum2 + 1)) + minNum2;

  if (operator === "-" && num2 > num1) {
    [num1, num2] = [num2, num1];
  }

  if (operator === "+") answer = num1 + num2;
  else if (operator === "-") answer = num1 - num2;

  const answerLen = answer.toString().length;
  const maxLength = Math.max(num1.toString().length, num2.toString().length, answerLen);
  
  carryOvers = new Array(maxLength + 1).fill(0);

  const table = document.getElementById("quiz-table");
  table.innerHTML = "";

  // 1. Place value labels  
  const units = ["10M", "M", "100K", "10K", "1K", "100", "10", "1"];
  const labelRow = document.createElement("tr");
  labelRow.className = "label";
  const usedUnits = units.slice(-maxLength);
  labelRow.innerHTML = `<td></td>` + usedUnits.map(u => `<td style="font-size:12px; color:#666;">${u}</td>`).join('');
  table.appendChild(labelRow);

  // 2. Carry row (initially hidden, shows when calculating)
  const carryRow = document.createElement("tr");
  carryRow.id = "carry-row";
  carryRow.innerHTML = `<td style="font-size:12px;">Carry</td>` + 
    Array.from({ length: maxLength }).map((_, i) => 
      `<td><input type="text" class="carry-input" inputmode="numeric" maxlength="1" style="width:100%; text-align:center; font-size:12px; color:#999;" /></td>`
    ).join('');
  table.appendChild(carryRow);

  // 3. First number (right-aligned)
  const row1 = document.createElement("tr");
  const num1Str = num1.toString();
  const num1Cells = Array(maxLength - num1Str.length).fill('<td class="empty-cell"></td>').concat(
    num1Str.split('').map(d => `<td>${d}</td>`)
  );
  row1.innerHTML = `<td></td>` + num1Cells.join('');
  table.appendChild(row1);

  // 4. Second number with operator (right-aligned)
  const row2 = document.createElement("tr");
  const num2Str = num2.toString();
  const num2Cells = Array(maxLength - num2Str.length).fill('<td class="empty-cell"></td>').concat(
    num2Str.split('').map(d => `<td>${d}</td>`)
  );
  row2.innerHTML = `<td class="operator-cell">${operator}</td>` + num2Cells.join('');
  table.appendChild(row2);


  // Add step-by-step calculation helper before answer section
  addCalculationHelper();

  // Answer section (right-aligned)
  const answerTable = document.getElementById("answer-table");
  answerTable.innerHTML = "";
  const answerRow = document.createElement("tr");

  const answerStr = answer.toString();
  const answerCells = [];
  
  // Add empty cells for right alignment 
  for (let i = 0; i < maxLength - answerStr.length; i++) {
    answerCells.push('<td class="empty-cell"></td>');
  }
  
  // Add input cells for each digit of the answer
  for (let i = 0; i < answerStr.length; i++) {
    answerCells.push('<td><input type="text" class="final-answer" inputmode="numeric" maxlength="1" style="width:100%; text-align:center;" /></td>');
  }

  answerRow.innerHTML = `<td>=</td>` + answerCells.join('');
  answerTable.appendChild(answerRow);
}



// Helper function to pad numbers with spaces
function pad(number, length) {
  return number.toString().padStart(length, ' ');
}

// Add step-by-step calculation helper
function addCalculationHelper() {
  const helperDiv = document.createElement("div");
  helperDiv.id = "calculation-helper";
  helperDiv.innerHTML = `
    <div style="margin: 20px auto; padding: 15px; background: #f0f8ff; border-radius: 8px; text-align: left; max-width: 600px;">
      <h4 style="margin: 0 0 10px 0; text-align: left;">Calculation Help:</h4>
      <p id="step-hint" style="text-align: left; margin: 5px 0;">Start calculating from the rightmost digit (ones place)!</p>
      <div style="text-align: left;">
        <button onclick="showNextStep()" id="hint-btn">Show Next Step</button>
        <button onclick="resetHints()" id="reset-btn" style="margin-left: 10px;">Start Over</button>
      </div>
    </div>
  `;
  
  // Insert after the card area
  const cardArea = document.getElementById("card-area");
  cardArea.parentNode.insertBefore(helperDiv, cardArea.nextSibling);
}

let currentStep = 0;

function showNextStep() {
  const num1Str = num1.toString().split('').reverse();
  const num2Str = num2.toString().split('').reverse();
  const maxLen = Math.max(num1Str.length, num2Str.length);
  
  if (currentStep < maxLen) {
    const digit1 = parseInt(num1Str[currentStep] || '0');
    const digit2 = parseInt(num2Str[currentStep] || '0');
    const carry = carryOvers[currentStep];
    
    let stepResult, newCarry = 0;
    if (operator === '+') {
      stepResult = digit1 + digit2 + carry;
      newCarry = Math.floor(stepResult / 10);
      stepResult = stepResult % 10;
    } else {
      stepResult = digit1 - digit2 - carry;
      if (stepResult < 0) {
        stepResult += 10;
        newCarry = 1;
      }
    }
    
    carryOvers[currentStep + 1] = newCarry;
    
    const units = ["ones", "tens", "hundreds", "thousands", "ten thousands"];
    const place = units[currentStep] || `${Math.pow(10, currentStep)} place`;
    
    document.getElementById("step-hint").innerHTML = 
      `${place}: ${digit1} ${operator} ${digit2}${carry > 0 ? ` ${operator === '+' ? '+' : '-'} ${carry} (carry)` : ''} = ${stepResult}${newCarry > 0 ? ` (carry ${newCarry})` : ''}`;
    
    // Show carry if exists
    if (newCarry > 0) {
      const carryInputs = document.querySelectorAll(".carry-input");
      if (carryInputs[currentStep]) {
        carryInputs[currentStep].value = newCarry;
        carryInputs[currentStep].style.color = "#ff6b6b";
      }
    }
    
    currentStep++;
    
    if (currentStep >= maxLen) {
      document.getElementById("hint-btn").textContent = "All steps complete!";
      document.getElementById("hint-btn").disabled = true;
    }
  }
}

function resetHints() {
  currentStep = 0;
  carryOvers = new Array(10).fill(0);
  document.getElementById("step-hint").textContent = "Start calculating from the rightmost digit (ones place)!";
  document.getElementById("hint-btn").textContent = "Show Next Step";
  document.getElementById("hint-btn").disabled = false;
  
  // Clear carry inputs
  document.querySelectorAll(".carry-input").forEach(input => {
    input.value = "";
    input.style.color = "#999";
  });
}

function checkAnswer() {
  const inputs = document.querySelectorAll(".final-answer");
  const userInput = Array.from(inputs).map(input => input.value).join('');
  const user = parseInt(userInput.trim());

  const result = document.getElementById("result");

  if (user === answer) {
    result.textContent = "Correct! 🎉";
    result.style.color = "green";
    
    // Show correct carries if user got it right
    const correctCarries = calculateCarries();
    const carryInputs = document.querySelectorAll(".carry-input");
    correctCarries.forEach((carry, i) => {
      if (carry > 0 && carryInputs[i]) {
        carryInputs[i].value = carry;
        carryInputs[i].style.color = "green";
      }
    });
  } else {
    result.textContent = `Incorrect. The answer is ${answer}.`;
    result.style.color = "red";
  }
}

function calculateCarries() {
  const num1Str = num1.toString().split('').reverse();
  const num2Str = num2.toString().split('').reverse();
  const maxLen = Math.max(num1Str.length, num2Str.length);
  const carries = new Array(maxLen + 1).fill(0);
  
  for (let i = 0; i < maxLen; i++) {
    const digit1 = parseInt(num1Str[i] || '0');
    const digit2 = parseInt(num2Str[i] || '0');
    
    if (operator === '+') {
      const sum = digit1 + digit2 + carries[i];
      carries[i + 1] = Math.floor(sum / 10);
    } else {
      const diff = digit1 - digit2 - carries[i];
      if (diff < 0) {
        carries[i + 1] = 1;
      }
    }
  }
  
  return carries;
}
