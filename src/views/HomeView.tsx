import React, { useState, useRef, useEffect } from 'react';
import { useEntries } from '../context/EntryContext';
import { RadialControl } from '../components/RadialControl';

export const HomeView: React.FC = () => {
  const { getVocabCount, vocabOfTheDayList, setCurrentView, setSelectedEntry } = useEntries();
  const vocabCount = getVocabCount();

  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');

  // Touch Swipe tracking refs
  const touchStartXRef = useRef<number | null>(null);

  const totalDailyWords = vocabOfTheDayList.length;
  const currentVocab = totalDailyWords > 0 ? vocabOfTheDayList[Math.min(activeWordIndex, totalDailyWords - 1)] : null;

  const handleNextWord = () => {
    if (totalDailyWords <= 1) return;
    setSlideDirection('right');
    setActiveWordIndex((prev) => (prev + 1) % totalDailyWords);
  };

  const handlePrevWord = () => {
    if (totalDailyWords <= 1) return;
    setSlideDirection('left');
    setActiveWordIndex((prev) => (prev - 1 + totalDailyWords) % totalDailyWords);
  };

  // Auto Rotation Timer (cycles every 6 seconds)
  useEffect(() => {
    if (totalDailyWords <= 1) return;

    const interval = setInterval(() => {
      setSlideDirection('right');
      setActiveWordIndex((prev) => (prev + 1) % totalDailyWords);
    }, 6000);

    return () => clearInterval(interval);
  }, [totalDailyWords, activeWordIndex]);

  // Touch handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || e.changedTouches.length === 0) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;

    // Minimum swipe threshold (40px)
    if (deltaX < -40) {
      handleNextWord(); // Swipe Left -> Next word
    } else if (deltaX > 40) {
      handlePrevWord(); // Swipe Right -> Previous word
    }

    touchStartXRef.current = null;
  };

  const handleDotClick = (index: number) => {
    if (index > activeWordIndex) setSlideDirection('right');
    else if (index < activeWordIndex) setSlideDirection('left');
    setActiveWordIndex(index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 flex flex-col justify-between items-center h-[calc(100dvh-70px)] select-none overflow-hidden overscroll-none touch-none pb-8 pt-1">
      {/* 1. Top Element: Lexicon Count Box */}
      <div className="flex-shrink-0">
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

      {/* 2. Middle Section: Lexicon of the Day (3 Words Auto-Rotating Carousel) */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center max-w-xl px-4 my-auto w-full">
        {/* FIXED SUBHEADING: Never moves or changes during swiping */}
        <div className="border-b-2 border-orange-500 pb-1 mb-3 inline-block flex-shrink-0">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            Lexicon of the Day
          </span>
        </div>

        {/* SWIPEABLE & AUTO-ROTATING WORD CONTENT BLOCK */}
        {currentVocab ? (
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => {
              setSelectedEntry(currentVocab);
              setCurrentView('vocab');
            }}
            className="cursor-pointer group flex flex-col items-center max-h-full overflow-hidden w-full"
          >
            <div
              key={currentVocab.id}
              className={`flex flex-col items-center w-full ${
                slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
              }`}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-white tracking-wide group-hover:text-orange-300 transition-colors line-clamp-1">
                {currentVocab.word}
              </h2>

              {(currentVocab.phonetic || currentVocab.partOfSpeech) && (
                <p className="text-xs italic font-serif text-slate-300 mt-1">
                  {currentVocab.phonetic} {currentVocab.partOfSpeech ? `· ${currentVocab.partOfSpeech}` : ''}
                </p>
              )}

              <p className="mt-2.5 text-sm sm:text-base text-slate-200 font-sans leading-relaxed max-w-md line-clamp-2">
                {currentVocab.meaning}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic mt-2">
            No words in your lexicon yet. Drag the dot below to add one!
          </p>
        )}

        {/* 3 PAGINATION INDICATOR DOTS BELOW LEXICON */}
        {totalDailyWords > 1 && (
          <div className="flex items-center justify-center gap-2.5 mt-4 flex-shrink-0">
            {vocabOfTheDayList.map((wordItem, idx) => {
              const isActive = idx === activeWordIndex;
              return (
                <button
                  key={wordItem.id || idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDotClick(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.9)] opacity-100'
                      : 'bg-white/30 hover:bg-white/60 opacity-60'
                  }`}
                  title={`Word ${idx + 1}: ${wordItem.word}`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Radial Quick-Capture Control Positioned Below Carousel */}
      <div className="flex-shrink-0 h-[210px] min-h-[210px] w-full flex items-center justify-center pb-8">
        <RadialControl isHomeCentered={true} />
      </div>
    </div>
  );
};
