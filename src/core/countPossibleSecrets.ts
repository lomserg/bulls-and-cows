const mapVars = new Map<string, number>();
export function countPossibleSecrets(length: number, base: number): number {
  const posibleVars = base;
  const key = `${length}-${base}`;
  const foundKey = mapVars.has(key);
  if (length > base) {
    return 0;
  }
  if (foundKey) {
    return mapVars.get(key)!;
  } else {
    if (length === 0) {
      return 1;
    } else {
      const result = posibleVars * countPossibleSecrets(length - 1, base - 1);
      mapVars.set(key, result);
      return result;
    }
  }
}
