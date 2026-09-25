import React, { useState } from 'react';
import { X, Check, Users } from 'lucide-react';

interface StrengthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStrength: number;
  onSaveStrength: (strength: number) => void;
}

export const StrengthModal: React.FC<StrengthModalProps> = ({
  isOpen,
  onClose,
  currentStrength,
  onSaveStrength,
}) => {
  const [val, setVal] = useState(String(currentStrength));

  if (!isOpen) return null;

  const presets = [60, 75, 80, 85, 90, 100, 120];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 300) {
      onSaveStrength(parsed);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-150">
        
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/70">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Customise Class Strength</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Total Number of Students / Roll Numbers
            </label>
            <input
              type="number"
              min="1"
              max="300"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full text-xl font-mono font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Quick Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setVal(String(preset))}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-xl border transition-colors ${
                    val === String(preset)
                      ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-600 dark:border-emerald-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-transform flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Strength</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
