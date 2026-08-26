import { describe, it, expect } from 'vitest';
import { getVocabOfTheDay, getVocabOfTheDayList } from '../vocabOfTheDay';
import { VocabEntry } from '../../types/entry';

describe('vocabOfTheDay utils', () => {
  const sampleEntries: VocabEntry[] = [
    {
      id: '1',
      ownerId: 'u1',
      type: 'vocab',
      title: 'Word 1',
      word: 'Word 1',
      meaning: 'Meaning 1',
      synonyms: [],
      antonyms: [],
      examples: [],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      tags: [],
      lastShownAt: '2026-08-20T00:00:00Z',
    },
    {
      id: '2',
      ownerId: 'u1',
      type: 'vocab',
      title: 'Word 2',
      word: 'Word 2',
      meaning: 'Meaning 2',
      synonyms: [],
      antonyms: [],
      examples: [],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      tags: [],
      // Never shown
    },
    {
      id: '3',
      ownerId: 'u1',
      type: 'vocab',
      title: 'Word 3',
      word: 'Word 3',
      meaning: 'Meaning 3',
      synonyms: [],
      antonyms: [],
      examples: [],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      tags: [],
      lastShownAt: '2026-08-10T00:00:00Z',
    },
    {
      id: '4',
      ownerId: 'u1',
      type: 'vocab',
      title: 'Word 4',
      word: 'Word 4',
      meaning: 'Meaning 4',
      synonyms: [],
      antonyms: [],
      examples: [],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      tags: [],
      lastShownAt: '2026-08-25T00:00:00Z',
    },
  ];

  it('returns null if list is empty', () => {
    expect(getVocabOfTheDay([])).toBeNull();
    expect(getVocabOfTheDayList([])).toEqual([]);
  });

  it('prioritizes un-shown entries and least-recently shown entries', () => {
    const list = getVocabOfTheDayList(sampleEntries, 3);
    expect(list.length).toBe(3);
    expect(list[0].id).toBe('2'); // Never shown
    expect(list[1].id).toBe('3'); // Shown Aug 10
    expect(list[2].id).toBe('1'); // Shown Aug 20
  });
});
