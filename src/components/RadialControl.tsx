import React, { useState, useRef, useEffect } from 'react';
import { FileText, List, BookOpen, Calendar, Pencil } from 'lucide-react';
import { useEntries } from '../context/EntryContext';

interface RadialControlProps {
  isHomeCentered?: boolean;
}

type Direction = 'notes' | 'lists' | 'vocab' | 'calendar' | null;

export const RadialControl: React.FC<RadialControlProps> = ({ isHomeCentered = false }) => {
  const { openNewEntry, setCurrentView } = useEntries();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDirection, setActiveDirection] = useState<Direction>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate direction based on pointer position relative to center button
  const handlePointerMove = (e: PointerEvent | React.PointerEvent) => {
    if (!isOpen && !containerRef.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Dead zone check (within 35px is dead zone)
    if (distance < 35) {
      setActiveDirection(null);
      return;
    }

    // Determine angle (-180 to 180 deg)
    const angleRad = Math.atan2(deltaY, deltaX);
    const angleDeg = (angleRad * 180) / Math.PI;

    // 4 Direction sectors:
    // Top: -135 to -45 deg
    // Right: -45 to 45 deg
    // Bottom: 45 to 135 deg
    // Left: 135 to 180 deg OR -180 to -135 deg
    if (angleDeg >= -135 && angleDeg < -45) {
      setActiveDirection('notes');
    } else if (angleDeg >= -45 && angleDeg < 45) {
      setActiveDirection('lists');
    } else if (angleDeg >= 45 && angleDeg < 135) {
      setActiveDirection('vocab');
    } else {
      setActiveDirection('calendar');
    }
  };

  const handlePointerUp = () => {
    if (activeDirection) {
      executeDirectionAction(activeDirection);
    }
    setIsOpen(false);
    setActiveDirection(null);
  };

  const executeDirectionAction = (dir: Direction) => {
    if (dir === 'notes') {
      openNewEntry('note');
    } else if (dir === 'lists') {
      openNewEntry('list');
    } else if (dir === 'vocab') {
      openNewEntry('vocab');
    } else if (dir === 'calendar') {
      setCurrentView('calendar');
    }
  };

  // Close overlay on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setActiveDirection(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Background Overlay when dragging or active */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink-primary/10 backdrop-blur-[2px] z-40 transition-opacity duration-200"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Container */}
      <div
        ref={containerRef}
        className={`z-50 select-none ${
          isHomeCentered
            ? 'relative my-12 flex justify-center items-center'
            : 'fixed bottom-8 left-1/2 -translate-x-1/2 flex justify-center items-center'
        }`}
      >
        {/* Radial Directions Options */}
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
            isOpen || isHomeCentered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          {/* TOP: Notes */}
          <button
            onClick={() => executeDirectionAction('notes')}
            className={`pointer-events-auto absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 group transition-transform duration-150 ${
              activeDirection === 'notes' ? 'scale-110' : ''
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'notes'
                  ? 'bg-sage-500 text-white border-sage-500 shadow-lg'
                  : 'bg-white text-ink-primary border-ink-border shadow-card group-hover:border-sage-500'
              }`}
            >
              <FileText className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-medium tracking-wide transition-colors ${
                activeDirection === 'notes' ? 'text-sage-700 font-semibold' : 'text-ink-secondary'
              }`}
            >
              Notes
            </span>
          </button>

          {/* RIGHT: Lists */}
          <button
            onClick={() => executeDirectionAction('lists')}
            className={`pointer-events-auto absolute top-1/2 -right-24 -translate-y-1/2 flex flex-col items-center gap-1 group transition-transform duration-150 ${
              activeDirection === 'lists' ? 'scale-110' : ''
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'lists'
                  ? 'bg-sage-500 text-white border-sage-500 shadow-lg'
                  : 'bg-white text-ink-primary border-ink-border shadow-card group-hover:border-sage-500'
              }`}
            >
              <List className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-medium tracking-wide transition-colors ${
                activeDirection === 'lists' ? 'text-sage-700 font-semibold' : 'text-ink-secondary'
              }`}
            >
              Lists
            </span>
          </button>

          {/* BOTTOM: Vocab */}
          <button
            onClick={() => executeDirectionAction('vocab')}
            className={`pointer-events-auto absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 group transition-transform duration-150 ${
              activeDirection === 'vocab' ? 'scale-110' : ''
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'vocab'
                  ? 'bg-sage-500 text-white border-sage-500 shadow-lg'
                  : 'bg-white text-ink-primary border-ink-border shadow-card group-hover:border-sage-500'
              }`}
            >
              <BookOpen className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-medium tracking-wide transition-colors ${
                activeDirection === 'vocab' ? 'text-sage-700 font-semibold' : 'text-ink-secondary'
              }`}
            >
              Vocab
            </span>
          </button>

          {/* LEFT: Calendar */}
          <button
            onClick={() => executeDirectionAction('calendar')}
            className={`pointer-events-auto absolute top-1/2 -left-24 -translate-y-1/2 flex flex-col items-center gap-1 group transition-transform duration-150 ${
              activeDirection === 'calendar' ? 'scale-110' : ''
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'calendar'
                  ? 'bg-sage-500 text-white border-sage-500 shadow-lg'
                  : 'bg-white text-ink-primary border-ink-border shadow-card group-hover:border-sage-500'
              }`}
            >
              <Calendar className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-medium tracking-wide transition-colors ${
                activeDirection === 'calendar' ? 'text-sage-700 font-semibold' : 'text-ink-secondary'
              }`}
            >
              Calendar
            </span>
          </button>
        </div>

        {/* Central Center Button */}
        <button
          onPointerDown={(e) => {
            setIsOpen(true);
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`relative w-16 h-16 rounded-full bg-sage-500 text-white flex items-center justify-center shadow-float hover:bg-sage-600 active:scale-95 transition-all duration-200 group ${
            isOpen ? 'ring-4 ring-sage-100 scale-105' : ''
          }`}
          title="Quick Capture (Drag to Notes, Lists, Vocab, or Calendar)"
        >
          <Pencil className="w-6 h-6 stroke-[2] transition-transform group-hover:rotate-12" />
        </button>
      </div>
    </>
  );
};
