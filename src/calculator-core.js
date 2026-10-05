/**
 * Calculator Core Module
 * Handles mathematical operations, expression evaluation, and validation
 */

class CalculatorEngine {
  constructor() {
    this.expression = '';
    this.angleMode = 'DEG'; // DEG or RAD
    this.result = null;
    this.history = [];
  }

  /**
   * Add a number to the expression
   */
  addNumber(number) {
    if (number === '.' && this.expression.includes('.')) {
      return this.expression; // Prevent multiple decimals
    }
    this.expression += number;
    return this.expression;
  }

  /**
   * Add an operator to the expression
   */
  addOperator(operator) {
    // Prevent double operators
    if (this.expression && /[+\-*/^]$/.test(this.expression)) {
      return this.expression;
    }
    if (!this.expression) {
      return this.expression; // Can't start with operator
    }
    this.expression += operator;
    return this.expression;
  }

  /**
   * Add a function to the expression
   */
  addFunction(functionName) {
    this.expression += `${functionName}(`;
    return this.expression;
  }

  /**
   * Delete the last character
   */
  delete() {
    this.expression = this.expression.slice(0, -1);
    return this.expression;
  }

  /**
   * Clear the expression
   */
  clear() {
    this.expression = '';
    this.result = null;
    return this.expression;
  }

  /**
   * Negate the current number
   */
  negate() {
    if (!this.expression) return this.expression;

    // If result exists, negate it
    if (this.result !== null) {
      this.result = -this.result;
      this.expression = this.result.toString();
      return this.expression;
    }

    // Otherwise, extract the last number and negate it
    const match = this.expression.match(/(-?\d+\.?\d*)$/);
    if (match) {
      const lastNumber = match[0];
      const negated = -parseFloat(lastNumber);
      this.expression = this.expression.slice(0, -lastNumber.length) + negated;
    }

    return this.expression;
  }

  /**
   * Toggle between degree and radian modes
   */
  toggleAngleMode() {
    this.angleMode = this.angleMode === 'DEG' ? 'RAD' : 'DEG';
    return this.angleMode;
  }

  /**
   * Validate expression before evaluation
   */
  validateExpression() {
    if (!this.expression) {
      return { valid: false, error: 'Empty expression' };
    }

    // Check for unbalanced parentheses
    let parenCount = 0;
    for (const char of this.expression) {
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
      if (parenCount < 0) {
        return { valid: false, error: 'Unbalanced parentheses' };
      }
    }
    if (parenCount !== 0) {
      return { valid: false, error: 'Unbalanced parentheses' };
    }

    // Check for incomplete expressions
    if (/[+\-*/^]$/.test(this.expression)) {
      return { valid: false, error: 'Incomplete expression' };
    }

    return { valid: true };
  }

  /**
   * Evaluate the expression safely
   */
  evaluate() {
    try {
      // Validate first
      const validation = this.validateExpression();
      if (!validation.valid) {
        return { success: false, error: validation.error, result: null };
      }

      // Build scope with functions
      const scope = this.buildEvaluationScope();

      // Compile and evaluate using math.js
      const compiled = math.compile(this.expression);
      let result = compiled.evaluate(scope);

      // Handle division by zero
      if (!Number.isFinite(result)) {
        return { success: false, error: 'Division by zero or invalid operation', result: null };
      }

      // Use Decimal for high precision
      const precise = new Decimal(result);
      result = parseFloat(precise.toFixed(10));

      // Store in history
      this.addToHistory(this.expression, result);

      // Update state
      this.result = result;
      this.expression = '';

      return { success: true, error: null, result: result };
    } catch (error) {
      return { success: false, error: this.parseError(error), result: null };
    }
  }

  /**
   * Build the evaluation scope with math functions
   */
  buildEvaluationScope() {
    const scope = {
      // Trigonometric (handle angle conversion)
      sin: (x) => {
        const rad = this.angleMode === 'DEG' ? (x * Math.PI) / 180 : x;
        return Math.sin(rad);
      },
      cos: (x) => {
        const rad = this.angleMode === 'DEG' ? (x * Math.PI) / 180 : x;
        return Math.cos(rad);
      },
      tan: (x) => {
        const rad = this.angleMode === 'DEG' ? (x * Math.PI) / 180 : x;
        return Math.tan(rad);
      },
      asin: (x) => {
        const result = Math.asin(x);
        return this.angleMode === 'DEG' ? (result * 180) / Math.PI : result;
      },
      acos: (x) => {
        const result = Math.acos(x);
        return this.angleMode === 'DEG' ? (result * 180) / Math.PI : result;
      },
      atan: (x) => {
        const result = Math.atan(x);
        return this.angleMode === 'DEG' ? (result * 180) / Math.PI : result;
      },
      // Logarithmic
      log: (x) => {
        if (x <= 0) throw new Error('Logarithm undefined for x ≤ 0');
        return Math.log10(x);
      },
      ln: (x) => {
        if (x <= 0) throw new Error('Natural log undefined for x ≤ 0');
        return Math.log(x);
      },
      // Other functions
      sqrt: (x) => {
        if (x < 0) throw new Error('Square root of negative number');
        return Math.sqrt(x);
      },
      abs: Math.abs,
      pow: Math.pow,
      ceil: Math.ceil,
      floor: Math.floor,
      round: Math.round,
      exp: Math.exp,
      // Constants
      pi: Math.PI,
      e: Math.E
    };

    return scope;
  }

  /**
   * Parse error messages into user-friendly format
   */
  parseError(error) {
    const message = error.message || error.toString();

    if (message.includes('Division by zero')) {
      return 'Division by zero';
    }
    if (message.includes('Logarithm')) {
      return 'Logarithm undefined for this value';
    }
    if (message.includes('Square root')) {
      return 'Square root of negative number';
    }
    if (message.includes('Unexpected')) {
      return 'Invalid expression syntax';
    }
    if (message.includes('undefined')) {
      return 'Undefined operation';
    }

    return `Error: ${message.substring(0, 50)}`;
  }

  /**
   * Add calculation to history
   */
  addToHistory(expression, result) {
    this.history.push({
      expression: expression,
      result: result,
      timestamp: new Date().toLocaleTimeString()
    });

    // Keep only last 100 items
    if (this.history.length > 100) {
      this.history.shift();
    }
  }

  /**
   * Get current display value
   */
  getDisplayValue() {
    if (this.expression) {
      return this.expression;
    }
    if (this.result !== null) {
      return this.result.toString();
    }
    return '0';
  }

  /**
   * Get previous operand display (for showing calculation steps)
   */
  getPreviousOperandDisplay() {
    return this.result !== null ? this.result.toString() : '';
  }
}

// Create global instance
const calculator = new CalculatorEngine();
