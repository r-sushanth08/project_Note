import React from 'react';
import { useEntries } from '../context/EntryContext';
import { VocabEntry } from '../types/entry';
import { Plus } from 'lucide-react';

export const VocabView: React.FC = () => {
  const { entries, setCurrentView, setSelectedEntry, openNewEntry } = useEntries();

  const vocabList = entries.filter((e): e is VocabEntry => e.type === 'vocab');

  const handleSelect = (vocab: VocabEntry) => {
    setSelectedEntry(vocab);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-2 pb-24 flex flex-col gap-8">
      {/* Subheader Title */}
      <div className="flex items-center gap-3 border-b border-ink-border pb-4">
        <button
          onClick={() => setCurrentView('home')}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-ink-border text-ink-secondary hover:text-ink-primary hover:border-sage-500 transition-all shadow-sm"
        >
          ‹
        </button>
        <h1 className="text-3xl font-serif font-medium text-ink-primary">Vocabulary</h1>
      </div>

      {/* Cards List */}
      {vocabList.length === 0 ? (
        <div className="text-center py-16 text-ink-muted italic bg-white rounded-2xl border border-ink-border">
          No vocabulary words saved yet. Click the + button below to add one!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {vocabList.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className="bg-white rounded-2xl p-6 border border-ink-border shadow-card hover:shadow-float transition-all cursor-pointer group flex flex-col gap-2"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-serif font-medium text-ink-primary group-hover:text-sage-700 transition-colors">
                  {item.word || 'Untitled Word'}
                </h3>
                {item.partOfSpeech && (
                  <span className="text-xs italic font-serif text-ink-muted">
                    {item.partOfSpeech}
                  </span>
                )}
              </div>

              <p className="text-sm text-ink-secondary leading-relaxed">
                {item.meaning || 'No definition provided.'}
              </p>

              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.tags.map((tag) => (
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

      {/* Floating Add Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={() => openNewEntry('vocab')}
          className="w-14 h-14 rounded-full bg-sage-500 text-white flex items-center justify-center shadow-float hover:bg-sage-600 active:scale-95 transition-all"
          title="Add New Word"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
