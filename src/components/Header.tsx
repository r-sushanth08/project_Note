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
    <header className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between z-30 relative">
      {/* Left: Brand Logo */}
      <button
        onClick={() => setCurrentView('home')}
        className="text-3xl font-serif font-semibold tracking-tight text-white hover:text-orange-300 transition-colors"
      >
        Jrnl.
      </button>

      {/* Center: Optional Navigation / Back Link */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <span className="text-xs">‹</span>
          <span className="font-medium">{backLabel || 'Back'}</span>
        </button>
      )}

      {/* Right: Actions (Reflect / Search & Settings) */}
      <div className="flex items-center gap-5">
        <button
          onClick={() => setCurrentView('focus')}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            currentView === 'focus' ? 'text-orange-400 font-semibold' : 'text-slate-300 hover:text-white'
          }`}
          title="Rhythmic Focus Timer"
        >
          <Clock className="w-4 h-4 stroke-[2]" />
          <span>Focus</span>
        </button>

        <button
          onClick={() => alert('Settings: Personal Notepad V1 (Dark Lantern Edition)')}
          className="text-slate-300 hover:text-white transition-colors p-1"
          title="Settings"
        >
          <Settings className="w-5 h-5 stroke-[1.75]" />
        </button>
      </div>
    </header>
  );
};
