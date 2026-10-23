export type Role = 'public' | 'superadmin' | 'admin' | 'parent' | 'teacher' | 'accountant' | 'transport' | 'nurse';

export interface NavItem {
  label: string;
  key: string;
  icon: string;
  badge?: number;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  grNumber: string;
  rollNumber: string;
  class: string;
  section: string;
  dob: string;
  photo: string;
  bloodGroup: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  phone: string;
  email: string;
  address: string;
  admittedOn: string;
}

export interface FeeInstalment {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  paid: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
}

export interface PaymentRecord {
  id: string;
  receiptNo: string;
  date: string;
  instalment: string;
  amount: number;
  mode: 'Online' | 'Cash' | 'Cheque' | 'DD' | 'Bank Transfer';
  status: 'successful' | 'pending' | 'failed';
}

export interface AttendanceDay {
  date: string;
  status: 'present' | 'absent' | 'holiday' | 'weekend' | 'leave';
}

export interface TimetablePeriod {
  period: number;
  time: string;
  subject: string;
  teacher: string;
  isRecess?: boolean;
}

export interface Circular {
  id: string;
  number: string;
  title: string;
  date: string;
  time: string;
  category: string;
  hasAttachment: boolean;
  excerpt: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'holiday' | 'event' | 'exam' | 'ptm';
  description?: string;
  time?: string;
  location?: string;
  coordinator?: string;
}

export interface ExamScheduleItem {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  maxMarks: number;
  room: string;
}

export interface ExamResult {
  id: string;
  subject: string;
  maxMarks: number;
  marks: number;
  grade: string;
  remark: string;
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  totalChapters: number;
  completedChapters: number;
}

export interface LearningOutcome {
  id: string;
  subject: string;
  title: string;
  date: string;
  status: 'submitted' | 'not-submitted' | 'published';
  description: string;
}

export interface TeacherUpdate {
  id: string;
  subject: string;
  title: string;
  date: string;
  hasAttachment: boolean;
  content: string;
}

export interface DisciplineRecord {
  id: string;
  date: string;
  type: 'positive' | 'negative';
  remark: string;
  recordedBy: string;
}

export interface ActivityRecord {
  id: string;
  title: string;
  type: string;
  date: string;
  result: string;
}

export interface ObservationRecord {
  id: string;
  tab: 'today' | 'subject' | 'activity' | 'general';
  date: string;
  subject?: string;
  title: string;
  content: string;
  recordedBy: string;
}

export interface TransportInfo {
  route: string;
  stop: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  pickupTime: string;
  dropTime: string;
  fee: number;
  latitude: number;
  longitude: number;
}

export interface GatePass {
  id: string;
  visitorName: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Appointment {
  id: string;
  withWhom: string;
  date: string;
  time: string;
  type: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled' | 'rescheduled';
}

export interface CertificateRequest {
  id: string;
  type: 'bonafide' | 'leaving';
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'issued' | 'rejected';
}

export interface InfirmaryVisit {
  id: string;
  date: string;
  timeIn: string;
  timeOut: string;
  complaint: string;
  treatment: string;
  remarks: string;
  status: 'treated' | 'sent-home' | 'referred';
}

export interface PTM {
  id: string;
  date: string;
  time: string;
  type: 'one-time' | 'recurring';
  teacher: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface ConfirmationRequest {
  id: string;
  title: string;
  date: string;
  description: string;
  status: 'pending' | 'submitted';
}

export interface NotificationItem {
  id: string;
  type: 'circular' | 'fee' | 'attendance' | 'approval' | 'event';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}
