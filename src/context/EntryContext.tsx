import React, { createContext, useContext, useState, useMemo } from 'react';
import { Entry, EntryType, NoteEntry, ListEntry, VocabEntry, ViewMode, DEFAULT_BUILTIN_TAGS, NoteSubtype } from '../types/entry';
import { INITIAL_MOCK_ENTRIES } from '../data/initialMockData';
import { getVocabOfTheDay, getVocabOfTheDayList } from '../utils/vocabOfTheDay';

interface EntryContextType {
  entries: Entry[];
  customTags: string[];
  allTags: string[];
  currentView: ViewMode;
  selectedEntry: Entry | null;
  selectedDate: string | null;
  searchQuery: string;
  isRadialOpen: boolean;
  setCurrentView: (view: ViewMode) => void;
  setSelectedEntry: (entry: Entry | null) => void;
  setSelectedDate: (date: string | null) => void;
  setSearchQuery: (query: string) => void;
  setIsRadialOpen: (open: boolean) => void;
  addEntry: (entry: Entry) => void;
  updateEntry: (entry: Entry) => void;
  deleteEntry: (id: string) => void;
  addCustomTag: (tag: string) => void;
  createBlankEntry: (type: EntryType, subtype?: NoteSubtype) => Entry;
  openNewEntry: (type: EntryType, subtype?: NoteSubtype) => void;
  getVocabCount: () => number;
  vocabOfTheDay: VocabEntry | null;
  vocabOfTheDayList: VocabEntry[];
}

const EntryContext = createContext<EntryContextType | undefined>(undefined);

export const EntryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<Entry[]>(INITIAL_MOCK_ENTRIES);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRadialOpen, setIsRadialOpen] = useState<boolean>(false);

  // Combine default built-in tags with user created custom tags
  const allTags = useMemo(() => {
    const combined = [...DEFAULT_BUILTIN_TAGS, ...customTags];
    return Array.from(new Set(combined));
  }, [customTags]);

  const addCustomTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    if (!allTags.includes(formatted)) {
      setCustomTags((prev) => [...prev, formatted]);
    }
  };

  const vocabEntries = useMemo(() => {
    return entries.filter((e): e is VocabEntry => e.type === 'vocab');
  }, [entries]);

  const vocabOfTheDayList = useMemo(() => {
    return getVocabOfTheDayList(vocabEntries, 3);
  }, [vocabEntries]);

  const vocabOfTheDay = useMemo(() => {
    return getVocabOfTheDay(vocabEntries);
  }, [vocabEntries]);

  const getVocabCount = () => vocabEntries.length;

  const addEntry = (entry: Entry) => {
    setEntries((prev) => [entry, ...prev]);
  };

  const updateEntry = (updated: Entry) => {
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    if (selectedEntry?.id === updated.id) {
      setSelectedEntry(updated);
    }
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
  };

  const createBlankEntry = (type: EntryType, subtype: NoteSubtype = 'diary'): Entry => {
    const now = new Date().toISOString();
    const base = {
      id: `${type}-${Date.now()}`,
      ownerId: 'user-1',
      createdAt: now,
      updatedAt: now,
      tags: [],
    };

    if (type === 'note') {
      const note: NoteEntry = {
        ...base,
        type: 'note',
        noteSubtype: subtype,
        title: subtype === 'diary' ? 'Journal Entry' : subtype === 'brain_dump' ? 'Brain Dump' : 'New Collection',
        content: '',
        category: subtype === 'collections' ? 'General' : undefined,
        collectionItems: subtype === 'collections' ? [] : undefined,
      };
      return note;
    } else if (type === 'list') {
      const list: ListEntry = {
        ...base,
        type: 'list',
        title: 'Untitled List',
        items: [],
      };
      return list;
    } else {
      const vocab: VocabEntry = {
        ...base,
        type: 'vocab',
        title: '',
        word: '',
        meaning: '',
        synonyms: [],
        antonyms: [],
        examples: [],
      };
      return vocab;
    }
  };

  const openNewEntry = (type: EntryType, subtype: NoteSubtype = 'diary') => {
    const newEntry = createBlankEntry(type, subtype);
    addEntry(newEntry);
    setSelectedEntry(newEntry);
    if (type === 'note') setCurrentView('notes');
    else if (type === 'list') setCurrentView('lists');
    else if (type === 'vocab') setCurrentView('vocab');
  };

  return (
    <EntryContext.Provider
      value={{
        entries,
        customTags,
        allTags,
        currentView,
        selectedEntry,
        selectedDate,
        searchQuery,
        isRadialOpen,
        setCurrentView,
        setSelectedEntry,
        setSelectedDate,
        setSearchQuery,
        setIsRadialOpen,
        addEntry,
        updateEntry,
        deleteEntry,
        addCustomTag,
        createBlankEntry,
        openNewEntry,
        getVocabCount,
        vocabOfTheDay,
        vocabOfTheDayList,
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};

export const useEntries = () => {
  const context = useContext(EntryContext);
  if (!context) {
    throw new Error('useEntries must be used within an EntryProvider');
  }
  return context;
};
