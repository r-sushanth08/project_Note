import React, { useState, useRef, useEffect } from 'react';
import { FileText, List, BookOpen, Calendar, Pencil, ChevronUp, ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react';
import { useEntries } from '../context/EntryContext';

interface RadialControlProps {
  isHomeCentered?: boolean;
}

type Direction = 'notes' | 'lists' | 'vocab' | 'calendar';

export const RadialControl: React.FC<RadialControlProps> = ({ isHomeCentered = false }) => {
  const { setCurrentView } = useEntries();
  const [isHolding, setIsHolding] = useState(false);
  const [activeDirection, setActiveDirection] = useState<Direction>('notes');

  const containerRef = useRef<HTMLDivElement>(null);
  const isPointerDownRef = useRef<boolean>(false);

  // Calculate direction sector based on pointer coordinates relative to center of control
  const calculateDirectionFromCoords = (clientX: number, clientY: number): Direction => {
    if (!containerRef.current) return 'notes';
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    const angleRad = Math.atan2(deltaY, deltaX);
    const angleDeg = (angleRad * 180) / Math.PI;

    // 4 Sectors:
    // Top (-135 to -45 deg) -> Notes
    // Right (-45 to 45 deg) -> Lists
    // Bottom (45 to 135 deg) -> Vocab
    // Left (135 to 180 or -180 to -135 deg) -> Calendar
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

  // Hold Down Start Handler
  const handleHoldStart = (pointerId?: number) => {
    isPointerDownRef.current = true;

    if (!isHomeCentered) {
      setIsHolding(true);
      // Default to Notes first when user starts holding down
      setActiveDirection('notes');
    }

    if (containerRef.current && pointerId !== undefined && containerRef.current.setPointerCapture) {
      try {
        containerRef.current.setPointerCapture(pointerId);
      } catch (err) {
        // Fallback for non-pointer touch events
      }
    }
  };

  // Move Handler — Updates red arrow selection seamlessly with slight movement
  const handleHoldMove = (clientX: number, clientY: number) => {
    if (!isPointerDownRef.current && !isHomeCentered) return;

    const dir = calculateDirectionFromCoords(clientX, clientY);
    setActiveDirection(dir);
  };

  // Release Handler — Instantly navigates to active direction where red arrow was pointing
  const handleHoldEnd = () => {
    if (!isPointerDownRef.current && !isHomeCentered) return;
    isPointerDownRef.current = false;

    if (!isHomeCentered) {
      setIsHolding(false);
      // Navigate immediately to where the red arrow was last pointing
      if (activeDirection === 'notes') setCurrentView('notes');
      else if (activeDirection === 'lists') setCurrentView('lists');
      else if (activeDirection === 'vocab') setCurrentView('vocab');
      else if (activeDirection === 'calendar') setCurrentView('calendar');
    }
  };

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isHomeCentered) setIsHolding(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHomeCentered]);

  const isMenuVisible = isHolding || isHomeCentered;

  return (
    <>
      {/* Background Overlay when holding on non-home screens */}
      {isHolding && !isHomeCentered && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-[3px] z-40 transition-opacity duration-200" />
      )}

      {/* Main Control Container */}
      <div
        ref={containerRef}
        onPointerDown={(e) => handleHoldStart(e.pointerId)}
        onPointerMove={(e) => handleHoldMove(e.clientX, e.clientY)}
        onPointerUp={handleHoldEnd}
        onPointerCancel={handleHoldEnd}
        onTouchStart={() => {
          handleHoldStart();
        }}
        onTouchMove={(e) => {
          if (e.touches.length > 0) {
            handleHoldMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchEnd={handleHoldEnd}
        onTouchCancel={handleHoldEnd}
        className={`z-50 select-none touch-none ${
          isHomeCentered
            ? 'relative flex justify-center items-center'
            : 'fixed bottom-28 left-1/2 -translate-x-1/2 flex justify-center items-center'
        }`}
      >
        {/* Radial Nodes Options & Red Pointer Indicators */}
        <div
          className={`absolute inset-0 transition-all duration-250 ${
            isMenuVisible
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-90 pointer-events-none invisible'
          }`}
        >
          {/* TOP: Notes (^ Up) */}
          <div
            className={`absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-150 ${
              activeDirection === 'notes' ? 'scale-110' : 'opacity-70'
            }`}
          >
            {/* Red Chevron Arrow Pointer (^ Up) */}
            {!isHomeCentered && activeDirection === 'notes' && (
              <div className="absolute -top-6 text-red-500 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                <ChevronUp className="w-6 h-6 stroke-[3]" />
              </div>
            )}

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'notes'
                  ? 'bg-red-500/25 text-red-300 border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.6)]'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md'
              }`}
            >
              <FileText className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                activeDirection === 'notes' ? 'text-red-400' : 'text-slate-300'
              }`}
            >
              Notes
            </span>
          </div>

          {/* RIGHT: Lists (> Right) */}
          <div
            className={`absolute top-1/2 -right-20 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-150 ${
              activeDirection === 'lists' ? 'scale-110' : 'opacity-70'
            }`}
          >
            {/* Red Chevron Arrow Pointer (> Right) */}
            {!isHomeCentered && activeDirection === 'lists' && (
              <div className="absolute -right-6 top-3 text-red-500 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </div>
            )}

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'lists'
                  ? 'bg-red-500/25 text-red-300 border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.6)]'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md'
              }`}
            >
              <List className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                activeDirection === 'lists' ? 'text-red-400' : 'text-slate-300'
              }`}
            >
              Lists
            </span>
          </div>

          {/* BOTTOM: Vocab (v Down) */}
          <div
            className={`absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-150 ${
              activeDirection === 'vocab' ? 'scale-110' : 'opacity-70'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'vocab'
                  ? 'bg-red-500/25 text-red-300 border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.6)]'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md'
              }`}
            >
              <BookOpen className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                activeDirection === 'vocab' ? 'text-red-400' : 'text-slate-300'
              }`}
            >
              Vocab
            </span>

            {/* Red Chevron Arrow Pointer (v Down) */}
            {!isHomeCentered && activeDirection === 'vocab' && (
              <div className="absolute -bottom-6 text-red-500 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                <ChevronDown className="w-6 h-6 stroke-[3]" />
              </div>
            )}
          </div>

          {/* LEFT: Calendar (< Left) */}
          <div
            className={`absolute top-1/2 -left-20 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-150 ${
              activeDirection === 'calendar' ? 'scale-110' : 'opacity-70'
            }`}
          >
            {/* Red Chevron Arrow Pointer (< Left) */}
            {!isHomeCentered && activeDirection === 'calendar' && (
              <div className="absolute -left-6 top-3 text-red-500 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                <ChevronLeft className="w-6 h-6 stroke-[3]" />
              </div>
            )}

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'calendar'
                  ? 'bg-red-500/25 text-red-300 border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.6)]'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md'
              }`}
            >
              <Calendar className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                activeDirection === 'calendar' ? 'text-red-400' : 'text-slate-300'
              }`}
            >
              Calendar
            </span>
          </div>
        </div>

        {/* Center Pencil Dot Button */}
        <div
          className={`relative w-16 h-16 rounded-full bg-sage-500 text-white flex items-center justify-center shadow-float active:scale-95 transition-all duration-200 group touch-none cursor-pointer ${
            isHolding ? 'ring-4 ring-red-500/50 scale-105 bg-red-500' : ''
          }`}
          title="Press & Hold to Aim Navigation with Red Arrow Indicator"
        >
          <Pencil className="w-6 h-6 stroke-[2] transition-transform group-hover:rotate-12" />
        </div>
      </div>
    </>
  );
};
