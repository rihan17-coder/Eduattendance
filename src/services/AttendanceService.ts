import { supabase } from '../utils/supabaseClient';
import { AttendanceRecord, Student } from '../utils/db';
import { StudentService } from './StudentService';

export class AttendanceService {
  static async getAttendanceLogs(bypassCache = false): Promise<AttendanceRecord[]> {
    const cacheKey = 'edu_attendance_logs_cache';
    if (!bypassCache) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching attendance logs:', error);
      throw error;
    }

    const logs: AttendanceRecord[] = (data || []).map(row => ({
      id: row.id,
      date: row.date,
      studentId: row.student_id,
      status: row.status as 'present' | 'absent' | 'late' | 'leave',
      markedBy: row.marked_by,
    }));

    localStorage.setItem(cacheKey, JSON.stringify(logs));
    return logs;
  }

  static async saveAttendanceLogs(newLogs: Omit<AttendanceRecord, 'id'>[]): Promise<boolean> {
    const rows = newLogs.map(l => ({
      student_id: l.studentId,
      date: l.date,
      status: l.status,
      marked_by: l.markedBy || 'Dr. Arun Patel',
    }));

    const { error } = await supabase
      .from('attendance')
      .upsert(rows, { onConflict: 'student_id,date' });

    if (error) {
      console.error('Error saving attendance logs:', error);
      throw error;
    }

    // Force refresh cache and update student health standing statuses
    await AttendanceService.getAttendanceLogs(true);
    await AttendanceService.updateStudentStatuses();
    return true;
  }

  static async updateStudentStatuses(): Promise<void> {
    const students = await StudentService.getStudents(true);
    const logs = await AttendanceService.getAttendanceLogs(true);

    const updatedStudents = students.map((s: Student) => {
      const studentLogs = logs.filter(l => l.studentId === s.id);
      if (studentLogs.length === 0) return s;

      const presentOrLate = studentLogs.filter(l => l.status === 'present' || l.status === 'late').length;
      const rate = (presentOrLate / studentLogs.length) * 100;

      let status: 'good' | 'warning' | 'low' = 'good';
      if (rate < 75) status = 'low';
      else if (rate < 80) status = 'warning';

      return { ...s, status };
    });

    for (const student of updatedStudents) {
      const original = students.find(o => o.id === student.id);
      if (original && original.status !== student.status) {
        await supabase
          .from('students')
          .update({ status: student.status })
          .eq('id', student.id);
      }
    }

    // Refresh students list cache
    await StudentService.getStudents(true);
  }

  static getStudentAttendanceRate(studentId: string, logs: AttendanceRecord[]): number {
    const studentLogs = logs.filter(l => l.studentId === studentId);
    if (studentLogs.length === 0) return 100;
    const presentOrLate = studentLogs.filter(l => l.status === 'present' || l.status === 'late').length;
    return Math.round((presentOrLate / studentLogs.length) * 100);
  }
}
