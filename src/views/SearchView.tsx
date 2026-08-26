import React from 'react';
import { useEntries } from '../context/EntryContext';
import { NoteEntry, ListEntry, VocabEntry } from '../types/entry';
import { Search, FileText, List as ListIcon, BookOpen } from 'lucide-react';

export const SearchView: React.FC = () => {
  const { entries, searchQuery, setSearchQuery, setCurrentView, setSelectedEntry } = useEntries();

  const query = searchQuery.toLowerCase().trim();

  const filteredEntries = entries.filter((entry) => {
    if (!query) return true;

    // Title & Tags match
    if (entry.title.toLowerCase().includes(query)) return true;
    if (entry.tags.some((t) => t.toLowerCase().includes(query))) return true;

    // Type specific matching
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
      <div className="flex items-center gap-3 border-b border-ink-border pb-4">
        <button
          onClick={() => setCurrentView('home')}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-ink-border text-ink-secondary hover:text-ink-primary hover:border-sage-500 transition-all shadow-sm"
        >
          ‹
        </button>
        <h1 className="text-3xl font-serif font-medium text-ink-primary">Reflect & Search</h1>
      </div>

      {/* Search Bar Input */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes, lists, vocabulary, or tags..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-ink-border rounded-2xl focus:outline-none focus:border-sage-500 text-ink-primary text-base shadow-card"
          autoFocus
        />
      </div>

      {/* Results List */}
      <div className="flex flex-col gap-4">
        <div className="text-xs uppercase tracking-wider font-semibold text-ink-muted px-1">
          {filteredEntries.length} {filteredEntries.length === 1 ? 'result' : 'results'} found
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-16 text-ink-muted italic bg-white rounded-2xl border border-ink-border">
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
                className="bg-white rounded-2xl p-6 border border-ink-border shadow-card hover:shadow-float transition-all cursor-pointer group flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {entry.type === 'note' && (
                      <span className="p-1.5 rounded-lg bg-sage-50 text-sage-700">
                        <FileText className="w-4 h-4" />
                      </span>
                    )}
                    {entry.type === 'list' && (
                      <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                        <ListIcon className="w-4 h-4" />
                      </span>
                    )}
                    {entry.type === 'vocab' && (
                      <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                        <BookOpen className="w-4 h-4" />
                      </span>
                    )}

                    <h3 className="text-lg font-serif font-medium text-ink-primary group-hover:text-sage-700 transition-colors">
                      {entry.title || (entry.type === 'vocab' ? (entry as VocabEntry).word : 'Untitled')}
                    </h3>
                  </div>

                  <span className="text-xs text-ink-muted capitalize">
                    {entry.type} · {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {entry.type === 'note' && (
                  <p className="text-sm text-ink-secondary leading-relaxed line-clamp-2 pl-8">
                    {(entry as NoteEntry).content}
                  </p>
                )}

                {entry.type === 'vocab' && (
                  <p className="text-sm text-ink-secondary leading-relaxed line-clamp-2 pl-8">
                    {(entry as VocabEntry).meaning}
                  </p>
                )}

                {entry.type === 'list' && (
                  <div className="text-sm text-ink-secondary line-clamp-2 pl-8">
                    {(entry as ListEntry).items.map((i) => i.text).join(' · ')}
                  </div>
                )}

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pl-8">
                    {entry.tags.map((tag) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
