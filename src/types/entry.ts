export type EntryType = 'note' | 'list' | 'vocab';

export type NoteSubtype = 'diary' | 'brain_dump' | 'collections';

export interface CollectionItem {
  id: string;
  name: string;
  notes?: string;
  linkOrMetadata?: string;
}

export interface BaseEntry {
  id: string;
  ownerId: string;
  type: EntryType;
  title: string;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  tags: string[];
}

export interface NoteEntry extends BaseEntry {
  type: 'note';
  noteSubtype: NoteSubtype;
  content: string; // Freeform prose for Diary & Brain Dump
  category?: string; // e.g. "Books", "Movies", "Artists", "Places", "Brands", "Topics" for Collections
  collectionItems?: CollectionItem[]; // Items for Collections sub-type
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
  partOfSpeech?: string;
  meaning: string;
  synonyms: string[];
  antonyms: string[];
  examples: string[];
  lastShownAt?: string;
}

export type Entry = NoteEntry | ListEntry | VocabEntry;

export type ViewMode = 'home' | 'notes' | 'lists' | 'vocab' | 'calendar' | 'search';

export const DEFAULT_BUILTIN_TAGS = [
  'Work',
  'Personal',
  'Idea',
  'Learning',
  'Important',
  'Reminder',
  'People',
  'Travel',
  'Experience',
  'Question',
  'Favorite',
  'Explore',
];
