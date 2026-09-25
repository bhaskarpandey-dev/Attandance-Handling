import React, { useState } from 'react';
import { X, Copy, Check, Share2, AlertCircle } from 'lucide-react';
import { AttendanceStatus } from '../types';
import { formatReadableDate, formatWhatsAppReport } from '../utils/storage';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  totalStrength: number;
  records: { [roll: number]: AttendanceStatus };
  section?: string;
  onSectionChange?: (section: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  date,
  totalStrength,
  records,
  section = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [includeStats, setIncludeStats] = useState(false);
  const [userEditedText, setUserEditedText] = useState<string | null>(null);

  if (!isOpen) return null;

  let presentCount = 0;
  let absentCount = 0;
  let unmarkedCount = 0;

  for (let i = 1; i <= totalStrength; i++) {
    const st = records[i] || 'unmarked';
    if (st === 'present') presentCount++;
    else if (st === 'absent') {
      absentCount++;
    } else {
      unmarkedCount++;
    }
  }

  // Generates preview containing Date, (Section if any), and Absent Students section
  const generatedReportText = formatWhatsAppReport(date, totalStrength, records, section, {
    includeStats,
  });

  const displayText = userEditedText !== null ? userEditedText : generatedReportText;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(displayText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-150">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/70">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              Class Coordinator Report
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {formatReadableDate(date)} · Strength: {totalStrength}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase block">Strength</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{totalStrength}</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-center">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase block">Present</span>
              <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">{presentCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 text-center">
              <span className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold uppercase block">Absent</span>
              <span className="text-xl font-bold font-mono text-rose-700 dark:text-rose-400">{absentCount}</span>
            </div>
          </div>

          {unmarkedCount > 0 && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong>{unmarkedCount} roll numbers</strong> are still unmarked.
              </span>
            </div>
          )}

          {/* Formatted Report Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                WhatsApp Message Preview
              </label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Editable Preview Box */}
            <textarea
              rows={5}
              value={displayText}
              onChange={(e) => setUserEditedText(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              placeholder="Message preview..."
            />

            {/* Optional message inclusion toggle */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600 dark:text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeStats}
                  onChange={(e) => {
                    setIncludeStats(e.target.checked);
                    setUserEditedText(null);
                  }}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Include Stats (Counts)</span>
              </label>
            </div>
          </div>

        </div>

        {/* Modal Footer with Primary WhatsApp Share */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[46px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-transform"
          >
            <Share2 className="w-4 h-4" />
            <span>Share via WhatsApp</span>
          </a>

          <button
            onClick={handleCopy}
            className="min-h-[46px] px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
