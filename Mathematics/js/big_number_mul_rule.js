let num1, num2, answer, partialProducts = [];

// Get URL parameters for difficulty configuration
function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    num1_digits: parseInt(urlParams.get('num1_digits')) || 4,
    num2_digits: parseInt(urlParams.get('num2_digits')) || 2
  };
}

function makeRightAlignedCells(digitStr, totalLen) {
  const digits = typeof digitStr === 'string' ? digitStr : digitStr.join('');
  const empty = Array(Math.max(0, totalLen - digits.length)).fill('<td class="empty-cell"></td>');
  const cells = digits.split('').map(d => `<td>${d}</td>`);
  return empty.concat(cells).join('');
}

function generateMultiplication() {
  const params = getUrlParams();
  const num1Digits = params.num1_digits;
  const num2Digits = params.num2_digits;

  // Update title based on parameters
  const title = document.getElementById("problem-title");
  if (title) {
    title.textContent = `${num1Digits}-digit × ${num2Digits}-digit Vertical Multiplication`;
  }

  // Clear previous helper if exists
  const existingHelper = document.getElementById("multiplication-helper");
  if (existingHelper) {
    existingHelper.remove();
  }

  // Clear previous result
  const result = document.getElementById("result");
  if (result) {
    result.textContent = "";
  }

  // Generate numbers based on difficulty level
  const maxNum1 = Math.pow(10, num1Digits) - 1;
  const minNum1 = Math.pow(10, num1Digits - 1);
  const maxNum2 = Math.pow(10, num2Digits) - 1;
  const minNum2 = Math.pow(10, num2Digits - 1);

  num1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1)) + minNum1;
  num2 = Math.floor(Math.random() * (maxNum2 - minNum2 + 1)) + minNum2;
  answer = num1 * num2;

  const num1DigitsArray = num1.toString().split('');
  const num2DigitsArray = num2.toString().split('');
  const maxLength = Math.max(num1DigitsArray.length + num2DigitsArray.length, answer.toString().length);

  // Calculate partial products
  partialProducts = [];
  const num2Reversed = num2DigitsArray.slice().reverse();
  num2Reversed.forEach((digit, placeIndex) => {
    const partialResult = num1 * parseInt(digit);
    const shifted = partialResult * Math.pow(10, placeIndex);
    partialProducts.push({
      digit: parseInt(digit),
      result: partialResult,
      shifted: shifted,
      placeIndex: placeIndex
    });
  });

  // Problem display (quiz-table)
  const quizTable = document.getElementById("quiz-table");
  quizTable.innerHTML = '';

  // Place value labels
  const units = ["10M", "M", "100K", "10K", "1K", "100", "10", "1"];
  const labelRow = document.createElement("tr");
  const usedUnits = units.slice(-maxLength);
  labelRow.innerHTML = `<td></td>` + usedUnits.map(u => `<td style="font-size:12px; color:#666;">${u}</td>`).join('');
  quizTable.appendChild(labelRow);

  // First number (right-aligned)
  const row1 = document.createElement("tr");
  row1.innerHTML = `<td></td>${makeRightAlignedCells(num1.toString(), maxLength)}`;
  quizTable.appendChild(row1);

  // Second number with multiplication sign (right-aligned)
  const row2 = document.createElement("tr");
  row2.innerHTML = `<td class="operator-cell">×</td>${makeRightAlignedCells(num2.toString(), maxLength)}`;
  quizTable.appendChild(row2);


  // Partial products (mid-table)
  const midTable = document.getElementById("mid-table");
  midTable.innerHTML = '';
  
  partialProducts.forEach((partial, idx) => {
    const row = document.createElement("tr");
    const partialStr = partial.result.toString();
    
    // Create right-aligned partial product with proper zeros
    const totalCells = [];
    
    // Add empty cells for proper right alignment
    const leadingEmpty = maxLength - partialStr.length - partial.placeIndex;
    for (let i = 0; i < leadingEmpty; i++) {
      totalCells.push('<td class="empty-cell"></td>');
    }
    
    // Add the partial product digits
    partialStr.split('').forEach(d => {
      totalCells.push(`<td><input type="text" class="midstep" inputmode="numeric" maxlength="1" placeholder="${d}" /></td>`);
    });
    
    // Add trailing zeros for place value
    for (let i = 0; i < partial.placeIndex; i++) {
      totalCells.push(`<td><input type="text" class="midstep" inputmode="numeric" maxlength="1" placeholder="0" /></td>`);
    }
    
    row.innerHTML = `<td style="font-size:12px;">${partial.digit}×</td>` + totalCells.join('');
    midTable.appendChild(row);
  });

  // Add separator before final answer
  const midSeparator = document.createElement("tr");
  midSeparator.className = "separator-row";
  midSeparator.innerHTML = `<td></td>` + Array(maxLength).fill('<td class="separator-cell"></td>').join('');
  midTable.appendChild(midSeparator);

  // Add calculation helper before final answer
  addMultiplicationHelper();

  // Final answer (answer-table) - right-aligned
  const answerTable = document.getElementById("answer-table");
  answerTable.innerHTML = '';
  const answerRow = document.createElement("tr");
  
  const answerStr = answer.toString();
  const answerCells = [];
  
  // Add empty cells for right alignment
  for (let i = 0; i < maxLength - answerStr.length; i++) {
    answerCells.push('<td class="empty-cell"></td>');
  }
  
  // Add input cells for each digit of the answer
  for (let i = 0; i < answerStr.length; i++) {
    answerCells.push('<td><input type="text" class="final-answer" inputmode="numeric" maxlength="1" /></td>');
  }
  
  answerRow.innerHTML = `<td>=</td>` + answerCells.join('');
  answerTable.appendChild(answerRow);
}

function addMultiplicationHelper() {
  const helperDiv = document.createElement("div");
  helperDiv.id = "multiplication-helper";
  helperDiv.innerHTML = `
    <div style="margin: 20px auto; padding: 15px; background: #f0f8ff; border-radius: 8px; text-align: left; max-width: 600px;">
      <h4 style="margin: 0 0 10px 0; text-align: left;">Multiplication Help:</h4>
      <p id="mul-step-hint" style="text-align: left; margin: 5px 0;">Multiply by each digit separately!</p>
      <div style="text-align: left;">
        <button onclick="showMultiplicationStep()" id="mul-hint-btn">Show Step-by-Step</button>
        <button onclick="fillPartialProducts()" id="fill-btn" style="margin-left: 10px;">Fill Partial Products</button>
        <button onclick="resetMultiplication()" id="mul-reset-btn" style="margin-left: 10px;">Reset</button>
      </div>
    </div>
  `;
  
  // Insert after the card area
  const cardArea = document.getElementById("card-area");
  cardArea.parentNode.insertBefore(helperDiv, cardArea.nextSibling);
}

let mulCurrentStep = 0;

function showMultiplicationStep() {
  if (mulCurrentStep < partialProducts.length) {
    const partial = partialProducts[mulCurrentStep];
    const units = ["ones", "tens", "hundreds", "thousands", "ten thousands"];
    const place = units[partial.placeIndex] || `${Math.pow(10, partial.placeIndex)} place`;
    
    document.getElementById("mul-step-hint").innerHTML = 
      `${place}: ${num1} × ${partial.digit} = ${partial.result}`;
    
    mulCurrentStep++;
    
    if (mulCurrentStep >= partialProducts.length) {
      document.getElementById("mul-hint-btn").textContent = "All partial products complete!";
      document.getElementById("mul-hint-btn").disabled = true;
      document.getElementById("mul-step-hint").innerHTML += 
        `<br>Now add all partial products: ${partialProducts.map(p => p.shifted).join(' + ')} = ${answer}`;
    }
  }
}

function fillPartialProducts() {
  const midStepInputs = document.querySelectorAll(".midstep");
  let inputIndex = 0;
  
  partialProducts.forEach(partial => {
    const digits = partial.result.toString().split('');
    digits.forEach(digit => {
      if (midStepInputs[inputIndex]) {
        midStepInputs[inputIndex].value = digit;
        midStepInputs[inputIndex].style.backgroundColor = "#e8f5e8";
        inputIndex++;
      }
    });
  });
}

function resetMultiplication() {
  mulCurrentStep = 0;
  document.getElementById("mul-step-hint").textContent = "Multiply by each digit separately!";
  document.getElementById("mul-hint-btn").textContent = "Show Step-by-Step";
  document.getElementById("mul-hint-btn").disabled = false;
  
  // Clear all inputs
  document.querySelectorAll(".midstep, .final-answer").forEach(input => {
    input.value = "";
    input.style.backgroundColor = "";
  });
}

function checkMultiplicationAnswer() {
  // Check partial products first
  const midStepInputs = document.querySelectorAll(".midstep");
  let allPartialsCorrect = true;
  let inputIndex = 0;
  
  partialProducts.forEach(partial => {
    const digits = partial.result.toString().split('');
    digits.forEach(digit => {
      if (midStepInputs[inputIndex] && midStepInputs[inputIndex].value !== digit) {
        allPartialsCorrect = false;
      }
      inputIndex++;
    });
  });

  // Check final answer
  const finalInputs = document.querySelectorAll(".final-answer");
  const userFinalInput = Array.from(finalInputs).map(input => input.value).join('');
  const userFinal = parseInt(userFinalInput.trim());
  
  const result = document.getElementById("result");

  if (userFinal === answer && (allPartialsCorrect || midStepInputs.length === 0)) {
    result.textContent = "Correct! 🎉";
    result.style.color = "green";
  } else if (userFinal === answer) {
    result.textContent = "Final answer is correct, but please check your partial products.";
    result.style.color = "orange";
  } else {
    result.textContent = `Incorrect. The answer is ${answer}.`;
    result.style.color = "red";
    
    // Show correct partial products
    fillPartialProducts();
  }
}
