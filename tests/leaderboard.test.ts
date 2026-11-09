import { describe, expect, it } from 'vitest';
import { addRecord, getTopRecords, loadRecords } from '../src/core/leaderboard.js';

function createFakeStorage(initial?: string): {
  getItem: () => string | null;
  setItem: (_key: string, next: string) => void;
} {
  let value = initial ?? null;

  return {
    getItem: (): string | null => value,
    setItem: (_key: string, next: string): void => {
      value = next;
    },
  };
}

const entry = (
  attempts: number,
  date = '2026-11-08T10:00:00.000Z',
  length = 4,
  base = 10,
): {
  attempts: number;
  length: number;
  base: number;
  date: string;
} => ({
  attempts,
  length,
  base,
  date,
});

describe('leaderboard', () => {
  it('returns an empty list when storage is empty', () => {
    expect(loadRecords(createFakeStorage())).toEqual([]);
  });

  it('returns an empty list when storage contains broken JSON', () => {
    expect(loadRecords(createFakeStorage('{oops'))).toEqual([]);
  });

  it('ignores invalid entries', () => {
    const storage = createFakeStorage(JSON.stringify([entry(3), { attempts: 'x' }, null]));

    expect(loadRecords(storage)).toEqual([entry(3)]);
  });

  it('persists records between loads', () => {
    const storage = createFakeStorage();

    addRecord(entry(7), storage);

    expect(loadRecords(storage)).toEqual([entry(7)]);
  });

  it('sorts by attempts ascending', () => {
    const storage = createFakeStorage();

    addRecord(entry(9), storage);
    addRecord(entry(4), storage);
    addRecord(entry(6), storage);

    const top = getTopRecords(loadRecords(storage), 4, 10);

    expect(top.map((record) => record.attempts)).toEqual([4, 6, 9]);
  });

  it('keeps separate tables for different configurations', () => {
    const storage = createFakeStorage();

    addRecord(entry(5), storage);
    addRecord(entry(2, '2026-11-08T11:00:00.000Z', 2, 2), storage);

    const records = loadRecords(storage);

    expect(getTopRecords(records, 4, 10)).toHaveLength(1);
    expect(getTopRecords(records, 2, 2)).toHaveLength(1);
  });

  it('keeps only the top 10 per configuration', () => {
    const storage = createFakeStorage();

    for (let attempts = 1; attempts <= 12; attempts++) {
      addRecord(entry(attempts), storage);
    }

    const top = getTopRecords(loadRecords(storage), 4, 10, 100);

    expect(top).toHaveLength(10);
    expect(top[9]?.attempts).toBe(10);
  });
});
