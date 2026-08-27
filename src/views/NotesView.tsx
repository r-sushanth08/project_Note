import React, { useState, useMemo } from 'react';
import { useEntries } from '../context/EntryContext';
import { NoteEntry, NoteSubtype } from '../types/entry';
import { Plus, BookOpen, Lightbulb, FolderKanban, Calendar as CalendarIcon, ArrowUpRight } from 'lucide-react';

export const NotesView: React.FC = () => {
  const { entries, setCurrentView, setSelectedEntry, openNewEntry } = useEntries();
  const [activeSubtypeFilter, setActiveSubtypeFilter] = useState<'all' | NoteSubtype>('all');
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const notesList = useMemo(() => {
    return entries.filter((e): e is NoteEntry => e.type === 'note');
  }, [entries]);

  // Generate a rolling 14-day date strip centered around today
  const dateStripItems = useMemo(() => {
    const dates: { iso: string; dayLetter: string; dayNum: number; isToday: boolean }[] = [];
    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);

    const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // 7 days in past + today + 6 days in future
    for (let i = -7; i <= 6; i++) {
      const d = new Date(todayObj);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayLetter = dayLetters[d.getDay()];
      const dayNum = d.getDate();
      const isToday = i === 0;

      dates.push({ iso, dayLetter, dayNum, isToday });
    }

    return dates;
  }, []);

  // Filter notes by subtype & active date
  const filteredNotes = useMemo(() => {
    return notesList.filter((note) => {
      if (activeSubtypeFilter !== 'all' && (note.noteSubtype || 'diary') !== activeSubtypeFilter) {
        return false;
      }
      if (selectedDateISO) {
        const noteDateISO = new Date(note.createdAt).toISOString().split('T')[0];
        if (noteDateISO !== selectedDateISO) return false;
      }
      return true;
    });
  }, [notesList, activeSubtypeFilter, selectedDateISO]);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 flex flex-col h-full overflow-hidden">
      {/* Static Subheader Title & Filter Bars (Notes scroll below this, never behind or under the title) */}
      <div className="flex flex-col gap-3 pt-3 pb-4 border-b border-white/10 flex-shrink-0 z-10 bg-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-900/80 border border-white/20 text-slate-300 hover:text-white hover:border-orange-400 transition-all shadow-sm"
            >
              ‹
            </button>
            <h1 className="text-3xl font-serif font-medium text-white">Notes</h1>
          </div>

          {/* New Note Sub-type Quick Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
              className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Note</span>
            </button>

            {isAddMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-white/20 rounded-2xl shadow-float p-1.5 z-40 flex flex-col gap-1 backdrop-blur-md">
                <button
                  onClick={() => {
                    openNewEntry('note', 'diary');
                    setIsAddMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-xl transition-colors text-left font-medium"
                >
                  <BookOpen className="w-3.5 h-3.5 text-orange-400" />
                  <span>Diary</span>
                </button>

                <button
                  onClick={() => {
                    openNewEntry('note', 'brain_dump');
                    setIsAddMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-xl transition-colors text-left font-medium"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Brain Dump</span>
                </button>

                <button
                  onClick={() => {
                    openNewEntry('note', 'collections');
                    setIsAddMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-xl transition-colors text-left font-medium"
                >
                  <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Collections</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sub-type Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          <button
            onClick={() => setActiveSubtypeFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeSubtypeFilter === 'all'
                ? 'bg-orange-500 text-white font-semibold shadow-sm'
                : 'bg-slate-900/60 text-slate-300 border border-white/15 hover:border-white/30'
            }`}
          >
            All Notes ({notesList.length})
          </button>

          <button
            onClick={() => setActiveSubtypeFilter('diary')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeSubtypeFilter === 'diary'
                ? 'bg-orange-500 text-white font-semibold shadow-sm'
                : 'bg-slate-900/60 text-slate-300 border border-white/15 hover:border-white/30'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Diary</span>
          </button>

          <button
            onClick={() => setActiveSubtypeFilter('brain_dump')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeSubtypeFilter === 'brain_dump'
                ? 'bg-orange-500 text-white font-semibold shadow-sm'
                : 'bg-slate-900/60 text-slate-300 border border-white/15 hover:border-white/30'
            }`}
          >
            <Lightbulb className="w-3 h-3" />
            <span>Brain Dump</span>
          </button>

          <button
            onClick={() => setActiveSubtypeFilter('collections')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeSubtypeFilter === 'collections'
                ? 'bg-orange-500 text-white font-semibold shadow-sm'
                : 'bg-slate-900/60 text-slate-300 border border-white/15 hover:border-white/30'
            }`}
          >
            <FolderKanban className="w-3 h-3" />
            <span>Collections</span>
          </button>
        </div>

        {/* HORIZONTAL CALENDAR DATE STRIP BAR (Replaces tag bar) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-white/10">
          {/* Left Calendar Icon & All Dates Toggle */}
          <button
            onClick={() => setSelectedDateISO(null)}
            className={`p-2 rounded-2xl flex items-center gap-1.5 text-xs font-semibold transition-all flex-shrink-0 ${
              selectedDateISO === null
                ? 'bg-orange-500/20 text-orange-300 border border-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                : 'bg-slate-900/80 text-slate-400 border border-white/15 hover:text-white hover:border-white/30'
            }`}
            title="Show All Dates"
          >
            <CalendarIcon className="w-4 h-4 text-orange-400" />
            <span>All</span>
          </button>

          {/* Date Pills List (Day letter above day number) */}
          {dateStripItems.map((item) => {
            const isSelected = selectedDateISO === item.iso;
            return (
              <button
                key={item.iso}
                onClick={() => setSelectedDateISO(isSelected ? null : item.iso)}
                className={`flex flex-col items-center justify-center min-w-[38px] px-2.5 py-1.5 rounded-2xl transition-all duration-300 flex-shrink-0 border ${
                  isSelected
                    ? 'bg-orange-500/25 border-orange-400 text-orange-300 shadow-[0_0_16px_rgba(249,115,22,0.5)] font-bold scale-105'
                    : item.isToday
                    ? 'bg-slate-900/90 border-orange-500/50 text-white font-semibold'
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-semibold tracking-wider uppercase opacity-75">
                  {item.dayLetter}
                </span>
                <span className="text-sm font-serif font-bold leading-none mt-0.5">
                  {item.dayNum}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Folder Deck Container — Note cards stack over each other as user scrolls up */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-3 pb-48">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16 text-slate-400 italic bg-slate-900/60 rounded-2xl border border-white/15 backdrop-blur-md my-auto">
            No notes recorded for this selection. Drag the pencil dot below to create one!
          </div>
        ) : (
          <div className="relative flex flex-col gap-6">
            {filteredNotes.map((note, index) => {
              const dateStr = new Date(note.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const timeStr = new Date(note.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              const subtype = note.noteSubtype || 'diary';

              // Capped sticky top offset for 2-card max folder deck stack (0px for note 0, 12px for note 1+)
              const stickyTopPx = Math.min(index, 1) * 12;

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedEntry(note)}
                  style={{
                    top: `${stickyTopPx}px`,
                    zIndex: index + 10,
                    transform: 'translateZ(0)',
                    willChange: 'transform',
                  }}
                  className="sticky bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 border-t-white/35 shadow-card hover:border-orange-400/60 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between gap-4 min-h-[210px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                        {dateStr} · {timeStr}
                      </span>

                      {/* Subtype Badge */}
                      {subtype === 'diary' && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <BookOpen className="w-2.5 h-2.5" /> Diary
                        </span>
                      )}
                      {subtype === 'brain_dump' && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lightbulb className="w-2.5 h-2.5" /> Brain Dump
                        </span>
                      )}
                      {subtype === 'collections' && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <FolderKanban className="w-2.5 h-2.5" /> Collection
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-serif font-semibold text-white group-hover:text-orange-300 transition-colors tracking-wide line-clamp-1">
                      {note.title || 'Untitled Note'}
                    </h3>

                    {subtype === 'collections' ? (
                      <div className="mt-2 text-sm text-slate-300 leading-relaxed">
                        <span className="text-xs text-orange-400 font-semibold uppercase tracking-wider block mb-1">
                          Category: {note.category || 'General'} ({note.collectionItems?.length || 0} items)
                        </span>
                        <p className="line-clamp-2 italic text-slate-400">
                          {note.content || note.collectionItems?.map((i) => i.name).join(' · ')}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-200 leading-relaxed line-clamp-3 whitespace-pre-line">
                        {note.content || 'Empty note...'}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom Row: Tags & View Details Indicator */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {note.tags.length > 0 ? (
                        note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] uppercase tracking-wider font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 italic">
                          Untagged
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-orange-400 group-hover:text-white flex items-center gap-1 transition-colors">
                      <span>Open Note</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
