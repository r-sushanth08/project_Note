import { VocabEntry } from '../types/entry';

/**
 * Returns a list of up to `count` (default 3) least-recently shown vocab entries.
 * Entries without `lastShownAt` are prioritized first.
 */
export function getVocabOfTheDayList(entries: VocabEntry[], count = 3): VocabEntry[] {
  if (!entries || entries.length === 0) {
    return [];
  }

  const sorted = [...entries].sort((a, b) => {
    if (!a.lastShownAt && !b.lastShownAt) return 0;
    if (!a.lastShownAt) return -1;
    if (!b.lastShownAt) return 1;
    return new Date(a.lastShownAt).getTime() - new Date(b.lastShownAt).getTime();
  });

  return sorted.slice(0, count);
}

/**
 * Legacy single-word helper
 */
export function getVocabOfTheDay(entries: VocabEntry[]): VocabEntry | null {
  const list = getVocabOfTheDayList(entries, 1);
  return list.length > 0 ? list[0] : null;
}
