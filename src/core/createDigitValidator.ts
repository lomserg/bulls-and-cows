export function createDigitValidator(base: number): (digit: string) => boolean {
  const validDigits = '0123456789abcdef'.slice(0, base);
  return (digit: string): boolean => {
    return validDigits.includes(digit.toLowerCase());
  };
}
