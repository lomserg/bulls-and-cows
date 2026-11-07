import { describe, it, expect } from 'vitest';
import { isValidGuess } from '../src/core/isValidGuess';

describe('isValidGuess', () => {
  it('should accept a guess with the correct length', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
  });

  it('should reject a guess with an incorrect length', () => {
    expect(isValidGuess('123', 4, 10)).toBe(false);
  });

  it('should reject digits outside the specified base', () => {
    expect(isValidGuess('1284', 4, 8)).toBe(false);
  });

  it('should reject guesses with repeated digits', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
  });

  it('should accept hexadecimal letters', () => {
    expect(isValidGuess('a1b2', 4, 16)).toBe(true);
  });

  it('should reject hexadecimal guesses with repeated digits regardless of case', () => {
    expect(isValidGuess('aA23', 4, 16)).toBe(false);
  });
});
