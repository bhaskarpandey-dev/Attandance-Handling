import React from 'react';
import { Calendar, Users, Moon, Sun } from 'lucide-react';
import { ThemeMode } from '../utils/theme';

interface TopBarProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  totalStrength: number;
  onOpenStrengthModal: () => void;
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentDate,
  onDateChange,
  totalStrength,
  onOpenStrengthModal,
  theme,
  resolvedTheme,
  onToggleTheme,
}) => {
  const isDark = resolvedTheme === 'dark';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs transition-colors duration-150">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            RC
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              RollCall
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
              Class Attendance
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Customise Strength Button */}
          <button
            onClick={onOpenStrengthModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-xl transition-colors min-h-[36px] cursor-pointer"
            title="Customise total student strength"
          >
            <Users className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Strength:</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-extrabold">{totalStrength}</span>
          </button>

          {/* Date Picker */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-2 py-1 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <input
              type="date"
              value={currentDate}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none cursor-pointer w-24 sm:w-auto"
            />
          </div>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 rounded-xl transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center relative group cursor-pointer"
            title={`Current theme: ${theme} (${isDark ? 'Dark Mode' : 'Light Mode'}). Click to toggle.`}
            aria-label="Toggle Dark Mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in zoom-in-75 duration-150" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 animate-in zoom-in-75 duration-150" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
