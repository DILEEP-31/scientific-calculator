/**
 * Calculator History Module
 * Manages calculation history persistence and display
 */

class CalculatorHistory {
  constructor() {
    this.storageKey = 'calcHistory';
    this.maxEntries = 100;
  }

  /**
   * Add entry to history
   */
  addEntry(expression, result) {
    const entry = {
      expression: expression,
      result: result,
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now()
    };

    let history = this.getHistory();
    history.push(entry);

    if (history.length > this.maxEntries) {
      history = history.slice(-this.maxEntries);
    }

    this.saveToStorage(history);
    return entry;
  }

  /**
   * Get all history entries
   */
  getHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error reading history from storage:', e);
      return [];
    }
  }

  /**
   * Clear all history
   */
  clearHistory() {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Save history to localStorage
   */
  saveToStorage(history) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving history to storage:', e);
    }
  }

  /**
   * Export history as CSV
   */
  exportAsCSV() {
    const history = this.getHistory();
    let csv = 'Expression,Result,Timestamp\n';

    history.forEach((entry) => {
      csv += `"${entry.expression}","${entry.result}","${entry.timestamp}"\n`;
    });

    return csv;
  }

  /**
   * Export history as JSON
   */
  exportAsJSON() {
    const history = this.getHistory();
    return JSON.stringify(history, null, 2);
  }
}

const history = new CalculatorHistory();

// Hook into calculator's addToHistory method
const originalAddToHistory = calculator.addToHistory;
calculator.addToHistory = function (expression, result) {
  originalAddToHistory.call(this, expression, result);
  history.addEntry(expression, result);
};
