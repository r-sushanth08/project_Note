import React, { useState } from 'react';
import { useEntries } from '../context/EntryContext';
import { NoteEntry, NoteSubtype } from '../types/entry';
import { Plus, BookOpen, Lightbulb, FolderKanban, Tag as TagIcon } from 'lucide-react';

export const NotesView: React.FC = () => {
  const { entries, allTags, setCurrentView, setSelectedEntry, openNewEntry } = useEntries();
  const [activeSubtypeFilter, setActiveSubtypeFilter] = useState<'all' | NoteSubtype>('all');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const notesList = entries.filter((e): e is NoteEntry => e.type === 'note');

  // Filter notes by subtype & active tag
  const filteredNotes = notesList.filter((note) => {
    if (activeSubtypeFilter !== 'all' && (note.noteSubtype || 'diary') !== activeSubtypeFilter) {
      return false;
    }
    if (activeTagFilter && !note.tags.includes(activeTagFilter)) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-2 pb-24 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
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
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveSubtypeFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeSubtypeFilter === 'all'
              ? 'bg-orange-500 text-white font-semibold shadow-sm'
              : 'bg-slate-900/60 text-slate-300 border border-white/15 hover:border-white/30'
          }`}
        >
          All Notes ({notesList.length})
        </button>

        <button
          onClick={() => setActiveSubtypeFilter('diary')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
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
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
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
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeSubtypeFilter === 'collections'
              ? 'bg-orange-500 text-white font-semibold shadow-sm'
              : 'bg-slate-900/60 text-slate-300 border border-white/15 hover:border-white/30'
          }`}
        >
          <FolderKanban className="w-3 h-3" />
          <span>Collections</span>
        </button>
      </div>

      {/* Tag Filter Pill Bar */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1">
            <TagIcon className="w-3 h-3 text-orange-400" />
          </span>
          {activeTagFilter && (
            <button
              onClick={() => setActiveTagFilter(null)}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30"
            >
              Clear Tag Filter ✕
            </button>
          )}
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTagFilter(activeTagFilter === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeTagFilter === tag
                  ? 'bg-orange-500 text-white font-semibold border border-orange-400'
                  : 'bg-slate-900/40 text-slate-300 border border-white/10 hover:border-white/20'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 text-slate-400 italic bg-slate-900/60 rounded-2xl border border-white/15 backdrop-blur-md">
          No notes match your active filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => {
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

            return (
              <div
                key={note.id}
                onClick={() => setSelectedEntry(note)}
                className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/15 shadow-card hover:border-orange-400/60 hover:bg-slate-900/90 transition-all cursor-pointer group flex flex-col justify-between gap-4"
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

                  <h3 className="text-xl font-serif font-medium text-white group-hover:text-orange-300 transition-colors line-clamp-1">
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
                    <p className="mt-2 text-sm text-slate-300 leading-relaxed line-clamp-3 whitespace-pre-line">
                      {note.content || 'Empty note...'}
                    </p>
                  )}
                </div>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-wider font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Add Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => openNewEntry('note', 'diary')}
          className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-float hover:bg-orange-600 active:scale-95 transition-all"
          title="New Note"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
