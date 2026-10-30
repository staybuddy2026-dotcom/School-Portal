import { useState, useMemo } from 'react';
import { Icon } from '@/components/Icon';
import { Breadcrumb, Modal, showToast, Select, Textarea, Tabs } from '@/components/ui';

// ============================================================================
// Types
// ============================================================================
export interface DefaulterStudent {
  id: string;
  studentName: string;
  studentId: string;
  grNumber: string;
  class: string;
  section: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  overdueInstalment: string;
  dueDate: string;
  overdueDays: number;
  totalDue: number;
  lastReminderSent?: string;
  reminderCount: number;
}

export interface DayBookEntry {
  receiptNo: string;
  studentName: string;
  class: string;
  mode: 'Cash' | 'Cheque' | 'UPI' | 'Online Gateway' | 'DD';
  amount: number;
  time: string;
  cashier: string;
}

// ============================================================================
// Mock Data
// ============================================================================
const INITIAL_DEFAULTERS: DefaulterStudent[] = [
  {
    id: 'def-1',
    studentName: 'Ishaan Verma',
    studentId: 'STU-2026-0144',
    grNumber: 'GR-9844',
    class: 'Class 8',
    section: 'A',
    parentName: 'Manish Verma',
    parentPhone: '+91 97654 32109',
    parentEmail: 'manish.verma@gmail.com',
    overdueInstalment: 'Instalment 2 (Term 2 Tuition)',
    dueDate: '2026-08-10',
    overdueDays: 80,
    totalDue: 65000,
    lastReminderSent: '2026-10-20 (WhatsApp)',
    reminderCount: 3,
  },
  {
    id: 'def-2',
    studentName: 'Saanvi Reddy',
    studentId: 'STU-2026-0146',
    grNumber: 'GR-9860',
    class: 'Class 8',
    section: 'A',
    parentName: 'Venkat Reddy',
    parentPhone: '+91 98812 34567',
    parentEmail: 'venkat.reddy@gmail.com',
    overdueInstalment: 'Instalment 2 (Term 2 Tuition)',
    dueDate: '2026-08-10',
    overdueDays: 80,
    totalDue: 65000,
    lastReminderSent: '2026-10-18 (SMS)',
    reminderCount: 2,
  },
  {
    id: 'def-3',
    studentName: 'Aarav Sharma',
    studentId: 'STU-2026-0142',
    grNumber: 'GR-9821',
    class: 'Class 8',
    section: 'A',
    parentName: 'Rajesh Sharma',
    parentPhone: '+91 98765 43210',
    parentEmail: 'rajesh.sharma@gmail.com',
    overdueInstalment: 'Instalment 2 (Partial Due)',
    dueDate: '2026-08-10',
    overdueDays: 80,
    totalDue: 45000,
    lastReminderSent: '2026-10-15 (Push)',
    reminderCount: 1,
  },
  {
    id: 'def-4',
    studentName: 'Arjun Nair',
    studentId: 'STU-2026-0148',
    grNumber: 'GR-9865',
    class: 'Class 8',
    section: 'B',
    parentName: 'Ramesh Nair',
    parentPhone: '+91 98223 90123',
    parentEmail: 'ramesh.nair@hotmail.com',
    overdueInstalment: 'Instalment 2 Tuition (Bounced Cheque)',
    dueDate: '2026-08-10',
    overdueDays: 80,
    totalDue: 50000,
    lastReminderSent: '2026-10-27 (WhatsApp)',
    reminderCount: 4,
  },
  {
    id: 'def-5',
    studentName: 'Kavya Pillai',
    studentId: 'STU-2026-0160',
    grNumber: 'GR-9902',
    class: 'Class 7',
    section: 'A',
    parentName: 'Gopal Pillai',
    parentPhone: '+91 98230 45678',
    parentEmail: 'gopal.pillai@yahoo.com',
    overdueInstalment: 'Instalment 1 & 2',
    dueDate: '2026-08-10',
    overdueDays: 80,
    totalDue: 62000,
    reminderCount: 0,
  },
];

const TODAY_DAYBOOK: DayBookEntry[] = [
  { receiptNo: 'RCP-2026-05401', studentName: 'Vihaan Joshi', class: 'Class 8-A', mode: 'UPI', amount: 15000, time: '11:15 AM', cashier: 'Suresh Bhat' },
  { receiptNo: 'RCP-2026-05400', studentName: 'Diya Patel', class: 'Class 8-A', mode: 'Cash', amount: 25000, time: '10:40 AM', cashier: 'Suresh Bhat' },
  { receiptNo: 'RCP-GW-982104', studentName: 'Aarav Sharma', class: 'Class 8-A', mode: 'Online Gateway', amount: 15000, time: '12:02 PM', cashier: 'Razorpay PG' },
  { receiptNo: 'RCP-GW-982105', studentName: 'Saanvi Reddy', class: 'Class 8-A', mode: 'Online Gateway', amount: 25000, time: '11:18 AM', cashier: 'Razorpay PG' },
  { receiptNo: 'RCP-2026-05399', studentName: 'Ishaan Verma', class: 'Class 8-A', mode: 'Cheque', amount: 8000, time: '09:30 AM', cashier: 'Suresh Bhat' },
];

const CLASS_COLLECTION_SUMMARY = [
  { class: 'Class 1', enrolled: 65, totalBilled: 2925000, collected: 2650000, concessions: 75000, due: 200000, percent: 91 },
  { class: 'Class 2', enrolled: 60, totalBilled: 2880000, collected: 2520000, concessions: 60000, due: 300000, percent: 88 },
  { class: 'Class 3', enrolled: 62, totalBilled: 3100000, collected: 2750000, concessions: 50000, due: 300000, percent: 89 },
  { class: 'Class 4', enrolled: 58, totalBilled: 3074000, collected: 2680000, concessions: 45000, due: 349000, percent: 87 },
  { class: 'Class 5', enrolled: 70, totalBilled: 5495000, collected: 4890000, concessions: 120000, due: 485000, percent: 89 },
  { class: 'Class 6', enrolled: 72, totalBilled: 6048000, collected: 5200000, concessions: 140000, due: 708000, percent: 86 },
  { class: 'Class 7', enrolled: 68, totalBilled: 6324000, collected: 5310000, concessions: 110000, due: 904000, percent: 84 },
  { class: 'Class 8', enrolled: 75, totalBilled: 7350000, collected: 5980000, concessions: 180000, due: 1190000, percent: 81 },
  { class: 'Class 9', enrolled: 80, totalBilled: 8480000, collected: 7120000, concessions: 150000, due: 1210000, percent: 84 },
  { class: 'Class 10', enrolled: 85, totalBilled: 9945000, collected: 8650000, concessions: 190000, due: 1105000, percent: 87 },
];

const HEAD_COLLECTION_SUMMARY = [
  { head: 'Tuition Fee', category: 'Academic', budgeted: 36800000, collected: 30850000, due: 5950000, percent: 84 },
  { head: 'Admission Fee', category: 'Admission', budgeted: 8500000, collected: 8500000, due: 0, percent: 100 },
  { head: 'Term Fee', category: 'Academic', budgeted: 5400000, collected: 4600000, due: 800000, percent: 85 },
  { head: 'Activity Fee', category: 'Activity', budgeted: 3100000, collected: 2750000, due: 350000, percent: 89 },
  { head: 'Examination Fee', category: 'Examination', budgeted: 2200000, collected: 1920000, due: 280000, percent: 87 },
  { head: 'Transport Fee', category: 'Transport', budgeted: 6800000, collected: 5450000, due: 1350000, percent: 80 },
  { head: 'Late Fee / Surcharge', category: 'Penalty', budgeted: 250000, collected: 180000, due: 70000, percent: 72 },
];

// ============================================================================
// Component: ReportsAndReminders
// ============================================================================
interface ReportsAndRemindersProps {
  initialSubTab?: 'reports' | 'reminders';
}

export function ReportsAndReminders({ initialSubTab = 'reports' }: ReportsAndRemindersProps) {
  const [activeSubTab, setActiveSubTab] = useState<'reports' | 'reminders'>(initialSubTab);

  // Reports Sub-Section State
  const [reportView, setReportView] = useState<'daybook' | 'classwise' | 'headwise' | 'modewise'>('daybook');

  // Reminders & Defaulters State
  const [defaulters, setDefaulters] = useState<DefaulterStudent[]>(INITIAL_DEFAULTERS);
  const [selectedDefaulterIds, setSelectedDefaulterIds] = useState<string[]>([]);
  const [defaulterClassFilter, setDefaulterClassFilter] = useState('All');
  const [overdueDaysFilter, setOverdueDaysFilter] = useState('All');

  // Broadcast Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [reminderType, setReminderType] = useState('Overdue 1st Notice');
  const [channelPush, setChannelPush] = useState(true);
  const [channelSms, setChannelSms] = useState(true);
  const [channelWhatsapp, setChannelWhatsapp] = useState(true);
  const [reminderMessage, setReminderMessage] = useState(
    'Dear Parent, this is a reminder from Sadvidhya International School that fee instalment of ₹{Amount} for {StudentName} is overdue. Kindly pay via the parent portal or school counter to avoid late fee penalties. Pay online: {PaymentLink}'
  );

  // Filtered Defaulters
  const filteredDefaulters = useMemo(() => {
    return defaulters.filter(d => {
      const matchesClass = defaulterClassFilter === 'All' || d.class === defaulterClassFilter;
      const matchesDays =
        overdueDaysFilter === 'All' ||
        (overdueDaysFilter === '30' && d.overdueDays >= 30) ||
        (overdueDaysFilter === '60' && d.overdueDays >= 60);

      return matchesClass && matchesDays;
    });
  }, [defaulters, defaulterClassFilter, overdueDaysFilter]);

  // Handler: Toggle Select All
  const handleToggleSelectAll = () => {
    if (selectedDefaulterIds.length === filteredDefaulters.length) {
      setSelectedDefaulterIds([]);
    } else {
      setSelectedDefaulterIds(filteredDefaulters.map(d => d.id));
    }
  };

  // Handler: Toggle Individual Defaulter
  const handleToggleSelectOne = (id: string) => {
    setSelectedDefaulterIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  // Handler: Send Broadcast Reminders
  const handleSendBroadcast = () => {
    const targetCount = selectedDefaulterIds.length > 0 ? selectedDefaulterIds.length : filteredDefaulters.length;
    const targetIds = selectedDefaulterIds.length > 0 ? selectedDefaulterIds : filteredDefaulters.map(d => d.id);
    const channels = [channelPush && 'Push', channelSms && 'SMS', channelWhatsapp && 'WhatsApp']
      .filter(Boolean)
      .join(', ');

    const todayStr = new Date().toISOString().split('T')[0];

    // Update last reminder status for targeted students
    setDefaulters(prev =>
      prev.map(d =>
        targetIds.includes(d.id)
          ? {
              ...d,
              lastReminderSent: `${todayStr} (${channels})`,
              reminderCount: d.reminderCount + 1,
            }
          : d
      )
    );

    setShowBroadcastModal(false);
    setSelectedDefaulterIds([]);
    showToast(
      `Broadcast sent! ${targetCount} parents notified via ${channels}.`,
      'success'
    );
  };

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant', 'Reports & Reminders']} />
          <h1 className="text-[20px] sm:text-[22px] font-bold text-[#17153A] tracking-tight mt-1">
            Financial Reports & Defaulter Reminders
          </h1>
        </div>
      </div>

      {/* Underline Tab Navigation Bar */}
      <Tabs
        tabs={[
          { key: 'reports', label: 'Financial Reports & Day Book', icon: 'solar:chart-2-linear' },
          { key: 'reminders', label: 'Defaulters & Reminders', icon: 'solar:bell-bing-linear', count: defaulters.length },
        ]}
        active={activeSubTab}
        onChange={(val) => setActiveSubTab(val as any)}
      />

      {/* ==================================================================== */}
      {/* VIEW 1: FINANCIAL REPORTS & DAY BOOK */}
      {/* ==================================================================== */}
      {activeSubTab === 'reports' && (
        <div className="space-y-6">
          {/* Sub-navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E2E8F0] pb-1">
            <Tabs
              tabs={[
                { key: 'daybook', label: 'Day Book (Daily Audit)', icon: 'solar:calendar-date-linear' },
                { key: 'classwise', label: 'Class-wise Collection', icon: 'solar:layers-linear' },
                { key: 'headwise', label: 'Fee Head Breakdown', icon: 'solar:tag-linear' },
                { key: 'modewise', label: 'Payment Mode Split', icon: 'solar:card-linear' },
              ]}
              active={reportView}
              onChange={(val) => setReportView(val as any)}
              className="border-b-0"
            />

            <div className="flex items-center gap-2 pb-2 sm:pb-0 shrink-0">
              <button
                type="button"
                onClick={() => showToast('Exported report to Excel (.xlsx)!', 'success')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#17153A] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <Icon name="solar:document-text-linear" size={14} className="text-[#7C612A]" />
                <span>Excel</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Generated high-resolution PDF report!', 'success')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#17153A] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <Icon name="solar:download-minimalistic-linear" size={14} className="text-[#7C612A]" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Report View: DAY BOOK */}
          {reportView === 'daybook' && (
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden space-y-4">
              <div className="px-5 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F8FAFC]">
                <div>
                  <h3 className="font-bold text-[#17153A] text-[16px]">Accountant Day Book — October 29, 2026</h3>
                  <p className="text-[12px] text-[#64748B] mt-0.5">Chronological ledger of cash, UPI, cheques, and gateway collections</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase">Today's Gross Total</span>
                  <p className="text-[20px] font-bold text-[#15803D]">
                    ₹{TODAY_DAYBOOK.reduce((acc, cur) => acc + cur.amount, 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase">Receipt No</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase">Student & Class</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase">Payment Mode</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase text-right">Amount</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase">Time</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase">Received By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {TODAY_DAYBOOK.map((e, idx) => (
                      <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-5 py-3.5 font-mono text-[12px] font-bold text-[#17153A]">{e.receiptNo}</td>
                        <td className="px-5 py-3.5 font-bold text-[#17153A] text-[13px]">
                          {e.studentName} <span className="text-[#64748B] font-normal">({e.class})</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                            {e.mode}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-[#17153A] text-[14px]">
                          ₹{e.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-3.5 text-[12px] text-[#64748B]">{e.time}</td>
                        <td className="px-5 py-3.5 text-[12px] text-[#475569]">{e.cashier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Report View: CLASS-WISE COLLECTION */}
          {reportView === 'classwise' && (
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <h3 className="font-bold text-[#17153A] text-[16px]">Class-wise Fee Collection Summary (Academic Year 2026-27)</h3>
                <p className="text-[12px] text-[#64748B] mt-0.5">Enrollment, billed revenue, collections, and dues breakdown</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase">Standard</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase text-center">Students</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase text-right">Total Billed</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase text-right">Collected</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase text-right">Concessions</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase text-right">Outstanding Due</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase text-center">Collection %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {CLASS_COLLECTION_SUMMARY.map(cls => (
                      <tr key={cls.class} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-5 py-3.5 font-bold text-[#17153A] text-[14px]">{cls.class}</td>
                        <td className="px-5 py-3.5 text-center text-[13px] text-[#475569]">{cls.enrolled}</td>
                        <td className="px-5 py-3.5 text-right font-semibold text-[#17153A] text-[14px]">
                          ₹{cls.totalBilled.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-[#15803D] text-[14px]">
                          ₹{cls.collected.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-3.5 text-right text-[13px] text-[#7C612A]">
                          ₹{cls.concessions.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-[#BE123C] text-[14px]">
                          ₹{cls.due.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                            {cls.percent}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Report View: FEE HEAD BREAKDOWN */}
          {reportView === 'headwise' && (
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <h3 className="font-bold text-[#17153A] text-[16px]">Fee Head Collection Summary</h3>
                <p className="text-[12px] text-[#64748B] mt-0.5">Budgeted vs actual collections across fee categories</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase">Fee Head</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase">Category</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase text-right">Budgeted</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase text-right">Collected</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase text-right">Balance Due</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase text-center">Recovery</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {HEAD_COLLECTION_SUMMARY.map(h => (
                      <tr key={h.head} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-5 py-3.5 font-bold text-[#17153A] text-[14px]">{h.head}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                            {h.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-medium text-[#17153A] text-[14px]">
                          ₹{h.budgeted.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-[#15803D] text-[14px]">
                          ₹{h.collected.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-[#BE123C] text-[14px]">
                          ₹{h.due.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                            {h.percent}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Report View: PAYMENT MODE SPLIT */}
          {reportView === 'modewise' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { mode: 'Online Payment Gateway', amount: 28450000, txns: 1240, percent: 52, icon: 'solar:global-linear' },
                { mode: 'Cash Deposits', amount: 12500000, txns: 580, percent: 23, icon: 'solar:wad-of-money-linear' },
                { mode: 'UPI / Direct Bank Transfer', amount: 9800000, txns: 410, percent: 18, icon: 'solar:qr-code-linear' },
                { mode: 'Cheque & Demand Drafts', amount: 3950000, txns: 120, percent: 7, icon: 'solar:document-text-linear' },
              ].map(m => (
                <div key={m.mode} className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center">
                    <Icon name={m.icon} size={20} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#17153A]">{m.mode}</p>
                    <p className="text-[20px] font-bold text-[#17153A] mt-1">₹{(m.amount / 100000).toFixed(2)} Lakhs</p>
                    <p className="text-[12px] text-[#64748B] mt-0.5">{m.txns} Transactions • {m.percent}% of total</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* VIEW 2: DEFAULTERS & REMINDERS */}
      {/* ==================================================================== */}
      {activeSubTab === 'reminders' && (
        <div className="space-y-5">
          {/* Header Action Bar */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-[17px] font-bold text-[#17153A]">Overdue Defaulters Roster & Broadcast Reminders</h2>
              <p className="text-[12px] text-[#64748B] mt-0.5">
                Send 1-click Push, SMS, or WhatsApp payment links to selected parents
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Icon name="solar:plain-linear" size={16} />
                <span>
                  {selectedDefaulterIds.length > 0
                    ? `Send Reminder to (${selectedDefaulterIds.length}) Selected`
                    : 'Send Broadcast Reminder'}
                </span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 shadow-card-soft flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-[13px] font-semibold text-[#17153A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDefaulterIds.length === filteredDefaulters.length && filteredDefaulters.length > 0}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 rounded text-[#7C612A] accent-[#7C612A] cursor-pointer"
                />
                <span>Select All ({filteredDefaulters.length})</span>
              </label>

              {selectedDefaulterIds.length > 0 && (
                <span className="text-[12px] text-[#7C612A] font-bold bg-[#FAF7F2] px-2.5 py-0.5 rounded-lg border border-[#E8DFC8]">
                  {selectedDefaulterIds.length} Selected
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={defaulterClassFilter}
                onChange={e => setDefaulterClassFilter(e.target.value)}
                className="px-3 py-1.5 text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl text-[#17153A]"
              >
                <option value="All">All Classes</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 5">Class 5</option>
              </select>

              <select
                value={overdueDaysFilter}
                onChange={e => setOverdueDaysFilter(e.target.value)}
                className="px-3 py-1.5 text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl text-[#17153A]"
              >
                <option value="All">All Overdue Days</option>
                <option value="30">&gt; 30 Days Overdue</option>
                <option value="60">&gt; 60 Days Overdue</option>
              </select>
            </div>
          </div>

          {/* Defaulters Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="w-12 px-5 py-3 text-center">#</th>
                    <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase">Student & Parent</th>
                    <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase">Overdue Instalment</th>
                    <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase text-right">Amount Due</th>
                    <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase text-center">Overdue Days</th>
                    <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase">Last Reminder</th>
                    <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase text-right">Direct Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredDefaulters.map(d => (
                    <tr
                      key={d.id}
                      className={`hover:bg-[#F8FAFC] transition-colors ${
                        selectedDefaulterIds.includes(d.id) ? 'bg-[#FAF7F2]' : ''
                      }`}
                    >
                      <td className="px-5 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedDefaulterIds.includes(d.id)}
                          onChange={() => handleToggleSelectOne(d.id)}
                          className="w-4 h-4 rounded text-[#7C612A] accent-[#7C612A] cursor-pointer"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#17153A] text-[14px]">{d.studentName}</p>
                        <p className="text-[12px] text-[#64748B]">
                          {d.class}-{d.section} • {d.grNumber} • Guardian: {d.parentName} ({d.parentPhone})
                        </p>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-[#475569]">
                        <p className="font-semibold text-[#17153A]">{d.overdueInstalment}</p>
                        <p className="text-[11px] text-[#BE123C]">Due Since: {d.dueDate}</p>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-[#BE123C] text-[14px]">
                        ₹{d.totalDue.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
                          +{d.overdueDays} Days
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-[#64748B]">
                        {d.lastReminderSent || 'No reminders sent yet'}
                        {d.reminderCount > 0 && (
                          <span className="block text-[11px] text-[#7C612A] font-semibold">
                            Sent {d.reminderCount} time{d.reminderCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDefaulterIds([d.id]);
                            setShowBroadcastModal(true);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] rounded-lg hover:bg-[#7C612A] hover:text-white transition-all cursor-pointer"
                        >
                          Ping Parent
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: BROADCAST REMINDER */}
      {/* ==================================================================== */}
      <Modal
        open={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        title="Send Fee Reminder Broadcast"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowBroadcastModal(false)}
              className="px-4 py-2 text-[13px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendBroadcast}
              className="px-4 py-2 text-[13px] font-bold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl cursor-pointer"
            >
              Send Broadcast
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Reminder Notice Template"
            required
            value={reminderType}
            onChange={e => {
              const val = e.target.value;
              setReminderType(val);
              if (val === 'Gentle Reminder') {
                setReminderMessage(
                  'Dear Parent, this is a friendly reminder that fee payment for {StudentName} is due shortly. Please ignore if already paid. Pay online: {PaymentLink}'
                );
              } else if (val === 'Overdue 1st Notice') {
                setReminderMessage(
                  'Dear Parent, this is a reminder from Sadvidhya International School that fee instalment of ₹{Amount} for {StudentName} is overdue. Kindly pay via the parent portal or school counter to avoid late fee penalties. Pay online: {PaymentLink}'
                );
              } else {
                setReminderMessage(
                  'URGENT NOTICE: Fee payment for {StudentName} is critically overdue by +60 days. Per school rules, late fine is accruing daily. Kindly settle the outstanding fee immediately via: {PaymentLink}'
                );
              }
            }}
            options={[
              { value: 'Gentle Reminder', label: 'Gentle Upcoming Due Reminder' },
              { value: 'Overdue 1st Notice', label: 'Overdue 1st Notice (Standard)' },
              { value: 'Urgent Final Notice', label: 'Urgent Final Notice (+Late Fine)' },
            ]}
          />

          <div>
            <label className="block text-[13px] font-bold text-[#17153A] mb-1.5">Delivery Channels</label>
            <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <label className="flex items-center gap-2 text-[13px] font-medium text-[#17153A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={channelPush}
                  onChange={e => setChannelPush(e.target.checked)}
                  className="w-4 h-4 rounded text-[#7C612A] accent-[#7C612A]"
                />
                <span>Mobile App Push</span>
              </label>
              <label className="flex items-center gap-2 text-[13px] font-medium text-[#17153A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={channelSms}
                  onChange={e => setChannelSms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#7C612A] accent-[#7C612A]"
                />
                <span>SMS Gateway</span>
              </label>
              <label className="flex items-center gap-2 text-[13px] font-medium text-[#17153A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={channelWhatsapp}
                  onChange={e => setChannelWhatsapp(e.target.checked)}
                  className="w-4 h-4 rounded text-[#7C612A] accent-[#7C612A]"
                />
                <span>WhatsApp Business</span>
              </label>
            </div>
          </div>

          <Textarea
            label="Message Body"
            required
            rows={4}
            value={reminderMessage}
            onChange={e => setReminderMessage(e.target.value)}
          />

          <p className="text-[11px] text-[#64748B]">
            Tags like <code className="text-[#7C612A]">{'{StudentName}'}</code>, <code className="text-[#7C612A]">{'{Amount}'}</code>, and <code className="text-[#7C612A]">{'{PaymentLink}'}</code> will be automatically replaced with each student's personal details.
          </p>
        </div>
      </Modal>
    </div>
  );
}

