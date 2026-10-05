# Mathematical Validation Rules

This document defines the mathematical rules and validation logic for the Scientific Calculator.

## Valid Input Rules

### Expression Syntax
- Numbers: integers and decimals (e.g., `42`, `3.14`, `-2.5`)
- Operators: `+`, `-`, `*`, `/`, `^` (power)
- Functions: `sin()`, `cos()`, `tan()`, `sqrt()`, `log()`, `ln()`, `abs()`
- Valid: `sin(45) + 2 * 3`
- Invalid: `sin(45 +`, `2 * * 3`, `sqrt(-1)` (in real mode)

### Decimal Representation
- Support up to 15 significant digits
- Allow scientific notation: `1.5e-10`
- Reject: `NaN`, `Infinity`, `undefined`

## Mathematical Constraints

### Trigonometric Functions
- Valid input range: any real number
- Output range: [-1, 1] for sin/cos, [-∞, ∞] for tan
- Modes: Degrees (default) and Radians

### Logarithmic Functions
- `log(x)` and `ln(x)`: x must be > 0
- Return error: "Logarithm of non-positive number"

### Square Root
- `sqrt(x)`: x must be ≥ 0 (in real number mode)
- Return error: "Square root of negative number"

### Power Operations
- `x^y`: Generally unrestricted
- Exception: `0^0` is undefined, return error
- `0^negative` is undefined, return error

### Division
- `x / 0`: Always invalid, return "Division by zero"
- Non-zero results must be finite

## Error Messages

| Condition | Error Message |
|-----------|---------------|
| Division by zero | `Error: Division by zero` |
| Invalid syntax | `Error: Invalid expression syntax` |
| Log of non-positive | `Error: Logarithm undefined for x ≤ 0` |
| Sqrt of negative | `Error: Square root of negative number` |
| Undefined operation | `Error: Operation undefined` |
| Stack overflow | `Error: Expression too complex` |

## Precision Rules

### Calculation Precision
- Internal: Use Decimal.js with 28-digit precision
- Display: Round to 10 decimal places for readability
- Special case: Exact integers display without decimal point

### Rounding Behavior
- Display uses "banker's rounding" (round half to even)
- Edge case: `0.1 + 0.2 = 0.3` (not 0.30000000000000004)

## History Storage Rules

- Store original expression as typed
- Store calculated result with full precision
- Store timestamp of calculation
- Keep history up to 100 entries
- Serialize as JSON with safe numeric values

## Property-Based Testing Rules

### Invariants (must always be true)

1. **Commutativity of Addition & Multiplication**
   ```
   For any a, b: a + b = b + a
   For any a, b: a * b = b * a
   ```

2. **Associativity**
   ```
   For any a, b, c: (a + b) + c = a + (b + c)
   For any a, b, c: (a * b) * c = a * (b * c)
   ```

3. **Distributive Property**
   ```
   For any a, b, c: a * (b + c) = (a * b) + (a * c)
   ```

4. **Identity Elements**
   ```
   For any a: a + 0 = a
   For any a (a ≠ 0): a * 1 = a
   ```

5. **Inverse Elements**
   ```
   For any a: a + (-a) = 0
   For any a (a ≠ 0): a * (1/a) = 1
   ```

6. **Trigonometric Identities**
   ```
   For any angle θ: sin²(θ) + cos²(θ) = 1
   For any angle θ: tan(θ) = sin(θ) / cos(θ)
   ```

7. **Logarithm Properties**
   ```
   For any x, y > 0: log(x*y) = log(x) + log(y)
   For any x > 0, n: log(x^n) = n * log(x)
   ```

8. **Power Properties**
   ```
   For any x, m, n: x^m * x^n = x^(m+n)
   For any x ≠ 0: x^0 = 1
   ```

## Validation Checklist

Before accepting user input:
- [ ] Expression contains only valid characters
- [ ] Parentheses are balanced (when supported)
- [ ] No consecutive operators
- [ ] Function names are valid
- [ ] Division by zero is not occurring
- [ ] Logarithm arguments are positive
- [ ] No stack overflow conditions

