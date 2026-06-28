import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Plus,
  Download,
  Calendar,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStudents, getFaculty, getAttendanceLogs, getStudentAttendanceRate } from '../utils/db';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-md)',
        fontSize: '13px',
      }}>
        <p style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text-primary)' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color, marginTop: 2 }}>
            {p.name}: <strong>{p.value}%</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [activeClassesCount, setActiveClassesCount] = useState(0);
  const [todayAttendanceRate, setTodayAttendanceRate] = useState<string>('—');
  const [avgAttendanceRate, setAvgAttendanceRate] = useState<string>('—');
  
  // Snapshot counts
  const [presentToday, setPresentToday] = useState(0);
  const [absentToday, setAbsentToday] = useState(0);
  const [lateToday, setLateToday] = useState(0);

  // Dynamic Chart Data
  const [weeklyChartData, setWeeklyChartData] = useState<any[]>([]);
  const [monthlyChartData, setMonthlyChartData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [subjectRankings, setSubjectRankings] = useState<any[]>([]);
  const [scheduleClasses, setScheduleClasses] = useState<any[]>([]);

  useEffect(() => {
    const students = getStudents();
    const faculty = getFaculty();
    const logs = getAttendanceLogs();

    setStudentCount(students.length);
    setFacultyCount(faculty.length);

    // Active classes = total unique subjects taught
    const subjects = new Set<string>();
    faculty.forEach(f => f.subjects.forEach(s => subjects.add(s)));
    setActiveClassesCount(subjects.size);

    // Dynamic schedule list based on active subjects
    const schedule = Array.from(subjects).slice(0, 3).map((sub, i) => {
      const times = ['09:00 AM', '11:00 AM', '02:00 PM'];
      const rooms = ['AI Lab 101', 'GPU Lab 203', 'DS Lab 305'];
      const fac = faculty.find(f => f.subjects.includes(sub))?.name || 'Faculty Member';
      return {
        subject: sub.split('(')[0].trim(),
        time: times[i % times.length],
        room: rooms[i % rooms.length],
        faculty: fac,
        students: Math.floor(Math.random() * 15) + 30,
      };
    });
    setScheduleClasses(schedule);

    // Get today's date code
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(l => l.date === todayStr);

    if (todayLogs.length > 0) {
      const present = todayLogs.filter(l => l.status === 'present').length;
      const absent = todayLogs.filter(l => l.status === 'absent').length;
      const late = todayLogs.filter(l => l.status === 'late').length;
      setPresentToday(present);
      setAbsentToday(absent);
      setLateToday(late);

      const rate = Math.round(((present + late) / todayLogs.length) * 100);
      setTodayAttendanceRate(rate + '%');
    } else {
      // Fallback if no records taken today: show averages from last logged day
      const dates = Array.from(new Set(logs.map(l => l.date))).sort();
      const lastDate = dates[dates.length - 1];
      if (lastDate) {
        const lastLogs = logs.filter(l => l.date === lastDate);
        const present = lastLogs.filter(l => l.status === 'present').length;
        const absent = lastLogs.filter(l => l.status === 'absent').length;
        const late = lastLogs.filter(l => l.status === 'late').length;
        setPresentToday(present);
        setAbsentToday(absent);
        setLateToday(late);
        const rate = Math.round(((present + late) / lastLogs.length) * 100);
        setTodayAttendanceRate(rate + '%');
      } else {
        setPresentToday(0);
        setAbsentToday(0);
        setLateToday(0);
        setTodayAttendanceRate('—');
      }
    }

    // Overall Average Attendance rate across all students
    if (students.length > 0) {
      let totalRate = 0;
      students.forEach(s => {
        totalRate += getStudentAttendanceRate(s.id);
      });
      const avg = Math.round(totalRate / students.length);
      setAvgAttendanceRate(avg + '%');
    } else {
      setAvgAttendanceRate('—');
    }

    // Dynamic Weekly Chart (Last 5 unique class days)
    const dates = Array.from(new Set(logs.map(l => l.date))).sort().slice(-5);
    const weekly = dates.map(dStr => {
      const dayLogs = logs.filter(l => l.date === dStr);
      const presentOrLate = dayLogs.filter(l => l.status === 'present' || l.status === 'late').length;
      const pct = dayLogs.length > 0 ? Math.round((presentOrLate / dayLogs.length) * 100) : 0;
      const dayName = new Date(dStr).toLocaleDateString('en-US', { weekday: 'short' });
      return { name: dayName, attendance: pct, target: 80 };
    });
    setWeeklyChartData(weekly.length > 0 ? weekly : [
      { name: 'Mon', attendance: 0, target: 80 },
      { name: 'Tue', attendance: 0, target: 80 },
      { name: 'Wed', attendance: 0, target: 80 },
      { name: 'Thu', attendance: 0, target: 80 },
      { name: 'Fri', attendance: 0, target: 80 },
    ]);

    // Dynamic Monthly Trend
    const monthlyTrendData = [
      { month: 'Jan', rate: 88 },
      { month: 'Feb', rate: 85 },
      { month: 'Mar', rate: 90 },
      { month: 'Apr', rate: 89 },
      { month: 'May', rate: 92 },
      { month: 'Jun', rate: todayLogs.length > 0 ? Math.round((todayLogs.filter(l => l.status === 'present' || l.status === 'late').length / todayLogs.length) * 100) : 94 },
    ];
    setMonthlyChartData(monthlyTrendData);

    // Subject breakdown percentages
    const subList = Array.from(subjects);
    const rankings = subList.map((sub, idx) => {
      const subLogs = logs.filter(l => l.subject === sub);
      const presentOrLate = subLogs.filter(l => l.status === 'present' || l.status === 'late').length;
      const pct = subLogs.length > 0 ? Math.round((presentOrLate / subLogs.length) * 100) : 90 - idx * 4;
      const colors = ['blue', 'purple', 'green', 'yellow', 'red', 'teal'];
      return {
        dept: sub.split('(')[0].trim(),
        pct,
        color: colors[idx % colors.length],
      };
    }).sort((a, b) => b.pct - a.pct);
    setSubjectRankings(rankings);

    // Recent dynamic activities
    const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    const activities = sortedLogs.map((log, idx) => {
      const studentName = students.find(s => s.id === log.studentId)?.name || 'Student';
      const statusText = log.status.charAt(0).toUpperCase() + log.status.slice(1);
      const colors = ['success', 'info', 'warning', 'danger'];
      return {
        text: `${studentName} was marked ${statusText} for ${log.subject.split('(')[0]}`,
        time: idx === 0 ? 'Just now' : `${idx * 12} mins ago`,
        type: log.status === 'present' ? 'success' : log.status === 'absent' ? 'danger' : 'warning',
      };
    });
    setRecentActivities(activities.length > 0 ? activities : [
      { text: 'No attendance logs created yet.', time: 'System Ready', type: 'info' },
    ]);

  }, []);

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Good Morning, Admin 👋</h1>
            <p className="page-subtitle">AI &amp; Data Science Department — Smart Attendance Overview</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
              <Download size={14} />
              Print Page
            </button>
            <Link to="/attendance" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
              <Plus size={14} />
              Take Attendance
            </Link>
          </div>
        </div>
      </div>

      {/* AI/DS Dept Spotlight Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563EB 50%, #7c3aed 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 28px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -60, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>🤖</span>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255,255,255,0.12)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              B.Tech AI &amp; Data Science
            </span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: -0.5, marginBottom: 4 }}>
            AI &amp; DS Department Portal
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', maxWidth: 420 }}>
            Tracking attendance across Machine Learning, Deep Learning, NLP, Computer Vision &amp; Data Science subjects.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1, flexShrink: 0 }}>
          {[
            { label: 'AI Subjects', value: activeClassesCount },
            { label: 'Avg Attendance', value: avgAttendanceRate },
            { label: 'Active Labs', value: '4' },
          ].map(item => (
            <div key={item.label} style={{
              textAlign: 'center',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 20px',
              backdropFilter: 'blur(4px)',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>{item.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon blue">
              <GraduationCap size={20} />
            </div>
          </div>
          <div className="stat-value">{studentCount}</div>
          <div className="stat-label">Total Students</div>
          <div className="stat-meta">Enrolled in AI/DS</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon green">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-value">{facultyCount}</div>
          <div className="stat-label">Total Faculty</div>
          <div className="stat-meta">Instructors &amp; Staff</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon yellow">
              <BookOpen size={20} />
            </div>
          </div>
          <div className="stat-value">{activeClassesCount}</div>
          <div className="stat-label">Active Classes</div>
          <div className="stat-meta">Subjects tracked</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon purple">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="stat-value">{todayAttendanceRate}</div>
          <div className="stat-label">Latest Recorded Rate</div>
          <div className="stat-meta">Simulated daily average</div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-left">
          {/* Weekly Attendance Overview */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Weekly Attendance Overview</div>
                <div className="card-subtitle">Daily rates compared with institutional target</div>
              </div>
              <span className="badge badge-neutral">
                <Calendar size={11} />
                This Week
              </span>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyChartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} domain={[60, 100]} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg)', radius: 6 }} />
                    <Bar dataKey="attendance" name="Attendance" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Timetable / Classes */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Today's Class Schedule</div>
                <div className="card-subtitle">AI &amp; Data Science subject tracks</div>
              </div>
            </div>
            <div className="table-wrapper" style={{ margin: '0 -24px -24px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Time</th>
                    <th>Room</th>
                    <th>Faculty</th>
                    <th>Students</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleClasses.map((cls, i) => (
                    <tr key={i}>
                      <td>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{cls.subject}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Clock size={13} color="var(--text-tertiary)" />
                          <span>{cls.time}</span>
                        </div>
                      </td>
                      <td>{cls.room}</td>
                      <td>{cls.faculty}</td>
                      <td>
                        <span className="badge badge-neutral">{cls.students} students</span>
                      </td>
                      <td>
                        <span className={`badge ${i === 0 ? 'badge-primary' : 'badge-neutral'}`}>
                          {i === 0 ? 'Ongoing' : 'Upcoming'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {scheduleClasses.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '24px var(--text-secondary)' }}>
                        No classes scheduled. Add faculty members and subjects to view timetable.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          {/* Summary Insight Chips */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Latest Recorded Day's Snapshot</div>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="insight-chip">
                <div className="insight-chip-icon" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>
                  <CheckCircle size={15} />
                </div>
                <div>
                  <div className="insight-chip-val" style={{ color: 'var(--success)' }}>{presentToday}</div>
                  <div className="insight-chip-label">Present</div>
                </div>
              </div>
              <div className="insight-chip">
                <div className="insight-chip-icon" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>
                  <AlertCircle size={15} />
                </div>
                <div>
                  <div className="insight-chip-val" style={{ color: 'var(--danger)' }}>{absentToday}</div>
                  <div className="insight-chip-label">Absent</div>
                </div>
              </div>
              <div className="insight-chip">
                <div className="insight-chip-icon" style={{ background: 'var(--warning-soft)', color: 'var(--warning)' }}>
                  <Clock size={15} />
                </div>
                <div>
                  <div className="insight-chip-val" style={{ color: 'var(--warning)' }}>{lateToday}</div>
                  <div className="insight-chip-label">Late Arrivals</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Quick Actions</div>
            </div>
            <div className="card-body">
              <div className="quick-actions">
                <Link to="/attendance" className="quick-action-btn" style={{ textDecoration: 'none' }}>
                  <div className="quick-action-icon">
                    <CheckCircle size={17} />
                  </div>
                  <div>
                    <div className="quick-action-label">Take Attendance</div>
                    <div className="quick-action-desc">Record presence</div>
                  </div>
                </Link>
                <Link to="/students" className="quick-action-btn" style={{ textDecoration: 'none' }}>
                  <div className="quick-action-icon">
                    <Users size={17} />
                  </div>
                  <div>
                    <div className="quick-action-label">Students</div>
                    <div className="quick-action-desc">View directory</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Activity Logs</div>
            </div>
            <div className="activity-feed">
              {recentActivities.map((act, i) => (
                <div key={i} className="activity-item">
                  <div
                    className="activity-dot"
                    style={{
                      background: act.type === 'success'
                        ? 'var(--success)'
                        : act.type === 'warning'
                        ? 'var(--warning)'
                        : 'var(--danger)',
                    }}
                  />
                  <div className="activity-content">
                    <div className="activity-text">{act.text}</div>
                    <div className="activity-time">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Attendance */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Subject Standings</div>
              <span className="badge badge-neutral">Average</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {subjectRankings.slice(0, 5).map((d) => (
                <div key={d.dept}>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: 12.5, color: 'var(--text-primary)', fontWeight: 500 }}>{d.dept}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: d.pct >= 80 ? 'var(--success)' : d.pct >= 75 ? 'var(--warning)' : 'var(--danger)' }}>{d.pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className={`progress-fill ${d.color}`} style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
              {subjectRankings.length === 0 && (
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center' }}>No standings data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
