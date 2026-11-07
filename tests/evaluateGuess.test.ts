import { describe, it, expect } from 'vitest';
import { evaluateGuess } from '../src/core/evaluateGuess';

describe('evaluateGuess', () => {
  it('should return 4 bulls and 0 cows when the guess is correct', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({
      bulls: 4,
      cows: 0,
    });
  });

  it('should return 0 bulls and 4 cows when all digits are misplaced', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({
      bulls: 0,
      cows: 4,
    });
  });

  it('should count both bulls and cows', () => {
    expect(evaluateGuess('1234', '1243')).toEqual({
      bulls: 2,
      cows: 2,
    });
  });

  it('should return 0 bulls and 0 cows when there are no matching digits', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({
      bulls: 0,
      cows: 0,
    });
  });

  it('should compare hexadecimal digits case-insensitively', () => {
    expect(evaluateGuess('A1B2', 'a1b2')).toEqual({
      bulls: 4,
      cows: 0,
    });
  });
});
