import React from 'react';
import { Settings, Search } from 'lucide-react';
import { useEntries } from '../context/EntryContext';

interface HeaderProps {
  onBack?: () => void;
  backLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({ onBack, backLabel }) => {
  const { currentView, setCurrentView } = useEntries();

  return (
    <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
      {/* Left: Brand Logo */}
      <button
        onClick={() => setCurrentView('home')}
        className="text-3xl font-serif font-semibold tracking-tight text-ink-primary hover:opacity-80 transition-opacity"
      >
        Jrnl.
      </button>

      {/* Center: Optional Navigation / Back Link */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-ink-secondary hover:text-ink-primary transition-colors"
        >
          <span className="text-xs">‹</span>
          <span className="font-medium">{backLabel || 'Back'}</span>
        </button>
      )}

      {/* Right: Actions (Reflect / Search & Settings) */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setCurrentView('search')}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            currentView === 'search' ? 'text-sage-700 font-semibold' : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Search className="w-4 h-4 stroke-[2]" />
          <span>Reflect</span>
        </button>

        <button
          onClick={() => alert('Settings: Personal Notepad V1 (Phase 1 Interaction Prototype)')}
          className="text-ink-secondary hover:text-ink-primary transition-colors p-1"
          title="Settings"
        >
          <Settings className="w-5 h-5 stroke-[1.75]" />
        </button>
      </div>
    </header>
  );
};
