import { AttendanceStatus, AttendanceState } from '../types';

export const STORAGE_KEYS = {
  ATTENDANCE_STATE: 'rollcall_grid85_state_v1',
  TOTAL_STRENGTH: 'rollcall_total_strength_v1',
  SECTION: 'rollcall_section_preference_v1',
};

export const DEFAULT_STRENGTH = 85;

export function getStoredSection(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.SECTION) || '';
  } catch {}
  return '';
}

export function saveStoredSection(section: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SECTION, section);
  } catch {}
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function formatReadableDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getStoredTotalStrength(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOTAL_STRENGTH);
    if (raw) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed > 0 && parsed <= 300) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_STRENGTH;
}

export function saveStoredTotalStrength(strength: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TOTAL_STRENGTH, String(strength));
  } catch {}
}

export function getStoredRecords(date: string, strength: number): { [roll: number]: AttendanceStatus } {
  const defaultRecords: { [roll: number]: AttendanceStatus } = {};
  for (let i = 1; i <= strength; i++) {
    defaultRecords[i] = 'unmarked';
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.ATTENDANCE_STATE}_${date}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with default to guarantee all 1..strength keys exist
      for (let i = 1; i <= strength; i++) {
        if (parsed[i] === 'present' || parsed[i] === 'absent' || parsed[i] === 'unmarked') {
          defaultRecords[i] = parsed[i];
        }
      }
      return defaultRecords;
    }
  } catch {}

  return defaultRecords;
}

export function saveStoredRecords(date: string, records: { [roll: number]: AttendanceStatus }): void {
  try {
    localStorage.setItem(`${STORAGE_KEYS.ATTENDANCE_STATE}_${date}`, JSON.stringify(records));
  } catch {}
}

export function formatWhatsAppReport(
  date: string,
  totalStrength: number,
  records: { [roll: number]: AttendanceStatus },
  section: string = '',
  options?: { includeStats?: boolean }
): string {
  const shortDate = formatShortDate(date);
  let text = `📅 Date: ${shortDate}\n`;
  if (section && section.trim()) {
    text += `Section: ${section.trim()}\n`;
  }

  const absentRolls: number[] = [];
  for (let i = 1; i <= totalStrength; i++) {
    if (records[i] === 'absent') absentRolls.push(i);
  }

  if (absentRolls.length > 0) {
    text += `Absentees: ${absentRolls.join(', ')}\n`;
  } else {
    text += `Absentees: None\n`;
  }

  if (options?.includeStats) {
    let presentCount = 0;
    let absentCount = 0;
    for (let i = 1; i <= totalStrength; i++) {
      const st = records[i] || 'unmarked';
      if (st === 'present') presentCount++;
      else if (st === 'absent') absentCount++;
    }
    text += `Total Strength: ${totalStrength}\n`;
    text += `✅ Present: ${presentCount}\n`;
    text += `❌ Absent: ${absentCount}\n`;
  }

  return text;
}
