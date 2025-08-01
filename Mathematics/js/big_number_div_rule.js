let divisor, dividend, quotient, remainder, divisionSteps = [];

// Get URL parameters for difficulty configuration
function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    dividend_digits: parseInt(urlParams.get('dividend_digits')) || 5,
    divisor_digits: parseInt(urlParams.get('divisor_digits')) || 2
  };
}

function generateDivision() {
  const quizTable = document.getElementById("quiz-table");
  quizTable.innerHTML = "";

  const params = getUrlParams();
  const dividendDigits = params.dividend_digits;
  const divisorDigits = params.divisor_digits;

  // Update title based on parameters
  const title = document.getElementById("problem-title");
  if (title) {
    title.textContent = `${dividendDigits}-digit ÷ ${divisorDigits}-digit Vertical Division`;
  }

  // Clear previous helper if exists
  const existingHelper = document.getElementById("division-helper");
  if (existingHelper) {
    existingHelper.remove();
  }

  // Clear previous result
  const result = document.getElementById("result");
  if (result) {
    result.textContent = "";
  }

  // Generate numbers based on difficulty level
  const maxDivisor = Math.pow(10, divisorDigits) - 1;
  const minDivisor = Math.pow(10, divisorDigits - 1);
  const quotientDigits = Math.max(1, dividendDigits - divisorDigits + 1);
  const maxQuotient = Math.pow(10, quotientDigits) - 1;
  const minQuotient = Math.pow(10, quotientDigits - 1);

  divisor = Math.floor(Math.random() * (maxDivisor - minDivisor + 1)) + minDivisor;
  quotient = Math.floor(Math.random() * (maxQuotient - minQuotient + 1)) + minQuotient;
  remainder = Math.floor(Math.random() * divisor);
  dividend = divisor * quotient + remainder;

  const dividendStr = dividend.toString();
  const quotientStr = quotient.toString();
  const divisorStr = divisor.toString();

  // Calculate long division steps
  calculateDivisionSteps();

  // Add division helper before layout
  addDivisionHelper();
  
  // Create the long division layout
  createLongDivisionLayout();
}

function calculateDivisionSteps() {
  divisionSteps = [];
  const dividendStr = dividend.toString();
  let currentDividend = 0;
  let position = 0;

  for (let i = 0; i < quotient.toString().length; i++) {
    // Bring down the next digit(s)
    while (currentDividend < divisor && position < dividendStr.length) {
      currentDividend = currentDividend * 10 + parseInt(dividendStr[position]);
      position++;
    }

    if (currentDividend >= divisor) {
      const stepQuotient = Math.floor(currentDividend / divisor);
      const stepProduct = stepQuotient * divisor;
      const stepRemainder = currentDividend - stepProduct;

      divisionSteps.push({
        dividend: currentDividend,
        quotientDigit: stepQuotient,
        product: stepProduct,
        remainder: stepRemainder,
        position: i
      });

      currentDividend = stepRemainder;
    }
  }
}

function createLongDivisionLayout() {
  const quizTable = document.getElementById("quiz-table");
  const dividendStr = dividend.toString();
  const quotientStr = quotient.toString();
  const totalCols = Math.max(dividendStr.length + 2, quotientStr.length + 2);

  // Create quotient input row (properly aligned above dividend)
  const quotientRow = document.createElement("tr");
  const quotientCells = [];
  
  // Add spacing for divisor area
  quotientCells.push('<td colspan="2"></td>');
  
  // Add empty cells to right-align quotient above dividend
  const quotientOffset = dividendStr.length - quotientStr.length;
  for (let i = 0; i < quotientOffset; i++) {
    quotientCells.push('<td></td>');
  }
  
  // Add quotient input cells
  quotientStr.split('').forEach(() => {
    quotientCells.push('<td><input type="text" class="quotient-input" inputmode="numeric" maxlength="1" style="width:100%; text-align:center; border-bottom: 2px solid #333;" /></td>');
  });
  
  quotientRow.innerHTML = quotientCells.join('');
  quizTable.appendChild(quotientRow);

  // Create division bracket and dividend
  const divisionRow = document.createElement("tr");
  divisionRow.innerHTML = 
    `<td class="highlight-column" style="font-weight: bold; border-right: 3px solid #333; border-top: 3px solid #333;">${divisor}</td>` +
    `<td style="border-top: 3px solid #333; border-right: 3px solid #333;">)</td>` +
    dividendStr.split('').map(d => `<td style="border-top: 3px solid #333;">${d}</td>`).join('');
  quizTable.appendChild(divisionRow);

  // Create workspace for long division steps
  createDivisionWorkspace();
}

function createDivisionWorkspace() {
  const quizTable = document.getElementById("quiz-table");
  const dividendLength = dividend.toString().length;

  // Add workspace rows for each division step
  divisionSteps.forEach((step, index) => {
    // Row for subtraction (product of divisor and quotient digit)
    const productRow = document.createElement("tr");
    const productStr = step.product.toString();
    const padding = Array(2 + step.position).fill('<td></td>').join('');
    const productCells = productStr.split('').map(d => 
      `<td><input type="text" class="step-input" inputmode="numeric" maxlength="1" placeholder="${d}" /></td>`
    ).join('');
    const remainingCells = Array(Math.max(0, dividendLength - step.position - productStr.length)).fill('<td></td>').join('');
    
    productRow.innerHTML = padding + productCells + remainingCells;
    quizTable.appendChild(productRow);

    // Separator line for subtraction
    const separatorRow = document.createElement("tr");
    separatorRow.innerHTML = Array(2 + step.position).fill('<td></td>').join('') +
      Array(productStr.length).fill('<td style="border-bottom: 1px solid #666;"></td>').join('') +
      Array(Math.max(0, dividendLength - step.position - productStr.length)).fill('<td></td>').join('');
    quizTable.appendChild(separatorRow);

    // Row for remainder
    if (index < divisionSteps.length - 1 || step.remainder > 0) {
      const remainderRow = document.createElement("tr");
      const remainderStr = step.remainder > 0 ? step.remainder.toString() : '';
      const remainderCells = remainderStr.split('').map(d => 
        `<td><input type="text" class="step-input" inputmode="numeric" maxlength="1" placeholder="${d}" /></td>`
      ).join('');
      
      remainderRow.innerHTML = Array(2 + step.position).fill('<td></td>').join('') + 
        remainderCells + Array(Math.max(0, dividendLength - step.position - remainderStr.length)).fill('<td></td>').join('');
      quizTable.appendChild(remainderRow);
    }
  });
}

function addDivisionHelper() {
  const helperDiv = document.createElement("div");
  helperDiv.id = "division-helper";
  helperDiv.innerHTML = `
    <div style="margin: 20px auto; padding: 15px; background: #f0f8ff; border-radius: 8px; text-align: left; max-width: 600px;">
      <h4 style="margin: 0 0 10px 0; text-align: left;">Division Help:</h4>
      <p id="div-step-hint" style="text-align: left; margin: 5px 0;">Start dividing from left to right!</p>
      <div style="text-align: left;">
        <button onclick="showDivisionStep()" id="div-hint-btn">Show Step-by-Step</button>
        <button onclick="fillDivisionSteps()" id="div-fill-btn" style="margin-left: 10px;">Fill Steps</button>
        <button onclick="resetDivision()" id="div-reset-btn" style="margin-left: 10px;">Reset</button>
      </div>
      <div id="division-explanation" style="margin-top: 10px; font-size: 14px; color: #666; text-align: left;"></div>
    </div>
  `;
  
  // Insert after the card area
  const cardArea = document.getElementById("card-area");
  cardArea.parentNode.insertBefore(helperDiv, cardArea.nextSibling);
}

let divCurrentStep = 0;

function showDivisionStep() {
  if (divCurrentStep < divisionSteps.length) {
    const step = divisionSteps[divCurrentStep];
    
    document.getElementById("div-step-hint").innerHTML = 
      `Step ${divCurrentStep + 1}: ${step.dividend} ÷ ${divisor} = ${step.quotientDigit} (remainder ${step.remainder})`;
    
    document.getElementById("division-explanation").innerHTML = 
      `${step.dividend} ÷ ${divisor} = ${step.quotientDigit}<br>` +
      `${divisor} × ${step.quotientDigit} = ${step.product}<br>` +
      `${step.dividend} - ${step.product} = ${step.remainder}`;
    
    divCurrentStep++;
    
    if (divCurrentStep >= divisionSteps.length) {
      document.getElementById("div-hint-btn").textContent = "All steps complete!";
      document.getElementById("div-hint-btn").disabled = true;
      
      if (remainder > 0) {
        document.getElementById("div-step-hint").innerHTML += `<br>Final remainder: ${remainder}`;
      }
    }
  }
}

function fillDivisionSteps() {
  // Fill quotient
  const quotientInputs = document.querySelectorAll(".quotient-input");
  quotient.toString().split('').forEach((digit, index) => {
    if (quotientInputs[index]) {
      quotientInputs[index].value = digit;
      quotientInputs[index].style.backgroundColor = "#e8f5e8";
    }
  });

  // Fill step inputs
  const stepInputs = document.querySelectorAll(".step-input");
  let inputIndex = 0;
  
  divisionSteps.forEach(step => {
    // Fill product
    step.product.toString().split('').forEach(digit => {
      if (stepInputs[inputIndex]) {
        stepInputs[inputIndex].value = digit;
        stepInputs[inputIndex].style.backgroundColor = "#e8f5e8";
        inputIndex++;
      }
    });
    
    // Fill remainder if not zero
    if (step.remainder > 0) {
      step.remainder.toString().split('').forEach(digit => {
        if (stepInputs[inputIndex]) {
          stepInputs[inputIndex].value = digit;
          stepInputs[inputIndex].style.backgroundColor = "#ffe8e8";
          inputIndex++;
        }
      });
    }
  });
}

function resetDivision() {
  divCurrentStep = 0;
  document.getElementById("div-step-hint").textContent = "Start dividing from left to right!";
  document.getElementById("div-hint-btn").textContent = "Show Step-by-Step";
  document.getElementById("div-hint-btn").disabled = false;
  document.getElementById("division-explanation").innerHTML = "";
  
  // Clear all inputs
  document.querySelectorAll(".quotient-input, .step-input").forEach(input => {
    input.value = "";
    input.style.backgroundColor = "";
  });
}

function checkDivisionAnswer() {
  const quotientInputs = document.querySelectorAll(".quotient-input");
  const userQuotient = Array.from(quotientInputs).map(input => input.value).join('');
  const userQuotientNum = parseInt(userQuotient.trim());
  
  const result = document.getElementById("result");

  if (userQuotientNum === quotient) {
    result.textContent = remainder > 0 ? 
      `Correct! 🎉 (remainder: ${remainder})` : 
      "Correct! 🎉";
    result.style.color = "green";
  } else {
    result.textContent = `Incorrect. The answer is ${quotient}${remainder > 0 ? ` (remainder ${remainder})` : ''}.`;
    result.style.color = "red";
    fillDivisionSteps();
  }
}
