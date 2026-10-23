import type {
  Student, FeeInstalment, PaymentRecord, AttendanceDay, TimetablePeriod,
  Circular, CalendarEvent, ExamScheduleItem, ExamResult, Subject,
  LearningOutcome, TeacherUpdate, DisciplineRecord, ActivityRecord,
  ObservationRecord, TransportInfo, GatePass, Appointment,
  CertificateRequest, InfirmaryVisit, PTM, ConfirmationRequest,
  NotificationItem, FAQ,
} from '@/types';

import aaravPhoto from '@/assets/student-aarav.jpg';
import diyaPhoto from '@/assets/student-diya.jpg';

export const students: Student[] = [
  {
    id: 's1',
    name: 'Aarav Sharma',
    studentId: 'STU-2026-0142',
    grNumber: 'GR-9821',
    rollNumber: '07',
    class: 'Class 8',
    section: 'A',
    dob: '2012-03-15',
    photo: aaravPhoto,
    bloodGroup: 'B+',
    fatherName: 'Rajesh Sharma',
    fatherOccupation: 'Software Engineer',
    motherName: 'Priya Sharma',
    motherOccupation: 'Doctor',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@gmail.com',
    address: '12, Green Park Avenue, Pune, MH 411001',
    admittedOn: '2019-06-15',
  },
  {
    id: 's2',
    name: 'Diya Sharma',
    studentId: 'STU-2026-0156',
    grNumber: 'GR-9835',
    rollNumber: '12',
    class: 'Class 5',
    section: 'B',
    dob: '2015-07-22',
    photo: diyaPhoto,
    bloodGroup: 'O+',
    fatherName: 'Rajesh Sharma',
    fatherOccupation: 'Software Engineer',
    motherName: 'Priya Sharma',
    motherOccupation: 'Doctor',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@gmail.com',
    address: '12, Green Park Avenue, Pune, MH 411001',
    admittedOn: '2021-06-15',
  },
];

export const studentPhotos: Record<string, string> = {
  'Aarav Sharma': aaravPhoto,
  'Diya Sharma': diyaPhoto,
  'Diya Patel': diyaPhoto,
  'Ishaan Verma': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=256&h=256&fit=crop&crop=faces',
  'Saanvi Reddy': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop&crop=faces',
  'Arjun Nair': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces',
  'Ananya Gupta': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop&crop=faces',
  'Vihaan Joshi': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=faces',
  'Myra Singh': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=faces',
};

export const feeInstalments: FeeInstalment[] = [
  { id: 'f1', title: 'Instalment 1 - Tuition', dueDate: '2026-05-31', amount: 25000, paid: 25000, status: 'paid' },
  { id: 'f2', title: 'Instalment 2 - Tuition', dueDate: '2026-08-10', amount: 25000, paid: 15000, status: 'partial' },
  { id: 'f3', title: 'Instalment 3 - Tuition', dueDate: '2026-11-10', amount: 25000, paid: 0, status: 'pending' },
  { id: 'f4', title: 'Transport Fee - Term 1', dueDate: '2026-06-30', amount: 8000, paid: 8000, status: 'paid' },
  { id: 'f5', title: 'Transport Fee - Term 2', dueDate: '2026-10-31', amount: 8000, paid: 0, status: 'overdue' },
];

export const paymentRecords: PaymentRecord[] = [
  { id: 'p1', receiptNo: 'RCP-2026-04521', date: '2026-05-28', instalment: 'Instalment 1 - Tuition', amount: 25000, mode: 'Online', status: 'successful' },
  { id: 'p2', receiptNo: 'RCP-2026-04893', date: '2026-06-25', instalment: 'Transport Fee - Term 1', amount: 8000, mode: 'Online', status: 'successful' },
  { id: 'p3', receiptNo: 'RCP-2026-05102', date: '2026-08-05', instalment: 'Instalment 2 - Tuition', amount: 15000, mode: 'Online', status: 'successful' },
  { id: 'p4', receiptNo: 'RCP-2026-05398', date: '2026-09-15', instalment: 'Instalment 2 - Tuition', amount: 10000, mode: 'Online', status: 'failed' },
];

export function generateAttendance(year: number, month: number): AttendanceDay[] {
  const days: AttendanceDay[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dayOfWeek = date.getDay();
    const isPast = date <= today;
    let status: AttendanceDay['status'] = 'present';
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      status = 'weekend';
    } else if (d === 15 && isPast) {
      status = 'holiday';
    } else if (d === 2 && isPast) {
      status = 'absent';
    } else if (d === 18 && isPast) {
      status = 'absent';
    } else if (!isPast) {
      status = 'weekend'; // future days render as neutral
    }
    days.push({ date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, status });
  }
  return days;
}

export const timetable: TimetablePeriod[] = [
  { period: 1, time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mrs. Meera Iyer' },
  { period: 2, time: '08:45 - 09:30', subject: 'English', teacher: 'Mr. Arjun Kapoor' },
  { period: 3, time: '09:30 - 10:15', subject: 'Science', teacher: 'Mrs. Deepika Nair' },
  { period: 0, time: '10:15 - 10:30', subject: 'Recess', teacher: '', isRecess: true },
  { period: 4, time: '10:30 - 11:15', subject: 'Social Studies', teacher: 'Mr. Vikram Singh' },
  { period: 5, time: '11:15 - 12:00', subject: 'Hindi', teacher: 'Mrs. Sunita Rao' },
  { period: 6, time: '12:00 - 12:45', subject: 'Computer Science', teacher: 'Mr. Karan Malhotra' },
  { period: 7, time: '12:45 - 01:30', subject: 'Physical Education', teacher: 'Mr. Rohit Desai' },
];

export const weeklyTimetable: Record<string, TimetablePeriod[]> = {
  Monday: timetable,
  Tuesday: [
    { period: 1, time: '08:00 - 08:45', subject: 'English', teacher: 'Mr. Arjun Kapoor' },
    { period: 2, time: '08:45 - 09:30', subject: 'Mathematics', teacher: 'Mrs. Meera Iyer' },
    { period: 3, time: '09:30 - 10:15', subject: 'Science', teacher: 'Mrs. Deepika Nair' },
    { period: 0, time: '10:15 - 10:30', subject: 'Recess', teacher: '', isRecess: true },
    { period: 4, time: '10:30 - 11:15', subject: 'Hindi', teacher: 'Mrs. Sunita Rao' },
    { period: 5, time: '11:15 - 12:00', subject: 'Social Studies', teacher: 'Mr. Vikram Singh' },
    { period: 6, time: '12:00 - 12:45', subject: 'Art', teacher: 'Mrs. Anjali Mehta' },
    { period: 7, time: '12:45 - 01:30', subject: 'Computer Science', teacher: 'Mr. Karan Malhotra' },
  ],
  Wednesday: timetable,
  Thursday: [
    { period: 1, time: '08:00 - 08:45', subject: 'Science', teacher: 'Mrs. Deepika Nair' },
    { period: 2, time: '08:45 - 09:30', subject: 'Mathematics', teacher: 'Mrs. Meera Iyer' },
    { period: 3, time: '09:30 - 10:15', subject: 'English', teacher: 'Mr. Arjun Kapoor' },
    { period: 0, time: '10:15 - 10:30', subject: 'Recess', teacher: '', isRecess: true },
    { period: 4, time: '10:30 - 11:15', subject: 'Computer Science', teacher: 'Mr. Karan Malhotra' },
    { period: 5, time: '11:15 - 12:00', subject: 'Social Studies', teacher: 'Mr. Vikram Singh' },
    { period: 6, time: '12:00 - 12:45', subject: 'Hindi', teacher: 'Mrs. Sunita Rao' },
    { period: 7, time: '12:45 - 01:30', subject: 'Music', teacher: 'Mr. Sanjay Gupta' },
  ],
  Friday: timetable,
  Saturday: [
    { period: 1, time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mrs. Meera Iyer' },
    { period: 2, time: '08:45 - 09:30', subject: 'Science', teacher: 'Mrs. Deepika Nair' },
    { period: 0, time: '09:30 - 09:45', subject: 'Recess', teacher: '', isRecess: true },
    { period: 3, time: '09:45 - 10:30', subject: 'Library', teacher: 'Mrs. Kavita Joshi' },
    { period: 4, time: '10:30 - 11:15', subject: 'Art', teacher: 'Mrs. Anjali Mehta' },
  ],
};

export const circulars: Circular[] = [
  { id: 'c1', number: 'CN-2026-00256', title: 'Annual Sports Day - Schedule Released', date: '2026-10-12', time: '09:00', category: 'Event', hasAttachment: true, excerpt: 'The Annual Sports Day will be held on October 25, 2026. Please find the detailed event schedule attached.' },
  { id: 'c2', number: 'CN-2026-00255', title: 'Diwali Break - School Holiday Notice', date: '2026-10-10', time: '14:30', category: 'Holiday', hasAttachment: false, excerpt: 'School will remain closed from October 28 to November 3, 2026, for the Diwali festival. Regular classes resume November 4.' },
  { id: 'c3', number: 'CN-2026-00254', title: 'PTM Schedule for First Term', date: '2026-10-08', time: '11:00', category: 'PTM', hasAttachment: true, excerpt: 'Parent-Teacher Meetings for the first term will be conducted on October 20, 2026, from 9:00 AM to 1:00 PM.' },
  { id: 'c4', number: 'CN-2026-00253', title: 'Updated Bus Route - Route 3 Change', date: '2026-10-05', time: '16:00', category: 'Transport', hasAttachment: false, excerpt: 'Route 3 morning pickup has been revised by 10 minutes. Please check the transport module for updated timings.' },
  { id: 'c5', number: 'CN-2026-00252', title: 'Mid-Term Examination - Datesheet Released', date: '2026-10-01', time: '10:00', category: 'Exam', hasAttachment: true, excerpt: 'The mid-term examination will commence from October 15, 2026. The complete datesheet is attached for your reference.' },
];

export const calendarEvents: CalendarEvent[] = [
  // --- APRIL 2026 ---
  {
    id: 'e-apr-1',
    date: '2026-04-01',
    title: 'New Academic Session 2026-27 Begins',
    type: 'event',
    time: '08:00 AM - 02:00 PM',
    location: 'Main School Campus',
    description: 'Welcome assembly for all standards. Distribution of academic planners, class timetables, and orientation on syllabus guidelines.',
    coordinator: 'Mrs. Deepika Nair',
  },
  {
    id: 'e-apr-2',
    date: '2026-04-03',
    title: 'Good Friday Holiday',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Gazetted holiday observing Good Friday. School administration and academic classes will remain closed.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-apr-3',
    date: '2026-04-14',
    title: 'Dr. B.R. Ambedkar Jayanti',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'National holiday in honor of Dr. B.R. Ambedkar. Administrative office closed.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-apr-4',
    date: '2026-04-20',
    title: 'Investiture Ceremony & Student Council',
    type: 'event',
    time: '09:00 AM - 12:30 PM',
    location: 'Main School Auditorium',
    description: 'Formal pinning of badges and oath-taking ceremony for the newly elected Head Boy, Head Girl, Sports Captain, and House Prefects.',
    coordinator: 'Mr. Arjun Kapoor',
  },
  {
    id: 'e-apr-5',
    date: '2026-04-25',
    title: 'Earth Day & Eco Club Plantation',
    type: 'event',
    time: '08:30 AM - 11:30 AM',
    location: 'Botanical Garden & Campus Grounds',
    description: 'Sapling plantation, zero-plastic awareness rally, and inter-class eco-poster competition organized by the Green Earth Club.',
    coordinator: 'Mrs. Sunita Rao',
  },

  // --- MAY 2026 ---
  {
    id: 'e-may-1',
    date: '2026-05-01',
    title: 'Maharashtra Day / Labour Day',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'State holiday celebrating Maharashtra Day and International Labour Day. School campus closed.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-may-2',
    date: '2026-05-04',
    title: 'Pre-Vacation Evaluation Tests',
    type: 'exam',
    time: '08:30 AM - 10:30 AM',
    location: 'Classrooms A-101 to A-205',
    description: 'Diagnostic assessments across foundational Mathematics, Science, and Languages before the summer recess.',
    coordinator: 'Mrs. Meera Iyer',
  },
  {
    id: 'e-may-3',
    date: '2026-05-08',
    title: 'Summer Vacation Commences',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Summer recess begins for all grades. Creative summer projects and reading lists are accessible on the Parent Portal.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-may-4',
    date: '2026-05-25',
    title: 'Buddha Purnima',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Public holiday on the auspicious occasion of Buddha Purnima.',
    coordinator: 'School Administration',
  },

  // --- JUNE 2026 ---
  {
    id: 'e-jun-1',
    date: '2026-06-05',
    title: 'World Environment Day Eco Session',
    type: 'event',
    time: '10:00 AM - 11:30 AM',
    location: 'Virtual Classroom / Auditorium',
    description: 'Interactive environmental awareness workshop and quiz on biodiversity conservation for enrolled students.',
    coordinator: 'Mrs. Sunita Rao',
  },
  {
    id: 'e-jun-2',
    date: '2026-06-12',
    title: 'School Reopens After Summer Break',
    type: 'event',
    time: '07:45 AM - 02:00 PM',
    location: 'Main School Campus',
    description: 'Classes resume with full attendance. Submission of summer holiday homework and commencement of Term 1 curriculum.',
    coordinator: 'Mrs. Deepika Nair',
  },
  {
    id: 'e-jun-3',
    date: '2026-06-17',
    title: 'Bakrid / Eid al-Adha',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Public holiday on the occasion of Eid al-Adha. Regular school operations suspended.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-jun-4',
    date: '2026-06-21',
    title: 'International Yoga Day Mass Session',
    type: 'event',
    time: '07:00 AM - 08:30 AM',
    location: 'Open Amphitheatre',
    description: 'Demonstration of Surya Namaskar, Pranayama, and mindfulness techniques led by certified yoga instructors. Parents invited.',
    coordinator: 'Mr. Vikram Singh',
  },
  {
    id: 'e-jun-5',
    date: '2026-06-27',
    title: 'Periodic Test 1 (Unit Test) Begins',
    type: 'exam',
    time: '08:00 AM - 09:30 AM',
    location: 'Designated Examination Rooms',
    description: 'First formal 25-mark periodic assessment for classes 5 to 10 covering chapters completed in April and June.',
    coordinator: 'Mrs. Meera Iyer',
  },

  // --- JULY 2026 ---
  {
    id: 'e-jul-1',
    date: '2026-07-07',
    title: 'Muharram Holiday',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Gazetted public holiday on Muharram. No school sessions or administrative operations.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-jul-2',
    date: '2026-07-15',
    title: 'Inter-House English Debate Championship',
    type: 'event',
    time: '10:00 AM - 01:00 PM',
    location: 'Secondary Wing Auditorium',
    description: 'Oxford-style parliamentary debate between Ganga, Yamuna, Kaveri, and Narmada houses on contemporary AI ethics in education.',
    coordinator: 'Mr. Arjun Kapoor',
  },
  {
    id: 'e-jul-3',
    date: '2026-07-20',
    title: 'Guru Purnima Special Assembly',
    type: 'event',
    time: '08:30 AM - 10:00 AM',
    location: 'Assembly Ground',
    description: 'Traditional cultural assembly paying tribute to mentors, classical Vedic recitations, and student felicitation of educators.',
    coordinator: 'Mrs. Sunita Rao',
  },
  {
    id: 'e-jul-4',
    date: '2026-07-25',
    title: 'PTM - Unit Test 1 Result Declaration',
    type: 'ptm',
    time: '08:30 AM - 12:30 PM',
    location: 'Individual Classrooms (Blocks A & B)',
    description: 'Mandatory parent-teacher interaction to review PT-1 answer sheets, foundational skill gaps, and remedial support schedules.',
    coordinator: 'Mrs. Meera Iyer',
  },

  // --- AUGUST 2026 ---
  {
    id: 'e-aug-1',
    date: '2026-08-04',
    title: 'Inter-House Science & Robotics Expo',
    type: 'event',
    time: '09:00 AM - 02:00 PM',
    location: 'STEM Innovation & Atal Tinkering Lab',
    description: 'Display of working IoT models, automated rovers, and renewable energy experiments built by students. Open for parent viewing.',
    coordinator: 'Mr. Karan Malhotra',
  },
  {
    id: 'e-aug-2',
    date: '2026-08-15',
    title: '79th Independence Day Celebration',
    type: 'event',
    time: '07:30 AM - 10:30 AM',
    location: 'Main Parade Ground',
    description: 'National Flag hoisting, March Past by NCC cadets, patriotic choir performances, and principal address. Attendance mandatory.',
    coordinator: 'Dr. K. Ramanathan',
  },
  {
    id: 'e-aug-3',
    date: '2026-08-16',
    title: 'Parsi New Year (Pateti)',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Regional holiday observing Parsi New Year. School campus closed.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-aug-4',
    date: '2026-08-28',
    title: 'Raksha Bandhan Holiday',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Festival celebration of brother-sister bond. No school activities.',
    coordinator: 'School Administration',
  },

  // --- SEPTEMBER 2026 ---
  {
    id: 'e-sep-1',
    date: '2026-09-04',
    title: 'Janmashtami / Dahi Handi Holiday',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Festival holiday celebrating Shri Krishna Janmashtami.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-sep-2',
    date: '2026-09-05',
    title: 'Teachers\' Day Celebrations',
    type: 'event',
    time: '08:30 AM - 12:30 PM',
    location: 'Main Auditorium',
    description: 'Senior students step into the role of teachers for the morning sessions, followed by a cultural gala dedicated to our faculty.',
    coordinator: 'Student Council',
  },
  {
    id: 'e-sep-3',
    date: '2026-09-14',
    title: 'Ganesh Chaturthi Holiday',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Festive holiday on the occasion of Ganesh Chaturthi.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-sep-4',
    date: '2026-09-19',
    title: 'Eid-e-Milad Holiday',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Gazetted public holiday on Eid-e-Milad.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-sep-5',
    date: '2026-09-24',
    title: 'Anant Chaturdashi / Ganesh Visarjan',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Official holiday for Ganesh Visarjan procession across Pune district.',
    coordinator: 'School Administration',
  },

  // --- OCTOBER 2026 (Current Academic Month) ---
  {
    id: 'e1',
    date: '2026-10-02',
    title: 'Mahatma Gandhi Jayanti Holiday',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'National holiday commemorating the birth anniversary of Father of the Nation Mahatma Gandhi and Lal Bahadur Shastri.',
    coordinator: 'School Administration',
  },
  {
    id: 'e2',
    date: '2026-10-15',
    title: 'Mid-Term Examination Begins',
    type: 'exam',
    time: '08:00 AM - 10:00 AM',
    location: 'Examination Hall (A-Block)',
    description: 'Mid-Term evaluations commence for all core subjects. Students must wear full uniform, carry admit cards, and report by 07:45 AM.',
    coordinator: 'Mrs. Meera Iyer',
  },
  {
    id: 'e3',
    date: '2026-10-20',
    title: 'Vijayadashami / Term 1 Parent-Teacher Meeting',
    type: 'ptm',
    time: '09:00 AM - 01:00 PM',
    location: 'Classroom 8-A (Second Floor)',
    description: 'Mandatory parent-teacher interaction to review mid-term exam performance, learning outcome progression, and student handbook.',
    coordinator: 'Mrs. Meera Iyer',
  },
  {
    id: 'e4',
    date: '2026-10-25',
    title: 'Annual Sports Day & Athletics Meet',
    type: 'event',
    time: '08:30 AM - 03:30 PM',
    location: 'School Athletics Ground',
    description: 'Annual inter-house athletic championships, track races, 4x100m relays, March Past ceremony, and trophy distribution. Parents invited.',
    coordinator: 'Mr. Arjun Kapoor',
  },
  {
    id: 'e5',
    date: '2026-10-28',
    title: 'Diwali Break Commences',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'School closes for Diwali celebrations and autumn vacation. Digital homework modules and reading assignments available in portal.',
    coordinator: 'School Administration',
  },
  {
    id: 'e6',
    date: '2026-10-31',
    title: 'Laxmi Pujan & Naraka Chaturdashi',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Diwali holiday celebrations. Wishing all families peace, health, and prosperity.',
    coordinator: 'School Administration',
  },

  // --- NOVEMBER 2026 ---
  {
    id: 'e-nov-1',
    date: '2026-11-01',
    title: 'Govardhan Puja & Diwali Holiday',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Diwali holiday continuation.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-nov-2',
    date: '2026-11-03',
    title: 'Diwali Break Ends · Classes Resume',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Conclusion of the Diwali vacation period. Regular classroom sessions and school buses resume tomorrow morning at 07:45 AM.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-nov-3',
    date: '2026-11-14',
    title: 'Children\'s Day Celebration & Fair',
    type: 'event',
    time: '09:00 AM - 01:00 PM',
    location: 'Main School Auditorium & Quadrangle',
    description: 'Special festival honoring Children\'s Day. Stage comedy by educators, food stalls, carnival rides, and surprise awards.',
    coordinator: 'Mrs. Sunita Rao',
  },
  {
    id: 'e-nov-4',
    date: '2026-11-20',
    title: 'Second Term Periodic Test (PT-2) Begins',
    type: 'exam',
    time: '08:00 AM - 10:00 AM',
    location: 'Examination Wing',
    description: 'Written assessments for second term curriculum commence. Detailed subject timetable published in Circular section.',
    coordinator: 'Mrs. Deepika Nair',
  },
  {
    id: 'e-nov-5',
    date: '2026-11-24',
    title: 'Guru Nanak Jayanti Holiday',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Gazetted public holiday on Guru Nanak Dev Ji\'s Prakash Gurpurab.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-nov-6',
    date: '2026-11-28',
    title: 'Inter-School Mathematics Olympiad',
    type: 'event',
    time: '09:30 AM - 12:30 PM',
    location: 'Senior Hall Block B',
    description: 'Regional mathematics aptitude and mental math challenge hosting delegates from 18 Pune CBSE schools.',
    coordinator: 'Mrs. Meera Iyer',
  },

  // --- DECEMBER 2026 ---
  {
    id: 'e-dec-1',
    date: '2026-12-10',
    title: 'Inter-House Cultural Fest & Art Exhibition',
    type: 'event',
    time: '09:00 AM - 02:00 PM',
    location: 'School Art Gallery & Amphitheatre',
    description: 'Fine arts display, classical vocal competitions, folk dance, and pottery exhibitions by middle and high school students.',
    coordinator: 'Mrs. Kavita Joshi',
  },
  {
    id: 'e-dec-2',
    date: '2026-12-18',
    title: 'Annual Day Musical Drama & Prize Gala',
    type: 'event',
    time: '05:00 PM - 08:30 PM',
    location: 'Grand Campus Amphitheatre',
    description: 'The premier school theatrical show featuring 400+ student performers, symphony orchestra, and annual academic excellence trophies.',
    coordinator: 'Dr. K. Ramanathan',
  },
  {
    id: 'e-dec-3',
    date: '2026-12-24',
    title: 'Winter Vacation Commences',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Winter break begins for all standards. Warm holiday wishes to our entire school community.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-dec-4',
    date: '2026-12-25',
    title: 'Christmas Day Holiday',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Gazetted holiday observing Christmas.',
    coordinator: 'School Administration',
  },

  // --- JANUARY 2027 ---
  {
    id: 'e-jan-1',
    date: '2027-01-01',
    title: 'New Year Day Holiday',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Happy New Year 2027! Campus closed.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-jan-2',
    date: '2027-01-04',
    title: 'School Reopens for Winter Term',
    type: 'event',
    time: '08:00 AM - 02:00 PM',
    location: 'Main School Campus',
    description: 'Classes resume after the winter break. Intensive revision syllabus commences for board and annual standards.',
    coordinator: 'Mrs. Deepika Nair',
  },
  {
    id: 'e-jan-3',
    date: '2027-01-14',
    title: 'Makar Sankranti / Pongal Holiday',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Harvest festival holiday celebrating Makar Sankranti and Pongal.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-jan-4',
    date: '2027-01-18',
    title: 'Pre-Board & Term 2 Pre-Final Exams Begin',
    type: 'exam',
    time: '08:00 AM - 11:00 AM',
    location: 'Main Examination Hall',
    description: 'Full-syllabus mock examinations mimicking board patterns for classes 8, 9, and 10.',
    coordinator: 'Mrs. Meera Iyer',
  },
  {
    id: 'e-jan-5',
    date: '2027-01-26',
    title: '78th Republic Day Parade & Flag Hoisting',
    type: 'event',
    time: '07:30 AM - 10:00 AM',
    location: 'Main School Grounds',
    description: 'Unfurling of the Tricolour, brass band march, patriotic skits, and distribution of brave heart awards. Parents cordially invited.',
    coordinator: 'Dr. K. Ramanathan',
  },
  {
    id: 'e-jan-6',
    date: '2027-01-30',
    title: 'Pre-Board Results & Parent Consultation PTM',
    type: 'ptm',
    time: '09:00 AM - 01:00 PM',
    location: 'Secondary Wing Block A',
    description: 'Individual parent consultation with subject educators regarding pre-board feedback, paper analysis, and final exam roadmap.',
    coordinator: 'Mrs. Deepika Nair',
  },

  // --- FEBRUARY 2027 ---
  {
    id: 'e-feb-1',
    date: '2027-02-11',
    title: 'Vasant Panchami & Saraswati Puja',
    type: 'event',
    time: '08:30 AM - 10:30 AM',
    location: 'School Foyer & Temple Courtyard',
    description: 'Traditional invocation to Goddess Saraswati with yellow floral offerings, classical veena recitals, and blessing of student pens & books.',
    coordinator: 'Mrs. Sunita Rao',
  },
  {
    id: 'e-feb-2',
    date: '2027-02-15',
    title: 'Inter-School Tech Carnival & Coding Hackathon',
    type: 'event',
    time: '09:00 AM - 04:00 PM',
    location: 'Advanced Computer Lab 1 & 2',
    description: '6-hour rapid coding hackathon in Python and Scratch for junior innovators, judged by software industry leaders.',
    coordinator: 'Mr. Karan Malhotra',
  },
  {
    id: 'e-feb-3',
    date: '2027-02-21',
    title: 'Maha Shivratri Holiday',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Public holiday observing Maha Shivratri.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-feb-4',
    date: '2027-02-24',
    title: 'Annual Science & Computer Practical Exams',
    type: 'exam',
    time: '08:30 AM - 01:30 PM',
    location: 'Physics, Chemistry, Biology & IT Labs',
    description: 'Internal and external laboratory practical assessments, viva voce, and certified project file verification.',
    coordinator: 'Mrs. Deepika Nair',
  },

  // --- MARCH 2027 ---
  {
    id: 'e-mar-1',
    date: '2027-03-03',
    title: 'Holi / Dhulivandan Holiday',
    type: 'holiday',
    time: 'All Day',
    location: 'Campus Closed',
    description: 'Festival of colors holiday. School operations closed.',
    coordinator: 'School Administration',
  },
  {
    id: 'e-mar-2',
    date: '2027-03-08',
    title: 'Final Annual Examinations (Session 2026-27)',
    type: 'exam',
    time: '08:00 AM - 11:00 AM',
    location: 'Examination Wing',
    description: 'Cumulative annual promotional examinations covering complete prescribed CBSE syllabus for academic advancement.',
    coordinator: 'Mrs. Meera Iyer',
  },
  {
    id: 'e-mar-3',
    date: '2027-03-20',
    title: 'Final Examination Conclusion',
    type: 'exam',
    time: '11:00 AM',
    location: 'Main School Campus',
    description: 'Completion of all theory assessment papers. Teachers begin central evaluation and report compilation.',
    coordinator: 'Mrs. Deepika Nair',
  },
  {
    id: 'e-mar-4',
    date: '2027-03-27',
    title: 'Annual Result Declaration & Graduation PTM',
    type: 'ptm',
    time: '08:30 AM - 02:00 PM',
    location: 'Main Auditorium & Classrooms',
    description: 'Distribution of official CBSE Report Cards, academic award citations, and promotion handover for session 2027-28.',
    coordinator: 'Mrs. Meera Iyer',
  },
  {
    id: 'e-mar-5',
    date: '2027-03-31',
    title: 'Academic Year 2026-27 Formal Conclusion',
    type: 'event',
    time: '10:00 AM - 01:00 PM',
    location: 'Administrative Office',
    description: 'Book distribution counters open for newly promoted classes and textbook collection.',
    coordinator: 'School Administration',
  },
];

export const examSchedule: ExamScheduleItem[] = [
  { id: 'ex1', subject: 'Mathematics', date: '2026-10-15', time: '08:00 - 10:00', duration: '2 hours', maxMarks: 80, room: 'A-101' },
  { id: 'ex2', subject: 'English', date: '2026-10-16', time: '08:00 - 10:00', duration: '2 hours', maxMarks: 80, room: 'A-101' },
  { id: 'ex3', subject: 'Science', date: '2026-10-17', time: '08:00 - 10:00', duration: '2 hours', maxMarks: 80, room: 'A-101' },
  { id: 'ex4', subject: 'Social Studies', date: '2026-10-18', time: '08:00 - 10:00', duration: '2 hours', maxMarks: 80, room: 'A-102' },
  { id: 'ex5', subject: 'Hindi', date: '2026-10-19', time: '08:00 - 10:00', duration: '2 hours', maxMarks: 80, room: 'A-102' },
];

export const examResults: ExamResult[] = [
  { id: 'er1', subject: 'Mathematics', maxMarks: 80, marks: 72, grade: 'A', remark: 'Excellent' },
  { id: 'er2', subject: 'English', maxMarks: 80, marks: 68, grade: 'A', remark: 'Very Good' },
  { id: 'er3', subject: 'Science', maxMarks: 80, marks: 75, grade: 'A', remark: 'Excellent' },
  { id: 'er4', subject: 'Social Studies', maxMarks: 80, marks: 61, grade: 'B', remark: 'Good' },
  { id: 'er5', subject: 'Hindi', maxMarks: 80, marks: 65, grade: 'A', remark: 'Very Good' },
];

export const subjects: Subject[] = [
  { id: 'sub1', name: 'Mathematics', teacher: 'Mrs. Meera Iyer', totalChapters: 14, completedChapters: 9 },
  { id: 'sub2', name: 'English', teacher: 'Mr. Arjun Kapoor', totalChapters: 12, completedChapters: 8 },
  { id: 'sub3', name: 'Science', teacher: 'Mrs. Deepika Nair', totalChapters: 16, completedChapters: 10 },
  { id: 'sub4', name: 'Social Studies', teacher: 'Mr. Vikram Singh', totalChapters: 10, completedChapters: 6 },
  { id: 'sub5', name: 'Hindi', teacher: 'Mrs. Sunita Rao', totalChapters: 11, completedChapters: 7 },
  { id: 'sub6', name: 'Computer Science', teacher: 'Mr. Karan Malhotra', totalChapters: 8, completedChapters: 5 },
];

export const learningOutcomes: LearningOutcome[] = [
  { id: 'lo1', subject: 'Mathematics', title: 'Linear Equations - Solving Real-World Problems', date: '2026-10-13', status: 'published', description: 'Students will be able to formulate and solve linear equations from word problems involving age, distance, and cost scenarios.' },
  { id: 'lo2', subject: 'Science', title: 'Photosynthesis - Understanding the Process', date: '2026-10-13', status: 'not-submitted', description: 'Students will demonstrate understanding of the photosynthesis process and its importance in the food chain.' },
  { id: 'lo3', subject: 'English', title: 'Essay Writing - Descriptive Paragraph', date: '2026-10-12', status: 'submitted', description: 'Students will write a 200-word descriptive paragraph about their favorite place using sensory details.' },
  { id: 'lo4', subject: 'Social Studies', title: 'Mughal Empire - Key Rulers and Contributions', date: '2026-10-11', status: 'submitted', description: 'Students will identify key Mughal rulers and describe their major contributions to art, architecture, and governance.' },
];

export const teacherUpdates: TeacherUpdate[] = [
  { id: 'tu1', subject: 'Mathematics', title: 'Practice Problems for Chapter 9', date: '2026-10-13', hasAttachment: true, content: 'Please solve problems 1-15 from Exercise 9.2. Focus on word problems involving simultaneous equations. Submit by Friday.' },
  { id: 'tu2', subject: 'Science', title: 'Lab Experiment - Leaf Stomata Observation', date: '2026-10-12', hasAttachment: false, content: 'Tomorrow we will conduct a lab experiment observing stomata under a microscope. Bring your lab notebooks.' },
  { id: 'tu3', subject: 'English', title: 'Reading Assignment - Chapter 5', date: '2026-10-10', hasAttachment: true, content: 'Read Chapter 5 from "The Blue Umbrella" by Ruskin Bond. We will discuss the key themes in the next class.' },
];

export const disciplineRecords: DisciplineRecord[] = [
  { id: 'd1', date: '2026-10-10', type: 'positive', remark: 'Helped a classmate with a difficult math problem during lunch break. Displayed excellent peer support.', recordedBy: 'Mrs. Meera Iyer' },
  { id: 'd2', date: '2026-09-28', type: 'positive', remark: 'Volunteered to organize the classroom library. Showed great initiative and responsibility.', recordedBy: 'Mr. Arjun Kapoor' },
  { id: 'd3', date: '2026-09-15', type: 'negative', remark: 'Was talking during an exam. Warned about maintaining silence during assessments.', recordedBy: 'Mrs. Deepika Nair' },
];

export const activityRecords: ActivityRecord[] = [
  { id: 'a1', title: 'Inter-School Cricket Tournament', type: 'Sports', date: '2026-09-20', result: 'Runner-Up' },
  { id: 'a2', title: 'Science Exhibition - Model on Solar Energy', type: 'Academic', date: '2026-08-15', result: 'First Prize' },
  { id: 'a3', title: 'Annual Day - Group Dance Performance', type: 'Cultural', date: '2026-07-30', result: 'Participated' },
  { id: 'a4', title: 'Quiz Competition - General Knowledge', type: 'Academic', date: '2026-07-12', result: 'Second Prize' },
];

export const observations: ObservationRecord[] = [
  { id: 'o1', tab: 'today', date: '2026-10-13', title: 'Active participation in class discussion', content: 'Aarav asked insightful questions about linear equations and helped peers understand the concept.', recordedBy: 'Mrs. Meera Iyer' },
  { id: 'o2', tab: 'subject', date: '2026-10-12', subject: 'Science', title: 'Good lab safety practices', content: 'Followed all lab safety protocols during the chemistry experiment. Set a good example for the class.', recordedBy: 'Mrs. Deepika Nair' },
  { id: 'o3', tab: 'activity', date: '2026-10-10', title: 'Excellent teamwork in sports', content: 'Showed great coordination and team spirit during the inter-house football match.', recordedBy: 'Mr. Rohit Desai' },
  { id: 'o4', tab: 'general', date: '2026-10-08', title: 'Improved punctuality', content: 'Has been arriving on time consistently for the past two weeks. Notable improvement.', recordedBy: 'Class Teacher' },
];

export const transportInfo: TransportInfo = {
  route: 'Route 3 - Kothrud to School',
  stop: 'Green Park Avenue',
  vehicleNo: 'MH-12 AB 3456',
  driverName: 'Suresh Patil',
  driverPhone: '+91 98220 11223',
  pickupTime: '07:15 AM',
  dropTime: '03:45 PM',
  fee: 16000,
  latitude: 18.5074,
  longitude: 73.8077,
};

export const gatePasses: GatePass[] = [
  { id: 'g1', visitorName: 'Priya Sharma (Mother)', date: '2026-10-14', time: '11:30', reason: 'Doctor appointment', status: 'approved' },
  { id: 'g2', visitorName: 'Ramesh Uncle', date: '2026-09-28', time: '12:00', reason: 'Family function pickup', status: 'approved' },
  { id: 'g3', visitorName: 'Priya Sharma (Mother)', date: '2026-09-15', time: '01:00', reason: 'Not feeling well', status: 'approved' },
];

export const appointments: Appointment[] = [
  { id: 'ap1', withWhom: 'Mrs. Meera Iyer (Mathematics)', date: '2026-10-20', time: '09:30', type: 'PTM', status: 'approved' },
  { id: 'ap2', withWhom: 'School Office - Principal', date: '2026-11-05', time: '11:00', type: 'Office', status: 'pending' },
  { id: 'ap3', withWhom: 'Mr. Arjun Kapoor (English)', date: '2026-09-18', time: '10:00', type: 'PTM', status: 'completed' },
];

export const certificateRequests: CertificateRequest[] = [
  { id: 'cr1', type: 'bonafide', date: '2026-09-20', reason: 'Required for passport application', status: 'issued' },
  { id: 'cr2', type: 'bonafide', date: '2026-07-10', reason: 'Required for bank account opening', status: 'issued' },
];

export const infirmaryVisits: InfirmaryVisit[] = [
  { id: 'iv1', date: '2026-10-05', timeIn: '10:30', timeOut: '11:15', complaint: 'Headache and mild fever', treatment: 'Given paracetamol. Rest for 45 minutes in infirmary.', remarks: 'Temperature was 99.8F. Advised to hydrate well.', status: 'treated' },
  { id: 'iv2', date: '2026-08-22', timeIn: '12:00', timeOut: '01:30', complaint: 'Pain in right ankle from sports injury', treatment: 'Applied cold compress. Bandaged the ankle.', remarks: 'Advised to avoid running for 2 days. Referred to physiotherapist if pain persists.', status: 'treated' },
];

export const ptms: PTM[] = [
  { id: 'pt1', date: '2026-10-20', time: '09:30', type: 'one-time', teacher: 'Mrs. Meera Iyer', status: 'scheduled' },
  { id: 'pt2', date: '2026-10-20', time: '10:00', type: 'one-time', teacher: 'Mr. Arjun Kapoor', status: 'scheduled' },
  { id: 'pt3', date: '2026-09-18', time: '10:00', type: 'one-time', teacher: 'Mrs. Deepika Nair', status: 'completed' },
];

export const confirmationRequests: ConfirmationRequest[] = [
  { id: 'cf1', title: 'Annual Sports Day - Participation Consent', date: '2026-10-12', description: 'I hereby consent to my child participating in the Annual Sports Day events on October 25, 2026.', status: 'submitted' },
  { id: 'cf2', title: 'Educational Field Trip - Science Museum', date: '2026-10-08', description: 'I consent to my child attending the educational field trip to the Science Museum on November 8, 2026. Transport and lunch will be provided by the school.', status: 'pending' },
];

export const notifications: NotificationItem[] = [
  { id: 'n1', type: 'circular', title: 'New Circular: Annual Sports Day', message: 'Schedule for Annual Sports Day has been published.', time: '2 hours ago', read: false },
  { id: 'n2', type: 'fee', title: 'Fee Reminder: Transport Fee Overdue', message: 'Transport Fee - Term 2 is overdue. Please pay before October 31.', time: '5 hours ago', read: false },
  { id: 'n3', type: 'attendance', title: 'Attendance Alert', message: 'Your child was marked absent on October 18, 2026.', time: '1 day ago', read: false },
  { id: 'n4', type: 'approval', title: 'Gate Pass Approved', message: 'Your gate pass request for October 14 has been approved.', time: '1 day ago', read: true },
  { id: 'n5', type: 'event', title: 'Upcoming Event: PTM on October 20', message: 'Parent-Teacher Meeting is scheduled for October 20, 2026.', time: '2 days ago', read: true },
];

export const faqs: FAQ[] = [
  { id: 'q1', question: 'How do I pay fees online?', answer: 'Navigate to the Fees module from your dashboard, select the pending instalment, and click "Pay Now" to proceed with the online payment gateway.' },
  { id: 'q2', question: 'How can I request a gate pass for early pickup?', answer: 'Go to Helpdesk > Student Pickup / Gate Pass, fill in the visitor details, date, time, and reason. You will receive a notification once the request is approved.' },
  { id: 'q3', question: 'How do I book an appointment with a teacher?', answer: 'Visit Helpdesk > Book Appointment, select the teacher or office, choose an available slot, and submit your request.' },
  { id: 'q4', question: 'How do I apply for a bonafide or leaving certificate?', answer: 'Go to Helpdesk > Apply for Certificate, select the certificate type, provide the reason, and submit. You will be notified when the certificate is ready for download.' },
  { id: 'q5', question: 'How do I track my child\'s bus in real-time?', answer: 'Navigate to the Transport module from the dashboard. If your child is enrolled in transport, you will see the live bus tracking map along with route and driver details.' },
  { id: 'q6', question: 'How do I switch between my children?', answer: 'Use the child switcher at the top of the dashboard to select which child\'s information you want to view. All modules will update to show the selected child\'s data.' },
];

export const schoolInfo = {
  name: 'Greenwood International School',
  tagline: 'Nurturing Minds, Building Futures',
  address: '123 Education Lane, Kothrud, Pune, Maharashtra 411038',
  phone: '+91 98745 63210',
  email: 'sadvidhya@gmail.com',
  estd: '1998',
  affiliation: 'CBSE Affiliated (Affiliation No. 1130421)',
};

export const teacherAvatars: Record<string, string> = {
  'Mrs. Meera Iyer': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
  'Mr. Arjun Kapoor': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  'Mrs. Deepika Nair': 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=120&auto=format&fit=crop&q=80',
  'Mr. Vikram Singh': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  'Mrs. Sunita Rao': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
  'Mr. Karan Malhotra': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
  'Mr. Rohit Desai': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
  'Mrs. Anjali Mehta': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  'Mrs. Kavita Joshi': 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=120&auto=format&fit=crop&q=80',
  'Mr. Sanjay Gupta': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
  'Mrs. Sunita Sharma': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80',
  'Dr. K. Ramanathan': 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
  'Ms. Alvira Pinto': 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=120&auto=format&fit=crop&q=80',
  'Mr. Rajesh Kumar': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
};

export function getTeacherAvatar(teacherName: string): string {
  if (teacherAvatars[teacherName]) return teacherAvatars[teacherName];
  const fallbacks = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  ];
  let sum = 0;
  for (let i = 0; i < teacherName.length; i++) {
    sum += teacherName.charCodeAt(i);
  }
  return fallbacks[sum % fallbacks.length];
}

