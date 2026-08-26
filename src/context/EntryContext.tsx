import React, { createContext, useContext, useState, useMemo } from 'react';
import { Entry, EntryType, NoteEntry, ListEntry, VocabEntry, ViewMode } from '../types/entry';
import { INITIAL_MOCK_ENTRIES } from '../data/initialMockData';
import { getVocabOfTheDay } from '../utils/vocabOfTheDay';

interface EntryContextType {
  entries: Entry[];
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
  createBlankEntry: (type: EntryType) => Entry;
  openNewEntry: (type: EntryType) => void;
  getVocabCount: () => number;
  vocabOfTheDay: VocabEntry | null;
}

const EntryContext = createContext<EntryContextType | undefined>(undefined);

export const EntryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<Entry[]>(INITIAL_MOCK_ENTRIES);
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRadialOpen, setIsRadialOpen] = useState<boolean>(false);

  const vocabEntries = useMemo(() => {
    return entries.filter((e): e is VocabEntry => e.type === 'vocab');
  }, [entries]);

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

  const createBlankEntry = (type: EntryType): Entry => {
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
        title: 'Untitled Note',
        content: '',
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

  const openNewEntry = (type: EntryType) => {
    const newEntry = createBlankEntry(type);
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
        createBlankEntry,
        openNewEntry,
        getVocabCount,
        vocabOfTheDay,
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
