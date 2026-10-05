# Scientific Calculator - Comprehensive Kiro Learning Project

A feature-rich scientific calculator web application that demonstrates all 7 Kiro lessons + bonus lesson 2 in a single, cohesive project.

## Project Goals

Build a production-ready scientific calculator while learning:

1. ✅ **Spec-Driven Development** - Feature specifications and requirements management
2. ✅ **Steering Documents** - Project standards and best practices
3. ✅ **Hooks** - Automation on file saves, creates, and tool use
4. ✅ **Property-Based Testing** - Mathematical invariant verification
5. ✅ **Powers** - Bundled tools and MCP servers
6. ✅ **Model Context Protocol (MCP)** - External tool integration
7. ✅ **Custom Agents** - Specialized development assistants
8. ✅ **Bonus: Package a Kiro Power** - Distribute as reusable package

## Features

### Calculator Functionality
- **Basic Arithmetic**: +, −, ×, ÷ with proper operator precedence
- **Scientific Functions**: sin, cos, tan, asin, acos, atan, sqrt, log, ln, abs, power
- **Angle Modes**: Toggle between degrees and radians
- **Calculation History**: Persistent history with click-to-reuse
- **Keyboard Support**: Full keyboard input (0-9, operators, Enter, Escape, Backspace)
- **Dark/Light Theme**: Toggleable with persistence
- **High Precision**: Uses Decimal.js for accurate calculations
- **Error Handling**: Clear error messages for invalid operations

### Developer Features
- Property-based testing suite with 40+ mathematical properties
- Custom Kiro agent with pre-configured permissions
- MCP server for formula validation
- Comprehensive steering files with standards
- Automation hooks for code quality
- Structured specification with requirements and design

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
# Unit tests
npm run test

# Property-based tests
npm run test:pbt

# All validation
npm run validate
```

### 3. Start Development
```bash
npm run dev
# Then open: http://localhost:8000
```

### 4. Format & Lint
```bash
npm run lint
npm run format
```

## Project Structure

```
scientific-calculator/
├── .kiro/
│   ├── spec.json                          # LESSON 1: Feature specification
│   ├── steering/
│   │   ├── CALCULATOR-STANDARDS.md        # LESSON 2: Coding standards
│   │   └── MATH-VALIDATION-RULES.md       # LESSON 2: Math rules
│   ├── hooks/
│   │   ├── lint-on-save.json              # LESSON 3: Auto-lint on save
│   │   ├── test-on-create.json            # LESSON 3: Auto-test on create
│   │   └── code-review-before-write.json  # LESSON 3: Code review hook
│   └── agents/
│       └── calculator-dev-agent.json      # LESSON 7: Custom agent
├── src/
│   ├── __tests__/
│   │   └── properties.test.js             # LESSON 4: Property-based tests
│   ├── calculator-core.js                 # Core calculation engine
│   ├── calculator-ui.js                   # UI interactions
│   ├── calculator-history.js              # History management
│   ├── calculator-theme.js                # Theme management
│   ├── app.js                             # Main entry point
│   └── styles.css                         # Styling
├── mcp/
│   └── calculator-mcp-server.js           # LESSON 6: MCP server implementation
├── index.html                             # HTML markup
├── package.json                           # Dependencies and scripts
├── POWER-SPECIFICATION.md                 # BONUS 2: Power specification
└── README.md                              # This file
```

## Lesson Implementations

### Lesson 1: Spec-Driven Development 📋
**File**: `.kiro/spec.json`

Defines the calculator as a formal specification with:
- 6 Feature requirements (REQ-001 through REQ-006)
- 3 Design decisions with rationale
- 9 Implementation tasks (TASK-001 through TASK-009)

**How it works:**
- Requirements specify what the calculator must do
- Design decisions explain architectural choices
- Tasks break down implementation work
- Status tracking for each task

### Lesson 2: Steering Documents 📖
**Files**: `.kiro/steering/CALCULATOR-STANDARDS.md` and `MATH-VALIDATION-RULES.md`

Provides persistent project knowledge:
- **CALCULATOR-STANDARDS.md**: Code style, naming conventions, file organization, performance targets
- **MATH-VALIDATION-RULES.md**: Mathematical rules, validation constraints, error messages, property invariants

**How it works:**
- Steering files are always loaded in your session
- Agents refer to them for decisions
- Prevents repeating project standards
- Easy to update across the whole project

### Lesson 3: Hooks ⚙️
**Files**: `.kiro/hooks/lint-on-save.json`, `test-on-create.json`, `code-review-before-write.json`

Automation that runs on events:
- **lint-on-save**: Runs `npm run lint` when JavaScript files are saved
- **test-on-create**: Runs `npm run test` when test files are created
- **code-review-before-write**: Agent review before src/ files are written

**How it works:**
```bash
1. You save src/calculator-core.js
   → lint-on-save hook triggers
   → npm run lint executes automatically
   → Code is checked for style issues

2. You create src/calculator-ui.test.js
   → test-on-create hook triggers
   → npm run test executes automatically
   → Tests run immediately
```

**Try it:**
Edit a file in `src/` and save - the lint hook will run automatically.

### Lesson 4: Property-Based Testing 🧪
**File**: `src/__tests__/properties.test.js`

Tests mathematical invariants that should always hold true:

**Examples:**
```javascript
// Addition is commutative: a + b = b + a
fc.property(validNumber(), validNumber(), (a, b) => {
  expect(a + b).toBeCloseTo(b + a);
})

// Sine squared + Cosine squared = 1
fc.property(validAngle(), (angle) => {
  const sin_sq = Math.sin(rad) ** 2;
  const cos_sq = Math.cos(rad) ** 2;
  expect(sin_sq + cos_sq).toBeCloseTo(1);
})
```

**Run tests:**
```bash
npm run test:pbt
```

**How it works:**
- `fast-check` generates 100+ random test cases per property
- Tests verify mathematical laws always hold
- Catches subtle bugs that example tests miss
- More confidence in correctness than traditional tests

**Properties tested:**
- ✅ Arithmetic (commutativity, associativity, distributive property)
- ✅ Trigonometry (Pythagorean identity, periodicity)
- ✅ Logarithms (product rule, power rule, quotient rule)
- ✅ Powers (exponent rules)
- ✅ Expression evaluation consistency

### Lesson 5: Powers 📦
**See**: `POWER-SPECIFICATION.md`

Package the calculator as a reusable Kiro Power with:
- Pre-configured MCP server
- Custom agent
- Steering files
- Hooks
- Specifications

**Components packaged:**
- MCP Server (formula validation)
- Custom Agent (calculator dev agent)
- Steering files (standards and rules)
- Hooks (automation)
- Project template

**How it works:**
When you mention "calculator development" or "formula validation" in Kiro, it can:
1. Load the custom calculator-dev agent automatically
2. Apply steering file standards
3. Provide MCP tools for validation
4. Set up automation hooks

### Lesson 6: Model Context Protocol (MCP) 🔌
**File**: `mcp/calculator-mcp-server.js`

Provides tools for formula validation and evaluation:

**Tools provided:**
1. `validate_expression(expression)` - Check expression syntax and safety
2. `evaluate_expression(expression, scope)` - Safely evaluate with high precision
3. `analyze_errors(expression)` - Detect math errors (div by zero, etc.)
4. `convert_angle(value, from, to)` - Convert between angle units
5. `get_constants()` - Return math constants (π, e, φ, etc.)

**How it works:**
```javascript
// Example: Validate a user's expression
const result = validateExpression("sin(45) + 2 * 3");
// Returns:
// {
//   isValid: true,
//   errors: [],
//   warnings: [],
//   complexity: "low",
//   estimatedResult: 5.707
// }
```

**Configuration:**
The MCP server is configured in your Kiro workspace to:
- Validate user input before calculation
- Prevent malicious expressions
- Provide safety checks

### Lesson 7: Custom Agents 👤
**File**: `.kiro/agents/calculator-dev-agent.json`

A specialized agent configured for calculator development with:

**Built-in context:**
- Full knowledge of calculator project structure
- Access to specification and steering files
- Math validation rule knowledge
- Best practices for calculator development

**Permissions:**
- Pre-approved to edit src/ files
- Can run tests and linting
- Cannot push to git
- Restricted command execution

**Instructions:**
- Must use math.js for expressions (never eval)
- Must use Decimal.js for precision
- Follow steering file standards
- Write property-based tests

**How to use:**
When you want Kiro to implement calculator features, use the agent:
```
@calculator-dev-agent Implement the sin function
```

The agent will:
1. Know your project structure
2. Follow your standards
3. Have pre-approval for core files
4. Ask for verification before risky changes

### Bonus Lesson 2: Package a Kiro Power 🎁
**File**: `POWER-SPECIFICATION.md`

Package this project as a distributable Kiro Power:

**What gets packaged:**
- ✅ MCP server (calculator-mcp-server.js)
- ✅ Custom agent (calculator-dev-agent.json)
- ✅ Steering files (standards and rules)
- ✅ Hooks (automation)
- ✅ Project template
- ✅ Specification (spec.json)
- ✅ Property-based tests

**Distribution steps:**

1. **Create GitHub repo**
   ```bash
   git init
   git add .
   git commit -m "Scientific calculator Kiro power"
   git push to your-repo
   ```

2. **Add power.json** at root:
   ```json
   {
     "name": "scientific-calculator",
     "description": "Scientific calculator with validation and testing",
     "version": "1.0.0",
     "keywords": ["calculator", "math", "scientific"],
     "mcpServers": {
       "calculator": {
         "path": "mcp/calculator-mcp-server.js"
       }
     },
     "agents": [
       ".kiro/agents/calculator-dev-agent.json"
     ],
     "steeringFiles": [
       ".kiro/steering/CALCULATOR-STANDARDS.md",
       ".kiro/steering/MATH-VALIDATION-RULES.md"
     ],
     "hooks": [
       ".kiro/hooks/lint-on-save.json",
       ".kiro/hooks/test-on-create.json",
       ".kiro/hooks/code-review-before-write.json"
     ]
   }
   ```

3. **Submit to registry** (optional)
   - Kiro has a curated powers registry
   - Submit your power for community sharing

4. **Users can install:**
   ```bash
   # In Kiro: Powers > Add Power > Search "scientific-calculator"
   # Or: GitHub user-name/scientific-calculator
   ```

## Testing

### Run All Tests
```bash
npm run test
```

### Run Property-Based Tests Only
```bash
npm run test:pbt
```

### Run with Coverage
```bash
npm run test -- --coverage
```

### Specific Test File
```bash
npm run test -- properties.test.js
```

## Development Workflow

### Recommended Workflow Using Lessons

1. **Read the Spec** (Lesson 1)
   ```bash
   cat .kiro/spec.json
   ```

2. **Check Standards** (Lesson 2)
   ```bash
   cat .kiro/steering/CALCULATOR-STANDARDS.md
   ```

3. **Make a change** → Hooks auto-run (Lesson 3)
   - Save a file → lint runs automatically
   - Create a test → tests run automatically
   - Write code → code review check runs

4. **Run PBT to verify** (Lesson 4)
   ```bash
   npm run test:pbt
   ```

5. **Use custom agent** (Lesson 7)
   - In Kiro: "Add the arcsin function"
   - Agent uses steering files, MCP tools, knows your project

6. **Use MCP tools** (Lesson 6)
   - Validate expressions in your own code
   - Call MCP server functions directly

## Mathematical Properties Tested

The property-based test suite verifies:

| Property | Formula | Example |
|----------|---------|---------|
| Commutativity of + | a + b = b + a | 3 + 5 = 5 + 3 |
| Commutativity of × | a × b = b × a | 3 × 5 = 5 × 3 |
| Associativity of + | (a+b)+c = a+(b+c) | (1+2)+3 = 1+(2+3) |
| Associativity of × | (a×b)×c = a×(b×c) | (1×2)×3 = 1×(2×3) |
| Distributive | a×(b+c) = (a×b)+(a×c) | 2×(3+4) = (2×3)+(2×4) |
| Identity of + | a + 0 = a | 5 + 0 = 5 |
| Identity of × | a × 1 = a | 5 × 1 = 5 |
| Pythagorean | sin²θ + cos²θ = 1 | Always true |
| Log Product | log(xy) = log(x)+log(y) | log(10) = log(2)+log(5) |
| Power Rule | log(x^n) = n×log(x) | log(8) = 3×log(2) |

## Next Steps

1. **Install dependencies**: `npm install`
2. **Run tests**: `npm run test:pbt`
3. **Start dev server**: `npm run dev`
4. **Open browser**: http://localhost:8000
5. **Explore the code** - Each file has detailed comments
6. **Read steering files** - Understand the standards
7. **Review spec.json** - See the full feature plan
8. **Try the hooks** - Save a file and watch linting run

## Architecture Decisions

### Why math.js?
- Safe expression evaluation (no eval())
- Proper operator precedence
- Built-in scientific functions
- Error handling

### Why Decimal.js?
- Prevents floating-point errors
- High precision arithmetic (28 digits)
- Essential for calculator accuracy

### Why Property-Based Testing?
- Tests mathematical laws, not just examples
- Catches edge cases automatically
- Verifies correctness at scale

### Why Vanilla JavaScript?
- No build tool needed
- Browser-native
- Demonstrates core concepts
- Easy to understand

## Credits

Built to demonstrate Kiro's powerful features for spec-driven, standards-compliant, AI-assisted development.

## License

MIT

---

**Ready to learn?** Start with reading the spec.json, then explore each lesson file! 🚀
