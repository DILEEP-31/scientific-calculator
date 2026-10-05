# Scientific Calculator Kiro Power Specification

This document describes the Scientific Calculator Kiro Power - a packaged collection of tools, agents, and best practices for building scientific calculators.

## Power Overview

**Power Name:** `scientific-calculator`
**Version:** 1.0.0
**Description:** A comprehensive power for building feature-rich scientific calculators with validation, property-based testing, and advanced math functions.

## What's Included

### 1. MCP Server: Formula Validation
- **Tool:** `validate_expression` - Validates mathematical expressions for safety
- **Tool:** `evaluate_expression` - Safely evaluates expressions with high precision
- **Tool:** `analyze_errors` - Detects potential math errors (div by zero, log of negative, etc.)
- **Tool:** `convert_angle` - Converts between angle units (degrees, radians, gradians)
- **Tool:** `get_constants` - Provides mathematical constants

### 2. Custom Agent: Calculator Dev Agent
- Pre-configured for calculator development
- Includes steering file context
- Math validation rule enforcement
- Pre-approved for core calculator file edits
- Specialized error handling knowledge

### 3. Steering Files
- `CALCULATOR-STANDARDS.md` - Development standards, naming conventions, best practices
- `MATH-VALIDATION-RULES.md` - Mathematical invariants, validation rules, error messages

### 4. Hooks
- **lint-on-save** - Auto-lint JavaScript files on save
- **test-on-create** - Run tests when new test files are created
- **code-review-before-write** - Agent code quality review before file writes

### 5. Feature Specification
- Complete feature spec with requirements, design decisions, and tasks
- Property-based test suite (Lesson 4)
- Unit test templates

### 6. Project Template
- Pre-configured HTML/CSS/JavaScript structure
- Calculator core engine with expression evaluation
- UI module for interactions
- History management
- Theme persistence
- Keyboard support

## MCP Server Details

### Formula Validation

The power includes an MCP server (`calculator-mcp-server.js`) that provides formula validation capabilities.

**validate_expression(expression: string)**
- Checks syntax correctness
- Detects suspicious patterns
- Validates parentheses balancing
- Identifies expression complexity
- Safe to call with untrusted input

**evaluateExpression(expression: string, scope?: object)**
- Safely evaluates expressions using math.js
- Uses Decimal.js for high precision
- Returns result with metadata
- Handles errors gracefully

**analyzeErrors(expression: string)**
- Detects division by zero
- Detects log of non-positive numbers
- Detects sqrt of negative numbers
- Provides specific error messages

## Custom Agent Capabilities

The `calculator-dev-agent` includes:

- **Context:** Full calculator project context including specs and steering files
- **Permissions:** Pre-approved file writes to src/, tests, and HTML
- **Constraints:** Cannot use eval(), must use math.js, must follow standards
- **Verification:** Built-in test and lint commands
- **Knowledge:** Mathematical invariants, error handling patterns, calculator UX

## Steering File Features

### CALCULATOR-STANDARDS.md
- Code style and formatting rules
- File organization structure
- Testing standards (unit tests, PBT, coverage goals)
- Math operation standards (operator precedence, precision, rounding)
- Commit message conventions
- Performance targets

### MATH-VALIDATION-RULES.md
- Valid expression syntax rules
- Mathematical constraints (trig, log, sqrt, power)
- Error messages for different error types
- Precision and rounding rules
- Property-based testing invariants
- Validation checklist

## Property-Based Testing

The power includes comprehensive property-based tests for:

1. **Arithmetic Properties**
   - Commutativity of addition and multiplication
   - Associativity of addition and multiplication
   - Distributive property
   - Identity elements (0 and 1)
   - Inverse elements

2. **Trigonometric Properties**
   - Pythagorean identity
   - Tangent identity
   - Periodicity

3. **Logarithmic Properties**
   - Product rule
   - Power rule
   - Quotient rule

4. **Power Properties**
   - Product rule for exponents
   - Zero exponent rule
   - Power of power rule

5. **Expression Evaluation**
   - Finite result generation
   - Consistency across identical inputs
   - Proper negative handling

Tests use `fast-check` to generate hundreds of test cases automatically.

## Installation

### For Users
Users can install this power from the Kiro Powers registry or GitHub:

```bash
# Via Kiro UI: Powers > Add Power > Search "scientific-calculator"
# Or directly from GitHub repo
```

### For Developers Extending

To extend this power for your own calculator variants:

1. Fork/clone the power repository
2. Modify steering files for your specific needs
3. Add custom MCP tools in `mcp/`
4. Create new agent variants in `.kiro/agents/`
5. Add domain-specific hooks in `.kiro/hooks/`
6. Update the spec with your requirements
7. Publish to GitHub as your own power

## File Structure

```
scientific-calculator/
├── .kiro/
│   ├── spec.json
│   ├── agents/
│   │   └── calculator-dev-agent.json
│   ├── hooks/
│   │   ├── lint-on-save.json
│   │   ├── test-on-create.json
│   │   └── code-review-before-write.json
│   └── steering/
│       ├── CALCULATOR-STANDARDS.md
│       └── MATH-VALIDATION-RULES.md
├── mcp/
│   └── calculator-mcp-server.js
├── src/
│   ├── __tests__/
│   │   ├── calculator-core.test.js
│   │   ├── calculator-ui.test.js
│   │   └── properties.test.js
│   ├── calculator-core.js
│   ├── calculator-ui.js
│   ├── calculator-history.js
│   ├── calculator-theme.js
│   ├── app.js
│   └── styles.css
├── index.html
├── package.json
├── POWER-SPECIFICATION.md
└── README.md
```

## Usage Examples

### When to Use This Power

1. **Building a Scientific Calculator**
   - Full set of trigonometric, logarithmic, and power functions
   - Expression evaluation with proper precedence
   - Error handling and validation

2. **Building a Specialized Calculator**
   - Unit converter calculator (extend MCP tools)
   - Financial calculator (extend steering files)
   - Statistics calculator (add domain-specific functions)

3. **Learning Calculator Development**
   - Well-documented codebase
   - Property-based testing examples
   - MCP server implementation patterns

### Activating in Your Session

When you mention mathematical expression validation, calculator development, or formula evaluation in your prompt, Kiro can activate this power to:

- Load the custom calculator dev agent
- Apply steering file standards automatically
- Provide MCP tools for validation
- Create hooks for code quality

## Customization

### Adding New Functions

1. Add the function to `calculator-core.js` in the `buildEvaluationScope()` method
2. Add validation rules to `.kiro/steering/MATH-VALIDATION-RULES.md`
3. Add property-based tests in `src/__tests__/properties.test.js`
4. Add MCP tool if external validation is needed

### Modifying Standards

Edit the steering files in `.kiro/steering/` to change:
- Code style conventions
- Math precedence rules
- Error messages
- Testing requirements

### Creating Agent Variants

Create new `.json` files in `.kiro/agents/` for:
- Domain-specific agents (finance calculator dev agent)
- Specialized validators
- Custom reviewers

## Contributing

To contribute improvements:

1. Test your changes against the property-based test suite
2. Update steering files if changing standards
3. Add tests for new functions
4. Ensure backwards compatibility

## License

[Your chosen license]

## Support

For issues and questions:
- Check the steering files for standards
- Review the spec.json for feature definitions
- Run property-based tests to validate changes
- Consult the MCP server documentation

