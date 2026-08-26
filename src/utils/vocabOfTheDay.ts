import { VocabEntry } from '../types/entry';

/**
 * Returns the Vocab of the Day prioritizing words least-recently shown.
 * If no words have been shown yet, it prioritizes by oldest creation date.
 * Automatically updates the entry's lastShownAt when selected.
 */
export function getVocabOfTheDay(vocabList: VocabEntry[]): VocabEntry | null {
  if (vocabList.length === 0) return null;

  // Sort by lastShownAt (ascending: never shown or oldest shown first),
  // tie-breaker: createdAt (ascending: oldest word first)
  const sorted = [...vocabList].sort((a, b) => {
    if (!a.lastShownAt && !b.lastShownAt) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (!a.lastShownAt) return -1;
    if (!b.lastShownAt) return 1;
    return new Date(a.lastShownAt).getTime() - new Date(b.lastShownAt).getTime();
  });

  return sorted[0];
}
