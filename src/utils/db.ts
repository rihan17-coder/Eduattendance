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
  { id: '1', name: 'Adhil Abubacker', roll: '732725243001', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '2', name: 'Aiswarya Savalam', roll: '732725243002', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '3', name: 'Akkala Anki Reddy', roll: '732725243003', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '4', name: 'Akshara Ali Fathima S', roll: '732725243004', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '5', name: 'Amal Mehaboob T', roll: '732725243005', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '6', name: 'Ansha M', roll: '732725243006', dept: 'AI & DS', year: '2nd Year', status: 'low' },
  { id: '7', name: 'Atchaya J', roll: '732725243007', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '8', name: 'Bandla Aravind Koti', roll: '732725243008', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '9', name: 'Bandla Mahesh', roll: '732725243009', dept: 'AI & DS', year: '2nd Year', status: 'warning' },
  { id: '10', name: 'Barathan K', roll: '732725243010', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '11', name: 'Bathala Sarath Kumar', roll: '732725243011', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '12', name: 'Bhavana N', roll: '732725243012', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '13', name: 'Bhevin M', roll: '732725243013', dept: 'AI & DS', year: '2nd Year', status: 'low' },
  { id: '14', name: 'Boddupalli Venkata Sai Ram', roll: '732725243014', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '15', name: 'Bonamukkala Lakshmi Prasanthi', roll: '732725243015', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '16', name: 'Chennamsetty Jaswanth', roll: '732725243016', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '17', name: 'Cherukuru Vishnuvardhan Babu', roll: '732725243017', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '18', name: 'Chundi Likitha', roll: '732725243018', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '19', name: 'Chundi Lokesh Reddy', roll: '732725243019', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '20', name: 'Daddala Pallavi', roll: '732725243020', dept: 'AI & DS', year: '2nd Year', status: 'warning' },
  { id: '21', name: 'Deepak K', roll: '732725243021', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '22', name: 'Devika V S', roll: '732725243022', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '23', name: 'Dhanasekar V', roll: '732725243023', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '24', name: 'Dhanu Vijayaraj N', roll: '732725243024', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '25', name: 'Dhariya Vishal', roll: '732725243025', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '26', name: 'Dharshini R', roll: '732725243026', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '27', name: 'Dharshini R', roll: '732725243027', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '28', name: 'Dhilsha S', roll: '732725243028', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '29', name: 'Dhivyadharshini C', roll: '732725243029', dept: 'AI & DS', year: '2nd Year', status: 'low' },
  { id: '30', name: 'Dinesh R', roll: '732725243030', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '31', name: 'Eega Jaswanth Reddy', roll: '732725243031', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '32', name: 'Gangireddy Madhan Mohan G', roll: '732725243032', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '33', name: 'Giridharan S', roll: '732725243033', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '34', name: 'Girisa S', roll: '732725243034', dept: 'AI & DS', year: '2nd Year', status: 'warning' },
  { id: '35', name: 'Golla Venkata Naga Mohan', roll: '732725243035', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '36', name: 'Gollapothu Gowthami', roll: '732725243036', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '37', name: 'Gopi Reddy Mahi', roll: '732725243037', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '38', name: 'Gudipalli Nandavardhan', roll: '732725243038', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '39', name: 'Gunaseelan M', roll: '732725243039', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '40', name: 'Gunnam Bharanimanvithreddy', roll: '732725243040', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '41', name: 'Gunturu Vijaya Akshaya', roll: '732725243041', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '42', name: 'Gutha Lakshmi Bhargavi', roll: '732725243042', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '43', name: 'Gutta Divya Lakshmi Narasimha Naidu', roll: '732725243043', dept: 'AI & DS', year: '2nd Year', status: 'low' },
  { id: '44', name: 'Harikumaran S', roll: '732725243044', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '45', name: 'Harishkumar E', roll: '732725243045', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '46', name: 'Hrudya Lakshmi', roll: '732725243046', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '47', name: 'Idagotla Sivanagahemanthkumar', roll: '732725243047', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '48', name: 'Indhu S', roll: '732725243048', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '49', name: 'Ishanth Kumar S', roll: '732725243049', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '50', name: 'Iswarya A', roll: '732725243050', dept: 'AI & DS', year: '2nd Year', status: 'warning' },
  { id: '51', name: 'Jada Avinash', roll: '732725243051', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '52', name: 'Jaiadithya S', roll: '732725243052', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '53', name: 'Jaladanki Manosravya', roll: '732725243053', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '54', name: 'Jampani Lakshmi Narasimha Rao', roll: '732725243054', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '55', name: 'Jefrypaul P', roll: '732725243055', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '56', name: 'Kabilesh P', roll: '732725243056', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '57', name: 'Kalaivani S', roll: '732725243057', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '58', name: 'Kancharla Rokshith', roll: '732725243058', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '59', name: 'Katragadda Lakshmi Karthik', roll: '732725243059', dept: 'AI & DS', year: '2nd Year', status: 'warning' },
  { id: '60', name: 'Kaza Navadeep', roll: '732725243060', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '61', name: 'Kocharla Gayatri', roll: '732725243061', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '62', name: 'Korukonda Likitha', roll: '732725243062', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '63', name: 'Kothapalli Rakesh', roll: '732725243063', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '64', name: 'Krishnan T', roll: '732725243064', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '65', name: 'Kurapati Venkata Santhosh', roll: '732725243065', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '66', name: 'Malepati Venkata Dinesh', roll: '732725243066', dept: 'AI & DS', year: '2nd Year', status: 'low' },
  { id: '67', name: 'Mallu Uday Kiran', roll: '732725243067', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '68', name: 'Mannem Mahesh', roll: '732725243068', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '69', name: 'Marella Joshi Navya Sri', roll: '732725243069', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '70', name: 'Marturi Anudeep', roll: '732725243070', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '71', name: 'Mathina Siva Krishna', roll: '732725243071', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '72', name: 'Meiyarasu N', roll: '732725243072', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '73', name: 'Mighdad PC', roll: '732725243073', dept: 'AI & DS', year: '2nd Year', status: 'warning' },
  { id: '74', name: 'Mohamed Tharik', roll: '732725243074', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '75', name: 'Mohammed Nashid C', roll: '732725243075', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '76', name: 'Muhammed Janis AV', roll: '732725243076', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '77', name: 'Muhammed Sinan T K', roll: '732725243077', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '78', name: 'Mukilan M', roll: '732725243078', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '79', name: 'Muli Mahidhar Reddy', roll: '732725243079', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '80', name: 'Nali Hemanth Kumar', roll: '732725243080', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '81', name: 'Navar Bin Navas', roll: '732725243081', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '82', name: 'Nayani Rahul Rishi', roll: '732725243082', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '83', name: 'Nishanth K', roll: '732725243083', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '84', name: 'Nithishwaran D', roll: '732725243084', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '85', name: 'Pandi Pavan', roll: '732725243085', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '86', name: 'Parchuri Venkata Vinitha Ramya', roll: '732725243086', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '87', name: 'Pasupuleti Dineshkumar', roll: '732725243087', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '88', name: 'Patan Abdhul Rasheed', roll: '732725243088', dept: 'AI & DS', year: '2nd Year', status: 'low' },
  { id: '89', name: 'Patan Faizil', roll: '732725243089', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '90', name: 'Patapati Pallavi', roll: '732725243090', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '91', name: 'Pothuraja Mounika', roll: '732725243091', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '92', name: 'Praveen K', roll: '732725243092', dept: 'AI & DS', year: '2nd Year', status: 'warning' },
  { id: '93', name: 'Puli Vasavi Lakshmi', roll: '732725243093', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '94', name: 'Rachana G', roll: '732725243094', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '95', name: 'Rajpurohit Pooran', roll: '732725243095', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '96', name: 'Ramana G K', roll: '732725243096', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '97', name: 'Rao Ajay Kumar', roll: '732725243097', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '98', name: 'Rubitha R', roll: '732725243098', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '99', name: 'Sakthi Mahalakshmi S', roll: '732725243099', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '100', name: 'Salish SK', roll: '732725243100', dept: 'AI & DS', year: '2nd Year', status: 'warning' },
  { id: '101', name: 'Sanke Balaji', roll: '732725243101', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '102', name: 'Santhakumar S', roll: '732725243102', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '103', name: 'Saranraj K', roll: '732725243103', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '104', name: 'Seyed Rihan S K', roll: '732725243104', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '105', name: 'Shaik Ashraf SK', roll: '732725243105', dept: 'AI & DS', year: '2nd Year', status: 'low' },
  { id: '106', name: 'Shaik Subhani', roll: '732725243106', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '107', name: 'Shanmugapriya S', roll: '732725243107', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '108', name: 'Shifin Muhammed K', roll: '732725243108', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '109', name: 'Sivali S', roll: '732725243109', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '110', name: 'Snekha R', roll: '732725243110', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '111', name: 'Sree Ranjini O J', roll: '732725243111', dept: 'AI & DS', year: '2nd Year', status: 'warning' },
  { id: '112', name: 'Sreyas Krishna K P', roll: '732725243112', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '113', name: 'Subiksha P', roll: '732725243113', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '114', name: 'Swashiga V G', roll: '732725243114', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '115', name: 'Tata Tirumala Rao', roll: '732725243115', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '116', name: 'Tejesh Reddy Chedimala', roll: '732725243116', dept: 'AI & DS', year: '2nd Year', status: 'low' },
  { id: '117', name: 'Thatha Venkata Charan', roll: '732725243117', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '118', name: 'Vaishnavi D', roll: '732725243118', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '119', name: 'Valleti Venkata Kiran', roll: '732725243119', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '120', name: 'Vanthana S L', roll: '732725243120', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '121', name: 'Venkata Sai Kumar Reddy', roll: '732725243121', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '122', name: 'Vinodam Kushwanth', roll: '732725243122', dept: 'AI & DS', year: '2nd Year', status: 'warning' },
  { id: '123', name: 'Vishal P', roll: '732725243123', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '124', name: 'Vunnam Manoj', roll: '732725243124', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '125', name: 'Yukesh Sudan A', roll: '732725243125', dept: 'AI & DS', year: '2nd Year', status: 'good' },
  { id: '126', name: 'Yuvashri P', roll: '732725243126', dept: 'AI & DS', year: '2nd Year', status: 'good' },
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
  for (let i = 6; i >= 1; i--) {
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

export function initDB() {
  const existingStudentsStr = localStorage.getItem('edu_students');
  let needsReSeed = false;
  
  if (existingStudentsStr) {
    try {
      const parsed = JSON.parse(existingStudentsStr);
      if (!Array.isArray(parsed) || parsed.length < 100) {
        needsReSeed = true;
      }
    } catch (e) {
      needsReSeed = true;
    }
  } else {
    needsReSeed = true;
  }

  if (needsReSeed) {
    localStorage.setItem('edu_students', JSON.stringify(SEED_STUDENTS));
    localStorage.setItem('edu_attendance_logs', JSON.stringify(generateHistoricalLogs(SEED_STUDENTS)));
  }

  if (!localStorage.getItem('edu_faculty')) {
    localStorage.setItem('edu_faculty', JSON.stringify(SEED_FACULTY));
  }
  if (!localStorage.getItem('edu_settings')) {
    localStorage.setItem('edu_settings', JSON.stringify(SEED_SETTINGS));
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
