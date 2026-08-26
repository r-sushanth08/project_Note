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
      <div className="relative min-h-[100dvh] h-[100dvh] text-slate-100 font-sans flex flex-col antialiased overflow-hidden">
        {/* Full-screen Background Image with Responsive Positioning & Gradient Overlay */}
        <div
          className="fixed inset-0 bg-no-repeat bg-cover bg-center md:bg-[position:right_15%_center] z-0 transition-all duration-500"
          style={{ backgroundImage: "url('/bg.jpg')" }}
        />
        <div className="fixed inset-0 bg-slate-950/40 md:bg-gradient-to-r md:from-slate-950/85 md:via-slate-950/50 md:to-slate-950/20 backdrop-blur-[0.5px] z-0 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full overflow-y-auto">
          <Header />
          <main className="flex-1 w-full flex flex-col">
            <MainContent />
          </main>
        </div>
      </div>
    </EntryProvider>
  );
};

export default App;
