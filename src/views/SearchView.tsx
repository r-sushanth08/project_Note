import React from 'react';
import { useEntries } from '../context/EntryContext';
import { NoteEntry, ListEntry, VocabEntry } from '../types/entry';
import { Search, FileText, List as ListIcon, BookOpen } from 'lucide-react';

export const SearchView: React.FC = () => {
  const { entries, searchQuery, setSearchQuery, setCurrentView, setSelectedEntry } = useEntries();

  const query = searchQuery.toLowerCase().trim();

  const filteredEntries = entries.filter((entry) => {
    if (!query) return true;

    if (entry.title.toLowerCase().includes(query)) return true;
    if (entry.tags.some((t) => t.toLowerCase().includes(query))) return true;

    if (entry.type === 'note') {
      const note = entry as NoteEntry;
      return note.content.toLowerCase().includes(query);
    }

    if (entry.type === 'list') {
      const list = entry as ListEntry;
      return list.items.some((item) => item.text.toLowerCase().includes(query));
    }

    if (entry.type === 'vocab') {
      const vocab = entry as VocabEntry;
      return (
        vocab.word.toLowerCase().includes(query) ||
        vocab.meaning.toLowerCase().includes(query) ||
        vocab.synonyms.some((s) => s.toLowerCase().includes(query)) ||
        vocab.antonyms.some((a) => a.toLowerCase().includes(query)) ||
        vocab.examples.some((e) => e.toLowerCase().includes(query))
      );
    }

    return false;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-2 pb-24 flex flex-col gap-8">
      {/* Subheader */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setCurrentView('home')}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-900/80 border border-white/20 text-slate-300 hover:text-white hover:border-orange-400 transition-all shadow-sm"
        >
          ‹
        </button>
        <h1 className="text-3xl font-serif font-medium text-white">Reflect & Search</h1>
      </div>

      {/* Search Bar Input */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes, lists, vocabulary, or tags..."
          className="w-full pl-12 pr-4 py-4 bg-slate-900/80 border border-white/20 rounded-2xl focus:outline-none focus:border-orange-400 text-white text-base shadow-card placeholder:text-slate-500"
          autoFocus
        />
      </div>

      {/* Results List */}
      <div className="flex flex-col gap-4">
        <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 px-1">
          {filteredEntries.length} {filteredEntries.length === 1 ? 'result' : 'results'} found
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-16 text-slate-400 italic bg-slate-900/60 rounded-2xl border border-white/15 backdrop-blur-md">
            No entries found matching "{searchQuery}".
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => {
                  setSelectedEntry(entry);
                  if (entry.type === 'note') setCurrentView('notes');
                  else if (entry.type === 'list') setCurrentView('lists');
                  else if (entry.type === 'vocab') setCurrentView('vocab');
                }}
                className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/15 shadow-card hover:border-orange-400/60 hover:bg-slate-900/90 transition-all cursor-pointer group flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {entry.type === 'note' && (
                      <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <FileText className="w-4 h-4" />
                      </span>
                    )}
                    {entry.type === 'list' && (
                      <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <ListIcon className="w-4 h-4" />
                      </span>
                    )}
                    {entry.type === 'vocab' && (
                      <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <BookOpen className="w-4 h-4" />
                      </span>
                    )}

                    <h3 className="text-lg font-serif font-medium text-white group-hover:text-orange-300 transition-colors">
                      {entry.title || (entry.type === 'vocab' ? (entry as VocabEntry).word : 'Untitled')}
                    </h3>
                  </div>

                  <span className="text-xs text-slate-400 capitalize">
                    {entry.type} · {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {entry.type === 'note' && (
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-2 pl-8">
                    {(entry as NoteEntry).content}
                  </p>
                )}

                {entry.type === 'vocab' && (
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-2 pl-8">
                    {(entry as VocabEntry).meaning}
                  </p>
                )}

                {entry.type === 'list' && (
                  <div className="text-sm text-slate-300 line-clamp-2 pl-8">
                    {(entry as ListEntry).items.map((i) => i.text).join(' · ')}
                  </div>
                )}

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pl-8">
                    {entry.tags.map((tag) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
