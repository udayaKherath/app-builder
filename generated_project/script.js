// Calculator class providing core arithmetic logic.
// Exported to the global browser scope as `Calculator`.

class Calculator {
  constructor() {
    // Operands are stored as strings to simplify appending numbers.
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = null;
  }

  // Reset all state.
  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = null;
  }

  // Delete the last character of the current operand.
  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  // Append a digit or decimal point to the current operand.
  // Prevent multiple decimal points.
  appendNumber(number) {
    // Ensure the input is a string.
    const str = number.toString();
    if (str === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + str;
  }

  // Choose an operation (+, -, *, /).
  // Moves the current operand to previousOperand if present.
  chooseOperation(operator) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      // If there is already a pending operation, compute it first.
      this.compute();
    }
    this.operation = operator;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  // Perform the computation based on the stored operation.
  compute() {
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    let computation;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        if (current === 0) {
          // Throw an error that will be caught by UI logic.
          throw new Error('Division by zero');
        }
        computation = prev / current;
        break;
      default:
        return;
    }
    // Store the result as the new current operand.
    this.currentOperand = computation.toString();
    this.previousOperand = '';
    this.operation = null;
  }

  // Format a number with commas for readability.
  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const [integerPart, decimalPart] = stringNumber.split('.');
    // Use built‑in locale formatting for the integer part.
    const integerDisplay = parseInt(integerPart, 10).toLocaleString('en', {
      maximumFractionDigits: 0,
    });
    if (decimalPart != null) {
      return `${integerDisplay}.${decimalPart}`;
    } else {
      return integerDisplay;
    }
  }

  // Return the formatted current operand for UI rendering.
  updateDisplay() {
    if (this.currentOperand === '' && this.previousOperand === '') {
      return '';
    }
    // If there is a current operand, display it; otherwise display the previous operand/result.
    const value = this.currentOperand !== '' ? this.currentOperand : this.previousOperand;
    return this.getDisplayNumber(value);
  }
}

// Expose the class globally so UI scripts can instantiate it.
if (typeof window !== 'undefined') {
  window.Calculator = Calculator;
}

/**
 * UI Binding and Event Handling for the calculator.
 * This function is executed once the DOM content is fully loaded.
 */
function initCalculatorUI() {
  // Query essential DOM elements.
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.button');

  // Instantiate the calculator logic.
  const calculator = new Calculator();

  // Keep track of the last valid display value so we can restore it after an error.
  let lastValidDisplay = '';

  // Helper to render the calculator's display with error handling.
  function updateDisplay() {
    try {
      const value = calculator.updateDisplay();
      display.value = value;
      // Store the successful value for potential restoration.
      lastValidDisplay = value;
    } catch (err) {
      // Prefix the error message as required.
      showError(`Error: ${err.message}`);
    }
  }

  // User‑friendly error presentation.
  function showError(message) {
    // Preserve the current (valid) display value if not already stored.
    const previous = lastValidDisplay;
    // Show the error message.
    display.value = message;
    // Apply a temporary CSS class for visual emphasis.
    display.classList.add('display-error');
    // After 2 seconds, revert to the previous valid display and remove the class.
    setTimeout(() => {
      display.value = previous;
      display.classList.remove('display-error');
    }, 2000);
  }

  // Click handling for calculator buttons.
  function handleButtonClick(event) {
    const value = event.target.dataset.value;
    if (!value) return; // Safety check.

    if (/^[0-9.]$/.test(value)) {
      calculator.appendNumber(value);
    } else if (['+', '-', '*', '/'].includes(value)) {
      calculator.chooseOperation(value);
    } else if (value === '=') {
      calculator.compute();
    } else if (value === 'C') {
      calculator.clear();
    } else if (value === '←') {
      calculator.delete();
    }
    updateDisplay();
  }

  // Keyboard support – maps keys to the same actions as button clicks.
  function handleKeyPress(event) {
    const key = event.key;
    // Digits and decimal point.
    if (/^[0-9.]$/.test(key)) {
      calculator.appendNumber(key);
      updateDisplay();
      return;
    }
    // Operators.
    if (['+', '-', '*', '/'].includes(key)) {
      calculator.chooseOperation(key);
      updateDisplay();
      return;
    }
    // Enter or '=' triggers computation.
    if (key === 'Enter' || key === '=') {
      calculator.compute();
      updateDisplay();
      return;
    }
    // Backspace deletes the last character.
    if (key === 'Backspace') {
      calculator.delete();
      updateDisplay();
      return;
    }
    // Delete or Escape clears the calculator.
    if (key === 'Delete' || key === 'Escape') {
      calculator.clear();
      updateDisplay();
      return;
    }
  }

  // Attach click listeners to each button.
  buttons.forEach((button) => {
    button.addEventListener('click', handleButtonClick);
  });

  // Global keyboard listener.
  document.addEventListener('keydown', handleKeyPress);

  // Initialise display.
  updateDisplay();
}

// Initialise the UI once the DOM is ready.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalculatorUI);
} else {
  initCalculatorUI();
}
