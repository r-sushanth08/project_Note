import { Entry } from '../types/entry';

export const INITIAL_MOCK_ENTRIES: Entry[] = [
  // Diary Note
  {
    id: 'note-diary-1',
    ownerId: 'user-1',
    type: 'note',
    noteSubtype: 'diary',
    title: 'Quiet Reflections on Simplicity',
    content: `The best ideas arrive when the mind isn't forced to categorize them immediately.

- Writing without friction is essential.
- Let ideas sit untagged until they naturally belong somewhere.
- Time gives perspective to daily observations.`,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['Personal', 'Experience', 'Favorite'],
  },

  // Brain Dump Note
  {
    id: 'note-braindump-1',
    ownerId: 'user-1',
    type: 'note',
    noteSubtype: 'brain_dump',
    title: 'Late Night Midnight Ideas & Reminders',
    content: `* Explore PWA offline syncing architecture for Phase 3
* Check out modern serif font pairings for dark mode
* Remind sushanth to review list drag-and-drop mobile touch performance
* What makes a journal feel reflective rather than transactional?`,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    tags: ['Idea', 'Work', 'Reminder'],
  },

  // Collections Note
  {
    id: 'note-collection-1',
    ownerId: 'user-1',
    type: 'note',
    noteSubtype: 'collections',
    title: 'Favorite Visual Artists & Illustrators',
    category: 'Artists',
    content: 'A curated log of inspiring visual artists, digital painters, and traditional illustrators.',
    collectionItems: [
      { id: 'item-1', name: 'Claude Monet', notes: 'Impressionist master of light and water lilies' },
      { id: 'item-2', name: 'Moebius (Jean Giraud)', notes: 'Sci-fi comic illustrator with surreal world building' },
      { id: 'item-3', name: 'Shinichiro Watanabe', notes: 'Director known for atmospheric musical compositions' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['Explore', 'Favorite'],
  },

  // Vocab entries
  {
    id: 'vocab-1',
    ownerId: 'user-1',
    type: 'vocab',
    title: 'Eunoia',
    word: 'Eunoia',
    phonetic: '/ yoo-noy-uh /',
    partOfSpeech: 'noun',
    meaning: 'A pure and well-balanced mind; a good spirit. Beautiful thinking.',
    synonyms: ['Goodwill', 'benevolence', 'kindness', 'beautiful thinking'],
    antonyms: ['Malice', 'ill-will', 'kakoneia'],
    examples: [
      '"The speaker\'s eunoia put the troubled audience at complete ease, cultivating a shared space of pure reflection and beautiful thinking."'
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ['Personal', 'Learning'],
    lastShownAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'vocab-2',
    ownerId: 'user-1',
    type: 'vocab',
    title: 'Auspicious',
    word: 'Auspicious',
    phonetic: '/ aw-spish-uhs /',
    partOfSpeech: 'adjective',
    meaning: 'Conducive to success; favorable.',
    synonyms: ['Promising', 'propitious', 'encouraging'],
    antonyms: ['Inauspicious', 'ominous', 'unfavorable'],
    examples: ['"The morning sun provided an auspicious start to our journey."'],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    tags: ['Learning'],
  },
  {
    id: 'vocab-3',
    ownerId: 'user-1',
    type: 'vocab',
    title: 'Laconic',
    word: 'Laconic',
    phonetic: '/ luh-kon-ik /',
    partOfSpeech: 'adjective',
    meaning: 'Using very few words; brief and to the point.',
    synonyms: ['Concise', 'terse', 'succinct'],
    antonyms: ['Verbose', 'loquacious'],
    examples: ['"His laconic reply said more than a long speech ever could."'],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    tags: ['Work'],
  },
  {
    id: 'vocab-4',
    ownerId: 'user-1',
    type: 'vocab',
    title: 'Solitude',
    word: 'Solitude',
    phonetic: '/ sol-i-tood /',
    partOfSpeech: 'noun',
    meaning: 'The state or situation of being alone.',
    synonyms: ['Seclusion', 'privacy', 'peace'],
    antonyms: ['Companionability', 'crowd'],
    examples: ['"She enjoyed the quiet solitude of early morning walks."'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['Personal', 'Experience'],
  },
  {
    id: 'vocab-5',
    ownerId: 'user-1',
    type: 'vocab',
    title: 'Melancholia',
    word: 'Melancholia',
    phonetic: '/ mel-uhn-koh-lee-uh /',
    partOfSpeech: 'noun',
    meaning: 'A feeling of pensive sadness, typically with no obvious cause.',
    synonyms: ['Pensiveness', 'wistfulness', 'gloom'],
    antonyms: ['Joy', 'elation'],
    examples: ['"An autumn rain always brings a subtle sense of melancholia."'],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    tags: ['Experience'],
  },

  // Sample List
  {
    id: 'list-1',
    ownerId: 'user-1',
    type: 'list',
    title: 'Books to Re-read This Year',
    items: [
      { id: 'item-1', text: 'The Courage to Be Disliked', checked: true, order: 0 },
      { id: 'item-2', text: 'Deep Work by Cal Newport', checked: false, order: 1 },
      { id: 'item-3', text: 'Letters from a Stoic — Seneca', checked: false, order: 2 },
      { id: 'item-4', text: 'Atomic Habits', checked: true, order: 3 },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    tags: ['Personal', 'Learning'],
  },
];
