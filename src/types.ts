export type AttendanceStatus = 'unmarked' | 'present' | 'absent';

export interface RollStudent {
  rollNumber: number;
  name?: string;
  status: AttendanceStatus;
}

export interface AttendanceState {
  totalStrength: number;
  date: string; // YYYY-MM-DD
  records: { [rollNumber: number]: AttendanceStatus };
}

export interface UndoAction {
  id: string;
  rollNumber: number;
  previousStatus: AttendanceStatus;
  newStatus: AttendanceStatus;
  timestamp: number;
}
