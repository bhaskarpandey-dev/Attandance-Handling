import React from 'react';
import { AttendanceStatus } from '../types';

interface BoxGridViewProps {
  totalStrength: number;
  records: { [roll: number]: AttendanceStatus };
  currentRoll: number;
  onToggleBox: (roll: number) => void;
}

export const BoxGridView: React.FC<BoxGridViewProps> = ({
  totalStrength,
  records,
  currentRoll,
  onToggleBox,
}) => {
  const rolls = Array.from({ length: totalStrength }, (_, i) => i + 1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-150">
      {/* Legend & Instructions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Click cycle: Present ➔ Absent ➔ Blank
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">Blank</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]" />
            <span className="text-rose-700 dark:text-rose-400 font-bold">Absent</span>
          </div>
        </div>
      </div>

      {/* Visual Numbered Boxes Grid with 3-State Single-Click Cycle */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-2.5">
        {rolls.map((roll) => {
          const status = records[roll] || 'unmarked';
          const isCurrent = roll === currentRoll;

          // 3-State Dynamic styling with glowing shadow effects
          let bgClass = 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 shadow-none';
          
          if (status === 'present') {
            // 1st click / Present: Green with vibrant green glow
            bgClass = 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 border-emerald-600 dark:border-emerald-400 text-white shadow-[0_0_14px_rgba(16,185,129,0.45)] dark:shadow-[0_0_16px_rgba(16,185,129,0.55)] ring-1 ring-emerald-400/40';
          } else if (status === 'absent') {
            // 2nd click / Absent: Red with vibrant red glow
            bgClass = 'bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500 border-rose-600 dark:border-rose-400 text-white shadow-[0_0_14px_rgba(244,63,94,0.45)] dark:shadow-[0_0_16px_rgba(244,63,94,0.55)] ring-1 ring-rose-400/40';
          }

          return (
            <button
              key={roll}
              type="button"
              onClick={() => onToggleBox(roll)}
              className={`relative min-h-[46px] sm:min-h-[48px] rounded-xl font-mono text-sm sm:text-base font-bold border transition-all duration-150 active:scale-95 flex flex-col items-center justify-center select-none cursor-pointer ${bgClass} ${
                isCurrent ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-2 dark:ring-offset-slate-900' : ''
              }`}
              title={`Roll #${roll}: ${status === 'unmarked' ? 'Blank' : status.toUpperCase()} (Click to cycle: Present -> Absent -> Blank)`}
            >
              <span>{roll}</span>
              <span className="text-[9px] uppercase tracking-tighter opacity-80 font-sans font-medium leading-none">
                {status === 'present' ? 'P' : status === 'absent' ? 'A' : '—'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
        1 click: <span className="text-emerald-600 dark:text-emerald-400 font-bold">Present (Green)</span> ➔ 2 clicks: <span className="text-rose-600 dark:text-rose-400 font-bold">Absent (Red)</span> ➔ 3 clicks: <span className="font-bold">Blank</span>
      </div>
    </div>
  );
};
