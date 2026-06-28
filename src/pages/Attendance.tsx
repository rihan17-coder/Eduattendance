import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  ChevronDown,
  Users,
} from 'lucide-react';
import { getStudents, getAttendanceLogs, saveAttendanceLogs, updateStudentStatuses } from '../utils/db';

const DEPARTMENTS = ['AI & DS', 'CSE', 'ECE', 'ME'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const SECTIONS = ['Section A', 'Section B', 'Section C'];

const avatarColors = ['avatar-blue', 'avatar-purple', 'avatar-green', 'avatar-orange', 'avatar-teal', 'avatar-pink'];

type Status = 'present' | 'absent' | 'late' | null;

export default function Attendance() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const [selectedYear, setSelectedYear] = useState(YEARS[1]); // Default 2nd Year where seed is located
  const [selectedSection, setSelectedSection] = useState(SECTIONS[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');
  const [attendance, setAttendance] = useState<Record<string, Status>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load students and previous logs for current subject + section + date
  useEffect(() => {
    const list = getStudents();
    // Filter students by class parameters (Department, Year, Section)
    const classStudents = list.filter(
      s => s.dept === selectedDept && 
           s.year === selectedYear && 
           (s.section === selectedSection || (!s.section && selectedSection === 'Section A'))
    );
    setStudents(classStudents);

    // Fetch existing daily attendance logs for this date
    const logs = getAttendanceLogs();
    const currentLogs = logs.filter(l => l.date === date);

    const initialAttendance: Record<string, Status> = {};
    classStudents.forEach(student => {
      const record = currentLogs.find(l => l.studentId === student.id);
      initialAttendance[student.id] = record ? record.status : null;
    });

    setAttendance(initialAttendance);
    
    // Check if fully marked and saved previously
    const hasAnySaved = classStudents.length > 0 && classStudents.every(s => initialAttendance[s.id] !== null);
    setSaved(hasAnySaved);
  }, [selectedDept, selectedYear, selectedSection, date]);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll.toLowerCase().includes(search.toLowerCase())
  );

  const setStatus = (id: string, status: Status) => {
    setAttendance(prev => ({ ...prev, [id]: prev[id] === status ? null : status }));
    setSaved(false);
  };

  const markAll = (status: Status) => {
    const updated: Record<string, Status> = {};
    filtered.forEach(s => { updated[s.id] = status; });
    setAttendance(prev => ({ ...prev, ...updated }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    
    setTimeout(() => {
      const logs = getAttendanceLogs();
      const studentIds = students.map(s => s.id);
      
      // Filter out existing logs for these specific students on this date
      const filteredLogs = logs.filter(
        l => !(l.date === date && studentIds.includes(l.studentId))
      );

      // Create new logs (uniqueness guaranteed per student per date)
      const newRecords = Object.entries(attendance)
        .filter(([studentId, status]) => status !== null && studentIds.includes(studentId))
        .map(([studentId, status]) => ({
          id: `${date}_${studentId}`,
          date,
          studentId,
          status: status as 'present' | 'absent' | 'late',
        }));

      const updatedLogs = [...filteredLogs, ...newRecords];
      saveAttendanceLogs(updatedLogs);
      updateStudentStatuses(); // refresh student standing metrics
      
      setSaving(false);
      setSaved(true);
    }, 600);
  };

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;
  const lateCount = Object.values(attendance).filter(v => v === 'late').length;
  const totalMarked = presentCount + absentCount + lateCount;

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Take Attendance</h1>
            <p className="page-subtitle">Record daily presence for your assigned classes.</p>
          </div>
          <button
            className={`btn btn-primary ${!totalMarked ? 'btn' : ''}`}
            onClick={handleSave}
            disabled={!totalMarked || saving}
            style={{ minWidth: 140 }}
          >
            <Save size={14} />
            {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card mb-5">
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, alignItems: 'end' }}>
          <div className="form-group">
            <label className="form-label">Department</label>
            <div style={{ position: 'relative' }}>
              <select
                className="form-select"
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                style={{ paddingRight: 36 }}
              >
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Year</label>
            <div style={{ position: 'relative' }}>
              <select
                className="form-select"
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                style={{ paddingRight: 36 }}
              >
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Section</label>
            <div style={{ position: 'relative' }}>
              <select
                className="form-select"
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
                style={{ paddingRight: 36 }}
              >
                {SECTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{ paddingRight: 36 }}
              />
              <Calendar size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      {totalMarked > 0 && (
        <div className="flex gap-3 mb-5">
          <div className="insight-chip" style={{ flex: 1 }}>
            <div className="insight-chip-icon" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>
              <CheckCircle size={15} />
            </div>
            <div>
              <div className="insight-chip-val" style={{ color: 'var(--success)' }}>{presentCount}</div>
              <div className="insight-chip-label">Present Today</div>
            </div>
          </div>
          <div className="insight-chip" style={{ flex: 1 }}>
            <div className="insight-chip-icon" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>
              <XCircle size={15} />
            </div>
            <div>
              <div className="insight-chip-val" style={{ color: 'var(--danger)' }}>{absentCount}</div>
              <div className="insight-chip-label">Absent Today</div>
            </div>
          </div>
          <div className="insight-chip" style={{ flex: 1 }}>
            <div className="insight-chip-icon" style={{ background: 'var(--warning-soft)', color: 'var(--warning)' }}>
              <Clock size={15} />
            </div>
            <div>
              <div className="insight-chip-val" style={{ color: 'var(--warning)' }}>{lateCount}</div>
              <div className="insight-chip-label">Late Arrivals</div>
            </div>
          </div>
          <div className="insight-chip" style={{ flex: 1 }}>
            <div className="insight-chip-icon" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
              <Users size={15} />
            </div>
            <div>
              <div className="insight-chip-val">{students.length}</div>
              <div className="insight-chip-label">Total Class Enrolled</div>
            </div>
          </div>
        </div>
      )}

      {/* Student Attendance Table */}
      <div className="table-wrapper">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={13} color="var(--text-tertiary)" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or roll no."
              aria-label="Search students"
            />
          </div>
          {filtered.length > 0 && (
            <div className="flex gap-2">
              <button className="btn btn-secondary btn-sm" onClick={() => markAll('present')}>
                <CheckCircle size={13} />
                Mark All Present
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => markAll('absent')}>
                <XCircle size={13} />
                Mark All Absent
              </button>
            </div>
          )}
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Roll No.</th>
              <th>Department</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student, idx) => {
              const status = attendance[student.id];
              const initials = student.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
              const avatarColor = avatarColors[idx % avatarColors.length];

              return (
                <tr key={student.id}>
                  <td style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>{idx + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={`avatar avatar-sm ${avatarColor}`}>
                        {initials}
                      </div>
                      <span className="font-semibold">{student.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 13 }}>
                    {student.roll}
                  </td>
                  <td>
                    <span className="badge badge-neutral">{student.dept}</span>
                  </td>
                  <td>
                    {status === 'present' && <span className="badge badge-success"><span className="badge-dot" />Present</span>}
                    {status === 'absent' && <span className="badge badge-danger"><span className="badge-dot" />Absent</span>}
                    {status === 'late' && <span className="badge badge-warning"><span className="badge-dot" />Late</span>}
                    {!status && <span className="badge badge-neutral">— Not marked</span>}
                  </td>
                  <td>
                    <div className="attendance-toggle-group">
                      <button
                        className={`att-btn${status === 'present' ? ' present' : ''}`}
                        onClick={() => setStatus(student.id, 'present')}
                        title="Mark Present"
                      >
                        P
                      </button>
                      <button
                        className={`att-btn${status === 'absent' ? ' absent' : ''}`}
                        onClick={() => setStatus(student.id, 'absent')}
                        title="Mark Absent"
                      >
                        A
                      </button>
                      <button
                        className={`att-btn${status === 'late' ? ' late' : ''}`}
                        onClick={() => setStatus(student.id, 'late')}
                        title="Mark Late"
                      >
                        L
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <Users size={22} />
                    </div>
                    <div className="empty-state-title">No students found</div>
                    <div className="empty-state-desc">No students are currently enrolled under this Department, Year, and Section.</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div className="flex justify-between items-center" style={{ padding: '12px 18px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
            Showing {filtered.length} of {students.length} students
          </span>
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm" disabled>Previous</button>
            <button className="btn btn-secondary btn-sm" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
