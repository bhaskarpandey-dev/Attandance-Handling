import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FileText,
  Share2,
  CheckCheck,
  RotateCcw,
  Calendar,
} from 'lucide-react';
import { AttendanceStatus } from './types';
import {
  getTodayDateString,
  getStoredTotalStrength,
  saveStoredTotalStrength,
  getStoredRecords,
  saveStoredRecords,
  formatShortDate,
  formatWhatsAppReport,
  getStoredSection,
  saveStoredSection,
} from './utils/storage';
import { useTheme } from './utils/theme';
import { TopBar } from './components/TopBar';
import { FlashcardMode } from './components/FlashcardMode';
import { BoxGridView } from './components/BoxGridView';
import { ProgressSummary } from './components/ProgressSummary';
import { ReportModal } from './components/ReportModal';
import { StrengthModal } from './components/StrengthModal';

export default function App() {
  // Theme Manager
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  // Date State
  const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());

  // Total Students / Roll Numbers (Default 85)
  const [totalStrength, setTotalStrength] = useState<number>(() => getStoredTotalStrength());

  // Attendance Records: { [rollNumber: number]: 'unmarked' | 'present' | 'absent' }
  const [records, setRecords] = useState<{ [roll: number]: AttendanceStatus }>(() =>
    getStoredRecords(getTodayDateString(), getStoredTotalStrength())
  );

  // Active roll number for Flashcard Mode
  const [currentRoll, setCurrentRoll] = useState<number>(1);

  // Class Section (e.g. "A", "B", "CSE-1", etc.)
  const [section, setSection] = useState<string>(() => getStoredSection());

  // Dual View Mode: 'flashcard' or 'grid'
  const [viewMode, setViewMode] = useState<'flashcard' | 'grid'>('flashcard');

  // Modals
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isStrengthOpen, setIsStrengthOpen] = useState(false);

  const handleSectionChange = useCallback((newSection: string) => {
    setSection(newSection);
    saveStoredSection(newSection);
  }, []);

  // Load records whenever date or totalStrength changes
  useEffect(() => {
    const loaded = getStoredRecords(currentDate, totalStrength);
    setRecords(loaded);
    if (currentRoll > totalStrength) {
      setCurrentRoll(1);
    }
  }, [currentDate, totalStrength]);

  // Save changes to localStorage
  const updateRecords = useCallback(
    (newRecords: { [roll: number]: AttendanceStatus }) => {
      setRecords(newRecords);
      saveStoredRecords(currentDate, newRecords);
    },
    [currentDate]
  );

  // Flashcard Mode: Mark status and Auto-Advance to next roll number
  const handleMarkAndAdvance = useCallback(
    (roll: number, status: 'present' | 'absent') => {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(15);
        } catch {}
      }

      const nextRecords = { ...records, [roll]: status };
      updateRecords(nextRecords);

      // Auto-advance
      if (roll < totalStrength) {
        setCurrentRoll(roll + 1);
      }
    },
    [records, totalStrength, updateRecords]
  );

  // Flashcard Navigation
  const handleNavigate = useCallback(
    (step: number) => {
      setCurrentRoll((prev) => {
        const next = prev + step;
        if (next < 1) return 1;
        if (next > totalStrength) return totalStrength;
        return next;
      });
    },
    [totalStrength]
  );

  // Flashcard Unmark current
  const handleUnmark = useCallback(
    (roll: number) => {
      const nextRecords = { ...records, [roll]: 'unmarked' as const };
      updateRecords(nextRecords);
    },
    [records, updateRecords]
  );

  // Grid Mode: Toggle box status directly (Unmarked -> Present -> Absent -> Unmarked)
  const handleToggleBox = useCallback(
    (roll: number) => {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(15);
        } catch {}
      }

      const current = records[roll] || 'unmarked';
      let nextStatus: AttendanceStatus = 'present';
      if (current === 'present') {
        nextStatus = 'absent';
      } else if (current === 'absent') {
        nextStatus = 'unmarked';
      } else {
        nextStatus = 'present';
      }

      const nextRecords = { ...records, [roll]: nextStatus };
      setCurrentRoll(roll);
      updateRecords(nextRecords);
    },
    [records, updateRecords]
  );

  // Customise Total Student Strength
  const handleSaveStrength = useCallback(
    (newStrength: number) => {
      setTotalStrength(newStrength);
      saveStoredTotalStrength(newStrength);
      const loaded = getStoredRecords(currentDate, newStrength);
      setRecords(loaded);
      if (currentRoll > newStrength) {
        setCurrentRoll(newStrength);
      }
    },
    [currentDate, currentRoll]
  );

  // Bulk Operations
  const handleMarkRemainingPresent = useCallback(() => {
    const updated = { ...records };
    for (let i = 1; i <= totalStrength; i++) {
      if (!updated[i] || updated[i] === 'unmarked') {
        updated[i] = 'present';
      }
    }
    updateRecords(updated);
  }, [records, totalStrength, updateRecords]);

  const handleMarkAllPresent = useCallback(() => {
    const updated: { [roll: number]: AttendanceStatus } = {};
    for (let i = 1; i <= totalStrength; i++) {
      updated[i] = 'present';
    }
    updateRecords(updated);
  }, [totalStrength, updateRecords]);

  const handleResetAll = useCallback(() => {
    const updated: { [roll: number]: AttendanceStatus } = {};
    for (let i = 1; i <= totalStrength; i++) {
      updated[i] = 'unmarked';
    }
    updateRecords(updated);
    setCurrentRoll(1);
  }, [totalStrength, updateRecords]);

  // Derived counts
  const { presentCount, absentCount, unmarkedCount } = useMemo(() => {
    let p = 0;
    let a = 0;
    let u = 0;
    for (let i = 1; i <= totalStrength; i++) {
      const st = records[i] || 'unmarked';
      if (st === 'present') p++;
      else if (st === 'absent') a++;
      else u++;
    }
    return { presentCount: p, absentCount: a, unmarkedCount: u };
  }, [records, totalStrength]);

  // Keyboard shortcut listener for Flashcard Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isReportOpen || isStrengthOpen) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        handleNavigate(1);
      } else if (e.key === 'ArrowLeft') {
        handleNavigate(-1);
      } else if (e.key.toLowerCase() === 'p' || e.key === 'Enter') {
        handleMarkAndAdvance(currentRoll, 'present');
      } else if (e.key.toLowerCase() === 'a' || e.key === 'Backspace') {
        handleMarkAndAdvance(currentRoll, 'absent');
      } else if (e.key.toLowerCase() === 'u') {
        handleUnmark(currentRoll);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isReportOpen,
    isStrengthOpen,
    currentRoll,
    handleNavigate,
    handleMarkAndAdvance,
    handleUnmark,
  ]);

  // Quick WhatsApp Link for Sticky Footer
  const quickWhatsappUrl = useMemo(() => {
    const text = formatWhatsAppReport(currentDate, totalStrength, records, section);
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [currentDate, totalStrength, records, section]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-28 antialiased transition-colors duration-150 overflow-x-hidden w-full max-w-full">
      
      {/* Top Header */}
      <TopBar
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        totalStrength={totalStrength}
        onOpenStrengthModal={() => setIsStrengthOpen(true)}
        theme={theme}
        resolvedTheme={resolvedTheme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        
        {/* Dual View Mode Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-200/80 dark:bg-slate-900 rounded-2xl gap-1 transition-colors duration-150">
          <button
            onClick={() => setViewMode('flashcard')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'flashcard'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>🗂 Flashcard Mode</span>
          </button>
          
          <button
            onClick={() => setViewMode('grid')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>⊞ {totalStrength}-Box Grid View</span>
          </button>
        </div>

        {/* Live Progress & 4-Stat Summary */}
        <ProgressSummary
          totalStrength={totalStrength}
          presentCount={presentCount}
          absentCount={absentCount}
          unmarkedCount={unmarkedCount}
        />

        {/* Quick Bulk Action Helpers */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
          <button
            onClick={handleMarkRemainingPresent}
            disabled={unmarkedCount === 0}
            className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 disabled:opacity-40 disabled:pointer-events-none px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors"
          >
            Mark Remaining ({unmarkedCount}) Present
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 px-2 py-1 transition-colors"
            >
              All Present
            </button>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <button
              onClick={handleResetAll}
              className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-2 py-1 transition-colors"
            >
              Reset to Unmarked
            </button>
          </div>
        </div>

        {/* View Mode A: Flashcard / Sequential Mode */}
        {viewMode === 'flashcard' && (
          <FlashcardMode
            currentRoll={currentRoll}
            totalStrength={totalStrength}
            records={records}
            onMarkAndAdvance={handleMarkAndAdvance}
            onNavigate={handleNavigate}
            onJumpToRoll={setCurrentRoll}
            onUnmark={handleUnmark}
          />
        )}

        {/* View Mode B: Interactive 85-Box Visual Grid View */}
        {viewMode === 'grid' && (
          <BoxGridView
            totalStrength={totalStrength}
            records={records}
            currentRoll={currentRoll}
            onToggleBox={handleToggleBox}
          />
        )}

      </main>

      {/* Sticky Bottom Thumb-Zone CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-2.5 sm:p-3 shadow-lg transition-colors duration-150 overflow-x-hidden max-w-full">
        <div className="max-w-2xl mx-auto flex items-center gap-2 w-full min-w-0">
          {/* Generate Coordinator Report */}
          <button
            onClick={() => setIsReportOpen(true)}
            className="flex-1 min-w-0 min-h-[44px] sm:min-h-[46px] px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-transform active:scale-[0.98] shadow-sm border border-transparent dark:border-slate-700 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">
              <span className="sm:hidden">Coordinator Report</span>
              <span className="hidden sm:inline">Generate Coordinator Report</span>
            </span>
            {absentCount > 0 && (
              <span className="bg-rose-500/90 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold shrink-0">
                {absentCount} Absent
              </span>
            )}
          </button>

          {/* Quick WhatsApp Share Button */}
          <a
            href={quickWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] sm:min-h-[46px] px-3.5 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-transform shrink-0"
            title="Share directly via WhatsApp to class coordinator"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Coordinator Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        date={currentDate}
        totalStrength={totalStrength}
        records={records}
        section={section}
        onSectionChange={handleSectionChange}
      />

      {/* Customise Strength Modal */}
      <StrengthModal
        isOpen={isStrengthOpen}
        onClose={() => setIsStrengthOpen(false)}
        currentStrength={totalStrength}
        onSaveStrength={handleSaveStrength}
      />

    </div>
  );
}
