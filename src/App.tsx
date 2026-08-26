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

  // Active home effect status: active ONLY on Home screen with no editor open
  const isHomeActive = currentView === 'home' && !selectedEntry;

  // Unique transition key per screen or editor view
  const transitionKey = selectedEntry
    ? `${selectedEntry.type}-editor-${selectedEntry.id}`
    : currentView;

  return (
    <div className="relative min-h-[100dvh] h-[100dvh] text-slate-100 font-sans flex flex-col antialiased overflow-hidden select-none">
      {/* Widescreen Background Image for ALL Screens */}
      <div
        className="fixed inset-0 bg-no-repeat bg-cover bg-[position:right_28%_center] sm:bg-[position:right_20%_center] md:bg-[position:right_15%_center] z-0 pointer-events-none"
        style={{ backgroundImage: "url('/bg-desktop.jpg'), url('/bg-desktop.png'), url('/bg.jpg')" }}
      />

      {/* Synchronized Lantern Warm Glow Pulse (Active ONLY on Home screen) */}
      <div
        className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${
          isHomeActive ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Glow Sphere centered directly over the lantern at every screen width */}
        <div className="absolute right-[22%] sm:right-[16%] md:right-[12%] top-[34%] sm:top-[32%] md:top-[30%] w-36 h-36 sm:w-48 sm:h-48 md:w-60 md:h-60 rounded-full bg-amber-500/35 blur-3xl animate-lantern-pulse" />
        <div className="absolute right-[24%] sm:right-[18%] md:right-[13%] top-[36%] sm:top-[34%] md:top-[32%] w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-orange-400/40 blur-2xl animate-lantern-pulse" />
      </div>

      {/* Ambient Falling Rain Streaks Overlay (Active ONLY on Home screen) */}
      <div
        className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 overflow-hidden ${
          isHomeActive ? 'opacity-40' : 'opacity-0'
        }`}
      >
        {/* Rain Layer 1 */}
        <div className="absolute inset-0 animate-rain-1 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] bg-[length:2px_80px] bg-[repeat:repeat]" />
        {/* Rain Layer 2 */}
        <div className="absolute inset-0 animate-rain-2 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.12)_50%,transparent_100%)] bg-[length:1.5px_60px] bg-[repeat:repeat] [background-position:20px_0]" />
        {/* Rain Layer 3 */}
        <div className="absolute inset-0 animate-rain-3 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] bg-[length:1px_40px] bg-[repeat:repeat] [background-position:40px_0]" />
      </div>

      {/* Dark Translucent Overlay */}
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
