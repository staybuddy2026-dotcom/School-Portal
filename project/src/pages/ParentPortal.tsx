import { useState, useRef, useEffect } from 'react';
import {
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableContainer as MuiTableContainer,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
} from '@mui/material';
import { Icon } from '@/components/Icon';
import { Card, Badge, Button, Table, Tabs, EmptyState, Breadcrumb, Modal, Input, Select, Textarea, SectionHeader, showToast, TeacherAvatar, Avatar } from '@/components/ui';
import { generateReceiptPdf } from '@/utils/receiptPdf';
import {
  students, feeInstalments, paymentRecords, generateAttendance, timetable, weeklyTimetable,
  circulars, calendarEvents, examSchedule, examResults, subjects, learningOutcomes,
  teacherUpdates, disciplineRecords, activityRecords, observations, transportInfo,
  gatePasses, appointments, certificateRequests, infirmaryVisits, ptms,
  confirmationRequests, faqs, schoolInfo,
} from '@/data';
import type { LearningOutcome } from '@/types';

interface ParentPortalProps {
  activeKey: string;
  selectedStudentId: string;
}

export function ParentPortal({ activeKey, selectedStudentId }: ParentPortalProps) {
  const student = students.find(s => s.id === selectedStudentId) || students[0];

  switch (activeKey) {
    case 'parent-dashboard': return <Dashboard student={student} />;
    case 'parent-profile': return <Profile student={student} />;
    case 'parent-fees': return <Fees student={student} />;
    case 'parent-academic': return <Academic />;
    case 'parent-attendance': return <Attendance student={student} />;
    case 'parent-timetable': return <TimeTable />;
    case 'parent-calendar': return <Calendar />;
    case 'parent-circular': return <Circular />;
    case 'parent-exam': return <Exam />;
    case 'parent-discipline': return <Discipline />;
    case 'parent-activity': return <Activity />;
    case 'parent-event': return <EventPage />;
    case 'parent-observation': return <Observation />;
    case 'parent-transport': return <Transport />;
    case 'parent-helpdesk': return <Helpdesk />;
    case 'parent-help': return <Help />;
    default: return <Dashboard student={student} />;
  }
}

function PageHeader({ title, subtitle, breadcrumbs, action }: { title: string; subtitle?: string; breadcrumbs: string[]; action?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-ink-900">{title}</h1>
          {subtitle && <p className="text-[14px] text-ink-500 mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

function Sparkline({
  color,
  fillId,
  linePath,
  areaPath,
  peakX,
  peakY,
  label,
}: {
  color: string;
  fillId: string;
  linePath: string;
  areaPath: string;
  peakX: number;
  peakY: number;
  label: string;
}) {
  const pillWidth = label.length > 3 ? 32 : 28;
  const halfWidth = pillWidth / 2;

  return (
    <svg viewBox="0 0 130 52" className="w-28 sm:w-32 h-13 overflow-visible shrink-0">
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${fillId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={peakX} cy={peakY} r="3.5" fill={color} stroke="#ffffff" strokeWidth="2" />
      <g transform={`translate(${peakX}, ${peakY})`}>
        <rect
          x={-halfWidth}
          y="-19"
          width={pillWidth}
          height="14"
          rx="7"
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeWidth="1"
          filter="drop-shadow(0 1px 2px #0000000f)"
        />
        <text x="0" y="-9" textAnchor="middle" fontSize="8" fontWeight="700" fill="#475569">
          {label}
        </text>
      </g>
    </svg>
  );
}

function Dashboard({ student }: { student: typeof students[0] }) {
  const totalFee = feeInstalments.reduce((s, f) => s + f.amount, 0);
  const totalPaid = feeInstalments.reduce((s, f) => s + f.paid, 0);
  const totalDue = totalFee - totalPaid;
  const attendanceRecords = generateAttendance(2026, 9);
  const presentDays = attendanceRecords.filter(d => d.status === 'present').length;
  const absentDays = attendanceRecords.filter(d => d.status === 'absent').length;
  const totalDays = presentDays + absentDays;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;
  const paidPercent = totalFee > 0 ? Math.round((totalPaid / totalFee) * 100) : 0;
  const duePercent = totalFee > 0 ? Math.round((totalDue / totalFee) * 100) : 0;
  const initials = student.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="animate-fade-in">
      {/* Student Welcome Card - World-Class Professional ERP Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6 transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-0">
          {/* Left: Avatar + Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Student Portrait - Square */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-20 sm:h-20 aspect-square rounded-full overflow-hidden border-2 border-E2E8F0 ring-2 bg-slate-100 flex items-center justify-center">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#17153A] text-white flex items-center justify-center text-[18px] font-bold">
                    {initials}
                  </div>
                )}
              </div>
            </div>

            {/* Student Identity */}
            <div>
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <h1 className="text-[20px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">
                  Welcome, {student.name}!
                </h1>
                <span className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Student
                </span>
              </div>

              {/* Clean Single-Row Metadata Bar */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-500 font-medium">
                <span className="font-semibold text-[#17153A]">
                  {student.class} · Section {student.section}
                </span>
                <span className="text-slate-300">|</span>
                <span>Roll: <strong className="text-slate-800 font-semibold">{student.rollNumber}</strong></span>
                <span className="text-slate-300">|</span>
                <span>GR No: <strong className="text-slate-800 font-mono font-semibold">{student.grNumber}</strong></span>
                <span className="text-slate-300">|</span>
                <span>ID: <strong className="text-slate-800 font-mono font-semibold">{student.studentId}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Clean & Simple Status Pills */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] font-semibold text-[#17153A]">
              <span className="text-[#64748B] font-normal">Session:</span> 2026–27 · Term 1
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[12px] font-semibold text-[#059669]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-[#059669] font-normal">Attendance:</span> {attendanceRate}% Present
            </span>
          </div>
        </div>
      </div>

      {/* Professional Sparkline Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6">
        {/* Card 1: Total Fee */}
        <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_2px_12px_#0f172a08] p-5">
          <div className="text-[14px] font-semibold text-ink-800">
            Total Fee <span className="text-ink-400 font-normal">/ Year</span>
          </div>
          <div className="flex items-end justify-between mt-3.5">
            <div>
              <div className="text-[26px] sm:text-[28px] font-bold text-ink-950 tracking-tight leading-none">
                ₹{totalFee.toLocaleString('en-IN')}
              </div>
            </div>
            <Sparkline
              color="#6366f1"
              fillId="spark-fee"
              linePath="M 4 38 C 22 40, 36 28, 56 32 C 76 36, 84 14, 100 14 C 112 14, 120 22, 126 20"
              areaPath="M 4 38 C 22 40, 36 28, 56 32 C 76 36, 84 14, 100 14 C 112 14, 120 22, 126 20 L 126 52 L 4 52 Z"
              peakX={100}
              peakY={14}
              label="100%"
            />
          </div>
        </div>

        {/* Card 2: Total Paid */}
        <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_2px_12px_#0f172a08] p-5">
          <div className="text-[14px] font-semibold text-ink-800">
            Total Paid <span className="text-ink-400 font-normal">/ Cleared</span>
          </div>
          <div className="flex items-end justify-between mt-3.5">
            <div>
              <div className="text-[26px] sm:text-[28px] font-bold text-ink-950 tracking-tight leading-none">
                ₹{totalPaid.toLocaleString('en-IN')}
              </div>
            </div>
            <Sparkline
              color="#10b981"
              fillId="spark-paid"
              linePath="M 4 40 C 22 40, 36 30, 54 34 C 72 36, 82 20, 98 20 C 110 20, 118 26, 126 24"
              areaPath="M 4 40 C 22 40, 36 30, 54 34 C 72 36, 82 20, 98 20 C 110 20, 118 26, 126 24 L 126 52 L 4 52 Z"
              peakX={98}
              peakY={20}
              label={`${paidPercent}%`}
            />
          </div>
        </div>

        {/* Card 3: Total Due */}
        <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_2px_12px_#0f172a08] p-5">
          <div className="text-[14px] font-semibold text-ink-800">
            Total Due <span className="text-ink-400 font-normal">/ Pending</span>
          </div>
          <div className="flex items-end justify-between mt-3.5">
            <div>
              <div className="text-[26px] sm:text-[28px] font-bold text-ink-950 tracking-tight leading-none">
                ₹{totalDue.toLocaleString('en-IN')}
              </div>
            </div>
            <Sparkline
              color="#f59e0b"
              fillId="spark-due"
              linePath="M 4 42 C 20 42, 34 34, 52 36 C 70 38, 80 22, 98 22 C 110 22, 118 28, 126 26"
              areaPath="M 4 42 C 20 42, 34 34, 52 36 C 70 38, 80 22, 98 22 C 110 22, 118 28, 126 26 L 126 52 L 4 52 Z"
              peakX={98}
              peakY={22}
              label={`${duePercent}%`}
            />
          </div>
        </div>

        {/* Card 4: Attendance */}
        <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_2px_12px_#0f172a08] p-5">
          <div className="text-[14px] font-semibold text-ink-800">
            Attendance <span className="text-ink-400 font-normal">/ Month</span>
          </div>
          <div className="flex items-end justify-between mt-3.5">
            <div>
              <div className="text-[26px] sm:text-[28px] font-bold text-ink-950 tracking-tight leading-none">
                {attendanceRate}%
              </div>
            </div>
            <Sparkline
              color="#0ea5e9"
              fillId="spark-att"
              linePath="M 4 38 C 18 40, 30 30, 48 34 C 64 38, 76 15, 96 15 C 108 15, 118 22, 126 20"
              areaPath="M 4 38 C 18 40, 30 30, 48 34 C 64 38, 76 15, 96 15 C 108 15, 118 22, 126 20 L 126 52 L 4 52 Z"
              peakX={96}
              peakY={15}
              label={`${attendanceRate}%`}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's timetable */}
        <Card className="lg:col-span-2">
          <SectionHeader title="Today's Schedule" subtitle="Monday, October 13, 2026" />
          <div className="space-y-2">
            {timetable.filter(p => !p.isRecess).slice(0, 5).map(p => (
              <div key={p.period} className="flex items-center gap-3 p-3 rounded-lg bg-ink-50 hover:bg-ink-100 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 font-semibold text-[14px]">
                  {p.period}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-ink-800">{p.subject}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <TeacherAvatar name={p.teacher} size={16} />
                    <p className="text-[12px] text-ink-500 font-medium">{p.teacher}</p>
                  </div>
                </div>
                <p className="text-[12px] text-ink-500 font-medium shrink-0">{p.time}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent notifications */}
        <Card>
          <SectionHeader title="Recent Updates" />
          <div className="space-y-3">
            {circulars.slice(0, 4).map(c => (
              <div key={c.id} className="flex items-start gap-3 pb-3 border-b border-ink-50 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <Icon name="stash:last-updates" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-ink-800 line-clamp-1">{c.title}</p>
                  <p className="text-[12px] text-ink-400 mt-0.5">{c.date} · {c.category}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div >
  );
}

type ProfileTab = 'contact' | 'academic' | 'medical' | 'parents' | 'documents';

function Profile({ student }: { student: typeof students[0] }) {
  const [tab, setTab] = useState<ProfileTab>('contact');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateSubmitted, setUpdateSubmitted] = useState(false);
  const initials = student.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const tabs: { key: ProfileTab; label: string }[] = [
    { key: 'contact', label: 'Contact & Address' },
    { key: 'academic', label: 'Academic & Mentorship' },
    { key: 'medical', label: 'Medical & Health' },
    { key: 'parents', label: "Parents & Guardians" },
    { key: 'documents', label: 'Documents & Records' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="My Profile"
        // subtitle="Comprehensive academic records, guardian details & campus credentials"
        breadcrumbs={['Parent Portal', 'Student Profile']}
        action={
          <div className="flex items-center gap-2">
            {/* <Button
              variant="outline"
              size="sm"
              icon={<Icon name="solar:printer-linear" size={16} />}
              onClick={() => window.print()}
              className="hidden sm:inline-flex text-[#17153A] border-[#17153A]/30"
            >
              Print Profile
            </Button> */}
            {/* <Button
              variant="primary"
              size="sm"
              icon={<Icon name="solar:pen-2-linear" size={15} />}
              onClick={() => setShowUpdateModal(true)}
              className="!bg-[#7C612A] hover:!bg-[#644c1f] text-white"
            >
              Request Update
            </Button> */}
          </div>
        }
      />

      {/* Student Welcome / Profile Card - World-Class Professional ERP Header (Same as Dashboard) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6 transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Avatar + Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Student Portrait - Circular Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-20 sm:h-20 aspect-square rounded-full overflow-hidden border-2 border-slate-200 ring-2 ring-slate-100 bg-slate-100 flex items-center justify-center">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#17153A] text-white flex items-center justify-center text-[18px] font-bold">
                    {initials}
                  </div>
                )}
              </div>
            </div>

            {/* Student Identity */}
            <div>
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <h1 className="text-[20px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">
                  Welcome, {student.name}!
                </h1>
                <span className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Student
                </span>
              </div>

              {/* Clean Single-Row Metadata Bar */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-500 font-medium">
                <span className="font-semibold text-[#17153A]">
                  {student.class} · Section {student.section}
                </span>
                <span className="text-slate-300">|</span>
                <span>Roll: <strong className="text-slate-800 font-semibold">{student.rollNumber}</strong></span>
                <span className="text-slate-300">|</span>
                <span>GR No: <strong className="text-slate-800 font-mono font-semibold">{student.grNumber}</strong></span>
                <span className="text-slate-300">|</span>
                <span>ID: <strong className="text-slate-800 font-mono font-semibold">{student.studentId}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Clean & Simple Status Pills */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] font-semibold text-[#17153A]">
              <span className="text-[#64748B] font-normal">Session:</span> 2026–27 · Term 1
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[12px] font-semibold text-[#059669]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-[#059669] font-normal">Attendance:</span> 90% Present
            </span>
          </div>
        </div>
      </div>

      {/* Header Tabs Navigation - Positioned Outside and Above Container */}
      <Tabs
        tabs={tabs}
        active={tab}
        onChange={(val) => setTab(val as typeof tab)}
      />

      {/* Main Profile Hub Card - Full Width Clean Container */}
      <Card className="!p-0 overflow-hidden shadow-sm border border-[#E2E8F0] w-full">
        {/* Tab Panes */}
        <div className="p-6 sm:p-7">
          {/* Tab 1: Contact & Address */}
          {tab === 'contact' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Primary Phone */}
                <div className="p-4 rounded-xl border border-ink-150 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Icon name="solar:phone-calling-linear" size={18} />
                      </div>
                      <div>
                        <p className="text-[12px] text-ink-400 font-medium uppercase">Primary Contact</p>
                        <p className="text-[14px] font-bold text-ink-900">{student.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(student.phone, 'phone')}
                      className="text-[12px] font-semibold text-primary-600 hover:text-primary-800 bg-white border border-primary-200 px-2.5 py-1 rounded-lg shadow-2xs"
                    >
                      {copiedField === 'phone' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-[12px] text-ink-400 mt-2 flex items-center gap-1.5">
                    <Icon name="solar:check-circle-linear" size={14} className="text-[#10b981]" />
                    <span>Enabled for SMS Alerts & Emergency Broadcasts</span>
                  </p>
                </div>

                {/* Email Address */}
                <div className="p-4 rounded-xl border border-ink-150 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#e0e7ff] text-[#4338ca] flex items-center justify-center">
                        <Icon name="solar:letter-linear" size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] text-ink-400 font-medium uppercase">Parent Email</p>
                        <p className="text-[14px] font-bold text-ink-900 truncate">{student.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(student.email, 'email')}
                      className="text-[12px] font-semibold text-primary-600 hover:text-primary-800 bg-white border border-primary-200 px-2.5 py-1 rounded-lg shadow-2xs"
                    >
                      {copiedField === 'email' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-[12px] text-ink-400 mt-2 flex items-center gap-1.5">
                    <Icon name="solar:check-circle-linear" size={14} className="text-[#10b981]" />
                    <span>Registered for Fee Receipts, Report Cards & Circulars</span>
                  </p>
                </div>
              </div>

              {/* Residential Address */}
              <div className="p-4 rounded-xl border border-ink-150 bg-slate-50/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#fef3c7] text-[#b45309] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name="solar:map-point-linear" size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] text-ink-400 font-medium uppercase">Residential Address</p>
                    </div>
                    <p className="text-[14px] font-semibold text-ink-900 mt-0 leading-snug">
                      {student.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Academic Details */}
          {tab === 'academic' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div className="p-3.5 rounded-xl border border-ink-150 bg-slate-50/40">
                  <p className="text-[12px] text-ink-400 font-medium uppercase">Current Grade</p>
                  <p className="text-[16px] font-bold text-ink-950 mt-1">{student.class}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-ink-150 bg-slate-50/40">
                  <p className="text-[12px] text-ink-400 font-medium uppercase">Roll Number</p>
                  <p className="text-[16px] font-bold text-ink-950 mt-1">{student.rollNumber}</p>                </div>
                <div className="p-3.5 rounded-xl border border-ink-150 bg-slate-50/40">
                  <p className="text-[12px] text-ink-400 font-medium uppercase">General Register (GR)</p>
                  <p className="text-[16px] font-bold text-ink-950 font-mono mt-1">{student.grNumber}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-ink-150 bg-slate-50/40">
                  <p className="text-[12px] text-ink-400 font-medium uppercase">Admission Date</p>
                  <p className="text-[16px] font-bold text-ink-950 mt-1">{student.admittedOn}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-ink-150 bg-slate-50/40">
                  <p className="text-[12px] text-ink-400 font-medium uppercase">Medium of Instruction</p>
                  <p className="text-[16px] font-bold text-ink-950 mt-1">English</p>
                </div>
                <div className="p-4 rounded-xl border border-ink-150 bg-slate-50/40">
                  <div className="flex items-center gap-3">
                    <TeacherAvatar name="Mrs. Sunita Rao" size={40} />
                    <div>
                      <h4 className="text-[12px] text-ink-400 font-medium uppercase">Class Mentor & Teacher</h4>
                      <p className="text-[16px] font-bold text-ink-950 mt-0.5">Mrs. Sunita Rao</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Medical & Health */}
          {tab === 'medical' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div className="p-3.5 rounded-xl border border-ink-150 bg-slate-50/40">
                  <p className="text-[12px] text-ink-400 font-semibold uppercase">Blood Group</p>
                  <p className="text-[16px] font-bold text-[#020617] mt-1 flex items-center gap-1.5">
                    {student.bloodGroup} Positive
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-ink-150 bg-slate-50/40">
                  <p className="text-[12px] text-ink-400 font-semibold uppercase">Immunization Status</p>
                  <p className="text-[16px] font-bold text-[#020617] mt-1 flex items-center gap-1.5">
                    Fully Immunized
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-ink-150 bg-slate-50/40">
                  <p className="text-[12px] text-ink-400 font-medium uppercase">Allergies & Dietary</p>
                  <p className="text-[14px] font-bold text-ink-950 mt-1.5">No Known Allergies</p>
                </div>
                <div className="p-3.5 rounded-xl border border-ink-150 bg-slate-50/40">
                  <p className="text-[12px] text-ink-400 font-medium uppercase">Date of Birth</p>
                  <p className="text-[14px] font-bold text-ink-950 mt-1">{student.dob} (Age: 14 Years)</p>
                </div>
                <div className="p-3.5 rounded-xl border border-ink-150 bg-slate-50/40">
                  <p className="text-[12px] text-ink-400 font-medium uppercase">Gender</p>
                  <p className="text-[14px] font-bold text-ink-950 mt-1">Male</p>
                </div>
                <div className="p-3.5 rounded-xl border border-ink-150 bg-slate-50/40">
                  <p className="text-[12px] text-ink-400 font-medium uppercase">Nationality & Religion</p>
                  <p className="text-[14px] font-bold text-ink-950 mt-1">Indian · Hindu</p>
                </div>
              </div>
            </div>
          )}
          {/* Tab 4: Parents & Guardians */}
          {tab === 'parents' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Father's Card - Refined Light Corporate Card */}
                <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-[#eff6ff] text-[#1d4ed8] border border-[#dbeafe] flex items-center justify-center font-bold shadow-2xs">
                      <Icon name="hugeicons:user-round" size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1d4ed8] py-0.5 rounded">
                        Father / Primary Guardian
                      </span>
                      <h4 className="text-[16px] font-bold text-ink-950 mt-0.5">{student.fatherName}</h4>
                    </div>
                  </div>
                  <div className="space-y-5 text-[12px]">
                    <div>
                      <p className="text-[12px] text-ink-400 font-medium">Occupation</p>
                      <p className="font-semibold text-ink-800">{student.fatherOccupation}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-ink-400 font-medium">Direct Phone</p>
                      <p className="font-semibold text-ink-800">{student.phone}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-ink-400 font-medium">Email</p>
                      <p className="font-semibold text-ink-800">{student.email}</p>
                    </div>
                  </div>
                </div>

                {/* Mother's Card - Refined Light Rose Card */}
                <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-[#fff1f2] text-[#be123c] border border-[#ffe4e6] flex items-center justify-center font-bold shadow-2xs">
                      <Icon name="hugeicons:user-round" size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#be123c] py-0.5 rounded">
                        Mother / Secondary Guardian
                      </span>
                      <h4 className="text-[16px] font-bold text-ink-950 mt-0.5">{student.motherName}</h4>
                    </div>
                  </div>
                  <div className="space-y-5 text-[12px]">
                    <div>
                      <p className="text-[12px] text-ink-400 font-medium">Occupation</p>
                      <p className="font-semibold text-ink-800">{student.motherOccupation}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-ink-400 font-medium">Direct Phone</p>
                      <p className="font-semibold text-ink-800">+91 98765 43211</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-ink-400 font-medium">Email</p>
                      <p className="font-semibold text-ink-800">priya.sharma@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Documents & ID Records */}
          {tab === 'documents' && (
            <div className="space-y-3 animate-fade-in">
              {[
                { title: 'Official Birth Certificate', format: 'PDF · 1.4 MB', date: 'Uploaded June 2019', status: 'Original Verified' },
                { title: 'Previous School Leaving / Transfer Certificate', format: 'PDF · 820 KB', date: 'Uploaded June 2019', status: 'Original Verified' },
                { title: 'Student Aadhaar / National ID Card Copy', format: 'PDF · 610 KB', date: 'Verified 2024', status: 'Active Verified' },
                { title: 'Annual Health & Medical Fitness Clearance', format: 'PDF · 490 KB', date: 'Issued Aug 2025', status: 'Current Term' },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-ink-150 bg-slate-50/40 hover:bg-slate-50 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                      <Icon name="reicon:docs" size={20} />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-ink-900">{doc.title}</p>
                      <p className="text-[12px] text-ink-400 mt-0.5">{doc.format} · {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[12px] font-semibold text-[#047857] bg-[#d1fae5] px-2.5 py-0.5 rounded-full">
                      {doc.status}
                    </span>
                    <Button
                      variant="outline"
                      size="xs"
                      icon={<Icon name="hugeicons:download-01" size={14} />}
                      className="!bg-white"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Modal: Request Profile Correction */}
      {showUpdateModal && (
        <Modal
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setUpdateSubmitted(false);
          }}
          title="Request Profile Data Correction"
        >
          {updateSubmitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Icon name="solar:check-circle-linear" size={26} />
              </div>
              <h4 className="text-[16px] font-bold text-ink-900">Request Submitted Successfully</h4>
              <p className="text-[12px] text-ink-500 mt-1 max-w-sm mx-auto">
                Your request has been routed to the School Administration office. Changes will reflect once verified against official documents.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setShowUpdateModal(false);
                  setUpdateSubmitted(false);
                }}
              >
                Close
              </Button>
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                setUpdateSubmitted(true);
              }}
              className="space-y-4"
            >
              <p className="text-[12px] text-ink-500">
                To maintain accurate administrative records, specify the fields that need correction along with supporting remarks.
              </p>
              <Select
                label="Field Requiring Update"
                options={[
                  { label: 'Residential Address', value: 'address' },
                  { label: 'Primary Contact Number', value: 'phone' },
                  { label: 'Parent Email Address', value: 'email' },
                  { label: 'Parent Occupation / Designation', value: 'occupation' },
                  { label: 'Other Document Correction', value: 'other' },
                ]}
              />
              <Textarea
                label="Correction Details & New Information"
                placeholder="Please describe the updated details accurately..."
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Submit Request
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] text-ink-400 font-medium">{label}</p>
      <p className="text-[14px] text-ink-800 mt-0.5">{value}</p>
    </div>
  );
}

function convertNumberToWords(num: number): string {
  if (num === 0) return 'Zero';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const formatThree = (n: number): string => {
    let str = '';
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    } else if (n > 0) {
      str += a[n];
    }
    return str.trim();
  };
  if (num >= 100000) {
    const lakh = Math.floor(num / 100000);
    const remainder = num % 100000;
    return `${formatThree(lakh)} Lakh ${remainder > 0 ? formatThree(remainder) : ''}`.trim();
  }
  if (num >= 1000) {
    const thousand = Math.floor(num / 1000);
    const remainder = num % 1000;
    return `${formatThree(thousand)} Thousand ${remainder > 0 ? formatThree(remainder) : ''}`.trim();
  }
  return formatThree(num);
}

function Fees({ student = students[0] }: { student?: any }) {
  const [instalments, setInstalments] = useState(feeInstalments);
  const [records, setRecords] = useState(paymentRecords);
  const [showPay, setShowPay] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<any>(null);
  const [selectedInstalment, setSelectedInstalment] = useState<typeof feeInstalments[0] | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'paid'>('all');
  const [paymentMode, setPaymentMode] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalFee = instalments.reduce((s, f) => s + f.amount, 0);
  const totalPaid = instalments.reduce((s, f) => s + f.paid, 0);
  const totalDue = totalFee - totalPaid;
  const concession = 5000;
  const paidPercent = totalFee > 0 ? Math.round((totalPaid / totalFee) * 100) : 0;
  const duePercent = totalFee > 0 ? Math.round((totalDue / totalFee) * 100) : 0;
  const concessionPercent = totalFee > 0 ? Math.round((concession / totalFee) * 100) : 0;

  const filteredInstalments = instalments.filter(f => {
    if (filterTab === 'pending') return (f.amount - f.paid) > 0;
    if (filterTab === 'paid') return (f.amount - f.paid) === 0;
    return true;
  });

  const handleProceedToPay = () => {
    if (!selectedInstalment) return;
    setIsProcessing(true);

    setTimeout(() => {
      const dueAmount = selectedInstalment.amount - selectedInstalment.paid;
      const newReceiptNo = `RCP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const modeLabel = paymentMode === 'upi' ? 'Online - UPI' : paymentMode === 'card' ? 'Online - Card' : `Online - ${selectedBank}`;

      const newRecord = {
        id: `p-${Date.now()}`,
        receiptNo: newReceiptNo,
        date: new Date().toISOString().split('T')[0],
        instalment: selectedInstalment.title,
        amount: dueAmount,
        mode: modeLabel as any,
        status: 'successful' as const,
        transactionId: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`,
        studentName: student.name || 'Aarav Sharma',
        studentClass: `${student.class || 'Grade 10'}-${student.section || 'A'}`,
        rollNo: student.rollNumber || '14',
        grNo: student.grNumber || 'GR-2022-8491',
      };

      setRecords(prev => [newRecord, ...prev]);
      setInstalments(prev => prev.map(item => item.id === selectedInstalment.id ? { ...item, paid: item.amount, status: 'paid' as const } : item));
      setIsProcessing(false);
      setShowPay(false);
      setActiveReceipt(newRecord);
      setShowReceipt(true);
      showToast(`Payment of ₹${dueAmount.toLocaleString('en-IN')} successful! Receipt ${newReceiptNo} issued.`, 'success');
    }, 900);
  };

  const handleViewReceipt = (instalmentTitle: string, amount: number, dateStr?: string, receiptNo?: string, mode?: string) => {
    const existing = records.find(r => r.instalment === instalmentTitle || (receiptNo && r.receiptNo === receiptNo));
    const rec = existing || {
      id: `rcp-${Date.now()}`,
      receiptNo: receiptNo || `RCP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      date: dateStr || '2026-05-28',
      instalment: instalmentTitle,
      amount: amount,
      mode: mode || 'Online',
      status: 'successful',
      transactionId: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`,
      studentName: student.name || 'Aarav Sharma',
      studentClass: `${student.class || 'Grade 10'}-${student.section || 'A'}`,
      rollNo: student.rollNumber || '14',
      grNo: student.grNumber || 'GR-2022-8491',
    };
    setActiveReceipt(rec);
    setShowReceipt(true);
  };

  const handleDownloadReceipt = (rec: any) => {
    if (!rec) return;
    try {
      generateReceiptPdf({
        receiptNo: rec.receiptNo || 'RCP-2026-04521',
        date: rec.date || '2026-05-28',
        time: rec.time || '10:30 AM',
        mode: rec.mode || 'Online',
        amount: rec.amount || 25000,
        instalment: rec.instalment || 'Instalment 1 - Tuition',
        transactionId: rec.transactionId || `TXN${(rec.receiptNo || 'RCP-2026-04521')}`,
        studentName: student.name || 'Aarav Sharma',
        class: student.class || 'Class 8',
        section: student.section || 'A',
        rollNumber: student.rollNumber || '07',
        grNo: student.grNumber || 'GR-9821',
        fatherName: student.fatherName || 'Rajesh Sharma',
        academicYear: '2026-27',
        status: 'SUCCESSFUL / PAID',
        concession: rec.concession || 0,
        balanceDue: 0,
      });
      showToast(`Fee Receipt ${rec.receiptNo || 'RCP-2026-04521'}.pdf downloaded successfully!`, 'success');
    } catch (err) {
      console.error('Failed to generate PDF receipt:', err);
      showToast('Failed to generate PDF receipt. Please try again.', 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Fees" breadcrumbs={['Parent', 'Fees']} />

      {/* Professional Sparkline Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6">
        {/* Card 1: Total Fee */}
        <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_2px_12px_#0f172a08] p-5">
          <div className="text-[14px] font-semibold text-ink-800">
            Total Fee <span className="text-ink-400 font-normal">/ Year</span>
          </div>
          <div className="flex items-end justify-between mt-3.5">
            <div>
              <div className="text-[26px] sm:text-[28px] font-bold text-ink-950 tracking-tight leading-none">
                ₹{totalFee.toLocaleString('en-IN')}
              </div>
            </div>
            <Sparkline
              color="#6366F1"
              fillId="spark-fees-fee"
              linePath="M 4 38 C 22 40, 36 28, 56 32 C 76 36, 84 14, 100 14 C 112 14, 120 22, 126 20"
              areaPath="M 4 38 C 22 40, 36 28, 56 32 C 76 36, 84 14, 100 14 C 112 14, 120 22, 126 20 L 126 52 L 4 52 Z"
              peakX={100}
              peakY={14}
              label="100%"
            />
          </div>
        </div>

        {/* Card 2: Total Paid */}
        <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_2px_12px_#0f172a08] p-5">
          <div className="text-[14px] font-semibold text-ink-800">
            Total Paid <span className="text-ink-400 font-normal">/ Cleared</span>
          </div>
          <div className="flex items-end justify-between mt-3.5">
            <div>
              <div className="text-[26px] sm:text-[28px] font-bold text-ink-950 tracking-tight leading-none">
                ₹{totalPaid.toLocaleString('en-IN')}
              </div>
            </div>
            <Sparkline
              color="#10B981"
              fillId="spark-fees-paid"
              linePath="M 4 40 C 22 40, 36 30, 54 34 C 72 36, 82 20, 98 20 C 110 20, 118 26, 126 24"
              areaPath="M 4 40 C 22 40, 36 30, 54 34 C 72 36, 82 20, 98 20 C 110 20, 118 26, 126 24 L 126 52 L 4 52 Z"
              peakX={98}
              peakY={20}
              label={`${paidPercent}%`}
            />
          </div>
        </div>

        {/* Card 3: Concession */}
        <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_2px_12px_#0f172a08] p-5">
          <div className="text-[14px] font-semibold text-ink-800">
            Concession <span className="text-ink-400 font-normal">/ Applied</span>
          </div>
          <div className="flex items-end justify-between mt-3.5">
            <div>
              <div className="text-[26px] sm:text-[28px] font-bold text-ink-950 tracking-tight leading-none">
                ₹{concession.toLocaleString('en-IN')}
              </div>
            </div>
            <Sparkline
              color="#8B5CF6"
              fillId="spark-fees-concession"
              linePath="M 4 36 C 24 38, 42 26, 62 30 C 80 34, 92 16, 102 16 C 114 16, 120 22, 126 20"
              areaPath="M 4 36 C 24 38, 42 26, 62 30 C 80 34, 92 16, 102 16 C 114 16, 120 22, 126 20 L 126 52 L 4 52 Z"
              peakX={102}
              peakY={16}
              label={`${concessionPercent}%`}
            />
          </div>
        </div>

        {/* Card 4: Total Due */}
        <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_2px_12px_#0f172a08] p-5">
          <div className="text-[14px] font-semibold text-ink-800">
            Total Due <span className="text-ink-400 font-normal">/ Pending</span>
          </div>
          <div className="flex items-end justify-between mt-3.5">
            <div>
              <div className="text-[26px] sm:text-[28px] font-bold text-ink-950 tracking-tight leading-none">
                ₹{totalDue.toLocaleString('en-IN')}
              </div>
            </div>
            <Sparkline
              color="#EF4444"
              fillId="spark-fees-due"
              linePath="M 4 42 C 20 42, 34 34, 52 36 C 70 38, 80 22, 98 22 C 110 22, 118 28, 126 26"
              areaPath="M 4 42 C 20 42, 34 34, 52 36 C 70 38, 80 22, 98 22 C 110 22, 118 28, 126 26 L 126 52 L 4 52 Z"
              peakX={98}
              peakY={22}
              label={`${duePercent}%`}
            />
          </div>
        </div>
      </div>

      {/* Modern MUI Fee Instalments Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_12px_#0f172a08] overflow-hidden">
        {/* Table Top Header with Filters */}
        <div className="p-5 border-b border-[#F1F5F9] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white via-white to-[#F8FAFC]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB]">
                <Icon name="solar:card-linear" size={18} />
              </div>
              <div>
                <h3 className="font-bold text-[16px] text-[#0F172A] tracking-tight">Fee Instalments Breakdown</h3>
                <p className="text-[12px] text-[#64748B]">Academic Session 2026-27 • Real-time payment tracking</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Pills */}
            <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] text-[12px] font-medium">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterTab === 'all' ? 'bg-white text-[#0F172A] font-semibold shadow-[0_1px_3px_#00000010]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
              >
                All ({instalments.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('pending')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterTab === 'pending' ? 'bg-white text-[#DC2626] font-semibold shadow-[0_1px_3px_#00000010]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
              >
                Pending / Due ({instalments.filter(f => (f.amount - f.paid) > 0).length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('paid')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterTab === 'paid' ? 'bg-white text-[#059669] font-semibold shadow-[0_1px_3px_#00000010]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
              >
                Paid ({instalments.filter(f => (f.amount - f.paid) === 0).length})
              </button>
            </div>
          </div>
        </div>

        {/* MUI Table Container */}
        <MuiTableContainer className="overflow-x-auto">
          <MuiTable
            sx={{
              minWidth: 780,
              fontFamily: "'Poppins', sans-serif",
              '& .MuiTableCell-root': {
                fontFamily: "'Poppins', sans-serif !important",
              },
            }}
            aria-label="fee instalments table"
          >
            <MuiTableHead>
              <MuiTableRow sx={{ backgroundColor: '#F8FAFC' }}>
                <MuiTableCell sx={{ py: 1.75, px: 3, borderBottom: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#64748B' }}>
                  Instalment Details
                </MuiTableCell>
                <MuiTableCell sx={{ py: 1.75, px: 2.5, borderBottom: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#64748B' }}>
                  Due Date
                </MuiTableCell>
                <MuiTableCell align="right" sx={{ py: 1.75, px: 2.5, borderBottom: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#64748B' }}>
                  Amount
                </MuiTableCell>
                <MuiTableCell align="right" sx={{ py: 1.75, px: 2.5, borderBottom: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#64748B' }}>
                  Paid
                </MuiTableCell>
                <MuiTableCell align="right" sx={{ py: 1.75, px: 2.5, borderBottom: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#64748B' }}>
                  Balance Due
                </MuiTableCell>
                <MuiTableCell align="center" sx={{ py: 1.75, px: 2.5, borderBottom: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#64748B' }}>
                  Status
                </MuiTableCell>
                <MuiTableCell align="right" sx={{ py: 1.75, px: 3, borderBottom: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#64748B' }}>
                  Action
                </MuiTableCell>
              </MuiTableRow>
            </MuiTableHead>

            <MuiTableBody>
              {filteredInstalments.map((f, idx) => {
                const due = f.amount - f.paid;
                const isTransport = f.title.toLowerCase().includes('transport');

                return (
                  <MuiTableRow
                    key={f.id}
                    hover
                    sx={{
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFDFE',
                      '&:hover': { backgroundColor: '#F8FAFC !important' },
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {/* Instalment info */}
                    <MuiTableCell sx={{ py: 2.25, px: 3, borderBottom: '1px solid #F1F5F9' }}>
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-[14px] text-[#0F172A] leading-tight">{f.title}</p>
                        </div>
                      </div>
                    </MuiTableCell>

                    {/* Due Date */}
                    <MuiTableCell sx={{ py: 2.25, px: 2.5, borderBottom: '1px solid #F1F5F9' }}>
                      <div className="flex items-center gap-1.5 text-[12px] text-[#475569] font-medium">
                        <span>{f.dueDate}</span>
                      </div>
                    </MuiTableCell>

                    {/* Amount */}
                    <MuiTableCell align="right" sx={{ py: 2.25, px: 2.5, borderBottom: '1px solid #F1F5F9' }}>
                      <span className="font-bold text-[14px] text-[#0F172A]">₹{f.amount.toLocaleString('en-IN')}</span>
                    </MuiTableCell>

                    {/* Paid */}
                    <MuiTableCell align="right" sx={{ py: 2.25, px: 2.5, borderBottom: '1px solid #F1F5F9' }}>
                      <span className={`font-semibold text-[14px] ${f.paid > 0 ? 'text-[#059669]' : 'text-[#94A3B8]'}`}>
                        ₹{f.paid.toLocaleString('en-IN')}
                      </span>
                    </MuiTableCell>

                    {/* Balance Due */}
                    <MuiTableCell align="right" sx={{ py: 2.25, px: 2.5, borderBottom: '1px solid #F1F5F9' }}>
                      <span className={`font-bold text-[14px] ${due > 0 ? 'text-[#DC2626]' : 'text-[#10B981]'}`}>
                        ₹{due.toLocaleString('en-IN')}
                      </span>
                    </MuiTableCell>

                    {/* Status */}
                    <MuiTableCell align="center" sx={{ py: 2.25, px: 2.5, borderBottom: '1px solid #F1F5F9' }}>
                      <FeeStatusBadge status={f.status} />
                    </MuiTableCell>

                    {/* Action */}
                    <MuiTableCell align="right" sx={{ py: 2.25, px: 3, borderBottom: '1px solid #F1F5F9' }}>
                      {due > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInstalment(f);
                            setShowPay(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] active:scale-95 shadow-[0_1px_2px_#00000015] transition-all cursor-pointer"
                        >
                          <span>Pay Now</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleViewReceipt(f.title, f.amount, f.dueDate)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-[#475569] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] active:scale-95 transition-all cursor-pointer"
                          title="View and download fee receipt"
                        >
                          <Icon name="solar:download-minimalistic-linear" size={13} />
                          <span>Receipt</span>
                        </button>
                      )}
                    </MuiTableCell>
                  </MuiTableRow>
                );
              })}
            </MuiTableBody>
          </MuiTable>
        </MuiTableContainer>

        {/* Table Summary Footer */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0F172A]">{instalments.length} Total Instalments</span>
            <span>•</span>
            <span className="text-[#059669] font-medium">{instalments.filter(f => (f.amount - f.paid) === 0).length} Fully Settled</span>
            <span>•</span>
            <span className="text-[#DC2626] font-medium">{instalments.filter(f => (f.amount - f.paid) > 0).length} Pending/Overdue</span>
          </div>

          <div className="flex items-center gap-4 text-[12px] font-medium">
            <div>
              Total Due: <span className="font-bold text-[#DC2626] text-[14px]">₹{totalDue.toLocaleString('en-IN')}</span>
            </div>
            <div>
              Total Paid: <span className="font-bold text-[#059669] text-[14px]">₹{totalPaid.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Online Gateway Modal */}
      <Modal
        open={showPay}
        onClose={() => !isProcessing && setShowPay(false)}
        title="Pay Fee Online"
        footer={
          <>
            <Button variant="outline" disabled={isProcessing} onClick={() => setShowPay(false)}>Cancel</Button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleProceedToPay}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 text-[14px] font-semibold text-white bg-[#17153A] hover:bg-[#252252] active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Icon name="solar:refresh-linear" size={15} className="animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Icon name="solar:shield-check-linear" size={15} />
                  <span>Proceed to Pay ₹{selectedInstalment ? (selectedInstalment.amount - selectedInstalment.paid).toLocaleString('en-IN') : '0'}</span>
                </>
              )}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Clean Summary Card */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#64748B]">Total Amount to Pay</p>
                <p className="text-[24px] font-bold text-[#17153A] mt-0.5 tracking-tight">
                  ₹{selectedInstalment ? (selectedInstalment.amount - selectedInstalment.paid).toLocaleString('en-IN') : '0'}
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] text-[12px] font-semibold text-[#17153A]">
                {selectedInstalment?.title || 'Fee Instalment'}
              </span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-[12px] text-[#64748B]">
              <span>Student: <strong className="text-[#17153A] font-medium">{student?.name || 'Aarav Sharma'}</strong> ({student?.class || 'Grade 10'}-{student?.section || 'A'})</span>
              <span className="text-[#15803D] font-medium flex items-center gap-1">
                <Icon name="solar:verified-check-linear" size={13} /> Official Checkout
              </span>
            </div>
          </div>

          {/* Clean Segmented Payment Method Selector */}
          <div>
            <label className="block text-[12px] font-semibold text-[#475569] mb-1.5">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] gap-1">
              <button
                type="button"
                onClick={() => setPaymentMode('upi')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[14px] font-medium transition-all cursor-pointer ${paymentMode === 'upi'
                  ? 'bg-[#17153A] text-white font-semibold shadow-xs'
                  : 'text-[#64748B] hover:text-[#17153A]'
                  }`}
              >
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('card')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[14px] font-medium transition-all cursor-pointer ${paymentMode === 'card'
                  ? 'bg-[#17153A] text-white font-semibold shadow-xs'
                  : 'text-[#64748B] hover:text-[#17153A]'
                  }`}
              >
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('netbanking')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[14px] font-medium transition-all cursor-pointer ${paymentMode === 'netbanking'
                  ? 'bg-[#17153A] text-white font-semibold shadow-xs'
                  : 'text-[#64748B] hover:text-[#17153A]'
                  }`}
              >
                <Icon name="solar:bank-linear" size={16} />
                <span>Net Banking</span>
              </button>
            </div>
          </div>

          {/* Clean Dynamic Payment Details */}
          {paymentMode === 'upi' && (
            <div className="space-y-2">
              <label className="block text-[12px] font-medium text-[#475569]">
                UPI ID / Mobile Number
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e: any) => setUpiId(e.target.value)}
                placeholder="e.g. rajesh@oksbi or 9876543210@paytm"
                className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#17153A] focus:ring-1 focus:ring-[#17153A] outline-none transition-all"
              />
              <div className="flex items-center justify-between text-[12px] text-[#64748B] pt-0.5">
                <span>Supports Google Pay, PhonePe, Paytm, BHIM & UPI</span>
              </div>
            </div>
          )}

          {paymentMode === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-[#475569] mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Name on card"
                  className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#17153A] focus:ring-1 focus:ring-[#17153A] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#475569] mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#17153A] focus:ring-1 focus:ring-[#17153A] outline-none transition-all font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#475569] mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#17153A] focus:ring-1 focus:ring-[#17153A] outline-none transition-all text-center"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#475569] mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="•••"
                    className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#17153A] focus:ring-1 focus:ring-[#17153A] outline-none transition-all text-center font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMode === 'netbanking' && (
            <div className="space-y-2">
              <label className="block text-[12px] font-medium text-[#475569]">Select Your Bank</label>
              <div className="grid grid-cols-2 gap-2">
                {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(bank => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`px-3 py-2.5 rounded-xl text-left text-[12px] border transition-all cursor-pointer flex items-center justify-between ${selectedBank === bank
                      ? 'border-[#17153A] bg-[#F8FAFC] text-[#17153A] font-semibold'
                      : 'border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569]'
                      }`}
                  >
                    <span>{bank}</span>
                    {selectedBank === bank && <Icon name="solar:check-circle-linear" size={14} className="text-[#17153A]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Simple Security Tag */}
          <div className="flex items-center justify-center gap-1.5 py-1 text-[12px] text-[#64748B]">
            <Icon name="solar:shield-check-linear" size={13} className="text-[#10B981]" />
            <span>256-bit SSL encrypted • RBI-compliant educational gateway</span>
          </div>
        </div>
      </Modal>

      {/* Payment History Modal */}
      <Modal open={showHistory} onClose={() => setShowHistory(false)} title="Payment History" size="lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[14px] text-[#64748B]">
            <span>Showing all official fee transactions for <strong>{student?.name || 'Aarav Sharma'}</strong></span>
            <span className="font-semibold text-[#17153A]">{records.length} Transactions</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Receipt No.</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Instalment</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {records.map(p => (
                  <tr key={p.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-semibold text-[#17153A] text-[12px]">{p.receiptNo}</td>
                    <td className="px-4 py-3 text-[#64748B] text-[12px]">{p.date}</td>
                    <td className="px-4 py-3 text-[#334155] font-medium text-[12px]">{p.instalment}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#17153A] text-[14px]">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-[#64748B] text-[12px]">{p.mode}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={p.status === 'successful' ? 'success' : p.status === 'pending' ? 'warning' : 'error'} size="xs">
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="xs"
                        variant="ghost"
                        icon={<Icon name="solar:download-minimalistic-linear" size={13} />}
                        onClick={() => handleViewReceipt(p.instalment, p.amount, p.date, p.receiptNo, p.mode)}
                      >
                        Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Official Fee Receipt Modal */}
      <Modal
        open={showReceipt}
        onClose={() => setShowReceipt(false)}
        title="Official Fee Receipt"
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[12px] text-[#64748B] hidden sm:inline">
              Receipt No: <strong className="text-[#17153A]">{activeReceipt?.receiptNo}</strong>
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowReceipt(false)}>Close</Button>
              <button
                type="button"
                onClick={() => handleDownloadReceipt(activeReceipt)}
                className="inline-flex items-center justify-center gap-1.5 h-8 px-4 text-[14px] font-semibold text-white bg-[#17153A] hover:bg-[#252252] active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Icon name="solar:download-minimalistic-linear" size={14} />
                <span>Download Receipt</span>
              </button>
            </div>
          </div>
        }
      >
        {activeReceipt && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D1D5DB] shadow-sm max-w-2xl mx-auto space-y-4 text-[#111827]">
            {/* Top Colored Banner Bar */}
            <div className="h-2 w-full bg-[#560110] rounded-xs" />

            {/* School Header */}
            <div className="text-center pt-1 pb-1 space-y-0.5">
              <h2 className="text-[14px] sm:text-[16px] font-bold text-[#17153A] tracking-normal uppercase">
                SADVIDHYA INTERNATIONAL SCHOOL
              </h2>
              <p className="text-[12px] text-[#4B5563]">
                Affiliation No: 1930482 · Bengaluru, Karnataka
              </p>
              <h3 className="text-[12px] sm:text-[14px] font-bold text-[#560110] uppercase tracking-wide pt-1">
                OFFICIAL FEE RECEIPT
              </h3>
            </div>

            {/* Divider Line */}
            <div className="border-t border-[#D1D5DB]" />

            {/* Receipt Information (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[12px] py-1">
              <div className="space-y-1.5">
                <div className="flex items-center">
                  <span className="w-32 font-bold text-[#111827]">Receipt Number</span>
                  <span className="mx-2">:</span>
                  <span className="text-[#111827] font-semibold">{activeReceipt.receiptNo || 'RCP-2026-04521'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 font-bold text-[#111827]">Date & Time</span>
                  <span className="mx-2">:</span>
                  <span className="text-[#111827]">{activeReceipt.date || '2026-05-28'} {activeReceipt.time || '10:30 AM'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 font-bold text-[#111827]">Payment Mode</span>
                  <span className="mx-2">:</span>
                  <span className="text-[#111827]">{activeReceipt.mode || 'Online'}</span>
                </div>
              </div>

              <div className="space-y-1.5 sm:pl-4">
                <div className="flex items-center">
                  <span className="w-32 font-bold text-[#111827]">Transaction ID</span>
                  <span className="mx-2">:</span>
                  <span className="text-[#111827] font-mono">{activeReceipt.transactionId || `TXN${activeReceipt.receiptNo || 'RCP-2026-04521'}`}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 font-bold text-[#111827]">Status</span>
                  <span className="mx-2">:</span>
                  <span className="text-[#059669] font-bold">SUCCESSFUL / PAID</span>
                </div>
              </div>
            </div>

            {/* Section: STUDENT DETAILS */}
            <div className="bg-[#F8FAFC] border border-[#D1D5DB] py-1 text-center font-bold text-[12px] text-[#17153A] rounded-xs uppercase tracking-wider">
              STUDENT DETAILS
            </div>

            {/* Student Particulars (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[12px] py-1">
              <div className="space-y-1.5">
                <div className="flex items-center">
                  <span className="w-32 font-bold text-[#111827]">Student Name</span>
                  <span className="mx-2">:</span>
                  <span className="text-[#111827] font-medium">{student?.name || 'Aarav Sharma'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 font-bold text-[#111827]">Student ID / GR</span>
                  <span className="mx-2">:</span>
                  <span className="text-[#111827] font-medium">{student?.grNumber || 'GR-9821'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 font-bold text-[#111827]">Class & Section</span>
                  <span className="mx-2">:</span>
                  <span className="text-[#111827]">{student?.class || 'Class 8'}-{student?.section || 'A'}</span>
                </div>
              </div>

              <div className="space-y-1.5 sm:pl-4">
                <div className="flex items-center">
                  <span className="w-32 font-bold text-[#111827]">Roll Number</span>
                  <span className="mx-2">:</span>
                  <span className="text-[#111827]">{student?.rollNumber || '07'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 font-bold text-[#111827]">Parent / Ward</span>
                  <span className="mx-2">:</span>
                  <span className="text-[#111827]">{student?.fatherName || 'Rajesh Sharma'}</span>
                </div>
              </div>
            </div>

            {/* Section: FEE BREAKDOWN */}
            <div className="bg-[#F8FAFC] border border-[#D1D5DB] py-1 text-center font-bold text-[12px] text-[#17153A] rounded-xs uppercase tracking-wider">
              FEE BREAKDOWN
            </div>

            {/* Fee Breakdown Table with Colored Header & Clean Borders */}
            <div className="overflow-hidden border border-[#111827] mt-1">
              <table className="w-full text-left text-[12px] border-collapse">
                <thead>
                  <tr className="bg-[#560110] text-white font-bold">
                    <th className="px-3.5 py-2 border-r border-[#4B5563]">Particulars</th>
                    <th className="px-3.5 py-2 text-right w-44">Amount Paid (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#111827]">
                    <td className="px-3.5 py-2 border-r border-[#111827] text-[#111827]">
                      {activeReceipt.instalment || 'Instalment 1 - Tuition'}
                    </td>
                    <td className="px-3.5 py-2 text-right font-medium text-[#111827]">
                      ₹{(activeReceipt.amount || 25000).toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr className="border-b border-[#111827]">
                    <td className="px-3.5 py-2 border-r border-[#111827] text-[#111827]">
                      Concession / Discount Applied
                    </td>
                    <td className="px-3.5 py-2 text-right font-medium text-[#111827]">
                      ₹0
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals Summary */}
            <div className="border-t border-[#111827] pt-2 space-y-1 text-[12px]">
              <div className="flex items-center justify-between font-bold text-[#111827]">
                <span>TOTAL AMOUNT PAID</span>
                <span className="font-semibold text-right">₹{(activeReceipt.amount || 25000).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-[#111827]">
                <span>Balance Due for Instalment</span>
                <span className="font-medium text-right">₹0.00</span>
              </div>
              <div className="border-b-4 border-double border-[#111827] pt-1" />
            </div>

            {/* Amount in words */}
            <div className="pt-2 text-[12px] flex items-center">
              <span className="font-bold text-[#111827]">Amount in words</span>
              <span className="mx-2">:</span>
              <span className="text-[#111827] font-medium">INR {convertNumberToWords(activeReceipt.amount || 25000)} Only.</span>
            </div>

            {/* Disclaimer Statement */}
            <div className="pt-4 text-[10px] text-[#4B5563] leading-relaxed">
              <p>
                This is a computer-generated digital fee receipt issued by the Sadvidhya International School ERP portal.
              </p>
            </div>

            {/* Bottom Colored Banner Bar */}
            <div className="h-2 w-full bg-[#560110] rounded-xs mt-2" />
          </div>
        )}
      </Modal>
    </div >
  );
}

function FeeStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
    paid: { bg: 'bg-[#ECFDF5]', text: 'text-[#059669]', border: 'border-[#A7F3D0]', dot: 'bg-[#10B981]', label: 'Paid' },
    partial: { bg: 'bg-[#FFFBEB]', text: 'text-[#D97706]', border: 'border-[#FDE68A]', dot: 'bg-[#F59E0B]', label: 'Partial' },
    pending: { bg: 'bg-[#F8FAFC]', text: 'text-[#475569]', border: 'border-[#E2E8F0]', dot: 'bg-[#94A3B8]', label: 'Pending' },
    overdue: { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FECACA]', dot: 'bg-[#EF4444]', label: 'Overdue' },
  };
  const cfg = configs[status] || configs.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

const subjectThemeColors: Record<string, { bg: string; text: string; border: string }> = {
  'Mathematics': { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#DBEAFE]' },
  'Science': { bg: 'bg-[#ECFDF5]', text: 'text-[#059669]', border: 'border-[#A7F3D0]' },
  'English': { bg: 'bg-[#F5F3FF]', text: 'text-[#7C3AED]', border: 'border-[#DDD6FE]' },
  'Social Studies': { bg: 'bg-[#FFFBEB]', text: 'text-[#D97706]', border: 'border-[#FDE68A]' },
  'Hindi': { bg: 'bg-[#FFF1F2]', text: 'text-[#E11D48]', border: 'border-[#FECDD3]' },
  'Computer Science': { bg: 'bg-[#ECFEFF]', text: 'text-[#0891B2]', border: 'border-[#A5F3FC]' },
};

const subjectMeta: Record<string, {
  icon: string;
  color: string;
  lightBg: string;
  borderColor: string;
  teacher: string;
}> = {
  'Mathematics': {
    icon: 'Scale',
    color: '#2563EB',
    lightBg: '#EFF6FF',
    borderColor: '#DBEAFE',
    teacher: 'Mrs. Sunita Sharma',
  },
  'Science': {
    icon: 'Eye',
    color: '#059669',
    lightBg: '#ECFDF5',
    borderColor: '#A7F3D0',
    teacher: 'Dr. K. Ramanathan',
  },
  'English': {
    icon: 'BookOpen',
    color: '#7C3AED',
    lightBg: '#F5F3FF',
    borderColor: '#DDD6FE',
    teacher: 'Ms. Alvira Pinto',
  },
  'Social Studies': {
    icon: 'GraduationCap',
    color: '#D97706',
    lightBg: '#FFFBEB',
    borderColor: '#FDE68A',
    teacher: 'Mr. Arjun Kapoor',
  },
  'Hindi': {
    icon: 'BookOpen',
    color: '#E11D48',
    lightBg: '#FFF1F2',
    borderColor: '#FECDD3',
    teacher: 'Mrs. Deepika Nair',
  },
  'Computer Science': {
    icon: 'LayoutDashboard',
    color: '#0891B2',
    lightBg: '#ECFEFF',
    borderColor: '#A5F3FC',
    teacher: 'Mr. Rajesh Kumar',
  },
};

interface AssessmentDetail {
  score: string;
  percentage: number;
  grade: string;
  evaluatedDate: string;
  submissionDate: string;
  evaluatedBy: string;
  evaluatorRole: string;
  rubrics: { name: string; score: string; max: string; pct: number; remark: string }[];
  feedback: string;
  keyStrengths: string[];
  areasOfImprovement: string[];
  submittedFileName: string;
  submittedFileSize: string;
}

const assessmentDetailsMap: Record<string, AssessmentDetail> = {
  lo1: {
    score: '9.5 / 10',
    percentage: 95,
    grade: 'A+ (Outstanding)',
    evaluatedDate: '14 Oct 2026',
    submissionDate: '13 Oct 2026',
    evaluatedBy: 'Mrs. Meera Iyer',
    evaluatorRole: 'Senior Mathematics Faculty',
    rubrics: [
      { name: 'Problem Formulation', score: '3.0', max: '3.0', pct: 100, remark: 'Accurately converted word statements into algebraic equations' },
      { name: 'Algebraic Steps & Method', score: '3.5', max: '4.0', pct: 88, remark: 'Clean step-by-step simplification using elimination method' },
      { name: 'Verification & Final Answers', score: '3.0', max: '3.0', pct: 100, remark: 'Checked roots in original problem scenario with units' },
    ],
    feedback: 'Aarav demonstrated exceptional logical clarity in translating complex real-world age and distance scenarios into simultaneous linear equations. His working was neat and methodically verified.',
    keyStrengths: ['Accurate variable definition', 'Systematic step-by-step substitution', 'Zero calculation slips'],
    areasOfImprovement: ['Can explore graphical representations of intersecting lines for visual proof'],
    submittedFileName: 'Linear_Equations_RealWorld_Problems_Aarav.pdf',
    submittedFileSize: '1.8 MB',
  },
  lo2: {
    score: '9.0 / 10',
    percentage: 90,
    grade: 'A (Excellent)',
    evaluatedDate: '22 Oct 2026',
    submissionDate: '22 Oct 2026',
    evaluatedBy: 'Mrs. Deepika Nair',
    evaluatorRole: 'Science Laboratory Faculty',
    rubrics: [
      { name: 'Diagram & Labeling', score: '3.0', max: '3.0', pct: 100, remark: 'Chloroplast and thylakoid structure labeled thoroughly' },
      { name: 'Concept Description', score: '3.5', max: '4.0', pct: 88, remark: 'Explained light & dark reaction mechanisms accurately' },
      { name: 'Ecological Significance', score: '2.5', max: '3.0', pct: 83, remark: 'Connected solar energy trapping to trophic pyramid levels' },
    ],
    feedback: 'Well-structured lab report. Aarav highlighted the role of stomata and chlorophyll with clear illustrations and demonstrated a firm understanding of primary producers.',
    keyStrengths: ['Clear botanical diagrams', 'Accurate chemical equation for glucose synthesis'],
    areasOfImprovement: ['Include temperature and light intensity factor graphs in next lab update'],
    submittedFileName: 'Photosynthesis_Process_Lab_Report.pdf',
    submittedFileSize: '2.4 MB',
  },
  lo3: {
    score: '9.0 / 10',
    percentage: 90,
    grade: 'A (Distinction)',
    evaluatedDate: '13 Oct 2026',
    submissionDate: '12 Oct 2026',
    evaluatedBy: 'Mrs. Sunita Rao',
    evaluatorRole: 'English Literature Faculty',
    rubrics: [
      { name: 'Sensory Imagery & Detail', score: '3.8', max: '4.0', pct: 95, remark: 'Evocative descriptions evoking sight, sound, and smell' },
      { name: 'Paragraph Structure & Flow', score: '2.7', max: '3.0', pct: 90, remark: 'Smooth thematic transitions between morning and dusk' },
      { name: 'Grammar & Mechanics', score: '2.5', max: '3.0', pct: 83, remark: 'Vibrant adjectives, minor comma splice addressed inline' },
    ],
    feedback: 'A beautifully written descriptive piece about the countryside retreat. Aarav used rich vocabulary and figurative language to immerse the reader in the environment.',
    keyStrengths: ['Vivid metaphor usage', 'Strong narrative voice', 'Cohesive paragraph organization'],
    areasOfImprovement: ['Practice complex compound sentences with varied punctuation'],
    submittedFileName: 'Descriptive_Paragraph_Favorite_Place.pdf',
    submittedFileSize: '1.2 MB',
  },
  lo4: {
    score: '8.8 / 10',
    percentage: 88,
    grade: 'A (Very Good)',
    evaluatedDate: '12 Oct 2026',
    submissionDate: '11 Oct 2026',
    evaluatedBy: 'Mr. Vikram Singh',
    evaluatorRole: 'History & Civics Faculty',
    rubrics: [
      { name: 'Historical Timeline & Chronology', score: '3.0', max: '3.0', pct: 100, remark: 'Key reigns from Babur to Aurangzeb clearly mapped' },
      { name: 'Administrative & Cultural Reforms', score: '3.3', max: '4.0', pct: 83, remark: 'Highlighted Mansabdari system and Din-i Ilahi concepts' },
      { name: 'Architectural Analysis', score: '2.5', max: '3.0', pct: 83, remark: 'Analyzed red sandstone and white marble monuments' },
    ],
    feedback: 'Comprehensive timeline analysis. Aarav effectively synthesized key economic reforms and cultural syntheses during the medieval period.',
    keyStrengths: ['Precise chronological charting', 'Insightful notes on revenue collection systems'],
    areasOfImprovement: ['Can add brief comparative notes on contemporary regional empires'],
    submittedFileName: 'Mughal_Empire_Rulers_Contributions.pdf',
    submittedFileSize: '2.1 MB',
  },
};

interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  marks: number;
}

interface SubjectAssessment {
  id: string;
  subject: string;
  title: string;
  subtitle: string;
  teacher: string;
  duration: string;
  totalMarks: number;
  badge?: string;
  questions: AssessmentQuestion[];
}

interface CompletedAssessment {
  id: string;
  subject: string;
  teacher: string;
  title: string;
  date: string;
  score: string;
  result: 'Pass' | 'Needs Review';
  summary: {
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

const availableSubjectAssessments: SubjectAssessment[] = [
  {
    id: 'assess-math-01',
    subject: 'Mathematics',
    title: 'Algebra & Linear Equations',
    subtitle: 'Chapter 3: Diagnostic Knowledge Quiz · Linear Equations & Quadratic Basics',
    teacher: 'Mrs. Sunita Sharma',
    duration: '10 Mins',
    totalMarks: 3,
    badge: 'Active',
    questions: [
      {
        id: 'math-q1',
        question: 'In a linear equation 3x + 5 = 20, what is the value of x?',
        options: ['x = 5', 'x = 4', 'x = 15', 'x = 8'],
        correctIndex: 0,
        marks: 1,
      },
      {
        id: 'math-q2',
        question: 'If the sum of two consecutive integers is 35, what is the smaller integer?',
        options: ['17', '18', '16', '19'],
        correctIndex: 0,
        marks: 1,
      },
      {
        id: 'math-q3',
        question: 'What is the degree of a quadratic polynomial in standard form ax² + bx + c = 0?',
        options: ['Degree 2', 'Degree 1', 'Degree 3', 'Degree 0'],
        correctIndex: 0,
        marks: 1,
      },
    ],
  },
  {
    id: 'assess-sci-02',
    subject: 'Science',
    title: 'Plant Physiology & Cellular Energy',
    subtitle: 'Photosynthesis, Cellular Respiration & Cell Organelles Practice Test',
    teacher: 'Dr. K. Ramanathan',
    duration: '15 Mins',
    totalMarks: 3,
    badge: 'Active',
    questions: [
      {
        id: 'sci-q1',
        question: 'Which gas is primarily released during the light-dependent reaction of photosynthesis?',
        options: ['Oxygen (O₂)', 'Carbon Dioxide (CO₂)', 'Nitrogen (N₂)', 'Methane (CH₄)'],
        correctIndex: 0,
        marks: 1,
      },
      {
        id: 'sci-q2',
        question: 'Which organelle is universally referred to as the powerhouse of the eukaryotic cell?',
        options: ['Mitochondria', 'Chloroplast', 'Vacuole', 'Ribosome'],
        correctIndex: 0,
        marks: 1,
      },
      {
        id: 'sci-q3',
        question: 'The evaporation and diffusion of water vapor through plant stomata is known as:',
        options: ['Transpiration', 'Respiration', 'Osmosis', 'Fermentation'],
        correctIndex: 0,
        marks: 1,
      },
    ],
  },
  {
    id: 'assess-eng-03',
    subject: 'English',
    title: 'Poetic Devices & Grammar Comprehension',
    subtitle: 'Figurative Language, Voice Transformation & Lexical Reasoning Review',
    teacher: 'Ms. Alvira Pinto',
    duration: '10 Mins',
    totalMarks: 3,
    badge: 'Active',
    questions: [
      {
        id: 'eng-q1',
        question: "Identify the figurative language device used in 'The golden sun smiled down upon the meadows'.",
        options: ['Personification', 'Simile', 'Alliteration', 'Hyperbole'],
        correctIndex: 0,
        marks: 1,
      },
      {
        id: 'eng-q2',
        question: "Choose the correct passive voice transformation of: 'Shakespeare wrote Hamlet.'",
        options: [
          'Hamlet was written by Shakespeare.',
          'Hamlet is written by Shakespeare.',
          'Shakespeare had written Hamlet.',
          'Hamlet was being written by Shakespeare.',
        ],
        correctIndex: 0,
        marks: 1,
      },
      {
        id: 'eng-q3',
        question: "Which of the following is the most appropriate synonym for the word 'Benevolent'?",
        options: ['Kind & generous', 'Hostile & aloof', 'Arrogant', 'Deceitful'],
        correctIndex: 0,
        marks: 1,
      },
    ],
  },
];

const initialPreviousAssessments: CompletedAssessment[] = [
  {
    id: 'prev-1',
    subject: 'Mathematics',
    teacher: 'Mrs. Sunita Sharma',
    title: 'Algebra & Linear Equations',
    date: '2026-10-08',
    score: '8/10',
    result: 'Pass',
    summary: [
      {
        question: 'In a linear equation 3x + 5 = 20, what is the value of x?',
        selectedAnswer: 'x = 5',
        correctAnswer: 'x = 5',
        isCorrect: true,
      },
      {
        question: 'What is the degree of a quadratic polynomial?',
        selectedAnswer: 'Degree 2',
        correctAnswer: 'Degree 2',
        isCorrect: true,
      },
      {
        question: 'Solve for y: 2y - 4 = 10',
        selectedAnswer: 'y = 7',
        correctAnswer: 'y = 7',
        isCorrect: true,
      },
    ],
  },
  {
    id: 'prev-2',
    subject: 'Science',
    teacher: 'Dr. K. Ramanathan',
    title: 'Plant Physiology & Photosynthesis',
    date: '2026-10-05',
    score: '7/10',
    result: 'Pass',
    summary: [
      {
        question: 'Which gas is primarily released during the light reaction of photosynthesis?',
        selectedAnswer: 'Oxygen (O₂)',
        correctAnswer: 'Oxygen (O₂)',
        isCorrect: true,
      },
      {
        question: 'Where does the Calvin cycle take place in chloroplasts?',
        selectedAnswer: 'Stroma',
        correctAnswer: 'Stroma',
        isCorrect: true,
      },
      {
        question: 'What pigment absorbs sunlight in chloroplasts?',
        selectedAnswer: 'Chlorophyll a',
        correctAnswer: 'Chlorophyll a',
        isCorrect: true,
      },
    ],
  },
  {
    id: 'prev-3',
    subject: 'English',
    teacher: 'Ms. Alvira Pinto',
    title: 'Poetic Devices & Grammar Comprehension',
    date: '2026-09-28',
    score: '9/10',
    result: 'Pass',
    summary: [
      {
        question: "Identify the figurative language device: 'The golden sun smiled down upon the meadows'.",
        selectedAnswer: 'Personification',
        correctAnswer: 'Personification',
        isCorrect: true,
      },
      {
        question: "Choose the passive voice: 'She composed a sonnet.'",
        selectedAnswer: 'A sonnet was composed by her.',
        correctAnswer: 'A sonnet was composed by her.',
        isCorrect: true,
      },
      {
        question: "Find the antonym of 'Meticulous'",
        selectedAnswer: 'Careless',
        correctAnswer: 'Careless',
        isCorrect: true,
      },
    ],
  },
];

function Academic() {
  const [tab, setTab] = useState('details');
  const [outcomesList, setOutcomesList] = useState<LearningOutcome[]>(learningOutcomes);
  const [loFilter, setLoFilter] = useState<'all' | 'published' | 'submitted' | 'not-submitted'>('all');
  const [tuSubjectFilter, setTuSubjectFilter] = useState<string>('all');
  const [tuDateFilter, setTuDateFilter] = useState<string>('');
  const [tuSubjectDropdownOpen, setTuSubjectDropdownOpen] = useState<boolean>(false);
  const [calOpen, setCalOpen] = useState<boolean>(false);
  const [calDate, setCalDate] = useState<Date>(() => new Date(2026, 9, 1));
  const tuSubjectDropdownRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

  // View Assessment & Submit Task Modal States
  const [viewingAssessment, setViewingAssessment] = useState<LearningOutcome | null>(null);
  const [submittingTask, setSubmittingTask] = useState<LearningOutcome | null>(null);
  const [taskNotes, setTaskNotes] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; date: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Self assessment state
  const [subjectAssessments] = useState<SubjectAssessment[]>(availableSubjectAssessments);
  const [previousAssessments, setPreviousAssessments] = useState<CompletedAssessment[]>(initialPreviousAssessments);
  const [activeQuiz, setActiveQuiz] = useState<SubjectAssessment | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [viewingQuizResult, setViewingQuizResult] = useState<CompletedAssessment | null>(null);

  const handleStartAssessment = (assessment: SubjectAssessment) => {
    setActiveQuiz(assessment);
    setQuizAnswers({});
  };

  const handleSubmitAssessment = () => {
    if (!activeQuiz) return;
    let correctCount = 0;
    const summary = activeQuiz.questions.map((q, idx) => {
      const selectedIdx = quizAnswers[idx];
      const selectedAnswer = selectedIdx !== undefined ? q.options[selectedIdx] : 'Not answered';
      const isCorrect = selectedIdx === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        question: q.question,
        selectedAnswer,
        correctAnswer: q.options[q.correctIndex],
        isCorrect,
      };
    });

    const percentage = Math.round((correctCount / activeQuiz.questions.length) * 100);
    const result: 'Pass' | 'Needs Review' = percentage >= 50 ? 'Pass' : 'Needs Review';
    const scoreStr = `${correctCount}/${activeQuiz.questions.length}`;

    const newCompleted: CompletedAssessment = {
      id: `prev-${Date.now()}`,
      subject: activeQuiz.subject,
      teacher: activeQuiz.teacher,
      title: activeQuiz.title,
      date: '2026-10-23',
      score: scoreStr,
      result,
      summary,
    };

    setPreviousAssessments(prev => [newCompleted, ...prev]);
    setActiveQuiz(null);
    showToast(`${activeQuiz.subject} self-assessment submitted! Score: ${scoreStr} (${percentage}%) - ${result}.`, 'success');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tuSubjectDropdownRef.current && !tuSubjectDropdownRef.current.contains(event.target as Node)) {
        setTuSubjectDropdownOpen(false);
      }
      if (calRef.current && !calRef.current.contains(event.target as Node)) {
        setCalOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loPublished = outcomesList.filter(o => o.status === 'published');
  const loSubmitted = outcomesList.filter(o => o.status === 'submitted');
  const loNotSubmitted = outcomesList.filter(o => o.status === 'not-submitted');

  return (
    <div className="animate-fade-in">
      <PageHeader title="Academic" breadcrumbs={['Parent', 'Academic']} />
      <Tabs
        tabs={[
          { label: 'My Academic Details', key: 'details' },
          { label: 'Learning Outcomes', key: 'outcomes', count: loPublished.length },
          { label: "Teacher's Update", key: 'updates', count: teacherUpdates.length },
          { label: 'Self Assessment', key: 'assessment' },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div className="mt-5">
        {tab === 'details' && (() => {
          const totalCompleted = subjects.reduce((sum, s) => sum + s.completedChapters, 0);
          const totalChapters = subjects.reduce((sum, s) => sum + s.totalChapters, 0);
          const overallPct = totalChapters > 0 ? Math.round((totalCompleted / totalChapters) * 100) : 0;

          const subjectMeta: Record<string, {
            icon: string;
            color: string;
            lightBg: string;
            borderColor: string;
            code: string;
            dept: string;
          }> = {
            'Mathematics': {
              icon: 'Scale',
              color: '#2563EB',
              lightBg: '#EFF6FF',
              borderColor: '#DBEAFE',
              code: 'MATH-101',
              dept: 'Analytical & Numeric',
            },
            'English': {
              icon: 'BookOpen',
              color: '#7C3AED',
              lightBg: '#F5F3FF',
              borderColor: '#DDD6FE',
              code: 'ENG-102',
              dept: 'Literature & Grammar',
            },
            'Science': {
              icon: 'Eye',
              color: '#059669',
              lightBg: '#ECFDF5',
              borderColor: '#A7F3D0',
              code: 'SCI-103',
              dept: 'Physics & Bio Labs',
            },
            'Social Studies': {
              icon: 'GraduationCap',
              color: '#D97706',
              lightBg: '#FFFBEB',
              borderColor: '#FDE68A',
              code: 'SST-104',
              dept: 'Civics & Geography',
            },
            'Hindi': {
              icon: 'BookOpen',
              color: '#E11D48',
              lightBg: '#FFF1F2',
              borderColor: '#FECDD3',
              code: 'HIN-105',
              dept: 'Sahitya & Vyakaran',
            },
            'Computer Science': {
              icon: 'LayoutDashboard',
              color: '#0891B2',
              lightBg: '#ECFEFF',
              borderColor: '#A5F3FC',
              code: 'CS-106',
              dept: 'Coding & Logic',
            },
          };

          return (
            <div className="space-y-5 animate-fade-in">
              {/* Simple & Clean Academic Overview Card */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_4px_#0000000a] p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] sm:text-[18px] font-bold text-[#0F172A] tracking-tight">
                      Syllabus & Learning Progress
                    </h3>
                    <p className="text-[12px] text-[#64748B] mt-0.5">
                      Academic Year 2026-27 • Grade 8-A • 6 Core Subjects
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[12px] text-[#64748B] font-medium">
                      <strong className="text-[14px] font-bold text-[#0F172A]">{totalCompleted}</strong> / {totalChapters} Chapters
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[12px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                      {overallPct}% Completed
                    </span>
                  </div>
                </div>

                {/* Minimal Clean Progress Bar */}
                <div className="mt-3.5 w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]/80">
                  <div
                    className="h-full rounded-full bg-[#10B981] transition-all duration-500 ease-out"
                    style={{ width: `${overallPct}%` }}
                  />
                </div>
              </div>

              {/* Clean, Elegant Subject Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {subjects.map(s => {
                  const meta = subjectMeta[s.name] || {
                    icon: 'BookOpen',
                    color: '#7C612A',
                    lightBg: '#FDF8F0',
                    borderColor: '#F3E5D0',
                    code: 'SUB-100',
                    dept: 'General Studies',
                  };
                  const pct = Math.round((s.completedChapters / s.totalChapters) * 100);
                  const remaining = s.totalChapters - s.completedChapters;

                  return (
                    <div
                      key={s.id}
                      className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_10px_#0f172a06] hover:shadow-[0_6px_20px_#0f172a0a] hover:border-[#CBD5E1] transition-all duration-200 p-5 flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Icon, Subject Title, Teacher, and Percentage */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                              style={{ backgroundColor: meta.lightBg, color: meta.color, borderColor: meta.borderColor }}
                            >
                              <Icon name={meta.icon} size={18} />
                            </div>
                            <div>
                              <h4 className="font-bold text-[16px] text-[#0F172A] leading-tight">
                                {s.name}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-1">
                                <TeacherAvatar name={s.teacher} size={16} />
                                <p className="text-[12px] text-[#64748B] font-medium">
                                  {s.teacher}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Middle Stats & Progress */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-[12px] text-[#64748B]">
                            <span className="font-medium">
                              <span className="font-bold text-[#0F172A] text-[14px]">{s.completedChapters}</span> of {s.totalChapters} chapters
                            </span>
                            <span className="text-[12px] text-[#94A3B8]">
                              {remaining} remaining
                            </span>
                          </div>

                          {/* Progress track */}
                          <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]/70">
                            <div
                              className="h-full rounded-full transition-all duration-500 ease-out"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: meta.color,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
        {tab === 'outcomes' && (() => {
          const filteredOutcomes = outcomesList.filter(lo => {
            if (loFilter === 'all') return true;
            return lo.status === loFilter;
          });

          return (
            <div className="space-y-5 animate-fade-in">
              {/* 3 Clean & Professional KPI Metric Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                {/* Card 1: Published */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_1px_4px_#0000000a]">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB]">
                      <Icon name="FileText" size={18} />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                      Under Study
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="text-[24px] sm:text-[30px] font-extrabold text-[#0F172A] tracking-tight">
                      {loPublished.length}
                    </div>
                    <p className="text-[12px] font-semibold text-[#475569] mt-1">
                      Active / Published
                    </p>
                  </div>
                </div>

                {/* Card 2: Submitted */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_1px_4px_#0000000a]">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
                      <Icon name="CheckCircle" size={18} />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      Completed
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="text-[24px] sm:text-[30px] font-extrabold text-[#0F172A] tracking-tight">
                      {loSubmitted.length}
                    </div>
                    <p className="text-[12px] font-semibold text-[#475569] mt-1">
                      Submitted & Verified
                    </p>
                  </div>
                </div>

                {/* Card 3: Pending Submission */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_1px_4px_#0000000a]">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#DC2626]">
                      <Icon name="AlertCircle" size={18} />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                      Action Needed
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="text-[24px] sm:text-[30px] font-extrabold text-[#0F172A] tracking-tight">
                      {loNotSubmitted.length}
                    </div>
                    <p className="text-[12px] font-semibold text-[#475569] mt-1">
                      Pending Submission
                    </p>
                  </div>
                </div>
              </div>

              {/* Filter pills bar */}
              <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] text-[12px] font-medium">
                  <button
                    type="button"
                    onClick={() => setLoFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${loFilter === 'all' ? 'bg-white text-[#0F172A] font-semibold shadow-[0_1px_3px_#00000010]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
                  >
                    All ({outcomesList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoFilter('published')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${loFilter === 'published' ? 'bg-white text-[#2563EB] font-semibold shadow-[0_1px_3px_#00000010]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
                  >
                    Published ({loPublished.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoFilter('submitted')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${loFilter === 'submitted' ? 'bg-white text-[#059669] font-semibold shadow-[0_1px_3px_#00000010]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
                  >
                    Submitted ({loSubmitted.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoFilter('not-submitted')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${loFilter === 'not-submitted' ? 'bg-white text-[#DC2626] font-semibold shadow-[0_1px_3px_#00000010]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
                  >
                    Not Submitted ({loNotSubmitted.length})
                  </button>
                </div>
              </div>

              {/* Standardized Outcomes Cards */}
              <div className="space-y-3.5">
                {filteredOutcomes.map(lo => {
                  const meta = subjectMeta[lo.subject] || {
                    icon: 'BookOpen',
                    color: '#7C612A',
                    lightBg: '#FDF8F0',
                    borderColor: '#F3E5D0',
                    teacher: 'Subject Faculty',
                  };

                  return (
                    <div
                      key={lo.id}
                      className="bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all p-4 sm:p-5"
                    >
                      {/* Header: Subject, Teacher & Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="px-2.5 py-0.5 rounded-md text-[11.5px] font-semibold border"
                            style={{
                              backgroundColor: meta.lightBg,
                              color: meta.color,
                              borderColor: meta.borderColor,
                            }}
                          >
                            {lo.subject}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                          <div className="flex items-center gap-1.5 text-[12px] text-[#475569] font-medium">
                            <TeacherAvatar name={meta.teacher} size={18} />
                            <span>{meta.teacher}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[12px] text-[#64748B] font-medium self-start sm:self-center">
                          <span>{lo.date}</span>
                        </div>
                      </div>

                      {/* Title & Content */}
                      <div className="mt-2.5">
                        <h4 className="text-[16px] font-bold text-[#17153A] leading-snug">
                          {lo.title}
                        </h4>
                        <p className="text-[14px] text-[#475569] leading-relaxed mt-1.5 whitespace-pre-line">
                          {lo.description}
                        </p>
                      </div>

                      {/* Footer Action Row */}
                      <div className="mt-3.5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-3 text-[12px]">
                        <div className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
                          <span className={`w-1.5 h-1.5 rounded-full ${lo.status === 'not-submitted' ? 'bg-[#EF4444]' : lo.status === 'submitted' ? 'bg-[#10B981]' : 'bg-[#3B82F6]'}`} />
                          <span className="font-medium">
                            {lo.status === 'not-submitted' ? 'Due 18 Oct' : lo.status === 'submitted' ? 'Graded' : 'Active'}
                          </span>
                        </div>

                        {lo.status === 'not-submitted' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSubmittingTask(lo);
                              setAttachedFiles([
                                {
                                  name: `${lo.title.split(' ')[0]}_Lab_Assignment_Aarav.pdf`,
                                  size: '2.4 MB',
                                  date: 'Just now',
                                },
                              ]);
                              setTaskNotes('');
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-medium text-white bg-[#17153A] hover:bg-[#7C612A] shadow-2xs transition-all cursor-pointer"
                          >
                            <Icon name="iconoven:upload" size={16} />
                            <span>Submit Task</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setViewingAssessment(lo)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-medium text-[#17153A] bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] shadow-2xs transition-all cursor-pointer"
                          >
                            <Icon name="iconamoon:eye-light" size={16} className="text-[#64748B]" />
                            <span>View Assessment</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
        {tab === 'updates' && (() => {
          const subjectsList = Array.from(new Set(teacherUpdates.map(u => u.subject)));
          const filteredUpdates = teacherUpdates.filter(tu => {
            const matchesSubject = tuSubjectFilter === 'all' || tu.subject.toLowerCase() === tuSubjectFilter.toLowerCase();
            const matchesDate = !tuDateFilter || tu.date === tuDateFilter;
            return matchesSubject && matchesDate;
          });

          return (
            <div className="space-y-4 animate-fade-in">
              {/* Filter Bar: Subject & Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Custom Filter by Subject Dropdown */}
                  <div className="flex items-center gap-2">
                    <div className="relative" ref={tuSubjectDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setTuSubjectDropdownOpen(prev => !prev)}
                        className="inline-flex items-center justify-between gap-2.5 px-3.5 py-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#CBD5E1] text-[12px] font-medium text-[#0F172A] shadow-[0_1px_2px_#00000006] transition-all cursor-pointer min-w-[155px]"
                      >
                        <span className="flex items-center gap-2 truncate">
                          {tuSubjectFilter === 'all' ? (
                            <span className="font-semibold text-[#0F172A]">All Subjects</span>
                          ) : (
                            <span className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: (subjectMeta[tuSubjectFilter] || subjectMeta['Mathematics']).color }}
                              />
                              <span className="truncate">{tuSubjectFilter}</span>
                            </span>
                          )}
                        </span>
                        <Icon
                          name="ChevronDown"
                          size={14}
                          className={`text-[#64748B] transition-transform duration-200 shrink-0 ${tuSubjectDropdownOpen ? 'rotate-180 text-[#7C612A]' : ''}`}
                        />
                      </button>

                      {/* Custom Dropdown Menu */}
                      {tuSubjectDropdownOpen && (
                        <div className="absolute left-0 top-full mt-1.5 w-52 bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_10px_25px_#0f172a12] p-1.5 z-30 animate-fade-in">
                          {/* Option: All Subjects */}
                          <button
                            type="button"
                            onClick={() => {
                              setTuSubjectFilter('all');
                              setTuSubjectDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] transition-all cursor-pointer ${tuSubjectFilter === 'all'
                              ? 'bg-[#FDF8F0] text-[#7C612A] font-bold border border-[#F3E5D0]'
                              : 'text-[#334155] hover:bg-[#F8FAFC] font-medium'
                              }`}
                          >
                            <span>All Subjects</span>
                            <span className="text-[12px] text-[#94A3B8] font-normal">
                              ({teacherUpdates.length})
                            </span>
                          </button>
                          {/* Option: Each Subject */}
                          <div className="space-y-0.5">
                            {subjectsList.map(subj => {
                              const meta = subjectMeta[subj] || {
                                icon: 'BookOpen',
                                color: '#7C612A',
                                lightBg: '#FDF8F0',
                                borderColor: '#F3E5D0',
                                teacher: 'Subject Faculty',
                              };
                              const isSelected = tuSubjectFilter.toLowerCase() === subj.toLowerCase();
                              const count = teacherUpdates.filter(u => u.subject === subj).length;

                              return (
                                <button
                                  key={subj}
                                  type="button"
                                  onClick={() => {
                                    setTuSubjectFilter(subj);
                                    setTuSubjectDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-[12px] transition-all cursor-pointer ${isSelected
                                    ? 'bg-[#FDF8F0] text-[#7C612A] font-bold border border-[#F3E5D0]'
                                    : 'text-[#334155] hover:bg-[#F8FAFC] font-medium'
                                    }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="truncate">{subj}</span>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="text-[12px] text-[#94A3B8] font-normal">({count})</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Custom Filter by Date Dropdown */}
                  <div className="relative" ref={calRef}>
                    <button
                      type="button"
                      onClick={() => setCalOpen(prev => !prev)}
                      className="inline-flex items-center justify-between gap-2.5 px-3.5 py-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#CBD5E1] text-[12px] font-medium text-[#0F172A] shadow-[0_1px_2px_#00000006] transition-all cursor-pointer min-w-[155px]"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Icon name="hugeicons:calendar-date-1" size={14} className="text-[#7C612A] shrink-0" />
                        {tuDateFilter ? (
                          <span className="font-semibold text-[#0F172A]">
                            {new Date(tuDateFilter + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        ) : (
                          <span className="text-[#64748B]">Select Date</span>
                        )}
                      </span>
                      {tuDateFilter ? (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTuDateFilter('');
                          }}
                          className="text-[#94A3B8] hover:text-[#0F172A] p-0.5 cursor-pointer"
                        >
                          <Icon name="XCircle" size={13} />
                        </span>
                      ) : (
                        <Icon
                          name="ChevronDown"
                          size={14}
                          className={`text-[#64748B] transition-transform duration-200 shrink-0 ${calOpen ? 'rotate-180 text-[#7C612A]' : ''}`}
                        />
                      )}
                    </button>

                    {/* Backdrop for closing popover */}
                    {calOpen && (
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setCalOpen(false)}
                      />
                    )}

                    {/* Custom Calendar Dropdown Popup */}
                    {calOpen && (() => {
                      const calYear = calDate.getFullYear();
                      const calMonth = calDate.getMonth();
                      const monthNames = [
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                      ];
                      const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
                      const daysInCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
                      const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();

                      const prevMonthDays = Array.from({ length: firstDayIndex }, (_, i) => daysInPrevMonth - firstDayIndex + 1 + i);
                      const currentMonthDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
                      const totalCells = firstDayIndex + daysInCurrentMonth;
                      const nextMonthDaysCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
                      const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => i + 1);

                      const datesWithUpdates = new Set(teacherUpdates.map(u => u.date));

                      return (
                        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 w-72 bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_12px_30px_#0f172a15] p-3.5 z-40 animate-fade-in select-none">
                          {/* Month Navigation */}
                          <div className="flex items-center justify-between mb-3 px-1">
                            <button
                              type="button"
                              onClick={() => setCalDate(new Date(calYear, calMonth - 1, 1))}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                            >
                              <Icon name="solar:alt-arrow-left-linear" size={16} />
                            </button>
                            <span className="text-[12px] font-bold text-[#0F172A]">
                              {monthNames[calMonth]} {calYear}
                            </span>
                            <button
                              type="button"
                              onClick={() => setCalDate(new Date(calYear, calMonth + 1, 1))}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                            >
                              <Icon name="solar:alt-arrow-right-linear" size={16} />
                            </button>
                          </div>

                          {/* Days of Week Header */}
                          <div className="grid grid-cols-7 gap-1 text-center mb-1">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                              <span key={d} className="text-[12px] font-semibold text-[#94A3B8]">
                                {d}
                              </span>
                            ))}
                          </div>

                          {/* Calendar Days Grid */}
                          <div className="grid grid-cols-7 gap-1 text-center">
                            {/* Previous month days */}
                            {prevMonthDays.map(d => (
                              <span key={`prev-${d}`} className="h-8 flex items-center justify-center text-[12px] text-[#CBD5E1]">
                                {d}
                              </span>
                            ))}

                            {/* Current month days */}
                            {currentMonthDays.map(d => {
                              const mStr = String(calMonth + 1).padStart(2, '0');
                              const dStr = String(d).padStart(2, '0');
                              const fullDate = `${calYear}-${mStr}-${dStr}`;
                              const isSelected = tuDateFilter === fullDate;
                              const hasUpdate = datesWithUpdates.has(fullDate);

                              return (
                                <button
                                  key={`curr-${d}`}
                                  type="button"
                                  onClick={() => {
                                    setTuDateFilter(fullDate);
                                    setCalOpen(false);
                                  }}
                                  className={`h-8 w-8 mx-auto rounded-xl flex flex-col items-center justify-center text-[12px] transition-all relative cursor-pointer ${isSelected
                                    ? 'bg-[#7C612A] text-white font-bold shadow-sm'
                                    : hasUpdate
                                      ? 'text-[#0F172A] font-bold hover:bg-[#FDF8F0] hover:text-[#7C612A]'
                                      : 'text-[#334155] hover:bg-[#F8FAFC]'
                                    }`}
                                >
                                  <span>{d}</span>
                                  {hasUpdate && !isSelected && (
                                    <span className="w-1 h-1 rounded-full bg-[#7C612A] absolute bottom-1" />
                                  )}
                                </button>
                              );
                            })}

                            {/* Next month days */}
                            {nextMonthDays.map(d => (
                              <span key={`next-${d}`} className="h-8 flex items-center justify-center text-[12px] text-[#CBD5E1]">
                                {d}
                              </span>
                            ))}
                          </div>

                          {/* Footer: Quick Actions */}
                          <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[12px] px-1">
                            <button
                              type="button"
                              onClick={() => {
                                setTuDateFilter('');
                                setCalOpen(false);
                              }}
                              className="text-[#64748B] hover:text-[#0F172A] font-medium transition-colors cursor-pointer"
                            >
                              Clear Date
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const latest = '2026-10-13';
                                setCalDate(new Date(2026, 9, 1));
                                setTuDateFilter(latest);
                                setCalOpen(false);
                              }}
                              className="text-[#7C612A] font-semibold hover:underline cursor-pointer"
                            >
                              Latest Update
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Clear Filters Button */}
                  {(tuSubjectFilter !== 'all' || tuDateFilter !== '') && (
                    <button
                      type="button"
                      onClick={() => {
                        setTuSubjectFilter('all');
                        setTuDateFilter('');
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold text-[#7C612A] hover:bg-[#FDF8F0] border border-[#F3E5D0] transition-colors cursor-pointer"
                    >
                      <Icon name="XCircle" size={13} />
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Updates List */}
              {filteredUpdates.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] mx-auto mb-3">
                    <Icon name="FileText" size={22} />
                  </div>
                  <h4 className="text-[14px] font-bold text-[#0F172A]">No updates found</h4>
                  <p className="text-[12px] text-[#64748B] mt-1 max-w-sm mx-auto">
                    No teacher announcements match the selected date or subject.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTuSubjectFilter('all');
                      setTuDateFilter('');
                    }}
                    className="mt-3 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold text-[#7C612A] bg-[#FDF8F0] border border-[#F3E5D0] hover:bg-[#F8EEDD] transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredUpdates.map(tu => {
                    const meta = subjectMeta[tu.subject] || {
                      icon: 'BookOpen',
                      color: '#7C612A',
                      lightBg: '#FDF8F0',
                      borderColor: '#F3E5D0',
                      teacher: 'Subject Faculty',
                    };

                    return (
                      <div
                        key={tu.id}
                        className="bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all p-4 sm:p-5"
                      >
                        {/* Header: Subject, Teacher & Date */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="px-2.5 py-0.5 rounded-md text-[11.5px] font-semibold border"
                              style={{
                                backgroundColor: meta.lightBg,
                                color: meta.color,
                                borderColor: meta.borderColor,
                              }}
                            >
                              {tu.subject}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                            <div className="flex items-center gap-1.5 text-[12px] text-[#475569] font-medium">
                              <TeacherAvatar name={meta.teacher} size={18} />
                              <span>{meta.teacher}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-[12px] text-[#64748B] font-medium self-start sm:self-center">
                            <span>{tu.date}</span>
                          </div>
                        </div>

                        {/* Title & Content */}
                        <div className="mt-2.5">
                          <h4 className="text-[16px] font-bold text-[#17153A] leading-snug">
                            {tu.title}
                          </h4>
                          <p className="text-[14px] text-[#475569] leading-relaxed mt-1.5 whitespace-pre-line">
                            {tu.content}
                          </p>
                        </div>

                        {/* Attachment Download Action if hasAttachment */}
                        {tu.hasAttachment && (
                          <div className="mt-3.5 pt-3 border-t border-[#F1F5F9] flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => showToast(`Downloading attachment for ${tu.title}...`, 'success')}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-medium text-[#17153A] bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#7C612A] shadow-2xs transition-all cursor-pointer"
                            >
                              <Icon name="hugeicons:download-01" size={16} className="text-[#64748B]" />
                              <span>Download Attachment</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}
        {tab === 'assessment' && (
          <div className="space-y-6">
            {/* Subject-Wise Assessment Cards with proper responsive spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {subjectAssessments.map((assessment) => {
                const meta = subjectMeta[assessment.subject] || {
                  icon: 'BookOpen',
                  color: '#7C612A',
                  lightBg: '#FAF7F2',
                  borderColor: '#E8DFC8',
                };

                return (
                  <div
                    key={assessment.id}
                    className="bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all p-5 shadow-xs hover:shadow-card-hover flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top: Subject Icon + Main Title (Subject Name) */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                          style={{
                            backgroundColor: meta.lightBg,
                            color: meta.color,
                            borderColor: meta.borderColor,
                          }}
                        >
                          <Icon name={meta.icon} size={20} />
                        </div>
                        <h3 className="text-[17px] font-bold text-[#17153A] transition-colors leading-tight">
                          {assessment.subject}
                        </h3>
                      </div>

                      {/* Teacher Attribution with TeacherAvatar */}
                      <div className="flex items-center gap-2.5 mt-4 pt-3.5 border-t border-[#F1F5F9]">
                        <TeacherAvatar name={assessment.teacher} size={24} />
                        <div className="min-w-0 flex-1">
                          <span className="block text-[12px] text-[#64748B] leading-none">Assigned by</span>
                          <span className="text-[14px] font-semibold text-[#17153A] truncate block mt-0.5">
                            {assessment.teacher}
                          </span>
                        </div>
                      </div>

                      {/* Assessment Meta Badges */}
                      <div className="flex items-center justify-between gap-2 mt-3.5 text-[11.5px] text-[#64748B] bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#F1F5F9]">
                        <span className="flex items-center gap-1 font-medium text-[#475569]">
                          <Icon name="HelpCircle" size={13} className="text-[#64748B]" />
                          {assessment.questions.length} Questions
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium text-[#475569]">
                          <Icon name="Clock" size={13} className="text-[#64748B]" />
                          {assessment.duration}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium text-[#475569]">
                          <Icon name="Award" size={13} className="text-[#64748B]" />
                          {assessment.totalMarks} Marks
                        </span>
                      </div>
                    </div>

                    {/* Individual Start Assessment Button */}
                    <div className="mt-4 pt-3.5 border-t border-[#F1F5F9]">
                      <button
                        type="button"
                        onClick={() => handleStartAssessment(assessment)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-semibold text-white bg-[#17153A] hover:bg-[#7C612A] shadow-2xs transition-all cursor-pointer"
                      >
                        <Icon name="Play" size={14} />
                        <span>Start Assessment</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Previous Assessments Card */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#F1F5F9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-[14px] font-bold text-[#17153A]">Previous Assessments</h4>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-semibold uppercase tracking-wider text-[#64748B]">
                      <th className="px-5 py-3">Subject</th>
                      <th className="px-4 py-3">Teacher</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-center">Score</th>
                      <th className="px-4 py-3 text-center">Result</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
                    {previousAssessments.map((a) => {
                      const meta = subjectMeta[a.subject] || { color: '#7C612A' };
                      return (
                        <tr key={a.id} className="hover:bg-[#F8FAFC]/75 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-[#17153A]">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: meta.color }}
                              />
                              <span className="font-semibold text-[#17153A]">{a.subject}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-[#17153A]">
                            <div className="flex items-center gap-2">
                              <TeacherAvatar name={a.teacher} size={20} />
                              <span className="font-medium text-[12.5px] text-[#334155] whitespace-nowrap">
                                {a.teacher}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-[#64748B] text-[12px] whitespace-nowrap">
                            {a.date}
                          </td>
                          <td className="px-4 py-3.5 text-center font-bold text-[#17153A] font-mono">
                            {a.score}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold border ${a.result === 'Pass'
                              ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                              : 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                              }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${a.result === 'Pass' ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                              {a.result}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setViewingQuizResult(a)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#17153A] bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] shadow-2xs transition-all cursor-pointer"
                            >
                              <Icon name="iconamoon:eye-light" size={16} className="text-[#64748B]" />
                              <span>View Assessment</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Assessment Details Modal */}
      <Modal
        open={!!viewingAssessment}
        onClose={() => setViewingAssessment(null)}
        title="Assessment Details"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              icon={<Icon name="hugeicons:download-01" size={13} />}
              onClick={() => showToast(`Assessment_Report_${viewingAssessment?.id.toUpperCase()}.pdf downloaded!`, 'success')}
            >
              Download PDF
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setViewingAssessment(null)}
              className="!bg-[#17153A] text-white hover:!bg-[#7C612A]"
            >
              Close
            </Button>
          </div>
        }
      >
        {viewingAssessment && (() => {
          const evalDetail = assessmentDetailsMap[viewingAssessment.id] || {
            score: viewingAssessment.status === 'submitted' ? '9.0 / 10' : '9.2 / 10',
            percentage: 92,
            grade: 'A (Excellent)',
            evaluatedDate: viewingAssessment.date,
            submissionDate: viewingAssessment.date,
            evaluatedBy: subjects.find(s => s.name === viewingAssessment.subject)?.teacher || 'Mrs. Meera Iyer',
            evaluatorRole: `${viewingAssessment.subject} Faculty`,
            rubrics: [
              { name: 'Conceptual Mastery', score: '3.8', max: '4.0', pct: 95, remark: 'Thorough comprehension of the foundational core topic' },
              { name: 'Analytical Application', score: '2.7', max: '3.0', pct: 90, remark: 'Applied principles accurately to scenario problems' },
              { name: 'Completeness & Accuracy', score: '2.7', max: '3.0', pct: 90, remark: 'Organized presentation with detailed working steps' },
            ],
            feedback: `Aarav displayed commendable understanding in ${viewingAssessment.title}. His explanations were structured and demonstrated critical thinking.`,
            keyStrengths: ['Thorough working steps', 'Strong grasp of core definitions', 'Timely submission'],
            areasOfImprovement: ['Can incorporate supplementary diagrams to strengthen visual presentation'],
            submittedFileName: `${viewingAssessment.subject}_Assignment_Aarav.pdf`,
            submittedFileSize: '2.1 MB',
          };

          const sc = subjectThemeColors[viewingAssessment.subject] || { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#DBEAFE]' };

          return (
            <div className="space-y-4 text-[14px]">
              {/* Header Info */}
              <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[12px] font-semibold border ${sc.bg} ${sc.text} ${sc.border}`}>
                    {viewingAssessment.subject}
                  </span>
                  <span className="text-[12px] font-bold text-[#059669]">
                    Score: {evalDetail.score}
                  </span>
                </div>
                <h4 className="text-[14px] font-bold text-[#17153A]">{viewingAssessment.title}</h4>
                <div className="flex items-center justify-between text-[11.5px] text-[#64748B] mt-2 pt-2 border-t border-[#E2E8F0]">
                  <div className="flex items-center gap-1.5">
                    <TeacherAvatar name={evalDetail.evaluatedBy} size={18} />
                    <span>Evaluator: <strong className="text-[#17153A] font-semibold">{evalDetail.evaluatedBy}</strong></span>
                  </div>
                  <span>Evaluated on {evalDetail.evaluatedDate}</span>
                </div>
              </div>

              {/* Rubric Breakdown (Clean simple table) */}
              <div>
                <p className="text-[11.5px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Rubric & Scores</p>
                <div className="border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#F1F5F9]">
                  {evalDetail.rubrics.map((r, i) => (
                    <div key={i} className="px-3.5 py-2 flex items-center justify-between text-[12px] bg-white">
                      <div>
                        <span className="font-medium text-[#17153A]">{r.name}</span>
                        <p className="text-[12px] text-[#64748B]">{r.remark}</p>
                      </div>
                      <span className="font-semibold text-[#17153A] shrink-0 ml-3">{r.score} / {r.max}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher Feedback (Simple clean box) */}
              <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white text-[12px]">
                <p className="text-[12px] font-bold uppercase tracking-wider text-[#64748B] mb-1">Teacher Remarks</p>
                <p className="text-[#334155] leading-relaxed italic">
                  "{evalDetail.feedback}"
                </p>
              </div>

              {/* Attachment */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[12px]">
                <div className="flex items-center gap-2 truncate">
                  <Icon name="reicon:docs" size={16} className="text-[#2563EB] shrink-0" />
                  <span className="font-medium text-[#17153A] truncate">{evalDetail.submittedFileName}</span>
                  <span className="text-[12px] text-[#94A3B8] shrink-0">({evalDetail.submittedFileSize})</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast(`Downloading ${evalDetail.submittedFileName}...`, 'success')}
                  className="text-[11.5px] font-semibold text-[#7C612A] hover:underline shrink-0 ml-3 cursor-pointer"
                >
                  Download
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Submit Task Modal */}
      <Modal
        open={!!submittingTask}
        onClose={() => { if (!isSubmitting) setSubmittingTask(null); }}
        title="Submit Assignment"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => setSubmittingTask(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isSubmitting || attachedFiles.length === 0}
              onClick={() => {
                if (!submittingTask) return;
                setIsSubmitting(true);
                setTimeout(() => {
                  setIsSubmitting(false);
                  setOutcomesList(prev => prev.map(item => item.id === submittingTask.id ? { ...item, status: 'submitted' } : item));
                  showToast(`Task "${submittingTask.title}" submitted successfully! Sent to teacher for grading.`, 'success');
                  setSubmittingTask(null);
                  setTaskNotes('');
                  setAttachedFiles([]);
                }, 400);
              }}
              className="!bg-[#17153A] text-white hover:!bg-[#7C612A]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
            </Button>
          </div>
        }
      >
        {submittingTask && (() => {
          const teacher = subjects.find(s => s.name === submittingTask.subject)?.teacher || 'Mrs. Deepika Nair';
          const sc = subjectThemeColors[submittingTask.subject] || { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#DBEAFE]' };

          return (
            <div className="space-y-3.5 text-[14px]">
              {/* Task Details */}
              <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[12px] font-semibold border ${sc.bg} ${sc.text} ${sc.border}`}>
                    {submittingTask.subject}
                  </span>
                  <span className="text-[11.5px] text-[#64748B]">Due 18 Oct 2026</span>
                </div>
                <h4 className="text-[14px] font-bold text-[#17153A] leading-snug">
                  {submittingTask.title}
                </h4>
                <p className="text-[12px] text-[#475569] mt-1 leading-relaxed">
                  {submittingTask.description}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E2E8F0] text-[11.5px] text-[#64748B]">
                  <div className="flex items-center gap-1.5">
                    <TeacherAvatar name={teacher} size={16} />
                    <span>Teacher: <strong className="text-[#17153A]">{teacher}</strong></span>
                  </div>
                </div>
              </div>

              {/* Upload Zone */}
              <div>
                <label className="block text-[12px] font-medium text-[#17153A] mb-1">
                  Attached File (PDF/DOCX)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAttachedFiles([
                        {
                          name: file.name,
                          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                          date: 'Just now',
                        },
                      ]);
                      showToast(`File "${file.name}" attached!`, 'success');
                    }
                  }}
                />

                {attachedFiles.length === 0 ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 rounded-xl border border-dashed border-[#CBD5E1] hover:border-[#17153A] bg-white text-center cursor-pointer transition-colors"
                  >
                    <p className="text-[12px] font-medium text-[#17153A]">Click to choose file or drag here</p>
                    <p className="text-[12px] text-[#64748B] mt-0.5">Supports PDF or DOCX up to 10MB</p>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setAttachedFiles([
                          {
                            name: `${submittingTask.title.split(' ')[0]}_Assignment_Aarav.pdf`,
                            size: '2.4 MB',
                            date: 'Just now',
                          },
                        ]);
                        showToast('Sample assignment worksheet attached!', 'success');
                      }}
                      className="text-[12px] text-[#7C612A] hover:underline mt-1.5 font-medium cursor-pointer"
                    >
                      + Attach completed worksheet
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon name="reicon:docs" size={18} className="text-[#059669] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-[#17153A] truncate">{attachedFiles[0].name}</p>
                        <p className="text-[12px] text-[#64748B]">{attachedFiles[0].size} • Ready</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedFiles([])}
                      className="text-[11.5px] font-medium text-[#DC2626] hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-[12px] font-medium text-[#17153A] mb-1">
                  Student / Parent Notes (Optional)
                </label>
                <Textarea
                  value={taskNotes}
                  onChange={e => setTaskNotes(e.target.value)}
                  placeholder="Add any notes for the teacher..."
                  rows={2}
                  className="text-[12px]"
                />
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Self Assessment Review Modal */}
      <Modal
        open={!!viewingQuizResult}
        onClose={() => setViewingQuizResult(null)}
        title="Previous Self-Assessment Review"
        size="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[12px] text-[#64748B]">Score recorded on student profile</span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setViewingQuizResult(null)}
              className="!bg-[#7C612A] text-white"
            >
              Close
            </Button>
          </div>
        }
      >
        {viewingQuizResult && (() => {
          const sc = subjectMeta[viewingQuizResult.subject] || { lightBg: '#EFF6FF', color: '#2563EB', borderColor: '#DBEAFE' };

          return (
            <div className="space-y-4 text-[14px]">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: sc.lightBg,
                      color: sc.color,
                      borderColor: sc.borderColor,
                    }}
                  >
                    <Icon name={sc.icon || 'BookOpen'} size={20} />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-[#17153A] leading-tight">
                      {viewingQuizResult.subject}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[12px] text-[#475569]">
                      <div className="flex items-center gap-1.5 font-medium">
                        <TeacherAvatar name={viewingQuizResult.teacher} size={16} />
                        <span>Assigned by <strong className="text-[#17153A] font-semibold">{viewingQuizResult.teacher}</strong></span>
                      </div>
                      <span className="text-[#CBD5E1]">•</span>
                      <span className="text-[#64748B] text-[11.5px] font-mono">{viewingQuizResult.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center sm:pl-4 sm:border-l sm:border-[#E2E8F0]">
                  <div className="text-right">
                    <span className="text-[20px] font-extrabold text-[#059669] font-mono leading-none block">{viewingQuizResult.score}</span>
                    <span className="text-[10.5px] text-[#64748B] font-medium">Score</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[12px] font-bold uppercase tracking-wider border ${viewingQuizResult.result === 'Pass'
                    ? 'text-[#059669] bg-[#ECFDF5] border-[#A7F3D0]'
                    : 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]'
                    }`}>
                    {viewingQuizResult.result}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <h5 className="font-bold text-[12.5px] text-[#17153A] uppercase tracking-wide">
                  Question Summary ({viewingQuizResult.summary.length} Questions)
                </h5>
                {viewingQuizResult.summary.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white space-y-1.5 shadow-2xs">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-[14px] text-[#17153A] leading-snug">
                        Q{idx + 1}: {item.question}
                      </p>
                      <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[12px] font-semibold border ${item.isCorrect
                        ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                        : 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                        }`}>
                        <Icon name={item.isCorrect ? "Check" : "X"} size={12} />
                        {item.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-[12px] pt-1 border-t border-[#F1F5F9]">
                      <p className="text-[#475569]">
                        Selected Answer: <span className={`font-semibold ${item.isCorrect ? 'text-[#059669]' : 'text-[#DC2626]'}`}>{item.selectedAnswer}</span>
                      </p>
                      {!item.isCorrect && (
                        <p className="text-[#059669]">
                          Correct Answer: <span className="font-semibold">{item.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Subject-Specific Self-Assessment Quiz Modal */}
      <Modal
        open={!!activeQuiz}
        onClose={() => setActiveQuiz(null)}
        title={activeQuiz ? `Self-Assessment: ${activeQuiz.subject}` : 'Self-Assessment Quiz'}
        size="lg"
        footer={
          activeQuiz ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-[12px] text-[#64748B]">
                <strong className="text-[#17153A]">{Object.keys(quizAnswers).length}</strong> of {activeQuiz.questions.length} questions answered
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveQuiz(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmitAssessment}
                  className="!bg-[#17153A] hover:!bg-[#7C612A] text-white"
                >
                  Submit Assessment
                </Button>
              </div>
            </div>
          ) : undefined
        }
      >
        {activeQuiz && (() => {
          const sc = subjectMeta[activeQuiz.subject] || { lightBg: '#EFF6FF', color: '#2563EB', borderColor: '#DBEAFE', icon: 'BookOpen' };

          return (
            <div className="space-y-4 text-[14px]">
              {/* Header Overview Card */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: sc.lightBg,
                      color: sc.color,
                      borderColor: sc.borderColor,
                    }}
                  >
                    <Icon name={sc.icon} size={20} />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-[#17153A] leading-tight">
                      {activeQuiz.subject}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 text-[12px] text-[#475569] font-medium">
                      <TeacherAvatar name={activeQuiz.teacher} size={16} />
                      <span>Assigned by <strong className="text-[#17153A] font-semibold">{activeQuiz.teacher}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11.5px] text-[#475569] shrink-0 self-start sm:self-center">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-[#E2E8F0] font-medium flex items-center gap-1 shadow-2xs">
                    <Icon name="HelpCircle" size={13} className="text-[#64748B]" />
                    {activeQuiz.questions.length} Questions
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-[#E2E8F0] font-medium flex items-center gap-1 shadow-2xs">
                    <Icon name="Clock" size={13} className="text-[#64748B]" />
                    {activeQuiz.duration}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-[#E2E8F0] font-medium flex items-center gap-1 shadow-2xs">
                    <Icon name="Award" size={13} className="text-[#64748B]" />
                    {activeQuiz.totalMarks} Marks
                  </span>
                </div>
              </div>

              {/* Subject-Specific Questions List */}
              <div className="space-y-3.5">
                {activeQuiz.questions.map((q, qIdx) => {
                  const currentSelected = quizAnswers[qIdx];
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] transition-all space-y-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#F1F5F9] text-[11.5px]">
                        <span className="font-semibold text-[#17153A]">
                          Question {qIdx + 1} of {activeQuiz.questions.length}
                        </span>
                        <span className="text-[#64748B] font-semibold text-[12px] px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                          {q.marks} Mark
                        </span>
                      </div>

                      <p className="font-bold text-[#17153A] text-[13.5px] leading-snug">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="space-y-2 text-[12.5px] text-[#475569]">
                        {q.options.map((option, optIdx) => {
                          const isChecked = currentSelected === optIdx;
                          return (
                            <label
                              key={optIdx}
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                              className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer ${isChecked
                                ? 'bg-[#FAF7F2] border-[#7C612A] text-[#17153A] shadow-xs'
                                : 'border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]'
                                }`}
                            >
                              <input
                                type="radio"
                                name={`quiz_${activeQuiz.id}_q${qIdx}`}
                                checked={isChecked}
                                onChange={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                                className="w-4 h-4 accent-[#17153A] cursor-pointer"
                              />
                              <span className={`text-[12.5px] ${isChecked ? 'font-semibold text-[#17153A]' : 'text-[#334155]'}`}>
                                {option}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

function Attendance({ student }: { student?: typeof students[0] }) {
  const [month, setMonth] = useState(9); // October (0-indexed)
  const [year, setYear] = useState(2026);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedListModal, setSelectedListModal] = useState<'holiday' | 'weekend' | null>(null);
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    from: '2026-10-19',
    to: '2026-10-20',
    reason: 'Medical Leave',
    notes: '',
  });

  const formatLeaveDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
    }
    return dateStr;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = generateAttendance(year, month);
  const presentDays = days.filter(d => d.status === 'present').length;
  const absentDays = days.filter(d => d.status === 'absent').length;
  const holidayDays = days.filter(d => d.status === 'holiday').length;
  const weekendDays = days.filter(d => d.status === 'weekend').length;

  const liveToday = new Date();
  const liveTodayStr = `${liveToday.getFullYear()}-${String(liveToday.getMonth() + 1).padStart(2, '0')}-${String(liveToday.getDate()).padStart(2, '0')}`;
  const isToday = (dStr: string) => dStr === liveTodayStr;
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  return (
    <div className="animate-fade-in space-y-5 w-full">
      {/* Header with Title, Student Info, and Apply for Leave Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Breadcrumb items={['Parent Portal', 'Attendance']} />
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <h1 className="text-[20px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">Attendance</h1>
          </div>
        </div>

        <Button
          size="sm"
          variant="primary"
          icon={<Icon name="solar:pen-2-linear" size={14} />}
          onClick={() => {
            setShowLeaveModal(true);
            setLeaveSubmitted(false);
          }}
          className="!bg-[#7C612A] hover:!bg-[#644c1f] text-white self-start sm:self-auto shadow-xs"
        >
          Apply for Leave
        </Button>
      </div>

      {/* Top 4 Focused Stat Cards (Full Width 4-Column Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Present Days */}
        <div className="bg-white rounded-2xl border border-[#BBF7D0] p-4 sm:p-5 from-white via-white to-[#F0FDF4] shadow-[0_1px_3px_#00000006]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] sm:text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Total Present Days</p>
              <h3 className="text-[24px] sm:text-[30px] lg:text-[36px] font-extrabold text-[#15803D] mt-1.5 tracking-tight">{presentDays}</h3>
              <p className="text-[12px] sm:text-[12px] text-[#15803D] font-medium mt-1">Days Attended on Campus</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0 shadow-xs">
              <Icon name="CheckCircle" size={24} />
            </div>
          </div>
        </div>

        {/* Total Absent Days */}
        <div className="bg-white rounded-2xl border border-[#FECACA] p-4 sm:p-5 from-white via-white to-[#FEF2F2] shadow-[0_1px_3px_#00000006]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] sm:text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Total Absent Days</p>
              <h3 className="text-[24px] sm:text-[30px] lg:text-[36px] font-extrabold text-[#DC2626] mt-1.5 tracking-tight">{absentDays}</h3>
              <p className="text-[12px] sm:text-[12px] text-[#DC2626] font-medium mt-1">Days Missed This Month</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0 shadow-xs">
              <Icon name="XCircle" size={24} />
            </div>
          </div>
        </div>

        {/* Total Holidays */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSelectedListModal('holiday')}
          onKeyDown={e => e.key === 'Enter' && setSelectedListModal('holiday')}
          className="bg-white rounded-2xl border border-[#FDE68A] p-4 sm:p-5 from-white via-white to-[#FFFBEB] shadow-[0_1px_3px_#00000006] cursor-pointer transition-all group select-none"
          title="Click to view holidays list"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] sm:text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Total Holidays</p>
              <h3 className="text-[24px] sm:text-[30px] lg:text-[36px] font-extrabold text-[#D97706] mt-1.5 tracking-tight">{holidayDays}</h3>
              <p className="text-[12px] sm:text-[12px] text-[#D97706] font-medium mt-1 flex items-center gap-1">
                <span>Official Holidays</span>
                <span className="underline font-semibold group-hover:text-[#B45309]">(View List)</span>
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 shadow-xs transition-transform">
              <Icon name="hugeicons:calendar-date-1" size={24} />
            </div>
          </div>
        </div>

        {/* Total Weekends */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSelectedListModal('weekend')}
          onKeyDown={e => e.key === 'Enter' && setSelectedListModal('weekend')}
          className="bg-white rounded-2xl border border-[#CBD5E1] p-4 sm:p-5 bg-gradient-to-br from-white via-white to-[#F8FAFC] shadow-[0_1px_3px_#00000006] cursor-pointer transition-all group select-none"
          title="Click to view weekends list"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] sm:text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Total Weekends</p>
              <h3 className="text-[24px] sm:text-[30px] lg:text-[36px] font-extrabold text-[#475569] mt-1.5 tracking-tight">{weekendDays}</h3>
              <p className="text-[12px] sm:text-[12px] text-[#475569] font-medium mt-1 flex items-center gap-1">
                <span>Weekend List</span>
                <span className="underline font-semibold group-hover:text-[#1E293B]">(View List)</span>
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#F1F5F9] text-[#475569] flex items-center justify-center shrink-0 shadow-xs transition-transform">
              <Icon name="Coffee" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Calendar Card (Clean, Full-Width Professional ERP Design) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_#00000006] overflow-hidden">
        {/* Month Stepper Header */}
        <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#CBD5E1] text-[#334155] flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Previous Month"
            >
              <Icon name="ChevronLeft" size={15} />
            </button>
            <div className="px-3 text-center min-w-[160px]">
              <h2 className="text-[16px] sm:text-[18px] font-bold text-[#17153A]">
                {monthNames[month]} {year}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#CBD5E1] text-[#334155] flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Next Month"
            >
              <Icon name="ChevronRight" size={15} />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[12px] text-[#64748B] font-medium bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E2E8F0]">
            <Icon name="hugeicons:calendar-date-1" size={13} className="text-[#7C612A]" />
            <span>Academic Year 2026-27</span>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 px-4 sm:px-5 py-2.5 bg-[#F8FAFC] border-b border-[#F1F5F9]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, idx) => (
            <div
              key={d}
              className={`text-center text-[12px] font-bold uppercase tracking-wider ${idx === 0 || idx === 6 ? 'text-[#94A3B8]' : 'text-[#475569]'
                }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2 p-4 sm:p-5">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div
              key={`offset-${i}`}
              className="h-16 sm:h-18 rounded-xl bg-[#F8FAFC]/40 border border-dashed border-[#F1F5F9]"
            />
          ))}

          {days.map(d => {
            const dayNum = parseInt(d.date.split('-')[2], 10);
            const isTod = isToday(d.date);

            let cellBg = 'bg-white border-[#F1F5F9] text-[#CBD5E1]';
            let numColor = 'text-[#CBD5E1]';
            let statusBadge = null;

            if (d.status === 'present') {
              cellBg = 'bg-[#F0FDF4]/50 border-[#BBF7D0] hover:bg-[#F0FDF4]';
              numColor = 'text-[#15803D]';
              statusBadge = (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                  <Icon name="Check" size={9} />
                  Present
                </span>
              );
            } else if (d.status === 'absent') {
              cellBg = 'bg-[#FEF2F2]/50 border-[#FECACA] hover:bg-[#FEF2F2]';
              numColor = 'text-[#DC2626]';
              statusBadge = (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-full">
                  <Icon name="X" size={9} />
                  Absent
                </span>
              );
            } else if (d.status === 'holiday') {
              cellBg = 'bg-[#FFFBEB]/60 border-[#FDE68A] hover:bg-[#FFFBEB]';
              numColor = 'text-[#D97706]';
              statusBadge = (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                  <Icon name="hugeicons:calendar-date-1" size={9} />
                  Holiday
                </span>
              );
            } else if (d.status === 'weekend') {
              cellBg = 'bg-[#F8FAFC] border-[#E2E8F0]';
              numColor = 'text-[#94A3B8]';
              statusBadge = (
                <span className="text-[10px] font-medium text-[#94A3B8]">
                  Weekend
                </span>
              );
            } else if (d.status === 'leave') {
              cellBg = 'bg-[#FDF4FF]/60 border-[#F0ABFC] hover:bg-[#FDF4FF]';
              numColor = 'text-[#C026D3]';
              statusBadge = (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C026D3] bg-[#FAE8FF] px-2 py-0.5 rounded-full">
                  <Icon name="solar:pen-2-linear" size={9} />
                  Leave
                </span>
              );
            }

            return (
              <div
                key={d.date}
                className={`h-16 sm:h-18 p-1.5 sm:p-2 rounded-xl flex flex-col justify-between items-center relative border transition-all duration-150 ${cellBg}`}
                title={`${dayNum} ${monthNames[month]} - ${d.status}`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className={`text-[12px] sm:text-[14px] font-bold leading-none ${numColor}`}>
                    {dayNum}
                  </span>
                  {isTod && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#7C612A]"
                      title="Today"
                    />
                  )}
                </div>

                <div className="w-full flex justify-center pb-0.5">
                  {statusBadge}
                </div>
              </div>
            );
          })}
        </div>

        {/* Uniform Info / Legend Strip (Equal, Clean, Harmonious Layout) */}
        <div className="px-5 py-3.5 bg-[#F8FAFC] border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-3 text-[12px]">
          <div className="flex flex-wrap items-center gap-5 sm:gap-7">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="font-semibold text-[#0F172A]">Present: <strong className="text-[#15803D] font-bold">{presentDays}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
              <span className="font-semibold text-[#0F172A]">Absent: <strong className="text-[#DC2626] font-bold">{absentDays}</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedListModal('holiday')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
              <span className="font-semibold text-[#0F172A]">Holiday: <strong className="text-[#D97706] font-bold">{holidayDays}</strong> </span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedListModal('weekend')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
              <span className="font-semibold text-[#0F172A]">Weekend: <strong className="text-[#475569] font-bold">{weekendDays}</strong></span>
            </button>
          </div>
        </div>
      </div>

      {/* Holidays & Weekends List Modal */}
      <Modal
        open={selectedListModal !== null}
        onClose={() => setSelectedListModal(null)}
        title={
          selectedListModal === 'holiday'
            ? `Holidays List · ${monthNames[month]} ${year}`
            : `Weekends List · ${monthNames[month]} ${year}`
        }
        size="md"
        footer={
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => setSelectedListModal(null)}
              className="!bg-[#7C612A] hover:!bg-[#644c1f] text-white"
            >
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-[12px] text-[#475569]">
            <span className="font-medium">
              Total {selectedListModal === 'holiday' ? 'Holidays' : 'Weekend Days'} in {monthNames[month]}:
            </span>
            <span className="font-bold text-[14px] text-[#17153A]">
              {selectedListModal === 'holiday' ? holidayDays : weekendDays} Days
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-xl bg-white">
            {(selectedListModal === 'holiday'
              ? days.filter(d => d.status === 'holiday')
              : days.filter(d => d.status === 'weekend')
            ).map(d => {
              const dayDate = new Date(d.date);
              const dayOfWeekStr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayDate.getDay()];
              const dayNum = d.date.split('-')[2];

              return (
                <div key={d.date} className="p-3 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[12px] ${selectedListModal === 'holiday'
                      ? 'bg-[#FEF3C7] text-[#D97706]'
                      : 'bg-[#F1F5F9] text-[#475569]'
                      }`}>
                      {dayNum}
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-[#17153A]">
                        {monthNames[month]} {dayNum}, {year}
                      </p>
                      <p className="text-[12px] text-[#64748B]">
                        {dayOfWeekStr}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${selectedListModal === 'holiday'
                    ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                    : 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
                    }`}>
                    {selectedListModal === 'holiday' ? 'School Holiday' : dayOfWeekStr}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      {/* Leave Application Modal */}
      <Modal
        open={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Apply for Student Leave"
        size="md"
        overflowVisible={true}
        className="!max-w-[560px]"
        footer={
          leaveSubmitted ? (
            <Button
              variant="primary"
              onClick={() => {
                setShowLeaveModal(false);
                setLeaveSubmitted(false);
              }}
              className="!bg-[#7C612A] hover:!bg-[#560110] text-white px-6 rounded-xl font-semibold shadow-xs"
            >
              Done
            </Button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLeaveModal(false)}
                  className="rounded-xl px-4 text-[#64748B] hover:text-[#17153A] border-[#CBD5E1]"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setLeaveSubmitted(true);
                    showToast('Leave application submitted successfully', 'success');
                  }}
                  className="!bg-[#7C612A] hover:!bg-[#560110] text-white px-5 rounded-xl font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon name="Check" size={15} />
                  <span>Submit Application</span>
                </Button>
              </div>
            </div>
          )
        }
      >
        {leaveSubmitted ? (
          <div className="py-7 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center mx-auto shadow-xs">
              <Icon name="solar:check-circle-bold" size={30} />
            </div>
            <div>
              <h4 className="text-[18px] font-bold text-[#17153A] tracking-tight">Leave Application Submitted</h4>
              <p className="text-[12.5px] text-[#64748B] max-w-sm mx-auto mt-1 leading-relaxed">
                Your leave request for <strong className="text-[#17153A]">{formatLeaveDate(leaveForm.from)}</strong> to <strong className="text-[#17153A]">{formatLeaveDate(leaveForm.to)}</strong> has been officially recorded and forwarded to the class teacher.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] max-w-sm mx-auto text-left text-[12px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Student</span>
                <span className="font-bold text-[#17153A]">
                  {student?.name || 'Aarav Sharma'} ({student?.class ? `${student.class.replace(/class/i, 'Grade').trim()}-${student.section || 'A'}` : 'Grade 8-A'})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Reason</span>
                <span className="font-semibold text-[#17153A]">{leaveForm.reason}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Reviewer</span>
                <div className="flex items-center gap-1.5 font-semibold text-[#17153A]">
                  <TeacherAvatar name="Mrs. Sunita Sharma" size={18} />
                  <span>Mrs. Sunita Sharma</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-[14px]">
            {/* Date Selection Row */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3.5">
                <Input
                  label="From Date"
                  type="date"
                  align="left"
                  value={leaveForm.from}
                  onChange={e => setLeaveForm({ ...leaveForm, from: e.target.value })}
                />
                <Input
                  label="To Date"
                  type="date"
                  align="right"
                  value={leaveForm.to}
                  onChange={e => setLeaveForm({ ...leaveForm, to: e.target.value })}
                />
              </div>

              {/* Dynamic Duration Badge */}
              {(() => {
                const d1 = new Date(leaveForm.from);
                const d2 = new Date(leaveForm.to);
                const diffTime = d2.getTime() - d1.getTime();
                const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);

                return (
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11.5px]">
                    <div className="flex items-center gap-2 text-[#475569]">
                      <Icon name="solar:calendar-linear" size={14} className="text-[#7C612A]" />
                      <span>Total Leave Duration:</span>
                      <span className="font-bold text-[#17153A] bg-white px-2 py-0.5 rounded-md border border-[#CBD5E1]">
                        {diffDays} {diffDays === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>
                    <span className="text-[#059669] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      Regular Leave
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Reason Selection */}
            <Select
              label="Reason for Leave"
              value={leaveForm.reason}
              onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              options={[
                { value: 'Medical Leave', label: 'Medical / Health Illness' },
                { value: 'Family Function', label: 'Family Event / Wedding' },
                { value: 'Personal Emergency', label: 'Personal / Urgent Emergency' },
                { value: 'Academic Competition', label: 'Academic / External Competition' },
                { value: 'Travel / Vacation', label: 'Authorized Family Travel' },
                { value: 'Other', label: 'Other' },
              ]}
            />

            {/* Detailed Notes */}
            <Textarea
              label="Reason / Notes"
              placeholder="Provide specific details or doctor recommendations for the class teacher..."
              value={leaveForm.notes}
              onChange={e => setLeaveForm({ ...leaveForm, notes: e.target.value })}
              rows={3}
            />
          </div>
        )}
      </Modal>
    </div >
  );
}

const subjectColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  'Mathematics': { bg: '#EFF6FF', text: '#1D4ED8', border: '#DBEAFE', icon: 'Scale' },
  'English': { bg: '#FDF2F8', text: '#BE185D', border: '#FCE7F3', icon: 'BookOpen' },
  'Science': { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', icon: 'Eye' },
  'Social Studies': { bg: '#EEF2FF', text: '#4F46E5', border: '#E0E7FF', icon: 'FileText' },
  'Hindi': { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A', icon: 'BookOpen' },
  'Computer Science': { bg: '#F0F9FF', text: '#0284C7', border: '#BAE6FD', icon: 'LayoutDashboard' },
  'Physical Education': { bg: '#F0FDF4', text: '#16A34A', border: '#DCFCE7', icon: 'Trophy' },
  'Art': { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE', icon: 'solar:pen-2-linear' },
  'Music': { bg: '#FFF1F2', text: '#E11D48', border: '#FFE4E6', icon: 'solar:confetti-linear' },
  'Library': { bg: '#FDF8F0', text: '#7C612A', border: '#F3E5D0', icon: 'BookOpen' },
  'Recess': { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A', icon: 'Coffee' },
};

function getSubjectColor(subj: string) {
  return subjectColors[subj] || { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0', icon: 'BookOpen' };
}

function TimeTable() {
  const [view, setView] = useState<'daily' | 'weekly'>('daily');
  const [day, setDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="animate-fade-in space-y-4 w-full">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Breadcrumb items={['Parent Portal', 'Time Table']} />
          <div className="flex items-center gap-3 mt-0.5">
            <h1 className="text-[20px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">
              Time Table
            </h1>
          </div>
        </div>

        {/* Clean Segmented Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] self-start sm:self-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setView('daily')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${view === 'daily'
              ? 'bg-white text-[#17153A] shadow-xs'
              : 'text-[#64748B] hover:text-[#17153A]'
              }`}
          >
            <Icon name="hugeicons:calendar-date-1" size={14} />
            <span>Daily</span>
          </button>
          <button
            type="button"
            onClick={() => setView('weekly')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${view === 'weekly'
              ? 'bg-white text-[#17153A] shadow-xs'
              : 'text-[#64748B] hover:text-[#17153A]'
              }`}
          >
            <Icon name="hugeicons:grid-view" size={14} />
            <span>Weekly</span>
          </button>
        </div>
      </div>

      {/* Daily View Mode */}
      {view === 'daily' && (
        <div className="space-y-3.5">
          {/* Clean Day Selector */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin py-0.5">
            {days.map(d => {
              const isActive = day === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDay(d)}
                  className={`px-4 py-2 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${isActive
                    ? 'bg-[#7C612A] border-[#7C612A] text-white shadow-xs'
                    : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]'
                    }`}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* Clean & Attractive Daily Table Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_#00000006] overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-[12px] border-collapse">
                <thead>
                  <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]/90 text-[#64748B] uppercase font-bold tracking-wider text-[12px]">
                    <th className="py-3.5 px-5 w-24 text-center">Period</th>
                    <th className="py-3.5 px-5 w-44">Time</th>
                    <th className="py-3.5 px-5">Subject</th>
                    <th className="py-3.5 px-5">Teacher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {(weeklyTimetable[day] || timetable).map((p, i) => {
                    const style = getSubjectColor(p.subject);

                    if (p.isRecess) {
                      return (
                        <tr
                          key={`recess-${i}`}
                          className="bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFFBEB] border-y border-[#FDE68A]"
                        >
                          <td className="py-3 px-5 text-center">
                            <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] flex items-center justify-center mx-auto shadow-2xs">
                              <Icon name="solar:tea-cup-linear" size={18} />
                            </div>
                          </td>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-1.5 font-bold text-[12px] text-[#92400E]">
                              <span>{p.time}</span>
                            </div>
                          </td>
                          <td className="py-3 px-5 font-bold text-[12px] text-[#92400E]">
                            Recess Break
                          </td>
                          <td className="py-3 px-5 text-[#B45309] text-[12px]">
                            —
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr
                        key={`p-${i}`}
                        className="hover:bg-[#F8FAFC] transition-colors"
                      >
                        {/* Period */}
                        <td className="py-3.5 px-5 text-center">
                          <div className="w-8 h-8 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#17153A] font-extrabold text-[12px] flex items-center justify-center mx-auto shadow-2xs">
                            {p.period}
                          </div>
                        </td>

                        {/* Time */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2 font-semibold text-[12px] text-[#475569]">
                            <span>{p.time}</span>
                          </div>
                        </td>

                        {/* Subject with Color Icon */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <span className="font-semibold text-[12px] sm:text-[14px] text-[#0F172A]">
                              {p.subject}
                            </span>
                          </div>
                        </td>

                        {/* Teacher with Profile Photo */}
                        <td className="py-3.5 px-5">
                          {p.teacher ? (
                            <div className="flex items-center gap-2.5">
                              <TeacherAvatar name={p.teacher} size={28} />
                              <span className="font-semibold text-[12px] text-[#334155]">
                                {p.teacher}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#94A3B8]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Weekly View Mode (Clean, Unified, Professional) */}
      {view === 'weekly' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_#00000006] overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-[12px] border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC] text-[#64748B] uppercase font-bold tracking-wider text-[12px]">
                  <th className="py-3.5 px-3 w-28 text-center border-r border-[#F1F5F9]">Period</th>
                  {days.map(d => (
                    <th key={d} className="py-3.5 px-3 text-center border-r border-[#F1F5F9] last:border-r-0">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {[1, 2, 3].map(periodNum => {
                  const timeLabel =
                    periodNum === 1 ? '08:00 - 08:45' :
                      periodNum === 2 ? '08:45 - 09:30' : '09:30 - 10:15';

                  return (
                    <tr key={`matrix-p-${periodNum}`} className="hover:bg-[#F8FAFC]/40 transition-colors">
                      <td className="py-3.5 px-3 text-center border-r border-[#F1F5F9] bg-[#F8FAFC]/50">
                        <span className="font-bold text-[12px] text-[#17153A]">Period {periodNum}</span>
                        <p className="text-[10px] text-[#64748B] mt-0.5">{timeLabel}</p>
                      </td>
                      {days.map(d => {
                        const item = (weeklyTimetable[d] || timetable).find(p => p.period === periodNum);
                        if (!item) {
                          return (
                            <td key={d} className="py-3.5 px-3 text-center text-[#CBD5E1] border-r border-[#F1F5F9] last:border-r-0 text-[12px]">
                              —
                            </td>
                          );
                        }

                        return (
                          <td key={d} className="py-3.5 px-3 text-center border-r border-[#F1F5F9] last:border-r-0 align-middle hover:bg-[#F8FAFC] transition-colors">
                            <p className="font-semibold text-[12px] text-[#17153A] leading-tight">
                              {item.subject}
                            </p>
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                              <TeacherAvatar name={item.teacher} size={16} />
                              <span className="text-[12px] text-[#64748B] truncate max-w-[85px]">
                                {item.teacher}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Recess Row */}
                <tr className="bg-[#FFFBEB]/50 border-y border-[#FDE68A]/70">
                  <td className="py-2.5 px-3 text-center border-r border-[#FDE68A]/70 font-semibold text-[12px] text-[#D97706]">
                    <div className="flex items-center justify-center gap-1.5">
                      <Icon name="Coffee" size={13} />
                      <span>Break</span>
                    </div>
                  </td>
                  <td colSpan={6} className="py-2.5 px-4 text-center font-semibold text-[12px] text-[#92400E]">
                    Morning Recess · 10:15 – 10:30 AM
                  </td>
                </tr>

                {[4, 5, 6, 7].map(periodNum => {
                  const timeLabel =
                    periodNum === 4 ? '10:30 - 11:15' :
                      periodNum === 5 ? '11:15 - 12:00' :
                        periodNum === 6 ? '12:00 - 12:45' : '12:45 - 01:30';

                  return (
                    <tr key={`matrix-p-${periodNum}`} className="hover:bg-[#F8FAFC]/40 transition-colors">
                      <td className="py-3.5 px-3 text-center border-r border-[#F1F5F9] bg-[#F8FAFC]/50">
                        <span className="font-bold text-[12px] text-[#17153A]">Period {periodNum}</span>
                        <p className="text-[10px] text-[#64748B] mt-0.5">{timeLabel}</p>
                      </td>
                      {days.map(d => {
                        const item = (weeklyTimetable[d] || timetable).find(p => p.period === periodNum);
                        if (!item) {
                          return (
                            <td key={d} className="py-3.5 px-3 text-center text-[#94A3B8] border-r border-[#F1F5F9] last:border-r-0 text-[12px] bg-[#F8FAFC]/20">
                              {d === 'Saturday' ? 'Half Day' : '—'}
                            </td>
                          );
                        }

                        return (
                          <td key={d} className="py-3.5 px-3 text-center border-r border-[#F1F5F9] last:border-r-0 align-middle hover:bg-[#F8FAFC] transition-colors">
                            <p className="font-semibold text-[12px] text-[#17153A] leading-tight">
                              {item.subject}
                            </p>
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                              <TeacherAvatar name={item.teacher} size={16} />
                              <span className="text-[12px] text-[#64748B] truncate max-w-[85px]">
                                {item.teacher}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Event Metadata & Category Helpers (strictly HEX & PX)
interface EventDetailInfo {
  time: string;
  location: string;
  description: string;
  coordinator?: string;
}

const eventDetailsMap: Record<string, EventDetailInfo> = {
  e1: {
    time: '08:00 AM - 10:00 AM',
    location: 'Examination Hall (A-Block)',
    description: 'Mid-Term evaluations commence for all core subjects. Students are required to be in full school uniform, carry their official admit cards, and report 15 minutes before the exam begins.',
    coordinator: 'Mrs. Meera Iyer',
  },
  e2: {
    time: '09:00 AM - 01:00 PM',
    location: 'Classroom 8-A (Second Floor)',
    description: 'Mandatory meeting to review academic performance, first term test results, learning outcomes, and student behavioral observations. Please carry the student handbook.',
    coordinator: 'Mrs. Meera Iyer',
  },
  e3: {
    time: '08:30 AM - 03:30 PM',
    location: 'School Athletics Ground',
    description: 'Annual inter-house athletic championships, track races, obstacle courses, March Past ceremony, and trophy distribution. Parents are cordially invited to attend and encourage the students.',
    coordinator: 'Mr. Arjun Kapoor',
  },
  e4: {
    time: 'All Day',
    location: 'School Campus Closed',
    description: 'School closes for Diwali celebrations and autumn vacation. Digital homework packages and recommended reading assignments are accessible in the parent portal.',
    coordinator: 'School Administration',
  },
  e5: {
    time: 'All Day',
    location: 'School Campus Closed',
    description: 'Conclusion of the Diwali vacation period. Regular classroom instruction, laboratory sessions, and school bus routes resume promptly tomorrow morning at 07:45 AM.',
    coordinator: 'School Administration',
  },
  e6: {
    time: '09:00 AM - 01:00 PM',
    location: 'Main School Auditorium',
    description: 'Special celebratory festival honoring Children\'s Day. Features stage drama by teachers, carnival games, fun quizzes, and distribution of sweets and gifts.',
    coordinator: 'Mrs. Sunita Rao',
  },
  e7: {
    time: '08:00 AM - 10:00 AM',
    location: 'Examination Wing',
    description: 'Second Term written assessments commence. The detailed datesheet and chapter breakdown have been published in Circular Notice CN-2026-00252.',
    coordinator: 'Mrs. Deepika Nair',
  },
};

// Colour-coded configurations for holidays and events (strictly HEX & PX)
const calendarCategoryConfig: Record<
  string,
  {
    label: string;
    icon: string;
    bgHex: string;
    textHex: string;
    borderHex: string;
    badgeBg: string;
    dotHex: string;
  }
> = {
  holiday: {
    label: 'Holiday',
    icon: 'solar:sun-2-linear',
    bgHex: 'bg-[#FEF3C7]',
    textHex: 'text-[#92400E]',
    borderHex: 'border-[#FDE68A]',
    badgeBg: 'bg-[#FFFBEB]',
    dotHex: '#D97706',
  },
  event: {
    label: 'Event',
    icon: 'solar:cup-first-linear',
    bgHex: 'bg-[#ECFDF5]',
    textHex: 'text-[#065F46]',
    borderHex: 'border-[#A7F3D0]',
    badgeBg: 'bg-[#ECFDF5]',
    dotHex: '#059669',
  },
  ptm: {
    label: 'PTM',
    icon: 'solar:users-group-rounded-linear',
    bgHex: 'bg-[#EEF2FF]',
    textHex: 'text-[#4338CA]',
    borderHex: 'border-[#C7D2FE]',
    badgeBg: 'bg-[#EEF2FF]',
    dotHex: '#4F46E5',
  },
  exam: {
    label: 'Exam',
    icon: 'solar:square-academic-cap-linear',
    bgHex: 'bg-[#FFF1F2]',
    textHex: 'text-[#9F1239]',
    borderHex: 'border-[#FECDD3]',
    badgeBg: 'bg-[#FFF1F2]',
    dotHex: '#E11D48',
  },
};

function Calendar() {
  // Live dynamic system date calculation
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDateStr = `${todayYear}-${String(todayMonth + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Navigation & Filter State (defaults to current live month)
  const [currentDate, setCurrentDate] = useState(() => new Date(todayYear, todayMonth, 1));
  const [filter, setFilter] = useState<'all' | 'holiday' | 'event' | 'ptm' | 'exam'>('all');
  const [selectedEvent, setSelectedEvent] = useState<typeof calendarEvents[0] | null>(null);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  const academicMonths = [
    { year: 2026, month: 3, label: 'Apr 2026' },
    { year: 2026, month: 4, label: 'May 2026' },
    { year: 2026, month: 5, label: 'Jun 2026' },
    { year: 2026, month: 6, label: 'Jul 2026' },
    { year: 2026, month: 7, label: 'Aug 2026' },
    { year: 2026, month: 8, label: 'Sep 2026' },
    { year: 2026, month: 9, label: 'Oct 2026' },
    { year: 2026, month: 10, label: 'Nov 2026' },
    { year: 2026, month: 11, label: 'Dec 2026' },
    { year: 2027, month: 0, label: 'Jan 2027' },
    { year: 2027, month: 1, label: 'Feb 2027' },
    { year: 2027, month: 2, label: 'Mar 2027' },
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calendar calculations for selected month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Filtered month events
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthEvents = calendarEvents
    .filter(e => e.date.startsWith(monthPrefix))
    .filter(e => filter === 'all' || e.type === filter);

  // Live upcoming events list: future events from today onwards
  const futureEvents = calendarEvents
    .filter(e => e.date >= todayDateStr)
    .filter(e => filter === 'all' || e.type === filter)
    .sort((a, b) => a.date.localeCompare(b.date));

  // If viewing a past or far-future month, prioritize viewed month's events in sidebar
  const upcomingEvents = (monthEvents.length > 0 && (year !== todayYear || month !== todayMonth))
    ? monthEvents.slice(0, 8)
    : (futureEvents.length > 0 ? futureEvents.slice(0, 8) : monthEvents.slice(0, 8));

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(todayYear, todayMonth, 1));
  };

  const formatEventFullDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const mIdx = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const dateObj = new Date(y, mIdx, d);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `${dayNames[dateObj.getDay()]}, ${d} ${monthNames[mIdx]} ${y}`;
    }
    return dateStr;
  };

  return (
    <div className="animate-fade-in space-y-4 w-full">
      {/* Page Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Breadcrumb items={['Parent Portal', 'Calendar']} />
          <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
            <h1 className="text-[20px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">
              Calendar 2026–2027
            </h1>
          </div>
        </div>

        {/* Filter for Colour-coded Holidays and Events */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin py-0.5 self-start sm:self-auto">
          {[
            { key: 'all', label: 'All', icon: 'hugeicons:calendar-date-1' },
            { key: 'holiday', label: 'Holidays', icon: 'solar:sun-2-linear' },
            { key: 'event', label: 'Events', icon: 'solar:cup-first-linear' },
            { key: 'ptm', label: 'PTM', icon: 'solar:users-group-rounded-linear' },
            { key: 'exam', label: 'Exams', icon: 'solar:square-academic-cap-linear' },
          ].map(f => {
            const isActive = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key as typeof filter)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${isActive
                  ? 'bg-[#17153A] text-white shadow-xs'
                  : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#17153A]'
                  }`}
              >
                <Icon name={f.icon} size={16} className={isActive ? 'text-[#FFFFFF]' : 'text-[#64748B]'} />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout: Monthly Calendar (Left) & Upcoming Events (Right) */}
      <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Monthly Calendar with Colour-Coded Holidays and Events */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_#00000006] p-4 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Calendar Month Header & Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-3">
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#17153A] tracking-tight">
                  {monthNames[month]} {year}
                </h2>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-lg text-[12px] font-medium bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                  {monthEvents.length} events
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Custom Month Jump Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMonthPickerOpen(prev => !prev)}
                    className="h-8 px-3 rounded-xl text-[12px] font-semibold bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#17153A] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer select-none"
                    aria-label="Select month"
                    aria-expanded={isMonthPickerOpen}
                  >
                    <span>{shortMonths[month]} {year}</span>
                    <Icon
                      name="solar:alt-arrow-down-linear"
                      size={13}
                      className={`text-[#64748B] transition-transform duration-200 ${isMonthPickerOpen ? 'rotate-180 text-[#17153A]' : ''}`}
                    />
                  </button>

                  {isMonthPickerOpen && (
                    <>
                      {/* Global backdrop for clean outside click dismissal */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsMonthPickerOpen(false)}
                      />

                      {/* Custom Dropdown Menu */}
                      <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-1.5 z-50 animate-fade-in select-none">
                        <div className="px-2.5 py-1.5 mb-1 flex items-center justify-between border-b border-[#F1F5F9]">
                          <span className="text-[10.5px] font-bold text-[#64748B] uppercase tracking-wider">
                            Academic 2026–27
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              handleToday();
                              setIsMonthPickerOpen(false);
                            }}
                            className="text-[10.5px] font-bold text-[#7C612A] hover:text-[#560110] transition-colors cursor-pointer"
                          >
                            Current
                          </button>
                        </div>

                        <div className="max-h-60 overflow-y-auto scrollbar-thin space-y-0.5">
                          {academicMonths.map(m => {
                            const isSelected = m.year === year && m.month === month;
                            const isCurrent = m.year === todayYear && m.month === todayMonth;

                            return (
                              <button
                                key={`${m.year}-${m.month}`}
                                type="button"
                                onClick={() => {
                                  setCurrentDate(new Date(m.year, m.month, 1));
                                  setIsMonthPickerOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[12px] transition-all cursor-pointer text-left ${isSelected
                                  ? 'bg-[#17153A] text-white font-semibold shadow-xs'
                                  : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#17153A] font-medium'
                                  }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#7C612A]' : isCurrent ? 'bg-[#10B981]' : 'bg-transparent'}`} />
                                  <span>{shortMonths[m.month]} {m.year}</span>
                                </span>
                                {isSelected ? (
                                  <Icon name="Check" size={13} className="text-white" />
                                ) : isCurrent ? (
                                  <span className="text-[10px] font-semibold text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.2 rounded border border-[#A7F3D0]">
                                    Now
                                  </span>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center p-0.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    title="Previous Month"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#475569] hover:bg-white hover:text-[#17153A] hover:shadow-xs transition-all cursor-pointer"
                  >
                    <Icon name="solar:alt-arrow-left-linear" size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    title="Next Month"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#475569] hover:bg-white hover:text-[#17153A] hover:shadow-xs transition-all cursor-pointer"
                  >
                    <Icon name="solar:alt-arrow-right-linear" size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
              {weekDays.map((d, index) => (
                <div
                  key={d}
                  className={`text-center text-[12px] sm:text-[12px] font-bold uppercase tracking-wider py-1.5 rounded-lg ${index === 0 ? 'text-[#9F1239] bg-[#FFF1F2]/40' : 'text-[#64748B] bg-[#F8FAFC]'
                    }`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Month Day Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {/* Previous Month Padding Cells */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="min-h-[78px] sm:min-h-[88px] rounded-xl p-1.5 border border-dashed border-[#F1F5F9] bg-[#F8FAFC]/30 opacity-30 select-none"
                />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const dayNum = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const events = monthEvents.filter(e => e.date === dateStr);
                const isToday = dateStr === todayDateStr;
                const dayOfWeek = (firstDayIndex + i) % 7;
                const isSunday = dayOfWeek === 0;

                const hasEvents = events.length > 0;

                return (
                  <div
                    key={dateStr}
                    onClick={() => {
                      if (hasEvents) {
                        setSelectedEvent(events[0]);
                      }
                    }}
                    className={`min-h-[78px] sm:min-h-[88px] rounded-xl p-1.5 sm:p-2 border transition-all flex flex-col justify-between ${hasEvents ? 'cursor-pointer hover:border-[#CBD5E1] hover:bg-[#F8FAFC]' : 'cursor-default'
                      } ${isToday
                        ? 'border-[#17153A] bg-[#F8FAFC] shadow-2xs'
                        : hasEvents
                          ? 'border-[#CBD5E1] bg-white'
                          : isSunday
                            ? 'border-[#F1F5F9] bg-[#FAFAFA]'
                            : 'border-[#F1F5F9] bg-white'
                      }`}
                  >
                    {/* Day Number */}
                    <div className="flex items-center justify-between">
                      {isToday ? (
                        <span className="w-5 h-5 rounded-full bg-[#17153A] text-white flex items-center justify-center font-bold text-[12px] shadow-xs">
                          {dayNum}
                        </span>
                      ) : (
                        <span
                          className={`text-[12px] font-semibold ${isSunday ? 'text-[#9F1239]' : 'text-[#334155]'
                            }`}
                        >
                          {dayNum}
                        </span>
                      )}
                    </div>

                    {/* Colour-Coded Events & Holidays (Clickable to open Popup) */}
                    <div className="space-y-1 mt-1">
                      {events.map(e => {
                        const style = calendarCategoryConfig[e.type] || calendarCategoryConfig.event;
                        return (
                          <div
                            key={e.id}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setSelectedEvent(e);
                            }}
                            title={`Click to view details: ${e.title} (${style.label})`}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] sm:text-[12px] font-semibold border ${style.bgHex} ${style.textHex} ${style.borderHex} truncate cursor-pointer hover:opacity-85 transition-opacity`}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: style.dotHex }}
                            />
                            <span className="truncate">{e.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colour-Coded Legend */}
          <div className="flex items-center justify-center sm:justify-start gap-4 pt-4 mt-4 border-t border-[#F1F5F9] text-[12px] font-medium text-[#64748B] flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
              <span>Holiday</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
              <span>Event</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" />
              <span>PTM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
              <span>Exam</span>
            </div>
          </div>
        </div>

        {/* List of Upcoming Events */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_#00000006] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-1 border-b border-[#F1F5F9]">
              <h3 className="font-bold text-[16px] text-[#17153A] tracking-tight">
                {year === todayYear && month === todayMonth ? 'Upcoming Events' : `${monthNames[month]} Events`}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                {upcomingEvents.length} Events
              </span>
            </div>

            {/* Simple, Professional & Clean List (Clickable to open Popup) */}
            <div className="divide-y divide-[#F1F5F9]">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(e => {
                  const style = calendarCategoryConfig[e.type] || calendarCategoryConfig.event;
                  const dateParts = e.date.split('-');
                  const dayNum = dateParts[2];
                  const monthName = shortMonths[parseInt(dateParts[1], 10) - 1] || 'Oct';

                  return (
                    <div
                      key={e.id}
                      onClick={() => setSelectedEvent(e)}
                      title={`Click to view details: ${e.title}`}
                      className="py-3.5 first:pt-2 last:pb-1 flex items-center gap-3.5 group hover:bg-[#F8FAFC] px-2.5 -mx-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      {/* Clean Date Tile */}
                      <div
                        className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${style.bgHex} ${style.textHex} border ${style.borderHex} group-hover:scale-102 transition-transform`}
                      >
                        <span className="text-[12px] font-bold leading-none">{dayNum}</span>
                        <span className="text-[8px] font-bold leading-none uppercase mt-0.5 opacity-90">{monthName}</span>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-[#17153A] group-hover:text-[#7C612A] transition-colors truncate">
                          {e.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold ${style.bgHex} ${style.textHex}`}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: style.dotHex }}
                            />
                            <span>{style.label}</span>
                          </span>
                          <span className="text-[12px] text-[#64748B] truncate">
                            {e.time || (e.type === 'holiday' ? 'All Day' : 'Campus')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] my-2">
                  <Icon name="hugeicons:calendar-date-1" size={24} className="text-[#94A3B8] mx-auto mb-1" />
                  <p className="text-[12px] font-semibold text-[#64748B]">No events for this period</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event / Exam Details Popup Modal */}
      {selectedEvent && (
        <Modal
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title="Event Details"
          size="md"
          footer={
            <div className="flex items-center justify-end w-full">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-[#17153A] hover:bg-[#252252] text-white text-[14px] font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          }
        >
          {(() => {
            const style = calendarCategoryConfig[selectedEvent.type] || calendarCategoryConfig.event;
            const details = {
              time: selectedEvent.time || (selectedEvent.type === 'holiday' ? 'All Day' : '09:00 AM - 01:00 PM'),
              location: selectedEvent.location || (selectedEvent.type === 'holiday' ? 'School Campus Closed' : 'Main School Campus'),
              description: selectedEvent.description || `Official ${style.label} occasion as per the academic calendar 2026-27.`,
              coordinator: selectedEvent.coordinator || 'School Administration',
            };
            const formattedDate = formatEventFullDate(selectedEvent.date);

            return (
              <div className="space-y-4">
                {/* Header Banner */}
                <div className={`p-4 rounded-xl border ${style.bgHex} ${style.borderHex} flex items-start gap-3.5`}>
                  <div className={`w-10 h-10 rounded-xl bg-white border ${style.borderHex} ${style.textHex} flex items-center justify-center shrink-0 shadow-2xs`}>
                    <Icon name={style.icon} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-white ${style.textHex} ${style.borderHex} mb-1.5`}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.dotHex }} />
                      <span>{style.label}</span>
                    </span>
                    <h3 className="text-[16px] font-bold text-[#17153A] leading-snug">
                      {selectedEvent.title}
                    </h3>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="flex items-center gap-1.5 text-[#64748B] text-[12px] font-bold uppercase tracking-wider mb-1">
                      <Icon name="hugeicons:calendar-date-1" size={18} className="text-[#7C612A]" />
                      <span>Date & Schedule</span>
                    </div>
                    <p className="font-semibold text-[14px] text-[#17153A]">{formattedDate}</p>
                    <p className="text-[12px] text-[#64748B] mt-0.5">{details.time}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="flex items-center gap-1.5 text-[#64748B] text-[12px] font-bold uppercase tracking-wider mb-1">
                      <Icon name="hugeicons:location-05" size={18} className="text-[#7C612A]" />
                      <span>Venue / Location</span>
                    </div>
                    <p className="font-semibold text-[14px] text-[#17153A]">{details.location}</p>
                    <p className="text-[12px] text-[#64748B] mt-0.5">
                      Coordinator: {details.coordinator}
                    </p>
                  </div>
                </div>

                {/* Description & Parent Guidance */}
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
                    Event Information & Instructions
                  </span>
                  <p className="text-[14px] text-[#334155] leading-relaxed">
                    {details.description}
                  </p>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}

function Circular() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [calOpen, setCalOpen] = useState(false);
  const [calDate, setCalDate] = useState(new Date(2026, 9, 1)); // October 2026
  const [openCircular, setOpenCircular] = useState<typeof circulars[0] | null>(null);

  const datesWithCirculars = new Set(circulars.map(c => c.date));

  // Format date helper (e.g. 2026-10-12 -> 12 Oct 2026)
  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[parseInt(parts[1], 10) - 1] || parts[1];
      return `${parseInt(parts[2], 10)} ${month} ${parts[0]}`;
    }
    return dateStr;
  };

  // Format time helper (e.g. 09:00 -> 09:00 AM)
  const formatTime = (timeStr: string) => {
    const [hourStr, minStr] = timeStr.split(':');
    if (!hourStr || !minStr) return timeStr;
    const hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:${minStr} ${ampm}`;
  };

  // Filter circulars strictly by date
  const filtered = circulars.filter(c => {
    if (!selectedDate) return true;
    return c.date === selectedDate;
  });

  const handleDownloadAttachment = (c: typeof circulars[0]) => {
    showToast(`Downloading Circular_${c.number}.pdf...`);
  };

  return (
    <div className="animate-fade-in space-y-4 w-full">

      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Breadcrumb items={['Parent Portal', 'Circulars']} />
          <div className="flex flex-wrap items-center gap-2.5 mt-0.5">
            <h1 className="text-[20px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">
              Circulars
            </h1>
          </div>
        </div>
      </div>

      {/* Clean Date Filter Bar with Custom Calendar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Active Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold text-[#17153A]">
            {selectedDate ? `Circulars for ${formatDate(selectedDate)}` : 'All Circulars'}
          </span>
          <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#7C612A]">
            {filtered.length} {filtered.length === 1 ? 'Notice' : 'Notices'}
          </span>
        </div>

        {/* Right: Custom Calendar Dropdown Trigger & Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setCalOpen(!calOpen)}
            className={`flex items-center gap-2 px-3 py-2 text-[12px] font-semibold border rounded-xl cursor-pointer transition-all outline-none shadow-2xs ${selectedDate || calOpen
              ? 'bg-white border-[#7C612A] text-[#17153A] ring-1 ring-[#7C612A]'
              : 'bg-[#F8FAFC] hover:bg-white border-[#E2E8F0] text-[#17153A]'
              }`}
          >
            <Icon name="solar:calendar-date-linear" size={15} className="text-[#7C612A]" />
            <span>{selectedDate ? formatDate(selectedDate) : 'Select Date'}</span>

            {selectedDate ? (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDate('');
                }}
                className="w-4 h-4 rounded-full bg-[#E2E8F0] hover:bg-[#560110] text-[#64748B] hover:text-white flex items-center justify-center transition-colors ml-1 cursor-pointer"
                title="Clear date filter"
              >
                <Icon name="solar:close-circle-linear" size={12} />
              </span>
            ) : (
              <Icon
                name="solar:alt-arrow-down-linear"
                size={13}
                className={`text-[#64748B] transition-transform duration-200 shrink-0 ml-0.5 ${calOpen ? 'rotate-180 text-[#7C612A]' : ''}`}
              />
            )}
          </button>

          {/* Backdrop for closing popover */}
          {calOpen && (
            <div
              className="fixed inset-0 z-30"
              onClick={() => setCalOpen(false)}
            />
          )}

          {/* Custom Calendar Dropdown Popover */}
          {calOpen && (() => {
            const calYear = calDate.getFullYear();
            const calMonth = calDate.getMonth();
            const monthNames = [
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
            const daysInCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
            const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();

            const prevMonthDays = Array.from({ length: firstDayIndex }, (_, i) => daysInPrevMonth - firstDayIndex + 1 + i);
            const currentMonthDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
            const totalCells = firstDayIndex + daysInCurrentMonth;
            const nextMonthDaysCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
            const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => i + 1);

            return (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#E2E8F0] rounded-2xl shadow-popover p-3.5 z-40 animate-fade-in select-none">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCalDate(new Date(calYear, calMonth - 1, 1));
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#17153A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                    title="Previous Month"
                  >
                    <Icon name="solar:alt-arrow-left-linear" size={15} />
                  </button>
                  <span className="text-[14px] font-bold text-[#17153A]">
                    {monthNames[calMonth]} {calYear}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCalDate(new Date(calYear, calMonth + 1, 1));
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#17153A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                    title="Next Month"
                  >
                    <Icon name="solar:alt-arrow-right-linear" size={15} />
                  </button>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <span key={d} className="text-[12px] font-bold text-[#94A3B8]">
                      {d}
                    </span>
                  ))}
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {/* Previous month days */}
                  {prevMonthDays.map(d => (
                    <span key={`prev-${d}`} className="h-8 flex items-center justify-center text-[12px] text-[#CBD5E1]">
                      {d}
                    </span>
                  ))}

                  {/* Current month days */}
                  {currentMonthDays.map(d => {
                    const mStr = String(calMonth + 1).padStart(2, '0');
                    const dStr = String(d).padStart(2, '0');
                    const fullDate = `${calYear}-${mStr}-${dStr}`;
                    const isSelected = selectedDate === fullDate;
                    const hasCircular = datesWithCirculars.has(fullDate);
                    const isToday = fullDate === '2026-10-19';

                    return (
                      <button
                        key={`curr-${d}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(fullDate);
                          setCalOpen(false);
                        }}
                        className={`h-8 w-8 mx-auto rounded-xl flex flex-col items-center justify-center text-[12px] transition-all relative cursor-pointer ${isSelected
                          ? 'bg-[#17153A] text-white font-bold shadow-xs'
                          : hasCircular
                            ? 'text-[#17153A] font-bold hover:bg-[#FDFBF7] hover:text-[#7C612A]'
                            : isToday
                              ? 'text-[#7C612A] font-bold border border-[#7C612A] hover:bg-[#F8FAFC]'
                              : 'text-[#475569] hover:bg-[#F8FAFC]'
                          }`}
                      >
                        <span>{d}</span>
                        {hasCircular && !isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7C612A] absolute bottom-0.5" />
                        )}
                      </button>
                    );
                  })}

                  {/* Next month days */}
                  {nextMonthDays.map(d => (
                    <span key={`next-${d}`} className="h-8 flex items-center justify-center text-[12px] text-[#CBD5E1]">
                      {d}
                    </span>
                  ))}
                </div>

                {/* Footer: Quick Actions */}
                <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[12px] px-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate('');
                      setCalOpen(false);
                    }}
                    className="font-semibold text-[#64748B] hover:text-[#560110] transition-colors cursor-pointer"
                  >
                    Clear Filter
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate('2026-10-19');
                      setCalDate(new Date(2026, 9, 1));
                      setCalOpen(false);
                    }}
                    className="font-bold text-[#7C612A] hover:text-[#560110] transition-colors cursor-pointer"
                  >
                    Today
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* List of Circulars */}
      {
        filtered.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center shadow-[0_2px_8px_#00000006]">
            <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] flex items-center justify-center mx-auto mb-2">
              <Icon name="solar:document-text-linear" size={24} />
            </div>
            <p className="text-[14px] font-semibold text-[#17153A]">No circulars found</p>
            <p className="text-[12px] text-[#64748B] mt-0.5">
              {selectedDate
                ? `There are no circulars issued on ${formatDate(selectedDate)}.`
                : 'No circulars match the selected date.'}
            </p>
            <button
              type="button"
              onClick={() => setSelectedDate('')}
              className="mt-3.5 px-4 py-2 rounded-xl text-[12px] font-semibold bg-[#17153A] text-white hover:bg-[#7C612A] transition-colors cursor-pointer shadow-xs"
            >
              Show All Data
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_#00000006] divide-y divide-[#F1F5F9] overflow-hidden">
            {filtered.map(c => (
              <div
                key={c.id}
                onClick={() => setOpenCircular(c)}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-[#FDFBF7] transition-all duration-150 cursor-pointer"
              >
                {/* Left & Middle: Number, Date, Time & Title */}
                <div className="flex items-start gap-4 min-w-0">
                  {/* Circular Document Icon Tile */}
                  <div className="w-11 h-11 rounded-xl bg-[#F8FAFC] group-hover:bg-[#FFFFFF] border border-[#E2E8F0] group-hover:border-[#EBDCC1] text-[#7C612A] flex items-center justify-center shrink-0 shadow-2xs transition-colors mt-0.5 md:mt-0">
                    <Icon name="solar:document-text-linear" size={20} />
                  </div>

                  <div className="min-w-0">
                    {/* Meta strip: Circular Number & Unified Date-Time Container */}
                    <div className="flex flex-wrap items-center gap-0.5 mb-1.5">
                      {/* Circular Number */}
                      <span className="font-mono text-[12px] font-bold text-[#17153A] bg-[#F1F5F9] px-2.5 py-0.5 rounded-lg border border-[#E2E8F0]">
                        {c.number}
                      </span>

                      <span className="text-[#CBD5E1]">·</span>

                      {/* Date and Time in One Container */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold text-[#475569]">
                        <Icon name="solar:calendar-date-linear" size={14} className="text-[#7C612A]" />
                        <span>{formatDate(c.date)} at {formatTime(c.time)}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-[16px] font-bold text-[#17153A] group-hover:text-[#7C612A] transition-colors leading-snug">
                      {c.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-[14px] text-[#475569] mt-1 leading-relaxed line-clamp-1">
                      {c.excerpt}
                    </p>
                  </div>
                </div>

                {/* Right: Download Attachment & Open/Read Button */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F1F5F9]">
                  {/* Download Attachment Button */}
                  {c.hasAttachment ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadAttachment(c);
                      }}
                      title="Download attached PDF"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-[#FDFBF7] text-[#7C612A] border border-[#EBDCC1] hover:bg-[#7C612A] hover:text-white transition-all cursor-pointer shadow-2xs"
                    >
                      <Icon name="solar:paperclip-2-linear" size={13} />
                      <span>Download Attachment</span>
                    </button>
                  ) : (
                    <span className="text-[12px] text-[#94A3B8] font-medium px-2 py-1">
                      No Attachment
                    </span>
                  )}

                  {/* Open to Read Action */}
                  <button
                    type="button"
                    onClick={() => setOpenCircular(c)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-bold text-[#17153A] bg-[#F8FAFC] group-hover:bg-[#17153A] group-hover:text-white border border-[#E2E8F0] group-hover:border-[#17153A] transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Read Notice</span>
                    <Icon name="solar:arrow-right-linear" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {/* Open to Read Modal & Download Attachment */}
      <Modal
        open={!!openCircular}
        onClose={() => setOpenCircular(null)}
        title="Circular Notice"
        size="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[12px] text-[#64748B]">Sadvidhya International School</span>
            <button
              type="button"
              onClick={() => setOpenCircular(null)}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold bg-[#17153A] text-white hover:bg-[#252252] transition-colors cursor-pointer shadow-xs"
            >
              Close
            </button>
          </div>
        }
      >
        {openCircular && (
          <div className="space-y-4">
            {/* Clean Metadata Line */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] font-bold text-[#17153A] bg-[#F1F5F9] px-2.5 py-0.5 rounded-lg border border-[#E2E8F0]">
                  {openCircular.number}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#475569]">
                  <Icon name="solar:calendar-date-linear" size={14} className="text-[#7C612A]" />
                  <span>{formatDate(openCircular.date)} at {formatTime(openCircular.time)}</span>
                </span>
              </div>
            </div>

            {/* Title & Body Content */}
            <div className="space-y-2.5 pt-1">
              <h3 className="text-[18px] font-bold text-[#17153A] leading-snug">
                {openCircular.title}
              </h3>
              <p className="text-[14px] text-[#334155] leading-relaxed">
                {openCircular.excerpt}
              </p>
            </div>

            {/* Download Attachment Card (Shown only when attachment exists) */}
            {openCircular.hasAttachment && (
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3 mt-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] flex items-center justify-center shrink-0">
                    <Icon name="solar:document-text-linear" size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[#17153A] truncate">
                      Circular_{openCircular.number}.pdf
                    </p>
                    <p className="text-[12px] text-[#64748B]">Official Attachment · PDF Document · 185 KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadAttachment(openCircular)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold bg-[#7C612A] text-white hover:bg-[#685223] transition-colors cursor-pointer shadow-xs shrink-0"
                >
                  <Icon name="solar:download-minimalistic-linear" size={14} />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div >
  );
}

function Exam() {
  const [tab, setTab] = useState<'schedule' | 'syllabus' | 'results' | 'history'>('schedule');
  const [selectedStandardId, setSelectedStandardId] = useState<string>('class-8');
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [hallTicketOpen, setHallTicketOpen] = useState(false);
  const [viewingPastReportCard, setViewingPastReportCard] = useState<any>(null);

  // Subject Teacher Mapping (compliant with Mandatory Teacher Profile Avatar Rule)
  const subjectTeachers: Record<string, string> = {
    Mathematics: 'Mrs. Meera Iyer',
    English: 'Mr. Arjun Kapoor',
    Science: 'Mrs. Deepika Nair',
    'Social Studies': 'Mr. Vikram Singh',
    Hindi: 'Mrs. Sunita Rao',
  };

  // Subject Visual Theme Mapping
  const subjectStyles: Record<string, { icon: string; bg: string; text: string; border: string }> = {
    Mathematics: {
      icon: 'solar:calculator-linear',
      bg: 'bg-[#EFF6FF]',
      text: 'text-[#1D4ED8]',
      border: 'border-[#BFDBFE]',
    },
    English: {
      icon: 'solar:book-bookmark-linear',
      bg: 'bg-[#FDFBF7]',
      text: 'text-[#7C612A]',
      border: 'border-[#EBDCC1]',
    },
    Science: {
      icon: 'solar:atom-linear',
      bg: 'bg-[#F0FDF4]',
      text: 'text-[#047857]',
      border: 'border-[#A7F3D0]',
    },
    'Social Studies': {
      icon: 'solar:global-linear',
      bg: 'bg-[#FFF1F2]',
      text: 'text-[#560110]',
      border: 'border-[#FECDD3]',
    },
    Hindi: {
      icon: 'solar:pen-new-square-linear',
      bg: 'bg-[#FFFBEB]',
      text: 'text-[#B45309]',
      border: 'border-[#FDE68A]',
    },
  };

  // Comprehensive Standards & Academic History Ledger
  const standardsData: Record<string, {
    id: string;
    standard: string;
    academicYear: string;
    term: string;
    isCurrent: boolean;
    examWindow: string;
    timing: string;
    venue: string;
    classTeacher: string;
    totalMax: number;
    totalScore: number;
    percentage: number;
    grade: string;
    promotionStatus: string;
    publishedDate: string;
    schedule: Array<{
      id: string;
      subject: string;
      date: string;
      time: string;
      duration: string;
      room: string;
      maxMarks: number;
      isToday?: boolean;
      isPast?: boolean;
    }>;
    results: Array<{
      id: string;
      subject: string;
      marks: number;
      maxMarks: number;
      grade: string;
      remark: string;
    }>;
    syllabus: Array<{
      id: string;
      name: string;
      teacher: string;
      completedChapters: number;
      totalChapters: number;
      chapters: string;
      weightage: string;
    }>;
  }> = {
    'class-8': {
      id: 'class-8',
      standard: 'Class 8-A',
      academicYear: '2026-27',
      term: 'Mid-Term Assessment 2026-27',
      isCurrent: true,
      examWindow: '15 Oct – 19 Oct 2026',
      timing: '08:00 AM – 10:00 AM (Daily)',
      venue: 'Academic Wing A',
      classTeacher: 'Mrs. Deepika Nair',
      totalMax: 400,
      totalScore: 341,
      percentage: 85.25,
      grade: 'A (Distinction)',
      promotionStatus: 'Current Ongoing Session',
      publishedDate: '22 Oct 2026',
      schedule: examSchedule.map(e => ({
        ...e,
        isToday: e.date === '2026-10-19',
        isPast: e.date < '2026-10-19',
      })),
      results: examResults,
      syllabus: subjects.map(s => ({
        id: s.id,
        name: s.name,
        teacher: s.teacher,
        completedChapters: s.completedChapters,
        totalChapters: s.totalChapters,
        chapters: `Chapters ${Math.max(1, s.completedChapters - 3)}–${s.completedChapters}`,
        weightage: '80 Marks Theory',
      })),
    },
    'class-7': {
      id: 'class-7',
      standard: 'Class 7-A',
      academicYear: '2025-26',
      term: 'Annual Final Examination 2025-26',
      isCurrent: false,
      examWindow: '10 Mar – 17 Mar 2026',
      timing: '08:30 AM – 10:30 AM (Daily)',
      venue: 'Block B - Floor 2',
      classTeacher: 'Mrs. Deepika Nair',
      totalMax: 400,
      totalScore: 352,
      percentage: 88.0,
      grade: 'A+ (Outstanding)',
      promotionStatus: 'Passed & Promoted to Class 8',
      publishedDate: '28 Mar 2026',
      schedule: [
        { id: 'c7-1', subject: 'Mathematics', date: '2026-03-10', time: '08:30 - 10:30', duration: '2 hours', maxMarks: 80, room: 'B-201', isPast: true },
        { id: 'c7-2', subject: 'English', date: '2026-03-12', time: '08:30 - 10:30', duration: '2 hours', maxMarks: 80, room: 'B-201', isPast: true },
        { id: 'c7-3', subject: 'Science', date: '2026-03-14', time: '08:30 - 10:30', duration: '2 hours', maxMarks: 80, room: 'B-201', isPast: true },
        { id: 'c7-4', subject: 'Social Studies', date: '2026-03-16', time: '08:30 - 10:30', duration: '2 hours', maxMarks: 80, room: 'B-202', isPast: true },
        { id: 'c7-5', subject: 'Hindi', date: '2026-03-17', time: '08:30 - 10:30', duration: '2 hours', maxMarks: 80, room: 'B-202', isPast: true },
      ],
      results: [
        { id: 'c7r-1', subject: 'Mathematics', maxMarks: 80, marks: 74, grade: 'A+', remark: 'Excellent mathematical problem solving.' },
        { id: 'c7r-2', subject: 'English', maxMarks: 80, marks: 70, grade: 'A', remark: 'Strong grammar, reading, and composition.' },
        { id: 'c7r-3', subject: 'Science', maxMarks: 80, marks: 76, grade: 'A+', remark: 'Top performer in physics and life science.' },
        { id: 'c7r-4', subject: 'Social Studies', maxMarks: 80, marks: 66, grade: 'A', remark: 'Good analytical map and history answers.' },
        { id: 'c7r-5', subject: 'Hindi', maxMarks: 80, marks: 66, grade: 'A', remark: 'Very neat writing and good poetry recall.' },
      ],
      syllabus: [
        { id: 'c7s-1', name: 'Mathematics', teacher: 'Mrs. Meera Iyer', completedChapters: 14, totalChapters: 14, chapters: 'Chapters 1–14 (Full Syllabus)', weightage: '80 Marks Theory' },
        { id: 'c7s-2', name: 'English', teacher: 'Mr. Arjun Kapoor', completedChapters: 12, totalChapters: 12, chapters: 'Chapters 1–12 (Full Syllabus)', weightage: '80 Marks Theory' },
        { id: 'c7s-3', name: 'Science', teacher: 'Mrs. Deepika Nair', completedChapters: 15, totalChapters: 15, chapters: 'Chapters 1–15 (Full Syllabus)', weightage: '80 Marks Theory' },
        { id: 'c7s-4', name: 'Social Studies', teacher: 'Mr. Vikram Singh', completedChapters: 12, totalChapters: 12, chapters: 'Chapters 1–12 (Full Syllabus)', weightage: '80 Marks Theory' },
        { id: 'c7s-5', name: 'Hindi', teacher: 'Mrs. Sunita Rao', completedChapters: 11, totalChapters: 11, chapters: 'Chapters 1–11 (Full Syllabus)', weightage: '80 Marks Theory' },
      ],
    },
    'class-6': {
      id: 'class-6',
      standard: 'Class 6-B',
      academicYear: '2024-25',
      term: 'Annual Final Examination 2024-25',
      isCurrent: false,
      examWindow: '12 Mar – 19 Mar 2025',
      timing: '08:30 AM – 10:30 AM (Daily)',
      venue: 'Block C - Ground Floor',
      classTeacher: 'Mr. Arjun Kapoor',
      totalMax: 400,
      totalScore: 338,
      percentage: 84.5,
      grade: 'A (Distinction)',
      promotionStatus: 'Passed & Promoted to Class 7',
      publishedDate: '26 Mar 2025',
      schedule: [
        { id: 'c6-1', subject: 'Mathematics', date: '2025-03-12', time: '08:30 - 10:30', duration: '2 hours', maxMarks: 80, room: 'C-104', isPast: true },
        { id: 'c6-2', subject: 'English', date: '2025-03-14', time: '08:30 - 10:30', duration: '2 hours', maxMarks: 80, room: 'C-104', isPast: true },
        { id: 'c6-3', subject: 'Science', date: '2025-03-16', time: '08:30 - 10:30', duration: '2 hours', maxMarks: 80, room: 'C-104', isPast: true },
        { id: 'c6-4', subject: 'Social Studies', date: '2025-03-18', time: '08:30 - 10:30', duration: '2 hours', maxMarks: 80, room: 'C-105', isPast: true },
        { id: 'c6-5', subject: 'Hindi', date: '2025-03-19', time: '08:30 - 10:30', duration: '2 hours', maxMarks: 80, room: 'C-105', isPast: true },
      ],
      results: [
        { id: 'c6r-1', subject: 'Mathematics', maxMarks: 80, marks: 70, grade: 'A', remark: 'Solid grasp of decimals and geometry.' },
        { id: 'c6r-2', subject: 'English', maxMarks: 80, marks: 67, grade: 'A', remark: 'Good vocabulary and reading ability.' },
        { id: 'c6r-3', subject: 'Science', maxMarks: 80, marks: 72, grade: 'A', remark: 'Active participant in science experiments.' },
        { id: 'c6r-4', subject: 'Social Studies', maxMarks: 80, marks: 64, grade: 'B+', remark: 'Good neatness and presentation.' },
        { id: 'c6r-5', subject: 'Hindi', maxMarks: 80, marks: 65, grade: 'A', remark: 'Neat calligraphy and expression.' },
      ],
      syllabus: [
        { id: 'c6s-1', name: 'Mathematics', teacher: 'Mrs. Meera Iyer', completedChapters: 12, totalChapters: 12, chapters: 'Chapters 1–12 (Full Syllabus)', weightage: '80 Marks Theory' },
        { id: 'c6s-2', name: 'English', teacher: 'Mr. Arjun Kapoor', completedChapters: 10, totalChapters: 10, chapters: 'Chapters 1–10 (Full Syllabus)', weightage: '80 Marks Theory' },
        { id: 'c6s-3', name: 'Science', teacher: 'Mrs. Deepika Nair', completedChapters: 12, totalChapters: 12, chapters: 'Chapters 1–12 (Full Syllabus)', weightage: '80 Marks Theory' },
        { id: 'c6s-4', name: 'Social Studies', teacher: 'Mr. Vikram Singh', completedChapters: 10, totalChapters: 10, chapters: 'Chapters 1–10 (Full Syllabus)', weightage: '80 Marks Theory' },
        { id: 'c6s-5', name: 'Hindi', teacher: 'Mrs. Sunita Rao', completedChapters: 10, totalChapters: 10, chapters: 'Chapters 1–10 (Full Syllabus)', weightage: '80 Marks Theory' },
      ],
    },
    'class-5': {
      id: 'class-5',
      standard: 'Class 5-A',
      academicYear: '2023-24',
      term: 'Annual Final Examination 2023-24',
      isCurrent: false,
      examWindow: '15 Mar – 22 Mar 2024',
      timing: '09:00 AM – 11:00 AM (Daily)',
      venue: 'Primary Wing - Floor 1',
      classTeacher: 'Mrs. Meera Iyer',
      totalMax: 400,
      totalScore: 355,
      percentage: 88.75,
      grade: 'A+ (Outstanding)',
      promotionStatus: 'Passed & Promoted to Class 6',
      publishedDate: '27 Mar 2024',
      schedule: [
        { id: 'c5-1', subject: 'Mathematics', date: '2024-03-15', time: '09:00 - 11:00', duration: '2 hours', maxMarks: 80, room: 'P-101', isPast: true },
        { id: 'c5-2', subject: 'English', date: '2024-03-18', time: '09:00 - 11:00', duration: '2 hours', maxMarks: 80, room: 'P-101', isPast: true },
        { id: 'c5-3', subject: 'Science', date: '2024-03-19', time: '09:00 - 11:00', duration: '2 hours', maxMarks: 80, room: 'P-101', isPast: true },
        { id: 'c5-4', subject: 'Social Studies', date: '2024-03-21', time: '09:00 - 11:00', duration: '2 hours', maxMarks: 80, room: 'P-102', isPast: true },
        { id: 'c5-5', subject: 'Hindi', date: '2024-03-22', time: '09:00 - 11:00', duration: '2 hours', maxMarks: 80, room: 'P-102', isPast: true },
      ],
      results: [
        { id: 'c5r-1', subject: 'Mathematics', maxMarks: 80, marks: 75, grade: 'A+', remark: 'Outstanding arithmetic and logic.' },
        { id: 'c5r-2', subject: 'English', maxMarks: 80, marks: 71, grade: 'A', remark: 'Excellent handwriting and narration.' },
        { id: 'c5r-3', subject: 'Science', maxMarks: 80, marks: 74, grade: 'A+', remark: 'Curious learner with strong concepts.' },
        { id: 'c5r-4', subject: 'Social Studies', maxMarks: 80, marks: 67, grade: 'A', remark: 'Great understanding of world geography.' },
        { id: 'c5r-5', subject: 'Hindi', maxMarks: 80, marks: 68, grade: 'A', remark: 'Polite and fluent spoken and written Hindi.' },
      ],
      syllabus: [
        { id: 'c5s-1', name: 'Mathematics', teacher: 'Mrs. Meera Iyer', completedChapters: 12, totalChapters: 12, chapters: 'Chapters 1–12 (Full Syllabus)', weightage: '80 Marks Theory' },
        { id: 'c5s-2', name: 'English', teacher: 'Mr. Arjun Kapoor', completedChapters: 10, totalChapters: 10, chapters: 'Chapters 1–10 (Full Syllabus)', weightage: '80 Marks Theory' },
        { id: 'c5s-3', name: 'Science', teacher: 'Mrs. Deepika Nair', completedChapters: 10, totalChapters: 10, chapters: 'Chapters 1–10 (Full Syllabus)', weightage: '80 Marks Theory' },
        { id: 'c5s-4', name: 'Social Studies', teacher: 'Mr. Vikram Singh', completedChapters: 10, totalChapters: 10, chapters: 'Chapters 1–10 (Full Syllabus)', weightage: '80 Marks Theory' },
        { id: 'c5s-5', name: 'Hindi', teacher: 'Mrs. Sunita Rao', completedChapters: 10, totalChapters: 10, chapters: 'Chapters 1–10 (Full Syllabus)', weightage: '80 Marks Theory' },
      ],
    },
  };

  const currentStandard = standardsData[selectedStandardId] || standardsData['class-8'];

  // Format date helper (e.g. 2026-10-15 -> Thu, 15 Oct 2026)
  const formatExamDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${days[d.getDay()]}, ${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className="animate-fade-in space-y-5 w-full pb-8">

      {/* Clean, Professional Header with Standard History Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div>
          <Breadcrumb items={['Parent Portal', 'Examinations']} />
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">
              Exam
            </h1>
            {!currentStandard.isCurrent && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                <Icon name="solar:history-linear" size={13} />
                <span>Archive Record: {currentStandard.standard} ({currentStandard.academicYear})</span>
              </span>
            )}
          </div>
        </div>

        {/* Standard Selector & Hall Ticket / Archive Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Standard History Dropdown Selector */}
          <div className="relative">
            <select
              value={selectedStandardId}
              onChange={e => {
                setSelectedStandardId(e.target.value);
                const s = standardsData[e.target.value];
                if (s) {
                  showToast(`Switched to ${s.standard} (${s.academicYear}) records`);
                }
              }}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl text-[12px] font-semibold bg-[#F8FAFC] border border-[#E2E8F0] text-[#17153A] hover:border-[#7C612A] focus:outline-none focus:ring-1 focus:ring-[#7C612A] cursor-pointer shadow-2xs"
            >
              <option value="class-8">Class 8-A (2026-27 · Current)</option>
              <option value="class-7">Class 7-A (2025-26 · Previous)</option>
              <option value="class-6">Class 6-B (2024-25 · Previous)</option>
              <option value="class-5">Class 5-A (2023-24 · Previous)</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B]">
              <Icon name="solar:alt-arrow-down-linear" size={14} />
            </div>
          </div>

          {/* Action button */}
          {currentStandard.isCurrent ? (
            <button
              type="button"
              onClick={() => setHallTicketOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold bg-[#7C612A] text-white hover:bg-[#560110] transition-colors cursor-pointer shadow-xs"
            >
              <Icon name="solar:diploma-linear" size={15} />
              <span>Download Hall Ticket</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSelectedStandardId('class-8');
                showToast('Switched to current Class 8-A session');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold bg-[#17153A] text-white hover:bg-[#7C612A] transition-colors cursor-pointer shadow-xs"
            >
              <Icon name="solar:restart-linear" size={14} />
              <span>Return to Current (Class 8-A)</span>
            </button>
          )}
        </div>
      </div>

      {/* Clean Segmented Tab Navigation matching Image 2 layout */}
      <Tabs
        tabs={[
          { key: 'schedule', label: 'Exam Schedule' },
          { key: 'syllabus', label: 'Syllabus' },
          { key: 'results', label: 'Results & Report Card' },
          { key: 'history', label: 'Past Standards History' },
        ]}
        active={tab}
        onChange={setTab as any}
      />

      {/* ==================== TAB 1: EXAM SCHEDULE ==================== */}
      {tab === 'schedule' && (
        <div className="space-y-4">
          {/* Quick Info Bar for Current Standard */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#FFFFF] border border-[#E2E8F0] text-[12px] text-[#475569]">
            <div className="flex items-center gap-3.5 flex-wrap">
              <span><strong>Standard:</strong> {currentStandard.standard} ({currentStandard.academicYear})</span>
              <span className="text-[#CBD5E1]">·</span>
              <span><strong>Total:</strong> {currentStandard.schedule.length} Papers</span>
              <span className="text-[#CBD5E1]">·</span>
              <span><strong>Exam Window:</strong> {currentStandard.examWindow}</span>
              <span className="text-[#CBD5E1]">·</span>
              <span><strong>Timing:</strong> {currentStandard.timing}</span>
              <span className="text-[#CBD5E1]">·</span>
              <span><strong>Venue:</strong> {currentStandard.venue}</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-[#059669]">
              <Icon name="solar:check-circle-linear" size={14} />
            </div>
          </div>

          {/* Schedule Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_#00000006] overflow-hidden">
            {/* Desktop Table Header */}
            <div className="hidden md:grid md:grid-cols-12 items-center px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
              <div className="col-span-4">Subject & Instructor</div>
              <div className="col-span-3">Date & Day</div>
              <div className="col-span-3">Time & Room</div>
              <div className="col-span-1 text-center">Marks</div>
              <div className="col-span-1 text-right">Status</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#F1F5F9]">
              {currentStandard.schedule.map(e => {
                const style = subjectStyles[e.subject] || {
                  icon: 'solar:book-bookmark-linear',
                  bg: 'bg-[#F8FAFC]',
                  text: 'text-[#17153A]',
                  border: 'border-[#E2E8F0]',
                };
                const teacherName = subjectTeachers[e.subject] || currentStandard.classTeacher;

                return (
                  <div
                    key={e.id}
                    onClick={() => setSelectedExam(e)}
                    className="p-4 sm:px-5 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-3 transition-colors hover:bg-[#F8FAFC] cursor-pointer"
                  >
                    {/* Subject & Instructor */}
                    <div className="col-span-4 flex items-center gap-3 min-w-0 w-full">
                      <div className="min-w-0">
                        <span className="text-[14px] font-bold text-[#17153A] block truncate">
                          {e.subject}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <TeacherAvatar name={teacherName} size={18} />
                          <span className="text-[12px] text-[#64748B] truncate">{teacherName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Date & Day */}
                    <div className="col-span-3 text-[14px] font-medium text-[#17153A]">
                      <span className="font-semibold">{formatExamDate(e.date)}</span>
                    </div>

                    {/* Time & Room */}
                    <div className="col-span-3 text-[12px] text-[#475569]">
                      <div className="font-semibold text-[#17153A]">{e.time} ({e.duration})</div>
                      <div className="text-[12px] text-[#64748B] mt-0.5">Room {e.room}</div>
                    </div>

                    {/* Max Marks */}
                    <div className="col-span-1 md:text-center text-[14px] font-bold text-[#17153A]">
                      {e.maxMarks} M
                    </div>

                    {/* Status Badge */}
                    <div className="col-span-1 flex md:justify-end w-full md:w-auto">
                      {e.isToday ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
                          Today
                        </span>
                      ) : e.isPast ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                          <Icon name="solar:check-circle-linear" size={11} />
                          Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-semibold bg-[#F1F5F9] text-[#64748B]">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clean Guidelines Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0]">
            <h3 className="text-[14px] font-bold text-[#17153A] mb-3 flex items-center gap-2">
              <Icon name="solar:info-circle-linear" size={16} className="text-[#7C612A]" />
              <span>Important Examination Guidelines</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[12px]">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="font-bold text-[#17153A] block mb-0.5">Reporting Time</span>
                <span className="text-[#475569]">07:45 AM sharp (15 mins prior to reading bell).</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="font-bold text-[#17153A] block mb-0.5">Mandatory ID</span>
                <span className="text-[#475569]">Physical School ID Card and printed Hall Ticket.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="font-bold text-[#17153A] block mb-0.5">Stationery</span>
                <span className="text-[#475569]">Transparent pouch with blue/black pens & pencils.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFF1F2]/60 border border-[#FECDD3]">
                <span className="font-bold text-[#560110] block mb-0.5">Prohibited Items</span>
                <span className="text-[#560110]">Smartwatches, mobile phones, and notes prohibited.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: SYLLABUS ==================== */}
      {tab === 'syllabus' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {currentStandard.syllabus.map(s => {
              const style = subjectStyles[s.name] || {
                icon: 'solar:book-bookmark-linear',
                bg: 'bg-[#F8FAFC]',
                text: 'text-[#17153A]',
                border: 'border-[#E2E8F0]',
              };

              return (
                <div
                  key={s.id}
                  className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_2px_8px_#00000006] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${style.bg} ${style.text} border ${style.border}`}>
                          <Icon name={style.icon} size={18} />
                        </div>
                        <h3 className="text-[16px] font-bold text-[#17153A]">{s.name}</h3>
                      </div>
                      <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FDFBF7] text-[#7C612A] border border-[#EBDCC1]">
                        {s.chapters}
                      </span>
                    </div>

                    {/* Teacher with Avatar (Mandatory Rule) */}
                    <div className="flex items-center gap-2 mb-3">
                      <TeacherAvatar name={s.teacher} size={20} />
                      <span className="text-[12px] font-medium text-[#64748B]">Instructor: {s.teacher}</span>
                    </div>

                    <p className="text-[14px] text-[#475569] leading-relaxed">
                      Syllabus coverage includes {s.chapters} covering core conceptual questions, textbook problem exercises, and solved examples.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#64748B]">
                      Weightage: {s.weightage}
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast(`Downloading ${s.name} Syllabus Blueprint for ${currentStandard.standard} (PDF)...`)}
                      className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#7C612A] hover:text-[#560110] transition-colors cursor-pointer"
                    >
                      <Icon name="solar:paperclip-2-linear" size={13} />
                      <span>Download Blueprint</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: RESULTS & REPORT CARD ==================== */}
      {tab === 'results' && (
        <div className="space-y-5">
          {/* Summary Performance Banner for Selected Standard */}
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_#00000006] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[12px] font-bold text-[#7C612A] uppercase tracking-wider block">
                {currentStandard.isCurrent ? 'Official Term Publication' : 'Archived Final Assessment'}
              </span>
              <h3 className="text-[18px] font-bold text-[#17153A] mt-0.5">
                {currentStandard.term}
              </h3>
              <p className="text-[12px] text-[#64748B]">
                {currentStandard.standard} · Published on {currentStandard.publishedDate} · {currentStandard.promotionStatus}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block">Total Marks</span>
                <span className="text-[16px] font-bold text-[#17153A] block">{currentStandard.totalScore} / {currentStandard.totalMax}</span>
              </div>

              <div className="px-4 py-2 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-center">
                <span className="text-[10px] uppercase font-bold text-[#059669] block">Percentage</span>
                <span className="text-[16px] font-bold text-[#059669] block">{currentStandard.percentage}%</span>
              </div>

              <div className="px-4 py-2 rounded-xl bg-[#FDFBF7] border border-[#EBDCC1] text-center">
                <span className="text-[10px] uppercase font-bold text-[#7C612A] block">Grade</span>
                <span className="text-[16px] font-bold text-[#7C612A] block">{currentStandard.grade}</span>
              </div>
            </div>
          </div>

          {/* Subject Results Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_#00000006] overflow-hidden">
            <div className="hidden md:grid md:grid-cols-12 items-center px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
              <div className="col-span-4">Subject & Instructor</div>
              <div className="col-span-2 text-center">Marks Obtained</div>
              <div className="col-span-2 text-center">Percentage</div>
              <div className="col-span-1 text-center">Grade</div>
              <div className="col-span-3 text-right">Teacher Remark</div>
            </div>

            <div className="divide-y divide-[#F1F5F9]">
              {currentStandard.results.map(r => {
                const teacherName = subjectTeachers[r.subject] || currentStandard.classTeacher;
                const style = subjectStyles[r.subject] || {
                  icon: 'solar:book-bookmark-linear',
                  bg: 'bg-[#F8FAFC]',
                  text: 'text-[#17153A]',
                  border: 'border-[#E2E8F0]',
                };
                const pct = Math.round((r.marks / r.maxMarks) * 100);

                return (
                  <div
                    key={r.id}
                    className="p-4 sm:px-5 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-3 hover:bg-[#F8FAFC] transition-colors"
                  >
                    {/* Subject & Teacher */}
                    <div className="col-span-4 flex items-center gap-3 min-w-0 w-full">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${style.bg} ${style.text} border ${style.border}`}>
                        <Icon name={style.icon} size={18} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[14px] font-bold text-[#17153A] block truncate">{r.subject}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <TeacherAvatar name={teacherName} size={18} />
                          <span className="text-[12px] text-[#64748B] truncate">{teacherName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Marks */}
                    <div className="col-span-2 md:text-center text-[14px] font-bold text-[#17153A]">
                      {r.marks} <span className="text-[12px] font-normal text-[#64748B]">/ {r.maxMarks}</span>
                    </div>

                    {/* Percentage */}
                    <div className="col-span-2 md:text-center text-[14px] font-semibold text-[#059669]">
                      {pct}%
                    </div>

                    {/* Grade */}
                    <div className="col-span-1 md:text-center">
                      <span className="px-2 py-0.5 rounded-lg text-[12px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                        {r.grade}
                      </span>
                    </div>

                    {/* Remark */}
                    <div className="col-span-3 md:text-right text-[12px] text-[#475569] italic">
                      "{r.remark}"
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Report Card Download Card for Current or Past Standard */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_2px_8px_#00000006] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] text-[#7C612A] border border-[#EBDCC1] flex items-center justify-center shrink-0">
                <Icon name="solar:document-text-linear" size={20} />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#17153A]">
                  Official Report Card ({currentStandard.standard} · {currentStandard.academicYear})
                </h4>
                <p className="text-[12px] text-[#64748B]">
                  Includes CBSE-aligned scholastic grading, co-curricular remarks, and official principal signature.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewingPastReportCard(currentStandard)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-semibold bg-[#F8FAFC] text-[#17153A] border border-[#E2E8F0] hover:bg-[#17153A] hover:text-white transition-colors cursor-pointer"
              >
                <Icon name="solar:eye-linear" size={14} />
                <span>View Report Card</span>
              </button>
              <button
                type="button"
                onClick={() => showToast(`Downloading ${currentStandard.standard} Official Report Card (PDF)...`)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold bg-[#17153A] text-white hover:bg-[#7C612A] transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <Icon name="solar:download-minimalistic-linear" size={14} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: PAST STANDARDS HISTORY ==================== */}
      {tab === 'history' && (
        <div className="space-y-4">
          {/* Historical Summary Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_2px_8px_#00000006] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-[16px] font-bold text-[#17153A]">Academic Progression Ledger (Previous Standards)</h3>
              <p className="text-[12px] text-[#64748B] mt-0.5">
                Complete record of past examinations, final term scores, and downloadable report cards.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#7C612A] bg-[#FDFBF7] px-3 py-1.5 rounded-xl border border-[#EBDCC1]">
              <Icon name="solar:diploma-linear" size={15} />
              <span>Overall Average: 86.6% · Distinction</span>
            </div>
          </div>

          {/* Historical Standards Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_#00000006] overflow-hidden">
            <div className="hidden lg:grid lg:grid-cols-12 items-center px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
              <div className="col-span-3">Standard & Session</div>
              <div className="col-span-3">Examination Cycle</div>
              <div className="col-span-2 text-center">Score & Percentage</div>
              <div className="col-span-2 text-center">Annual Result</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-[#F1F5F9]">
              {(['class-8', 'class-7', 'class-6', 'class-5'] as const).map(sid => {
                const std = standardsData[sid];
                if (!std) return null;

                return (
                  <div
                    key={std.id}
                    className={`p-4 sm:px-5 flex flex-col lg:grid lg:grid-cols-12 items-start lg:items-center gap-3 transition-colors ${std.id === selectedStandardId ? 'bg-[#FDFBF7]/60' : 'hover:bg-[#F8FAFC]'
                      }`}
                  >
                    {/* Standard & Session */}
                    <div className="col-span-3 flex items-center gap-2.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-bold text-[#17153A]">{std.standard}</span>
                          {std.isCurrent && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                              Current
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] text-[#64748B]">Session {std.academicYear}</span>
                      </div>
                    </div>

                    {/* Examination Cycle */}
                    <div className="col-span-3 text-[12px] text-[#475569]">
                      <span className="font-semibold text-[#17153A] block">{std.term}</span>
                      <span className="text-[12px] text-[#64748B]">{std.examWindow}</span>
                    </div>

                    {/* Score & Percentage */}
                    <div className="col-span-2 lg:text-center w-full lg:w-auto flex lg:block items-center justify-between">
                      <span className="text-[12px] font-semibold text-[#64748B] lg:hidden">Score:</span>
                      <div>
                        <span className="text-[14px] font-bold text-[#17153A] block">{std.percentage}%</span>
                        <span className="text-[12px] text-[#64748B] block">{std.totalScore} / {std.totalMax}</span>
                      </div>
                    </div>

                    {/* Annual Result */}
                    <div className="col-span-2 lg:text-center w-full lg:w-auto flex lg:block items-center justify-between">
                      <span className="text-[12px] font-semibold text-[#64748B] lg:hidden">Result:</span>
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[12px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                          Grade {std.grade.split(' ')[0]}
                        </span>
                        <span className="text-[12px] text-[#64748B] block mt-0.5">{std.promotionStatus}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-2 w-full lg:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStandardId(std.id);
                          setTab('schedule');
                          showToast(`Opened timetable for ${std.standard}`);
                        }}
                        title="View Timetable"
                        className="px-2.5 py-1.5 rounded-lg text-[12px] font-semibold text-[#17153A] bg-[#F8FAFC] hover:bg-[#17153A] hover:text-white border border-[#E2E8F0] transition-colors cursor-pointer"
                      >
                        Timetable
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStandardId(std.id);
                          setTab('results');
                          showToast(`Opened results for ${std.standard}`);
                        }}
                        title="View Results"
                        className="px-2.5 py-1.5 rounded-lg text-[12px] font-semibold text-[#17153A] bg-[#F8FAFC] hover:bg-[#17153A] hover:text-white border border-[#E2E8F0] transition-colors cursor-pointer"
                      >
                        Results
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast(`Downloading official ${std.standard} Report Card (PDF)...`)}
                        title="Download Report Card"
                        className="p-1.5 rounded-lg text-[#7C612A] hover:bg-[#FDFBF7] hover:text-[#560110] border border-[#EBDCC1] transition-colors cursor-pointer"
                      >
                        <Icon name="solar:download-minimalistic-linear" size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: EXAM DETAILS MODAL ==================== */}
      <Modal
        open={!!selectedExam}
        onClose={() => setSelectedExam(null)}
        title="Examination Paper Details"
        size="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[12px] text-[#64748B]">{currentStandard.standard} · Sadvidhya International School</span>
            <button
              type="button"
              onClick={() => setSelectedExam(null)}
              className="px-4 py-1.5 rounded-xl text-[12px] font-semibold bg-[#17153A] text-white hover:bg-[#7C612A] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        }
      >
        {selectedExam && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <span className="text-[16px] font-bold text-[#17153A]">{selectedExam.subject}</span>
              <span className="text-[14px] font-bold text-[#7C612A]">{selectedExam.maxMarks} Marks</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block mb-0.5">Date & Day</span>
                <span className="font-bold text-[#17153A]">{formatExamDate(selectedExam.date)}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block mb-0.5">Timing</span>
                <span className="font-bold text-[#17153A]">{selectedExam.time} ({selectedExam.duration})</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block mb-0.5">Examination Room</span>
                <span className="font-bold text-[#17153A]">Room {selectedExam.room}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block mb-0.5">Instructor</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <TeacherAvatar name={subjectTeachers[selectedExam.subject] || currentStandard.classTeacher} size={18} />
                  <span className="font-bold text-[#17153A]">{subjectTeachers[selectedExam.subject] || currentStandard.classTeacher}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#EBDCC1] text-[12px] text-[#78350F]">
              <p>Standard {currentStandard.standard} curriculum assessment. Allocated in Room {selectedExam.room}.</p>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== MODAL: OFFICIAL HALL TICKET MODAL ==================== */}
      <Modal
        open={hallTicketOpen}
        onClose={() => setHallTicketOpen(false)}
        title="Student Examination Hall Ticket"
        size="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[12px] text-[#64748B]">{currentStandard.standard} · {currentStandard.academicYear}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHallTicketOpen(false)}
                className="px-3 py-1.5 rounded-xl text-[12px] font-semibold text-[#64748B] hover:text-[#17153A] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Downloading Official Hall Ticket PDF...');
                  setHallTicketOpen(false);
                }}
                className="px-4 py-1.5 rounded-xl text-[12px] font-bold bg-[#7C612A] text-white hover:bg-[#560110] transition-colors cursor-pointer shadow-xs"
              >
                Download PDF
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-4 text-[12px]">
          {/* Student Admit Card Summary */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-2 gap-2.5">
            <div>
              <span className="text-[#64748B] block text-[12px]">Candidate Name</span>
              <strong className="text-[#17153A] text-[14px]">Aarav Sharma</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[12px]">Class & Section</span>
              <strong className="text-[#17153A] text-[14px]">{currentStandard.standard}</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[12px]">Roll Number</span>
              <strong className="text-[#7C612A] text-[14px]">12</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[12px]">Enrollment No</span>
              <strong className="text-[#17153A] text-[14px]">SIS-2022-841</strong>
            </div>
          </div>

          {/* Quick Schedule List */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
            <table className="w-full text-[12px] text-left">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-bold text-[#64748B]">
                <tr>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Subject</th>
                  <th className="py-2 px-3">Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {currentStandard.schedule.map(e => (
                  <tr key={e.id}>
                    <td className="py-2 px-3 font-medium text-[#17153A]">{e.date}</td>
                    <td className="py-2 px-3 font-semibold text-[#17153A]">{e.subject}</td>
                    <td className="py-2 px-3 text-[#64748B]">Room {e.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[12px] text-[#64748B]">
            * Note: This Hall Ticket must be presented at the examination center along with the student's physical identity card.
          </p>
        </div>
      </Modal>

      {/* ==================== MODAL: VIEW REPORT CARD MODAL ==================== */}
      <Modal
        open={!!viewingPastReportCard}
        onClose={() => setViewingPastReportCard(null)}
        title={`Academic Report Card · ${viewingPastReportCard?.standard || ''}`}
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[12px] text-[#64748B]">Sadvidhya International School · Official Examination Transcript</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewingPastReportCard(null)}
                className="px-3 py-1.5 rounded-xl text-[12px] font-semibold text-[#64748B] hover:text-[#17153A] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Downloading official report card PDF for ${viewingPastReportCard?.standard}...`);
                  setViewingPastReportCard(null);
                }}
                className="px-4 py-1.5 rounded-xl text-[12px] font-bold bg-[#17153A] text-white hover:bg-[#7C612A] transition-colors cursor-pointer shadow-xs"
              >
                Download PDF
              </button>
            </div>
          </div>
        }
      >
        {viewingPastReportCard && (
          <div className="space-y-4 p-2 text-[12px]">
            {/* School Crest & Header */}
            <div className="text-center pb-4 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C612A]">Academic Session {viewingPastReportCard.academicYear}</span>
              <h3 className="text-[18px] font-extrabold text-[#17153A]">Sadvidhya International School</h3>
              <p className="text-[12px] text-[#64748B]">{viewingPastReportCard.term} · Official Cumulative Report Card</p>
              <div className="inline-flex items-center gap-3 mt-2 px-3 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] font-semibold text-[#17153A]">
                <span>Student: <strong>Aarav Sharma</strong></span>
                <span>·</span>
                <span>Class: <strong>{viewingPastReportCard.standard}</strong></span>
                <span>·</span>
                <span>Roll No: <strong>12</strong></span>
              </div>
            </div>

            {/* Score Highlights */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                <span className="text-[18px] font-black text-[#17153A] block">{viewingPastReportCard.totalScore} / {viewingPastReportCard.totalMax}</span>
                <span className="text-[10px] uppercase font-bold text-[#64748B]">Total Marks</span>
              </div>
              <div className="p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-center">
                <span className="text-[18px] font-black text-[#059669] block">{viewingPastReportCard.percentage}%</span>
                <span className="text-[10px] uppercase font-bold text-[#059669]">Aggregate Percentage</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#EBDCC1] text-center">
                <span className="text-[18px] font-black text-[#7C612A] block">{viewingPastReportCard.grade}</span>
                <span className="text-[10px] uppercase font-bold text-[#7C612A]">Final Grade</span>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-bold text-[#475569] text-[12px]">
                  <tr>
                    <th className="py-2 px-3">Subject</th>
                    <th className="py-2 px-3 text-center">Marks Scored</th>
                    <th className="py-2 px-3 text-center">Grade</th>
                    <th className="py-2 px-3 text-right">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {viewingPastReportCard.results.map((r: any) => (
                    <tr key={r.id}>
                      <td className="py-2 px-3 font-semibold text-[#17153A]">{r.subject}</td>
                      <td className="py-2 px-3 text-center font-bold text-[#17153A]">{r.marks} / {r.maxMarks}</td>
                      <td className="py-2 px-3 text-center font-bold text-[#059669]">{r.grade}</td>
                      <td className="py-2 px-3 text-right italic text-[#64748B]">{r.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Principal Remark & Promotion */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] block">Academic Standing</span>
                <strong className="text-[#059669] text-[12px]">{viewingPastReportCard.promotionStatus}</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block">Evaluation Date</span>
                <span className="text-[12px] text-[#17153A] font-semibold">{viewingPastReportCard.publishedDate}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Discipline() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Discipline" breadcrumbs={['Parent', 'Discipline']} />
      <div className="space-y-3">
        {disciplineRecords.map(d => (
          <Card key={d.id}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${d.type === 'positive' ? 'bg-success-50 text-success-600' : 'bg-error-50 text-error-600'}`}>
                <Icon name={d.type === 'positive' ? 'ThumbsUp' : 'AlertTriangle'} size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={d.type === 'positive' ? 'success' : 'error'} size="xs">{d.type}</Badge>
                  <span className="text-[12px] text-ink-400">{d.date}</span>
                </div>
                <p className="text-[14px] text-ink-700">{d.remark}</p>
                <p className="text-[12px] text-ink-400 mt-1">Recorded by: {d.recordedBy}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Activity() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Activity" breadcrumbs={['Parent', 'Activity']} />
      <div className="grid sm:grid-cols-2 gap-4">
        {activityRecords.map(a => (
          <Card key={a.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.type === 'Sports' ? 'bg-success-50 text-success-600' : a.type === 'Academic' ? 'bg-primary-50 text-primary-600' : 'bg-accent-50 text-accent-600'}`}>
                  <Icon name={a.type === 'Sports' ? 'Trophy' : a.type === 'Academic' ? 'BookOpen' : 'Music'} size={18} />
                </div>
                <div>
                  <p className="font-semibold text-ink-800 text-[14px]">{a.title}</p>
                  <p className="text-[12px] text-ink-400 mt-0.5">{a.type} · {a.date}</p>
                </div>
              </div>
              <Badge variant={a.result.includes('First') || a.result.includes('Runner') ? 'success' : 'neutral'} size="xs">{a.result}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EventPage() {
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const upcoming = calendarEvents
    .filter(e => e.type === 'event' && e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = calendarEvents
    .filter(e => e.type === 'event' && e.date < todayStr)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Event" breadcrumbs={['Parent Portal', 'Event']} />
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-[16px] text-[#17153A] mb-3 flex items-center gap-2">
            <Icon name="solar:cup-first-linear" size={17} className="text-[#059669]" />
            <span>Upcoming School Events ({upcoming.length})</span>
          </h3>
          <div className="space-y-3">
            {upcoming.length > 0 ? upcoming.map(e => {
              const dateParts = e.date.split('-');
              const dayNum = dateParts[2];
              const monthName = shortMonths[parseInt(dateParts[1], 10) - 1] || 'Oct';
              return (
                <div key={e.id} className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_2px_8px_#00000004] hover:border-[#CBD5E1] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[18px] font-bold leading-none">{dayNum}</span>
                      <span className="text-[12px] font-semibold leading-none mt-1 uppercase">{monthName}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#17153A] text-[14px] truncate">{e.title}</p>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                          Upcoming
                        </span>
                      </div>
                      <p className="text-[12px] text-[#64748B] mt-0.5">
                        {e.location || 'School Campus'} · {e.time || 'All Day Event'}
                      </p>
                      {e.description && (
                        <p className="text-[12px] text-[#475569] mt-1 line-clamp-1">{e.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            }) : <EmptyState icon={<Icon name="hugeicons:calendar-date-1" size={28} />} title="No Upcoming Events" />}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-[16px] text-[#17153A] mb-3 flex items-center gap-2">
            <Icon name="solar:history-linear" size={17} className="text-[#64748B]" />
            <span>Completed Past Events ({past.length})</span>
          </h3>
          <div className="space-y-3">
            {past.length > 0 ? past.map(e => {
              const dateParts = e.date.split('-');
              const dayNum = dateParts[2];
              const monthName = shortMonths[parseInt(dateParts[1], 10) - 1] || 'Oct';
              return (
                <div key={e.id} className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_2px_8px_#00000004] opacity-80">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[18px] font-bold leading-none">{dayNum}</span>
                      <span className="text-[12px] font-semibold leading-none mt-1 uppercase">{monthName}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#17153A] text-[14px]">{e.title}</p>
                      <p className="text-[12px] text-[#64748B] mt-0.5">
                        {e.location || 'School Campus'} · Successfully Conducted
                      </p>
                    </div>
                  </div>
                </div>
              );
            }) : <EmptyState icon={<Icon name="solar:history-linear" size={28} />} title="No Past Events" />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Observation() {
  const [tab, setTab] = useState('today');
  const filtered = observations.filter(o => o.tab === tab);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Observation" breadcrumbs={['Parent', 'Observation']} />
      <Tabs
        tabs={[
          { label: 'Today', key: 'today' },
          { label: 'Subject', key: 'subject' },
          { label: 'Activity', key: 'activity' },
          { label: 'General', key: 'general' },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div className="mt-5 space-y-3">
        {filtered.length > 0 ? filtered.map(o => (
          <Card key={o.id}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-50 text-secondary-600 flex items-center justify-center shrink-0">
                <Icon name="Eye" size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {o.subject && <Badge variant="info" size="xs">{o.subject}</Badge>}
                  <span className="text-[12px] text-ink-400">{o.date}</span>
                </div>
                <p className="font-semibold text-ink-800 text-[14px]">{o.title}</p>
                <p className="text-[14px] text-ink-500 mt-1">{o.content}</p>
                <p className="text-[12px] text-ink-400 mt-1">By: {o.recordedBy}</p>
              </div>
            </div>
          </Card>
        )) : <EmptyState icon={<Icon name="Eye" size={28} />} title="No Observations" description="No observations have been recorded in this category." />}
      </div>
    </div>
  );
}

function Transport() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Transport" breadcrumbs={['Parent', 'Transport']} />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <SectionHeader title="Transport Details" />
          <div className="space-y-4">
            <InfoRow label="Route" value={transportInfo.route} />
            <InfoRow label="Stop" value={transportInfo.stop} />
            <InfoRow label="Vehicle No." value={transportInfo.vehicleNo} />
            <InfoRow label="Driver" value={transportInfo.driverName} />
            <InfoRow label="Driver Phone" value={transportInfo.driverPhone} />
            <InfoRow label="Pickup Time" value={transportInfo.pickupTime} />
            <InfoRow label="Drop Time" value={transportInfo.dropTime} />
            <div className="pt-3 border-t border-ink-100">
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-ink-500">Transport Fee (Annual)</span>
                <span className="font-bold text-ink-900">₹{transportInfo.fee.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <SectionHeader title="Live Bus Tracking" action={<Badge variant="success" size="sm"><span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse-soft" /> On Route</Badge>} />
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 via-secondary-50 to-primary-50">
            {/* Simulated map */}
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='none'%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23cbd5e1' stroke-width='0.5'/%3E%3C/svg%3E")`,
            }} />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 225">
              <path d="M50 180 Q120 120 200 100 T350 50" stroke="#3b76f6" strokeWidth="3" fill="none" strokeDasharray="8 4" opacity="0.5" />
              <circle cx="50" cy="180" r="6" fill="#14b8a6" />
              <text x="62" y="184" fontSize="10" fill="#0f766e">School</text>
              <circle cx="350" cy="50" r="6" fill="#ef4444" />
              <text x="290" y="44" fontSize="10" fill="#991b1b">Your Stop</text>
              <circle cx="200" cy="100" r="10" fill="#3b76f6" opacity="0.3" />
              <circle cx="200" cy="100" r="6" fill="#3b76f6" className="animate-pulse-soft" />
              <text x="210" y="104" fontSize="10" fill="#1c42d8" fontWeight="bold">Bus</text>
            </svg>
            <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Bus" size={18} className="text-primary-600" />
                <div>
                  <p className="text-[14px] font-medium text-ink-800">{transportInfo.vehicleNo}</p>
                  <p className="text-[12px] text-ink-400">Speed: 28 km/h · ETA: 15 min</p>
                </div>
              </div>
              <Badge variant="info" size="sm">In Transit</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Helpdesk() {
  const [tab, setTab] = useState<'gatepass' | 'appointment' | 'certificate' | 'infirmary' | 'ptm' | 'confirmation'>('gatepass');

  // Interactive state initialized with dataset
  const [passList, setPassList] = useState(gatePasses);
  const [apptList, setApptList] = useState(appointments);
  const [certList, setCertList] = useState(certificateRequests);
  const [infirmaryList] = useState(infirmaryVisits);
  const [ptmList] = useState(ptms);
  const [confirmList, setConfirmList] = useState(confirmationRequests);

  // Modals
  const [showGatePass, setShowGatePass] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedPassSlip, setSelectedPassSlip] = useState<typeof gatePasses[0] | null>(null);

  // Search & Filter state for each tab
  const [gateSearch, setGateSearch] = useState('');
  const [gateFilter, setGateFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  const [apptSearch, setApptSearch] = useState('');
  const [apptFilter, setApptFilter] = useState<'all' | 'approved' | 'pending' | 'completed'>('all');

  const [certSearch, setCertSearch] = useState('');
  const [certFilter, setCertFilter] = useState<'all' | 'issued' | 'pending'>('all');

  const [infirmarySearch, setInfirmarySearch] = useState('');
  const [infirmaryFilter, setInfirmaryFilter] = useState<'all' | 'treated' | 'sent-home'>('all');

  const [ptmSearch, setPtmSearch] = useState('');
  const [ptmFilter, setPtmFilter] = useState<'all' | 'one-time' | 'recurring'>('all');

  const [confirmSearch, setConfirmSearch] = useState('');
  const [confirmFilter, setConfirmFilter] = useState<'all' | 'pending' | 'submitted'>('all');

  // Form states for adding items
  const [newGateVisitor, setNewGateVisitor] = useState('');
  const [newGateRelation, setNewGateRelation] = useState('Mother');
  const [newGateDate, setNewGateDate] = useState('2026-10-23');
  const [newGateTime, setNewGateTime] = useState('12:00');
  const [newGateReason, setNewGateReason] = useState('');

  const [newApptWith, setNewApptWith] = useState('Mrs. Meera Iyer (Mathematics)');
  const [newApptDate, setNewApptDate] = useState('2026-10-25');
  const [newApptTime, setNewApptTime] = useState('10:00');
  const [newApptType, setNewApptType] = useState('PTM');
  const [newApptNotes, setNewApptNotes] = useState('');

  const [newCertType, setNewCertType] = useState<'bonafide' | 'leaving'>('bonafide');
  const [newCertReason, setNewCertReason] = useState('');

  // Handle Form Submissions
  const handleAddGatePass = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newGateVisitor.trim() || !newGateReason.trim()) {
      showToast('Please provide both visitor name and pickup reason.', 'error');
      return;
    }
    const relationSuffix = newGateRelation ? ` (${newGateRelation})` : '';
    const newPass = {
      id: `g-${Date.now()}`,
      visitorName: `${newGateVisitor.trim()}${relationSuffix}`,
      date: newGateDate || '2026-10-23',
      time: newGateTime || '12:00',
      reason: newGateReason.trim(),
      status: 'pending' as const,
    };
    setPassList([newPass, ...passList]);
    setShowGatePass(false);
    setNewGateVisitor('');
    setNewGateReason('');
    showToast('Gate pass request submitted successfully. Tracking approval status.', 'success');
  };

  const handleAddAppointment = (e?: React.FormEvent) => {
    e?.preventDefault();
    const newAppt = {
      id: `ap-${Date.now()}`,
      withWhom: newApptWith,
      date: newApptDate || '2026-10-25',
      time: newApptTime || '10:00',
      type: newApptType,
      status: 'pending' as const,
    };
    setApptList([newAppt, ...apptList]);
    setShowAppointment(false);
    setNewApptNotes('');
    showToast('Appointment request booked successfully. Pending confirmation.', 'success');
  };

  const handleAddCertificate = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newCertReason.trim()) {
      showToast('Please enter the reason for the certificate application.', 'error');
      return;
    }
    const newCert = {
      id: `cr-${Date.now()}`,
      type: newCertType,
      date: '2026-10-23',
      reason: newCertReason.trim(),
      status: 'pending' as const,
    };
    setCertList([newCert, ...certList]);
    setShowCertificate(false);
    setNewCertReason('');
    showToast(`${newCertType === 'bonafide' ? 'Bonafide' : 'Leaving'} Certificate application submitted successfully.`, 'success');
  };

  const handleConsentAction = (id: string, action: 'submitted' | 'declined') => {
    setConfirmList(prev =>
      prev.map(c => (c.id === id ? { ...c, status: action === 'submitted' ? 'submitted' : 'pending' } : c))
    );
    if (action === 'submitted') {
      showToast('Consent form approved and successfully recorded.', 'success');
    } else {
      showToast('School request marked as declined.', 'info');
    }
  };

  // Helper to parse visitor name & relation
  const parseVisitor = (raw: string) => {
    const match = raw.match(/^(.*?)(?:\s*\((.*?)\)|\s+(Uncle|Aunt|Father|Mother|Grandfather|Grandmother))?$/i);
    if (match) {
      const name = match[1]?.trim() || raw;
      const relation = match[2] || match[3] || '';
      return { name, relation };
    }
    return { name: raw, relation: '' };
  };

  // Helper to parse appointment person
  const parseWithWhom = (raw: string) => {
    const isTeacher = raw.includes('Mrs.') || raw.includes('Mr.') || raw.includes('Dr.');
    const match = raw.match(/^(.*?)(?:\s*\((.*?)\))?$/);
    const primary = match ? match[1]?.trim() : raw;
    const secondary = match && match[2] ? match[2].trim() : '';
    return { isTeacher, primary, secondary };
  };

  // Filtered lists
  const filteredPassList = passList.filter(g => {
    const matchesFilter = gateFilter === 'all' || g.status === gateFilter;
    const matchesSearch =
      g.visitorName.toLowerCase().includes(gateSearch.toLowerCase()) ||
      g.reason.toLowerCase().includes(gateSearch.toLowerCase()) ||
      g.date.includes(gateSearch);
    return matchesFilter && matchesSearch;
  });

  const filteredApptList = apptList.filter(a => {
    const matchesFilter = apptFilter === 'all' || a.status === apptFilter;
    const matchesSearch =
      a.withWhom.toLowerCase().includes(apptSearch.toLowerCase()) ||
      a.type.toLowerCase().includes(apptSearch.toLowerCase()) ||
      a.date.includes(apptSearch);
    return matchesFilter && matchesSearch;
  });

  const filteredCertList = certList.filter(c => {
    const matchesFilter = certFilter === 'all' || c.status === certFilter;
    const matchesSearch =
      c.type.toLowerCase().includes(certSearch.toLowerCase()) ||
      c.reason.toLowerCase().includes(certSearch.toLowerCase()) ||
      c.date.includes(certSearch);
    return matchesFilter && matchesSearch;
  });

  const filteredInfirmary = infirmaryList.filter(v => {
    const matchesFilter = infirmaryFilter === 'all' || v.status === infirmaryFilter;
    const matchesSearch =
      v.complaint.toLowerCase().includes(infirmarySearch.toLowerCase()) ||
      v.treatment.toLowerCase().includes(infirmarySearch.toLowerCase()) ||
      v.date.includes(infirmarySearch);
    return matchesFilter && matchesSearch;
  });

  const filteredPtm = ptmList.filter(p => {
    const matchesFilter = ptmFilter === 'all' || p.type === ptmFilter;
    const matchesSearch =
      p.teacher.toLowerCase().includes(ptmSearch.toLowerCase()) ||
      p.date.includes(ptmSearch) ||
      p.time.includes(ptmSearch);
    return matchesFilter && matchesSearch;
  });

  const filteredConfirmList = confirmList.filter(c => {
    const matchesFilter = confirmFilter === 'all' || c.status === confirmFilter;
    const matchesSearch =
      c.title.toLowerCase().includes(confirmSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(confirmSearch.toLowerCase()) ||
      c.date.includes(confirmSearch);
    return matchesFilter && matchesSearch;
  });

  // Requirement Services Configuration from Section 3.3
  const tabsConfig = [
    { key: 'gatepass', label: 'Student Pickup', count: passList.length },
    { key: 'appointment', label: 'Book Appointment', count: apptList.length },
    { key: 'certificate', label: 'Apply for Certificate', count: certList.length },
    { key: 'infirmary', label: 'Infirmary', count: infirmaryList.length },
    { key: 'ptm', label: 'PTM', count: ptmList.length },
    { key: 'confirmation', label: 'Confirmation', count: confirmList.filter(c => c.status === 'pending').length },
  ] as const;

  // Active Tab Metadata from Requirement 3.3
  const activeServiceMeta = {
    gatepass: {
      title: 'Student Pickup Gate Pass',
      badge: 'Helpdesk Service 01',
      description: 'Request a gate pass: who is coming, their name, date, time and reason. Track approval status.',
      actionText: 'New Gate Pass',
      icon: 'solar:card-2-linear',
      onAction: () => setShowGatePass(true),
      stats: [
        { label: 'Total Passes', value: passList.length, color: '#17153A' },
        { label: 'Approved', value: passList.filter(p => p.status === 'approved').length, color: '#15803D' },
        { label: 'Pending', value: passList.filter(p => p.status === 'pending').length, color: '#B45309' },
      ],
    },
    appointment: {
      title: 'Book Appointment',
      badge: 'Helpdesk Service 02',
      description: 'Book a meeting with a teacher or the office and view appointment history.',
      actionText: 'Book Appointment',
      icon: 'solar:calendar-date-linear',
      onAction: () => setShowAppointment(true),
      stats: [
        { label: 'Total Appointments', value: apptList.length, color: '#17153A' },
        { label: 'Approved', value: apptList.filter(a => a.status === 'approved').length, color: '#15803D' },
        { label: 'Pending', value: apptList.filter(a => a.status === 'pending').length, color: '#B45309' },
        { label: 'Completed', value: apptList.filter(a => a.status === 'completed').length, color: '#2563EB' },
      ],
    },
    certificate: {
      title: 'Apply for Certificate',
      badge: 'Helpdesk Service 03',
      description: 'Apply for certificates such as bonafide or leaving certificate, track status and download when issued.',
      actionText: 'Apply for Certificate',
      icon: 'solar:document-text-linear',
      onAction: () => setShowCertificate(true),
      stats: [
        { label: 'Total Requests', value: certList.length, color: '#17153A' },
        { label: 'Issued (Ready)', value: certList.filter(c => c.status === 'issued').length, color: '#15803D' },
        { label: 'In Review', value: certList.filter(c => c.status === 'pending').length, color: '#B45309' },
      ],
    },
    infirmary: {
      title: 'Infirmary Visit History',
      badge: 'Helpdesk Service 04',
      description: "View the child's infirmary visit history, with filter.",
      actionText: null,
      icon: 'solar:heart-pulse-linear',
      onAction: null,
      stats: [
        { label: 'Total Visits', value: infirmaryList.length, color: '#17153A' },
        { label: 'Treated on Campus', value: infirmaryList.filter(v => v.status === 'treated').length, color: '#15803D' },
        { label: 'Sent Home', value: infirmaryList.filter(v => v.status === 'sent-home').length, color: '#B45309' },
      ],
    },
    ptm: {
      title: 'Parent-Teacher Meetings (PTM)',
      badge: 'Helpdesk Service 05',
      description: 'View parent–teacher meetings (one-time and recurring weekly) with status.',
      actionText: null,
      icon: 'solar:users-group-rounded-linear',
      onAction: null,
      stats: [
        { label: 'Total Meetings', value: ptmList.length, color: '#17153A' },
        { label: 'Scheduled', value: ptmList.filter(p => p.status === 'scheduled').length, color: '#15803D' },
        { label: 'Completed', value: ptmList.filter(p => p.status === 'completed').length, color: '#2563EB' },
      ],
    },
    confirmation: {
      title: 'School Confirmations & Consents',
      badge: 'Helpdesk Service 06',
      description: 'Respond to school confirmation requests such as event participation or consent forms.',
      actionText: null,
      icon: 'solar:check-circle-linear',
      onAction: null,
      stats: [
        { label: 'Total Requests', value: confirmList.length, color: '#17153A' },
        { label: 'Action Required', value: confirmList.filter(c => c.status === 'pending').length, color: '#B45309' },
        { label: 'Consent Submitted', value: confirmList.filter(c => c.status === 'submitted').length, color: '#15803D' },
      ],
    },
  }[tab];

  return (
    <div className="animate-fade-in space-y-5 pb-8 w-full">
      {/* Page Header */}
      <div>
        <Breadcrumb items={['Parent Portal', 'Helpdesk']} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
          <div>
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">
              Helpdesk
            </h1>
          </div>
          {activeServiceMeta.actionText && activeServiceMeta.onAction && (
            <div className="shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={activeServiceMeta.onAction}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] active:bg-[#40000B] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap"
              >
                <span>{activeServiceMeta.actionText}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tab Bar matching Image 2 layout */}
      <Tabs tabs={tabsConfig as any} active={tab} onChange={(val) => setTab(val as typeof tab)} />

      {/* Tab 1: Student Pickup (Gate Pass) */}
      {tab === 'gatepass' && (
        <div className="space-y-4">
          {/* Clean Gate Pass Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Visitor
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredPassList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-[#64748B] text-[14px]">
                        No gate pass records found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredPassList.map(g => {
                      const parsed = parseVisitor(g.visitorName);
                      return (
                        <tr key={g.id} className="hover:bg-[#F8FAFC] transition-colors">
                          {/* Visitor */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#17153A] text-[14px]">
                                {parsed.name}
                              </span>
                              {parsed.relation && (
                                <span className="px-2 py-0.5 rounded-md text-[12px] font-medium bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                                  {parsed.relation}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Date & Time */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-[13px] font-medium text-[#17153A]">
                              {g.date} <span className="text-[#94A3B8] mx-1.5">&bull;</span> {g.time}
                            </span>
                          </td>

                          {/* Reason */}
                          <td className="px-5 py-4">
                            <p className="text-[14px] text-[#334155] leading-relaxed max-w-sm">
                              {g.reason}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4 whitespace-nowrap text-center">
                            {g.status === 'approved' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                                Approved
                              </span>
                            )}
                            {g.status === 'pending' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                                Pending
                              </span>
                            )}
                            {g.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                                Rejected
                              </span>
                            )}
                          </td>

                          {/* Action (View Gate Pass Slip) */}
                          <td className="px-5 py-4 whitespace-nowrap text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedPassSlip(g)}
                              className="inline-flex items-center px-3 py-1.5 rounded-xl text-[12px] font-semibold text-[#17153A] bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-[#FAF7F2] hover:border-[#7C612A] hover:text-[#7C612A] transition-all cursor-pointer"
                            >
                              <span>View Pass</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Request Gate Pass Modal with Section 3.3 Details */}
          <Modal
            open={showGatePass}
            onClose={() => setShowGatePass(false)}
            title="Request Student Gate Pass"
            footer={
              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowGatePass(false)}
                  className="px-4 py-2 text-[14px] font-semibold text-[#64748B] hover:text-[#17153A] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddGatePass}
                  className="px-4 py-2 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Submit Request
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[12px] text-[#7C612A] flex items-center gap-2">
                <Icon name="solar:info-circle-linear" size={16} className="shrink-0" />
                <span>Specify who is coming, their name, date, time and reason as per campus safety rules.</span>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#1E293B] mb-1.5">
                  Who is coming? (Relationship to Student) <span className="text-[#DC2626]">*</span>
                </label>
                <select
                  value={newGateRelation}
                  onChange={e => setNewGateRelation(e.target.value)}
                  className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] focus:border-[#7C612A] outline-none"
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Uncle">Uncle</option>
                  <option value="Aunt">Aunt</option>
                  <option value="Grandfather">Grandfather</option>
                  <option value="Grandmother">Grandmother</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Authorized Driver">Authorized Driver</option>
                </select>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#1E293B] mb-1.5">
                  Visitor Full Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={newGateVisitor}
                  onChange={e => setNewGateVisitor(e.target.value)}
                  placeholder="e.g., Priya Sharma"
                  className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] placeholder-[#94A3B8] focus:border-[#7C612A] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Pickup Date"
                  type="date"
                  value={newGateDate}
                  onChange={e => setNewGateDate(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-[14px] font-medium text-[#1E293B] mb-1.5">
                    Pickup Time <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="time"
                    value={newGateTime}
                    onChange={e => setNewGateTime(e.target.value)}
                    className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] focus:border-[#7C612A] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#1E293B] mb-1.5">
                  Reason for Early Pickup <span className="text-[#DC2626]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={newGateReason}
                  onChange={e => setNewGateReason(e.target.value)}
                  placeholder="e.g., Doctor appointment, Family function pickup, Medical emergency"
                  className="w-full p-3 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] placeholder-[#94A3B8] focus:border-[#7C612A] outline-none resize-none"
                  required
                />
              </div>
            </div>
          </Modal>

          {/* Official Digital Gate Pass Slip Modal */}
          {selectedPassSlip && (
            <Modal
              open={!!selectedPassSlip}
              onClose={() => setSelectedPassSlip(null)}
              title="Official Campus Gate Pass Slip"
              footer={
                <div className="flex items-center justify-between w-full">
                  <div className="text-[12px] text-[#64748B] flex items-center gap-1.5">
                    <Icon name="solar:shield-check-linear" size={15} className="text-[#15803D]" />
                    <span>Campus Gate 1 Authorization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPassSlip(null)}
                      className="px-4 py-2 text-[14px] font-semibold text-[#64748B] hover:text-[#17153A] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        showToast('Printing Gate Pass slip...', 'success');
                      }}
                      className="px-4 py-2 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Icon name="solar:printer-minimalistic-linear" size={15} />
                      <span>Print Slip</span>
                    </button>
                  </div>
                </div>
              }
            >
              <div className="space-y-4">
                {/* Gate Pass Card */}
                <div className="rounded-2xl border-2 border-dashed border-[#7C612A]/40 bg-[#FAF7F2]/40 p-5 space-y-4 relative overflow-hidden">
                  {/* Decorative stamp watermark */}
                  <div className="absolute right-4 top-4 rotate-12 pointer-events-none opacity-20">
                    <div className="border-4 border-[#15803D] text-[#15803D] font-extrabold text-[18px] px-3 py-1 rounded-lg uppercase tracking-widest">
                      GATE APPROVED
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#17153A] text-white flex items-center justify-center font-bold text-[16px]">
                        SIS
                      </div>
                      <div>
                        <h3 className="font-bold text-[14px] text-[#17153A]">Sadvidhya International School</h3>
                        <p className="text-[12px] text-[#64748B]">Security Gate Clearance Pass</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[12px] font-bold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                      {selectedPassSlip.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[12px]">
                    <div className="bg-white p-3 rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block text-[12px] mb-0.5">Student Name</span>
                      <span className="font-bold text-[#17153A] text-[14px]">Aarav Sharma</span>
                      <span className="text-[#7C612A] text-[12px] block mt-0.5">Grade 8-A (Roll #14)</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block text-[12px] mb-0.5">Authorized Visitor</span>
                      <span className="font-bold text-[#17153A] text-[14px]">{selectedPassSlip.visitorName}</span>
                      <span className="text-[#64748B] text-[12px] block mt-0.5">Authorized by Parent</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block text-[12px] mb-0.5">Pickup Date & Time</span>
                      <span className="font-semibold text-[#17153A] text-[12px]">{selectedPassSlip.date} at {selectedPassSlip.time}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block text-[12px] mb-0.5">Pass Reference</span>
                      <span className="font-mono font-semibold text-[#17153A] text-[12px]">SIS-GP-{selectedPassSlip.id.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] text-[12px]">
                    <span className="text-[#64748B] block text-[12px] mb-0.5">Reason for Pickup</span>
                    <p className="text-[#334155] font-medium text-[14px]">{selectedPassSlip.reason}</p>
                  </div>

                  <div className="pt-2 text-[12px] text-[#64748B] flex items-center justify-between border-t border-[#E8DFC8]">
                    <span>Security Checkpoint: Gate 1</span>
                    <span className="font-mono text-[#94A3B8]">SIS-SEC-VERIFIED-2026</span>
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}

      {/* Tab 2: Book Appointment */}
      {tab === 'appointment' && (
        <div className="space-y-4">

          {/* Clean Appointment Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Meeting With
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredApptList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-[#64748B] text-[14px]">
                        No appointment records found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredApptList.map(a => {
                      const parsed = parseWithWhom(a.withWhom);
                      return (
                        <tr key={a.id} className="hover:bg-[#F8FAFC] transition-colors">
                          {/* With (Strict Teacher Avatar Rule) */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {parsed.isTeacher ? (
                                <TeacherAvatar name={parsed.primary || a.withWhom} size={32} />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-[#17153A] text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                                  OFF
                                </div>
                              )}
                              <div>
                                <span className="font-semibold text-[#17153A] text-[14px] block">
                                  {parsed.primary}
                                </span>
                                {parsed.secondary && (
                                  <span className="text-[12px] text-[#64748B]">{parsed.secondary}</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Date & Time */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-[13px] font-medium text-[#17153A]">
                              {a.date} <span className="text-[#94A3B8] mx-1.5">&bull;</span> {a.time}
                            </span>
                          </td>

                          {/* Type */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                              {a.type}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4 whitespace-nowrap text-center">
                            {a.status === 'approved' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                                Approved
                              </span>
                            )}
                            {a.status === 'pending' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                                Pending
                              </span>
                            )}
                            {a.status === 'completed' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                                Completed
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Book Appointment Modal */}
          <Modal
            open={showAppointment}
            onClose={() => setShowAppointment(false)}
            title="Book an Appointment"
            footer={
              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAppointment(false)}
                  className="px-4 py-2 text-[14px] font-semibold text-[#64748B] hover:text-[#17153A] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddAppointment}
                  className="px-4 py-2 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Request Appointment
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[12px] text-[#7C612A] flex items-center gap-2">
                <Icon name="solar:info-circle-linear" size={16} className="shrink-0" />
                <span>Book a meeting with a teacher or the office and view appointment history.</span>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#1E293B] mb-1.5">
                  Meeting With <span className="text-[#DC2626]">*</span>
                </label>
                <select
                  value={newApptWith}
                  onChange={e => setNewApptWith(e.target.value)}
                  className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] focus:border-[#7C612A] outline-none"
                >
                  <option value="Mrs. Meera Iyer (Mathematics)">Mrs. Meera Iyer (Mathematics)</option>
                  <option value="Mr. Arjun Kapoor (English)">Mr. Arjun Kapoor (English)</option>
                  <option value="Mrs. Deepika Nair (Science)">Mrs. Deepika Nair (Science)</option>
                  <option value="School Office - Principal">School Office - Principal</option>
                  <option value="School Administration Office">School Administration Office</option>
                </select>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#1E293B] mb-1.5">
                  Meeting Type
                </label>
                <select
                  value={newApptType}
                  onChange={e => setNewApptType(e.target.value)}
                  className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] focus:border-[#7C612A] outline-none"
                >
                  <option value="PTM">PTM (Parent-Teacher Meeting)</option>
                  <option value="Office">Office Meeting</option>
                  <option value="Academic Counseling">Academic Counseling</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Preferred Date"
                  type="date"
                  value={newApptDate}
                  onChange={e => setNewApptDate(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-[14px] font-medium text-[#1E293B] mb-1.5">
                    Preferred Time <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="time"
                    value={newApptTime}
                    onChange={e => setNewApptTime(e.target.value)}
                    className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] focus:border-[#7C612A] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#1E293B] mb-1.5">
                  Agenda / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newApptNotes}
                  onChange={e => setNewApptNotes(e.target.value)}
                  placeholder="Mention topics you would like to discuss..."
                  className="w-full p-3 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] placeholder-[#94A3B8] focus:border-[#7C612A] outline-none resize-none"
                />
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* Tab 3: Apply for Certificate */}
      {tab === 'certificate' && (
        <div className="space-y-4">
          {/* Clean Certificate Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Certificate Type
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredCertList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-[#64748B] text-[14px]">
                        No certificate applications found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCertList.map(c => (
                      <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                        {/* Certificate Type */}
                        <td className="px-5 py-4">
                          <span className="font-semibold text-[#17153A] text-[14px] capitalize block">
                            {c.type === 'bonafide' ? 'Bonafide Certificate' : 'Leaving Certificate (LC)'}
                          </span>
                        </td>

                        {/* Applied Date */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-[13px] font-medium text-[#17153A]">{c.date}</span>
                        </td>

                        {/* Reason */}
                        <td className="px-5 py-4">
                          <p className="text-[14px] text-[#334155] leading-relaxed max-w-sm">
                            {c.reason}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 whitespace-nowrap text-center">
                          {c.status === 'issued' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                              Issued & Ready
                            </span>
                          )}
                          {c.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                              Pending Approval
                            </span>
                          )}
                          {c.status === 'approved' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                              Approved
                            </span>
                          )}
                        </td>

                        {/* Action (Download when issued as per requirement 3.3) */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          {c.status === 'issued' ? (
                            <button
                              type="button"
                              onClick={() => showToast(`Downloading official ${c.type} certificate PDF...`, 'success')}
                              className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-[12px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] hover:bg-[#7C612A] hover:text-white transition-all cursor-pointer shadow-2xs"
                            >
                              <span>Download PDF</span>
                            </button>
                          ) : (
                            <span className="text-[12px] text-[#94A3B8] italic">Processing at Office</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Apply for Certificate Modal */}
          <Modal
            open={showCertificate}
            onClose={() => setShowCertificate(false)}
            title="Apply for School Certificate"
            footer={
              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCertificate(false)}
                  className="px-4 py-2 text-[14px] font-semibold text-[#64748B] hover:text-[#17153A] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCertificate}
                  className="px-4 py-2 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[12px] text-[#7C612A] flex items-center gap-2">
                <Icon name="solar:info-circle-linear" size={16} className="shrink-0" />
                <span>Apply for certificates such as bonafide or leaving certificate, track status and download when issued.</span>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#1E293B] mb-1.5">
                  Certificate Type <span className="text-[#DC2626]">*</span>
                </label>
                <select
                  value={newCertType}
                  onChange={e => setNewCertType(e.target.value as any)}
                  className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] focus:border-[#7C612A] outline-none"
                >
                  <option value="bonafide">Bonafide Certificate</option>
                  <option value="leaving">Leaving Certificate (LC)</option>
                </select>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#1E293B] mb-1.5">
                  Reason for Application <span className="text-[#DC2626]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={newCertReason}
                  onChange={e => setNewCertReason(e.target.value)}
                  placeholder="e.g., Required for passport renewal, bank account opening, or higher secondary admission"
                  className="w-full p-3 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] placeholder-[#94A3B8] focus:border-[#7C612A] outline-none resize-none"
                  required
                />
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* Tab 4: Infirmary (View child's infirmary visit history, with filter as per requirement 3.3) */}
      {tab === 'infirmary' && (
        <div className="space-y-4">

          {/* Clean Infirmary Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Complaint
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Treatment & Remarks
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredInfirmary.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-[#64748B] text-[14px]">
                        No infirmary visit records found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInfirmary.map(v => (
                      <tr key={v.id} className="hover:bg-[#F8FAFC] transition-colors">
                        {/* Date & Time */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-[13px] font-medium text-[#17153A]">
                            {v.date} <span className="text-[#94A3B8] mx-1.5">&bull;</span> {v.timeIn} - {v.timeOut}
                          </span>
                        </td>

                        {/* Complaint */}
                        <td className="px-5 py-4">
                          <span className="font-semibold text-[#17153A] text-[14px]">
                            {v.complaint}
                          </span>
                        </td>

                        {/* Treatment & Remarks */}
                        <td className="px-5 py-4">
                          <p className="text-[14px] text-[#334155] leading-relaxed max-w-md">
                            {v.treatment}
                          </p>
                          {v.remarks && (
                            <p className="text-[12px] text-[#64748B] italic mt-1">
                              Note: {v.remarks}
                            </p>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 whitespace-nowrap text-center">
                          {v.status === 'treated' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                              Treated
                            </span>
                          )}
                          {v.status === 'sent-home' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                              Sent Home
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: PTM (one-time and recurring weekly with status as per requirement 3.3) */}
      {tab === 'ptm' && (
        <div className="space-y-4">

          {/* Clean PTM Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Meeting Type
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredPtm.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-[#64748B] text-[14px]">
                        No parent-teacher meeting records found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredPtm.map(p => (
                      <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                        {/* Date & Time */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-[13px] font-medium text-[#17153A]">
                            {p.date} <span className="text-[#94A3B8] mx-1.5">&bull;</span> {p.time}
                          </span>
                        </td>

                        {/* Teacher (Strict Teacher Avatar Rule) */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <TeacherAvatar name={p.teacher} size={32} />
                            <span className="font-semibold text-[#17153A] text-[14px]">
                              {p.teacher}
                            </span>
                          </div>
                        </td>

                        {/* Meeting Type */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8] capitalize">
                            {p.type === 'recurring' ? 'Recurring Weekly' : 'One-Time PTM'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 whitespace-nowrap text-center">
                          {p.status === 'scheduled' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                              Scheduled
                            </span>
                          )}
                          {p.status === 'completed' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                              Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Confirmation (Respond to school confirmation requests as per requirement 3.3) */}
      {tab === 'confirmation' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {filteredConfirmList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center text-[#64748B] text-[14px]">
                No confirmation requests found matching your filter criteria.
              </div>
            ) : (
              filteredConfirmList.map(c => {
                const isPending = c.status === 'pending';
                return (
                  <div
                    key={c.id}
                    className={`rounded-2xl border p-5 transition-all duration-200 ${isPending
                      ? 'bg-[#FFFFFF] border-[#7C612A]/40 shadow-[0_2px_12px_#00000006]'
                      : 'bg-[#FFFFFF] border-[#E2E8F0] shadow-[0_2px_8px_#00000004]'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-bold text-[#17153A] text-[16px]">
                            {c.title}
                          </span>
                          {isPending ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                              Action Required
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                              Consent Submitted
                            </span>
                          )}
                        </div>

                        <div className="text-[12px] text-[#64748B]">
                          <span>Issued Date: {c.date}</span>
                        </div>

                        <p className="text-[14px] text-[#475569] leading-relaxed pt-1">
                          {c.description}
                        </p>
                      </div>

                      {isPending && (
                        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => handleConsentAction(c.id, 'declined')}
                            className="px-3.5 py-2 rounded-xl text-[14px] font-semibold text-[#64748B] hover:text-[#BE123C] border border-[#CBD5E1] hover:bg-[#FFF1F2] transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConsentAction(c.id, 'submitted')}
                            className="px-4 py-2 rounded-xl text-[14px] font-semibold text-white bg-[#15803D] hover:bg-[#166534] transition-colors shadow-sm cursor-pointer"
                          >
                            <span>Approve Consent</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Help() {
  const [openFaq, setOpenFaq] = useState<string | null>('q1');

  return (
    <div className="animate-fade-in space-y-5 w-full pb-8">
      {/* Page Header */}
      <div>
        <Breadcrumb items={['Parent Portal', 'Help & Support']} />
        <div className="flex items-center justify-between gap-4 mt-1">
          <div>
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">
              Help
            </h1>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: FAQs (2 Cols) */}
        <div className="lg:col-span-2 space-y-2.5">
          {faqs.map(f => {
            const isOpen = openFaq === f.id;
            return (
              <div
                key={f.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen
                  ? 'bg-[#FFFFFF] border-[#7C612A] shadow-[0_2px_10px_#0000000a]'
                  : 'bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#CBD5E1] shadow-[0_2px_8px_#00000004]'
                  }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : f.id)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer hover:bg-[#F8FAFC]"
                >
                  <span className="text-[14px] font-semibold text-[#17153A]">
                    {f.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 ${isOpen
                      ? 'rotate-180 bg-[#17153A] text-white border-[#17153A]'
                      : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                      }`}
                  >
                    <Icon name="solar:alt-arrow-down-linear" size={14} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 border-t border-[#F1F5F9] bg-[#FFFFFF] animate-slide-up">
                    <p className="text-[14px] text-[#475569] leading-relaxed pt-1.5">
                      {f.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: School Contact Card (1 Col) */}
        <div>
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft p-5 space-y-4 sticky top-6">
            {/* Clean Card Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] flex items-center justify-center text-[#7C612A] shrink-0">
                  <Icon name="solar:buildings-2-linear" size={18} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#17153A]">School Contact</h3>
                  <p className="text-[12px] text-[#64748B]">Official Administration Office</p>
                </div>
              </div>
            </div>

            {/* Clean & Professional Contact List */}
            <div className="space-y-2.5">
              {/* Address */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center text-[#7C612A] shrink-0 mt-0.5">
                    <Icon name="solar:map-point-linear" size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Address
                    </span>
                    <p className="text-[14px] text-[#17153A] font-semibold leading-relaxed mt-0.5">
                      {schoolInfo.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center text-[#7C612A] shrink-0">
                      <Icon name="solar:phone-calling-linear" size={16} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                        Phone
                      </span>
                      <a
                        href={`tel:${schoolInfo.phone}`}
                        className="text-[14px] text-[#17153A] font-semibold hover:text-[#7C612A] transition-colors block mt-0.5"
                      >
                        {schoolInfo.phone}
                      </a>
                    </div>
                  </div>
                  <a
                    href={`tel:${schoolInfo.phone}`}
                    className="px-2.5 py-1 text-[12px] font-medium text-[#17153A] bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg hover:bg-[#F1F5F9] transition-colors shrink-0"
                  >
                    Call
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center text-[#7C612A] shrink-0">
                      <Icon name="solar:letter-linear" size={16} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                        Email
                      </span>
                      <a
                        href={`mailto:${schoolInfo.email}`}
                        className="text-[14px] text-[#17153A] font-semibold hover:text-[#7C612A] transition-colors block truncate max-w-[170px] mt-0.5"
                        title={schoolInfo.email}
                      >
                        {schoolInfo.email}
                      </a>
                    </div>
                  </div>
                  <a
                    href={`mailto:${schoolInfo.email}`}
                    className="px-2.5 py-1 text-[12px] font-medium text-[#17153A] bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg hover:bg-[#F1F5F9] transition-colors shrink-0"
                  >
                    Mail
                  </a>
                </div>
              </div>

              {/* Visiting Hours */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center text-[#7C612A] shrink-0 mt-0.5">
                    <Icon name="solar:clock-circle-linear" size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Visiting Hours
                    </span>
                    <p className="text-[14px] text-[#17153A] font-semibold mt-0.5">
                      Mon–Sat, 8 AM – 4 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
