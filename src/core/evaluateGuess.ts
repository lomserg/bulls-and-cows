export function evaluateGuess(secret: string, guess: string): { bulls: number; cows: number } {
  const secretArr = secret.toLowerCase().split('');
  const guessArr = guess.toLowerCase().split('');

  return secretArr.reduce(
    (total, currentVal, index) => {
      if (currentVal === guessArr[index]) {
        total.bulls += 1;
      } else if (guessArr.includes(currentVal)) {
        total.cows += 1;
      }

      console.log(secretArr);
      console.log(guessArr);
      return total;
    },
    { bulls: 0, cows: 0 },
  );
}
