import React from 'react';
import { useEntries } from '../context/EntryContext';
import { RadialControl } from '../components/RadialControl';

export const HomeView: React.FC = () => {
  const { getVocabCount, vocabOfTheDay, setCurrentView, setSelectedEntry } = useEntries();
  const vocabCount = getVocabCount();

  return (
    <div className="w-full max-w-4xl mx-auto px-6 flex flex-col justify-between items-center h-full select-none overflow-hidden pb-4">
      {/* Zone 1: Lexicon Count Box (Top, flex-shrink-0) */}
      <div className="flex-shrink-0 pt-1">
        <div
          onClick={() => setCurrentView('vocab')}
          className="bg-slate-900/60 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-2.5 shadow-card hover:border-orange-400/60 hover:bg-slate-900/80 transition-all cursor-pointer flex items-center gap-3 group"
          title="View All Vocabulary"
        >
          <span className="text-3xl font-serif text-white font-normal group-hover:text-orange-400 transition-colors">
            {vocabCount}
          </span>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
            words logged
          </span>
        </div>
      </div>

      {/* Zone 2: Lexicon of the Day (Middle Text Section, Flex-1 with Controlled Height) */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center max-w-xl px-4 my-auto">
        {/* Orange Underlined Subheading */}
        <div className="border-b-2 border-orange-500 pb-1 mb-2 inline-block flex-shrink-0">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            Lexicon of the Day
          </span>
        </div>

        {vocabOfTheDay ? (
          <div
            onClick={() => {
              setSelectedEntry(vocabOfTheDay);
              setCurrentView('vocab');
            }}
            className="cursor-pointer group flex flex-col items-center max-h-full overflow-hidden"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-white tracking-wide group-hover:text-orange-300 transition-colors line-clamp-1">
              {vocabOfTheDay.word}
            </h2>

            {(vocabOfTheDay.phonetic || vocabOfTheDay.partOfSpeech) && (
              <p className="text-xs italic font-serif text-slate-300 mt-1">
                {vocabOfTheDay.phonetic} {vocabOfTheDay.partOfSpeech ? `· ${vocabOfTheDay.partOfSpeech}` : ''}
              </p>
            )}

            <p className="mt-2 text-sm sm:text-base text-slate-200 font-sans leading-relaxed max-w-md line-clamp-2">
              {vocabOfTheDay.meaning}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic mt-2">
            No words in your lexicon yet. Drag the dot below to add one!
          </p>
        )}
      </div>

      {/* Zone 3: Radial Quick-Capture Control (Dedicated Clearance Zone, flex-shrink-0) */}
      <div className="flex-shrink-0 h-[160px] min-h-[160px] w-full flex items-center justify-center">
        <RadialControl isHomeCentered={true} />
      </div>
    </div>
  );
};
