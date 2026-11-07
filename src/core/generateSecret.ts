export function generateSecret(
  length: number,
  base: number,
  random: () => number = Math.random,
): string {
  const availableDigits = '0123456789abcdef'.slice(0, base).split('');

  const secret: string[] = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(random() * availableDigits.length);
    const selectedDigit = availableDigits.splice(randomIndex, 1)[0]!;
    secret.push(selectedDigit);
  }

  return secret.join('');
}
