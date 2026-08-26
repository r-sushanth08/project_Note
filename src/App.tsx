import React from 'react';
import { EntryProvider, useEntries } from './context/EntryContext';
import { Header } from './components/Header';
import { RadialControl } from './components/RadialControl';
import { HomeView } from './views/HomeView';
import { VocabView } from './views/VocabView';
import { VocabEditorView } from './views/VocabEditorView';
import { NotesView } from './views/NotesView';
import { NoteEditorView } from './views/NoteEditorView';
import { ListsView } from './views/ListsView';
import { ListEditorView } from './views/ListEditorView';
import { CalendarView } from './views/CalendarView';
import { SearchView } from './views/SearchView';
import { NoteEntry, ListEntry, VocabEntry } from './types/entry';

const MainContent: React.FC = () => {
  const { currentView, selectedEntry, setSelectedEntry } = useEntries();

  // Active Editor rendering if an entry is selected
  if (selectedEntry) {
    if (selectedEntry.type === 'vocab') {
      return (
        <VocabEditorView
          vocab={selectedEntry as VocabEntry}
          onBack={() => setSelectedEntry(null)}
        />
      );
    }
    if (selectedEntry.type === 'note') {
      return (
        <NoteEditorView
          note={selectedEntry as NoteEntry}
          onBack={() => setSelectedEntry(null)}
        />
      );
    }
    if (selectedEntry.type === 'list') {
      return (
        <ListEditorView
          list={selectedEntry as ListEntry}
          onBack={() => setSelectedEntry(null)}
        />
      );
    }
  }

  // Section Views rendering
  return (
    <>
      {currentView === 'home' && <HomeView />}
      {currentView === 'vocab' && <VocabView />}
      {currentView === 'notes' && <NotesView />}
      {currentView === 'lists' && <ListsView />}
      {currentView === 'calendar' && <CalendarView />}
      {currentView === 'search' && <SearchView />}

      {/* Floating Radial Capture Dot present on all non-home views per UX.md */}
      {currentView !== 'home' && <RadialControl isHomeCentered={false} />}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <EntryProvider>
      <div className="min-h-screen bg-bg text-ink-primary font-sans flex flex-col antialiased">
        <Header />
        <main className="flex-1 w-full">
          <MainContent />
        </main>
      </div>
    </EntryProvider>
  );
};

export default App;
