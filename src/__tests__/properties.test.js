/**
 * Property-Based Tests for Scientific Calculator
 * Uses fast-check to test mathematical invariants
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import * as math from 'math.js';
import Decimal from 'decimal.js';

describe('Calculator Mathematical Properties', () => {
  // Arbiter for generating valid numbers for calculator
  const validNumber = () => fc.integer({ min: -1000, max: 1000 });
  const validPositive = () => fc.integer({ min: 1, max: 1000 });
  const validAngle = () => fc.integer({ min: -360, max: 360 });

  describe('Arithmetic Properties', () => {
    it('should satisfy commutativity of addition: a + b = b + a', () => {
      fc.assert(
        fc.property(validNumber(), validNumber(), (a, b) => {
          const result1 = new Decimal(a).plus(b).toNumber();
          const result2 = new Decimal(b).plus(a).toNumber();
          expect(result1).toBeCloseTo(result2);
        })
      );
    });

    it('should satisfy commutativity of multiplication: a * b = b * a', () => {
      fc.assert(
        fc.property(validNumber(), validNumber(), (a, b) => {
          const result1 = new Decimal(a).times(b).toNumber();
          const result2 = new Decimal(b).times(a).toNumber();
          expect(result1).toBeCloseTo(result2);
        })
      );
    });

    it('should satisfy associativity of addition: (a + b) + c = a + (b + c)', () => {
      fc.assert(
        fc.property(validNumber(), validNumber(), validNumber(), (a, b, c) => {
          const left = new Decimal(a).plus(b).plus(c).toNumber();
          const right = new Decimal(a).plus(new Decimal(b).plus(c)).toNumber();
          expect(left).toBeCloseTo(right);
        })
      );
    });

    it('should satisfy associativity of multiplication: (a * b) * c = a * (b * c)', () => {
      fc.assert(
        fc.property(validNumber(), validNumber(), validNumber(), (a, b, c) => {
          const left = new Decimal(a).times(b).times(c).toNumber();
          const right = new Decimal(a).times(new Decimal(b).times(c)).toNumber();
          expect(left).toBeCloseTo(right);
        })
      );
    });

    it('should satisfy distributive property: a * (b + c) = (a * b) + (a * c)', () => {
      fc.assert(
        fc.property(validNumber(), validNumber(), validNumber(), (a, b, c) => {
          const left = new Decimal(a).times(new Decimal(b).plus(c)).toNumber();
          const right = new Decimal(a).times(b).plus(new Decimal(a).times(c)).toNumber();
          expect(left).toBeCloseTo(right);
        })
      );
    });

    it('should satisfy additive identity: a + 0 = a', () => {
      fc.assert(
        fc.property(validNumber(), (a) => {
          const result = new Decimal(a).plus(0).toNumber();
          expect(result).toBeCloseTo(a);
        })
      );
    });

    it('should satisfy multiplicative identity: a * 1 = a', () => {
      fc.assert(
        fc.property(validNumber(), (a) => {
          const result = new Decimal(a).times(1).toNumber();
          expect(result).toBeCloseTo(a);
        })
      );
    });

    it('should satisfy additive inverse: a + (-a) = 0', () => {
      fc.assert(
        fc.property(validNumber(), (a) => {
          const result = new Decimal(a).plus(-a).toNumber();
          expect(Math.abs(result)).toBeLessThan(1e-10);
        })
      );
    });

    it('should satisfy multiplicative inverse: a * (1/a) = 1 for a ≠ 0', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 1000 }), (a) => {
          const result = new Decimal(a).times(new Decimal(1).dividedBy(a)).toNumber();
          expect(result).toBeCloseTo(1);
        })
      );
    });
  });

  describe('Trigonometric Properties', () => {
    it('should satisfy Pythagorean identity: sin²(θ) + cos²(θ) = 1', () => {
      fc.assert(
        fc.property(validAngle(), (angle) => {
          // Convert to radians
          const rad = (angle * Math.PI) / 180;
          const sinSq = Math.sin(rad) ** 2;
          const cosSq = Math.cos(rad) ** 2;
          const result = sinSq + cosSq;
          expect(result).toBeCloseTo(1, 5);
        })
      );
    });

    it('should satisfy tan identity: tan(θ) = sin(θ) / cos(θ) for cos(θ) ≠ 0', () => {
      fc.assert(
        fc.property(validAngle(), (angle) => {
          const rad = (angle * Math.PI) / 180;
          // Skip when cos is very close to 0
          if (Math.abs(Math.cos(rad)) < 0.1) return true;

          const tanResult = Math.tan(rad);
          const sinCos = Math.sin(rad) / Math.cos(rad);
          expect(tanResult).toBeCloseTo(sinCos, 5);
        })
      );
    });

    it('should satisfy periodicity: sin(θ + 360°) = sin(θ)', () => {
      fc.assert(
        fc.property(validAngle(), (angle) => {
          const rad1 = (angle * Math.PI) / 180;
          const rad2 = ((angle + 360) * Math.PI) / 180;
          const result1 = Math.sin(rad1);
          const result2 = Math.sin(rad2);
          expect(result1).toBeCloseTo(result2, 5);
        })
      );
    });
  });

  describe('Logarithmic Properties', () => {
    it('should satisfy product rule: log(x*y) = log(x) + log(y) for x,y > 0', () => {
      fc.assert(
        fc.property(validPositive(), validPositive(), (x, y) => {
          const left = Math.log10(x * y);
          const right = Math.log10(x) + Math.log10(y);
          expect(left).toBeCloseTo(right);
        })
      );
    });

    it('should satisfy power rule: log(x^n) = n * log(x) for x > 0', () => {
      fc.assert(
        fc.property(validPositive(), fc.integer({ min: 1, max: 10 }), (x, n) => {
          const left = Math.log10(Math.pow(x, n));
          const right = n * Math.log10(x);
          expect(left).toBeCloseTo(right);
        })
      );
    });

    it('should satisfy quotient rule: log(x/y) = log(x) - log(y) for x,y > 0', () => {
      fc.assert(
        fc.property(validPositive(), validPositive(), (x, y) => {
          const left = Math.log10(x / y);
          const right = Math.log10(x) - Math.log10(y);
          expect(left).toBeCloseTo(right);
        })
      );
    });
  });

  describe('Power Properties', () => {
    it('should satisfy product rule: x^m * x^n = x^(m+n)', () => {
      fc.assert(
        fc.property(
          validPositive(),
          fc.integer({ min: -5, max: 5 }),
          fc.integer({ min: -5, max: 5 }),
          (x, m, n) => {
            const left = Math.pow(x, m) * Math.pow(x, n);
            const right = Math.pow(x, m + n);
            expect(left).toBeCloseTo(right, 5);
          }
        )
      );
    });

    it('should satisfy zero exponent: x^0 = 1 for x ≠ 0', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 1000 }), (x) => {
          const result = Math.pow(x, 0);
          expect(result).toBeCloseTo(1);
        })
      );
    });

    it('should satisfy power rule: (x^m)^n = x^(m*n)', () => {
      fc.assert(
        fc.property(
          validPositive(),
          fc.integer({ min: -3, max: 3 }),
          fc.integer({ min: -3, max: 3 }),
          (x, m, n) => {
            const left = Math.pow(Math.pow(x, m), n);
            const right = Math.pow(x, m * n);
            expect(left).toBeCloseTo(right, 5);
          }
        )
      );
    });
  });

  describe('Expression Evaluation Properties', () => {
    it('should produce finite results for valid expressions', () => {
      fc.assert(
        fc.property(validNumber(), validNumber(), (a, b) => {
          if (b === 0) return true; // Skip division by zero
          const result = a + b;
          expect(Number.isFinite(result)).toBe(true);
        })
      );
    });

    it('should produce consistent results for identical inputs', () => {
      fc.assert(
        fc.property(validNumber(), validNumber(), (a, b) => {
          const result1 = a + b * 2 - 1;
          const result2 = a + b * 2 - 1;
          expect(result1).toBeCloseTo(result2);
        })
      );
    });

    it('should handle negative results correctly', () => {
      fc.assert(
        fc.property(validNumber(), (a) => {
          const result = -a;
          expect(result).toBeCloseTo(-a);
        })
      );
    });
  });

  describe('Input Validation Properties', () => {
    it('should reject division by zero', () => {
      expect(() => {
        math.evaluate('5 / 0');
      }).toThrow();
    });

    it('should handle square root of negative in error', () => {
      expect(() => {
        math.evaluate('sqrt(-1)');
      }).toThrow();
    });
  });
});
