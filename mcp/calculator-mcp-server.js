/**
 * Model Context Protocol (MCP) Server for Calculator Validation
 * Provides tools for formula validation, mathematical operations, and safety checks
 * 
 * This server validates calculator expressions before they are evaluated,
 * ensuring they are mathematically sound and safe.
 */

const math = require('math.js');
const Decimal = require('decimal.js');

/**
 * Validates a calculator expression for safety and correctness
 * @param {string} expression - Mathematical expression to validate
 * @returns {Object} Validation result with isValid, errors, and warnings
 */
function validateExpression(expression) {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    expression: expression,
    estimatedResult: null,
    complexity: 'low'
  };

  if (!expression || typeof expression !== 'string') {
    result.isValid = false;
    result.errors.push('Expression must be a non-empty string');
    return result;
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    { pattern: /eval\s*\(/, message: 'Expression contains eval - not allowed' },
    { pattern: /Function\s*\(/, message: 'Expression contains Function constructor - not allowed' },
    { pattern: /require\s*\(/, message: 'Expression contains require - not allowed' },
    { pattern: /import\s+/, message: 'Expression contains import - not allowed' },
    { pattern: /process\./, message: 'Expression contains process access - not allowed' }
  ];

  for (const { pattern, message } of suspiciousPatterns) {
    if (pattern.test(expression)) {
      result.isValid = false;
      result.errors.push(message);
    }
  }

  // Check for balanced parentheses
  let parenCount = 0;
  for (const char of expression) {
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    if (parenCount < 0) {
      result.isValid = false;
      result.errors.push('Unbalanced parentheses - more closing than opening');
      break;
    }
  }
  if (parenCount !== 0) {
    result.isValid = false;
    result.errors.push('Unbalanced parentheses');
  }

  // Try to parse and compile
  try {
    const compiled = math.compile(expression);
    
    // Check expression complexity
    const nodeCount = getNodeCount(compiled.node);
    if (nodeCount > 1000) {
      result.complexity = 'very-high';
      result.warnings.push('Expression is very complex and may be slow to evaluate');
    } else if (nodeCount > 100) {
      result.complexity = 'high';
      result.warnings.push('Expression is moderately complex');
    } else if (nodeCount > 20) {
      result.complexity = 'medium';
    }

    // Try evaluation with safe scope
    const safeScope = {
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      asin: Math.asin,
      acos: Math.acos,
      atan: Math.atan,
      sqrt: Math.sqrt,
      abs: Math.abs,
      log: Math.log10,
      ln: Math.log,
      exp: Math.exp,
      ceil: Math.ceil,
      floor: Math.floor,
      round: Math.round,
      pow: Math.pow,
      pi: Math.PI,
      e: Math.E
    };

    // Attempt evaluation to catch obvious errors
    const testResult = compiled.evaluate(safeScope);
    
    if (Number.isNaN(testResult)) {
      result.warnings.push('Expression evaluates to NaN');
    } else if (!Number.isFinite(testResult)) {
      result.warnings.push('Expression evaluates to Infinity');
    } else {
      result.estimatedResult = parseFloat(testResult.toFixed(10));
    }

  } catch (error) {
    result.isValid = false;
    result.errors.push(`Parse error: ${error.message}`);
  }

  return result;
}

/**
 * Counts the number of nodes in a math.js AST
 */
function getNodeCount(node) {
  if (!node) return 0;
  let count = 1;
  if (node.args) {
    for (const arg of node.args) {
      count += getNodeCount(arg);
    }
  }
  if (node.fn) count += getNodeCount(node.fn);
  if (node.object) count += getNodeCount(node.object);
  if (node.index) count += getNodeCount(node.index);
  return count;
}

/**
 * Safely evaluates a validated expression
 * @param {string} expression - Expression to evaluate
 * @param {Object} scope - Custom variables (e.g., {x: 5})
 * @returns {Object} Result with value, precision, and metadata
 */
function evaluateExpression(expression, scope = {}) {
  const result = {
    success: false,
    value: null,
    valueString: '',
    precision: 'normal',
    evaluationTime: 0,
    error: null
  };

  const startTime = Date.now();

  try {
    const merged = {
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      asin: Math.asin,
      acos: Math.acos,
      atan: Math.atan,
      sqrt: Math.sqrt,
      abs: Math.abs,
      log: Math.log10,
      ln: Math.log,
      exp: Math.exp,
      ceil: Math.ceil,
      floor: Math.floor,
      round: Math.round,
      pow: Math.pow,
      pi: Math.PI,
      e: Math.E,
      ...scope
    };

    const compiled = math.compile(expression);
    const value = compiled.evaluate(merged);

    if (!Number.isFinite(value)) {
      result.error = 'Result is not a finite number';
      return result;
    }

    // Use Decimal for high precision storage
    const precise = new Decimal(value);
    result.value = parseFloat(value.toFixed(10));
    result.valueString = precise.toString();
    result.success = true;
    result.precision = precise.decimalPlaces() > 10 ? 'high' : 'normal';

  } catch (error) {
    result.error = error.message;
  }

  result.evaluationTime = Date.now() - startTime;
  return result;
}

/**
 * Checks for mathematical errors in an expression
 * @param {string} expression - Expression to check
 * @returns {Object} Detailed error analysis
 */
function analyzeErrors(expression) {
  const analysis = {
    hasDivisionByZero: false,
    hasLogOfNonPositive: false,
    hasSqrtOfNegative: false,
    hasUndefinedFunction: false,
    errors: []
  };

  // Check for obvious division by zero patterns
  if (/\/\s*0(?![0-9])/.test(expression)) {
    analysis.hasDivisionByZero = true;
    analysis.errors.push('Expression contains division by zero');
  }

  // Check for log of non-positive
  if (/log\s*\(\s*-|log\s*\(\s*0(?!\.)/.test(expression)) {
    analysis.hasLogOfNonPositive = true;
    analysis.errors.push('Expression contains logarithm of non-positive number');
  }

  // Check for sqrt of negative
  if (/sqrt\s*\(\s*-/.test(expression)) {
    analysis.hasSqrtOfNegative = true;
    analysis.errors.push('Expression contains square root of negative number');
  }

  return analysis;
}

/**
 * Converts between angle units
 */
function convertAngle(value, fromUnit, toUnit) {
  const unitsMap = {
    'deg': 1,
    'rad': Math.PI / 180,
    'grad': 0.9
  };

  if (!unitsMap[fromUnit] || !unitsMap[toUnit]) {
    return { error: 'Invalid angle unit' };
  }

  const inDegrees = value / unitsMap[fromUnit];
  const result = inDegrees * unitsMap[toUnit];

  return {
    success: true,
    value: result,
    from: fromUnit,
    to: toUnit,
    originalValue: value
  };
}

/**
 * Provides mathematical constants
 */
function getConstants() {
  return {
    pi: Math.PI,
    e: Math.E,
    phi: (1 + Math.sqrt(5)) / 2,
    ln2: Math.LN2,
    ln10: Math.LN10,
    log2e: Math.LOG2E,
    log10e: Math.LOG10E,
    sqrt2: Math.SQRT2,
    sqrt1_2: Math.SQRT1_2
  };
}

// Export functions for MCP
module.exports = {
  validateExpression,
  evaluateExpression,
  analyzeErrors,
  convertAngle,
  getConstants,
  getNodeCount
};

// MCP Tool Definitions (for integration with Kiro)
const mcpTools = [
  {
    name: 'validate_expression',
    description: 'Validates a mathematical expression for safety and syntax correctness',
    inputSchema: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'Mathematical expression to validate'
        }
      },
      required: ['expression']
    }
  },
  {
    name: 'evaluate_expression',
    description: 'Safely evaluates a validated mathematical expression',
    inputSchema: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'Mathematical expression to evaluate'
        },
        scope: {
          type: 'object',
          description: 'Optional variables to use in evaluation'
        }
      },
      required: ['expression']
    }
  },
  {
    name: 'analyze_errors',
    description: 'Analyzes an expression for potential mathematical errors',
    inputSchema: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'Mathematical expression to analyze'
        }
      },
      required: ['expression']
    }
  },
  {
    name: 'convert_angle',
    description: 'Converts between angle units (degrees, radians, gradians)',
    inputSchema: {
      type: 'object',
      properties: {
        value: {
          type: 'number',
          description: 'Angle value to convert'
        },
        fromUnit: {
          type: 'string',
          enum: ['deg', 'rad', 'grad'],
          description: 'Source unit'
        },
        toUnit: {
          type: 'string',
          enum: ['deg', 'rad', 'grad'],
          description: 'Target unit'
        }
      },
      required: ['value', 'fromUnit', 'toUnit']
    }
  },
  {
    name: 'get_constants',
    description: 'Returns mathematical constants (pi, e, phi, etc.)',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

module.exports.mcpTools = mcpTools;
