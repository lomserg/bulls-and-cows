export interface RecordEntry {
  attempts: number;
  length: number;
  base: number;
  date: string;
}

type RecordsStorage = Pick<Storage, 'getItem' | 'setItem'>;

const STORAGE_KEY = 'bulls-and-cows:records';
const MAX_PER_CONFIG = 10;

function isRecordEntry(value: unknown): value is RecordEntry {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.attempts === 'number' &&
    Number.isInteger(entry.attempts) &&
    entry.attempts > 0 &&
    typeof entry.length === 'number' &&
    Number.isInteger(entry.length) &&
    entry.length > 0 &&
    typeof entry.base === 'number' &&
    [2, 8, 10, 16].includes(entry.base) &&
    typeof entry.date === 'string' &&
    !Number.isNaN(Date.parse(entry.date))
  );
}

function resolveStorage(storage?: RecordsStorage): RecordsStorage | null {
  if (storage) {
    return storage;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadRecords(storage?: RecordsStorage): RecordEntry[] {
  try {
    const raw = resolveStorage(storage)?.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed.filter(isRecordEntry) : [];
  } catch {
    return [];
  }
}

export function getTopRecords(
  records: RecordEntry[],
  length: number,
  base: number,
  limit: number = MAX_PER_CONFIG,
): RecordEntry[] {
  return records
    .filter((record) => record.length === length && record.base === base)
    .sort((a, b) => a.attempts - b.attempts || a.date.localeCompare(b.date))
    .slice(0, limit);
}

export function addRecord(entry: RecordEntry, storage?: RecordsStorage): RecordEntry[] {
  const records = loadRecords(storage);

  const otherConfigs = records.filter(
    (record) => record.length !== entry.length || record.base !== entry.base,
  );

  const sameConfig = getTopRecords([...records, entry], entry.length, entry.base);

  const updated = [...otherConfigs, ...sameConfig];

  try {
    resolveStorage(storage)?.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Игра продолжает работать, даже если запись в хранилище недоступна.
  }

  return updated;
}
