export interface Student {
  id: string;
  name: string;
  roll: string;
  dept: string;
  year: string;
  status: 'good' | 'warning' | 'low';
}

export interface FacultyMember {
  id: string;
  name: string;
  dept: string;
  subjects: string[];
  email: string;
  phone: string;
  status: 'active' | 'on-leave';
}

export interface AttendanceRecord {
  id: string; // unique record id
  date: string; // YYYY-MM-DD
  subject: string;
  section: string;
  studentId: string;
  status: 'present' | 'absent' | 'late';
}

export interface AppSettings {
  deptName: string;
  institutionName: string;
  targetAttendance: number;
}

export interface UserSession {
  username: string;
  role: 'admin' | 'faculty';
  token: string;
}

// Initial Seed Data
const SEED_STUDENTS: Student[] = [
  { id: '1', name: 'Aarav Sharma', roll: 'AI2401', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '2', name: 'Priya Mehta', roll: 'AI2402', dept: 'AI & DS', year: '2nd Year', status: 'low' },
  { id: '3', name: 'Rohan Gupta', roll: 'AI2403', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '4', name: 'Sneha Kapoor', roll: 'AI2404', dept: 'AI & DS', year: '2nd Year', status: 'warning' },
  { id: '5', name: 'Vikram Nair', roll: 'AI2405', dept: 'AI & DS', year: '3rd Year', status: 'good' },
  { id: '6', name: 'Ananya Rao', roll: 'AI2406', dept: 'AI & DS', year: '3rd Year', status: 'good' },
  { id: '7', name: 'Karthik Pillai', roll: 'AI2407', dept: 'AI & DS', year: '1st Year', status: 'low' },
  { id: '8', name: 'Divya Patel', roll: 'AI2408', dept: 'AI & DS', year: '4th Year', status: 'good' },
  { id: '9', name: 'Arjun Singh', roll: 'AI2409', dept: 'AI & DS', year: '2nd Year', status: 'warning' },
  { id: '10', name: 'Meera Nambiar', roll: 'AI2410', dept: 'AI & DS', year: '1st Year', status: 'good' },
];

const SEED_FACULTY: FacultyMember[] = [
  { id: '1', name: 'Dr. Arun Patel', dept: 'AI & DS', subjects: ['Machine Learning (AI301)', 'Python for AI (AI101)'], email: 'a.patel@edu.in', phone: '+91 98765 43210', status: 'active' },
  { id: '2', name: 'Prof. Meena Rao', dept: 'AI & DS', subjects: ['Deep Learning (AI302)', 'Natural Language Processing (AI401)'], email: 'm.rao@edu.in', phone: '+91 87654 32109', status: 'active' },
  { id: '3', name: 'Dr. Suresh Kumar', dept: 'AI & DS', subjects: ['Computer Vision (AI402)'], email: 's.kumar@edu.in', phone: '+91 76543 21098', status: 'active' },
  { id: '4', name: 'Ms. Anjali Singh', dept: 'AI & DS', subjects: ['Data Visualization (DS201)', 'Big Data Analytics (DS301)'], email: 'a.singh@edu.in', phone: '+91 65432 10987', status: 'active' },
];

const SEED_SETTINGS: AppSettings = {
  deptName: 'AI & Data Science',
  institutionName: 'EduAttend Pro',
  targetAttendance: 80,
};

// Generate historical logs for the last 14 days to populate reports
function generateHistoricalLogs(students: Student[]): AttendanceRecord[] {
  const logs: AttendanceRecord[] = [];
  const subjects = [
    'Machine Learning (AI301)',
    'Deep Learning (AI302)',
    'Data Visualization (DS201)',
    'Natural Language Processing (AI401)',
    'Computer Vision (AI402)',
    'Big Data Analytics (DS301)',
    'Python for AI (AI101)',
  ];
  const sections = ['Section A', 'Section B'];

  const today = new Date();
  for (let i = 14; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dateStr = date.toISOString().split('T')[0];

    subjects.forEach(subject => {
      sections.forEach(section => {
        students.forEach(student => {
          // Semi-random logic to keep rates realistic:
          // Aarav (good) -> mostly present
          // Priya (low) -> high absent
          // Rohan (good) -> present
          // Sneha (warning) -> mixed
          let status: 'present' | 'absent' | 'late' = 'present';
          const r = Math.random();

          if (student.status === 'low') {
            status = r < 0.6 ? 'present' : r < 0.9 ? 'absent' : 'late';
          } else if (student.status === 'warning') {
            status = r < 0.75 ? 'present' : r < 0.93 ? 'absent' : 'late';
          } else {
            status = r < 0.92 ? 'present' : r < 0.97 ? 'absent' : 'late';
          }

          logs.push({
            id: `${dateStr}_${subject}_${section}_${student.id}`,
            date: dateStr,
            subject,
            section,
            studentId: student.id,
            status,
          });
        });
      });
    });
  }
  return logs;
}

// Database Initializer
export function initDB() {
  if (!localStorage.getItem('edu_students')) {
    localStorage.setItem('edu_students', JSON.stringify(SEED_STUDENTS));
  }
  if (!localStorage.getItem('edu_faculty')) {
    localStorage.setItem('edu_faculty', JSON.stringify(SEED_FACULTY));
  }
  if (!localStorage.getItem('edu_settings')) {
    localStorage.setItem('edu_settings', JSON.stringify(SEED_SETTINGS));
  }
  if (!localStorage.getItem('edu_attendance_logs')) {
    const students = JSON.parse(localStorage.getItem('edu_students') || '[]');
    localStorage.setItem('edu_attendance_logs', JSON.stringify(generateHistoricalLogs(students)));
  }
}

// Read API
export function getStudents(): Student[] {
  initDB();
  return JSON.parse(localStorage.getItem('edu_students') || '[]');
}

export function getFaculty(): FacultyMember[] {
  initDB();
  return JSON.parse(localStorage.getItem('edu_faculty') || '[]');
}

export function getSettings(): AppSettings {
  initDB();
  return JSON.parse(localStorage.getItem('edu_settings') || '[]');
}

export function getAttendanceLogs(): AttendanceRecord[] {
  initDB();
  return JSON.parse(localStorage.getItem('edu_attendance_logs') || '[]');
}

export function getSession(): UserSession | null {
  const sessionStr = localStorage.getItem('edu_session');
  return sessionStr ? JSON.parse(sessionStr) : null;
}

// Write API
export function saveStudents(students: Student[]) {
  localStorage.setItem('edu_students', JSON.stringify(students));
  // Re-sync student status categories
  updateStudentStatuses();
}

export function saveFaculty(faculty: FacultyMember[]) {
  localStorage.setItem('edu_faculty', JSON.stringify(faculty));
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem('edu_settings', JSON.stringify(settings));
}

export function saveAttendanceLogs(logs: AttendanceRecord[]) {
  localStorage.setItem('edu_attendance_logs', JSON.stringify(logs));
}

export function loginUser(username: string, role: 'admin' | 'faculty'): boolean {
  const session: UserSession = {
    username,
    role,
    token: 'mock-session-token-' + Math.random().toString(36).substring(7),
  };
  localStorage.setItem('edu_session', JSON.stringify(session));
  return true;
}

export function logoutUser() {
  localStorage.removeItem('edu_session');
}

// Dynamically compute statuses based on real attendance records
export function updateStudentStatuses() {
  const students = JSON.parse(localStorage.getItem('edu_students') || '[]');
  const logs = JSON.parse(localStorage.getItem('edu_attendance_logs') || '[]');
  
  const updatedStudents = students.map((s: Student) => {
    const studentLogs = logs.filter((l: AttendanceRecord) => l.studentId === s.id);
    if (studentLogs.length === 0) return { ...s, status: 'good' };
    
    const presentOrLate = studentLogs.filter((l: AttendanceRecord) => l.status === 'present' || l.status === 'late').length;
    const rate = (presentOrLate / studentLogs.length) * 100;
    
    let status: 'good' | 'warning' | 'low' = 'good';
    if (rate < 75) status = 'low';
    else if (rate < 80) status = 'warning';
    
    return { ...s, status };
  });
  
  localStorage.setItem('edu_students', JSON.stringify(updatedStudents));
}

export function getStudentAttendanceRate(studentId: string): number {
  const logs = getAttendanceLogs();
  const studentLogs = logs.filter(l => l.studentId === studentId);
  if (studentLogs.length === 0) return 100; // default
  
  const presentOrLate = studentLogs.filter(l => l.status === 'present' || l.status === 'late').length;
  return Math.round((presentOrLate / studentLogs.length) * 100);
}
