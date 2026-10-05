# Scientific Calculator - Development Standards

This document establishes coding patterns, naming conventions, and best practices for the Scientific Calculator project.

## Code Style & Format

- **Language**: Vanilla JavaScript (ES6+)
- **Formatter**: Prettier with 2-space indentation
- **Linter**: ESLint with recommended config
- **File naming**: kebab-case for files (e.g., `calculator-core.js`)
- **Function naming**: camelCase for functions and variables
- **Class naming**: PascalCase for classes and constructors

## Math Operations Standards

### Operator Precedence (PEMDAS)
1. Parentheses (not yet implemented)
2. Exponents / Power (^)
3. Multiplication / Division (*, /)
4. Addition / Subtraction (+, -)

All calculations must respect this precedence. Use `math.js` for expression evaluation to ensure correctness.

### Precision & Rounding
- Use `Decimal.js` for all arithmetic to prevent floating-point errors
- Round display results to 10 decimal places max
- Store full precision internally

### Error Handling
- All user input must be validated before calculation
- Invalid expressions should throw descriptive errors
- Never expose system errors directly to users
- Log errors to console in development mode

## UI/UX Conventions

### Button Layout
- Organize buttons in logical groups: numbers, operations, functions, utilities
- Display buttons in consistent grid format
- Use clear labels for all functions

### Display Format
- Show input expression in secondary display
- Show result in main, larger display
- Indicate current operation mode (DEG/RAD, etc.)

### Accessibility
- All buttons must be keyboard accessible
- Buttons must have descriptive aria-labels
- Color contrast ratio must be ≥ 4.5:1

## Testing Standards

### Unit Tests
- Test file structure: mirror src file structure in `__tests__` folder
- Test naming: `<feature>.test.js`
- Each test must be focused and test one behavior

### Property-Based Tests
- Located in `src/__tests__/properties.test.js`
- Test invariants that should always hold true
- Generate hundreds of test cases automatically

### Coverage Goals
- Minimum 80% line coverage for core logic
- 100% coverage for math functions
- Critical paths must be tested

## Git & Commit Standards

- Commit messages: `[FEATURE|FIX|DOCS|TEST] Brief description`
- Keep commits focused and atomic
- Reference task IDs: `[FEATURE] Add sin function (TASK-003)`

## File Organization

```
scientific-calculator/
├── index.html           # Main entry point
├── src/
│   ├── calculator-core.js    # Core calculation engine
│   ├── calculator-ui.js      # UI interactions
│   ├── calculator-history.js # History management
│   ├── calculator-theme.js   # Theme management
│   ├── __tests__/
│   │   ├── calculator-core.test.js
│   │   ├── calculator-ui.test.js
│   │   └── properties.test.js
│   └── styles.css       # Styling
├── .kiro/
│   ├── spec.json        # Feature specification
│   ├── hooks/           # Automation hooks
│   ├── agents/          # Custom agents
│   └── steering/        # This folder
├── mcp/
│   └── calculator-mcp-server.js  # MCP server
└── package.json
```

## Dependencies

- `math.js` - Safe expression evaluation and math functions
- `decimal.js` - Precise arithmetic
- `vitest` - Testing framework
- `fast-check` - Property-based testing
- `eslint` - Code linting
- `prettier` - Code formatting

## Local Development

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Run property-based tests
npm run test:pbt

# Lint and format
npm run lint
npm run format

# Validate all checks
npm run validate

# Start dev server
npm run dev
```

## Performance Targets

- Page load: < 1s
- Calculation response: < 100ms
- History retrieval: < 50ms
- Theme toggle: instant visual feedback

