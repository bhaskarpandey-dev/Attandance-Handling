import React from 'react';

interface ProgressSummaryProps {
  totalStrength: number;
  presentCount: number;
  absentCount: number;
  unmarkedCount: number;
}

export const ProgressSummary: React.FC<ProgressSummaryProps> = ({
  totalStrength,
  presentCount,
  absentCount,
  unmarkedCount,
}) => {
  const markedCount = presentCount + absentCount;
  const progressPercent = totalStrength > 0 ? Math.round((markedCount / totalStrength) * 100) : 0;
  const presentPercent = totalStrength > 0 ? (presentCount / totalStrength) * 100 : 0;
  const absentPercent = totalStrength > 0 ? (absentCount / totalStrength) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors duration-150">
      {/* 4-Stat Metric Row */}
      <div className="grid grid-cols-4 gap-2">
        {/* Total */}
        <div className="p-2 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            Total
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {totalStrength}
          </div>
        </div>

        {/* Marked */}
        <div className="p-2 sm:p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-center">
          <div className="text-[10px] sm:text-[11px] text-blue-700 dark:text-blue-400 font-semibold uppercase tracking-wider">
            Marked
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-blue-700 dark:text-blue-400 tabular-nums">
            {markedCount}
          </div>
        </div>

        {/* Present */}
        <div className="p-2 sm:p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-center">
          <div className="text-[10px] sm:text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
            Present
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
            {presentCount}
          </div>
        </div>

        {/* Absent */}
        <div className="p-2 sm:p-3 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 text-center">
          <div className="text-[10px] sm:text-[11px] text-rose-700 dark:text-rose-400 font-semibold uppercase tracking-wider">
            Absent
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-rose-700 dark:text-rose-400 tabular-nums">
            {absentCount}
          </div>
        </div>
      </div>

      {/* Progress Bar & Status Text */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-700 dark:text-slate-300">
            {markedCount} / {totalStrength} Completed
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-mono">
            {progressPercent}% Complete ({unmarkedCount} remaining)
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden flex shadow-inner">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${presentPercent}%` }}
            title={`Present: ${presentCount}`}
          />
          <div
            className="bg-rose-500 h-full transition-all duration-300"
            style={{ width: `${absentPercent}%` }}
            title={`Absent: ${absentCount}`}
          />
        </div>
      </div>
    </div>
  );
};
