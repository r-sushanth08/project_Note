import React from 'react';
import { Settings, Clock } from 'lucide-react';
import { useEntries } from '../context/EntryContext';

interface HeaderProps {
  onBack?: () => void;
  backLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({ onBack, backLabel }) => {
  const { currentView, setCurrentView } = useEntries();

  return (
    <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-2 sm:py-4 flex items-center justify-between z-40 relative flex-shrink-0 pointer-events-auto">
      {/* Left: Brand Logo */}
      <button
        onClick={() => setCurrentView('home')}
        className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-white hover:text-orange-300 active:scale-95 transition-all cursor-pointer py-1 px-1 touch-manipulation min-h-[44px] flex items-center"
      >
        Jrnl.
      </button>

      {/* Center: Optional Navigation / Back Link */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[44px] px-2 py-1 touch-manipulation"
        >
          <span className="text-xs">‹</span>
          <span className="font-medium">{backLabel || 'Back'}</span>
        </button>
      )}

      {/* Right: Actions (Focus Clock & Settings) */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => setCurrentView('focus')}
          className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-all cursor-pointer min-h-[44px] px-2.5 py-1.5 rounded-xl active:scale-95 touch-manipulation ${
            currentView === 'focus'
              ? 'text-orange-400 font-semibold bg-orange-500/15 border border-orange-500/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }`}
          title="Cognitive Audio Focus Timer"
        >
          <Clock className="w-4 h-4 stroke-[2]" />
          <span>Focus</span>
        </button>

        <button
          onClick={() => alert('Settings: Personal Notepad (Lantern & Cognitive Audio Edition)')}
          className="text-slate-300 hover:text-white transition-all p-2 rounded-xl hover:bg-slate-800/50 active:scale-95 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
          title="Settings"
        >
          <Settings className="w-5 h-5 stroke-[1.75]" />
        </button>
      </div>
    </header>
  );
};
