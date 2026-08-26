export type EntryType = 'note' | 'list' | 'vocab';

export interface BaseEntry {
  id: string;
  ownerId: string; // Placeholder for future multi-user compatibility per ARCHITECTURE.md
  type: EntryType;
  title: string;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  tags: string[];
}

export interface NoteEntry extends BaseEntry {
  type: 'note';
  content: string;
}

export interface ListItem {
  id: string;
  text: string;
  checked: boolean;
  order: number;
}

export interface ListEntry extends BaseEntry {
  type: 'list';
  items: ListItem[];
}

export interface VocabEntry extends BaseEntry {
  type: 'vocab';
  word: string;
  phonetic?: string;
  partOfSpeech?: string; // e.g. "noun", "adjective"
  meaning: string;
  synonyms: string[];
  antonyms: string[];
  examples: string[];
  lastShownAt?: string; // Timestamp for Vocab of the Day least-recently-shown tracking
}

export type Entry = NoteEntry | ListEntry | VocabEntry;

export type ViewMode = 'home' | 'notes' | 'lists' | 'vocab' | 'calendar' | 'search';
