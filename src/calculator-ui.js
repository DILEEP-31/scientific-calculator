/**
 * Calculator UI Module
 * Handles all user interface interactions and updates
 */

class CalculatorUI {
  constructor() {
    this.currentOperand = document.getElementById('currentOperand');
    this.previousOperand = document.getElementById('previousOperand');
    this.errorMessage = document.getElementById('errorMessage');
    this.modeDisplay = document.getElementById('angleMode');
    this.modeToggle = document.getElementById('modeToggle');
    this.historyList = document.getElementById('historyList');
    this.clearHistoryBtn = document.getElementById('clearHistory');

    this.init();
  }

  /**
   * Initialize UI event listeners
   */
  init() {
    // Number buttons
    document.querySelectorAll('[data-number]').forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleNumberClick(e.target.dataset.number));
    });

    // Operator buttons
    document.querySelectorAll('[data-operator]').forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleOperatorClick(e.target.dataset.operator));
    });

    // Function buttons
    document.querySelectorAll('[data-function]').forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleFunctionClick(e.target.dataset.function));
    });

    // Action buttons
    document.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleAction(e.target.dataset.action));
    });

    // Mode toggle
    this.modeToggle.addEventListener('click', () => this.handleModeToggle());

    // Keyboard support
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // History
    this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

    // Initial display update
    this.updateDisplay();
  }

  /**
   * Handle number button clicks
   */
  handleNumberClick(number) {
    calculator.addNumber(number);
    this.updateDisplay();
    this.clearError();
  }

  /**
   * Handle operator button clicks
   */
  handleOperatorClick(operator) {
    if (calculator.expression) {
      calculator.addOperator(operator);
      this.updateDisplay();
      this.clearError();
    }
  }

  /**
   * Handle function button clicks
   */
  handleFunctionClick(functionName) {
    calculator.addFunction(functionName);
    this.updateDisplay();
    this.clearError();
  }

  /**
   * Handle action buttons (AC, DEL, =, +/-)
   */
  handleAction(action) {
    switch (action) {
      case 'clear':
        calculator.clear();
        break;
      case 'delete':
        calculator.delete();
        break;
      case 'equals':
        this.handleEquals();
        return;
      case 'negate':
        calculator.negate();
        break;
    }
    this.updateDisplay();
    this.clearError();
  }

  /**
   * Handle equals button - evaluate expression
   */
  handleEquals() {
    const result = calculator.evaluate();

    if (!result.success) {
      this.showError(result.error);
    } else {
      this.showResult(result.result);
      this.updateHistory();
    }

    this.updateDisplay();
  }

  /**
   * Handle mode toggle (DEG/RAD)
   */
  handleModeToggle() {
    const newMode = calculator.toggleAngleMode();
    this.updateModeDisplay(newMode);
    this.savePreferences();
  }

  /**
   * Handle keyboard input
   */
  handleKeyboard(e) {
    // Numbers
    if (e.key >= '0' && e.key <= '9') {
      this.handleNumberClick(e.key);
    }
    // Decimal point
    else if (e.key === '.') {
      this.handleNumberClick('.');
    }
    // Operators
    else if (e.key === '+') {
      this.handleOperatorClick('+');
    } else if (e.key === '-') {
      this.handleOperatorClick('-');
    } else if (e.key === '*') {
      this.handleOperatorClick('*');
    } else if (e.key === '/') {
      e.preventDefault(); // Prevent browser search
      this.handleOperatorClick('/');
    } else if (e.key === '^' || e.key === '**') {
      this.handleOperatorClick('^');
    }
    // Actions
    else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      this.handleAction('equals');
    } else if (e.key === 'Escape') {
      this.handleAction('clear');
    } else if (e.key === 'Backspace') {
      this.handleAction('delete');
    }
  }

  /**
   * Update display elements
   */
  updateDisplay() {
    const current = calculator.getDisplayValue();
    const previous = calculator.getPreviousOperandDisplay();

    this.currentOperand.textContent = current || '0';
    this.previousOperand.textContent = previous;
  }

  /**
   * Show result with formatting
   */
  showResult(result) {
    calculator.result = result;
    calculator.expression = '';
    this.currentOperand.textContent = this.formatResult(result);
    this.previousOperand.textContent = '';
  }

  /**
   * Format number for display
   */
  formatResult(number) {
    if (!Number.isFinite(number)) {
      return 'Error';
    }

    // Show as integer if it is one
    if (Number.isInteger(number)) {
      return number.toString();
    }

    // Otherwise show with up to 10 decimal places
    const rounded = parseFloat(number.toFixed(10));
    return rounded.toString();
  }

  /**
   * Show error message
   */
  showError(error) {
    this.errorMessage.textContent = error;
    this.errorMessage.style.display = 'block';
    setTimeout(() => {
      this.errorMessage.style.display = 'none';
    }, 3000);
  }

  /**
   * Clear error message
   */
  clearError() {
    this.errorMessage.style.display = 'none';
    this.errorMessage.textContent = '';
  }

  /**
   * Update angle mode display
   */
  updateModeDisplay(mode) {
    this.modeDisplay.textContent = mode;
    this.modeToggle.textContent = `Switch to ${mode === 'DEG' ? 'RAD' : 'DEG'}`;
  }

  /**
   * Update history display
   */
  updateHistory() {
    // This will be called by history module
  }

  /**
   * Clear history
   */
  clearHistory() {
    calculator.history = [];
    this.updateHistoryDisplay();
  }

  /**
   * Update history display
   */
  updateHistoryDisplay() {
    if (calculator.history.length === 0) {
      this.historyList.innerHTML = '<li class="history-empty">No calculations yet</li>';
      return;
    }

    this.historyList.innerHTML = calculator.history
      .map((item, index) => {
        return `
        <li class="history-item" data-index="${index}">
          <div class="history-expression">${this.escapeHtml(item.expression)}</div>
          <div class="history-result">${this.formatResult(item.result)}</div>
          <div class="history-time">${item.timestamp}</div>
        </li>
      `;
      })
      .reverse()
      .join('');

    // Add click handlers to history items
    this.historyList.querySelectorAll('.history-item').forEach((item) => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        const historyItem = calculator.history[index];
        calculator.expression = historyItem.expression;
        ui.updateDisplay();
      });
    });
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Save preferences to localStorage
   */
  savePreferences() {
    const prefs = {
      angleMode: calculator.angleMode,
      history: calculator.history
    };
    localStorage.setItem('calcPreferences', JSON.stringify(prefs));
  }

  /**
   * Load preferences from localStorage
   */
  loadPreferences() {
    const saved = localStorage.getItem('calcPreferences');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        calculator.angleMode = prefs.angleMode || 'DEG';
        calculator.history = prefs.history || [];
        this.updateModeDisplay(calculator.angleMode);
        this.updateHistoryDisplay();
      } catch (e) {
        console.error('Error loading preferences:', e);
      }
    }
  }
}

// Create global UI instance
const ui = new CalculatorUI();

// Load preferences on startup
window.addEventListener('DOMContentLoaded', () => {
  ui.loadPreferences();
});
