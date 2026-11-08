import { createDigitValidator } from '../src/core/createDigitValidator';
import { describe, it, expect } from 'vitest';

describe('createDigitValidator', () => {
  it('For base 8, the digit 7 should be considered valid', () => {
    expect(createDigitValidator(8)('7')).toBe(true);
  });
});
