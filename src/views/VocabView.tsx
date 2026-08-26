import React from 'react';
import { useEntries } from '../context/EntryContext';
import { VocabEntry } from '../types/entry';
import { Plus, ArrowUpRight } from 'lucide-react';

export const VocabView: React.FC = () => {
  const { entries, setCurrentView, setSelectedEntry, openNewEntry } = useEntries();

  const vocabList = entries.filter((e): e is VocabEntry => e.type === 'vocab');

  const handleSelect = (vocab: VocabEntry) => {
    setSelectedEntry(vocab);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-2 pb-24 flex flex-col gap-6">
      {/* Subheader Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('home')}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-900/80 border border-white/20 text-slate-300 hover:text-white hover:border-orange-400 transition-all shadow-sm"
          >
            ‹
          </button>
          <h1 className="text-3xl font-serif font-medium text-white">Vocabulary Deck</h1>
        </div>

        <span className="text-xs text-orange-400 font-semibold bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
          {vocabList.length} cards in folder
        </span>
      </div>

      {/* Cards Deck Stack Container (Locked/Hidden Scrollbar & 2-Card Max Stack) */}
      {vocabList.length === 0 ? (
        <div className="text-center py-16 text-slate-400 italic bg-slate-900/60 rounded-2xl border border-white/15 backdrop-blur-md">
          No vocabulary cards in your folder yet. Click the + button below to add one!
        </div>
      ) : (
        <div className="relative flex flex-col gap-6 no-scrollbar pb-32">
          {vocabList.map((item, index) => {
            // Strictly cap top sticky offset at max 2 cards (80px base + max 10px peek)
            // Ensures Card N-2 and older are 100% hidden underneath
            const stickyTopPx = 80 + Math.min(index, 1) * 10;

            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                style={{
                  top: `${stickyTopPx}px`,
                  transform: 'translateZ(0)',
                  willChange: 'transform',
                }}
                className="sticky bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 border-t-white/30 shadow-[0_-12px_35px_rgba(0,0,0,0.7)] hover:border-orange-400/60 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between gap-4 min-h-[210px]"
              >
                {/* Card Top Row: Word & Part of Speech */}
                <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                  <h3 className="text-2xl font-serif font-semibold text-white group-hover:text-orange-300 transition-colors tracking-wide">
                    {item.word || 'Untitled Word'}
                  </h3>
                  {item.partOfSpeech && (
                    <span className="text-xs italic font-serif text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                      {item.partOfSpeech}
                    </span>
                  )}
                </div>

                {/* Card Structured Content Fields */}
                <div className="flex flex-col gap-2 text-sm text-slate-200 leading-relaxed">
                  {/* Meaning */}
                  <div>
                    <span className="font-semibold text-orange-400 text-xs uppercase tracking-wider mr-2">
                      Meaning:
                    </span>
                    <span className="text-slate-200">{item.meaning || 'No definition provided.'}</span>
                  </div>

                  {/* Synonyms */}
                  {item.synonyms && item.synonyms.length > 0 && (
                    <div className="line-clamp-1">
                      <span className="font-semibold text-slate-400 text-xs uppercase tracking-wider mr-2">
                        Synonyms:
                      </span>
                      <span className="text-slate-300">{item.synonyms.join(', ')}</span>
                    </div>
                  )}

                  {/* Antonyms */}
                  {item.antonyms && item.antonyms.length > 0 && (
                    <div className="line-clamp-1">
                      <span className="font-semibold text-slate-400 text-xs uppercase tracking-wider mr-2">
                        Antonyms:
                      </span>
                      <span className="text-slate-300">{item.antonyms.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Card Bottom Row: Tags & View Details Indicator */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.length > 0 ? (
                      item.tags.map((tag) => (
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
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Add Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => openNewEntry('vocab')}
          className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-float hover:bg-orange-600 active:scale-95 transition-all"
          title="Add New Word"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
