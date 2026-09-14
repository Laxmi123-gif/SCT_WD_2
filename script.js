// Get the display element from HTML
const display = document.getElementById("display");

// Get the error message element
const error = document.getElementById("error");

// This variable stores the calculator expression
let expression = "";

// ========================================
// ADD VALUE TO DISPLAY
// ========================================

function addToDisplay(value) {
  // Remove previous error
  error.textContent = "";

  // If the previous result was calculated
  // and user enters a number,
  // start a new calculation
  if (display.value !== "0" && expression === "" && !isNaN(value)) {
    expression = "";
  }

  // Add the clicked value
  expression = expression + value;

  // Show expression on display
  display.value = expression;
}

// ========================================
// CLEAR DISPLAY
// ========================================

function clearDisplay() {
  // Remove everything
  expression = "";

  // Reset display
  display.value = "0";

  // Remove error
  error.textContent = "";
}

// ========================================
// DELETE LAST CHARACTER
// ========================================

function deleteLast() {
  // Remove last character
  expression = expression.substring(0, expression.length - 1);

  // If nothing is left
  if (expression === "") {
    display.value = "0";
  } else {
    display.value = expression;
  }

  // Remove error
  error.textContent = "";
}

// ========================================
// CALCULATE RESULT
// ========================================

function calculate() {
  // Remove previous error
  error.textContent = "";

  // Check if display is empty
  if (expression === "") {
    return;
  }

  // Check if expression ends with operator
  const lastCharacter = expression[expression.length - 1];

  if (
    lastCharacter === "+" ||
    lastCharacter === "-" ||
    lastCharacter === "*" ||
    lastCharacter === "/" ||
    lastCharacter === "%"
  ) {
    error.textContent = "Complete the calculation";

    return;
  }

  try {
    // Calculate the expression
    const result = Function("return " + expression)();

    // Check for invalid result
    if (!Number.isFinite(result)) {
      error.textContent = "Cannot divide by zero";

      return;
    }

    // Show result
    display.value = result;

    // Store result
    expression = String(result);
  } catch {
    // Show error
    error.textContent = "Invalid calculation";
  }
}

// ========================================
// KEYBOARD INPUT
// ========================================

document.addEventListener("keydown", function (event) {
  // Get pressed key
  const key = event.key;

  // Numbers
  if (key >= "0" && key <= "9") {
    addToDisplay(key);
  }

  // Decimal point
  else if (key === ".") {
    addToDisplay(".");
  }

  // Operators
  else if (
    key === "+" ||
    key === "-" ||
    key === "*" ||
    key === "/" ||
    key === "%"
  ) {
    addToDisplay(key);
  }

  // Enter = Calculate
  else if (key === "Enter") {
    calculate();
  }

  // Backspace = Delete
  else if (key === "Backspace") {
    deleteLast();
  }

  // Escape = Clear
  else if (key === "Escape") {
    clearDisplay();
  }
});
