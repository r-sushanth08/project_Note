import React from 'react';
import { EntryProvider, useEntries } from './context/EntryContext';
import { Header } from './components/Header';
import { RadialControl } from './components/RadialControl';
import { PageTransition } from './components/PageTransition';
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
    </>
  );
};

const AppContainer: React.FC = () => {
  const { currentView, selectedEntry } = useEntries();

  // Unique transition key per screen or editor view
  const transitionKey = selectedEntry
    ? `${selectedEntry.type}-editor-${selectedEntry.id}`
    : currentView;

  return (
    <div className="relative min-h-[100dvh] h-[100dvh] text-slate-100 font-sans flex flex-col antialiased overflow-hidden select-none">
      {/* Mobile Background Image (9:16 Portrait < 768px) */}
      <div
        className="fixed inset-0 bg-no-repeat bg-cover bg-center md:hidden z-0"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />

      {/* Desktop Widescreen Background Image (16:9 Landscape >= 768px) */}
      <div
        className="fixed inset-0 bg-no-repeat bg-cover hidden md:block bg-[position:right_10%_center] z-0 transition-all duration-500"
        style={{ backgroundImage: "url('/bg-desktop.jpg'), url('/bg-desktop.png'), url('/bg.jpg')" }}
      />

      {/* Dark Translucent Vignette Overlay */}
      <div className="fixed inset-0 bg-slate-950/40 md:bg-gradient-to-r md:from-slate-950/80 md:via-slate-950/40 md:to-transparent backdrop-blur-[0.5px] z-0 pointer-events-none" />

      {/* Main Full-Width Content Container */}
      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 w-full flex flex-col min-h-0 overflow-hidden">
          <PageTransition transitionKey={transitionKey}>
            <MainContent />
          </PageTransition>
        </main>
      </div>

      {/* Floating Radial Capture Control present on all non-home views per UX.md */}
      {currentView !== 'home' && !selectedEntry && <RadialControl isHomeCentered={false} />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <EntryProvider>
      <AppContainer />
    </EntryProvider>
  );
};

export default App;
