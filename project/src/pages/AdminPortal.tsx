import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { PageHeader, PillTabs, StatusBadge, Badge, Button, ProgressBar, EmptyState, Avatar, Modal, Input, Select, Textarea, Switch, Checkbox, TeacherAvatar, showToast } from '@/components/ui';
import { generateReceiptPdf } from '@/utils/receiptPdf';
import { circulars, calendarEvents, schoolInfo } from '@/data';

interface AdminPortalProps {
  activeKey: string;
}

export function AdminPortal({ activeKey }: AdminPortalProps) {
  switch (activeKey) {
    case 'admin-dashboard': return <AdminDashboard />;
    case 'admin-setup': return <SchoolSetup />;
    case 'admin-users': return <UsersRoles />;
    case 'admin-students': return <StudentManagement />;
    case 'admin-staff': return <StaffManagement />;
    case 'admin-fees': return <FeeManagement />;
    case 'admin-attendance': return <AttendanceOversight />;
    case 'admin-timetable': return <TimetableBuilder />;
    case 'admin-calendar': return <CalendarHolidays />;
    case 'admin-circulars': return <Circulars />;
    case 'admin-exams': return <ExamSetup />;
    case 'admin-syllabus': return <SyllabusSetup />;
    case 'admin-academic-monitoring': return <AcademicMonitoring />;
    case 'admin-events': return <Events />;
    case 'admin-helpdesk': return <Helpdesk />;
    case 'admin-transport': return <TransportAdmin />;
    case 'admin-notifications': return <Notifications />;
    case 'admin-reports': return <Reports />;
    case 'admin-faq': return <FaqManagement />;
    default: return <AdminDashboard />;
  }
}


function AdminDashboard() {
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const upcomingEvents = calendarEvents.filter(e => e.date >= todayStr);
  const displayEvents = upcomingEvents.length > 0 ? upcomingEvents.slice(0, 4) : calendarEvents.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-card-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#0F172A]">Administrator Overview</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">
            {dayNames[today.getDay()]}, {monthNames[today.getMonth()]} {today.getDate()}, {today.getFullYear()} · {schoolInfo.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-[12px] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            System Operational · Term 1
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Attendance Today', val: '94.2%', note: '+2.1% vs yesterday', icon: 'CalendarCheck', bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]' },
          { label: 'Fee Collection (Today)', val: '₹1.2L', note: '15% vs avg', icon: 'CreditCard', bg: 'bg-[#FAF7F2]', text: 'text-[#7C612A]' },
          { label: 'Outstanding Dues', val: '₹4.8L', note: '8% decreasing', icon: 'AlertCircle', bg: 'bg-[#FFF1F2]', text: 'text-[#BE123C]' },
          { label: 'Pending Requests', val: '12', note: 'Requires review', icon: 'Inbox', bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]' },
        ].map((s, i) => (
          <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-[#64748B]">{s.label}</span>
              <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.text} flex items-center justify-center`}>
                <Icon name={s.icon as any} size={16} />
              </div>
            </div>
            <p className="text-[24px] font-bold text-[#0F172A]">{s.val}</p>
            <p className="text-[12px] text-[#64748B] mt-1 font-medium">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Attendance Summary */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F5F9]">
            <div>
              <h2 className="text-[16px] font-bold text-[#0F172A]">Attendance Summary</h2>
              <p className="text-[12px] text-[#64748B]">School-wide student presence breakdown</p>
            </div>
            <span className="text-[12px] font-semibold text-[#7C612A]">All Classes</span>
          </div>
          <div className="space-y-3.5">
            {[
              { cls: 'Class 8 - A', present: 38, total: 42, color: 'success' },
              { cls: 'Class 8 - B', present: 35, total: 40, color: 'success' },
              { cls: 'Class 7 - A', present: 36, total: 45, color: 'warning' },
              { cls: 'Class 6 - A', present: 40, total: 41, color: 'success' },
              { cls: 'Class 5 - B', present: 28, total: 38, color: 'warning' },
            ].map(c => (
              <div key={c.cls} className="flex items-center gap-3">
                <span className="text-[14px] font-semibold text-[#0F172A] w-28 shrink-0">{c.cls}</span>
                <div className="flex-1">
                  <ProgressBar value={c.present} max={c.total} color={c.color as 'success' | 'warning'} size="sm" />
                </div>
                <span className="text-[12px] font-mono text-[#64748B] w-20 text-right shrink-0">
                  {c.present} / {c.total} ({Math.round((c.present / c.total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Helpdesk Requests */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F5F9]">
            <div>
              <h2 className="text-[16px] font-bold text-[#0F172A]">Pending Helpdesk</h2>
              <p className="text-[12px] text-[#64748B]">Actionable parent requests</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
              4 Pending
            </span>
          </div>
          <div className="space-y-2.5">
            {[
              { type: 'Gate Pass', who: 'Aarav Sharma', detail: 'Doctor Appointment' },
              { type: 'Appointment', who: 'Diya Patel', detail: 'Principal Meeting' },
              { type: 'Certificate', who: 'Ishaan Verma', detail: 'Bonafide Certificate' },
              { type: 'Transport Request', who: 'Saanvi Reddy', detail: 'Route 3 Stop Change' },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
                <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8] flex items-center justify-center shrink-0">
                  <Icon name="Clock" size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#0F172A] truncate">{r.type}</p>
                  <p className="text-[12px] text-[#64748B] truncate">{r.who} · {r.detail}</p>
                </div>
                <button className="px-2.5 py-1 text-[12px] font-semibold text-[#7C612A] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#FAF7F2]">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Circulars & Events row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F5F9]">
            <div>
              <h2 className="text-[16px] font-bold text-[#0F172A]">Recent Circulars</h2>
              <p className="text-[12px] text-[#64748B]">Published school notices</p>
            </div>
            <span className="text-[12px] font-semibold text-[#7C612A]">View All</span>
          </div>
          <div className="space-y-2.5">
            {circulars.slice(0, 4).map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] hover:border-[#CBD5E1] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8] flex items-center justify-center shrink-0">
                  <Icon name="FileText" size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#0F172A] truncate">{c.title}</p>
                  <p className="text-[12px] text-[#64748B]">{c.number} · {c.date}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                  {c.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F5F9]">
            <div>
              <h2 className="text-[16px] font-bold text-[#0F172A]">Upcoming Events</h2>
              <p className="text-[12px] text-[#64748B]">Academic calendar schedule</p>
            </div>
            <span className="text-[12px] font-semibold text-[#7C612A]">View All</span>
          </div>
          <div className="space-y-2.5">
            {displayEvents.map(e => {
              const [, m, d] = e.date.split('-');
              const evMonth = shortMonths[parseInt(m, 10) - 1] || 'Oct';
              return (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] hover:border-[#CBD5E1] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[14px] font-bold leading-none">{d}</span>
                    <span className="text-[9px] uppercase font-bold leading-none mt-0.5">{evMonth}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#0F172A] truncate">{e.title}</p>
                    <p className="text-[12px] text-[#64748B] truncate">
                      {e.time ? `${e.time} · ` : ''}{e.location || 'School Campus'}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                    e.type === 'holiday'
                      ? 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]'
                      : e.type === 'exam'
                      ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]'
                      : 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                  }`}>
                    {e.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SchoolSetup() {
  const [tab, setTab] = useState('years');
  const tabs = [
    { label: 'Academic Years', key: 'years' },
    { label: 'Classes', key: 'classes' },
    { label: 'Sections', key: 'sections' },
    { label: 'Subjects', key: 'subjects' },
    { label: 'Houses', key: 'houses' },
    { label: 'Periods', key: 'periods' },
    { label: 'School Profile', key: 'profile' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="School Setup" breadcrumbs={['Admin', 'School Setup']} />

      <PillTabs tabs={tabs} active={tab} onChange={setTab} />

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        {tab === 'years' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[16px] text-[#0F172A]">Academic Years</h3>
                <p className="text-[12px] text-[#64748B]">Manage session terms and active calendars</p>
              </div>
              <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
                <Icon name="Plus" size={14} /> Add Year
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Academic Year</th>
                  <th className="px-5 py-3.5">Start Date</th>
                  <th className="px-5 py-3.5">End Date</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {[
                  { year: '2026-27', start: '2026-06-01', end: '2027-04-30', status: 'active' },
                  { year: '2025-26', start: '2025-06-01', end: '2026-04-30', status: 'completed' },
                  { year: '2024-25', start: '2024-06-01', end: '2025-04-30', status: 'completed' },
                ].map(y => (
                  <tr key={y.year} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#0F172A]">{y.year}</td>
                    <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{y.start}</td>
                    <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{y.end}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        y.status === 'active'
                          ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                          : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                      }`}>
                        {y.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'classes' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[16px] text-[#0F172A]">Class Registry</h3>
                <p className="text-[12px] text-[#64748B]">Grade levels and division capacity</p>
              </div>
              <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
                <Icon name="Plus" size={14} /> Add Class
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Class / Grade</th>
                  <th className="px-5 py-3.5">Sections</th>
                  <th className="px-5 py-3.5 text-right">Enrolled Students</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map((c, i) => (
                  <tr key={c} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#0F172A]">{c}</td>
                    <td className="px-5 py-3.5 text-[#64748B]">Sections A, B</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-[#0F172A]">{85 - i * 3}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'sections' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[16px] text-[#0F172A]">Section Divisions</h3>
                <p className="text-[12px] text-[#64748B]">Room allocations and student capacity</p>
              </div>
              <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
                <Icon name="Plus" size={14} /> Add Section
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Section Name</th>
                  <th className="px-5 py-3.5">Applicable Grades</th>
                  <th className="px-5 py-3.5 text-right">Max Capacity</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {['A', 'B', 'C'].map(s => (
                  <tr key={s} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#0F172A]">Section {s}</td>
                    <td className="px-5 py-3.5 text-[#64748B]">All Classes (Pre-Primary to 10)</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-[#0F172A]">40 Students</td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'subjects' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[16px] text-[#0F172A]">Subject Catalog</h3>
                <p className="text-[12px] text-[#64748B]">Curriculum subjects and codes</p>
              </div>
              <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
                <Icon name="Plus" size={14} /> Add Subject
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Subject</th>
                  <th className="px-5 py-3.5">Subject Code</th>
                  <th className="px-5 py-3.5">Classes</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {['Mathematics', 'English', 'Science', 'Social Studies', 'Hindi', 'Computer Science', 'Physical Education', 'Art', 'Music'].map((s, i) => (
                  <tr key={s} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#0F172A]">{s}</td>
                    <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">SUB-{String(i + 1).padStart(3, '0')}</td>
                    <td className="px-5 py-3.5 text-[#64748B]">All Applicable</td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'houses' && (
          <div className="p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Red Eagles', bg: 'bg-[#FFF1F2]', border: 'border-[#FECDD3]', text: 'text-[#BE123C]', members: 285 },
                { name: 'Blue Falcons', bg: 'bg-[#EFF6FF]', border: 'border-[#BFDBFE]', text: 'text-[#1D4ED8]', members: 312 },
                { name: 'Green Hawks', bg: 'bg-[#F0FDF4]', border: 'border-[#BBF7D0]', text: 'text-[#15803D]', members: 298 },
                { name: 'Yellow Kites', bg: 'bg-[#FFFBEB]', border: 'border-[#FDE68A]', text: 'text-[#B45309]', members: 305 },
              ].map(h => (
                <div key={h.name} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
                  <div className={`w-12 h-12 rounded-xl ${h.bg} border ${h.border} ${h.text} flex items-center justify-center font-bold text-[18px] mb-3`}>
                    {h.name[0]}
                  </div>
                  <p className="font-bold text-[16px] text-[#0F172A]">{h.name}</p>
                  <p className="text-[14px] text-[#64748B] mt-0.5">{h.members} Assigned Students</p>
                  <button className="mt-4 w-full py-1.5 rounded-xl text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC]">
                    Manage House
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'periods' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[16px] text-[#0F172A]">Period Timings</h3>
                <p className="text-[12px] text-[#64748B]">Bell schedule and interval definitions</p>
              </div>
              <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
                <Icon name="Plus" size={14} /> Add Period
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5 text-center w-20">Period</th>
                  <th className="px-5 py-3.5">Start Time</th>
                  <th className="px-5 py-3.5">End Time</th>
                  <th className="px-5 py-3.5">Duration</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {[
                  { p: 1, s: '08:00', e: '08:45', d: '45 min' },
                  { p: 2, s: '08:45', e: '09:30', d: '45 min' },
                  { p: 3, s: '09:30', e: '10:15', d: '45 min' },
                  { p: 'Recess', s: '10:15', e: '10:30', d: '15 min' },
                  { p: 4, s: '10:30', e: '11:15', d: '45 min' },
                  { p: 5, s: '11:15', e: '12:00', d: '45 min' },
                  { p: 6, s: '12:00', e: '12:45', d: '45 min' },
                  { p: 7, s: '12:45', e: '01:30', d: '45 min' },
                ].map((r, i) => (
                  <tr key={i} className={r.p === 'Recess' ? 'bg-[#FFFBEB]/40' : 'hover:bg-[#F8FAFC] transition-colors'}>
                    <td className="px-5 py-3.5 text-center font-bold text-[#0F172A]">{r.p}</td>
                    <td className="px-5 py-3.5 font-mono text-[12px] text-[#64748B]">{r.s}</td>
                    <td className="px-5 py-3.5 font-mono text-[12px] text-[#64748B]">{r.e}</td>
                    <td className="px-5 py-3.5 text-[#0F172A] font-semibold">{r.d}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'profile' && (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#F1F5F9]">
              <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] flex items-center justify-center text-[#7C612A]">
                <Icon name="GraduationCap" size={32} />
              </div>
              <div>
                <button className="px-3.5 py-1.5 rounded-xl text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC]">
                  Upload School Crest
                </button>
                <p className="text-[12px] text-[#64748B] mt-1">PNG or JPG, max 2MB</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="School Name" defaultValue={schoolInfo.name} />
              <Input label="Established Year" defaultValue={schoolInfo.estd} />
              <Input label="Phone Number" defaultValue={schoolInfo.phone} />
              <Input label="Official Email" defaultValue={schoolInfo.email} />
              <div className="sm:col-span-2"><Textarea label="Campus Address" rows={2} defaultValue={schoolInfo.address} /></div>
              <Input label="Affiliation Board" defaultValue={schoolInfo.affiliation} />
              <Input label="School Motto / Tagline" defaultValue={schoolInfo.tagline} />
            </div>
            <div className="mt-6 pt-5 border-t border-[#F1F5F9] flex justify-end gap-2.5">
              <button className="px-4 py-2 rounded-xl text-[14px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9]">
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors shadow-2xs">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UsersRoles() {
  const [tab, setTab] = useState('users');
  const [showRole, setShowRole] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Users, Roles & Permissions" breadcrumbs={['Admin', 'Users & Roles']} />

      <PillTabs
        tabs={[
          { key: 'users', label: 'Users' },
          { key: 'roles', label: 'Roles' },
          { key: 'log', label: 'Activity Log' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'users' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[16px] text-[#0F172A]">Staff & Faculty Accounts</h3>
              <p className="text-[12px] text-[#64748B]">Active user logins across ERP modules</p>
            </div>
            <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
              <Icon name="UserPlus" size={14} /> Add User
            </button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Assigned Role</th>
                <th className="px-5 py-3.5">Email Address</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5">Last Active</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
              {[
                { name: 'Dr. Anjali Verma', role: 'Super Admin', email: 'anjali@greenwood.edu', status: 'active', last: '2 min ago', isTeacher: false },
                { name: 'Mrs. Meera Iyer', role: 'Teacher', email: 'meera@greenwood.edu', status: 'active', last: '1 hour ago', isTeacher: true },
                { name: 'Mr. Suresh Bhat', role: 'Accountant', email: 'suresh@greenwood.edu', status: 'active', last: '3 hours ago', isTeacher: false },
                { name: 'Mr. Imran Khan', role: 'Transport Manager', email: 'imran@greenwood.edu', status: 'active', last: '30 min ago', isTeacher: false },
                { name: 'Nurse Farida Sheikh', role: 'Nurse', email: 'farida@greenwood.edu', status: 'active', last: '5 hours ago', isTeacher: false },
                { name: 'Mr. Arjun Kapoor', role: 'Teacher', email: 'arjun@greenwood.edu', status: 'inactive', last: '2 days ago', isTeacher: true },
              ].map((u, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {u.isTeacher ? (
                        <TeacherAvatar name={u.name} size="sm" className="w-8 h-8 border border-[#E2E8F0]" />
                      ) : (
                        <Avatar name={u.name} size="sm" />
                      )}
                      <span className="font-semibold text-[#0F172A]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[12px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{u.email}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      u.status === 'active'
                        ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                        : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B] text-[12px]">{u.last}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'roles' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowRole(true)}
              className="h-9 px-4 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Icon name="Plus" size={14} /> Create Role
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Super Admin', users: 1, desc: 'Full institutional access & control', icon: 'Shield' },
              { name: 'School Admin', users: 2, desc: 'Academic and operations supervision', icon: 'Settings' },
              { name: 'Teacher', users: 45, desc: 'Classroom & marks assessment', icon: 'BookOpen' },
              { name: 'Accountant', users: 3, desc: 'Fee collections & reconciliation', icon: 'CreditCard' },
              { name: 'Transport Manager', users: 2, desc: 'Fleet routing & live bus operations', icon: 'Bus' },
              { name: 'Nurse', users: 2, desc: 'Infirmary health records & triage', icon: 'HeartPulse' },
            ].map(r => (
              <div key={r.name} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8] flex items-center justify-center mb-3">
                  <Icon name={r.icon as any} size={20} />
                </div>
                <p className="font-bold text-[16px] text-[#0F172A]">{r.name}</p>
                <p className="text-[14px] text-[#64748B] mt-0.5">{r.desc}</p>
                <p className="text-[12px] font-semibold text-[#7C612A] mt-3">{r.users} Active Users</p>
                <button className="mt-3.5 w-full py-1.5 rounded-xl text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC]">
                  Manage Permissions
                </button>
              </div>
            ))}
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
            <h3 className="font-bold text-[16px] text-[#0F172A] mb-1">Permission Matrix</h3>
            <p className="text-[12px] text-[#64748B] mb-4">Module-level CRUD access rules</p>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-[14px] border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <th className="px-4 py-3 text-left text-[12px] font-bold text-[#64748B] uppercase">Module</th>
                    {['View', 'Add', 'Edit', 'Delete'].map(p => (
                      <th key={p} className="px-4 py-3 text-center text-[12px] font-bold text-[#64748B] uppercase">{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {['Students', 'Fees', 'Attendance', 'Circulars', 'Exams', 'Transport', 'Reports', 'Users'].map(m => (
                    <tr key={m} className="hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 font-semibold text-[#0F172A]">{m}</td>
                      {['view', 'add', 'edit', 'del'].map(p => (
                        <td key={p} className="px-4 py-3 text-center">
                          <Checkbox label="" checked={p === 'view' || p === 'add'} onChange={() => { }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Modal
            open={showRole}
            onClose={() => setShowRole(false)}
            title="Create New Role"
            footer={
              <>
                <Button variant="outline" onClick={() => setShowRole(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => setShowRole(false)}>Create Role</Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input label="Role Name" placeholder="e.g., Front Office Staff" required />
              <Textarea label="Description" rows={2} placeholder="Brief description of this role" />
            </div>
          </Modal>
        </div>
      )}

      {tab === 'log' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Action Taken</th>
                <th className="px-5 py-3.5">Module</th>
                <th className="px-5 py-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
              {[
                { user: 'Dr. Anjali Verma', action: 'Created new circular CN-2026-00256', module: 'Circulars', time: '2 hours ago' },
                { user: 'Mr. Suresh Bhat', action: 'Updated fee structure for Class 8', module: 'Fees', time: '3 hours ago' },
                { user: 'Mrs. Meera Iyer', action: 'Marked attendance for Class 8-A', module: 'Attendance', time: '4 hours ago' },
                { user: 'Dr. Anjali Verma', action: 'Approved gate pass request', module: 'Helpdesk', time: '5 hours ago' },
                { user: 'Mr. Imran Khan', action: 'Added new vehicle MH-12 AB 3456', module: 'Transport', time: '6 hours ago' },
              ].map((l, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{l.user}</td>
                  <td className="px-5 py-3.5 text-[#475569]">{l.action}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                      {l.module}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B] text-[12px]">{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StudentManagement() {
  const [showAdmit, setShowAdmit] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const studentList = [
    { id: 'STU-2026-0142', name: 'Aarav Sharma', class: '8-A', parent: 'Rajesh Sharma', status: 'active' },
    { id: 'STU-2026-0143', name: 'Diya Patel', class: '8-A', parent: 'Hardik Patel', status: 'active' },
    { id: 'STU-2026-0144', name: 'Ishaan Verma', class: '8-A', parent: 'Amit Verma', status: 'active' },
    { id: 'STU-2026-0145', name: 'Saanvi Reddy', class: '8-B', parent: 'Kiran Reddy', status: 'active' },
    { id: 'STU-2026-0146', name: 'Arjun Nair', class: '8-B', parent: 'Prakash Nair', status: 'active' },
    { id: 'STU-2026-0147', name: 'Ananya Gupta', class: '7-A', parent: 'Suresh Gupta', status: 'active' },
    { id: 'STU-2026-0148', name: 'Vihaan Joshi', class: '7-A', parent: 'Mahesh Joshi', status: 'inactive' },
    { id: 'STU-2026-0149', name: 'Myra Singh', class: '7-B', parent: 'Dilip Singh', status: 'active' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Management"
        breadcrumbs={['Admin', 'Student Management']}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImport(true)}
              className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Icon name="Upload" size={14} /> Bulk Import
            </button>
            <button
              onClick={() => setShowAdmit(true)}
              className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Icon name="UserPlus" size={14} /> Admit Student
            </button>
          </div>
        }
      />

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <input
              placeholder="Search students by name or ID..."
              className="w-full pl-9 pr-3 py-1.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] outline-none focus:border-[#7C612A]"
            />
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          </div>
          <div className="flex items-center gap-2">
            <select className="h-9 px-3 text-[12px] rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] focus:outline-none focus:border-[#7C612A]">
              <option value="all">All Classes</option>
              <option value="8">Class 8</option>
              <option value="7">Class 7</option>
            </select>
            <button className="h-9 px-3 rounded-xl text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-1.5">
              <Icon name="Download" size={13} /> Export
            </button>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="px-5 py-3.5">Student</th>
              <th className="px-5 py-3.5">Student ID</th>
              <th className="px-5 py-3.5">Class</th>
              <th className="px-5 py-3.5">Parent Name</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
            {studentList.map(s => (
              <tr key={s.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={s.name} size="sm" />
                    <span className="font-semibold text-[#0F172A]">{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-mono text-[12px] text-[#64748B]">{s.id}</td>
                <td className="px-5 py-3.5 text-[#0F172A] font-medium">{s.class}</td>
                <td className="px-5 py-3.5 text-[#64748B]">{s.parent}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    s.status === 'active'
                      ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                      : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                  }`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="px-2.5 py-1 text-[12px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] rounded-lg hover:bg-[#F4EBD9]">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={showAdmit}
        onClose={() => setShowAdmit(false)}
        title="Student Admission"
        size="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAdmit(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowAdmit(false)}>Admit Student</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="First Name" required />
            <Input label="Last Name" required />
            <Input label="Date of Birth" type="date" required />
            <Select label="Gender" required options={[{ value: '', label: 'Select...' }, { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
            <Select label="Class" required options={[{ value: '', label: 'Select...' }, { value: '8', label: 'Class 8' }, { value: '7', label: 'Class 7' }]} />
            <Select label="Section" required options={[{ value: '', label: 'Select...' }, { value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />
            <Input label="Blood Group" placeholder="e.g., B+" />
            <Input label="Roll Number" />
          </div>
          <h4 className="text-[14px] font-semibold text-[#0F172A] pt-2">Parent Details</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Father's Name" required />
            <Input label="Father's Occupation" />
            <Input label="Mother's Name" required />
            <Input label="Mother's Occupation" />
            <Input label="Phone" required />
            <Input label="Email" type="email" required />
          </div>
          <Textarea label="Address" rows={2} />
        </div>
      </Modal>

      <Modal
        open={showImport}
        onClose={() => setShowImport(false)}
        title="Bulk Student Import"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowImport(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowImport(false)}>Upload & Import</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-[#CBD5E1] rounded-2xl p-8 text-center bg-[#F8FAFC]">
            <Icon name="FileSpreadsheet" size={32} className="text-[#94A3B8] mx-auto mb-2" />
            <p className="text-[14px] font-semibold text-[#0F172A]">Drop Excel file here</p>
            <p className="text-[12px] text-[#64748B] mt-1">or click to browse. Supported: .xlsx, .xls</p>
            <Button size="sm" variant="outline" className="mt-3" icon={<Icon name="Download" size={14} />}>Download Template</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StaffManagement() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & Teacher Management"
        breadcrumbs={['Admin', 'Staff Management']}
        action={
          <button className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
            <Icon name="UserPlus" size={15} /> Add Staff
          </button>
        }
      />

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="px-5 py-3.5">Staff / Teacher</th>
              <th className="px-5 py-3.5">Primary Subject</th>
              <th className="px-5 py-3.5">Assigned Classes</th>
              <th className="px-5 py-3.5">Class Teacher</th>
              <th className="px-5 py-3.5">Contact Phone</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
            {[
              { name: 'Mrs. Meera Iyer', subject: 'Mathematics', classes: '8-A, 8-B, 7-A', ct: '8-A', phone: '+91 98220 55667' },
              { name: 'Mr. Arjun Kapoor', subject: 'English', classes: '8-A, 7-B', ct: '8-A', phone: '+91 98220 33445' },
              { name: 'Mrs. Deepika Nair', subject: 'Science', classes: '8-A, 8-B, 7-A', ct: '8-B', phone: '+91 98220 77889' },
              { name: 'Mr. Vikram Singh', subject: 'Social Studies', classes: '8-A, 7-A, 7-B', ct: '7-A', phone: '+91 98220 99001' },
              { name: 'Mrs. Sunita Rao', subject: 'Hindi', classes: '8-A, 8-B', ct: '—', phone: '+91 98220 22334' },
              { name: 'Mr. Karan Malhotra', subject: 'Computer Science', classes: '8-A, 8-B, 7-A, 7-B', ct: '—', phone: '+91 98220 66778' },
            ].map((s, i) => (
              <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <TeacherAvatar name={s.name} size="sm" className="w-8 h-8 border border-[#E2E8F0]" />
                    <span className="font-semibold text-[#0F172A]">{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-medium text-[#7C612A]">{s.subject}</td>
                <td className="px-5 py-3.5 text-[#64748B]">{s.classes}</td>
                <td className="px-5 py-3.5">
                  {s.ct !== '—' ? (
                    <span className="px-2 py-0.5 rounded-full text-[12px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                      Class {s.ct}
                    </span>
                  ) : (
                    <span className="text-[#94A3B8]">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{s.phone}</td>
                <td className="px-5 py-3.5 text-right">
                  <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeeManagement() {
  const [tab, setTab] = useState('structure');
  const tabs = [
    { label: 'Fee Structure', key: 'structure' },
    { label: 'Instalments', key: 'instalments' },
    { label: 'Concessions', key: 'concessions' },
    { label: 'Late Fee Rules', key: 'latefee' },
    { label: 'Collections', key: 'collections' },
    { label: 'Dues', key: 'dues' },
    { label: 'Reminders', key: 'reminders' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Fee Oversight & Management" breadcrumbs={['Admin', 'Fee Management']} />

      <PillTabs tabs={tabs} active={tab} onChange={setTab} />

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        {tab === 'structure' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[16px] text-[#0F172A]">Fee Structure by Class</h3>
                <p className="text-[12px] text-[#64748B]">Annual fee schedule across heads</p>
              </div>
              <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
                <Icon name="Plus" size={14} /> Add Structure
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Class</th>
                  <th className="px-5 py-3.5 text-right">Tuition Fee</th>
                  <th className="px-5 py-3.5 text-right">Admission Fee</th>
                  <th className="px-5 py-3.5 text-right">Activity Fee</th>
                  <th className="px-5 py-3.5 text-right">Exam Fee</th>
                  <th className="px-5 py-3.5 text-right">Annual Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {[
                  { class: 'Class 8', tuition: 75000, admission: 15000, activity: 5000, exam: 3000 },
                  { class: 'Class 7', tuition: 70000, admission: 15000, activity: 5000, exam: 3000 },
                  { class: 'Class 6', tuition: 65000, admission: 12000, activity: 4000, exam: 2500 },
                  { class: 'Class 5', tuition: 60000, admission: 12000, activity: 4000, exam: 2500 },
                ].map(f => {
                  const total = f.tuition + f.admission + f.activity + f.exam;
                  return (
                    <tr key={f.class} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#0F172A]">{f.class}</td>
                      <td className="px-5 py-3.5 text-right text-[#64748B] font-mono">₹{f.tuition.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3.5 text-right text-[#64748B] font-mono">₹{f.admission.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3.5 text-right text-[#64748B] font-mono">₹{f.activity.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3.5 text-right text-[#64748B] font-mono">₹{f.exam.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-[#0F172A] font-mono">₹{total.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'instalments' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[16px] text-[#0F172A]">Instalment Windows</h3>
                <p className="text-[12px] text-[#64748B]">Due dates and split thresholds</p>
              </div>
              <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
                <Icon name="Plus" size={14} /> Add Instalment
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Instalment</th>
                  <th className="px-5 py-3.5">Due Date</th>
                  <th className="px-5 py-3.5 text-right">Standard Amount</th>
                  <th className="px-5 py-3.5">Classes</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {[
                  { inst: 'Instalment 1', due: '31 May 2026', amount: 25000, classes: 'All' },
                  { inst: 'Instalment 2', due: '10 August 2026', amount: 25000, classes: 'All' },
                  { inst: 'Instalment 3', due: '10 November 2026', amount: 25000, classes: 'All' },
                ].map((i, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#0F172A]">{i.inst}</td>
                    <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{i.due}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-[#0F172A] font-mono">₹{i.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-[#64748B]">{i.classes}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'concessions' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[16px] text-[#0F172A]">Concessions & Scholarships</h3>
                <p className="text-[12px] text-[#64748B]">Discount policies and approval criteria</p>
              </div>
              <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
                <Icon name="Plus" size={14} /> Add Concession
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Eligibility Description</th>
                  <th className="px-5 py-3.5 text-right">Discount Rate</th>
                  <th className="px-5 py-3.5 text-center">Approval Workflow</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {[
                  { type: 'Sibling Discount', desc: '5% off on tuition for second child', amount: '5%', approval: 'auto' },
                  { type: 'Staff Child', desc: '50% off on tuition for full-time staff', amount: '50%', approval: 'auto' },
                  { type: 'Academic Merit', desc: 'Full fee waiver for rank holders', amount: '100%', approval: 'admin' },
                  { type: 'Need-based Aid', desc: 'Discretionary aid upon verification', amount: 'Variable', approval: 'admin' },
                ].map((c, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#0F172A]">{c.type}</td>
                    <td className="px-5 py-3.5 text-[#64748B]">{c.desc}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-[#15803D]">{c.amount}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        c.approval === 'admin'
                          ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                          : 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                      }`}>
                        {c.approval === 'admin' ? 'Admin Approval' : 'Auto Applied'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'latefee' && (
          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-[14px] font-medium text-[#64748B]">Fixed Late Fee Penalty</p>
                <p className="text-[26px] font-bold text-[#0F172A] mt-1 font-mono">₹500</p>
                <p className="text-[12px] text-[#64748B] mt-1">Charged immediately past instalment due date</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-[14px] font-medium text-[#64748B]">Per-Day Accrual</p>
                <p className="text-[26px] font-bold text-[#0F172A] mt-1 font-mono">₹25 / day</p>
                <p className="text-[12px] text-[#64748B] mt-1">Begins after 7 days grace period</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'collections' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="font-bold text-[16px] text-[#0F172A]">Recent Fee Collections</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Receipt No.</th>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5 text-right">Amount Paid</th>
                  <th className="px-5 py-3.5">Payment Mode</th>
                  <th className="px-5 py-3.5">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {[
                  { receipt: 'RCP-2026-05401', student: 'Aarav Sharma', amount: 15000, mode: 'Online', date: '2026-10-13' },
                  { receipt: 'RCP-2026-05400', student: 'Diya Patel', amount: 25000, mode: 'Cash', date: '2026-10-13' },
                  { receipt: 'RCP-2026-05399', student: 'Ishaan Verma', amount: 8000, mode: 'Cheque', date: '2026-10-12' },
                  { receipt: 'RCP-2026-05398', student: 'Saanvi Reddy', amount: 25000, mode: 'Online', date: '2026-10-12' },
                ].map((c, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[12px]">
                      <button
                        type="button"
                        onClick={() => {
                          generateReceiptPdf({
                            receiptNo: c.receipt,
                            date: c.date,
                            mode: c.mode,
                            amount: c.amount,
                            studentName: c.student,
                            instalment: 'Tuition & Academic Term Fee',
                            academicYear: '2026 - 2027',
                            status: 'PAID',
                          });
                          showToast(`Receipt ${c.receipt}.pdf downloaded successfully!`, 'success');
                        }}
                        title="Download official PDF receipt"
                        className="inline-flex items-center gap-1.5 font-bold text-[#7C612A] hover:text-[#560110] hover:underline cursor-pointer"
                      >
                        <Icon name="solar:download-minimalistic-linear" size={13} />
                        <span>{c.receipt}</span>
                      </button>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{c.student}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-[#15803D] font-mono">₹{c.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                        {c.mode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'dues' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="font-bold text-[16px] text-[#0F172A]">Outstanding Student Dues</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Class</th>
                  <th className="px-5 py-3.5 text-right">Amount Due</th>
                  <th className="px-5 py-3.5 text-center">Overdue Duration</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {[
                  { student: 'Vihaan Joshi', class: '7-A', due: 50000, overdue: '15 days' },
                  { student: 'Myra Singh', class: '7-B', due: 25000, overdue: '3 days' },
                  { student: 'Aarav Sharma', class: '8-A', due: 33000, overdue: 'Overdue' },
                ].map((d, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{d.student}</td>
                    <td className="px-5 py-3.5 text-[#64748B]">Class {d.class}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-[#BE123C] font-mono">₹{d.due.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
                        {d.overdue}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="px-2.5 py-1 text-[12px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] rounded-lg hover:bg-[#F4EBD9]">
                        Send Reminder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'reminders' && (
          <div className="p-6">
            <h3 className="font-bold text-[16px] text-[#0F172A] mb-3">Automated Reminder Dispatch</h3>
            <div className="space-y-3">
              {[
                { label: 'Due date reminder (3 days before)', enabled: true },
                { label: 'Overdue alert (1 day after)', enabled: true },
                { label: 'Escalation alert (7 days after)', enabled: true },
                { label: 'Administrative notice (15 days after)', enabled: false },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[14px] font-medium text-[#0F172A]">{r.label}</span>
                  <Switch checked={r.enabled} onChange={() => { }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AttendanceOversight() {
  return (
    <div className="space-y-6">
      <PageHeader title="Attendance Oversight" breadcrumbs={['Admin', 'Attendance']} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Present Today', val: '1,128', icon: 'CheckCircle', bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]' },
          { label: 'Absent Today', val: '72', icon: 'XCircle', bg: 'bg-[#FFF1F2]', text: 'text-[#BE123C]' },
          { label: 'On Leave', val: '15', icon: 'hugeicons:calendar-date-1', bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]' },
          { label: 'Attendance Rate', val: '94.2%', icon: 'TrendingUp', bg: 'bg-[#FAF7F2]', text: 'text-[#7C612A]' },
        ].map((s, i) => (
          <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-[#64748B]">{s.label}</span>
              <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.text} flex items-center justify-center`}>
                <Icon name={s.icon as any} size={16} />
              </div>
            </div>
            <p className="text-[24px] font-bold text-[#0F172A]">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <h3 className="font-bold text-[16px] text-[#0F172A]">Class-wise Attendance Rates</h3>
          <button className="px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-1.5 shadow-2xs">
            <Icon name="Download" size={13} /> Export
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="px-5 py-3.5">Class</th>
              <th className="px-5 py-3.5 text-right">Total Strength</th>
              <th className="px-5 py-3.5 text-right">Present</th>
              <th className="px-5 py-3.5 text-right">Absent</th>
              <th className="px-5 py-3.5 text-center">Percentage</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
            {[
              { class: '8-A', total: 42, present: 38, absent: 4 },
              { class: '8-B', total: 40, present: 35, absent: 5 },
              { class: '7-A', total: 45, present: 36, absent: 9 },
              { class: '7-B', total: 38, present: 28, absent: 10 },
              { class: '6-A', total: 41, present: 40, absent: 1 },
            ].map(c => (
              <tr key={c.class} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3.5 font-bold text-[#0F172A]">Class {c.class}</td>
                <td className="px-5 py-3.5 text-right text-[#64748B]">{c.total}</td>
                <td className="px-5 py-3.5 text-right font-bold text-[#15803D]">{c.present}</td>
                <td className="px-5 py-3.5 text-right font-bold text-[#BE123C]">{c.absent}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                    {Math.round((c.present / c.total) * 100)}%
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TimetableBuilder() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Time Table Builder"
        breadcrumbs={['Admin', 'Time Table']}
        action={
          <button className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
            <Icon name="Save" size={15} /> Save Timetable
          </button>
        }
      />

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3">
          <select className="h-9 px-3 text-[14px] rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] font-medium focus:outline-none focus:border-[#7C612A]">
            <option value="8a">Class 8 - Section A</option>
            <option value="8b">Class 8 - Section B</option>
            <option value="7a">Class 7 - Section A</option>
          </select>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
            <Icon name="AlertTriangle" size={13} /> 1 Teacher Clash Detected
          </span>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[14px] border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th className="px-4 py-3 text-[12px] font-bold text-[#64748B] uppercase text-left sticky left-0 bg-[#F8FAFC]">Period</th>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                  <th key={d} className="px-4 py-3 text-[12px] font-bold text-[#64748B] uppercase text-center min-w-[130px]">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { p: '1', time: '08:00-08:45' },
                { p: '2', time: '08:45-09:30' },
                { p: '3', time: '09:30-10:15' },
                { p: 'Recess', time: '10:15-10:30', recess: true },
                { p: '4', time: '10:30-11:15' },
                { p: '5', time: '11:15-12:00' },
                { p: '6', time: '12:00-12:45' },
                { p: '7', time: '12:45-01:30' },
              ].map(r => (
                <tr key={r.p} className={r.recess ? 'bg-[#FFFBEB]/30' : 'hover:bg-[#F8FAFC]'}>
                  <td className="px-4 py-2.5 sticky left-0 bg-[#FFFFFF] border-r border-[#F1F5F9]">
                    <p className="font-bold text-[#0F172A] text-[12px]">{r.recess ? 'Recess' : `P${r.p}`}</p>
                    <p className="text-[12px] text-[#64748B] font-mono">{r.time}</p>
                  </td>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                    <td key={d} className="px-2 py-2 text-center">
                      {r.recess ? (
                        <span className="text-[12px] font-medium text-[#B45309]">Break</span>
                      ) : (
                        <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] hover:border-[#7C612A] cursor-pointer transition-colors text-left">
                          <p className="text-[12px] font-bold text-[#7C612A]">Math</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <TeacherAvatar name="Meera Iyer" size="xs" className="w-5 h-5" />
                            <p className="text-[10px] text-[#64748B] truncate">Meera I.</p>
                          </div>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CalendarHolidays() {
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const filtered = calendarEvents.filter(e => {
    const matchType = filterType === 'all' || e.type === filterType;
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || (e.description && e.description.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar & Academic Holidays"
        breadcrumbs={['Admin', 'Calendar']}
        action={
          <button className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
            <Icon name="Plus" size={15} /> Add Entry
          </button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { key: 'all', label: `All (${calendarEvents.length})` },
            { key: 'holiday', label: 'Holidays' },
            { key: 'event', label: 'Events' },
            { key: 'exam', label: 'Exams' },
            { key: 'ptm', label: 'PTMs' },
          ].map(f => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilterType(f.key)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-colors ${
                filterType === f.key
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
            placeholder="Search calendar events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-[12px] rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C612A]"
          />
          <Icon name="Search" size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        </div>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Title & Overview</th>
              <th className="px-5 py-3.5 text-center">Type</th>
              <th className="px-5 py-3.5">Timing & Venue</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
            {filtered.map(e => {
              const [, m, d] = e.date.split('-');
              const evMonth = shortMonths[parseInt(m, 10) - 1] || 'Oct';
              return (
                <tr key={e.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8] flex flex-col items-center justify-center shrink-0">
                        <span className="text-[14px] font-bold leading-none">{d}</span>
                        <span className="text-[9px] uppercase font-bold leading-none mt-0.5">{evMonth}</span>
                      </div>
                      <span className="text-[12px] font-mono text-[#64748B]">{e.date}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-[#0F172A]">{e.title}</p>
                    {e.description && <p className="text-[12px] text-[#64748B] line-clamp-1 mt-0.5">{e.description}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      e.type === 'holiday'
                        ? 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]'
                        : e.type === 'exam'
                        ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]'
                        : 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                    }`}>
                      {e.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B]">
                    <p className="font-medium text-[#0F172A]">{e.time || 'All Day'}</p>
                    <p className="text-[12px] text-[#64748B]">{e.location || 'School Campus'}</p>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                      Published
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Circulars() {
  const [showCreate, setShowCreate] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Circulars & Official Notices"
        breadcrumbs={['Admin', 'Circulars']}
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Icon name="Plus" size={15} /> Create Circular
          </button>
        }
      />

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="px-5 py-3.5">Circular No.</th>
              <th className="px-5 py-3.5">Notice Title</th>
              <th className="px-5 py-3.5">Issue Date</th>
              <th className="px-5 py-3.5">Target Audience</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
            {circulars.map(c => (
              <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3.5 font-mono text-[12px] text-[#7C612A] font-bold">{c.number}</td>
                <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{c.title}</td>
                <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{c.date}</td>
                <td className="px-5 py-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                    All Parents
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                    Published
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="px-2.5 py-1 text-[12px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] rounded-lg hover:bg-[#F4EBD9]">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Circular"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowCreate(false)} icon={<Icon name="Send" size={16} />}>Publish & Notify</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Title" required placeholder="Circular title" />
          <Textarea label="Description" rows={4} required placeholder="Circular content" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Target Audience" required options={[
              { value: 'all', label: 'All Parents' },
              { value: 'class', label: 'Specific Class' },
              { value: 'section', label: 'Specific Section' },
            ]} />
            <Select label="Category" options={[
              { value: 'event', label: 'Event' }, { value: 'holiday', label: 'Holiday' }, { value: 'exam', label: 'Exam' }, { value: 'transport', label: 'Transport' }, { value: 'ptm', label: 'PTM' },
            ]} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ExamSetup() {
  const [tab, setTab] = useState('types');
  const tabs = [
    { label: 'Exam Types', key: 'types' },
    { label: 'Schedules', key: 'schedules' },
    { label: 'Syllabi', key: 'syllabi' },
    { label: 'Grading', key: 'grading' },
    { label: 'Results', key: 'results' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Exam Setup & Results Approval" breadcrumbs={['Admin', 'Exams']} />

      <PillTabs tabs={tabs} active={tab} onChange={setTab} />

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        {tab === 'types' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
              <h3 className="font-bold text-[16px] text-[#0F172A]">Standard Exam Formats</h3>
              <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
                <Icon name="Plus" size={14} /> Add Type
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Exam Name</th>
                  <th className="px-5 py-3.5">Academic Term</th>
                  <th className="px-5 py-3.5 text-right">Max Marks</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {[
                  { name: 'Mid-Term Examination', term: 'Term 1', max: 80, status: 'active' },
                  { name: 'Final Examination', term: 'Term 2', max: 80, status: 'active' },
                  { name: 'Unit Test 1', term: 'Term 1', max: 25, status: 'completed' },
                  { name: 'Unit Test 2', term: 'Term 2', max: 25, status: 'upcoming' },
                ].map((e, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#0F172A]">{e.name}</td>
                    <td className="px-5 py-3.5 text-[#64748B]">{e.term}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-[#0F172A] font-mono">{e.max}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        e.status === 'active'
                          ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                          : e.status === 'completed'
                          ? 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                          : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'schedules' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
              <h3 className="font-bold text-[16px] text-[#0F172A]">Class Exam Schedules</h3>
              <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
                <Icon name="Plus" size={14} /> Create Schedule
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Exam</th>
                  <th className="px-5 py-3.5">Class</th>
                  <th className="px-5 py-3.5">Examination Dates</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {[
                  { exam: 'Mid-Term', class: 'Class 8', dates: 'Oct 15-19, 2026', status: 'scheduled' },
                  { exam: 'Mid-Term', class: 'Class 7', dates: 'Oct 15-19, 2026', status: 'scheduled' },
                  { exam: 'Unit Test 1', class: 'Class 8', dates: 'Aug 10-12, 2026', status: 'completed' },
                ].map((s, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#0F172A]">{s.exam}</td>
                    <td className="px-5 py-3.5 text-[#64748B]">{s.class}</td>
                    <td className="px-5 py-3.5 text-[#0F172A] font-mono text-[12px]">{s.dates}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        s.status === 'scheduled'
                          ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]'
                          : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'syllabi' && (
          <div className="p-8">
            <EmptyState
              icon={<Icon name="BookOpen" size={28} />}
              title="Exam Syllabi"
              description="Define exam-wise syllabus for each class and subject."
              action={
                <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
                  <Icon name="Plus" size={14} /> Add Syllabus
                </button>
              }
            />
          </div>
        )}

        {tab === 'grading' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="font-bold text-[16px] text-[#0F172A]">Grading Scheme</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Grade</th>
                  <th className="px-5 py-3.5 text-right">Min %</th>
                  <th className="px-5 py-3.5 text-right">Max %</th>
                  <th className="px-5 py-3.5">Performance Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {[
                  { g: 'A+', min: 90, max: 100, r: 'Outstanding' },
                  { g: 'A', min: 80, max: 89, r: 'Excellent' },
                  { g: 'B', min: 70, max: 79, r: 'Very Good' },
                  { g: 'C', min: 60, max: 69, r: 'Good' },
                  { g: 'D', min: 50, max: 59, r: 'Satisfactory' },
                  { g: 'F', min: 0, max: 49, r: 'Needs Improvement' },
                ].map(g => (
                  <tr key={g.g} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#0F172A]">{g.g}</td>
                    <td className="px-5 py-3.5 text-right text-[#64748B] font-mono">{g.min}%</td>
                    <td className="px-5 py-3.5 text-right text-[#64748B] font-mono">{g.max}%</td>
                    <td className="px-5 py-3.5 text-[#0F172A] font-medium">{g.r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'results' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="font-bold text-[16px] text-[#0F172A]">Result Publication Pipeline</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Exam</th>
                  <th className="px-5 py-3.5">Class</th>
                  <th className="px-5 py-3.5 text-center">Marks Submitted</th>
                  <th className="px-5 py-3.5 text-center">Approval Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {[
                  { exam: 'Mid-Term', class: '8-A', submitted: '6 / 6', status: 'pending approval' },
                  { exam: 'Mid-Term', class: '8-B', submitted: '4 / 6', status: 'in progress' },
                  { exam: 'Unit Test 1', class: '7-A', submitted: '6 / 6', status: 'published' },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#0F172A]">{r.exam}</td>
                    <td className="px-5 py-3.5 text-[#64748B]">Class {r.class}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-[#0F172A]">{r.submitted}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        r.status === 'published'
                          ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                          : r.status === 'pending approval'
                          ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                          : 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {r.status === 'pending approval' && (
                        <button className="px-2.5 py-1 text-[12px] font-semibold text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg hover:bg-[#DCFCE7]">
                          Approve & Publish
                        </button>
                      )}
                      {r.status === 'published' && (
                        <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] flex items-center gap-1 ml-auto">
                          <Icon name="Download" size={12} /> Report Cards
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
    </div>
  );
}

function SyllabusSetup() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Syllabus Setup"
        breadcrumbs={['Admin', 'Syllabus']}
        action={
          <button className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
            <Icon name="Plus" size={15} /> Add Chapter
          </button>
        }
      />

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-3">
          <select className="h-9 px-3 text-[14px] rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] focus:outline-none focus:border-[#7C612A]">
            <option value="8">Class 8</option>
            <option value="7">Class 7</option>
          </select>
          <select className="h-9 px-3 text-[14px] rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] focus:outline-none focus:border-[#7C612A]">
            <option value="math">Mathematics</option>
            <option value="sci">Science</option>
          </select>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="px-5 py-3.5 w-24">Chapter</th>
              <th className="px-5 py-3.5">Chapter Title</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 text-center">Curriculum Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
            {[
              { ch: 1, name: 'Rational Numbers', status: 'completed' },
              { ch: 2, name: 'Linear Equations in One Variable', status: 'completed' },
              { ch: 3, name: 'Understanding Quadrilaterals', status: 'completed' },
              { ch: 4, name: 'Data Handling', status: 'completed' },
              { ch: 5, name: 'Squares and Square Roots', status: 'completed' },
              { ch: 6, name: 'Cubes and Cube Roots', status: 'completed' },
              { ch: 7, name: 'Comparing Quantities', status: 'completed' },
              { ch: 8, name: 'Algebraic Expressions and Identities', status: 'completed' },
              { ch: 9, name: 'Mensuration', status: 'in progress' },
              { ch: 10, name: 'Exponents and Powers', status: 'pending' },
            ].map(c => (
              <tr key={c.ch} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3.5 font-mono text-[12px] text-[#64748B]">Ch {c.ch}</td>
                <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{c.name}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    c.status === 'completed'
                      ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                      : c.status === 'in progress'
                      ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                      : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <div className="w-28 mx-auto">
                    <ProgressBar
                      value={c.status === 'completed' ? 100 : c.status === 'in progress' ? 50 : 0}
                      max={100}
                      size="sm"
                      color={c.status === 'completed' ? 'success' : 'warning'}
                    />
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

function AcademicMonitoring() {
  return (
    <div className="space-y-6">
      <PageHeader title="Academic Monitoring" breadcrumbs={['Admin', 'Academic Monitoring']} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Outcomes Published', val: '142', icon: 'Lightbulb', bg: 'bg-[#FAF7F2]', text: 'text-[#7C612A]' },
          { label: 'Teacher Updates', val: '87', icon: 'Megaphone', bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]' },
          { label: 'Self-Assessments', val: '56', icon: 'ClipboardCheck', bg: 'bg-[#FAF5FF]', text: 'text-[#7E22CE]' },
          { label: 'Avg Submission Rate', val: '78%', icon: 'TrendingUp', bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]' },
        ].map((s, i) => (
          <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-[#64748B]">{s.label}</span>
              <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.text} flex items-center justify-center`}>
                <Icon name={s.icon as any} size={16} />
              </div>
            </div>
            <p className="text-[24px] font-bold text-[#0F172A]">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="font-bold text-[16px] text-[#0F172A]">Class-wise Academic Activity</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="px-5 py-3.5">Class</th>
              <th className="px-5 py-3.5 text-right">Outcomes Published</th>
              <th className="px-5 py-3.5 text-right">Updates</th>
              <th className="px-5 py-3.5 text-right">Assessments</th>
              <th className="px-5 py-3.5 text-center">Submission Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
            {[
              { class: '8-A', outcomes: 28, updates: 18, assessments: 12, rate: 85 },
              { class: '8-B', outcomes: 25, updates: 15, assessments: 10, rate: 72 },
              { class: '7-A', outcomes: 22, updates: 14, assessments: 8, rate: 80 },
              { class: '7-B', outcomes: 20, updates: 12, assessments: 6, rate: 68 },
            ].map(c => (
              <tr key={c.class} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3.5 font-bold text-[#0F172A]">Class {c.class}</td>
                <td className="px-5 py-3.5 text-right text-[#64748B]">{c.outcomes}</td>
                <td className="px-5 py-3.5 text-right text-[#64748B]">{c.updates}</td>
                <td className="px-5 py-3.5 text-right text-[#64748B]">{c.assessments}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                    {c.rate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Events() {
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return (
    <div className="space-y-6">
      <PageHeader
        title="Events Management"
        breadcrumbs={['Admin', 'Events']}
        action={
          <button className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
            <Icon name="Plus" size={15} /> Create Event
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {calendarEvents.filter(e => e.type === 'event' || e.type === 'ptm').map(e => {
          const [, m, d] = e.date.split('-');
          const evMonth = shortMonths[parseInt(m, 10) - 1] || 'Oct';
          return (
            <div key={e.id} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[14px] font-bold leading-none">{d}</span>
                    <span className="text-[9px] uppercase font-bold leading-none mt-0.5">{evMonth}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                    e.type === 'ptm'
                      ? 'bg-[#FAF5FF] text-[#7E22CE] border-[#E9D5FF]'
                      : 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                  }`}>
                    {e.type.toUpperCase()}
                  </span>
                </div>
                <p className="font-bold text-[#0F172A] text-[14px]">{e.title}</p>
                {e.description && <p className="text-[12px] text-[#64748B] mt-1 line-clamp-2 leading-relaxed">{e.description}</p>}
                <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] text-[12px] text-[#64748B] space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Icon name="MapPin" size={12} className="text-[#94A3B8]" />
                    <span>{e.location || 'School Campus'}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Icon name="Clock" size={12} className="text-[#94A3B8]" />
                    <span className="text-[#7C612A] font-semibold">{e.time || 'All Day'}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-[#F1F5F9]">
                <button className="flex-1 py-1.5 rounded-xl text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC]">
                  Edit
                </button>
                <button className="px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] hover:bg-[#FFE4E6]">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Helpdesk() {
  const [tab, setTab] = useState('gatepass');
  const tabs = [
    { label: 'Gate Pass', key: 'gatepass' },
    { label: 'Appointments', key: 'appointments' },
    { label: 'Certificates', key: 'certificates' },
    { label: 'Infirmary', key: 'infirmary' },
    { label: 'PTM', key: 'ptm' },
    { label: 'Confirmation', key: 'confirmation' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Helpdesk Management" breadcrumbs={['Admin', 'Helpdesk']} />

      <PillTabs tabs={tabs} active={tab} onChange={setTab} />

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        {tab === 'gatepass' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Visitor / Escort</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Reason</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
              {[
                { student: 'Aarav Sharma', visitor: 'Priya Sharma (Mother)', date: '2026-10-14', reason: 'Doctor appointment', status: 'pending' },
                { student: 'Diya Patel', visitor: 'Hardik Patel (Father)', date: '2026-10-14', reason: 'Family function', status: 'pending' },
                { student: 'Ishaan Verma', visitor: 'Uncle Ramesh', date: '2026-10-13', reason: 'Early pickup', status: 'approved' },
              ].map((g, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{g.student}</td>
                  <td className="px-5 py-3.5 text-[#64748B]">{g.visitor}</td>
                  <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{g.date}</td>
                  <td className="px-5 py-3.5 text-[#475569]">{g.reason}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      g.status === 'approved'
                        ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                        : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                    }`}>
                      {g.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {g.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="px-2.5 py-1 text-[12px] font-semibold text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg hover:bg-[#DCFCE7]">
                          Approve
                        </button>
                        <button className="px-2.5 py-1 text-[12px] font-semibold text-[#BE123C] bg-[#FFF1F2] border border-[#FECDD3] rounded-lg hover:bg-[#FFE4E6]">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[12px] text-[#15803D] font-semibold">Approved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'appointments' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
              <h3 className="font-bold text-[16px] text-[#0F172A]">Parent Appointment Requests</h3>
              <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-1.5 shadow-2xs">
                <Icon name="CalendarPlus" size={14} /> Set Available Slots
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Parent</th>
                  <th className="px-5 py-3.5">Staff / Role</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Time Slot</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {[
                  { parent: 'Rajesh Sharma', with: 'Principal', date: '2026-11-05', time: '11:00 AM', status: 'pending' },
                  { parent: 'Hardik Patel', with: 'Class Teacher (8-A)', date: '2026-10-20', time: '09:30 AM', status: 'approved' },
                ].map((a, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{a.parent}</td>
                    <td className="px-5 py-3.5 text-[#64748B]">{a.with}</td>
                    <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{a.date}</td>
                    <td className="px-5 py-3.5 text-[#0F172A] font-semibold">{a.time}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        a.status === 'approved'
                          ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                          : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {a.status === 'pending' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button className="px-2.5 py-1 text-[12px] font-semibold text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg hover:bg-[#DCFCE7]">
                            Accept
                          </button>
                          <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                            Reschedule
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'certificates' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
              <h3 className="font-bold text-[16px] text-[#0F172A]">Certificate Issuance Requests</h3>
              <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-1.5 shadow-2xs">
                <Icon name="FilePlus" size={14} /> Manage Templates
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Certificate Type</th>
                  <th className="px-5 py-3.5">Applied Date</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {[
                  { student: 'Aarav Sharma', type: 'Bonafide Certificate', date: '2026-09-20', status: 'issued' },
                  { student: 'Saanvi Reddy', type: 'School Leaving Certificate', date: '2026-10-10', status: 'pending' },
                ].map((c, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{c.student}</td>
                    <td className="px-5 py-3.5 text-[#64748B]">{c.type}</td>
                    <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{c.date}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        c.status === 'issued'
                          ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                          : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {c.status === 'pending' && (
                        <button className="px-2.5 py-1 text-[12px] font-semibold text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg hover:bg-[#DBEAFE] flex items-center gap-1 ml-auto">
                          <Icon name="FileText" size={12} /> Generate & Issue
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'infirmary' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="px-5 py-3.5">Visit Date</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Reported Complaint</th>
                <th className="px-5 py-3.5">Treatment Given</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
              {[
                { date: '2026-10-05', student: 'Aarav Sharma', complaint: 'Headache, mild fever', treatment: 'Paracetamol, rest', status: 'treated' },
                { date: '2026-10-03', student: 'Diya Patel', complaint: 'Stomach pain', treatment: 'Antacid, observation', status: 'treated' },
                { date: '2026-09-28', student: 'Ishaan Verma', complaint: 'Cut on finger', treatment: 'First aid, bandage', status: 'treated' },
              ].map((v, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{v.date}</td>
                  <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{v.student}</td>
                  <td className="px-5 py-3.5 text-[#475569]">{v.complaint}</td>
                  <td className="px-5 py-3.5 text-[#64748B]">{v.treatment}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'ptm' && (
          <div>
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
              <h3 className="font-bold text-[16px] text-[#0F172A]">PTM Sessions</h3>
              <button className="h-9 px-3.5 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs">
                <Icon name="Plus" size={14} /> Schedule PTM
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Session Date</th>
                  <th className="px-5 py-3.5">Meeting Type</th>
                  <th className="px-5 py-3.5">Class</th>
                  <th className="px-5 py-3.5">Time Interval</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                {[
                  { date: '2026-10-20', type: 'One-time', class: 'All Classes', time: '09:00 - 13:00', status: 'scheduled' },
                  { date: '2026-09-18', type: 'One-time', class: 'Class 8-A', time: '10:00 - 12:00', status: 'completed' },
                ].map((p, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{p.date}</td>
                    <td className="px-5 py-3.5 text-[#0F172A] font-medium">{p.type}</td>
                    <td className="px-5 py-3.5 text-[#64748B]">{p.class}</td>
                    <td className="px-5 py-3.5 text-[#0F172A] font-mono text-[12px]">{p.time}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        p.status === 'scheduled'
                          ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                          : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="px-2.5 py-1 text-[12px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] rounded-lg hover:bg-[#F4EBD9]">
                        Notify Parents
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'confirmation' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="px-5 py-3.5">Confirmation Title</th>
                <th className="px-5 py-3.5">Sent Date</th>
                <th className="px-5 py-3.5 text-center">Confirmed Responses</th>
                <th className="px-5 py-3.5 text-center">Pending Confirmations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
              {[
                { title: 'Annual Sports Day - Participation Consent', date: '2026-10-12', responses: '845', pending: '355' },
                { title: 'Educational Field Trip - Science Museum', date: '2026-10-08', responses: '620', pending: '580' },
              ].map((c, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{c.title}</td>
                  <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{c.date}</td>
                  <td className="px-5 py-3.5 text-center font-bold text-[#15803D]">{c.responses}</td>
                  <td className="px-5 py-3.5 text-center font-bold text-[#B45309]">{c.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function TransportAdmin() {
  return (
    <div className="space-y-6">
      <PageHeader title="Transport Administration" breadcrumbs={['Admin', 'Transport']} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Routes', val: '12', icon: 'Route', bg: 'bg-[#FAF7F2]', text: 'text-[#7C612A]' },
          { label: 'Total Buses', val: '18', icon: 'Bus', bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]' },
          { label: 'Enrolled Students', val: '680', icon: 'Users', bg: 'bg-[#FAF5FF]', text: 'text-[#7E22CE]' },
          { label: 'On Route Now', val: '14', icon: 'MapPinned', bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]' },
        ].map((s, i) => (
          <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-[#64748B]">{s.label}</span>
              <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.text} flex items-center justify-center`}>
                <Icon name={s.icon as any} size={16} />
              </div>
            </div>
            <p className="text-[24px] font-bold text-[#0F172A]">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="font-bold text-[16px] text-[#0F172A]">Bus Route Status Overview</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="px-5 py-3.5">Route</th>
              <th className="px-5 py-3.5">Vehicle Plate</th>
              <th className="px-5 py-3.5">Driver Name</th>
              <th className="px-5 py-3.5 text-right">Students</th>
              <th className="px-5 py-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
            {[
              { route: 'Route 1 - Camp to School', bus: 'MH-12 AB 1234', driver: 'Ramesh Yadav', students: 42, status: 'on route' },
              { route: 'Route 3 - Kothrud to School', bus: 'MH-12 AB 3456', driver: 'Suresh Patil', students: 38, status: 'on route' },
              { route: 'Route 5 - Baner to School', bus: 'MH-12 CD 5678', driver: 'Ashok Kumar', students: 45, status: 'idle' },
              { route: 'Route 8 - Aundh to School', bus: 'MH-12 EF 9012', driver: 'Vijay More', students: 33, status: 'maintenance' },
            ].map((r, i) => (
              <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{r.route}</td>
                <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{r.bus}</td>
                <td className="px-5 py-3.5 text-[#0F172A]">{r.driver}</td>
                <td className="px-5 py-3.5 text-right font-bold text-[#0F172A]">{r.students}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    r.status === 'on route'
                      ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                      : r.status === 'idle'
                      ? 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                      : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                  }`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Notifications() {
  const [showSend, setShowSend] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Broadcast Notifications"
        breadcrumbs={['Admin', 'Notifications']}
        action={
          <button
            onClick={() => setShowSend(true)}
            className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Icon name="Send" size={15} /> Send Notification
          </button>
        }
      />

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="font-bold text-[16px] text-[#0F172A]">Broadcast Outbox History</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="px-5 py-3.5">Notification Title</th>
              <th className="px-5 py-3.5">Target Audience</th>
              <th className="px-5 py-3.5">Channels</th>
              <th className="px-5 py-3.5">Sent Date</th>
              <th className="px-5 py-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
            {[
              { title: 'Fee Reminder - Instalment 3', target: 'Class 8 Parents', channels: 'Push, SMS', date: '2026-10-12', status: 'sent' },
              { title: 'PTM Reminder', target: 'All Parents', channels: 'Push, WhatsApp', date: '2026-10-10', status: 'sent' },
              { title: 'Diwali Break Notice', target: 'All Parents', channels: 'Push, SMS, WhatsApp', date: '2026-10-10', status: 'sent' },
            ].map((n, i) => (
              <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{n.title}</td>
                <td className="px-5 py-3.5 text-[#64748B]">{n.target}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5 flex-wrap">
                    {n.channels.split(', ').map(c => (
                      <span key={c} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[#64748B] font-mono text-[12px]">{n.date}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                    {n.status}
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
        title="Send Notification"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowSend(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowSend(false)} icon={<Icon name="Send" size={16} />}>Send Now</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Title" required />
          <Textarea label="Message" rows={3} required />
          <Select label="Target Audience" required options={[
            { value: 'all', label: 'All Parents' }, { value: 'class', label: 'Selected Class' }, { value: 'section', label: 'Selected Section' }, { value: 'individual', label: 'Individual Parent' },
          ]} />
          <div>
            <p className="text-[14px] font-medium text-[#0F172A] mb-2">Channels</p>
            <div className="flex gap-3">
              <Checkbox label="Push Notification" checked={true} onChange={() => { }} />
              <Checkbox label="SMS" checked={true} onChange={() => { }} />
              <Checkbox label="WhatsApp" checked={false} onChange={() => { }} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Reports() {
  const reports = [
    { name: 'Fee Collection Report', desc: 'Comprehensive fee collection summary and arrears', icon: 'CreditCard' },
    { name: 'Attendance Report', desc: 'Student and staff attendance analytics by term', icon: 'CalendarCheck' },
    { name: 'Academic Performance', desc: 'Exam results, pass percentage & grade distribution', icon: 'GraduationCap' },
    { name: 'Transport Report', desc: 'Route utilization, fuel logs and bus attendance', icon: 'Bus' },
    { name: 'Helpdesk Report', desc: 'Request turnaround times & resolution rates', icon: 'LifeBuoy' },
    { name: 'Student Directory', desc: 'Complete student roll listing with parent info', icon: 'Users' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Institutional Analytics" breadcrumbs={['Admin', 'Reports']} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(r => (
          <div key={r.name} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft flex flex-col justify-between hover:border-[#7C612A] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8] flex items-center justify-center mb-3">
                <Icon name={r.icon as any} size={22} />
              </div>
              <p className="font-bold text-[16px] text-[#0F172A]">{r.name}</p>
              <p className="text-[14px] text-[#64748B] mt-1 leading-relaxed">{r.desc}</p>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-[#F1F5F9]">
              <button className="flex-1 py-1.5 rounded-xl text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] flex items-center justify-center gap-1.5 shadow-2xs">
                <Icon name="FileSpreadsheet" size={13} /> Excel
              </button>
              <button className="flex-1 py-1.5 rounded-xl text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] flex items-center justify-center gap-1.5 shadow-2xs">
                <Icon name="FileText" size={13} /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqManagement() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help / FAQ Management"
        breadcrumbs={['Admin', 'Help / FAQ']}
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="h-10 px-4 rounded-xl text-[14px] font-semibold bg-[#7C612A] text-[#FFFFFF] hover:bg-[#560110] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Icon name="Plus" size={15} /> Add FAQ
          </button>
        }
      />

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="px-5 py-3.5">Question</th>
              <th className="px-5 py-3.5">Answer Summary</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
            {[
              { q: 'How do I pay fees online?', a: 'Navigate to the Fees module from your dashboard and select Pay Now via Net Banking, UPI or Debit/Credit card.' },
              { q: 'How can I request a gate pass?', a: 'Go to Helpdesk > Student Pickup / Gate Pass, submit pickup reason, guardian details and submit for approval.' },
              { q: 'How do I track my child\'s bus?', a: 'Navigate to the Transport module from the dashboard to view real-time GPS tracking and driver details.' },
            ].map((f, i) => (
              <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3.5 font-semibold text-[#0F172A] max-w-xs">{f.q}</td>
                <td className="px-5 py-3.5 text-[#64748B] max-w-md line-clamp-1">{f.a}</td>
                <td className="px-5 py-3.5 text-right">
                  <button className="px-2.5 py-1 text-[12px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC]">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add FAQ"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowAdd(false)}>Save FAQ</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Question" required />
          <Textarea label="Answer" rows={3} required />
        </div>
      </Modal>
    </div>
  );
}
