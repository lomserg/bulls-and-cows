import { countPossibleSecrets } from '../src/core/countPossibleSecrets';
import { describe, it, expect } from 'vitest';

describe('countPossibleSecrets', () => {
  it('Calculate the number of possible unique combinations of digits, bearing in mind that the order matters', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });
  it('should calculate possible secrets for length 2 and base 10', () => {
    expect(countPossibleSecrets(2, 10)).toBe(90);
  });

  it('should calculate possible secrets for length 1 and base 8', () => {
    expect(countPossibleSecrets(1, 8)).toBe(8);
  });
  it('should calculate possible secrets when length equals base', () => {
    expect(countPossibleSecrets(4, 4)).toBe(24);
  });
  it('should return 0 when length is greater than base', () => {
    expect(countPossibleSecrets(5, 4)).toBe(0);
  });
});
