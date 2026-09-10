// Get elements from HTML
const display = document.getElementById("display");

const previousDisplay = document.getElementById("previousDisplay");

const errorMessage = document.getElementById("errorMessage");

const buttons = document.querySelector(".buttons");

// Stores the current calculation
let expression = "";

// Used to know whether the previous action was "="
let justCalculated = false;

// Update calculator display
function updateDisplay() {
  // If expression is empty, show 0
  display.value = expression || "0";
}

// Remove error message
function clearError() {
  errorMessage.textContent = "";
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
}

// Add number/operator to calculator
function addValue(value) {
  clearError();

  // If calculation was already completed
  // and user enters a number,
  // start a new calculation.
  if (justCalculated && /[0-9.]/.test(value)) {
    expression = "";

    previousDisplay.textContent = "";

    justCalculated = false;
  }

  // Handle decimal point
  if (value === ".") {
    // Get current number
    const currentNumber = expression.split(/[+\-*/%]/).pop();

    // Don't allow two decimal points
    if (currentNumber.includes(".")) {
      return;
    }

    // If user starts with decimal,
    // automatically add 0.
    if (currentNumber === "") {
      expression += "0";
    }
  }

  // Handle operators
  if (/[+\-*/%]/.test(value)) {
    justCalculated = false;

    // If expression is empty
    if (expression === "") {
      // Allow negative numbers
      if (value === "-") {
        expression = "-";
      }

      updateDisplay();

      return;
    }

    // Get last character
    const lastCharacter = expression[expression.length - 1];

    // Don't allow multiple operators
    if (/[+\-*/%]/.test(lastCharacter)) {
      expression = expression.slice(0, -1) + value;

      updateDisplay();

      return;
    }
  }

  // Add value
  expression += value;

  updateDisplay();
}

// Delete last character
function deleteLast() {
  clearError();

  justCalculated = false;

  expression = expression.slice(0, -1);

  updateDisplay();
}

// Clear calculator
function clearCalculator() {
  expression = "";

  justCalculated = false;

  previousDisplay.textContent = "";

  clearError();

  updateDisplay();
}

// Calculate result
function calculate() {
  clearError();

  // Nothing to calculate
  if (!expression) {
    return;
  }

  // Convert multiplication/division symbols
  const safeExpression = expression.replace(/×/g, "*").replace(/÷/g, "/");

  // Allow only numbers and basic operators
  if (!/^[0-9+\-*/%.\s]+$/.test(safeExpression)) {
    showError("Invalid input");

    return;
  }

  // Don't calculate incomplete expression
  if (/[+\-*/%.]$/.test(safeExpression)) {
    showError("Complete the calculation first");

    return;
  }

  try {
    // Calculate expression
    const result = Function('"use strict"; return (' + safeExpression + ")")();

    // Check invalid result
    if (!Number.isFinite(result)) {
      showError("Cannot divide by zero");

      return;
    }

    // Show previous calculation
    previousDisplay.textContent = expression + " =";

    // Store result
    expression = String(Number(result.toFixed(10)));

    justCalculated = true;

    // Update screen
    updateDisplay();
  } catch (error) {
    showError("Invalid calculation");
  }
}

// Handle button clicks
buttons.addEventListener("click", function (event) {
  // Find clicked button
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  // Get button value
  const value = button.dataset.value;

  // Get button action
  const action = button.dataset.action;

  // Number/operator button
  if (value !== undefined) {
    addValue(value);
  }

  // AC button
  if (action === "clear") {
    clearCalculator();
  }

  // DEL button
  if (action === "delete") {
    deleteLast();
  }

  // Equal button
  if (action === "calculate") {
    calculate();
  }
});


document.addEventListener("keydown", function (event) {
  const key = event.key;
  // Numbers and decimal
  if (/^[0-9]$/.test(key) || key === ".") {
    addValue(key);
    return;
  }
  // Operators
  if (["+", "-", "*", "/", "%"].includes(key)) {
    addValue(key);

    return;
  }

  // Enter or =
  if (key === "Enter" || key === "=") {
    event.preventDefault();

    calculate();

    return;
  }

  // Backspace
  if (key === "Backspace") {
    deleteLast();

    return;
  }

  if (key === "Escape") {
    clearCalculator();
  }
});

updateDisplay();
