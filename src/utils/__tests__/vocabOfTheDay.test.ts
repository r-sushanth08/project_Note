import { describe, it, expect } from 'vitest';
import { getVocabOfTheDay } from '../vocabOfTheDay';
import { VocabEntry } from '../../types/entry';

describe('Vocab of the Day least-recently-shown algorithm', () => {
  it('returns null if vocab list is empty', () => {
    expect(getVocabOfTheDay([])).toBeNull();
  });

  it('prioritizes words that have never been shown over shown words', () => {
    const vocabList: VocabEntry[] = [
      {
        id: '1',
        ownerId: 'user-1',
        type: 'vocab',
        title: 'Shown Word',
        word: 'Shown Word',
        meaning: 'Meaning 1',
        synonyms: [],
        antonyms: [],
        examples: [],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        tags: [],
        lastShownAt: '2026-08-25T00:00:00Z',
      },
      {
        id: '2',
        ownerId: 'user-1',
        type: 'vocab',
        title: 'Unshown Word',
        word: 'Unshown Word',
        meaning: 'Meaning 2',
        synonyms: [],
        antonyms: [],
        examples: [],
        createdAt: '2026-01-02T00:00:00Z',
        updatedAt: '2026-01-02T00:00:00Z',
        tags: [],
      },
    ];

    const result = getVocabOfTheDay(vocabList);
    expect(result?.word).toBe('Unshown Word');
  });

  it('prioritizes least-recently shown word when all have been shown', () => {
    const vocabList: VocabEntry[] = [
      {
        id: '1',
        ownerId: 'user-1',
        type: 'vocab',
        title: 'Recent Word',
        word: 'Recent Word',
        meaning: 'Meaning 1',
        synonyms: [],
        antonyms: [],
        examples: [],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        tags: [],
        lastShownAt: '2026-08-25T10:00:00Z',
      },
      {
        id: '2',
        ownerId: 'user-1',
        type: 'vocab',
        title: 'Oldest Shown Word',
        word: 'Oldest Shown Word',
        meaning: 'Meaning 2',
        synonyms: [],
        antonyms: [],
        examples: [],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        tags: [],
        lastShownAt: '2026-08-01T10:00:00Z',
      },
    ];

    const result = getVocabOfTheDay(vocabList);
    expect(result?.word).toBe('Oldest Shown Word');
  });
});
