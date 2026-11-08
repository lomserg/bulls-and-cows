import { createDigitValidator } from './createDigitValidator';

export function isValidGuess(guess: string, length: number, base: number): boolean {
  if (guess.length !== length) {
    return false;
  }
  const guessArr = guess.split('');
  const normalizedGuess = guessArr.map((letter) => letter.toLowerCase());
  const setGuess = new Set(normalizedGuess);
  const isValidDigit = createDigitValidator(base);
  const valid = normalizedGuess.every(isValidDigit);
  if (!valid) {
    return false;
  }
  if (setGuess.size !== length) {
    return false;
  }

  return true;
}
