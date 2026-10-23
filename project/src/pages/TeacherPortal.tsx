import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { PageHeader, PillTabs, StatusBadge, Badge, Button, ProgressBar, Modal, Input, Select, Textarea, Checkbox, TeacherAvatar } from '@/components/ui';
import { circulars, subjects, weeklyTimetable, calendarEvents } from '@/data';
import type { TimetablePeriod } from '@/types';

interface TeacherPortalProps {
  activeKey: string;
}

export function TeacherPortal({ activeKey }: TeacherPortalProps) {
  switch (activeKey) {
    case 'teacher-dashboard': return <TeacherDashboard />;
    case 'teacher-profile': return <TeacherProfile />;
    case 'teacher-attendance': return <TeacherAttendance />;
    case 'teacher-timetable': return <TeacherTimetable />;
    case 'teacher-syllabus': return <TeacherSyllabus />;
    case 'teacher-exam-marks': return <ExamMarksEntry />;
    case 'teacher-outcomes': return <LearningOutcomes />;
    case 'teacher-updates': return <TeacherUpdates />;
    case 'teacher-assessment': return <SelfAssessment />;
    case 'teacher-observations': return <TeacherObservations />;
    case 'teacher-discipline': return <TeacherDiscipline />;
    case 'teacher-activities': return <SportsActivities />;
    case 'teacher-ptm': return <TeacherPTM />;
    case 'teacher-appointments': return <TeacherAppointments />;
    case 'teacher-circulars': return <TeacherCirculars />;
    case 'teacher-class-notifications': return <ClassNotifications />;
    case 'teacher-class-reports': return <ClassReports />;
    default: return <TeacherDashboard />;
  }
}


function TeacherDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-card-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <TeacherAvatar name="Meera Iyer" size="lg" className="w-14 h-14 border border-[#E2E8F0] shadow-xs" />
          <div>
            <h1 className="text-[22px] font-bold text-[#0F172A]">Good morning, Mrs. Meera Iyer!</h1>
            <p className="text-[14px] text-[#64748B] mt-0.5">Monday, October 13, 2026 · Class Teacher (8-A) · You have 5 classes today</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-[12px] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            On Duty · Active Term
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Classes Today', value: '5', icon: 'Clock', bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]' },
          { label: 'Pending Attendance', value: '2', icon: 'CalendarCheck', bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]' },
          { label: 'Pending LO Reviews', value: '8', icon: 'Lightbulb', bg: 'bg-[#FAF5FF]', text: 'text-[#7E22CE]' },
          { label: 'Upcoming PTMs', value: '3', icon: 'Users', bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]' },
        ].map((s, i) => (
          <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-[#64748B]">{s.label}</span>
              <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.text} flex items-center justify-center`}>
                <Icon name={s.icon as any} size={16} />
              </div>
            </div>
            <p className="text-[24px] font-bold text-[#0F172A]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Schedule */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F5F9]">
            <div>
              <h2 className="text-[16px] font-bold text-[#0F172A]">Today's Schedule</h2>
              <p className="text-[12px] text-[#64748B]">Monday, October 13, 2026</p>
            </div>
            <span className="text-[12px] font-medium text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] px-2.5 py-1 rounded-lg">5 Periods</span>
          </div>
          <div className="space-y-2.5">
            {weeklyTimetable.Monday?.filter(p => !p.isRecess).map(p => (
              <div key={p.period} className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] hover:border-[#CBD5E1] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#7C612A] flex items-center justify-center shrink-0 font-bold text-[14px] shadow-2xs">
                  {p.period}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#0F172A]">{p.subject}</p>
                  <p className="text-[12px] text-[#64748B]">Class 8-A · Room 204</p>
                </div>
                <span className="text-[12px] text-[#475569] font-medium shrink-0 bg-[#FFFFFF] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                  {p.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Classes */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
          <div className="pb-4 mb-4 border-b border-[#F1F5F9]">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Assigned Classes</h2>
            <p className="text-[12px] text-[#64748B]">Academic Year 2026-27</p>
          </div>
          <div className="space-y-2.5">
            {[
              { cls: '8-A', role: 'Class Teacher', subject: 'Mathematics', status: 'Pending Attendance' },
              { cls: '8-B', role: 'Subject Teacher', subject: 'Mathematics', status: 'Done' },
              { cls: '7-A', role: 'Subject Teacher', subject: 'Mathematics', status: 'Done' },
            ].map(c => (
              <div key={c.cls} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
                <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0 font-bold text-[14px]">
                  {c.cls}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#0F172A]">Class {c.cls}</p>
                  <p className="text-[12px] text-[#64748B]">{c.subject} · {c.role}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${c.status.includes('Pending')
                    ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                    : 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                  }`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming PTMs */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F5F9]">
          <div>
            <h2 className="text-[16px] font-bold text-[#0F172A]">Upcoming PTMs</h2>
            <p className="text-[12px] text-[#64748B]">Scheduled one-on-one parent discussions</p>
          </div>
          <span className="text-[12px] font-semibold text-[#7C612A]">3 Appointments</span>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { date: 'Oct 20', time: '09:30 AM', parent: 'Rajesh Sharma', student: 'Aarav Sharma', class: '8-A' },
            { date: 'Oct 20', time: '10:00 AM', parent: 'Hardik Patel', student: 'Diya Patel', class: '8-A' },
            { date: 'Oct 20', time: '10:30 AM', parent: 'Amit Verma', student: 'Ishaan Verma', class: '8-A' },
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] hover:border-[#CBD5E1] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#7C612A] flex flex-col items-center justify-center shrink-0 shadow-2xs">
                <span className="text-[14px] font-bold leading-none">{p.date.split(' ')[1]}</span>
                <span className="text-[10px] font-semibold text-[#64748B] uppercase mt-0.5">{p.date.split(' ')[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#0F172A] truncate">{p.parent}</p>
                <p className="text-[12px] text-[#64748B] truncate">{p.student} ({p.class})</p>
                <p className="text-[12px] font-medium text-[#7C612A] mt-0.5">{p.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeacherProfile() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" breadcrumbs={['Teacher', 'My Profile']} />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-card-soft">
          <div className="flex flex-col items-center text-center">
            <TeacherAvatar name="Meera Iyer" size="lg" className="w-24 h-24 border-2 border-[#E2E8F0] shadow-sm mb-3" />
            <h3 className="text-[18px] font-bold text-[#0F172A]">Mrs. Meera Iyer</h3>
            <p className="text-[14px] text-[#64748B] mt-0.5">Senior Mathematics Teacher</p>
            <div className="mt-2.5">
              <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                Class Teacher: 8-A
              </span>
            </div>
          </div>
          <div className="mt-6 space-y-3 pt-5 border-t border-[#F1F5F9] text-[14px]">
            <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
              <span className="text-[#64748B]">Employee ID</span>
              <span className="font-semibold text-[#0F172A] font-mono">EMP-2019-0042</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
              <span className="text-[#64748B]">Phone</span>
              <span className="font-semibold text-[#0F172A]">+91 98220 55667</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
              <span className="text-[#64748B]">Email</span>
              <span className="font-semibold text-[#0F172A]">meera@greenwood.edu</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#64748B]">Department</span>
              <span className="font-semibold text-[#0F172A]">Secondary Science & Math</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-card-soft">
          <h2 className="text-[16px] font-bold text-[#0F172A] mb-1">Assigned Classes & Subjects</h2>
          <p className="text-[14px] text-[#64748B] mb-5">Current teaching workload and assigned divisions</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2.5">Classes</p>
              <div className="flex flex-wrap gap-2">
                {['8-A (Class Teacher)', '8-B', '7-A'].map(c => (
                  <span key={c} className="px-3 py-1 rounded-lg text-[12px] font-medium bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A] shadow-2xs">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2.5">Subjects</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-lg text-[12px] font-medium bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A]">
                  Mathematics
                </span>
                <span className="px-3 py-1 rounded-lg text-[12px] font-medium bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A]">
                  Applied Mathematics
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#F1F5F9] flex items-center justify-between">
            <div className="text-[12px] text-[#64748B]">Security credentials last changed on Sep 14, 2026</div>
            <button className="px-3.5 py-2 rounded-xl text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5 shadow-2xs">
              <Icon name="KeyRound" size={14} className="text-[#64748B]" />
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const studentList = [
  { roll: 1, name: 'Aarav Sharma', status: 'present' as const },
  { roll: 2, name: 'Diya Patel', status: 'present' as const },
  { roll: 3, name: 'Ishaan Verma', status: 'present' as const },
  { roll: 4, name: 'Saanvi Reddy', status: 'absent' as const },
  { roll: 5, name: 'Arjun Nair', status: 'present' as const },
  { roll: 6, name: 'Ananya Gupta', status: 'present' as const },
  { roll: 7, name: 'Vihaan Joshi', status: 'leave' as const },
  { roll: 8, name: 'Myra Singh', status: 'present' as const },
];

function TeacherAttendance() {
  const [attendance, setAttendance] = useState(studentList);
  const [selectedClass, setSelectedClass] = useState('8-A');

  const toggle = (roll: number, status: 'present' | 'absent' | 'leave') => {
    setAttendance(a => a.map(s => s.roll === roll ? { ...s, status } : s));
  };

  const bulkPresent = () => setAttendance(a => a.map(s => ({ ...s, status: 'present' as const })));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Entry"
        breadcrumbs={['Teacher', 'Attendance']}
        action={
          <div className="flex items-center gap-2.5">
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] font-medium focus:outline-none focus:border-[#7C612A]"
            >
              <option value="8-A">Class 8-A</option>
              <option value="8-B">Class 8-B</option>
              <option value="7-A">Class 7-A</option>
            </select>
            <button
              onClick={bulkPresent}
              className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Icon name="Check" size={15} /> Mark All Present
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Present', val: attendance.filter(a => a.status === 'present').length, bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]', border: 'border-[#BBF7D0]' },
          { label: 'Absent', val: attendance.filter(a => a.status === 'absent').length, bg: 'bg-[#FFF1F2]', text: 'text-[#BE123C]', border: 'border-[#FECDD3]' },
          { label: 'On Leave', val: attendance.filter(a => a.status === 'leave').length, bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', border: 'border-[#FDE68A]' },
        ].map((s, i) => (
          <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 shadow-card-soft flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-[#64748B]">{s.label}</p>
              <p className="text-[22px] font-bold text-[#0F172A] mt-0.5">{s.val}</p>
            </div>
            <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.text} border ${s.border} flex items-center justify-center font-bold text-[14px]`}>
              {s.val}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[16px] text-[#0F172A]">Roll Call · Class {selectedClass}</h3>
            <p className="text-[12px] text-[#64748B]">Date: Monday, October 13, 2026</p>
          </div>
          <span className="text-[12px] font-medium text-[#64748B] bg-[#FFFFFF] border border-[#E2E8F0] px-3 py-1 rounded-lg">
            {attendance.length} Students
          </span>
        </div>

        <div className="divide-y divide-[#F1F5F9]">
          {attendance.map(s => (
            <div key={s.roll} className="flex items-center gap-3.5 px-5 py-3 hover:bg-[#F8FAFC] transition-colors">
              <span className="text-[14px] font-mono text-[#64748B] w-8">#{String(s.roll).padStart(2, '0')}</span>
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] font-semibold text-[12px] flex items-center justify-center shrink-0">
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-[14px] font-semibold text-[#0F172A] flex-1">{s.name}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => toggle(s.roll, 'present')}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${s.status === 'present'
                      ? 'bg-[#15803D] text-[#FFFFFF] shadow-2xs'
                      : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]'
                    }`}
                >
                  <Icon name="Check" size={13} className="inline mr-1" /> Present
                </button>
                <button
                  type="button"
                  onClick={() => toggle(s.roll, 'absent')}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${s.status === 'absent'
                      ? 'bg-[#BE123C] text-[#FFFFFF] shadow-2xs'
                      : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]'
                    }`}
                >
                  <Icon name="X" size={13} className="inline mr-1" /> Absent
                </button>
                <button
                  type="button"
                  onClick={() => toggle(s.roll, 'leave')}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${s.status === 'leave'
                      ? 'bg-[#B45309] text-[#FFFFFF] shadow-2xs'
                      : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]'
                    }`}
                >
                  Leave
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <p className="text-[12px] text-[#64748B]">Auto-synced with school attendance register</p>
          <div className="flex gap-2.5">
            <button className="px-4 py-2 rounded-xl text-[14px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9]">
              Cancel
            </button>
            <button className="px-4 py-2 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
              <Icon name="Save" size={15} /> Save Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherTimetable() {
  const [view, setView] = useState<'daily' | 'weekly'>('daily');
  const [day, setDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      <PageHeader title="My Time Table" breadcrumbs={['Teacher', 'Time Table']} />

      <div className="flex items-center gap-2">
        <button
          onClick={() => setView('daily')}
          className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors ${view === 'daily'
              ? 'bg-[#7C612A] text-[#FFFFFF] shadow-2xs'
              : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
        >
          Daily View
        </button>
        <button
          onClick={() => setView('weekly')}
          className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors ${view === 'weekly'
              ? 'bg-[#7C612A] text-[#FFFFFF] shadow-2xs'
              : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
        >
          Weekly Overview
        </button>
      </div>

      {view === 'daily' && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {days.map(d => (
            <button
              key={d}
              onClick={() => setDay(d)}
              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-medium whitespace-nowrap transition-colors ${day === d
                  ? 'bg-[#17153A] text-[#FFFFFF]'
                  : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="px-5 py-3.5 text-center w-20">Period</th>
                <th className="px-5 py-3.5">Time Interval</th>
                <th className="px-5 py-3.5">Subject</th>
                <th className="px-5 py-3.5">{view === 'weekly' ? 'Day' : 'Class / Room'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
              {(view === 'daily' ? (weeklyTimetable[day] || weeklyTimetable.Monday) : Object.entries(weeklyTimetable).flatMap(([d, periods]) => periods.map(p => ({ ...p, day: d })))).map((p: TimetablePeriod & { day?: string }, i) => (
                <tr key={i} className={p.isRecess ? 'bg-[#FFFBEB]/40' : 'hover:bg-[#F8FAFC] transition-colors'}>
                  <td className="px-5 py-3.5 text-center font-bold text-[#0F172A]">
                    {p.isRecess ? <Icon name="Coffee" size={16} className="text-[#B45309] mx-auto" /> : p.period}
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{p.time}</td>
                  <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{p.subject}</td>
                  <td className="px-5 py-3.5 text-[#475569]">
                    {view === 'weekly' ? p.day : 'Class 8-A · Room 204'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TeacherSyllabus() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Syllabus Tracking"
        breadcrumbs={['Teacher', 'Syllabus Tracking']}
        action={
          <button className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
            <Icon name="Plus" size={15} /> Add Chapter
          </button>
        }
      />

      <div className="space-y-4">
        {subjects.filter(s => s.name === 'Mathematics').map(s => (
          <div key={s.id} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-card-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-3">
                <TeacherAvatar name="Meera Iyer" size="sm" className="w-9 h-9 border border-[#E2E8F0]" />
                <div>
                  <h3 className="text-[16px] font-bold text-[#0F172A]">{s.name} · Class 8</h3>
                  <p className="text-[12px] text-[#64748B]">Assigned to: {s.teacher}</p>
                </div>
              </div>
              <span className="text-[12px] font-semibold text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] px-3 py-1 rounded-full w-fit">
                9 of 14 Chapters Completed
              </span>
            </div>

            <div className="space-y-2 mb-5">
              {['Rational Numbers', 'Linear Equations', 'Quadrilaterals', 'Data Handling', 'Squares & Square Roots', 'Cubes & Cube Roots', 'Comparing Quantities', 'Algebraic Expressions', 'Mensuration', 'Exponents & Powers', 'Direct & Inverse Proportions', 'Factorisation', 'Introduction to Graphs', 'Playing with Numbers'].map((ch, i) => (
                <div key={ch} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] hover:border-[#CBD5E1] transition-colors">
                  <span className="text-[12px] font-mono text-[#64748B] w-10">Ch {i + 1}</span>
                  <span className="text-[14px] font-medium text-[#0F172A] flex-1">{ch}</span>
                  <Checkbox label="" checked={i < 9} onChange={() => { }} />
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${i < 9
                      ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                      : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                    }`}>
                    {i < 9 ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#F1F5F9]">
              <div className="flex justify-between text-[12px] font-medium text-[#64748B] mb-2">
                <span>Curriculum Progress</span>
                <span className="font-bold text-[#0F172A]">{Math.round((9 / 14) * 100)}%</span>
              </div>
              <ProgressBar value={9} max={14} color="primary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExamMarksEntry() {
  const [marks, setMarks] = useState<Record<number, string>>({});
  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Marks Entry"
        breadcrumbs={['Teacher', 'Exam Marks Entry']}
        action={
          <div className="flex items-center gap-2">
            <select className="h-10 px-3 text-[14px] rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] focus:outline-none focus:border-[#7C612A]">
              <option value="midterm">Mid-Term Exam</option>
              <option value="unit1">Unit Test 1</option>
            </select>
            <select className="h-10 px-3 text-[14px] rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] focus:outline-none focus:border-[#7C612A]">
              <option value="8a">Class 8-A</option>
              <option value="8b">Class 8-B</option>
            </select>
          </div>
        }
      />

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[16px] text-[#0F172A]">Mathematics · Mid-Term Exam</h3>
            <p className="text-[12px] text-[#64748B]">Maximum Marks: 80 · Class 8-A</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
            Not Submitted
          </span>
        </div>

        <div className="divide-y divide-[#F1F5F9]">
          {studentList.map(s => (
            <div key={s.roll} className="flex items-center gap-3 px-5 py-3 hover:bg-[#F8FAFC] transition-colors">
              <span className="text-[14px] font-mono text-[#64748B] w-8">#{s.roll}</span>
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] font-semibold text-[12px] flex items-center justify-center shrink-0">
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-[14px] font-semibold text-[#0F172A] flex-1">{s.name}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={80}
                  placeholder="0"
                  value={marks[s.roll] || ''}
                  onChange={e => setMarks(m => ({ ...m, [s.roll]: e.target.value }))}
                  className="w-16 h-9 px-2 text-[14px] rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-center font-bold text-[#0F172A] outline-none focus:border-[#7C612A]"
                />
                <span className="text-[12px] text-[#64748B] font-mono">/ 80</span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2.5">
          <button className="px-4 py-2 rounded-xl text-[14px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9]">
            Save Draft
          </button>
          <button className="px-4 py-2 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
            <Icon name="Send" size={15} /> Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
}

function LearningOutcomes() {
  const [tab, setTab] = useState('create');
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Learning Outcomes" breadcrumbs={['Teacher', 'Learning Outcomes']} />

      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setTab('create')}
            className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors ${tab === 'create'
                ? 'bg-[#7C612A] text-[#FFFFFF]'
                : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
              }`}
          >
            Create & Publish
          </button>
          <button
            onClick={() => setTab('submissions')}
            className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors ${tab === 'submissions'
                ? 'bg-[#7C612A] text-[#FFFFFF]'
                : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
              }`}
          >
            Submissions
          </button>
        </div>
        {tab === 'create' && (
          <button
            onClick={() => setShowCreate(true)}
            className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Icon name="Plus" size={15} /> Create Outcome
          </button>
        )}
      </div>

      {tab === 'create' && (
        <div className="space-y-3">
          {[
            { title: 'Linear Equations - Solving Real-World Problems', subject: 'Mathematics', date: '2026-10-13', status: 'published', submitted: 32, total: 42 },
            { title: 'Quadrilaterals - Properties and Classification', subject: 'Mathematics', date: '2026-10-10', status: 'published', submitted: 38, total: 42 },
            { title: 'Mensuration - Surface Area Calculations', subject: 'Mathematics', date: '2026-10-15', status: 'draft', submitted: 0, total: 42 },
          ].map((lo, i) => (
            <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                      {lo.subject}
                    </span>
                    <span className="text-[12px] text-[#64748B] font-mono">{lo.date}</span>
                  </div>
                  <p className="font-bold text-[16px] text-[#0F172A]">{lo.title}</p>
                  {lo.status === 'published' && (
                    <div className="mt-3 max-w-xs">
                      <div className="flex justify-between text-[12px] text-[#64748B] mb-1">
                        <span>Student Submissions</span>
                        <span className="font-semibold text-[#0F172A]">{lo.submitted} / {lo.total}</span>
                      </div>
                      <ProgressBar value={lo.submitted} max={lo.total} color="success" size="sm" />
                    </div>
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[12px] font-semibold border ${lo.status === 'published'
                    ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                    : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                  }`}>
                  {lo.status}
                </span>
              </div>
            </div>
          ))}

          <Modal
            open={showCreate}
            onClose={() => setShowCreate(false)}
            title="Create Learning Outcome"
            footer={
              <>
                <Button variant="outline" onClick={() => setShowCreate(false)}>Save Draft</Button>
                <Button variant="primary" onClick={() => setShowCreate(false)} icon={<Icon name="Send" size={16} />}>Publish</Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input label="Title" required />
              <Select label="Subject" required options={[{ value: 'math', label: 'Mathematics' }]} />
              <Textarea label="Description" rows={4} required />
              <Select label="Target Class" required options={[{ value: '8a', label: 'Class 8-A' }, { value: '8b', label: 'Class 8-B' }]} />
            </div>
          </Modal>
        </div>
      )}

      {tab === 'submissions' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <h3 className="font-bold text-[16px] text-[#0F172A]">Student Submissions · Linear Equations</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="px-5 py-3.5 text-center w-16">Roll</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5">Submitted On</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
              {studentList.map((s, i) => (
                <tr key={s.roll} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5 text-center font-mono text-[#64748B]">#{s.roll}</td>
                  <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{s.name}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${i < 6
                        ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                        : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                      }`}>
                      {i < 6 ? 'Submitted' : 'Not Submitted'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{i < 6 ? '2026-10-13' : '—'}</td>
                  <td className="px-5 py-3.5 text-right">
                    {i < 6 && (
                      <button className="px-2.5 py-1 text-[12px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] rounded-lg hover:bg-[#F4EBD9]">
                        Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TeacherUpdates() {
  const [showCreate, setShowCreate] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher's Updates"
        breadcrumbs={['Teacher', "Teacher's Updates"]}
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Icon name="Plus" size={15} /> Create Update
          </button>
        }
      />

      <div className="space-y-3">
        {[
          { title: 'Practice Problems for Chapter 9', subject: 'Mathematics', date: '2026-10-13', attachment: true, content: 'Please solve problems 1-15 from Exercise 9.2. Focus on word problems involving simultaneous equations.' },
          { title: 'Reminder: Submit homework notebooks', subject: 'Mathematics', date: '2026-10-10', attachment: false, content: 'All students must submit their homework notebooks by Friday for checking.' },
          { title: 'Maths Quiz on Friday', subject: 'Mathematics', date: '2026-10-08', attachment: false, content: 'There will be a short quiz on Chapters 1-5 this Friday. Please revise thoroughly.' },
        ].map((u, i) => (
          <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                {u.subject}
              </span>
              <span className="text-[12px] text-[#64748B] font-mono">{u.date}</span>
              {u.attachment && <Icon name="Paperclip" size={13} className="text-[#64748B]" />}
            </div>
            <p className="font-bold text-[16px] text-[#0F172A]">{u.title}</p>
            <p className="text-[14px] text-[#475569] mt-1 leading-relaxed">{u.content}</p>
          </div>
        ))}
      </div>

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Update"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowCreate(false)} icon={<Icon name="Send" size={16} />}>Publish Update</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Title" required />
          <Select label="Subject" required options={[{ value: 'math', label: 'Mathematics' }]} />
          <Select label="Target Class" required options={[{ value: '8a', label: 'Class 8-A' }, { value: '8b', label: 'Class 8-B' }, { value: 'all', label: 'All Classes' }]} />
          <Textarea label="Content" rows={4} required />
          <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-4 text-center bg-[#F8FAFC]">
            <Icon name="Paperclip" size={20} className="text-[#94A3B8] mx-auto mb-1.5" />
            <p className="text-[14px] text-[#64748B]">Attach files (optional)</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SelfAssessment() {
  const [showCreate, setShowCreate] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Self Assessment"
        breadcrumbs={['Teacher', 'Self Assessment']}
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Icon name="Plus" size={15} /> Create Question Set
          </button>
        }
      />

      <div className="space-y-3">
        {[
          { title: 'Algebra Basics - Chapter 1-3', class: '8-A', questions: 10, submissions: 38, date: '2026-10-08' },
          { title: 'Geometry - Quadrilaterals', class: '8-A', questions: 8, submissions: 35, date: '2026-10-01' },
          { title: 'Number System Review', class: '8-B', questions: 12, submissions: 32, date: '2026-09-25' },
        ].map((a, i) => (
          <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-[16px] text-[#0F172A]">{a.title}</p>
              <div className="flex items-center gap-3 mt-1 text-[12px] text-[#64748B]">
                <span className="font-medium text-[#7C612A]">Class {a.class}</span>
                <span>•</span>
                <span>{a.questions} questions</span>
                <span>•</span>
                <span className="font-mono">{a.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[16px] font-bold text-[#0F172A]">{a.submissions}</p>
                <p className="text-[12px] text-[#64748B]">Submissions</p>
              </div>
              <button className="px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] hover:bg-[#F4EBD9] transition-colors flex items-center gap-1.5">
                <Icon name="BarChart3" size={14} /> View Results
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Assessment Question Set"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowCreate(false)}>Publish Assessment</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Assessment Title" required />
          <Select label="Target Class" required options={[{ value: '8a', label: 'Class 8-A' }, { value: '8b', label: 'Class 8-B' }]} />
          <Textarea label="Description" rows={2} />
          <p className="text-[14px] font-semibold text-[#0F172A]">Questions</p>
          <div className="space-y-3">
            {['Question 1', 'Question 2', 'Question 3'].map((q, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2.5">
                <Input label={q} placeholder="Enter question text" />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Option A" /><Input placeholder="Option B" />
                  <Input placeholder="Option C" /><Input placeholder="Option D" />
                </div>
                <Select label="Correct Answer" options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }, { value: 'c', label: 'Option C' }, { value: 'd', label: 'Option D' }]} />
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" icon={<Icon name="Plus" size={14} />}>Add Question</Button>
        </div>
      </Modal>
    </div>
  );
}

function TeacherObservations() {
  const [tab, setTab] = useState('subject');
  const [showRecord, setShowRecord] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Observations"
        breadcrumbs={['Teacher', 'Observations']}
        action={
          <button
            onClick={() => setShowRecord(true)}
            className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Icon name="Plus" size={15} /> Record Observation
          </button>
        }
      />

      <div className="flex gap-2">
        {['subject', 'activity', 'general'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-1.5 rounded-xl text-[12px] font-semibold capitalize transition-colors ${tab === t
                ? 'bg-[#7C612A] text-[#FFFFFF]'
                : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {[
          { student: 'Aarav Sharma', date: '2026-10-13', title: 'Active participation in class discussion', content: 'Asked insightful questions about linear equations and helped peers understand coordinate geometry.', type: 'subject' },
          { student: 'Diya Patel', date: '2026-10-12', title: 'Excellent problem-solving skills', content: 'Solved a complex multi-variable equation on the board without assistance.', type: 'subject' },
          { student: 'Ishaan Verma', date: '2026-10-10', title: 'Good teamwork in sports', content: 'Showed great coordination during inter-house football match and motivated team members.', type: 'activity' },
        ].filter(o => o.type === tab).map((o, i) => (
          <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] font-bold text-[14px] flex items-center justify-center shrink-0">
                {o.student.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[14px] font-bold text-[#0F172A]">{o.student}</p>
                  <span className="text-[12px] text-[#64748B] font-mono">{o.date}</span>
                </div>
                <p className="text-[14px] font-semibold text-[#334155]">{o.title}</p>
                <p className="text-[14px] text-[#64748B] mt-1 leading-relaxed">{o.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={showRecord}
        onClose={() => setShowRecord(false)}
        title="Record Observation"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowRecord(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowRecord(false)}>Save Observation</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select label="Student" required options={[{ value: '', label: 'Select student...' }, ...studentList.map(s => ({ value: String(s.roll), label: s.name }))]} />
          <Select label="Category" required options={[{ value: 'subject', label: 'Subject' }, { value: 'activity', label: 'Activity' }, { value: 'general', label: 'General' }]} />
          <Input label="Title" required />
          <Textarea label="Observation" rows={3} required />
          <Checkbox label="Make visible to parents" checked={true} onChange={() => { }} />
        </div>
      </Modal>
    </div>
  );
}

function TeacherDiscipline() {
  const [showRecord, setShowRecord] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Discipline Log"
        breadcrumbs={['Teacher', 'Discipline']}
        action={
          <button
            onClick={() => setShowRecord(true)}
            className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Icon name="Plus" size={15} /> Record Incident
          </button>
        }
      />

      <div className="space-y-3">
        {[
          { student: 'Aarav Sharma', date: '2026-10-10', type: 'positive', remark: 'Helped a classmate with a difficult math problem during lunch break.' },
          { student: 'Vihaan Joshi', date: '2026-09-28', type: 'negative', remark: 'Was talking during an exam. Warned about maintaining silence.' },
          { student: 'Myra Singh', date: '2026-09-20', type: 'positive', remark: 'Volunteered to organize the classroom library and keep inventory in order.' },
        ].map((d, i) => (
          <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${d.type === 'positive'
                  ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                  : 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]'
                }`}>
                <Icon name={d.type === 'positive' ? 'ThumbsUp' : 'AlertTriangle'} size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${d.type === 'positive'
                      ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                      : 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]'
                    }`}>
                    {d.type}
                  </span>
                  <span className="text-[12px] text-[#64748B] font-mono">{d.date}</span>
                </div>
                <p className="text-[14px] font-bold text-[#0F172A]">{d.student}</p>
                <p className="text-[14px] text-[#475569] mt-0.5 leading-relaxed">{d.remark}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={showRecord}
        onClose={() => setShowRecord(false)}
        title="Record Discipline Incident"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowRecord(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowRecord(false)}>Save Record</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select label="Student" required options={[{ value: '', label: 'Select student...' }, ...studentList.map(s => ({ value: String(s.roll), label: s.name }))]} />
          <Select label="Type" required options={[{ value: 'positive', label: 'Positive' }, { value: 'negative', label: 'Negative' }]} />
          <Textarea label="Remark" rows={3} required />
          <Checkbox label="Make visible to parents" checked={true} onChange={() => { }} />
        </div>
      </Modal>
    </div>
  );
}

function SportsActivities() {
  const [showRecord, setShowRecord] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sports & Activities"
        breadcrumbs={['Teacher', 'Sports & Activities']}
        action={
          <button
            onClick={() => setShowRecord(true)}
            className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Icon name="Plus" size={15} /> Record Activity
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { student: 'Aarav Sharma', title: 'Inter-School Cricket Tournament', type: 'Sports', date: '2026-09-20', result: 'Runner-Up' },
          { student: 'Diya Patel', title: 'Science Exhibition', type: 'Academic', date: '2026-08-15', result: 'First Prize' },
          { student: 'Ishaan Verma', title: 'Annual Day Dance', type: 'Cultural', date: '2026-07-30', result: 'Participated' },
          { student: 'Saanvi Reddy', title: 'Quiz Competition', type: 'Academic', date: '2026-07-12', result: 'Second Prize' },
        ].map((a, i) => (
          <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
                <Icon name={a.type === 'Sports' ? 'Trophy' : a.type === 'Academic' ? 'BookOpen' : 'Music'} size={18} />
              </div>
              <div>
                <p className="font-bold text-[14px] text-[#0F172A]">{a.title}</p>
                <p className="text-[12px] text-[#64748B] mt-0.5">{a.student} · {a.type} · {a.date}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
              {a.result}
            </span>
          </div>
        ))}
      </div>

      <Modal
        open={showRecord}
        onClose={() => setShowRecord(false)}
        title="Record Activity"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowRecord(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowRecord(false)}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select label="Student" required options={[{ value: '', label: 'Select...' }, ...studentList.map(s => ({ value: String(s.roll), label: s.name }))]} />
          <Input label="Activity Title" required />
          <Select label="Type" required options={[{ value: 'sports', label: 'Sports' }, { value: 'academic', label: 'Academic' }, { value: 'cultural', label: 'Cultural' }]} />
          <Input label="Date" type="date" required />
          <Input label="Result/Achievement" placeholder="e.g., First Prize, Participated" />
        </div>
      </Modal>
    </div>
  );
}

function TeacherPTM() {
  return (
    <div className="space-y-6">
      <PageHeader title="Parent-Teacher Meetings" breadcrumbs={['Teacher', 'PTM']} />
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="font-bold text-[16px] text-[#0F172A]">Scheduled Meetings · Term 1</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Time</th>
              <th className="px-5 py-3.5">Parent</th>
              <th className="px-5 py-3.5">Student</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
            {[
              { date: 'Oct 20, 2026', time: '09:30 AM', parent: 'Rajesh Sharma', student: 'Aarav Sharma', status: 'scheduled' },
              { date: 'Oct 20, 2026', time: '10:00 AM', parent: 'Hardik Patel', student: 'Diya Patel', status: 'scheduled' },
              { date: 'Oct 20, 2026', time: '10:30 AM', parent: 'Amit Verma', student: 'Ishaan Verma', status: 'scheduled' },
            ].map((p, i) => (
              <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3.5 font-mono text-[12px] text-[#64748B]">{p.date}</td>
                <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{p.time}</td>
                <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{p.parent}</td>
                <td className="px-5 py-3.5 text-[#64748B]">{p.student}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                      Notes
                    </button>
                    <button className="px-2.5 py-1 text-[12px] font-semibold text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg hover:bg-[#DCFCE7]">
                      Complete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeacherAppointments() {
  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" breadcrumbs={['Teacher', 'Appointments']} />
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="font-bold text-[16px] text-[#0F172A]">Parent Consultation Requests</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="px-5 py-3.5">Parent</th>
              <th className="px-5 py-3.5">Student</th>
              <th className="px-5 py-3.5">Requested Date</th>
              <th className="px-5 py-3.5">Time Slot</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
            {[
              { parent: 'Rajesh Sharma', student: 'Aarav Sharma', date: '2026-10-20', time: '09:30 AM', status: 'pending' },
              { parent: 'Kiran Reddy', student: 'Saanvi Reddy', date: '2026-10-22', time: '11:00 AM', status: 'pending' },
            ].map((a, i) => (
              <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{a.parent}</td>
                <td className="px-5 py-3.5 text-[#64748B]">{a.student}</td>
                <td className="px-5 py-3.5 font-mono text-[12px] text-[#64748B]">{a.date}</td>
                <td className="px-5 py-3.5 text-[#0F172A]">{a.time}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                    {a.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button className="px-2.5 py-1 text-[12px] font-semibold text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg hover:bg-[#DCFCE7]">
                      Accept
                    </button>
                    <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                      Reschedule
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeacherCirculars() {
  const [activeTab, setActiveTab] = useState('circulars');
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'holiday' | 'event' | 'exam' | 'ptm'>('all');
  const [calSearch, setCalSearch] = useState('');

  const filteredEvents = calendarEvents.filter(e => {
    const matchesType = eventTypeFilter === 'all' || e.type === eventTypeFilter;
    const matchesSearch = !calSearch || e.title.toLowerCase().includes(calSearch.toLowerCase()) || (e.description && e.description.toLowerCase().includes(calSearch.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Circulars & Calendar" breadcrumbs={['Teacher', 'Circulars & Calendar']} />

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('circulars')}
          className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors ${activeTab === 'circulars'
              ? 'bg-[#7C612A] text-[#FFFFFF]'
              : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
        >
          Circulars
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors ${activeTab === 'calendar'
              ? 'bg-[#7C612A] text-[#FFFFFF]'
              : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
        >
          Academic Calendar & Events
        </button>
      </div>

      {activeTab === 'circulars' ? (
        <div className="space-y-3">
          {circulars.slice(0, 4).map(c => (
            <div key={c.id} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[12px] font-mono text-[#64748B]">{c.number}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                  {c.category}
                </span>
              </div>
              <p className="font-bold text-[16px] text-[#0F172A]">{c.title}</p>
              <p className="text-[14px] text-[#475569] mt-1 leading-relaxed">{c.excerpt}</p>
              <p className="text-[12px] text-[#64748B] font-mono mt-3">{c.date} · {c.time}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { key: 'all', label: 'All Entries' },
                { key: 'holiday', label: 'Holidays' },
                { key: 'event', label: 'Events' },
                { key: 'exam', label: 'Exams' },
                { key: 'ptm', label: 'PTMs' },
              ].map(f => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setEventTypeFilter(f.key as any)}
                  className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-colors ${eventTypeFilter === f.key
                      ? 'bg-[#7C612A] text-[#FFFFFF]'
                      : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search events or holidays..."
                value={calSearch}
                onChange={e => setCalSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-[12px] rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C612A]"
              />
              <Icon name="Search" size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredEvents.map(e => {
              const [, m, d] = e.date.split('-');
              const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const monthName = shortMonths[parseInt(m, 10) - 1] || 'Oct';

              const typeBadge = {
                holiday: { bg: 'bg-[#FFF1F2]', border: 'border-[#FECDD3]', text: 'text-[#BE123C]', label: 'Holiday' },
                exam: { bg: 'bg-[#EFF6FF]', border: 'border-[#BFDBFE]', text: 'text-[#1D4ED8]', label: 'Exam' },
                ptm: { bg: 'bg-[#FAF5FF]', border: 'border-[#E9D5FF]', text: 'text-[#7E22CE]', label: 'PTM' },
                event: { bg: 'bg-[#F0FDF4]', border: 'border-[#BBF7D0]', text: 'text-[#15803D]', label: 'Event' },
              }[e.type] || { bg: 'bg-[#F8FAFC]', border: 'border-[#E2E8F0]', text: 'text-[#475569]', label: 'Event' };

              return (
                <div key={e.id} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between hover:border-[#7C612A] transition-colors shadow-card-soft">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] flex flex-col items-center justify-center text-[#7C612A] shrink-0">
                          <span className="text-[14px] font-bold leading-none">{d}</span>
                          <span className="text-[9px] uppercase font-bold leading-none mt-0.5">{monthName}</span>
                        </div>
                        <div>
                          <span className="text-[12px] text-[#64748B] font-mono">{e.date}</span>
                          <p className="text-[14px] font-bold text-[#0F172A] leading-snug">{e.title}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${typeBadge.bg} ${typeBadge.border} ${typeBadge.text}`}>
                        {typeBadge.label}
                      </span>
                    </div>
                    {e.description && <p className="text-[12px] text-[#475569] mt-1.5 line-clamp-2 leading-relaxed">{e.description}</p>}
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[12px] text-[#64748B]">
                    <span className="truncate max-w-[140px]">{e.location || 'School Campus'}</span>
                    <span className="font-semibold text-[#7C612A]">{e.time || 'All Day'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ClassNotifications() {
  const [showSend, setShowSend] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Notifications"
        breadcrumbs={['Teacher', 'Class Notifications']}
        action={
          <button
            onClick={() => setShowSend(true)}
            className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Icon name="Send" size={15} /> Send Message
          </button>
        }
      />

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="font-bold text-[16px] text-[#0F172A]">Broadcast History</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="px-5 py-3.5">Message Content</th>
              <th className="px-5 py-3.5">Target Class</th>
              <th className="px-5 py-3.5">Date Sent</th>
              <th className="px-5 py-3.5 text-center">Read Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
            {[
              { msg: 'Reminder: Maths test on Chapter 5 tomorrow', class: '8-A', date: '2026-10-12', read: '38/42' },
              { msg: 'Please bring graph paper for tomorrow\'s class', class: '8-A', date: '2026-10-10', read: '40/42' },
            ].map((n, i) => (
              <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{n.msg}</td>
                <td className="px-5 py-3.5 text-[#64748B]">Class {n.class}</td>
                <td className="px-5 py-3.5 font-mono text-[12px] text-[#64748B]">{n.date}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                    {n.read} Parents
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={showSend}
        onClose={() => setShowSend(false)}
        title="Send Message to Parents"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowSend(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowSend(false)} icon={<Icon name="Send" size={16} />}>Send</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select label="Target Class" required options={[{ value: '8a', label: 'Class 8-A' }, { value: '8b', label: 'Class 8-B' }]} />
          <Textarea label="Message" rows={4} required />
        </div>
      </Modal>
    </div>
  );
}

function ClassReports() {
  const [tab, setTab] = useState('attendance');
  return (
    <div className="space-y-6">
      <PageHeader title="Class Reports" breadcrumbs={['Teacher', 'Class Reports']} />

      <div className="flex gap-2">
        <button
          onClick={() => setTab('attendance')}
          className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors ${tab === 'attendance'
              ? 'bg-[#7C612A] text-[#FFFFFF]'
              : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
        >
          Attendance Report
        </button>
        <button
          onClick={() => setTab('academic')}
          className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors ${tab === 'academic'
              ? 'bg-[#7C612A] text-[#FFFFFF]'
              : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
        >
          Academic Report
        </button>
      </div>

      {tab === 'attendance' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
            <h3 className="font-bold text-[16px] text-[#0F172A]">Class 8-A — Attendance Report (October 2026)</h3>
            <button className="px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-1.5 shadow-2xs">
              <Icon name="Download" size={13} /> Export Report
            </button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="px-5 py-3.5 text-center w-16">Roll</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5 text-right">Present Days</th>
                <th className="px-5 py-3.5 text-right">Absent Days</th>
                <th className="px-5 py-3.5 text-center">Attendance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
              {studentList.map(s => {
                const present = s.status === 'present' ? 18 : 16;
                const absent = 20 - present;
                return (
                  <tr key={s.roll} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 text-center font-mono text-[#64748B]">#{s.roll}</td>
                    <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{s.name}</td>
                    <td className="px-5 py-3.5 text-right text-[#15803D] font-bold">{present}</td>
                    <td className="px-5 py-3.5 text-right text-[#BE123C] font-bold">{absent}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                        {Math.round(present / 20 * 100)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'academic' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
            <h3 className="font-bold text-[16px] text-[#0F172A]">Class 8-A — Maths Mid-Term Results</h3>
            <button className="px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-1.5 shadow-2xs">
              <Icon name="Download" size={13} /> Export Results
            </button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="px-5 py-3.5 text-center w-16">Roll</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5 text-right">Score</th>
                <th className="px-5 py-3.5 text-center">Grade</th>
                <th className="px-5 py-3.5">Teacher Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
              {studentList.map((s, i) => {
                const marks = [72, 68, 75, 55, 80, 61, 45, 70][i] || 65;
                const grade = marks >= 80 ? 'A+' : marks >= 70 ? 'A' : marks >= 60 ? 'B' : marks >= 50 ? 'C' : 'F';
                return (
                  <tr key={s.roll} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 text-center font-mono text-[#64748B]">#{s.roll}</td>
                    <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{s.name}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-[#0F172A] font-mono">{marks} / 80</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold border ${grade === 'F'
                          ? 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]'
                          : 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                        }`}>
                        {grade}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#64748B]">
                      {grade === 'F' ? 'Needs Improvement' : grade === 'A+' ? 'Outstanding Performance' : 'Good Progress'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
