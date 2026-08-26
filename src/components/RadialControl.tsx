import React, { useState, useRef, useEffect } from 'react';
import { FileText, List, BookOpen, Calendar, Pencil } from 'lucide-react';
import { useEntries } from '../context/EntryContext';
import { ViewMode } from '../types/entry';

interface RadialControlProps {
  isHomeCentered?: boolean;
}

type Direction = 'notes' | 'lists' | 'vocab' | 'calendar' | null;

export const RadialControl: React.FC<RadialControlProps> = ({ isHomeCentered = false }) => {
  const { openNewEntry, setCurrentView } = useEntries();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDirection, setActiveDirection] = useState<Direction>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Core coordinate angle & direction calculation helper
  const calculateDirectionFromCoords = (clientX: number, clientY: number) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Dead zone check (< 35px)
    if (distance < 35) {
      return null;
    }

    const angleRad = Math.atan2(deltaY, deltaX);
    const angleDeg = (angleRad * 180) / Math.PI;

    // 4 Direction sectors:
    // Top: -135 to -45 deg -> Notes
    // Right: -45 to 45 deg -> Lists
    // Bottom: 45 to 135 deg -> Vocab
    // Left: 135 to 180 or -180 to -135 deg -> Calendar
    if (angleDeg >= -135 && angleDeg < -45) {
      return 'notes';
    } else if (angleDeg >= -45 && angleDeg < 45) {
      return 'lists';
    } else if (angleDeg >= 45 && angleDeg < 135) {
      return 'vocab';
    } else {
      return 'calendar';
    }
  };

  // Mouse / Pointer Move Handler
  const handlePointerMove = (e: React.PointerEvent | PointerEvent) => {
    if (!isOpen) return;
    const dir = calculateDirectionFromCoords(e.clientX, e.clientY);
    setActiveDirection(dir);
  };

  // Touch Move Handler (Mobile Fix for Touchscreens)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isOpen) return;
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const dir = calculateDirectionFromCoords(touch.clientX, touch.clientY);
      setActiveDirection(dir);
    }
  };

  // Drag & Drop Release Handler -> Triggers New Entry Creation
  const handleDragRelease = () => {
    if (activeDirection) {
      executeDragAction(activeDirection);
    }
    setIsOpen(false);
    setActiveDirection(null);
  };

  const executeDragAction = (dir: Direction) => {
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

  // Direct Button Click Handler -> Triggers Section Browsing
  const handleDirectClick = (dir: ViewMode) => {
    setIsOpen(false);
    setActiveDirection(null);
    setCurrentView(dir);
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
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40 transition-opacity duration-200"
          onPointerMove={handlePointerMove}
          onPointerUp={handleDragRelease}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragRelease}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Container */}
      <div
        ref={containerRef}
        className={`z-50 select-none touch-none ${
          isHomeCentered
            ? 'relative flex justify-center items-center'
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
            onClick={() => handleDirectClick('notes')}
            className={`pointer-events-auto absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 group transition-transform duration-150 ${
              activeDirection === 'notes' ? 'scale-110' : ''
            }`}
            title="Click to browse Notes / Drag to create new Note"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'notes'
                  ? 'bg-orange-500 text-white border-orange-400 shadow-lg'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md group-hover:border-orange-400'
              }`}
            >
              <FileText className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-medium tracking-wide transition-colors ${
                activeDirection === 'notes' ? 'text-orange-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Notes
            </span>
          </button>

          {/* RIGHT: Lists */}
          <button
            onClick={() => handleDirectClick('lists')}
            className={`pointer-events-auto absolute top-1/2 -right-20 -translate-y-1/2 flex flex-col items-center gap-1 group transition-transform duration-150 ${
              activeDirection === 'lists' ? 'scale-110' : ''
            }`}
            title="Click to browse Lists / Drag to create new List"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'lists'
                  ? 'bg-orange-500 text-white border-orange-400 shadow-lg'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md group-hover:border-orange-400'
              }`}
            >
              <List className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-medium tracking-wide transition-colors ${
                activeDirection === 'lists' ? 'text-orange-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Lists
            </span>
          </button>

          {/* BOTTOM: Vocab */}
          <button
            onClick={() => handleDirectClick('vocab')}
            className={`pointer-events-auto absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 group transition-transform duration-150 ${
              activeDirection === 'vocab' ? 'scale-110' : ''
            }`}
            title="Click to browse Vocab / Drag to add new Vocab"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'vocab'
                  ? 'bg-orange-500 text-white border-orange-400 shadow-lg'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md group-hover:border-orange-400'
              }`}
            >
              <BookOpen className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-medium tracking-wide transition-colors ${
                activeDirection === 'vocab' ? 'text-orange-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Vocab
            </span>
          </button>

          {/* LEFT: Calendar */}
          <button
            onClick={() => handleDirectClick('calendar')}
            className={`pointer-events-auto absolute top-1/2 -left-20 -translate-y-1/2 flex flex-col items-center gap-1 group transition-transform duration-150 ${
              activeDirection === 'calendar' ? 'scale-110' : ''
            }`}
            title="Click or Drag to view Calendar"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'calendar'
                  ? 'bg-orange-500 text-white border-orange-400 shadow-lg'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md group-hover:border-orange-400'
              }`}
            >
              <Calendar className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-medium tracking-wide transition-colors ${
                activeDirection === 'calendar' ? 'text-orange-400 font-semibold' : 'text-slate-300'
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
          onPointerUp={handleDragRelease}
          onTouchStart={() => setIsOpen(true)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragRelease}
          className={`relative w-16 h-16 rounded-full bg-sage-500 text-white flex items-center justify-center shadow-float hover:bg-sage-600 active:scale-95 transition-all duration-200 group touch-none ${
            isOpen ? 'ring-4 ring-orange-400/40 scale-105 bg-orange-500' : ''
          }`}
          title="Quick Capture (Drag to Notes, Lists, Vocab, or Calendar)"
        >
          <Pencil className="w-6 h-6 stroke-[2] transition-transform group-hover:rotate-12" />
        </button>
      </div>
    </>
  );
};
