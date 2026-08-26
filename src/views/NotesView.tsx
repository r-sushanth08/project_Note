import React from 'react';
import { useEntries } from '../context/EntryContext';
import { NoteEntry } from '../types/entry';
import { Plus } from 'lucide-react';

export const NotesView: React.FC = () => {
  const { entries, setCurrentView, setSelectedEntry, openNewEntry } = useEntries();

  const notesList = entries.filter((e): e is NoteEntry => e.type === 'note');

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-2 pb-24 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-ink-border pb-4">
        <button
          onClick={() => setCurrentView('home')}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-ink-border text-ink-secondary hover:text-ink-primary hover:border-sage-500 transition-all shadow-sm"
        >
          ‹
        </button>
        <h1 className="text-3xl font-serif font-medium text-ink-primary">Notes</h1>
      </div>

      {/* Notes List */}
      {notesList.length === 0 ? (
        <div className="text-center py-16 text-ink-muted italic bg-white rounded-2xl border border-ink-border">
          No notes written yet. Click the + button below to jots down a thought!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notesList.map((note) => {
            const dateStr = new Date(note.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const timeStr = new Date(note.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={note.id}
                onClick={() => setSelectedEntry(note)}
                className="bg-white rounded-2xl p-6 border border-ink-border shadow-card hover:shadow-float transition-all cursor-pointer group flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="text-[11px] font-medium text-ink-muted uppercase tracking-wider mb-1">
                    {dateStr} · {timeStr}
                  </div>

                  <h3 className="text-xl font-serif font-medium text-ink-primary group-hover:text-sage-700 transition-colors line-clamp-1">
                    {note.title || 'Untitled Note'}
                  </h3>

                  <p className="mt-2 text-sm text-ink-secondary leading-relaxed line-clamp-3 whitespace-pre-line">
                    {note.content || 'Empty note...'}
                  </p>
                </div>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-wider font-semibold text-sage-700 bg-sage-50 px-2 py-0.5 rounded-full"
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
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={() => openNewEntry('note')}
          className="w-14 h-14 rounded-full bg-sage-500 text-white flex items-center justify-center shadow-float hover:bg-sage-600 active:scale-95 transition-all"
          title="New Note"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
