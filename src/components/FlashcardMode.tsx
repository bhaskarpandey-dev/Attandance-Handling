import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Check, X, RotateCcw, Sparkles } from 'lucide-react';
import { AttendanceStatus } from '../types';

interface FlashcardModeProps {
  currentRoll: number;
  totalStrength: number;
  records: { [roll: number]: AttendanceStatus };
  onMarkAndAdvance: (roll: number, status: 'present' | 'absent') => void;
  onNavigate: (step: number) => void;
  onJumpToRoll: (roll: number) => void;
  onUnmark: (roll: number) => void;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({
  currentRoll,
  totalStrength,
  records,
  onMarkAndAdvance,
  onNavigate,
  onJumpToRoll,
  onUnmark,
}) => {
  // Track direction for the slide animation: 1 for right-to-left (advancing), -1 for left-to-right (going back)
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const touchStartXRef = useRef<number | null>(null);

  // Helper to mark and trigger right-to-left advance
  const handleMark = (status: 'present' | 'absent') => {
    setSlideDirection(1); // Right-to-left slide
    onMarkAndAdvance(currentRoll, status);
  };

  const handleNext = () => {
    if (currentRoll < totalStrength) {
      setSlideDirection(1);
      onNavigate(1);
    }
  };

  const handlePrev = () => {
    if (currentRoll > 1) {
      setSlideDirection(-1);
      onNavigate(-1);
    }
  };

  // Card click handler: clicking center card marks Present if unmarked, or toggles
  const handleCardClick = (roll: number) => {
    if (roll === currentRoll) {
      const currentStatus = records[roll] || 'unmarked';
      if (currentStatus === 'unmarked') {
        handleMark('present');
      } else if (currentStatus === 'present') {
        handleMark('absent');
      } else {
        handleMark('present');
      }
    } else {
      setSlideDirection(roll > currentRoll ? 1 : -1);
      onJumpToRoll(roll);
    }
  };

  // Touch swipe support for one-handed mobile gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    touchStartXRef.current = null;

    if (diff > 45) {
      // Swiped left -> advance next
      handleNext();
    } else if (diff < -45) {
      // Swiped right -> go prev
      handlePrev();
    }
  };

  // Visible cards in carousel neighborhood (currentRoll - 2 to currentRoll + 2)
  const visibleCards = [];
  for (let offset = -2; offset <= 2; offset++) {
    const roll = currentRoll + offset;
    if (roll >= 1 && roll <= totalStrength) {
      visibleCards.push({ roll, offset });
    }
  }

  const currentStatus = records[currentRoll] || 'unmarked';
  const isPresent = currentStatus === 'present';
  const isAbsent = currentStatus === 'absent';

  // Animation variants for the right-to-left swipe animation
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 160 : -160,
      opacity: 0,
      scale: 0.88,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.25 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -160 : 160,
      opacity: 0,
      scale: 0.88,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.18 },
      },
    }),
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Horizontal Carousel Viewport */}
      <div 
        className="relative py-2 px-2 overflow-hidden flex items-center justify-center min-h-[210px] sm:min-h-[230px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Ambient background glow reflecting active card status */}
        <div 
          className={`absolute inset-0 pointer-events-none blur-3xl transition-opacity duration-500 opacity-20 dark:opacity-30 rounded-full ${
            isPresent ? 'bg-emerald-500' : isAbsent ? 'bg-rose-500' : 'bg-transparent'
          }`} 
        />

        {/* Left Peek Card (Previous Student) */}
        {currentRoll > 1 && (
          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute left-3 md:left-8 z-0 flex-col items-center justify-center w-20 md:w-24 h-36 md:h-40 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xs opacity-40 hover:opacity-75 transition-all scale-90 hover:scale-95 shadow-md cursor-pointer"
            title={`Go back to Roll #${currentRoll - 1}`}
          >
            <span className="text-[9px] font-mono text-slate-400 font-semibold mb-0.5">
              Roll #{currentRoll - 1}
            </span>
            <span className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300">
              {currentRoll - 1}
            </span>
            <span className="mt-1 text-[9px] font-bold">
              {records[currentRoll - 1] === 'present' ? (
                <span className="text-emerald-600">● Present</span>
              ) : records[currentRoll - 1] === 'absent' ? (
                <span className="text-rose-600">● Absent</span>
              ) : (
                <span className="text-slate-400">○ Unmarked</span>
              )}
            </span>
          </button>
        )}

        {/* Center Animated Floating Card */}
        <div className="relative z-10 w-full max-w-[240px] sm:max-w-[260px] flex items-center justify-center">
          <AnimatePresence mode="popLayout" custom={slideDirection}>
            <motion.div
              key={currentRoll}
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              onClick={() => handleCardClick(currentRoll)}
              className={`w-full rounded-2xl p-4 sm:p-5 border cursor-pointer transition-shadow duration-300 relative flex flex-col justify-between h-[190px] sm:h-[210px] ${
                isPresent
                  ? 'bg-emerald-50/95 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500/80 text-emerald-950 dark:text-emerald-100 shadow-[0_8px_25px_-5px_rgba(16,185,129,0.35),0_0_18px_rgba(16,185,129,0.2)] dark:shadow-[0_10px_30px_-5px_rgba(16,185,129,0.45),0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50'
                  : isAbsent
                  ? 'bg-rose-50/95 dark:bg-rose-950/40 border-rose-400 dark:border-rose-500/80 text-rose-950 dark:text-rose-100 shadow-[0_8px_25px_-5px_rgba(244,63,94,0.35),0_0_18px_rgba(244,63,94,0.2)] dark:shadow-[0_10px_30px_-5px_rgba(244,63,94,0.45),0_0_20px_rgba(244,63,94,0.3)] ring-1 ring-rose-400/50'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-lg shadow-slate-200/50 dark:shadow-black/60 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  Roll {currentRoll} of {totalStrength}
                </span>

                {/* Status Badge with Glowing Indicator */}
                <div
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all ${
                    isPresent
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : isAbsent
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isPresent ? 'bg-white animate-pulse' : isAbsent ? 'bg-white animate-pulse' : 'bg-slate-400'
                  }`} />
                  <span>{isPresent ? 'Present' : isAbsent ? 'Absent' : 'Unmarked'}</span>
                </div>
              </div>

              {/* Card Body: Compact Roll Number */}
              <div className="text-center py-1 my-auto">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                  Roll Number
                </div>
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight tabular-nums transition-transform">
                  {currentRoll}
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                  {isPresent
                    ? 'Marked Present · Tap to toggle'
                    : isAbsent
                    ? 'Marked Absent · Tap to toggle'
                    : 'Tap to mark Present'}
                </p>
              </div>

              {/* Card Footer */}
              <div className="text-center pt-1.5 border-t border-slate-200/50 dark:border-slate-800/50">
                <span className="text-[9px] uppercase font-bold tracking-wider opacity-60">
                  Swipe or use buttons
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Peek Card (Next Student) */}
        {currentRoll < totalStrength && (
          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-3 md:right-8 z-0 flex-col items-center justify-center w-20 md:w-24 h-36 md:h-40 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xs opacity-40 hover:opacity-75 transition-all scale-90 hover:scale-95 shadow-md cursor-pointer"
            title={`Advance to Roll #${currentRoll + 1}`}
          >
            <span className="text-[9px] font-mono text-slate-400 font-semibold mb-0.5">
              Roll #{currentRoll + 1}
            </span>
            <span className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300">
              {currentRoll + 1}
            </span>
            <span className="mt-1 text-[9px] font-bold">
              {records[currentRoll + 1] === 'present' ? (
                <span className="text-emerald-600">● Present</span>
              ) : records[currentRoll + 1] === 'absent' ? (
                <span className="text-rose-600">● Absent</span>
              ) : (
                <span className="text-slate-400">○ Unmarked</span>
              )}
            </span>
          </button>
        )}

      </div>

      {/* Control Buttons with Dynamic Status Glows & Auto-Advance */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* PRESENT Button */}
        <button
          onClick={() => handleMark('present')}
          className={`min-h-[64px] sm:min-h-[70px] px-4 py-3 rounded-2xl font-bold text-sm sm:text-base flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.97] cursor-pointer ${
            isPresent
              ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.45)] ring-4 ring-emerald-500/25'
              : 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] text-white shadow-sm'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Check className="w-5 h-5 stroke-[3]" />
            <span>PRESENT</span>
          </div>
          <span className="text-[10px] font-normal opacity-90">Auto-slides to next ➔</span>
        </button>

        {/* ABSENT Button */}
        <button
          onClick={() => handleMark('absent')}
          className={`min-h-[64px] sm:min-h-[70px] px-4 py-3 rounded-2xl font-bold text-sm sm:text-base flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.97] cursor-pointer ${
            isAbsent
              ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.45)] ring-4 ring-rose-500/25'
              : 'bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500 hover:shadow-[0_0_20px_rgba(244,63,94,0.35)] text-white shadow-sm'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <X className="w-5 h-5 stroke-[3]" />
            <span>ABSENT</span>
          </div>
          <span className="text-[10px] font-normal opacity-90">Auto-slides to next ➔</span>
        </button>
      </div>

      {/* Manual Navigation Controls (Previous, Unmark, Next) */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <button
          onClick={handlePrev}
          disabled={currentRoll <= 1}
          className="flex-1 min-h-[44px] px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs active:scale-98"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>⬅ Previous</span>
        </button>

        {currentStatus !== 'unmarked' && (
          <button
            onClick={() => onUnmark(currentRoll)}
            className="min-h-[44px] px-3.5 py-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
            title="Reset this roll to Unmarked"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1">Unmark</span>
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={currentRoll >= totalStrength}
          className="flex-1 min-h-[44px] px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs active:scale-98"
        >
          <span>Next ➔</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Jump Scrub Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3 transition-colors duration-150 overflow-hidden">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">
          Scrub Roll:
        </span>
        <input
          type="range"
          min="1"
          max={totalStrength}
          value={currentRoll}
          onChange={(e) => {
            const next = parseInt(e.target.value, 10);
            setSlideDirection(next > currentRoll ? 1 : -1);
            onJumpToRoll(next);
          }}
          className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer touch-none"
          style={{ touchAction: 'none' }}
        />
        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 w-8 text-right shrink-0">
          {currentRoll}
        </span>
      </div>

    </div>
  );
};
