import React from 'react';
import { useEntries } from '../context/EntryContext';
import { RadialControl } from '../components/RadialControl';

export const HomeView: React.FC = () => {
  const { getVocabCount, vocabOfTheDay, setCurrentView, setSelectedEntry } = useEntries();
  const vocabCount = getVocabCount();

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pt-4 pb-16 flex flex-col gap-12">
      {/* Top Hero Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Saved Lexicon */}
        <div
          onClick={() => setCurrentView('vocab')}
          className="bg-white rounded-2xl p-8 border border-ink-border shadow-card hover:shadow-float transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-ink-muted">
              Saved Lexicon
            </span>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-5xl font-serif text-ink-primary font-normal group-hover:text-sage-700 transition-colors">
                {vocabCount}
              </span>
              <span className="text-sm font-medium text-ink-secondary">words logged</span>
            </div>
          </div>

          <p className="mt-8 text-sm text-ink-secondary leading-relaxed">
            Your mindful vocabulary is growing steadily. Revisit your saved words often.
          </p>
        </div>

        {/* Card 2: Lexicon of the Day */}
        <div
          onClick={() => {
            if (vocabOfTheDay) {
              setSelectedEntry(vocabOfTheDay);
              setCurrentView('vocab');
            }
          }}
          className="bg-white rounded-2xl p-8 border border-ink-border shadow-card hover:shadow-float transition-all cursor-pointer relative flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-ink-muted">
              Lexicon of the Day
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-sage-700 bg-sage-50 px-2.5 py-1 rounded-full border border-sage-200">
              Daily Reflection
            </span>
          </div>

          {vocabOfTheDay ? (
            <div className="mt-6">
              <h3 className="text-2xl font-serif font-medium text-ink-primary group-hover:text-sage-700 transition-colors">
                {vocabOfTheDay.word}
              </h3>
              {(vocabOfTheDay.phonetic || vocabOfTheDay.partOfSpeech) && (
                <p className="text-xs italic font-serif text-ink-muted mt-1">
                  {vocabOfTheDay.phonetic} {vocabOfTheDay.partOfSpeech ? `· ${vocabOfTheDay.partOfSpeech}` : ''}
                </p>
              )}
              <p className="mt-4 text-sm text-ink-secondary leading-relaxed line-clamp-3">
                {vocabOfTheDay.meaning}
              </p>
            </div>
          ) : (
            <div className="mt-6 text-sm text-ink-muted italic">
              No words in your lexicon yet. Use the radial control below to add your first word!
            </div>
          )}
        </div>
      </div>

      {/* Central Radial Quick-Capture Control */}
      <div className="mt-8 flex flex-col items-center justify-center">
        <RadialControl isHomeCentered={true} />
      </div>
    </div>
  );
};
