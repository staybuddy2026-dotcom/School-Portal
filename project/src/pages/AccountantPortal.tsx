import { useState, useEffect, useMemo } from 'react';
import { Icon } from '@/components/Icon';
import { Button, Avatar, Breadcrumb, Modal, Input, Select, Textarea, showToast, Tabs } from '@/components/ui';
import { generateReceiptPdf } from '@/utils/receiptPdf';
import { StudentFeeLedger } from '@/pages/accountant/StudentFeeLedger';
import { FeeCollectionHub } from '@/pages/accountant/FeeCollectionHub';
import { TransactionsHub } from '@/pages/accountant/TransactionsHub';
import { ReportsAndReminders } from '@/pages/accountant/ReportsAndReminders';
import { studentPhotos } from '@/data';

interface AccountantPortalProps {
  activeKey: string;
  onNavigate?: (key: string) => void;
}

export function AccountantPortal({ activeKey, onNavigate }: AccountantPortalProps) {
  switch (activeKey) {
    case 'acc-dashboard':
      return <AccDashboard onNavigate={onNavigate} />;

    // Operations: Fee Collection Hub
    case 'acc-collect':
    case 'acc-offline':
      return <FeeCollectionHub initialSubTab="pos" />;
    case 'acc-online':
      return <FeeCollectionHub initialSubTab="online" />;
    case 'acc-transport-fee':
      return <FeeCollectionHub initialSubTab="transport" />;
    case 'acc-cheques':
      return <FeeCollectionHub initialSubTab="cheques" />;

    // Operations: Student Fee Ledgers
    case 'acc-ledger':
    case 'acc-concessions':
      return <StudentFeeLedger />;

    // Management: Fee Master & Setup
    case 'acc-fee-setup':
    case 'acc-fee-heads':
    case 'acc-fees-config':
      return <FeesConfiguration initialTab="heads" />;
    case 'acc-fee-structure':
      return <FeesConfiguration initialTab="structure" />;
    case 'acc-instalments':
      return <FeesConfiguration initialTab="instalments" />;
    case 'acc-late-fee':
      return <FeesConfiguration initialTab="late-fee" />;

    // Management: Transactions Hub
    case 'acc-transactions':
    case 'acc-receipts':
      return <TransactionsHub initialSubTab="receipts" />;
    case 'acc-refunds':
      return <TransactionsHub initialSubTab="refunds" />;
    case 'acc-reconciliation':
      return <TransactionsHub initialSubTab="reconciliation" />;

    // Management: Reports & Reminders
    case 'acc-reports':
      return <ReportsAndReminders initialSubTab="reports" />;
    case 'acc-reminders':
      return <ReportsAndReminders initialSubTab="reminders" />;

    // Account: My Profile
    case 'acc-profile':
      return <AccProfile />;

    default:
      return <AccDashboard />;
  }
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

function AccDashboard({ onNavigate }: { onNavigate?: (key: string) => void }) {
  const [downloadingReceipt, setDownloadingReceipt] = useState<string | null>(null);

  const paymentsData = [
    {
      id: 'f1',
      student: 'Aarav Sharma',
      studentClass: 'Class 10-A',
      title: 'Instalment 1 - Tuition',
      receipt: 'RCP-05401',
      dueDate: '2026-05-31',
      amount: 25000,
      paid: 25000,
      balanceDue: 0,
      status: 'paid' as const,
    },
    {
      id: 'f2',
      student: 'Diya Patel',
      studentClass: 'Class 9-B',
      title: 'Instalment 2 - Tuition',
      receipt: 'RCP-05400',
      dueDate: '2026-08-10',
      amount: 25000,
      paid: 15000,
      balanceDue: 10000,
      status: 'partial' as const,
    },
    {
      id: 'f3',
      student: 'Ishaan Verma',
      studentClass: 'Class 8-A',
      title: 'Instalment 3 - Tuition',
      receipt: 'RCP-05399',
      dueDate: '2026-11-10',
      amount: 25000,
      paid: 25000,
      balanceDue: 0,
      status: 'paid' as const,
    },
    {
      id: 'f4',
      student: 'Saanvi Reddy',
      studentClass: 'Class 10-B',
      title: 'Transport Fee - Term 1',
      receipt: 'RCP-05398',
      dueDate: '2026-06-30',
      amount: 8000,
      paid: 8000,
      balanceDue: 0,
      status: 'paid' as const,
    },
    {
      id: 'f5',
      student: 'Vihaan Joshi',
      studentClass: 'Class 9-A',
      title: 'Transport Fee - Term 2',
      receipt: 'RCP-05397',
      dueDate: '2026-10-31',
      amount: 8000,
      paid: 8000,
      balanceDue: 0,
      status: 'paid' as const,
    },
  ];

  const handleDownloadReceipt = (p: typeof paymentsData[0]) => {
    setDownloadingReceipt(p.receipt);
    try {
      generateReceiptPdf({
        receiptNo: p.receipt,
        date: p.dueDate,
        time: '11:30 AM',
        mode: 'Online',
        amount: p.paid,
        instalment: p.title,
        studentName: p.student,
        class: p.studentClass.replace('Class ', '').split('-')[0] || '10',
        section: p.studentClass.includes('-') ? p.studentClass.split('-')[1] : 'A',
        status: p.status === 'paid' ? 'Paid' : 'Partially Paid',
        balanceDue: p.balanceDue,
      });
      showToast(`Receipt ${p.receipt} downloaded successfully`, 'success');
    } catch {
      showToast(`Failed to generate receipt ${p.receipt}`, 'error');
    } finally {
      setTimeout(() => setDownloadingReceipt(null), 600);
    }
  };

  const statusStyles: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
    paid: { bg: 'bg-[#ECFDF5]', text: 'text-[#059669]', border: 'border-[#A7F3D0]', dot: 'bg-[#10B981]', label: 'Paid' },
    partial: { bg: 'bg-[#FFFBEB]', text: 'text-[#D97706]', border: 'border-[#FDE68A]', dot: 'bg-[#F59E0B]', label: 'Partial' },
    pending: { bg: 'bg-[#F8FAFC]', text: 'text-[#475569]', border: 'border-[#E2E8F0]', dot: 'bg-[#94A3B8]', label: 'Pending' },
    overdue: { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FECACA]', dot: 'bg-[#EF4444]', label: 'Overdue' },
  };

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant Portal', 'Dashboard']} />
          <div className="mt-1">
            <h1 className="text-[22px] sm:text-[24px] font-bold text-brand-navy tracking-tight">Dashboard</h1>
          </div>
        </div>
        {onNavigate && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('acc-collect')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-[12px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Icon name="Plus" size={14} />
              <span>Collect Fee</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('acc-ledger')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-[12px] font-semibold text-[#17153A] bg-white hover:bg-[#FAF7F2] border border-[#CBD5E1] rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Icon name="hugeicons:file-spreadsheet" size={14} />
              <span>Student Ledgers</span>
            </button>
          </div>
        )}
      </div>

      {/* Professional Sparkline Metric Cards (Matching Parent Portal) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6">
        {/* Card 1: Today's Collection */}
        <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_2px_12px_#0f172a08] p-5">
          <div className="text-[14px] font-semibold text-ink-800">
            Today's Collection <span className="text-ink-400 font-normal">/ Daily</span>
          </div>
          <div className="flex items-end justify-between mt-3.5">
            <div>
              <div className="text-[26px] sm:text-[28px] font-bold text-ink-950 tracking-tight leading-none font-mono">
                ₹1.2L
              </div>
            </div>
            <Sparkline
              color="#10B981"
              fillId="spark-acc-today"
              linePath="M 4 40 C 22 40, 36 30, 54 34 C 72 36, 82 20, 98 20 C 110 20, 118 26, 126 24"
              areaPath="M 4 40 C 22 40, 36 30, 54 34 C 72 36, 82 20, 98 20 C 110 20, 118 26, 126 24 L 126 52 L 4 52 Z"
              peakX={98}
              peakY={20}
              label="+15%"
            />
          </div>
        </div>

        {/* Card 2: Month-to-Date */}
        <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_2px_12px_#0f172a08] p-5">
          <div className="text-[14px] font-semibold text-ink-800">
            Month-to-Date <span className="text-ink-400 font-normal">/ Total</span>
          </div>
          <div className="flex items-end justify-between mt-3.5">
            <div>
              <div className="text-[26px] sm:text-[28px] font-bold text-ink-950 tracking-tight leading-none font-mono">
                ₹18.5L
              </div>
            </div>
            <Sparkline
              color="#7C612A"
              fillId="spark-acc-mtd"
              linePath="M 4 38 C 22 40, 36 28, 56 32 C 76 36, 84 14, 100 14 C 112 14, 120 22, 126 20"
              areaPath="M 4 38 C 22 40, 36 28, 56 32 C 76 36, 84 14, 100 14 C 112 14, 120 22, 126 20 L 126 52 L 4 52 Z"
              peakX={100}
              peakY={14}
              label="+8%"
            />
          </div>
        </div>

        {/* Card 3: Total Dues */}
        <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_2px_12px_#0f172a08] p-5">
          <div className="text-[14px] font-semibold text-ink-800">
            Total Dues <span className="text-ink-400 font-normal">/ Pending</span>
          </div>
          <div className="flex items-end justify-between mt-3.5">
            <div>
              <div className="text-[26px] sm:text-[28px] font-bold text-ink-950 tracking-tight leading-none font-mono">
                ₹4.8L
              </div>
            </div>
            <Sparkline
              color="#EF4444"
              fillId="spark-acc-dues"
              linePath="M 4 42 C 20 42, 34 34, 52 36 C 70 38, 80 22, 98 22 C 110 22, 118 28, 126 26"
              areaPath="M 4 42 C 20 42, 34 34, 52 36 C 70 38, 80 22, 98 22 C 110 22, 118 28, 126 26 L 126 52 L 4 52 Z"
              peakX={98}
              peakY={22}
              label="-5%"
            />
          </div>
        </div>

        {/* Card 4: Overdue Instalments */}
        <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_2px_12px_#0f172a08] p-5">
          <div className="text-[14px] font-semibold text-ink-800">
            Overdue Instalments <span className="text-ink-400 font-normal">/ Action</span>
          </div>
          <div className="flex items-end justify-between mt-3.5">
            <div>
              <div className="text-[26px] sm:text-[28px] font-bold text-ink-950 tracking-tight leading-none font-mono">
                23
              </div>
            </div>
            <Sparkline
              color="#F59E0B"
              fillId="spark-acc-overdue"
              linePath="M 4 36 C 24 38, 42 26, 62 30 C 80 34, 92 16, 102 16 C 114 16, 120 22, 126 20"
              areaPath="M 4 36 C 24 38, 42 26, 62 30 C 80 34, 92 16, 102 16 C 114 16, 120 22, 126 20 L 126 52 L 4 52 Z"
              peakX={102}
              peakY={16}
              label="23"
            />
          </div>
        </div>
      </div>

      {/* Modern Fee Instalments / Recent Payments Breakdown Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        {/* Table Top Header */}
        <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between bg-gradient-to-r from-white via-white to-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB]">
              <Icon name="solar:card-linear" size={18} />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#0F172A] tracking-tight">Recent Payments</h3>
              <p className="text-[12px] text-[#64748B]">Academic Session 2026-27 • Real-time payment tracking</p>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-poppins">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                  Student
                </th>
                <th className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                  Instalment Details
                </th>
                <th className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                  Due Date
                </th>
                <th className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] text-right">
                  Amount
                </th>
                <th className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] text-right">
                  Paid
                </th>
                <th className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] text-right">
                  Balance Due
                </th>
                <th className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] text-center">
                  Status
                </th>
                <th className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {paymentsData.map((p, idx) => {
                const cfg = statusStyles[p.status] || statusStyles.paid;
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors hover:bg-[#F8FAFC] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FCFDFE]'}`}
                  >
                    {/* Student Column */}
                    <td className="py-3.5 px-4 border-b border-[#F1F5F9]">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={p.student} size="xs" />
                        <div>
                          <p className="font-semibold text-[14px] text-[#0F172A] leading-tight">{p.student}</p>
                          <p className="text-[11px] text-[#64748B] mt-0.5">{p.studentClass}</p>
                        </div>
                      </div>
                    </td>

                    {/* Instalment Details */}
                    <td className="py-3.5 px-4 border-b border-[#F1F5F9]">
                      <p className="font-semibold text-[14px] text-[#0F172A] leading-tight">{p.title}</p>
                      <span className="font-mono text-[11px] text-[#64748B] mt-0.5 inline-block">{p.receipt}</span>
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-3 border-b border-[#F1F5F9]">
                      <span className="text-[12px] text-[#475569] font-medium">{p.dueDate}</span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-3 text-right border-b border-[#F1F5F9]">
                      <span className="font-bold text-[14px] text-[#0F172A] font-mono">₹{p.amount.toLocaleString('en-IN')}</span>
                    </td>

                    {/* Paid */}
                    <td className="py-3.5 px-3 text-right border-b border-[#F1F5F9]">
                      <span className={`font-semibold text-[14px] font-mono ${p.paid > 0 ? 'text-[#059669]' : 'text-[#94A3B8]'}`}>
                        ₹{p.paid.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Balance Due */}
                    <td className="py-3.5 px-3 text-right border-b border-[#F1F5F9]">
                      <span className={`font-bold text-[14px] font-mono ${p.balanceDue > 0 ? 'text-[#DC2626]' : 'text-[#10B981]'}`}>
                        ₹{p.balanceDue.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Status with dot */}
                    <td className="py-3.5 px-3 text-center border-b border-[#F1F5F9]">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>

                    {/* Action - Exclusively Receipt Download */}
                    <td className="py-3.5 px-4 text-right border-b border-[#F1F5F9]">
                      <button
                        type="button"
                        onClick={() => handleDownloadReceipt(p)}
                        disabled={downloadingReceipt === p.receipt}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-[#475569] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] active:scale-95 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                        title="Download fee receipt"
                      >
                        <Icon
                          name={downloadingReceipt === p.receipt ? "solar:check-circle-linear" : "solar:download-minimalistic-linear"}
                          size={13}
                        />
                        <span>Receipt</span>
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
  );
}

function AccProfile() {
  const [profile, setProfile] = useState({
    // 1. Personal Details
    name: 'Mr. Suresh Bhat',
    gender: 'Male',
    dob: '18 May 1985',
    phone: '+91 98220 11442',
    email: 'suresh@greenwood.edu',
    address: 'Plot No. 15, Vasant Vihar, Bodakdev, Ahmedabad, Gujarat 380054',
    photo: '',

    // 2. Job Details
    empId: 'EMP-2018-0019',
    joiningDate: '12 July 2018',
    qualification: 'M.Com, Chartered Accountant (Inter), Tally ERP',
    designation: 'Chief Accountant',
    department: 'Finance & Accounts Dept',
    experience: '8+ Years (Institutional Accounting)',
    employmentType: 'Full-time',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [editForm, setEditForm] = useState({
    name: profile.name,
    gender: profile.gender,
    dob: profile.dob,
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
    qualification: profile.qualification,
    experience: profile.experience,
    employmentType: profile.employmentType,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });

  const handleOpenEdit = () => {
    setEditForm({
      name: profile.name,
      gender: profile.gender,
      dob: profile.dob,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      qualification: profile.qualification,
      experience: profile.experience,
      employmentType: profile.employmentType,
    });
    setShowEditModal(true);
  };

  const handleOpenPasswordModal = () => {
    setPasswordForm({ currentPass: '', newPass: '', confirmPass: '' });
    setShowCurrentPass(false);
    setShowNewPass(false);
    setShowConfirmPass(false);
    setShowPasswordModal(true);
  };

  const handleSaveProfile = () => {
    if (!editForm.name.trim()) {
      showToast('Full name is required', 'error');
      return;
    }
    if (!editForm.phone.trim()) {
      showToast('Mobile number is required', 'error');
      return;
    }
    if (!editForm.email.trim()) {
      showToast('Email address is required', 'error');
      return;
    }
    setProfile(prev => ({
      ...prev,
      name: editForm.name.trim(),
      gender: editForm.gender,
      dob: editForm.dob,
      phone: editForm.phone.trim(),
      email: editForm.email.trim(),
      address: editForm.address.trim(),
      qualification: editForm.qualification.trim(),
      experience: editForm.experience.trim(),
      employmentType: editForm.employmentType,
    }));
    setShowEditModal(false);
    showToast('Profile details updated successfully!', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPass) {
      showToast('Please enter your current password', 'error');
      return;
    }
    if (!passwordForm.newPass || passwordForm.newPass.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirmPass) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setPasswordForm({ currentPass: '', newPass: '', confirmPass: '' });
    setShowPasswordModal(false);
    showToast('Password changed successfully!', 'success');
  };

  return (
    <div className="animate-fade-in space-y-6 pb-10 text-left font-['Poppins']">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant Portal', 'My Profile']} />
          <h1 className="text-[22px] sm:text-[24px] font-bold text-[#17153A] tracking-tight mt-1">
            My Profile
          </h1>
        </div>
      </div>

      {/* 2. Executive Profile Hero Banner */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-card-soft">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Identity Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7C612A] to-[#560110] text-white flex items-center justify-center font-bold text-[22px] ring-4 ring-[#FAF7F2] shadow-sm select-none">
                SB
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-[20px] sm:text-[22px] font-bold text-[#17153A] tracking-tight">
                  {profile.name}
                </h2>
              </div>
              <p className="text-[13px] text-[#64748B] mt-0.5">{profile.designation} · {profile.department}</p>
              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8] font-mono">
                  {profile.empId}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                  {profile.employmentType}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={handleOpenEdit}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-[#17153A] bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#7C612A] hover:bg-[#FAF7F2] hover:text-[#7C612A] rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <Icon name="Pencil" size={15} />
              <span>Edit Details</span>
            </button>
            <button
              type="button"
              onClick={handleOpenPasswordModal}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Icon name="KeyRound" size={15} />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Executive Profile Dossier: Two Clean Balanced Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* CARD 1: PERSONAL & CONTACT INFORMATION */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-card-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-0 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0 shadow-2xs">
                <Icon name="User" size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#17153A]">Personal Information</h3>
                <p className="text-[12px] text-[#64748B]">Primary identity and contact records</p>
              </div>
            </div>

            <div className="divide-y divide-[#F1F5F9] text-[13px]">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B]">Full Name</span>
                <span className="font-semibold text-[#17153A] text-right">{profile.name}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B]">Gender</span>
                <span className="font-semibold text-[#17153A]">{profile.gender}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B]">Date of Birth</span>
                <span className="font-semibold text-[#17153A]">{profile.dob}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B]">Mobile Number</span>
                <span className="font-semibold text-[#17153A] font-mono">{profile.phone}</span>
              </div>
              <div className="flex items-center justify-between py-2.5 gap-2">
                <span className="text-[#64748B] shrink-0">Email Address</span>
                <span className="font-semibold text-[#17153A] text-right truncate text-[12px]">{profile.email}</span>
              </div>
              <div className="flex items-center justify-between py-2.5 gap-2">
                <span className="text-[#64748B] shrink-0">Residential Address</span>
                <span className="font-semibold text-[#17153A] text-right truncate text-[12px]">{profile.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: PROFESSIONAL & ACCOUNTING CREDENTIALS */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-card-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-0 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0 shadow-2xs">
                <Icon name="GraduationCap" size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#17153A]">Professional Credentials</h3>
                <p className="text-[12px] text-[#64748B]">Institutional accounting & service records</p>
              </div>
            </div>

            <div className="divide-y divide-[#F1F5F9] text-[13px]">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B]">Employee ID</span>
                <span className="font-bold text-[#7C612A] font-mono px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8DFC8] text-[12px]">
                  {profile.empId}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5 gap-2">
                <span className="text-[#64748B] shrink-0">Qualification</span>
                <span className="font-semibold text-[#17153A] text-right text-[12px]">{profile.qualification}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B]">Experience</span>
                <span className="font-semibold text-[#17153A] text-right text-[12px]">{profile.experience}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B]">Joining Date</span>
                <span className="font-semibold text-[#17153A]">{profile.joiningDate}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B]">Employment Type</span>
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                  {profile.employmentType}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. EDIT PROFILE MODAL */}
      {showEditModal && (
        <Modal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Profile Details"
          size="md"
          className="max-w-lg"
          overflowVisible={true}
          bodyClassName="p-5 sm:p-6 overflow-hidden font-['Poppins']"
          footer={
            <div className="flex items-center justify-end gap-2.5 w-full">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Full Name"
                required
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              />
              <div>
                <label className="block text-[14px] font-semibold text-[#334155] mb-1.5 font-['Poppins']">
                  Gender
                </label>
                <select
                  value={editForm.gender}
                  onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                  className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] font-['Poppins'] cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Date of Birth"
                value={editForm.dob}
                onChange={e => setEditForm({ ...editForm, dob: e.target.value })}
              />
              <Input
                label="Mobile Number"
                required
                value={editForm.phone}
                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>

            <Input
              label="Email Address"
              required
              type="email"
              value={editForm.email}
              onChange={e => setEditForm({ ...editForm, email: e.target.value })}
            />

            <Textarea
              label="Residential Address"
              rows={2}
              value={editForm.address}
              onChange={e => setEditForm({ ...editForm, address: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Qualification"
                value={editForm.qualification}
                onChange={e => setEditForm({ ...editForm, qualification: e.target.value })}
              />
              <Input
                label="Experience"
                value={editForm.experience}
                onChange={e => setEditForm({ ...editForm, experience: e.target.value })}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* 5. CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <Modal
          open={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Security Password"
          size="md"
          className="max-w-md"
          overflowVisible={true}
          bodyClassName="p-5 sm:p-6 overflow-hidden font-['Poppins']"
          footer={
            <div className="flex items-center justify-end gap-2.5 w-full">
              <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleChangePassword}>
                Update Password
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            <div>
              <label className="text-[12px] font-semibold text-[#17153A] block mb-1">
                Current Password <span className="text-[#BE123C]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  placeholder="Enter current password"
                  value={passwordForm.currentPass}
                  onChange={e => setPasswordForm({ ...passwordForm, currentPass: e.target.value })}
                  className="w-full h-10 pl-3.5 pr-10 text-[13px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors font-['Poppins'] placeholder:font-['Poppins']"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#17153A] cursor-pointer"
                  title={showCurrentPass ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showCurrentPass ? 'EyeOff' : 'Eye'} size={16} strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#17153A] block mb-1">
                New Password <span className="text-[#BE123C]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  placeholder="Minimum 6 characters"
                  value={passwordForm.newPass}
                  onChange={e => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                  className="w-full h-10 pl-3.5 pr-10 text-[13px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors font-['Poppins'] placeholder:font-['Poppins']"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#17153A] cursor-pointer"
                  title={showNewPass ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showNewPass ? 'EyeOff' : 'Eye'} size={16} strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#17153A] block mb-1">
                Confirm New Password <span className="text-[#BE123C]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password"
                  value={passwordForm.confirmPass}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPass: e.target.value })}
                  className="w-full h-10 pl-3.5 pr-10 text-[13px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors font-['Poppins'] placeholder:font-['Poppins']"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#17153A] cursor-pointer"
                  title={showConfirmPass ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showConfirmPass ? 'EyeOff' : 'Eye'} size={16} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

type FeeCategory = 'Academic' | 'Admission' | 'Examination' | 'Transport' | 'Activity' | 'Other';
type FeeFrequency = 'One-Time' | 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly';

interface FeeHead {
  id: string;
  name: string;
  category: FeeCategory;
  frequency: FeeFrequency;
  defaultAmount: number;
  status: 'Active' | 'Inactive';
  createdDate: string;
  description: string;
  transactionCount: number;
  appliedClassesCount: number;
  term?: string;
  standard?: string;
  instalmentsCount?: number;
  dueDates?: string;
}

interface InstalmentItem {
  id: string;
  number: number;
  name: string;
  dueDate: string;
  amount: number;
  status?: 'Active' | 'Inactive';
}

const CATEGORY_STYLES: Record<FeeCategory, { bg: string; text: string; border: string }> = {
  Academic: { bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]', border: 'border-[#BFDBFE]' },
  Admission: { bg: 'bg-[#FAF5FF]', text: 'text-[#7E22CE]', border: 'border-[#E9D5FF]' },
  Examination: { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', border: 'border-[#FDE68A]' },
  Transport: { bg: 'bg-[#ECFDF5]', text: 'text-[#047857]', border: 'border-[#A7F3D0]' },
  Activity: { bg: 'bg-[#FDF2F8]', text: 'text-[#BE185D]', border: 'border-[#FBCFE8]' },
  Other: { bg: 'bg-[#F8FAFC]', text: 'text-[#475569]', border: 'border-[#E2E8F0]' },
};

const CLASS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'Class 1': { bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]', border: 'border-[#BFDBFE]' },
  'Class 2': { bg: 'bg-[#ECFDF5]', text: 'text-[#047857]', border: 'border-[#A7F3D0]' },
  'Class 3': { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', border: 'border-[#FDE68A]' },
  'Class 4': { bg: 'bg-[#FAF5FF]', text: 'text-[#7E22CE]', border: 'border-[#E9D5FF]' },
  'Class 5': { bg: 'bg-[#FFF1F2]', text: 'text-[#BE123C]', border: 'border-[#FECDD3]' },
  'Class 6': { bg: 'bg-[#ECFEFF]', text: 'text-[#0E7490]', border: 'border-[#A5F3FC]' },
  'Class 7': { bg: 'bg-[#EEF2FF]', text: 'text-[#4338CA]', border: 'border-[#C7D2FE]' },
  'Class 8': { bg: 'bg-[#FAF7F2]', text: 'text-[#7C612A]', border: 'border-[#E8DFC8]' },
  'Class 9': { bg: 'bg-[#FDF2F4]', text: 'text-[#560110]', border: 'border-[#F9C8D2]' },
  'Class 10': { bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]', border: 'border-[#BBF7D0]' },
  'Class 11-Sci': { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]' },
  'Class 11': { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]' },
  'Class 12-Sci': { bg: 'bg-[#F1F5F9]', text: 'text-[#1E293B]', border: 'border-[#CBD5E1]' },
  'Class 12': { bg: 'bg-[#F1F5F9]', text: 'text-[#1E293B]', border: 'border-[#CBD5E1]' },
};

const DEFAULT_CLASS_STYLE = { bg: 'bg-[#FAF7F2]', text: 'text-[#7C612A]', border: 'border-[#E8DFC8]' };

const GENERATE_INITIAL_FEE_HEADS = (): FeeHead[] => {
  const classes = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11-Sci', 'Class 12-Sci'
  ];

  const list: FeeHead[] = [];
  let idCounter = 1;

  const feeConfigs = [
    {
      name: 'Tuition Fee',
      category: 'Academic' as FeeCategory,
      frequency: 'Monthly' as FeeFrequency,
      base2026: {
        'Class 1': 1500, 'Class 2': 1600, 'Class 3': 1700, 'Class 4': 1800, 'Class 5': 1900,
        'Class 6': 2100, 'Class 7': 2300, 'Class 8': 2500, 'Class 9': 2800, 'Class 10': 3200,
        'Class 11-Sci': 4000, 'Class 12-Sci': 4500,
      },
      base2025: {
        'Class 1': 1200, 'Class 2': 1300, 'Class 3': 1400, 'Class 4': 1500, 'Class 5': 1600,
        'Class 6': 1800, 'Class 7': 2000, 'Class 8': 2000, 'Class 9': 2400, 'Class 10': 2800,
        'Class 11-Sci': 3500, 'Class 12-Sci': 4000,
      },
      desc: 'Core academic syllabus instruction, laboratory practicals, and classroom pedagogy',
    },
    {
      name: 'Admission Fee',
      category: 'Admission' as FeeCategory,
      frequency: 'One-Time' as FeeFrequency,
      base2026: {
        'Class 1': 5000, 'Class 2': 5000, 'Class 3': 5000, 'Class 4': 5000, 'Class 5': 5000,
        'Class 6': 5500, 'Class 7': 5500, 'Class 8': 6000, 'Class 9': 7000, 'Class 10': 7000,
        'Class 11-Sci': 8500, 'Class 12-Sci': 8500,
      },
      base2025: {
        'Class 1': 4500, 'Class 2': 4500, 'Class 3': 4500, 'Class 4': 4500, 'Class 5': 4500,
        'Class 6': 5000, 'Class 7': 5000, 'Class 8': 5000, 'Class 9': 6000, 'Class 10': 6000,
        'Class 11-Sci': 7500, 'Class 12-Sci': 7500,
      },
      desc: 'One-time registration, institutional identity card, and document verification charge',
    },
    {
      name: 'Term Fee',
      category: 'Academic' as FeeCategory,
      frequency: 'Quarterly' as FeeFrequency,
      base2026: {
        'Class 1': 1000, 'Class 2': 1000, 'Class 3': 1100, 'Class 4': 1100, 'Class 5': 1200,
        'Class 6': 1300, 'Class 7': 1400, 'Class 8': 1500, 'Class 9': 1800, 'Class 10': 2000,
        'Class 11-Sci': 2200, 'Class 12-Sci': 2500,
      },
      base2025: {
        'Class 1': 900, 'Class 2': 900, 'Class 3': 1000, 'Class 4': 1000, 'Class 5': 1100,
        'Class 6': 1200, 'Class 7': 1300, 'Class 8': 1300, 'Class 9': 1600, 'Class 10': 1800,
        'Class 11-Sci': 2000, 'Class 12-Sci': 2200,
      },
      desc: 'Periodic term learning kits, science consumables, library digital subscriptions',
    },
    {
      name: 'Activity Fee',
      category: 'Activity' as FeeCategory,
      frequency: 'Yearly' as FeeFrequency,
      base2026: {
        'Class 1': 600, 'Class 2': 600, 'Class 3': 600, 'Class 4': 700, 'Class 5': 700,
        'Class 6': 800, 'Class 7': 800, 'Class 8': 800, 'Class 9': 1000, 'Class 10': 1000,
        'Class 11-Sci': 1200, 'Class 12-Sci': 1200,
      },
      base2025: {
        'Class 1': 500, 'Class 2': 500, 'Class 3': 500, 'Class 4': 600, 'Class 5': 600,
        'Class 6': 700, 'Class 7': 700, 'Class 8': 700, 'Class 9': 900, 'Class 10': 900,
        'Class 11-Sci': 1000, 'Class 12-Sci': 1000,
      },
      desc: 'Co-curricular clubs, student cultural summits, arts workshops, and talent competitions',
    },
    {
      name: 'Exam Fee',
      category: 'Examination' as FeeCategory,
      frequency: 'Half-Yearly' as FeeFrequency,
      base2026: {
        'Class 1': 400, 'Class 2': 400, 'Class 3': 400, 'Class 4': 400, 'Class 5': 450,
        'Class 6': 500, 'Class 7': 500, 'Class 8': 500, 'Class 9': 750, 'Class 10': 800,
        'Class 11-Sci': 1000, 'Class 12-Sci': 1000,
      },
      base2025: {
        'Class 1': 350, 'Class 2': 350, 'Class 3': 350, 'Class 4': 350, 'Class 5': 400,
        'Class 6': 450, 'Class 7': 450, 'Class 8': 450, 'Class 9': 700, 'Class 10': 700,
        'Class 11-Sci': 900, 'Class 12-Sci': 900,
      },
      desc: 'Semester examination printing, customized answer booklets, and performance reports',
    },
    {
      name: 'Transport Fee',
      category: 'Transport' as FeeCategory,
      frequency: 'Monthly' as FeeFrequency,
      base2026: {
        'Class 1': 1200, 'Class 2': 1200, 'Class 3': 1200, 'Class 4': 1200, 'Class 5': 1200,
        'Class 6': 1200, 'Class 7': 1200, 'Class 8': 1200, 'Class 9': 1400, 'Class 10': 1400,
        'Class 11-Sci': 1500, 'Class 12-Sci': 1500,
      },
      base2025: {
        'Class 1': 1100, 'Class 2': 1100, 'Class 3': 1100, 'Class 4': 1100, 'Class 5': 1100,
        'Class 6': 1100, 'Class 7': 1100, 'Class 8': 1100, 'Class 9': 1200, 'Class 10': 1200,
        'Class 11-Sci': 1300, 'Class 12-Sci': 1300,
      },
      desc: 'Bus transit operations, student route allocations, speed tracking and GPS maintenance',
    },
  ];

  // 1. Generate 2026-2027 records
  classes.forEach(cls => {
    feeConfigs.forEach(cfg => {
      list.push({
        id: `FH${String(idCounter++).padStart(3, '0')}`,
        name: cfg.name,
        category: cfg.category,
        frequency: cfg.frequency,
        defaultAmount: cfg.base2026[cls as keyof typeof cfg.base2026] || 2000,
        status: 'Active',
        createdDate: '2026-01-15',
        description: `${cfg.desc} for ${cls}`,
        transactionCount: 120,
        appliedClassesCount: 1,
        term: '2026-2027',
        standard: cls,
      });
    });
  });

  // 2. Generate 2025-2026 records
  classes.forEach(cls => {
    feeConfigs.forEach(cfg => {
      list.push({
        id: `FH${String(idCounter++).padStart(3, '0')}`,
        name: cfg.name,
        category: cfg.category,
        frequency: cfg.frequency,
        defaultAmount: cfg.base2025[cls as keyof typeof cfg.base2025] || 1800,
        status: 'Active',
        createdDate: '2025-04-10',
        description: `${cfg.desc} (Previous Year) for ${cls}`,
        transactionCount: 95,
        appliedClassesCount: 1,
        term: '2025-2026',
        standard: cls,
      });
    });
  });

  return list;
};

const INITIAL_FEE_HEADS: FeeHead[] = GENERATE_INITIAL_FEE_HEADS();

const INITIAL_STRUCTURES: Record<string, Record<string, { selected: boolean; amount: number; isCompulsory: boolean }>> = {
  'Class 8': {
    FH001: { selected: true, amount: 75000, isCompulsory: true },
    FH002: { selected: true, amount: 15000, isCompulsory: true },
    FH003: { selected: false, amount: 1500, isCompulsory: false },
    FH004: { selected: true, amount: 5000, isCompulsory: false },
    FH005: { selected: true, amount: 3000, isCompulsory: true },
    FH006: { selected: false, amount: 1200, isCompulsory: false },
    FH007: { selected: false, amount: 100, isCompulsory: false },
    FH008: { selected: false, amount: 1000, isCompulsory: false },
    FH009: { selected: false, amount: 1200, isCompulsory: false },
  },
  'Class 7': {
    FH001: { selected: true, amount: 70000, isCompulsory: true },
    FH002: { selected: true, amount: 15000, isCompulsory: true },
    FH003: { selected: false, amount: 1500, isCompulsory: false },
    FH004: { selected: true, amount: 5000, isCompulsory: false },
    FH005: { selected: true, amount: 3000, isCompulsory: true },
    FH006: { selected: false, amount: 1200, isCompulsory: false },
    FH007: { selected: false, amount: 100, isCompulsory: false },
    FH008: { selected: false, amount: 1000, isCompulsory: false },
    FH009: { selected: false, amount: 1200, isCompulsory: false },
  },
  'Class 6': {
    FH001: { selected: true, amount: 65000, isCompulsory: true },
    FH002: { selected: true, amount: 12000, isCompulsory: true },
    FH003: { selected: false, amount: 1500, isCompulsory: false },
    FH004: { selected: true, amount: 4000, isCompulsory: false },
    FH005: { selected: true, amount: 2500, isCompulsory: true },
    FH006: { selected: false, amount: 1200, isCompulsory: false },
    FH007: { selected: false, amount: 100, isCompulsory: false },
    FH008: { selected: false, amount: 1000, isCompulsory: false },
    FH009: { selected: false, amount: 1200, isCompulsory: false },
  },
  'Class 5': {
    FH001: { selected: true, amount: 60000, isCompulsory: true },
    FH002: { selected: true, amount: 12000, isCompulsory: true },
    FH003: { selected: false, amount: 1500, isCompulsory: false },
    FH004: { selected: true, amount: 4000, isCompulsory: false },
    FH005: { selected: true, amount: 2500, isCompulsory: true },
    FH006: { selected: false, amount: 1200, isCompulsory: false },
    FH007: { selected: false, amount: 100, isCompulsory: false },
    FH008: { selected: false, amount: 1000, isCompulsory: false },
    FH009: { selected: false, amount: 1200, isCompulsory: false },
  },
  'Class 9': {
    FH001: { selected: true, amount: 80000, isCompulsory: true },
    FH002: { selected: true, amount: 15000, isCompulsory: true },
    FH003: { selected: true, amount: 2000, isCompulsory: false },
    FH004: { selected: true, amount: 5000, isCompulsory: false },
    FH005: { selected: true, amount: 4000, isCompulsory: true },
    FH006: { selected: false, amount: 1200, isCompulsory: false },
    FH007: { selected: false, amount: 100, isCompulsory: false },
    FH008: { selected: false, amount: 1000, isCompulsory: false },
    FH009: { selected: false, amount: 1200, isCompulsory: false },
  },
  'Class 10': {
    FH001: { selected: true, amount: 85000, isCompulsory: true },
    FH002: { selected: true, amount: 15000, isCompulsory: true },
    FH003: { selected: true, amount: 2500, isCompulsory: false },
    FH004: { selected: true, amount: 5000, isCompulsory: false },
    FH005: { selected: true, amount: 4500, isCompulsory: true },
    FH006: { selected: false, amount: 1200, isCompulsory: false },
    FH007: { selected: false, amount: 100, isCompulsory: false },
    FH008: { selected: false, amount: 1000, isCompulsory: false },
    FH009: { selected: false, amount: 1200, isCompulsory: false },
  },
};

const DEFAULT_CLASS_INSTALMENT_AMOUNTS: Record<string, [number, number, number]> = {
  'Class 1': [15000, 15000, 15000],
  'Class 2': [16000, 16000, 16000],
  'Class 3': [18000, 18000, 18000],
  'Class 4': [20000, 20000, 20000],
  'Class 5': [26500, 26000, 26000],
  'Class 6': [28000, 28000, 27500],
  'Class 7': [31000, 31000, 31000],
  'Class 8': [33000, 33000, 32000],
  'Class 9': [36000, 35000, 35000],
  'Class 10': [39000, 39000, 39000],
  'Class 11-Sci': [42000, 42000, 41000],
  'Class 12-Sci': [45000, 45000, 44000],
};

const CLASS_OPTIONS = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11-Sci', 'Class 12-Sci'
];

const INITIAL_INSTALMENTS: Record<string, InstalmentItem[]> = Object.fromEntries(
  CLASS_OPTIONS.map(cls => {
    const amounts = DEFAULT_CLASS_INSTALMENT_AMOUNTS[cls] || [25000, 25000, 25000];
    return [
      cls,
      [
        { id: 'inst-1', number: 1, name: 'First Instalment (Term 1 & Admission)', dueDate: '2026-05-31', amount: amounts[0], status: 'Active' as const },
        { id: 'inst-2', number: 2, name: 'Second Instalment (Term 2 Tuition)', dueDate: '2026-08-10', amount: amounts[1], status: 'Active' as const },
        { id: 'inst-3', number: 3, name: 'Third Instalment (Term 3 & Final Exam)', dueDate: '2026-11-10', amount: amounts[2], status: 'Active' as const },
      ],
    ];
  })
);

const formatDueDate = (dateStr: string, term?: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const rawYear = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let year = rawYear;
    if (term && term.includes('-')) {
      const [startYr, rawEndYr] = term.split('-');
      const fullEndYr = rawEndYr ? (rawEndYr.length === 2 ? `20${rawEndYr}` : rawEndYr) : startYr;
      const fullStartYr = startYr.length === 2 ? `20${startYr}` : startYr;
      // Months Jan-Apr (0-3) belong to the second calendar year of the academic term
      year = monthIdx < 4 ? (fullEndYr || rawYear) : (fullStartYr || rawYear);
    }

    if (!isNaN(day) && monthIdx >= 0 && monthIdx < 12) {
      return `${day} ${months[monthIdx]} ${year}`;
    }
  }

  // If dateStr is already formatted text like "31 May, 10 Aug, 10 Nov" without a 4-digit year
  if (term && !/\b20\d{2}\b/.test(dateStr)) {
    const [startYr, endYr] = term.split('-');
    return dateStr
      .split(',')
      .map(s => {
        const trimmed = s.trim();
        if (!trimmed) return '';
        const isLateMonth = /(Jan|Feb|Mar|Apr)/i.test(trimmed);
        const yr = isLateMonth ? (endYr || startYr || '2026') : (startYr || '2026');
        return `${trimmed} ${yr}`;
      })
      .filter(Boolean)
      .join(', ');
  }

  return dateStr;
};

const getStandardDisplay = (head: FeeHead): string => {
  if (head.standard && head.standard !== 'All Standards') return head.standard;
  if (head.id === 'FH002') return 'Class 1';
  if (head.id === 'FH004') return 'Class 7';
  if (head.id === 'FH006') return 'Class 6';
  if (head.id === 'FH007') return 'Class 10';
  if (head.id === 'FH008') return 'Class 9';
  if (head.id === 'FH009') return 'Class 5';
  return 'Class 8';
};

interface LateFeeWaiver {
  id: string;
  studentName: string;
  photo?: string;
  grNumber?: string;
  studentId?: string;
  admissionNo: string;
  className: string;
  section?: string;
  originalAmount?: number;
  dueDate?: string;
  paidDate?: string;
  lateFeeAmount?: number;
  waivedAmount: number;
  reason: string;
  date: string;
  academicYear: string;
  recordedBy: string;
}

const INITIAL_LATE_FEE_WAIVERS: LateFeeWaiver[] = [
  {
    id: 'WVR-101',
    studentName: 'Saanvi Reddy',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop&crop=faces',
    grNumber: 'GR-1081',
    studentId: 'SIS-2026-081',
    admissionNo: 'SIS-2026-081',
    className: 'Class 8',
    section: 'Section A',
    originalAmount: 33000,
    dueDate: '2026-05-31',
    paidDate: '2026-09-15',
    lateFeeAmount: 500,
    waivedAmount: 500,
    reason: 'Genuine family medical emergency verified by principal',
    date: '2026-09-15',
    academicYear: '2026-27',
    recordedBy: 'M. S. Accountant',
  },
  {
    id: 'WVR-102',
    studentName: 'Arjun Nair',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces',
    grNumber: 'GR-1082',
    studentId: 'SIS-2026-082',
    admissionNo: 'SIS-2026-082',
    className: 'Class 8',
    section: 'Section B',
    originalAmount: 33000,
    dueDate: '2026-08-10',
    paidDate: '2026-08-20',
    lateFeeAmount: 250,
    waivedAmount: 250,
    reason: 'Bank server downtime during online fee cycle',
    date: '2026-08-20',
    academicYear: '2026-27',
    recordedBy: 'M. S. Accountant',
  },
  {
    id: 'WVR-103',
    studentName: 'Kavya Sharma',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&h=256&fit=crop&crop=faces',
    grNumber: 'GR-1045',
    studentId: 'SIS-2026-045',
    admissionNo: 'SIS-2026-045',
    className: 'Class 5',
    section: 'Section A',
    originalAmount: 26000,
    dueDate: '2026-06-15',
    paidDate: '2026-07-11',
    lateFeeAmount: 350,
    waivedAmount: 350,
    reason: 'Fee counter portal payment mismatch verified',
    date: '2026-07-11',
    academicYear: '2026-27',
    recordedBy: 'Admin Office',
  },
  {
    id: 'WVR-104',
    studentName: 'Rohan Deshmukh',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&h=256&fit=crop&crop=faces',
    grNumber: 'GR-1102',
    studentId: 'SIS-2026-102',
    admissionNo: 'SIS-2026-102',
    className: 'Class 10',
    section: 'Section A',
    originalAmount: 35000,
    dueDate: '2026-05-31',
    paidDate: '2026-06-25',
    lateFeeAmount: 500,
    waivedAmount: 500,
    reason: 'Scholarship student grace period extension approved',
    date: '2026-06-25',
    academicYear: '2026-27',
    recordedBy: 'Principal Approval',
  },
  {
    id: 'WVR-105',
    studentName: 'Ananya Iyer',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=256&h=256&fit=crop&crop=faces',
    grNumber: 'GR-1077',
    studentId: 'SIS-2025-077',
    admissionNo: 'SIS-2025-077',
    className: 'Class 7',
    section: 'Section B',
    originalAmount: 28000,
    dueDate: '2025-10-31',
    paidDate: '2025-11-18',
    lateFeeAmount: 400,
    waivedAmount: 400,
    reason: 'Outstation parent bereavement request sanctioned',
    date: '2025-11-18',
    academicYear: '2025-26',
    recordedBy: 'M. S. Accountant',
  },
  {
    id: 'WVR-106',
    studentName: 'Dhruv Joshi',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=faces',
    grNumber: 'GR-1034',
    studentId: 'SIS-2025-034',
    admissionNo: 'SIS-2025-034',
    className: 'Class 3',
    section: 'Section A',
    originalAmount: 22000,
    dueDate: '2025-08-15',
    paidDate: '2025-09-05',
    lateFeeAmount: 200,
    waivedAmount: 200,
    reason: 'UPI gateway payment failure reconciliation',
    date: '2025-09-05',
    academicYear: '2025-26',
    recordedBy: 'Admin Office',
  },
  {
    id: 'WVR-107',
    studentName: 'Ishaan Verma',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=256&h=256&fit=crop&crop=faces',
    grNumber: 'GR-1065',
    studentId: 'SIS-2026-065',
    admissionNo: 'SIS-2026-065',
    className: 'Class 6',
    section: 'Section A',
    originalAmount: 28000,
    dueDate: '2026-05-31',
    paidDate: '2026-06-18',
    lateFeeAmount: 450,
    waivedAmount: 450,
    reason: 'Online netbanking transaction dispute resolution',
    date: '2026-06-18',
    academicYear: '2026-27',
    recordedBy: 'Fee Counter',
  },
  {
    id: 'WVR-108',
    studentName: 'Diya Patel',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=faces',
    grNumber: 'GR-1120',
    studentId: 'SIS-2026-120',
    admissionNo: 'SIS-2026-120',
    className: 'Class 12-Sci',
    section: 'Section B',
    originalAmount: 42000,
    dueDate: '2026-07-31',
    paidDate: '2026-08-22',
    lateFeeAmount: 500,
    waivedAmount: 500,
    reason: 'Olympiad national camp travel leave approved',
    date: '2026-08-22',
    academicYear: '2026-27',
    recordedBy: 'Principal Approval',
  },
];

function FeesConfiguration({ initialTab = 'heads' }: { initialTab?: 'heads' | 'structure' | 'instalments' | 'late-fee' }) {
  const [activeTab, setActiveTab] = useState<'heads' | 'structure' | 'instalments' | 'late-fee'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Section 4: Late Fee Rules State
  const [fixedLateFee, setFixedLateFee] = useState<number>(500);
  const [perDayLateFee, setPerDayLateFee] = useState<number>(25);
  const [gracePeriodDays, setGracePeriodDays] = useState<number>(7);
  const [showEditLateFeeModal, setShowEditLateFeeModal] = useState<boolean>(false);
  const [formFixedLateFee, setFormFixedLateFee] = useState<number | ''>(500);
  const [formPerDayLateFee, setFormPerDayLateFee] = useState<number | ''>(25);
  const [formGracePeriodDays, setFormGracePeriodDays] = useState<number | ''>(7);

  // Section 4: Historical Waivers State & Filters
  const [waivers] = useState<LateFeeWaiver[]>(INITIAL_LATE_FEE_WAIVERS);
  const [waiverSearchQuery, setWaiverSearchQuery] = useState<string>('');
  const [waiverYear, setWaiverYear] = useState<string>('All Terms');
  const [waiverClass, setWaiverClass] = useState<string>('All Classes');
  const [waiverSection, setWaiverSection] = useState<string>('All Sections');

  // Global Session Controls
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [selectedClass, setSelectedClass] = useState('Class 8');

  // Section 1: Fee Heads State
  const [feeHeads, setFeeHeads] = useState<FeeHead[]>(INITIAL_FEE_HEADS);
  const [searchQuery, setSearchQuery] = useState('');

  // Fee Head Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingHead, setEditingHead] = useState<FeeHead | null>(null);
  const [viewingHead, setViewingHead] = useState<FeeHead | null>(null);
  const [deleteTargetHead, setDeleteTargetHead] = useState<FeeHead | null>(null);

  // Form State for Add / Edit Fee Head
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<FeeCategory>('Academic');
  const [formFrequency, setFormFrequency] = useState<FeeFrequency>('Monthly');
  const [formDefaultAmount, setFormDefaultAmount] = useState<number | ''>(1000);
  const [formStandard, setFormStandard] = useState<string>('Class 1');
  const [formTerm, setFormTerm] = useState<string>('2026-2027');
  const [formInstalmentsCount, setFormInstalmentsCount] = useState<number>(3);
  const [formDueDates, setFormDueDates] = useState<string>('31 May 2026, 10 Aug 2026, 10 Nov 2026');
  const [formDescription, setFormDescription] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; amount?: string }>({});
  const [editingStructureContext, setEditingStructureContext] = useState(false);
  const [formStructureAmount, setFormStructureAmount] = useState<number | ''>(2500);

  // Section 2: Fee Structure State
  const [structures, setStructures] = useState(INITIAL_STRUCTURES);
  const [structureSearchQuery, setStructureSearchQuery] = useState('');

  // Section 3: Instalments State
  const [instalmentPlans, setInstalmentPlans] = useState(INITIAL_INSTALMENTS);
  const [instalmentSearchQuery, setInstalmentSearchQuery] = useState('');
  const [showAddEditInstalmentModal, setShowAddEditInstalmentModal] = useState(false);
  const [editingInstalment, setEditingInstalment] = useState<InstalmentItem | null>(null);
  const [deleteTargetInstalment, setDeleteTargetInstalment] = useState<InstalmentItem | null>(null);
  const [formInstalmentName, setFormInstalmentName] = useState('');
  const [formInstalmentClass, setFormInstalmentClass] = useState('Class 1');
  const [formInstalmentDueDate, setFormInstalmentDueDate] = useState('');
  const [formInstalmentAmount, setFormInstalmentAmount] = useState<number | ''>(25000);
  const [formInstalmentErrors, setFormInstalmentErrors] = useState<{ name?: string; amount?: string; dueDate?: string }>({});

  // Dynamic Instalments & Due Dates resolver linked directly to Section 3 Instalments Schedule
  const getDueDatesForHead = (head: FeeHead): string => {
    const term = head.term || '2026-2027';
    const std = getStandardDisplay(head);
    const plan = instalmentPlans[std] || instalmentPlans['Class 1'] || instalmentPlans['Class 8'];
    if (plan && plan.length > 0) {
      return plan.map(inst => formatDueDate(inst.dueDate, term)).filter(Boolean).join(', ');
    }
    if (head.dueDates) {
      return formatDueDate(head.dueDates, term);
    }
    const startYr = term.split('-')[0] || '2026';
    return `31 May ${startYr}, 10 Aug ${startYr}, 10 Nov ${startYr}`;
  };

  const getInstalmentsForHead = (head: FeeHead): string => {
    const std = getStandardDisplay(head);
    const plan = instalmentPlans[std] || instalmentPlans['Class 1'] || instalmentPlans['Class 8'];
    if (plan && plan.length > 0) {
      return `${plan.length} Instalment${plan.length > 1 ? 's' : ''}`;
    }
    if (head.instalmentsCount) {
      return `${head.instalmentsCount} Instalment${head.instalmentsCount > 1 ? 's' : ''}`;
    }
    return '3 Instalments';
  };

  // Derived Structure for Selected Class
  const classStructureHeads = feeHeads.filter(
    h => (h.standard === selectedClass || !h.standard) && (h.term === '2026-2027' || !h.term)
  );

  // Filtered Structure Heads based on Search query (Like Fee Heads)
  const filteredClassStructureHeads = classStructureHeads.filter(head => {
    if (!structureSearchQuery.trim()) return true;
    const q = structureSearchQuery.toLowerCase();
    return (
      head.name.toLowerCase().includes(q) ||
      head.frequency.toLowerCase().includes(q) ||
      head.id.toLowerCase().includes(q) ||
      (head.category && head.category.toLowerCase().includes(q))
    );
  });
  const currentClassStructure = structures[selectedClass] || {};

  // Calculate Structure Total for Selected Class
  const { totalFee } = classStructureHeads.reduce(
    (acc, head) => {
      const item = currentClassStructure[head.id] || {
        selected: true,
        amount: head.defaultAmount,
      };
      if (item.selected) {
        acc.totalFee += item.amount;
      }
      return acc;
    },
    { totalFee: 0 }
  );

  // Derived Instalments for Selected Class
  const currentInstalments = instalmentPlans[selectedClass] || [
    { id: 'inst-1', number: 1, name: 'First Instalment (Term 1 & Admission)', dueDate: '2026-05-31', amount: 25000 },
    { id: 'inst-2', number: 2, name: 'Second Instalment (Term 2 Tuition)', dueDate: '2026-08-10', amount: 25000 },
    { id: 'inst-3', number: 3, name: 'Third Instalment (Term 3 & Final Exam)', dueDate: '2026-11-10', amount: 25000 },
  ];

  // Filtered Instalments based on Search query (Like Fee Structure)
  const filteredInstalments = currentInstalments.filter(inst => {
    if (!instalmentSearchQuery.trim()) return true;
    const q = instalmentSearchQuery.toLowerCase();
    const formattedDate = formatDueDate(inst.dueDate, academicYear).toLowerCase();
    return (
      inst.name.toLowerCase().includes(q) ||
      inst.dueDate.toLowerCase().includes(q) ||
      formattedDate.includes(q) ||
      String(inst.amount).includes(q)
    );
  });

  // Calculate Instalments Sum & Discrepancy
  const instalmentSum = currentInstalments
    .filter(item => item.status !== 'Inactive')
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  // Section 4: Filtered Waivers & Total
  const filteredWaivers = waivers.filter(w => {
    if (waiverSearchQuery.trim()) {
      const q = waiverSearchQuery.toLowerCase();
      const matches =
        w.studentName.toLowerCase().includes(q) ||
        (w.studentId || w.admissionNo).toLowerCase().includes(q) ||
        (w.grNumber || '').toLowerCase().includes(q) ||
        w.reason.toLowerCase().includes(q) ||
        w.className.toLowerCase().includes(q) ||
        (w.section || '').toLowerCase().includes(q) ||
        String(w.lateFeeAmount || w.waivedAmount).includes(q) ||
        String(w.originalAmount || '').includes(q);
      if (!matches) return false;
    }
    if (waiverYear !== 'All Terms' && w.academicYear !== waiverYear) {
      return false;
    }
    if (waiverClass !== 'All Classes') {
      const baseClass = w.className.split('-')[0].trim();
      if (w.className !== waiverClass && baseClass !== waiverClass) {
        return false;
      }
    }
    if (waiverSection !== 'All Sections') {
      const secCode = waiverSection.replace('Section ', '').trim();
      const matchesSec =
        w.section === waiverSection ||
        w.section === secCode ||
        w.className.endsWith(`-${secCode}`);
      if (!matchesSec) {
        return false;
      }
    }
    return true;
  });

  const totalLateFeeSum = filteredWaivers.reduce((sum, item) => sum + (item.lateFeeAmount || item.waivedAmount || 0), 0);
  const totalOriginalFeeSum = filteredWaivers.reduce((sum, item) => sum + (item.originalAmount || 0), 0);

  // Unique Master Fee Heads (deduplicated by name for Card Layout)
  const masterFeeHeads = Array.from(
    new Map(feeHeads.map(h => [h.name, h])).values()
  );

  const feeHeadDropdownOptions = useMemo(() => {
    const names = Array.from(
      new Set([
        ...masterFeeHeads.map(h => h.name),
        ...(formName ? [formName] : []),
      ])
    ).filter(Boolean);
    return names.map(name => ({ value: name, label: name }));
  }, [masterFeeHeads, formName]);

  const displayFeeHeads = masterFeeHeads.filter(head => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      head.name.toLowerCase().includes(q) ||
      head.category.toLowerCase().includes(q) ||
      head.frequency.toLowerCase().includes(q)
    );
  });

  // Handlers for Fee Heads
  const handleOpenAdd = () => {
    setEditingHead(null);
    setFormName('');
    setFormCategory('Academic');
    setFormFrequency('Monthly');
    setFormDefaultAmount(1000);
    const targetClass = selectedClass || 'Class 1';
    const targetTerm = '2026-2027';
    setFormStandard(targetClass);
    setFormTerm(targetTerm);
    const plan = instalmentPlans[targetClass] || instalmentPlans['Class 1'];
    setFormInstalmentsCount(plan?.length || 3);
    const defaultDueDates = plan && plan.length > 0
      ? plan.map(i => formatDueDate(i.dueDate, targetTerm)).join(', ')
      : `31 May ${targetTerm.split('-')[0] || '2026'}, 10 Aug ${targetTerm.split('-')[0] || '2026'}, 10 Nov ${targetTerm.split('-')[0] || '2026'}`;
    setFormDueDates(defaultDueDates);
    setFormDescription('');
    setEditingStructureContext(false);
    setFormErrors({});
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (head: FeeHead) => {
    setEditingHead(head);
    setEditingStructureContext(false);
    setFormName(head.name);
    setFormCategory(head.category);
    setFormFrequency(head.frequency);
    setFormDefaultAmount(head.defaultAmount);
    setFormStandard(head.standard || getStandardDisplay(head));
    setFormTerm(head.term || '2026-2027');
    setFormInstalmentsCount(head.instalmentsCount || 3);
    setFormDueDates(head.dueDates || getDueDatesForHead(head));
    setFormDescription(head.description);
    setFormErrors({});
    setShowAddEditModal(true);
  };

  const handleOpenStructureEdit = (head: FeeHead, currentAmount: number) => {
    setEditingHead(head);
    setEditingStructureContext(true);
    setFormName(head.name);
    setFormStandard(selectedClass);
    setFormFrequency(head.frequency);
    setFormStructureAmount(currentAmount);
    setFormErrors({});
    setShowAddEditModal(true);
  };

  const handleOpenAddStructure = () => {
    setEditingHead(null);
    setEditingStructureContext(true);
    const defaultHead = masterFeeHeads[0];
    setFormName(defaultHead ? defaultHead.name : '');
    setFormStandard(selectedClass);
    setFormFrequency(defaultHead ? defaultHead.frequency : 'Monthly');
    setFormStructureAmount(defaultHead ? defaultHead.defaultAmount : 2500);
    setFormErrors({});
    setShowAddEditModal(true);
  };

  const handleSaveFeeHead = () => {
    const trimmedName = formName.trim();
    const errors: { name?: string; amount?: string } = {};

    if (!trimmedName) {
      errors.name = 'Fee head name is required';
    }

    if (editingStructureContext) {
      if (formStructureAmount === '' || isNaN(Number(formStructureAmount)) || Number(formStructureAmount) < 0) {
        errors.amount = 'Valid class amount is required';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const numAmount = Number(formStructureAmount);
      const targetClass = formStandard || selectedClass;

      if (editingHead) {
        const targetHead = feeHeads.find(h => h.name === trimmedName) || editingHead;

        setFeeHeads(prev =>
          prev.map(h =>
            h.id === targetHead.id || h.name === trimmedName
              ? {
                ...h,
                frequency: formFrequency,
                defaultAmount: numAmount,
              }
              : h
          )
        );

        setStructures(prev => {
          const clsConfig = { ...(prev[targetClass] || {}) };
          if (targetHead.id !== editingHead.id) {
            delete clsConfig[editingHead.id];
          }
          const existingItem = clsConfig[targetHead.id] || {
            selected: true,
            amount: numAmount,
            isCompulsory: false,
          };
          clsConfig[targetHead.id] = {
            ...existingItem,
            selected: existingItem.selected !== false,
            amount: numAmount,
          };
          return {
            ...prev,
            [targetClass]: clsConfig,
          };
        });
    
        showToast(`Fee structure for "${trimmedName}" (${targetClass}) updated successfully!`, 'success');
      } else {
        // Create new structure entry for targetClass
        const existingHead = feeHeads.find(h => h.name.toLowerCase() === trimmedName.toLowerCase());
        const headId = existingHead ? existingHead.id : `FH${String(feeHeads.length + 1).padStart(3, '0')}`;

        // Ensure target class has a fee head representation
        const classHeadExists = feeHeads.some(
          h => h.name.toLowerCase() === trimmedName.toLowerCase() && (h.standard === targetClass || !h.standard)
        );

        if (!classHeadExists) {
          const newClassHead: FeeHead = {
            id: `${headId}-${targetClass.replace(/\s+/g, '')}`,
            name: trimmedName,
            category: existingHead ? existingHead.category : 'Academic',
            frequency: formFrequency,
            defaultAmount: numAmount,
            standard: targetClass,
            term: '2026-2027',
            instalmentsCount: 3,
            dueDates: '31 May 2026, 10 Aug 2026, 10 Nov 2026',
            status: 'Active',
            createdDate: new Date().toISOString().split('T')[0],
            description: existingHead?.description || '',
            transactionCount: 0,
            appliedClassesCount: 1,
          };
          setFeeHeads(prev => [newClassHead, ...prev]);
        }

        setStructures(prev => {
          const clsConfig = { ...(prev[targetClass] || {}) };
          clsConfig[headId] = {
            selected: true,
            amount: numAmount,
            isCompulsory: false,
          };
          return {
            ...prev,
            [targetClass]: clsConfig,
          };
        });

        setSelectedClass(targetClass);
    
        showToast(`Fee structure for "${trimmedName}" (${targetClass}) created successfully!`, 'success');
      }

      setShowAddEditModal(false);
      return;
    }

    if (!trimmedName) {
      errors.name = 'Fee head name is required';
    } else {
      // Check duplicate name
      const isDuplicate = feeHeads.some(
        h =>
          h.name.toLowerCase() === trimmedName.toLowerCase() &&
          h.id !== editingHead?.id &&
          h.name.toLowerCase() !== editingHead?.name.toLowerCase()
      );
      if (isDuplicate) {
        errors.name = `"${trimmedName}" already exists`;
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingHead) {
      // Update existing fee head across all instances
      setFeeHeads(prev =>
        prev.map(h =>
          h.id === editingHead.id || h.name === editingHead.name
            ? {
              ...h,
              name: trimmedName,
              category: formCategory,
              frequency: formFrequency,
              description: formDescription.trim(),
            }
            : h
        )
      );
      showToast(`Fee head "${trimmedName}" updated successfully!`, 'success');
    } else {
      // Create new fee head
      const nextId = `FH${String(feeHeads.length + 1).padStart(3, '0')}`;
      const newHead: FeeHead = {
        id: nextId,
        name: trimmedName,
        category: formCategory,
        frequency: formFrequency,
        defaultAmount: typeof formDefaultAmount === 'number' ? formDefaultAmount : 1000,
        standard: formStandard || 'Class 1',
        term: formTerm || '2026-2027',
        instalmentsCount: formInstalmentsCount || 3,
        dueDates: formDueDates.trim() || '31 May 2026, 10 Aug 2026, 10 Nov 2026',
        status: 'Active',
        createdDate: new Date().toISOString().split('T')[0],
        description: formDescription.trim(),
        transactionCount: 0,
        appliedClassesCount: 0,
      };
      setFeeHeads(prev => [newHead, ...prev]);

      // Automatically register new head in all structures as unchecked
      setStructures(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(cls => {
          next[cls] = {
            ...next[cls],
            [nextId]: { selected: false, amount: newHead.defaultAmount, isCompulsory: false },
          };
        });
        return next;
      });

      showToast(`Fee head "${trimmedName}" created successfully!`, 'success');
    }

    setShowAddEditModal(false);
  };

  const handleExecuteDeleteOrDeactivate = () => {
    if (!deleteTargetHead) return;

    setFeeHeads(prev => prev.filter(h => h.name !== deleteTargetHead.name && h.id !== deleteTargetHead.id));
    showToast(`Fee head "${deleteTargetHead.name}" deleted successfully.`, 'success');

    setDeleteTargetHead(null);
  };

  const handleToggleFeeHeadStatus = (headName: string) => {
    setFeeHeads(prev => {
      const updated = prev.map(h =>
        h.name === headName
          ? { ...h, status: (h.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive' }
          : h
      );
      const target = updated.find(h => h.name === headName);
      showToast(`Fee head "${headName}" set to ${target?.status || 'Active'}.`, 'info');
      return updated;
    });
  };

  // Handlers for Section 2: Fee Structure
  const handleToggleFeeHeadInStructure = (headId: string, defaultAmt: number, headName?: string) => {
    setStructures(prev => {
      const clsConfig = { ...(prev[selectedClass] || {}) };
      const current = clsConfig[headId] || { selected: false, amount: defaultAmt, isCompulsory: true };
      const nextSelected = !current.selected;
      clsConfig[headId] = {
        ...current,
        selected: nextSelected,
      };
      showToast(`${headName || 'Fee head'} marked as ${nextSelected ? 'Active' : 'Inactive'} for ${selectedClass}.`, 'info');
      return { ...prev, [selectedClass]: clsConfig };
    });
  };

  // Handlers for Section 3: Instalments
  const handleOpenAddInstalment = () => {
    setEditingInstalment(null);
    const nextNum = currentInstalments.length + 1;
    setFormInstalmentName(`Instalment ${nextNum}`);
    setFormInstalmentClass(selectedClass);
    setFormInstalmentDueDate('2026-12-15');
    setFormInstalmentAmount(25000);
    setFormInstalmentErrors({});
    setShowAddEditInstalmentModal(true);
  };

  const handleOpenEditInstalment = (inst: InstalmentItem) => {
    setEditingInstalment(inst);
    setFormInstalmentName(inst.name);
    setFormInstalmentClass(selectedClass);
    setFormInstalmentDueDate(inst.dueDate);
    setFormInstalmentAmount(inst.amount);
    setFormInstalmentErrors({});
    setShowAddEditInstalmentModal(true);
  };

  const handleSaveInstalment = () => {
    const errors: { name?: string; amount?: string; dueDate?: string } = {};
    if (!formInstalmentName.trim()) {
      errors.name = 'Instalment name is required';
    }
    if (formInstalmentAmount === '' || Number(formInstalmentAmount) < 0) {
      errors.amount = 'Valid amount is required';
    }
    if (!formInstalmentDueDate) {
      errors.dueDate = 'Due date is required';
    }
    if (Object.keys(errors).length > 0) {
      setFormInstalmentErrors(errors);
      return;
    }

    const targetClass = formInstalmentClass || selectedClass;
    const targetAmount = Number(formInstalmentAmount) || 0;

    setInstalmentPlans(prev => {
      const classList = [...(prev[targetClass] || currentInstalments)];
      if (editingInstalment) {
        const updated = classList.map(item =>
          item.id === editingInstalment.id
            ? { ...item, name: formInstalmentName.trim(), dueDate: formInstalmentDueDate, amount: targetAmount, status: editingInstalment.status || 'Active' }
            : item
        );
        return { ...prev, [targetClass]: updated };
      } else {
        const nextNum = classList.length + 1;
        const newInst: InstalmentItem = {
          id: `inst-${Date.now()}`,
          number: nextNum,
          name: formInstalmentName.trim(),
          dueDate: formInstalmentDueDate,
          amount: targetAmount,
          status: 'Active',
        };
        return { ...prev, [targetClass]: [...classList, newInst] };
      }
    });

    if (targetClass !== selectedClass) {
      setSelectedClass(targetClass);
    }

    showToast(
      editingInstalment
        ? `Instalment "${formInstalmentName}" updated successfully.`
        : `Instalment "${formInstalmentName}" created successfully.`,
      'success'
    );
    setShowAddEditInstalmentModal(false);
  };

  const handleToggleInstalmentStatus = (instId: string) => {
    setInstalmentPlans(prev => {
      const classList = [...(prev[selectedClass] || currentInstalments)];
      const updated = classList.map(item =>
        item.id === instId
          ? { ...item, status: (item.status === 'Inactive' ? 'Active' : 'Inactive') as 'Active' | 'Inactive' }
          : item
      );
      const target = updated.find(i => i.id === instId);
      showToast(`Instalment "${target?.name || ''}" marked as ${target?.status || 'Active'}.`, 'info');
      return { ...prev, [selectedClass]: updated };
    });
  };

  const handleExecuteDeleteInstalment = () => {
    if (!deleteTargetInstalment) return;

    setInstalmentPlans(prev => {
      const classList = prev[selectedClass] || currentInstalments;
      const filtered = classList
        .filter(item => item.id !== deleteTargetInstalment.id)
        .map((row, i) => ({
          ...row,
          number: i + 1,
        }));
      return { ...prev, [selectedClass]: filtered };
    });

    showToast(`Instalment "${deleteTargetInstalment.name}" deleted successfully.`, 'success');
    setDeleteTargetInstalment(null);
  };

  // Handlers for Section 4: Late Fee Rules & Waivers
  const handleOpenEditLateFeeRules = () => {
    setFormFixedLateFee(fixedLateFee);
    setFormPerDayLateFee(perDayLateFee);
    setFormGracePeriodDays(gracePeriodDays);
    setShowEditLateFeeModal(true);
  };

  const handleSaveLateFeeRulesModal = () => {
    setFixedLateFee(Number(formFixedLateFee) || 0);
    setPerDayLateFee(Number(formPerDayLateFee) || 0);
    setGracePeriodDays(Number(formGracePeriodDays) || 0);
    setShowEditLateFeeModal(false);
    showToast('Late Fee rules updated and saved across academic classes!', 'success');
  };

  return (
    <div className="animate-fade-in space-y-7 pb-12 text-left font-['Poppins']">
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER & 3-TAB NAVIGATION */}
      {/* ========================================================================= */}
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb
            items={
              activeTab === 'heads'
                ? ['Accountant', 'Fee Heads']
                : activeTab === 'structure'
                  ? ['Accountant', 'Fee Structure']
                  : activeTab === 'instalments'
                    ? ['Accountant', 'Instalments']
                    : ['Accountant', 'Late Fee Rules']
            }
          />
          <h1 className="text-[20px] sm:text-[22px] font-bold text-[#17153A] tracking-tight mt-1">
            {activeTab === 'heads'
              ? 'Fee Heads'
              : activeTab === 'structure'
                ? 'Class Fee Structure'
                : activeTab === 'instalments'
                  ? 'Instalments Schedule'
                  : 'Late Fee Rules'}
          </h1>
        </div>

        {/* Header Action Button */}
        <div className="flex items-center gap-2.5">
          {activeTab === 'heads' && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              <Icon name="Plus" size={16} strokeWidth={2.2} />
              <span>Add Fee Head</span>
            </button>
          )}

          {activeTab === 'structure' && (
            <button
              type="button"
              onClick={handleOpenAddStructure}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              <Icon name="Plus" size={16} strokeWidth={2.2} />
              <span>New Fee Structure</span>
            </button>
          )}

          {activeTab === 'instalments' && (
            <button
              type="button"
              onClick={handleOpenAddInstalment}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              <Icon name="Plus" size={16} strokeWidth={2.2} />
              <span>New Instalment</span>
            </button>
          )}

          {activeTab === 'late-fee' && (
            <button
              type="button"
              onClick={handleOpenEditLateFeeRules}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              <Icon name="hugeicons:edit-04" size={16} strokeWidth={2.2} />
              <span>Edit Late Fee Rules</span>
            </button>
          )}
        </div>
      </div>

      {/* Underline Tab Navigation Bar */}
      <Tabs
        tabs={[
          { key: 'heads', label: 'Fee Heads', icon: 'solar:tag-linear' },
          { key: 'structure', label: 'Class Fee Structure', icon: 'solar:layers-linear' },
          { key: 'instalments', label: 'Instalments Schedule', icon: 'solar:calendar-date-linear' },
          { key: 'late-fee', label: 'Late Fee Rules', icon: 'solar:clock-circle-linear' },
        ]}
        active={activeTab}
        onChange={(val) => setActiveTab(val as 'heads' | 'structure' | 'instalments' | 'late-fee')}
      />

      {/* SECTION 1: FEE HEADS */}
      {activeTab === 'heads' && (
        <div className="space-y-4">
          {/* Search toolbar matching other tabs */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                placeholder="Search fee heads by name or category..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-8 text-[13px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors font-['Poppins'] placeholder:text-[#94A3B8]"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                <Icon name="Search" size={15} />
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#17153A] cursor-pointer"
                >
                  <Icon name="X" size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid Layout (Not a table) */}
          {displayFeeHeads.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center text-[#64748B] shadow-card-soft">
              <div className="w-12 h-12 rounded-full bg-[#F1F5F9] text-[#94A3B8] flex items-center justify-center mx-auto mb-3">
                <Icon name="Tag" size={22} />
              </div>
              <p className="text-[14px] font-semibold text-[#17153A]">No fee heads registered</p>
              <p className="text-[12px] text-[#64748B] mt-1">Click "Add Fee Head" above to create one</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {displayFeeHeads.map(head => {
                const catStyle = CATEGORY_STYLES[head.category] || CATEGORY_STYLES.Other;
                return (
                  <div
                    key={head.id}
                    className={`bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-4 sm:p-5 shadow-card-soft hover:shadow-card transition-all flex flex-col justify-between gap-3.5 group ${head.status === 'Inactive' ? 'opacity-70' : ''}`}
                  >
                    {/* Top: Category Pill */}
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                      >
                        {head.category}
                      </span>
                    </div>

                    {/* Middle: Fee Head Name & Description */}
                    <div className="flex-1">
                      <h3 className="text-[15px] font-bold text-[#17153A] leading-snug">
                        {head.name}
                      </h3>
                      {head.description && (
                        <p className="text-[12px] text-[#64748B] line-clamp-3 mt-1.5 leading-relaxed">
                          {head.description}
                        </p>
                      )}
                    </div>

                    {/* Divider & Footer: Active/Inactive Toggle Button (Left) and Edit/Delete Icons (Right) */}
                    <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2.5 mt-auto">
                      {/* Left: Active/Inactive Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeeHeadStatus(head.name)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${head.status === 'Active' ? 'bg-[#15803D]' : 'bg-[#CBD5E1]'
                          }`}
                        title={`Status: ${head.status} (Click to toggle)`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${head.status === 'Active' ? 'translate-x-4' : 'translate-x-0'
                            }`}
                        />
                      </button>

                      {/* Right: Edit & Delete Icons */}
                      <div className="inline-flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(head)}
                          className="p-1.5 text-[#64748B] hover:text-[#7C612A] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                          title="Edit Fee Head"
                        >
                          <Icon name="hugeicons:edit-04" size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetHead(head)}
                          className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
                          title="Delete Fee Head"
                        >
                          <Icon name="hugeicons:delete-02" size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: FEE STRUCTURE */}
      {/* ========================================================================= */}
      {activeTab === 'structure' && (
        <div id="sec-fee-structure" className="space-y-6">
          {/* Structure Filter Toolbar - Clean without background card (Like Fee Heads) */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                placeholder="Search fee heads..."
                value={structureSearchQuery}
                onChange={e => setStructureSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-8 text-[13px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors font-['Poppins'] placeholder:text-[#94A3B8]"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                <Icon name="Search" size={15} />
              </span>
              {structureSearchQuery && (
                <button
                  type="button"
                  onClick={() => setStructureSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#17153A] cursor-pointer"
                >
                  <Icon name="X" size={14} />
                </button>
              )}
            </div>

            {/* Academic Year Filter */}
            <div className="relative w-full sm:w-44 shrink-0">
              <select
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-full h-10 pl-3.5 pr-10 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer font-['Poppins']"
              >
                <option value="2026-27">2026-27</option>
                <option value="2025-26">2025-26</option>
                <option value="2024-25">2024-25</option>
              </select>
              <Icon
                name="ChevronDown"
                size={15}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
              />
            </div>

            {/* Target Class Filter */}
            <div className="relative w-full sm:w-44 shrink-0">
              <select
                value={selectedClass}
                onChange={e => {
                  setSelectedClass(e.target.value);
                              }}
                className="w-full h-10 pl-3.5 pr-10 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer font-['Poppins']"
              >
                {CLASS_OPTIONS.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <Icon
                name="ChevronDown"
                size={15}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
              />
            </div>

            {/* Reset Filters */}
            {structureSearchQuery && (
              <button
                type="button"
                onClick={() => setStructureSearchQuery('')}
                className="h-10 px-3 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] rounded-xl border border-[#FECACA] transition-colors cursor-pointer shrink-0"
                title="Clear search"
              >
                <Icon name="RotateCcw" size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Structure Table Card with Class Title */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0]">
              <h2 className="text-[16px] font-bold text-[#17153A]">
                Fee Heads for <span className="text-[#7C612A] font-bold">{selectedClass}</span> · Term <span className="text-[#7C612A] font-bold">{academicYear}</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left font-['Poppins']">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="py-3.5 px-5 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                      Fee Head
                    </th>
                    <th className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                      Class
                    </th>
                    <th className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                      Status
                    </th>
                    <th className="py-3.5 px-5 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] text-right">
                      Class Amount (₹)
                    </th>
                    <th className="py-3.5 px-5 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredClassStructureHeads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#64748B]">
                        <p className="text-[13px] font-semibold text-[#17153A]">No fee heads found for "{structureSearchQuery}"</p>
                        <p className="text-[12px] text-[#64748B] mt-0.5">Try searching with a different fee name</p>
                      </td>
                    </tr>
                  ) : (
                    filteredClassStructureHeads.map((head) => {
                      const configItem = currentClassStructure[head.id] || {
                        selected: true,
                        amount: head.defaultAmount,
                        isCompulsory: head.category === 'Academic' || head.category === 'Admission' || head.category === 'Examination',
                      };
                      const catStyle = (head.category && CATEGORY_STYLES[head.category]) || CATEGORY_STYLES.Other;
                      const classStyle = CLASS_STYLES[selectedClass] || DEFAULT_CLASS_STYLE;
                      const isStructureActive = configItem.selected !== false;

                      return (
                        <tr
                          key={head.id}
                          className={`transition-colors bg-white hover:bg-[#FAF7F2]/40 ${!isStructureActive ? 'opacity-65' : ''}`}
                        >
                          {/* Name */}
                          <td className="py-3.5 px-5">
                            <p className="text-[13px] font-bold text-[#17153A] leading-tight">{head.name}</p>
                          </td>

                          {/* Class (Highlighted with Class Badge Style) */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold border ${classStyle.bg} ${classStyle.text} ${classStyle.border}`}
                            >
                              {selectedClass}
                            </span>
                          </td>

                          {/* Status (Active / Inactive Toggle Switch) */}
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleFeeHeadInStructure(head.id, head.defaultAmount, head.name)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isStructureActive ? 'bg-[#15803D]' : 'bg-[#CBD5E1]'
                                }`}
                              title={`Status: ${isStructureActive ? 'Active' : 'Inactive'} (Click to toggle)`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isStructureActive ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                              />
                            </button>
                          </td>

                          {/* Amount (Highlighted with Category Badge Style) */}
                          <td className="py-3.5 px-5 text-right">
                            <span
                              className={`inline-flex items-center justify-end px-2.5 py-0.5 rounded-full text-[12px] font-bold font-mono border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                            >
                              ₹{configItem.amount.toLocaleString('en-IN')}
                            </span>
                          </td>

                          {/* Actions (Edit and Delete icons) */}
                          <td className="py-3.5 px-5 text-right">
                            <div className="inline-flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenStructureEdit(head, configItem.amount)}
                                className="p-1.5 text-[#64748B] hover:text-[#7C612A] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                                title="Edit Fee Structure"
                              >
                                <Icon name="hugeicons:edit-04" size={18} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTargetHead(head)}
                                className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
                                title="Delete Fee Head"
                              >
                                <Icon name="hugeicons:delete-02" size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Clean Minimal Professional Summary Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 bg-white border-t border-[#E2E8F0]">
              <span className="text-[13px] text-[#64748B]">
                Total Fee Heads: <strong className="font-semibold text-[#17153A]">{classStructureHeads.length}</strong>
              </span>

              <div className="flex items-center gap-2.5">
                <span className="text-[13px] font-medium text-[#64748B]">Total Annual Fee:</span>
                <span className="text-[20px] sm:text-[18px] font-bold font-mono text-[#7C612A] tracking-tight">
                  ₹{totalFee.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: INSTALMENTS */}
      {/* ========================================================================= */}
      {
        activeTab === 'instalments' && (
          <div id="sec-instalments" className="space-y-6">
            {/* Top Filter Toolbar (Matching Class Fee Structure) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Icon
                  name="Search"
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search instalments, due date..."
                  value={instalmentSearchQuery}
                  onChange={e => setInstalmentSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-9 text-[13px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] placeholder-[#94A3B8] outline-none focus:border-[#7C612A] transition-colors font-['Poppins']"
                />
                {instalmentSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setInstalmentSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#17153A] cursor-pointer"
                  >
                    <Icon name="X" size={14} />
                  </button>
                )}
              </div>

              {/* Academic Year Filter */}
              <div className="relative w-full sm:w-44 shrink-0">
                <select
                  value={academicYear}
                  onChange={e => setAcademicYear(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-10 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer font-['Poppins']"
                >
                  <option value="2026-27">2026-27</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                </select>
                <Icon
                  name="ChevronDown"
                  size={15}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                />
              </div>

              {/* Target Class Filter */}
              <div className="relative w-full sm:w-44 shrink-0">
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-10 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer font-['Poppins']"
                >
                  {CLASS_OPTIONS.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Icon
                  name="ChevronDown"
                  size={15}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                />
              </div>

              {/* Reset Filters */}
              {instalmentSearchQuery && (
                <button
                  type="button"
                  onClick={() => setInstalmentSearchQuery('')}
                  className="h-10 px-3 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] rounded-xl border border-[#FECACA] transition-colors cursor-pointer shrink-0"
                  title="Clear search"
                >
                  <Icon name="RotateCcw" size={13} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Instalment Table Card with Class Title */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E2E8F0]">
                <h2 className="text-[16px] font-bold text-[#17153A]">
                  Instalments for <span className="text-[#7C612A] font-bold">{selectedClass}</span> · Term <span className="text-[#7C612A] font-bold">{academicYear}</span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left font-['Poppins']">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="py-3.5 px-5 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                        Instalment
                      </th>
                      <th className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                        Class
                      </th>
                      <th className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                        Due Date
                      </th>
                      <th className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                        Status
                      </th>
                      <th className="py-3.5 px-5 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] text-right">
                        Amount (₹)
                      </th>
                      <th className="py-3.5 px-5 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredInstalments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#64748B]">
                          <p className="text-[13px] font-semibold text-[#17153A]">No instalments found for "{instalmentSearchQuery}"</p>
                          <p className="text-[12px] text-[#64748B] mt-0.5">Try searching with a different instalment name or due date</p>
                        </td>
                      </tr>
                    ) : (
                      filteredInstalments.map((inst) => {
                        const classStyle = CLASS_STYLES[selectedClass] || DEFAULT_CLASS_STYLE;
                        const isInstActive = inst.status !== 'Inactive';

                        return (
                          <tr
                            key={inst.id}
                            className={`transition-colors bg-white hover:bg-[#FAF7F2]/40 ${!isInstActive ? 'opacity-65' : ''}`}
                          >
                            {/* Instalment Name */}
                            <td className="py-3.5 px-5">
                              <p className="text-[13px] font-bold text-[#17153A] leading-tight">{inst.name}</p>
                            </td>

                            {/* Class (Highlighted with Class Badge Style) */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold border ${classStyle.bg} ${classStyle.text} ${classStyle.border}`}
                              >
                                {selectedClass}
                              </span>
                            </td>

                            {/* Due Date */}
                            <td className="py-3.5 px-4">
                              <span className="text-[12px] text-[#475569] font-medium bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">
                                {formatDueDate(inst.dueDate, academicYear)}
                              </span>
                            </td>

                            {/* Status (Active / Inactive Toggle Switch) */}
                            <td className="py-3.5 px-4">
                              <button
                                type="button"
                                onClick={() => handleToggleInstalmentStatus(inst.id)}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isInstActive ? 'bg-[#15803D]' : 'bg-[#CBD5E1]'
                                  }`}
                                title={`Status: ${isInstActive ? 'Active' : 'Inactive'} (Click to toggle)`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isInstActive ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                />
                              </button>
                            </td>

                            {/* Amount */}
                            <td className="py-3.5 px-5 text-right">
                              <span className="inline-flex items-center justify-end px-2.5 py-0.5 rounded-full text-[12px] font-bold font-mono border bg-[#FAF7F2] text-[#7C612A] border-[#E8DFC8]">
                                ₹{inst.amount.toLocaleString('en-IN')}
                              </span>
                            </td>

                            {/* Actions (Edit and Delete icons) */}
                            <td className="py-3.5 px-5 text-right">
                              <div className="inline-flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditInstalment(inst)}
                                  className="p-1.5 text-[#64748B] hover:text-[#7C612A] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                                  title="Edit Instalment"
                                >
                                  <Icon name="hugeicons:edit-04" size={18} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTargetInstalment(inst)}
                                  className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
                                  title="Delete Instalment"
                                >
                                  <Icon name="hugeicons:delete-02" size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Clean Minimal Professional Summary Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 bg-white border-t border-[#E2E8F0]">
                <span className="text-[13px] text-[#64748B]">
                  Total Instalments: <strong className="font-semibold text-[#17153A]">{currentInstalments.length}</strong>
                </span>

                <div className="flex items-center gap-2.5">
                  <span className="text-[13px] font-medium text-[#64748B]">Total Annual Fee:</span>
                  <span className="text-[20px] sm:text-[18px] font-bold font-mono text-[#7C612A] tracking-tight">
                    ₹{instalmentSum.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* ========================================================================= */}
      {/* SECTION 4: LATE FEE RULES CONFIGURATION */}
      {/* ========================================================================= */}
      {activeTab === 'late-fee' && (
        <div id="sec-late-fee" className="space-y-6">
          {/* CONTAINER 1: LATE FEE RULES OVERVIEW CARDS (Clean White BG) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Fixed Initial Late Fine */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft hover:shadow-card transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                  Fixed Initial Late Fine
                </span>
                <button
                  type="button"
                  onClick={handleOpenEditLateFeeRules}
                  className="p-1 text-[#64748B] hover:text-[#7C612A] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                  title="Edit Rules"
                >
                  <Icon name="hugeicons:edit-04" size={15} />
                </button>
              </div>
              <div className="mt-3">
                <p className="text-[26px] font-bold font-mono text-[#17153A] tracking-tight">
                  ₹{fixedLateFee.toLocaleString('en-IN')}
                </p>
                <p className="text-[12px] text-[#64748B] mt-1 leading-relaxed">
                  Levied immediately after the grace period expires
                </p>
              </div>
            </div>

            {/* 2. Per-Day Late Accrual */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft hover:shadow-card transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                  Per-Day Late Accrual
                </span>
                <button
                  type="button"
                  onClick={handleOpenEditLateFeeRules}
                  className="p-1 text-[#64748B] hover:text-[#7C612A] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                  title="Edit Rules"
                >
                  <Icon name="hugeicons:edit-04" size={15} />
                </button>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[26px] font-bold font-mono text-[#17153A] tracking-tight">
                    ₹{perDayLateFee.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[13px] font-semibold text-[#64748B]">/ day</span>
                </div>
                <p className="text-[12px] text-[#64748B] mt-1 leading-relaxed">
                  Accrues daily until pending payment is recorded
                </p>
              </div>
            </div>

            {/* 3. Grace Period */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-card-soft hover:shadow-card transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                  Grace Period (Days)
                </span>
                <button
                  type="button"
                  onClick={handleOpenEditLateFeeRules}
                  className="p-1 text-[#64748B] hover:text-[#7C612A] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                  title="Edit Rules"
                >
                  <Icon name="hugeicons:edit-04" size={15} />
                </button>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[26px] font-bold font-mono text-[#7C612A] tracking-tight">
                    {gracePeriodDays}
                  </span>
                  <span className="text-[13px] font-bold text-[#7C612A]">Days</span>
                </div>
                <p className="text-[12px] text-[#64748B] mt-1 leading-relaxed">
                  Days after instalment due date before fine begins
                </p>
              </div>
            </div>
          </div>

          {/* CONTAINER 2: HISTORICAL LATE FEE & WAIVERS AUDIT (SEPARATE CONTAINER) */}
          <div className="space-y-4">
            {/* Filter Toolbar: Search, Class, Section, Term */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Icon
                  name="Search"
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search student, GR no, ID, reason..."
                  value={waiverSearchQuery}
                  onChange={e => setWaiverSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-9 text-[13px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] placeholder-[#94A3B8] outline-none focus:border-[#7C612A] transition-colors font-['Poppins']"
                />
                {waiverSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setWaiverSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#17153A] cursor-pointer"
                  >
                    <Icon name="X" size={14} />
                  </button>
                )}
              </div>

              {/* Class Filter */}
              <div className="relative w-full sm:w-40 shrink-0">
                <select
                  value={waiverClass}
                  onChange={e => setWaiverClass(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-10 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer font-['Poppins']"
                >
                  <option value="All Classes">All Classes</option>
                  {CLASS_OPTIONS.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Icon
                  name="ChevronDown"
                  size={15}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                />
              </div>

              {/* Section Filter */}
              <div className="relative w-full sm:w-36 shrink-0">
                <select
                  value={waiverSection}
                  onChange={e => setWaiverSection(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-10 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer font-['Poppins']"
                >
                  <option value="All Sections">All Sections</option>
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                </select>
                <Icon
                  name="ChevronDown"
                  size={15}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                />
              </div>

              {/* Term / Academic Year Filter */}
              <div className="relative w-full sm:w-36 shrink-0">
                <select
                  value={waiverYear}
                  onChange={e => setWaiverYear(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-10 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer font-['Poppins']"
                >
                  <option value="All Terms">All Terms</option>
                  <option value="2026-27">2026-27</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                </select>
                <Icon
                  name="ChevronDown"
                  size={15}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                />
              </div>

              {/* Reset Filters */}
              {(waiverSearchQuery || waiverYear !== 'All Terms' || waiverClass !== 'All Classes' || waiverSection !== 'All Sections') && (
                <button
                  type="button"
                  onClick={() => {
                    setWaiverSearchQuery('');
                    setWaiverYear('All Terms');
                    setWaiverClass('All Classes');
                    setWaiverSection('All Sections');
                  }}
                  className="h-10 px-3 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#560110] bg-[#FAF7F2] hover:bg-[#F2ECE1] rounded-xl border border-[#E8DFC8] transition-colors cursor-pointer shrink-0"
                  title="Clear search & filters"
                >
                  <Icon name="RotateCcw" size={13} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Historical Waivers & Late Fee Audit Table Card */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-[16px] font-bold text-[#17153A]">
                  History Late Fee Records
                  {waiverYear !== 'All Terms' && (
                    <> · Term <span className="text-[#7C612A] font-bold">{waiverYear}</span></>
                  )}
                  {waiverClass !== 'All Classes' && (
                    <> · <span className="text-[#7C612A] font-bold">{waiverClass}</span></>
                  )}
                  {waiverSection !== 'All Sections' && (
                    <> · <span className="text-[#7C612A] font-bold">{waiverSection}</span></>
                  )}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left font-['Poppins']">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="py-3.5 px-5 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                        Student
                      </th>
                      <th className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                        GR No.
                      </th>
                      <th className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                        Student ID
                      </th>
                      <th className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] text-right">
                        Original Fee (₹)
                      </th>
                      <th className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                        Due Date
                      </th>
                      <th className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                        Paid Date
                      </th>
                      <th className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] text-right">
                        Late Fee (₹)
                      </th>
                      <th className="py-3.5 px-5 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px]">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredWaivers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-[#64748B]">
                          <p className="text-[13px] font-semibold text-[#17153A]">No late fee records found</p>
                          <p className="text-[12px] text-[#64748B] mt-0.5">Try adjusting your search query or filter options</p>
                        </td>
                      </tr>
                    ) : (
                      filteredWaivers.map((w) => {
                        const baseClass = w.className.split('-')[0].trim();
                        const classStyle = CLASS_STYLES[baseClass] || CLASS_STYLES[w.className] || DEFAULT_CLASS_STYLE;
                        const studentAvatar = w.photo || studentPhotos[w.studentName];

                        return (
                          <tr
                            key={w.id}
                            className="transition-colors bg-white hover:bg-[#FAF7F2]/40"
                          >
                            {/* Student (Photo + Name + Class/Section) */}
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3">
                                {studentAvatar ? (
                                  <img
                                    src={studentAvatar}
                                    alt={w.studentName}
                                    className="w-9 h-9 rounded-full object-cover border border-[#E2E8F0] shrink-0"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-[#FAF7F2] text-[#7C612A] font-bold text-[12px] flex items-center justify-center border border-[#E8DFC8] shrink-0">
                                    {w.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </div>
                                )}
                                <div>
                                  <p className="text-[13px] font-bold text-[#17153A] leading-tight">{w.studentName}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span
                                      className={"inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold border " + classStyle.bg + " " + classStyle.text + " " + classStyle.border}
                                    >
                                      {w.className} {w.section ? ("• " + w.section.replace('Section ', '')) : ''}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* GR Number */}
                            <td className="py-3.5 px-4">
                              <span className="text-[12px] font-semibold font-mono text-[#17153A] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                                {w.grNumber}
                              </span>
                            </td>

                            {/* Student ID */}
                            <td className="py-3.5 px-4">
                              <span className="text-[12px] font-medium font-mono text-[#64748B]">
                                {w.studentId || w.admissionNo}
                              </span>
                            </td>

                            {/* Original Fee Amount */}
                            <td className="py-3.5 px-4 text-right">
                              <span className="inline-flex items-center justify-end px-2.5 py-0.5 rounded-full text-[12px] font-bold font-mono border bg-[#F8FAFC] text-[#17153A] border-[#E2E8F0]">
                                ₹{(w.originalAmount || 0).toLocaleString('en-IN')}
                              </span>
                            </td>

                            {/* Due Date */}
                            <td className="py-3.5 px-4">
                              <span className="text-[12px] text-[#475569] font-medium bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0] whitespace-nowrap">
                                {formatDueDate(w.dueDate || w.date, w.academicYear)}
                              </span>
                            </td>

                            {/* Paid Date */}
                            <td className="py-3.5 px-4">
                              <span className="text-[12px] text-[#15803D] font-medium bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0] whitespace-nowrap">
                                {formatDueDate(w.paidDate || w.date, w.academicYear)}
                              </span>
                            </td>

                            {/* Late Fee Amount */}
                            <td className="py-3.5 px-4 text-right">
                              <span className="inline-flex items-center justify-end px-2.5 py-0.5 rounded-full text-[12px] font-bold font-mono border bg-[#FDF2F4] text-[#560110] border-[#F9C8D2]">
                                ₹{(w.lateFeeAmount || w.waivedAmount).toLocaleString('en-IN')}
                              </span>
                            </td>

                            {/* Reason */}
                            <td className="py-3.5 px-5 max-w-xs">
                              <p className="text-[12px] text-[#475569] leading-relaxed truncate" title={w.reason}>
                                {w.reason}
                              </p>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Clean Summary Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 bg-white border-t border-[#E2E8F0]">
                <span className="text-[13px] text-[#64748B]">
                  Total Records: <strong className="font-semibold text-[#17153A]">{filteredWaivers.length}</strong>
                </span>

                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-[#64748B]">Original Total:</span>
                    <span className="text-[15px] font-bold font-mono text-[#17153A]">
                      ₹{totalOriginalFeeSum.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-[#64748B]">Total Late Fee:</span>
                    <span className="text-[18px] font-bold font-mono text-[#560110] tracking-tight">
                      ₹{totalLateFeeSum.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT FEE HEAD / STRUCTURE */}
      {/* ========================================================================= */}
      {
        showAddEditModal && (
          <Modal
            open={showAddEditModal}
            onClose={() => setShowAddEditModal(false)}
            title={
              editingStructureContext
                ? (editingHead ? `Edit Fee Structure: ${formName}` : 'Create New Fee Structure')
                : (editingHead ? `Edit Fee Head: ${editingHead.name}` : 'Add New Fee Head')
            }
            size="md"
            className="max-w-xl"
            bodyClassName="!bg-[#F1F5F9] p-5 sm:p-6 font-['Poppins'] text-left"
            footer={
              <div className="flex items-center justify-end gap-2.5 w-full">
                <Button variant="outline" onClick={() => setShowAddEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveFeeHead}>
                  {editingStructureContext
                    ? (editingHead ? 'Save Changes' : 'Create Fee Structure')
                    : (editingHead ? 'Save Changes' : 'Create Fee Head')}
                </Button>
              </div>
            }
          >
            <div className="text-left">
              {editingStructureContext ? (
                /* Single Combined Container: Fee Structure Details (Matching Class Fee Structure Table) */
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F5F9]">
                    <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#7C612A] flex items-center justify-center">
                      <Icon name="Tag" size={15} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                        Fee Structure Details
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Fee Head Name Dropdown */}
                    <Select
                      label="Fee Head Name"
                      required
                      value={formName}
                      onChange={e => {
                        const selectedName = e.target.value;
                        setFormName(selectedName);
                        const matched = masterFeeHeads.find(h => h.name === selectedName);
                        if (matched) {
                          setFormFrequency(matched.frequency);
                        }
                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                      }}
                      options={feeHeadDropdownOptions}
                      error={formErrors.name}
                    />

                    {/* Class & Class Amount (₹) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        label="Class"
                        required
                        value={formStandard}
                        onChange={e => setFormStandard(e.target.value)}
                        options={CLASS_OPTIONS.map(c => ({ value: c, label: c }))}
                      />

                      <Input
                        label="Class Amount (₹)"
                        required
                        type="number"
                        min={0}
                        placeholder="e.g. 2500"
                        value={formStructureAmount}
                        onChange={e => {
                          setFormStructureAmount(e.target.value === '' ? '' : Number(e.target.value));
                          if (formErrors.amount) setFormErrors({ ...formErrors, amount: undefined });
                        }}
                        error={formErrors.amount}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Single Combined Container: Fee Head Details (For Heads tab) */
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F5F9]">
                    <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#7C612A] flex items-center justify-center">
                      <Icon name="Tag" size={15} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                        Fee Head Details
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Fee Head Name"
                      required
                      placeholder="e.g. Tuition Fee, Admission Fee, Activity Fee"
                      value={formName}
                      onChange={e => {
                        setFormName(e.target.value);
                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                      }}
                      error={formErrors.name}
                    />

                    <Textarea
                      rows={4}
                      label="Description"
                      placeholder="State the purpose of this fee and any details..."
                      value={formDescription}
                      onChange={e => setFormDescription(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )
      }

      {/* ========================================================================= */}
      {/* MODAL 2: VIEW FEE HEAD DETAILS & FINANCIAL AUDIT DOSSIER */}
      {/* ========================================================================= */}
      {
        viewingHead && (
          <Modal
            open={!!viewingHead}
            onClose={() => setViewingHead(null)}
            title={`Fee Head Dossier: ${viewingHead.name}`}
            size="md"
            className="max-w-lg"
            bodyClassName="p-5 sm:p-6 font-['Poppins']"
            footer={
              <div className="flex items-center justify-end gap-2.5 w-full">
                <Button variant="outline" onClick={() => setViewingHead(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    const h = viewingHead;
                    setViewingHead(null);
                    handleOpenEdit(h);
                  }}
                >
                  Edit Details
                </Button>
              </div>
            }
          >
            <div className="space-y-4 text-left">
              {/* Header Pill Info */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] flex items-center justify-between">
                <div>
                  <span className="font-mono text-[12px] font-bold px-2 py-0.5 rounded bg-white text-[#7C612A] border border-[#E8DFC8]">
                    {viewingHead.id}
                  </span>
                  <h3 className="text-[17px] font-bold text-[#17153A] mt-1.5">{viewingHead.name}</h3>
                  <p className="text-[12px] text-[#64748B] mt-0.5">{viewingHead.category} Category</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#64748B] block">Default Base</span>
                  <p className="text-[18px] font-bold font-mono text-[#7C612A]">
                    ₹{viewingHead.defaultAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Structured Specs */}
              <div className="divide-y divide-[#F1F5F9] text-[13px]">
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#64748B]">Applicable Standard</span>
                  <span className="font-semibold text-[#17153A] px-2.5 py-0.5 rounded-md bg-[#F1F5F9] border border-[#CBD5E1] text-[11px]">
                    {getStandardDisplay(viewingHead)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#64748B]">Academic Term</span>
                  <span className="font-semibold text-[#7C612A] px-2.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8DFC8] text-[11px]">
                    {viewingHead.term || '2026-2027'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#64748B]">Number of Instalments</span>
                  <span className="font-semibold text-[#17153A] px-2.5 py-0.5 rounded-md bg-[#F8FAFC] border border-[#CBD5E1] text-[11px]">
                    {getInstalmentsForHead(viewingHead)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#64748B]">Instalment Due Dates</span>
                  <span className="font-semibold text-[#7C612A] px-2.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8DFC8] text-[11px]">
                    {getDueDatesForHead(viewingHead)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#64748B]">Billing Frequency</span>
                  <span className="font-semibold text-[#17153A]">{viewingHead.frequency}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#64748B]">Status</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${viewingHead.status === 'Active'
                      ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                      : 'bg-[#F8FAFC] text-[#64748B] border-[#CBD5E1]'
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${viewingHead.status === 'Active' ? 'bg-[#16A34A]' : 'bg-[#94A3B8]'
                        }`}
                    />
                    {viewingHead.status}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#64748B]">Created Date</span>
                  <span className="font-semibold text-[#17153A]">{viewingHead.createdDate}</span>
                </div>
                <div className="py-2">
                  <span className="text-[#64748B] block mb-1">Description</span>
                  <p className="text-[12px] text-[#334155] leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                    {viewingHead.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Financial Audit Integrity Card */}
              <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE]">
                <div className="flex items-center gap-2 mb-1 text-[#1D4ED8] font-bold text-[12px]">
                  <Icon name="ShieldCheck" size={16} />
                  <span>Financial Ledger Audit Status</span>
                </div>
                <p className="text-[12px] text-[#1E40AF] leading-relaxed">
                  {viewingHead.transactionCount > 0 ? (
                    <>
                      This fee head is currently linked to <strong className="font-bold">{viewingHead.transactionCount} financial transactions</strong> across {viewingHead.appliedClassesCount} active school classes. In accordance with institutional accounting regulations, this record is locked against deletion and must be preserved for annual audit reports.
                    </>
                  ) : (
                    <>
                      No financial payments have been billed under this fee head yet. It can be safely edited or removed without affecting past audit records.
                    </>
                  )}
                </p>
              </div>
            </div>
          </Modal>
        )
      }

      {/* ========================================================================= */}
      {/* MODAL 3: DELETE CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      {
        deleteTargetHead && (
          <Modal
            open={!!deleteTargetHead}
            onClose={() => setDeleteTargetHead(null)}
            title="Delete Fee Head"
            size="sm"
            className="max-w-md"
            bodyClassName="p-5 sm:p-6 font-['Poppins']"
            footer={
              <div className="flex items-center justify-end gap-2.5 w-full">
                <Button variant="outline" onClick={() => setDeleteTargetHead(null)}>
                  Cancel
                </Button>
                <button
                  type="button"
                  onClick={handleExecuteDeleteOrDeactivate}
                  className="px-4 py-2 text-[13px] font-semibold text-white rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] transition-all shadow-xs cursor-pointer"
                >
                  Delete Fee Head
                </button>
              </div>
            }
          >
            <div className="flex flex-col items-center text-center space-y-3 py-1">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1 bg-[#FEF2F2] text-[#DC2626]">
                <Icon name="hugeicons:delete-02" size={22} />
              </div>

              <h3 className="text-[16px] font-bold text-[#17153A] text-center">
                Delete "{deleteTargetHead.name}"?
              </h3>

              <p className="text-[13px] text-[#64748B] leading-relaxed text-center max-w-sm">
                Are you sure you want to delete <strong className="text-[#17153A] font-semibold">{deleteTargetHead.name}</strong> ({deleteTargetHead.category}) fee head? This action cannot be undone.
              </p>
            </div>
          </Modal>
        )
      }

      {/* ========================================================================= */}
      {/* MODAL 4: ADD / EDIT INSTALMENT */}
      {/* ========================================================================= */}
      {
        showAddEditInstalmentModal && (
          <Modal
            open={showAddEditInstalmentModal}
            onClose={() => setShowAddEditInstalmentModal(false)}
            title={editingInstalment ? `Edit Instalment: ${formInstalmentName}` : 'Create New Instalment'}
            size="md"
            className="max-w-xl"
            bodyClassName="!bg-[#F1F5F9] p-5 sm:p-6 font-['Poppins'] text-left"
            footer={
              <div className="flex items-center justify-end gap-2.5 w-full">
                <Button variant="outline" onClick={() => setShowAddEditInstalmentModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveInstalment}>
                  {editingInstalment ? 'Save Changes' : 'Create Instalment'}
                </Button>
              </div>
            }
          >
            <div className="text-left">
              {/* Single Combined Container: Instalment Details (Matching Fee Structure Modal) */}
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F5F9]">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#7C612A] flex items-center justify-center">
                    <Icon name="Calendar" size={15} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                      Instalment Details
                    </h4>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Instalment Name */}
                  <Input
                    label="Instalment Name"
                    required
                    placeholder="e.g. First Instalment (Term 1 & Admission)"
                    value={formInstalmentName}
                    onChange={e => {
                      setFormInstalmentName(e.target.value);
                      if (formInstalmentErrors.name) setFormInstalmentErrors({ ...formInstalmentErrors, name: undefined });
                    }}
                    error={formInstalmentErrors.name}
                  />

                  {/* Class & Due Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Class"
                      required
                      value={formInstalmentClass}
                      onChange={e => setFormInstalmentClass(e.target.value)}
                      options={CLASS_OPTIONS.map(c => ({ value: c, label: c }))}
                    />

                    <Input
                      label="Due Date"
                      required
                      type="date"
                      value={formInstalmentDueDate}
                      onChange={e => {
                        setFormInstalmentDueDate(e.target.value);
                        if (formInstalmentErrors.dueDate) setFormInstalmentErrors({ ...formInstalmentErrors, dueDate: undefined });
                      }}
                      error={formInstalmentErrors.dueDate}
                    />
                  </div>

                  {/* Class Amount (₹) */}
                  <Input
                    label="Class Amount (₹)"
                    required
                    type="number"
                    min={0}
                    placeholder="e.g. 25000"
                    value={formInstalmentAmount}
                    onChange={e => {
                      setFormInstalmentAmount(e.target.value === '' ? '' : Number(e.target.value));
                      if (formInstalmentErrors.amount) setFormInstalmentErrors({ ...formInstalmentErrors, amount: undefined });
                    }}
                    error={formInstalmentErrors.amount}
                  />
                </div>
              </div>
            </div>
          </Modal>
        )
      }

      {/* ========================================================================= */}
      {/* MODAL 5: DELETE INSTALMENT CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      {
        deleteTargetInstalment && (
          <Modal
            open={!!deleteTargetInstalment}
            onClose={() => setDeleteTargetInstalment(null)}
            title="Delete Instalment"
            size="sm"
            className="max-w-md"
            bodyClassName="p-5 sm:p-6 font-['Poppins']"
            footer={
              <div className="flex items-center justify-end gap-2.5 w-full">
                <Button variant="outline" onClick={() => setDeleteTargetInstalment(null)}>
                  Cancel
                </Button>
                <button
                  type="button"
                  onClick={handleExecuteDeleteInstalment}
                  className="px-4 py-2 text-[13px] font-semibold text-white rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] transition-all shadow-xs cursor-pointer"
                >
                  Delete Instalment
                </button>
              </div>
            }
          >
            <div className="flex flex-col items-center text-center space-y-3 py-1">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1 bg-[#FEF2F2] text-[#DC2626]">
                <Icon name="hugeicons:delete-02" size={22} />
              </div>

              <h3 className="text-[16px] font-bold text-[#17153A] text-center">
                Delete "{deleteTargetInstalment.name}"?
              </h3>

              <p className="text-[13px] text-[#64748B] leading-relaxed text-center max-w-sm">
                Are you sure you want to delete <strong className="text-[#17153A] font-semibold">{deleteTargetInstalment.name}</strong> for {selectedClass}? This action cannot be undone.
              </p>
            </div>
          </Modal>
        )
      }

      {/* ========================================================================= */}
      {/* MODAL 6: EDIT LATE FEE RULES */}
      {/* ========================================================================= */}
      {
        showEditLateFeeModal && (
          <Modal
            open={showEditLateFeeModal}
            onClose={() => setShowEditLateFeeModal(false)}
            title="Edit Late Fee Rules"
            size="md"
            className="max-w-xl"
            bodyClassName="!bg-[#F1F5F9] p-5 sm:p-6 font-['Poppins'] text-left"
            footer={
              <div className="flex items-center justify-end gap-2.5 w-full">
                <Button variant="outline" onClick={() => setShowEditLateFeeModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveLateFeeRulesModal}>
                  Save Changes
                </Button>
              </div>
            }
          >
            <div className="text-left">
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F5F9]">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#7C612A] flex items-center justify-center">
                    <Icon name="solar:clock-circle-linear" size={16} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                      Late Fee Rules Configuration
                    </h4>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Fixed Initial Late Fine (₹)"
                    required
                    type="number"
                    min={0}
                    value={formFixedLateFee}
                    onChange={e => setFormFixedLateFee(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 500"
                  />

                  <Input
                    label="Per-Day Late Accrual (₹)"
                    required
                    type="number"
                    min={0}
                    value={formPerDayLateFee}
                    onChange={e => setFormPerDayLateFee(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 25"
                  />

                  <Input
                    label="Grace Period (Days)"
                    required
                    type="number"
                    min={0}
                    value={formGracePeriodDays}
                    onChange={e => setFormGracePeriodDays(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 7"
                  />
                </div>
              </div>
            </div>
          </Modal>
        )
      }

          </div>
  );
}
