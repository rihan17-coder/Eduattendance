import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  X,
  Trash2,
  Edit2,
} from 'lucide-react';
import { getStudents, saveStudents, getStudentAttendanceRate } from '../utils/db';

const statusMeta = {
  good: { badge: 'badge-success', label: 'Good', icon: CheckCircle },
  warning: { badge: 'badge-warning', label: 'Warning', icon: AlertCircle },
  low: { badge: 'badge-danger', label: 'At Risk', icon: AlertCircle },
};

const avatarColors = ['avatar-blue', 'avatar-purple', 'avatar-green', 'avatar-orange', 'avatar-teal', 'avatar-pink'];

interface StudentFormData {
  name: string;
  roll: string;
  dept: string;
  year: string;
  section: string;
}

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    roll: '',
    dept: 'AI & DS',
    year: '2nd Year',
    section: 'Section A',
  });
  
  // Dropdown menu state per row
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    setStudents(getStudents());
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      roll: '',
      dept: 'AI & DS',
      year: '2nd Year',
      section: 'Section A',
    });
    setEditingStudentId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student: any) => {
    setFormData({
      name: student.name,
      roll: student.roll,
      dept: student.dept,
      year: student.year,
      section: student.section || 'Section A',
    });
    setEditingStudentId(student.id);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const updated = students.filter(s => s.id !== id);
      saveStudents(updated);
      setStudents(updated);
      setActiveMenuId(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudentId) {
      // Edit
      const updated = students.map(s => 
        s.id === editingStudentId 
          ? { ...s, ...formData } 
          : s
      );
      saveStudents(updated);
      setStudents(updated);
    } else {
      // Add
      const newStudent = {
        id: Date.now().toString(),
        name: formData.name,
        roll: formData.roll,
        dept: formData.dept,
        year: formData.year,
        section: formData.section,
        status: 'good', // will auto update on next attendance take
      };
      const updated = [...students, newStudent];
      saveStudents(updated);
      setStudents(updated);
    }
    setIsModalOpen(false);
  };

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || s.dept === deptFilter;
    return matchSearch && matchDept;
  });

  const getStats = () => {
    let good = 0, warning = 0, low = 0;
    students.forEach(s => {
      const rate = getStudentAttendanceRate(s.id);
      if (rate >= 80) good++;
      else if (rate >= 75) warning++;
      else low++;
    });
    return { good, warning, low };
  };

  const { good, warning, low } = getStats();

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Student Directory</h1>
            <p className="page-subtitle">Manage enrolled students and track attendance details here.</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setDeptFilter('All')}>
              <Filter size={13} />
              Reset Filters
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
              <Plus size={13} />
              Enroll Student
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon blue"><GraduationCap size={20} /></div>
          </div>
          <div className="stat-value">{students.length}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon green"><CheckCircle size={20} /></div>
          </div>
          <div className="stat-value">{good}</div>
          <div className="stat-label">Good Standing</div>
          <div className="stat-meta">≥ 80% attendance</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon yellow"><AlertCircle size={20} /></div>
          </div>
          <div className="stat-value">{warning}</div>
          <div className="stat-label">Needs Attention</div>
          <div className="stat-meta">75–79% attendance</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}><TrendingUp size={20} /></div>
          </div>
          <div className="stat-value">{low}</div>
          <div className="stat-label">At Risk</div>
          <div className="stat-meta">&lt; 75% attendance</div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={13} color="var(--text-tertiary)" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or roll number..."
              aria-label="Search students"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'AI & DS', 'CSE', 'ECE'].map(dept => (
              <button
                key={dept}
                className={`btn btn-sm ${deptFilter === dept ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setDeptFilter(dept)}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        <table style={{ overflow: 'visible' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Roll No.</th>
              <th>Department</th>
              <th>Class &amp; Sec</th>
              <th>Attendance</th>
              <th>Status</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody style={{ overflow: 'visible' }}>
            {filtered.map((student, idx) => {
              const attendanceRate = getStudentAttendanceRate(student.id);
              let statusKey: 'good' | 'warning' | 'low' = 'good';
              if (attendanceRate < 75) statusKey = 'low';
              else if (attendanceRate < 80) statusKey = 'warning';
              
              const meta = statusMeta[statusKey];
              const initials = student.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
              const avatarColor = avatarColors[idx % avatarColors.length];

              return (
                <tr key={student.id} style={{ overflow: 'visible' }}>
                  <td style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>{idx + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={`avatar avatar-sm ${avatarColor}`}>{initials}</div>
                      <span className="font-semibold">{student.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 13 }}>
                    {student.roll}
                  </td>
                  <td><span className="badge badge-primary">{student.dept}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{student.year} — {student.section || 'Section A'}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="progress-bar" style={{ width: 72 }}>
                        <div
                          className={`progress-fill ${attendanceRate >= 80 ? 'green' : attendanceRate >= 75 ? 'yellow' : 'red'}`}
                          style={{ width: `${attendanceRate}%` }}
                        />
                      </div>
                      <span style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: attendanceRate >= 80 ? 'var(--success)' : attendanceRate >= 75 ? 'var(--warning)' : 'var(--danger)',
                      }}>
                        {attendanceRate}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${meta.badge}`}>
                      <span className="badge-dot" />
                      {meta.label}
                    </span>
                  </td>
                  <td style={{ position: 'relative', overflow: 'visible' }}>
                    <button 
                      className="icon-btn" 
                      onClick={() => setActiveMenuId(activeMenuId === student.id ? null : student.id)}
                      style={{ border: 'none', background: 'transparent', width: 28, height: 28 }}
                    >
                      <MoreHorizontal size={16} color="var(--text-tertiary)" />
                    </button>
                    
                    {activeMenuId === student.id && (
                      <div style={{
                        position: 'absolute',
                        right: 8,
                        top: 36,
                        background: '#fff',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-md)',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 120,
                      }}>
                        <button 
                          onClick={() => handleOpenEditModal(student)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            border: 'none',
                            background: 'transparent',
                            textAlign: 'left',
                            fontSize: 12.5,
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            width: '100%',
                          }}
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(student.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            border: 'none',
                            background: 'transparent',
                            textAlign: 'left',
                            fontSize: 12.5,
                            color: 'var(--danger)',
                            cursor: 'pointer',
                            width: '100%',
                            borderTop: '1px solid var(--border)',
                          }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><Search size={22} /></div>
                    <div className="empty-state-title">No students found</div>
                    <div className="empty-state-desc">Try adjusting your search or filter.</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

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

      {/* Modal Dialog */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 460, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title">{editingStudentId ? 'Edit Student Details' : 'Enroll New Student'}</div>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required
                  placeholder="e.g. AI2401"
                  value={formData.roll}
                  onChange={e => setFormData({ ...formData, roll: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select 
                  className="form-select"
                  value={formData.dept}
                  onChange={e => setFormData({ ...formData, dept: e.target.value })}
                >
                  <option value="AI & DS">AI &amp; DS</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Year of Study</label>
                <select 
                  className="form-select"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value })}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Section</label>
                <select 
                  className="form-select"
                  value={formData.section}
                  onChange={e => setFormData({ ...formData, section: e.target.value })}
                >
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end" style={{ marginTop: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingStudentId ? 'Save Changes' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
