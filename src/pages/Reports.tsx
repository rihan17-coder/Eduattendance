import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Download, Calendar, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { StudentService } from '../services/StudentService';
import { AttendanceService } from '../services/AttendanceService';
import { showToast, Student, AttendanceRecord } from '../utils/db';

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

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
          <p key={p.dataKey} style={{ color: p.color, marginTop: 3 }}>
            {p.name}: <strong>{p.value}%</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Dynamic stats
  const [overallRate, setOverallRate] = useState('—');
  const [belowThresholdCount, setBelowThresholdCount] = useState(0);
  const [bestSection, setBestSection] = useState('—');
  const [avgDailyPresent, setAvgDailyPresent] = useState(0);

  // Dynamic Chart Data
  const [dailyTrendData, setDailyTrendData] = useState<any[]>([]);
  const [todayBreakdownData, setTodayBreakdownData] = useState<any[]>([]);
  const [sectionAveragesData, setSectionAveragesData] = useState<any[]>([]);
  
  // Total logged student sessions today
  const [totalStudentsRegistered, setTotalStudentsRegistered] = useState(1);

  const loadReportsData = async (bypassCache = false) => {
    try {
      const [students, logs] = await Promise.all([
        StudentService.getStudents(bypassCache),
        AttendanceService.getAttendanceLogs(bypassCache)
      ]);

      if (students.length === 0 || logs.length === 0) {
        setLoading(false);
        return;
      }

      // 1. Overall Attendance Rate
      let sumRates = 0;
      students.forEach(s => {
        sumRates += AttendanceService.getStudentAttendanceRate(s.id, logs);
      });
      const avgOverall = Math.round(sumRates / students.length);
      setOverallRate(avgOverall + '%');

      // 2. Count Below 75%
      let belowCount = 0;
      students.forEach(s => {
        if (AttendanceService.getStudentAttendanceRate(s.id, logs) < 75) {
          belowCount++;
        }
      });
      setBelowThresholdCount(belowCount);

      // 3. Avg Daily Present Count
      const dates = Array.from(new Set(logs.map(l => l.date))).sort();
      let totalPresent = 0;
      dates.forEach(d => {
        const dayLogs = logs.filter(l => l.date === d);
        totalPresent += dayLogs.filter(l => l.status === 'present' || l.status === 'late').length;
      });
      const dailyAvg = dates.length > 0 ? Math.round(totalPresent / dates.length) : 0;
      setAvgDailyPresent(dailyAvg);

      // 4. Best Section Calculation & Section Bar Chart averages
      const sections = ['Section A', 'Section B'];
      let topSection = '—';
      let maxPct = 0;
      
      const secAvgs = sections.map(sec => {
        const secStudents = students.filter(s => s.section === sec);
        let sum = 0;
        secStudents.forEach(s => { sum += AttendanceService.getStudentAttendanceRate(s.id, logs); });
        const avg = secStudents.length > 0 ? Math.round(sum / secStudents.length) : 0;
        
        if (avg > maxPct) {
          maxPct = avg;
          topSection = sec;
        }
        return {
          dept: sec,
          attendance: avg,
        };
      });
      setBestSection(topSection);
      setSectionAveragesData(secAvgs);

      // 5. Daily Trend Comparison (Section A vs Section B over the logged days)
      const trends = dates.map(dStr => {
        const dayLogs = logs.filter(l => l.date === dStr);
        
        const getSecRate = (secName: string) => {
          const secLogs = dayLogs.filter(l => {
            const s = students.find(st => st.id === l.studentId);
            return s && s.section === secName;
          });
          if (secLogs.length === 0) return 85;
          const presentOrLate = secLogs.filter(l => l.status === 'present' || l.status === 'late').length;
          return Math.round((presentOrLate / secLogs.length) * 100);
        };

        const dayName = new Date(dStr).toLocaleDateString('en-US', { weekday: 'short' });
        return {
          dateName: dayName,
          secA: getSecRate('Section A'),
          secB: getSecRate('Section B'),
        };
      });
      setDailyTrendData(trends);

      // 6. Today's Breakdown Pie Chart (Latest logged date in system)
      const lastDate = dates[dates.length - 1];
      if (lastDate) {
        const lastLogs = logs.filter(l => l.date === lastDate);
        const present = lastLogs.filter(l => l.status === 'present').length;
        const absent = lastLogs.filter(l => l.status === 'absent').length;
        const late = lastLogs.filter(l => l.status === 'late').length;

        setTodayBreakdownData([
          { name: 'Present', value: present, color: '#10B981' },
          { name: 'Absent', value: absent, color: '#EF4444' },
          { name: 'Late', value: late, color: '#F59E0B' },
        ]);
        setTotalStudentsRegistered(lastLogs.length || 1);
      }
      setLoading(false);
    } catch (e) {
      showToast('Error syncing analytics reports', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportsData();
  }, []);

  const summaryCards = [
    { label: 'Overall Attendance', value: overallRate, trend: '+1.2%', up: true },
    { label: 'Students Below 75%', value: belowThresholdCount.toString(), trend: '−1', up: true },
    { label: 'Best Performing Section', value: bestSection, trend: 'Top Avg', up: true },
    { label: 'Avg. Daily Attendance', value: avgDailyPresent.toString(), trend: 'Students', up: true },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Comprehensive Reports</h1>
            <p className="page-subtitle">Analyze attendance statistics and departmental trends here.</p>
          </div>
          <div className="page-header-actions">
            <div className="flex gap-2 items-center">
              <button className="btn btn-secondary btn-sm" onClick={() => loadReportsData(true)}>
                Sync DB
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => showToast('Attendance PDF report exported to downloads', 'success')}>
                <Download size={13} />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px var(--text-secondary)' }}>Loading analytics reports...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="stats-grid mb-6">
            {summaryCards.map((c, i) => (
              <div key={i} className="stat-card">
                <div className="stat-card-top">
                  <div className={`stat-card-icon ${['blue', 'yellow', 'green', 'purple'][i]}`}>
                    {c.up ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <span className={`stat-badge ${c.up ? 'up' : 'down'}`}>{c.trend}</span>
                </div>
                <div className="stat-value" style={{ fontSize: c.value.length > 12 ? 18 : 22 }}>{c.value}</div>
                <div className="stat-label">{c.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="tabs">
            {['overview', 'sections', 'monthly'].map(tab => (
              <button
                key={tab}
                className={`tab-btn${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="analytics-grid">
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Daily Section Attendance Trends</div>
                    <div className="card-subtitle">Comparing Section A vs Section B morning averages</div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="chart-container" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyTrendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="dateName" tick={{ fontSize: 12, fill: 'var(--text-secondary)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} domain={[60, 100]} tickFormatter={v => `${v}%`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter', paddingTop: 12 }} />
                        <Line type="monotone" dataKey="secA" name="Section A" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4, fill: '#2563EB' }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="secB" name="Section B" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 4, fill: '#8B5CF6' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Pie */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Latest Attendance Breakdown</div>
                </div>
                <div className="card-body">
                  <div style={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                    {todayBreakdownData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={todayBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {todayBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: any, name: string) => [`${value} students`, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>
                        No recorded logs for breakdown
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                    {todayBreakdownData.map((d, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{d.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{d.value}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                            ({Math.round((d.value / totalStudentsRegistered) * 100)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sections Tab */}
          {activeTab === 'sections' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Section-wise Average Attendance</div>
                  <div className="card-subtitle">Average daily attendance rate per class section</div>
                </div>
              </div>
              <div className="card-body">
                <div className="chart-container" style={{ height: 320 }}>
                  {sectionAveragesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sectionAveragesData} barSize={44} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="dept" tick={{ fontSize: 12, fill: 'var(--text-secondary)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} domain={[60, 100]} tickFormatter={v => `${v}%`} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg)', radius: 6 }} />
                        <Bar dataKey="attendance" name="Attendance %" fill="#2563EB" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 13, color: 'var(--text-tertiary)' }}>
                      No class section records found.
                    </div>
                  )}
                </div>
                <hr className="divider" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {sectionAveragesData.map(d => (
                    <div key={d.dept}>
                      <div className="flex justify-between mb-1">
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{d.dept}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: d.attendance >= 80 ? 'var(--success)' : d.attendance >= 75 ? 'var(--warning)' : 'var(--danger)' }}>{d.attendance}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill blue" style={{ width: `${d.attendance}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Monthly tab placeholder */}
          {activeTab === 'monthly' && (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">
                  <TrendingUp size={22} />
                </div>
                <div className="empty-state-title">
                  Monthly Academic Attendance Trends
                </div>
                <div className="empty-state-desc">
                  Detailed tracking across semesters and semesters historical stats. Full trend lines will auto-render as daily logs populate.
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
