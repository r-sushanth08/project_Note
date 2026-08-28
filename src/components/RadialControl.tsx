import React, { useState, useRef, useEffect } from 'react';
import { FileText, List, BookOpen, Calendar, Pencil, Plus, ChevronUp, ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react';
import { useEntries } from '../context/EntryContext';
import { ViewMode } from '../types/entry';

interface RadialControlProps {
  isHomeCentered?: boolean;
}

type NavDirection = 'notes' | 'lists' | 'vocab' | 'calendar' | null;
type CreateDirection = 'note' | 'list' | 'vocab' | null;

export const RadialControl: React.FC<RadialControlProps> = ({ isHomeCentered = false }) => {
  const { openNewEntry, setCurrentView } = useEntries();
  const [isHoldingNav, setIsHoldingNav] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [activeNavDirection, setActiveNavDirection] = useState<NavDirection>(null);
  const [activeCreateDirection, setActiveCreateDirection] = useState<CreateDirection>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const hasDraggedRef = useRef<boolean>(false);
  const isPointerDownRef = useRef<boolean>(false);

  // Calculate Navigation direction sector (4 Sectors: Notes, Lists, Vocab, Calendar)
  const calculateNavDirectionFromCoords = (clientX: number, clientY: number): NavDirection => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < 12) return null;

    const angleRad = Math.atan2(deltaY, deltaX);
    const angleDeg = (angleRad * 180) / Math.PI;

    if (angleDeg >= -135 && angleDeg < -45) return 'notes';
    else if (angleDeg >= -45 && angleDeg < 45) return 'lists';
    else if (angleDeg >= 45 && angleDeg < 135) return 'vocab';
    else return 'calendar';
  };

  // Calculate Creation direction sector (3 Sectors: Top = Note, Right = List, Left = Vocab)
  const calculateCreateDirectionFromCoords = (clientX: number, clientY: number): CreateDirection => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < 12) return null;

    const angleRad = Math.atan2(deltaY, deltaX);
    const angleDeg = (angleRad * 180) / Math.PI;

    if (angleDeg >= -135 && angleDeg < -45) return 'note';
    else if (angleDeg >= -45 && angleDeg < 45) return 'list';
    else if (angleDeg >= 135 || angleDeg < -135) return 'vocab';
    else return null;
  };

  // --- HOME SCREEN DRAG & CLICK LOGIC ---
  const handleHomeStart = (clientX: number, clientY: number) => {
    touchStartPos.current = { x: clientX, y: clientY };
    hasDraggedRef.current = false;
  };

  const handleHomeMove = (clientX: number, clientY: number) => {
    if (!touchStartPos.current) return;
    const deltaX = clientX - touchStartPos.current.x;
    const deltaY = clientY - touchStartPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 12) {
      hasDraggedRef.current = true;
      const dir = calculateNavDirectionFromCoords(clientX, clientY);
      setActiveNavDirection(dir);
    }
  };

  const handleHomeEnd = () => {
    if (hasDraggedRef.current && activeNavDirection) {
      if (activeNavDirection === 'notes') openNewEntry('note');
      else if (activeNavDirection === 'lists') openNewEntry('list');
      else if (activeNavDirection === 'vocab') openNewEntry('vocab');
      else if (activeNavDirection === 'calendar') setCurrentView('calendar');
    }

    touchStartPos.current = null;
    hasDraggedRef.current = false;
    setActiveNavDirection(null);
  };

  const handleHomeNodeClick = (e: React.MouseEvent, view: ViewMode) => {
    e.stopPropagation();
    setCurrentView(view);
  };

  // --- NON-HOME DUAL-MODE GESTURE LOGIC ---
  const handleNonHomeStart = (clientX: number, clientY: number) => {
    isPointerDownRef.current = true;
    touchStartPos.current = { x: clientX, y: clientY };
    hasDraggedRef.current = false;

    if (!isQuickCreateOpen) {
      // Pencil State: Instant Navigation Nodes Pop on Hold Down
      setIsHoldingNav(true);
      setActiveNavDirection(null);
    } else {
      // Plus State: Prepare for Drag Creation
      setActiveCreateDirection(null);
    }
  };

  const handleNonHomeMove = (clientX: number, clientY: number) => {
    if (!isPointerDownRef.current || !touchStartPos.current) return;
    const deltaX = clientX - touchStartPos.current.x;
    const deltaY = clientY - touchStartPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 12) {
      hasDraggedRef.current = true;

      if (!isQuickCreateOpen) {
        // Pencil State Drag -> Navigation Mode
        setIsHoldingNav(true);
        const dir = calculateNavDirectionFromCoords(clientX, clientY);
        setActiveNavDirection(dir);
      } else {
        // Plus State Drag -> Creation Mode with Arrow Indicators!
        const dir = calculateCreateDirectionFromCoords(clientX, clientY);
        setActiveCreateDirection(dir);
      }
    }
  };

  const handleNonHomeEnd = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    if (!isQuickCreateOpen) {
      // --- PENCIL STATE DRAG RELEASE ---
      if (hasDraggedRef.current && isHoldingNav) {
        setIsHoldingNav(false);
        if (activeNavDirection === 'notes') setCurrentView('notes');
        else if (activeNavDirection === 'lists') setCurrentView('lists');
        else if (activeNavDirection === 'vocab') setCurrentView('vocab');
        else if (activeNavDirection === 'calendar') setCurrentView('calendar');
        setActiveNavDirection(null);
      } else {
        setIsHoldingNav(false);
        setActiveNavDirection(null);
      }
    } else {
      // --- PLUS STATE DRAG RELEASE ---
      if (hasDraggedRef.current && activeCreateDirection) {
        const typeToCreate = activeCreateDirection;
        setIsQuickCreateOpen(false);
        setActiveCreateDirection(null);
        openNewEntry(typeToCreate);
      } else {
        setActiveCreateDirection(null);
      }
    }

    touchStartPos.current = null;
    // Reset hasDraggedRef after short timeout to let onClick handler check drag state
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 50);
  };

  // Center Button Click Handler (Handles Quick Taps & Rewind Toggles reliably!)
  const handleCenterButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If user was dragging, do not process single click toggle
    if (hasDraggedRef.current) return;

    if (isQuickCreateOpen) {
      // REWIND BACK TO PENCIL STATE!
      setIsQuickCreateOpen(false);
      setIsHoldingNav(false);
      setActiveCreateDirection(null);
      setActiveNavDirection(null);
    } else {
      // QUICK TAP -> OPEN PLUS STATE!
      setIsQuickCreateOpen(true);
      setIsHoldingNav(false);
      setActiveCreateDirection(null);
      setActiveNavDirection(null);
    }
  };

  // Quick Create Node Click Handler (Direct Tap on Popped Node Icon)
  const handleQuickCreateNodeClick = (e: React.MouseEvent, type: 'note' | 'list' | 'vocab') => {
    e.stopPropagation();
    setIsQuickCreateOpen(false);
    setActiveCreateDirection(null);
    openNewEntry(type);
  };

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isHomeCentered) {
          setIsHoldingNav(false);
          setIsQuickCreateOpen(false);
          setActiveNavDirection(null);
          setActiveCreateDirection(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHomeCentered]);

  const isNavVisible = isHoldingNav;
  const isCreateVisible = isQuickCreateOpen && !isHomeCentered;

  return (
    <>
      {/* Background Overlay when Quick Create or Navigation active */}
      {(isHoldingNav || isQuickCreateOpen) && !isHomeCentered && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-[3px] z-40 transition-opacity duration-200"
          onClick={() => {
            setIsHoldingNav(false);
            setIsQuickCreateOpen(false);
            setActiveNavDirection(null);
            setActiveCreateDirection(null);
          }}
        />
      )}

      {/* Main Control Container */}
      <div
        ref={containerRef}
        className={`z-50 select-none touch-none ${
          isHomeCentered
            ? 'relative flex justify-center items-center'
            : 'fixed bottom-28 left-1/2 -translate-x-1/2 flex justify-center items-center'
        }`}
      >
        {/* --- 1. QUICK CREATE NODES (Plus State: w-12 h-12 / 48px Popped Icons with Drag Chevron Indicators) --- */}
        {isCreateVisible && (
          <div className="absolute inset-0 z-50 pointer-events-auto">
            {/* TOP: + Note (Emerald Green) */}
            <button
              onClick={(e) => handleQuickCreateNodeClick(e, 'note')}
              className={`absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 group cursor-pointer transition-all duration-150 ${
                activeCreateDirection === 'note' ? 'scale-110 z-10' : 'opacity-90'
              }`}
              title="Create New Note"
            >
              {/* Chevron Arrow Indicator when dragging + dot top */}
              {activeCreateDirection === 'note' && (
                <div className="absolute -top-6 text-emerald-400 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                  <ChevronUp className="w-5 h-5 stroke-[3]" />
                </div>
              )}

              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                  activeCreateDirection === 'note'
                    ? 'bg-emerald-500 text-white border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.8)] ring-2 ring-emerald-400'
                    : 'bg-emerald-500 text-white border-emerald-400/80 shadow-[0_0_16px_rgba(16,185,129,0.6)] group-hover:scale-105'
                }`}
              >
                <FileText className="w-5 h-5 stroke-[2]" />
              </div>
              <span
                className={`text-xs font-semibold tracking-wide bg-slate-900/95 px-2.5 py-0.5 rounded-full border shadow-sm transition-colors ${
                  activeCreateDirection === 'note'
                    ? 'text-emerald-300 border-emerald-400 font-bold'
                    : 'text-emerald-300 border-emerald-500/40'
                }`}
              >
                + Note
              </span>
            </button>

            {/* RIGHT: + List (Amber Yellow) */}
            <button
              onClick={(e) => handleQuickCreateNodeClick(e, 'list')}
              className={`absolute top-1/2 -right-24 -translate-y-1/2 flex flex-col items-center gap-1.5 group cursor-pointer transition-all duration-150 ${
                activeCreateDirection === 'list' ? 'scale-110 z-10' : 'opacity-90'
              }`}
              title="Create New List"
            >
              {/* Chevron Arrow Indicator when dragging + dot right */}
              {activeCreateDirection === 'list' && (
                <div className="absolute -right-6 top-2.5 text-amber-400 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                  <ChevronRight className="w-5 h-5 stroke-[3]" />
                </div>
              )}

              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                  activeCreateDirection === 'list'
                    ? 'bg-amber-500 text-white border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.8)] ring-2 ring-amber-400'
                    : 'bg-amber-500 text-white border-amber-400/80 shadow-[0_0_16px_rgba(245,158,11,0.6)] group-hover:scale-105'
                }`}
              >
                <List className="w-5 h-5 stroke-[2]" />
              </div>
              <span
                className={`text-xs font-semibold tracking-wide bg-slate-900/95 px-2.5 py-0.5 rounded-full border shadow-sm transition-colors ${
                  activeCreateDirection === 'list'
                    ? 'text-amber-300 border-amber-400 font-bold'
                    : 'text-amber-300 border-amber-500/40'
                }`}
              >
                + List
              </span>
            </button>

            {/* LEFT: + Vocab (Purple / Indigo) */}
            <button
              onClick={(e) => handleQuickCreateNodeClick(e, 'vocab')}
              className={`absolute top-1/2 -left-24 -translate-y-1/2 flex flex-col items-center gap-1.5 group cursor-pointer transition-all duration-150 ${
                activeCreateDirection === 'vocab' ? 'scale-110 z-10' : 'opacity-90'
              }`}
              title="Add Vocabulary Card"
            >
              {/* Chevron Arrow Indicator when dragging + dot left */}
              {activeCreateDirection === 'vocab' && (
                <div className="absolute -left-6 top-2.5 text-indigo-400 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]">
                  <ChevronLeft className="w-5 h-5 stroke-[3]" />
                </div>
              )}

              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                  activeCreateDirection === 'vocab'
                    ? 'bg-indigo-500 text-white border-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.8)] ring-2 ring-indigo-400'
                    : 'bg-indigo-500 text-white border-indigo-400/80 shadow-[0_0_16px_rgba(99,102,241,0.6)] group-hover:scale-105'
                }`}
              >
                <BookOpen className="w-5 h-5 stroke-[2]" />
              </div>
              <span
                className={`text-xs font-semibold tracking-wide bg-slate-900/95 px-2.5 py-0.5 rounded-full border shadow-sm transition-colors ${
                  activeCreateDirection === 'vocab'
                    ? 'text-indigo-300 border-indigo-400 font-bold'
                    : 'text-indigo-300 border-indigo-500/40'
                }`}
              >
                + Vocab
              </span>
            </button>
          </div>
        )}

        {/* --- 2. VIBRANT COLORED NAVIGATION NODES (Pencil State: w-12 h-12 / 48px Icons, Smaller than Central 64px Dot) --- */}
        <div
          className={`absolute inset-0 transition-all duration-250 ${
            isNavVisible || isHomeCentered
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-90 pointer-events-none invisible'
          }`}
        >
          {/* TOP: Notes (Emerald Green) */}
          <button
            onClick={(e) => isHomeCentered && handleHomeNodeClick(e, 'notes')}
            disabled={!isNavVisible && !isHomeCentered}
            className={`pointer-events-auto absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-150 group cursor-pointer ${
              activeNavDirection === 'notes' ? 'scale-110 z-10' : 'opacity-85'
            }`}
            title="Notes"
          >
            {/* Red Chevron Arrow Pointer (^ Up on Non-Home) */}
            {!isHomeCentered && activeNavDirection === 'notes' && (
              <div className="absolute -top-6 text-red-500 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                <ChevronUp className="w-5 h-5 stroke-[3]" />
              </div>
            )}

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeNavDirection === 'notes'
                  ? 'bg-emerald-500 text-white border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.8)] ring-2 ring-emerald-400'
                  : 'bg-emerald-500/85 text-white border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.4)] backdrop-blur-md group-hover:scale-105'
              }`}
            >
              <FileText className="w-5 h-5 stroke-[2]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                activeNavDirection === 'notes' ? 'text-emerald-300 font-bold' : 'text-slate-200'
              }`}
            >
              Notes
            </span>
          </button>

          {/* RIGHT: Lists (Amber Yellow) */}
          <button
            onClick={(e) => isHomeCentered && handleHomeNodeClick(e, 'lists')}
            disabled={!isNavVisible && !isHomeCentered}
            className={`pointer-events-auto absolute top-1/2 -right-24 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-150 group cursor-pointer ${
              activeNavDirection === 'lists' ? 'scale-110 z-10' : 'opacity-85'
            }`}
            title="Lists"
          >
            {/* Red Chevron Arrow Pointer (> Right on Non-Home) */}
            {!isHomeCentered && activeNavDirection === 'lists' && (
              <div className="absolute -right-6 top-2.5 text-red-500 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </div>
            )}

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeNavDirection === 'lists'
                  ? 'bg-amber-500 text-white border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.8)] ring-2 ring-amber-400'
                  : 'bg-amber-500/85 text-white border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.4)] backdrop-blur-md group-hover:scale-105'
              }`}
            >
              <List className="w-5 h-5 stroke-[2]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                activeNavDirection === 'lists' ? 'text-amber-300 font-bold' : 'text-slate-200'
              }`}
            >
              Lists
            </span>
          </button>

          {/* BOTTOM: Vocab (Purple / Indigo) */}
          <button
            onClick={(e) => isHomeCentered && handleHomeNodeClick(e, 'vocab')}
            disabled={!isNavVisible && !isHomeCentered}
            className={`pointer-events-auto absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-150 group cursor-pointer ${
              activeNavDirection === 'vocab' ? 'scale-110 z-10' : 'opacity-85'
            }`}
            title="Vocab"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeNavDirection === 'vocab'
                  ? 'bg-indigo-500 text-white border-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.8)] ring-2 ring-indigo-400'
                  : 'bg-indigo-500/85 text-white border-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.4)] backdrop-blur-md group-hover:scale-105'
              }`}
            >
              <BookOpen className="w-5 h-5 stroke-[2]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                activeNavDirection === 'vocab' ? 'text-indigo-300 font-bold' : 'text-slate-200'
              }`}
            >
              Vocab
            </span>

            {/* Red Chevron Arrow Pointer (v Down on Non-Home) */}
            {!isHomeCentered && activeNavDirection === 'vocab' && (
              <div className="absolute -bottom-6 text-red-500 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                <ChevronDown className="w-5 h-5 stroke-[3]" />
              </div>
            )}
          </button>

          {/* LEFT: Calendar (Orange Accent) */}
          <button
            onClick={(e) => isHomeCentered && handleHomeNodeClick(e, 'calendar')}
            disabled={!isNavVisible && !isHomeCentered}
            className={`pointer-events-auto absolute top-1/2 -left-24 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-150 group cursor-pointer ${
              activeNavDirection === 'calendar' ? 'scale-110 z-10' : 'opacity-85'
            }`}
            title="Calendar"
          >
            {/* Red Chevron Arrow Pointer (< Left on Non-Home) */}
            {!isHomeCentered && activeNavDirection === 'calendar' && (
              <div className="absolute -left-6 top-2.5 text-red-500 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                <ChevronLeft className="w-5 h-5 stroke-[3]" />
              </div>
            )}

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeNavDirection === 'calendar'
                  ? 'bg-orange-500 text-white border-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.8)] ring-2 ring-orange-400'
                  : 'bg-orange-500/85 text-white border-orange-400/60 shadow-[0_0_12px_rgba(249,115,22,0.4)] backdrop-blur-md group-hover:scale-105'
              }`}
            >
              <Calendar className="w-5 h-5 stroke-[2]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                activeNavDirection === 'calendar' ? 'text-orange-300 font-bold' : 'text-slate-200'
              }`}
            >
              Calendar
            </span>
          </button>
        </div>

        {/* --- CENTER BUTTON (Prominent w-16 h-16 / 64px Radial Dot with native onClick) --- */}
        {isHomeCentered ? (
          // Home Screen Center Control (Drag to create new entry)
          <button
            onPointerDown={(e) => handleHomeStart(e.clientX, e.clientY)}
            onPointerMove={(e) => handleHomeMove(e.clientX, e.clientY)}
            onPointerUp={handleHomeEnd}
            onTouchStart={(e) => {
              if (e.touches.length > 0) {
                handleHomeStart(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchMove={(e) => {
              if (e.touches.length > 0) {
                handleHomeMove(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchEnd={handleHomeEnd}
            className="relative w-16 h-16 rounded-full bg-sage-500 text-white flex items-center justify-center shadow-float hover:bg-sage-600 active:scale-95 transition-all duration-200 group touch-none cursor-pointer"
            title="Quick Capture (Drag to Notes, Lists, Vocab, or Calendar)"
          >
            <Pencil className="w-6 h-6 stroke-[2] transition-transform group-hover:rotate-12" />
          </button>
        ) : (
          // Non-Home Screen Dual-Mode Center Control with clean onClick rewind toggle!
          <button
            onClick={handleCenterButtonClick}
            onPointerDown={(e) => handleNonHomeStart(e.clientX, e.clientY)}
            onPointerMove={(e) => handleNonHomeMove(e.clientX, e.clientY)}
            onPointerUp={handleNonHomeEnd}
            onPointerCancel={handleNonHomeEnd}
            onTouchStart={(e) => {
              if (e.touches.length > 0) {
                handleNonHomeStart(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchMove={(e) => {
              if (e.touches.length > 0) {
                handleNonHomeMove(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchEnd={handleNonHomeEnd}
            onTouchCancel={handleNonHomeEnd}
            className={`relative w-16 h-16 rounded-full text-white flex items-center justify-center shadow-float active:scale-95 transition-all duration-300 group touch-none cursor-pointer z-50 ${
              isQuickCreateOpen
                ? 'bg-orange-500 ring-4 ring-orange-400/50 scale-105'
                : isHoldingNav
                ? 'bg-red-500 ring-4 ring-red-500/50 scale-105'
                : 'bg-sage-500 hover:bg-sage-600'
            }`}
            title={isQuickCreateOpen ? 'Click to Rewind Back to Pencil Dot' : 'Quick Tap for Entry Creation / Hold to Aim Navigation'}
          >
            {isQuickCreateOpen ? (
              <Plus className="w-7 h-7 stroke-[2.5] transition-transform rotate-90" />
            ) : (
              <Pencil className="w-6 h-6 stroke-[2] transition-transform group-hover:rotate-12" />
            )}
          </button>
        )}
      </div>
    </>
  );
};
