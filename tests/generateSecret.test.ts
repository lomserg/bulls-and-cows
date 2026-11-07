import { describe, it, expect } from 'vitest';
import { generateSecret } from '../src/core/generateSecret';
describe('generateSecret', () => {
  it('should generate a secret with the specified length', () => {
    const secret = generateSecret(4, 10);

    expect(secret).toHaveLength(4);
  });

  it('should generate a secret with unique digits', () => {
    const secret = generateSecret(4, 10);

    expect(new Set(secret).size).toBe(4);
  });

  it('should generate only valid digits for the specified base', () => {
    const secret = generateSecret(4, 8);
    const validDigits = '01234567';

    expect(secret).toHaveLength(4);
    expect([...secret].every((digit) => validDigits.includes(digit))).toBe(true);
  });

  it('should allow zero as the first digit', () => {
    const random = (): number => 0;
    const secret = generateSecret(4, 10, random);

    expect(secret[0]).toBe('0');
  });

  it('should use the provided random function', () => {
    let calls = 0;
    const random = (): number => {
      calls += 1;
      return 0.5;
    };

    generateSecret(4, 10, random);

    expect(calls).toBeGreaterThan(0);
  });
});
