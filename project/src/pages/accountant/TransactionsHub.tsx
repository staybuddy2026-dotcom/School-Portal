import { useState, useMemo } from 'react';
import { Icon } from '@/components/Icon';
import { Breadcrumb, Modal, showToast, Select, Input, Textarea, Tabs } from '@/components/ui';
import { generateReceiptPdf } from '@/utils/receiptPdf';

// ============================================================================
// Types
// ============================================================================
export interface ReceiptItem {
  id: string;
  receiptNo: string;
  date: string;
  time: string;
  studentName: string;
  studentId: string;
  grNumber: string;
  class: string;
  section: string;
  rollNumber: string;
  amount: number;
  mode: 'Cash' | 'Cheque' | 'DD' | 'UPI' | 'Bank Transfer' | 'Online Gateway';
  instalment: string;
  status: 'Paid' | 'Cancelled';
  cancelledReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
}

export interface RefundRecord {
  id: string;
  studentName: string;
  studentId: string;
  class: string;
  refundAmount: number;
  category: 'School Leaving Settlement' | 'Excess Payment Adjustment' | 'Transport Cancellation' | 'Caution Money Refund';
  reason: string;
  date: string;
  status: 'Approved' | 'Pending Admin Approval' | 'Rejected';
  approvedBy?: string;
  routedToAdmin: boolean;
}

export interface SettlementAuditRecord {
  id: string;
  settlementRef: string;
  date: string;
  gateway: string;
  grossAmount: number;
  gatewayFee: number;
  gstAmount: number;
  netPayout: number;
  bankUtr: string;
  bankAccount: string;
  status: 'Settled' | 'Pending Settlement' | 'Discrepancy';
  discrepancyNote?: string;
}

// ============================================================================
// Initial Datasets
// ============================================================================
const INITIAL_RECEIPTS: ReceiptItem[] = [
  {
    id: 'rcp-1',
    receiptNo: 'RCP-2026-05401',
    date: '2026-10-29',
    time: '11:15 AM',
    studentName: 'Vihaan Joshi',
    studentId: 'STU-2026-0145',
    grNumber: 'GR-9852',
    class: 'Class 8',
    section: 'A',
    rollNumber: '24',
    amount: 15000,
    mode: 'UPI',
    instalment: 'Instalment 2 (Partial)',
    status: 'Paid',
  },
  {
    id: 'rcp-2',
    receiptNo: 'RCP-2026-05400',
    date: '2026-10-29',
    time: '10:40 AM',
    studentName: 'Diya Patel',
    studentId: 'STU-2026-0143',
    grNumber: 'GR-9835',
    class: 'Class 8',
    section: 'A',
    rollNumber: '12',
    amount: 25000,
    mode: 'Cash',
    instalment: 'Term 2 Final Settlement',
    status: 'Paid',
  },
  {
    id: 'rcp-3',
    receiptNo: 'RCP-2026-05399',
    date: '2026-10-28',
    time: '03:20 PM',
    studentName: 'Ishaan Verma',
    studentId: 'STU-2026-0144',
    grNumber: 'GR-9844',
    class: 'Class 8',
    section: 'A',
    rollNumber: '18',
    amount: 8000,
    mode: 'Cheque',
    instalment: 'Transport Fee Term 2',
    status: 'Paid',
  },
  {
    id: 'rcp-4',
    receiptNo: 'RCP-2026-05398',
    date: '2026-10-28',
    time: '01:10 PM',
    studentName: 'Saanvi Reddy',
    studentId: 'STU-2026-0146',
    grNumber: 'GR-9860',
    class: 'Class 8',
    section: 'A',
    rollNumber: '31',
    amount: 25000,
    mode: 'Online Gateway',
    instalment: 'Instalment 2 Tuition',
    status: 'Paid',
  },
  {
    id: 'rcp-5',
    receiptNo: 'RCP-2026-05395',
    date: '2026-10-27',
    time: '12:05 PM',
    studentName: 'Arjun Nair',
    studentId: 'STU-2026-0148',
    grNumber: 'GR-9865',
    class: 'Class 8',
    section: 'B',
    rollNumber: '09',
    amount: 25000,
    mode: 'Cheque',
    instalment: 'Instalment 2 Tuition',
    status: 'Cancelled',
    cancelledReason: 'Cheque bounced due to signature mismatch (CHQ-104928)',
    cancelledAt: '2026-10-28',
    cancelledBy: 'Suresh Bhat (Accountant)',
  },
  {
    id: 'rcp-6',
    receiptNo: 'RCP-2026-05390',
    date: '2026-10-26',
    time: '11:50 AM',
    studentName: 'Myra Singh',
    studentId: 'STU-2026-0147',
    grNumber: 'GR-9878',
    class: 'Class 8',
    section: 'B',
    rollNumber: '15',
    amount: 25000,
    mode: 'DD',
    instalment: 'Instalment 2 Tuition',
    status: 'Paid',
  },
  {
    id: 'rcp-7',
    receiptNo: 'RCP-2026-05385',
    date: '2026-10-25',
    time: '10:15 AM',
    studentName: 'Aarav Sharma',
    studentId: 'STU-2026-0142',
    grNumber: 'GR-9821',
    class: 'Class 8',
    section: 'A',
    rollNumber: '07',
    amount: 15000,
    mode: 'Bank Transfer',
    instalment: 'Instalment 1 Balance',
    status: 'Paid',
  },
];

const INITIAL_REFUNDS: RefundRecord[] = [
  {
    id: 'ref-1',
    studentName: 'Vihaan Joshi',
    studentId: 'STU-2026-0145',
    class: 'Class 8-A',
    refundAmount: 8000,
    category: 'Transport Cancellation',
    reason: 'Family relocated to walking distance; cancelled school bus service for Term 2 and 3.',
    date: '2026-10-28',
    status: 'Approved',
    approvedBy: 'Suresh Bhat (Accountant)',
    routedToAdmin: false,
  },
  {
    id: 'ref-2',
    studentName: 'Ananya Deshmukh',
    studentId: 'STU-2026-0150',
    class: 'Class 8-B',
    refundAmount: 18000,
    category: 'School Leaving Settlement',
    reason: 'Transfer of father to Bengaluru. Security deposit and advance term fee clearance.',
    date: '2026-10-25',
    status: 'Pending Admin Approval',
    routedToAdmin: true,
  },
  {
    id: 'ref-3',
    studentName: 'Myra Singh',
    studentId: 'STU-2026-0147',
    class: 'Class 8-B',
    refundAmount: 5000,
    category: 'Excess Payment Adjustment',
    reason: 'Double bank debit during online payment portal migration. Verified against bank statement.',
    date: '2026-10-20',
    status: 'Approved',
    approvedBy: 'Principal Dr. R. K. Iyer',
    routedToAdmin: false,
  },
];

const INITIAL_SETTLEMENTS: SettlementAuditRecord[] = [
  {
    id: 'set-1',
    settlementRef: 'SETTLE-20261028-RZP',
    date: '2026-10-28',
    gateway: 'Razorpay PG',
    grossAmount: 145000,
    gatewayFee: 2900,
    gstAmount: 522,
    netPayout: 141578,
    bankUtr: 'AXISCN009218204',
    bankAccount: 'HDFC School Fee A/c •••• 4012',
    status: 'Settled',
  },
  {
    id: 'set-2',
    settlementRef: 'SETTLE-20261027-RZP',
    date: '2026-10-27',
    gateway: 'Razorpay PG',
    grossAmount: 98000,
    gatewayFee: 1960,
    gstAmount: 352,
    netPayout: 95688,
    bankUtr: 'AXISCN008912301',
    bankAccount: 'HDFC School Fee A/c •••• 4012',
    status: 'Settled',
  },
  {
    id: 'set-3',
    settlementRef: 'SETTLE-20261026-BILL',
    date: '2026-10-26',
    gateway: 'BillDesk NetBanking',
    grossAmount: 75000,
    gatewayFee: 1125,
    gstAmount: 202,
    netPayout: 73673,
    bankUtr: 'UTIB0019284102',
    bankAccount: 'SBI School Operations A/c •••• 8821',
    status: 'Settled',
  },
  {
    id: 'set-4',
    settlementRef: 'SETTLE-20261029-RZP',
    date: '2026-10-29',
    gateway: 'Razorpay PG',
    grossAmount: 40000,
    gatewayFee: 800,
    gstAmount: 144,
    netPayout: 39056,
    bankUtr: 'Pending Processing',
    bankAccount: 'HDFC School Fee A/c •••• 4012',
    status: 'Pending Settlement',
  },
];

// ============================================================================
// Component: TransactionsHub
// ============================================================================
interface TransactionsHubProps {
  initialSubTab?: 'receipts' | 'refunds' | 'reconciliation';
}

export function TransactionsHub({ initialSubTab = 'receipts' }: TransactionsHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<'receipts' | 'refunds' | 'reconciliation'>(initialSubTab);

  // Receipts State
  const [receipts, setReceipts] = useState<ReceiptItem[]>(INITIAL_RECEIPTS);
  const [receiptSearchQuery, setReceiptSearchQuery] = useState('');
  const [receiptModeFilter, setReceiptModeFilter] = useState('All');
  const [receiptStatusFilter, setReceiptStatusFilter] = useState('All');
  const [cancelTargetReceipt, setCancelTargetReceipt] = useState<ReceiptItem | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState('');

  // Refunds State
  const [refunds, setRefunds] = useState<RefundRecord[]>(INITIAL_REFUNDS);
  const [showAddRefundModal, setShowAddRefundModal] = useState(false);
  const [refundStudent, setRefundStudent] = useState('Vihaan Joshi (STU-2026-0145 • Class 8-A)');
  const [refundAmountInput, setRefundAmountInput] = useState<number | ''>(5000);
  const [refundCategoryInput, setRefundCategoryInput] = useState<RefundRecord['category']>('Excess Payment Adjustment');
  const [refundReasonInput, setRefundReasonInput] = useState('');

  // Reconciliation State
  const [settlements, setSettlements] = useState<SettlementAuditRecord[]>(INITIAL_SETTLEMENTS);
  const [settlementDateFilter, setSettlementDateFilter] = useState('All');

  // Filtered Receipts
  const filteredReceipts = useMemo(() => {
    return receipts.filter(r => {
      const q = receiptSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.receiptNo.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q) ||
        r.grNumber.toLowerCase().includes(q) ||
        r.class.toLowerCase().includes(q);

      const matchesMode = receiptModeFilter === 'All' || r.mode === receiptModeFilter;
      const matchesStatus = receiptStatusFilter === 'All' || r.status === receiptStatusFilter;

      return matchesSearch && matchesMode && matchesStatus;
    });
  }, [receipts, receiptSearchQuery, receiptModeFilter, receiptStatusFilter]);

  // Handler: Cancel Receipt
  const handleConfirmCancelReceipt = () => {
    if (!cancelTargetReceipt) return;
    if (!cancelReasonInput.trim()) {
      showToast('Please provide a mandatory cancellation reason', 'error');
      return;
    }

    setReceipts(prev =>
      prev.map(r =>
        r.id === cancelTargetReceipt.id
          ? {
            ...r,
            status: 'Cancelled',
            cancelledReason: cancelReasonInput,
            cancelledAt: new Date().toISOString().split('T')[0],
            cancelledBy: 'Suresh Bhat (Accountant)',
          }
          : r
      )
    );

    showToast(`Receipt ${cancelTargetReceipt.receiptNo} marked as CANCELLED. Ledger reversed.`, 'warning');
    setCancelTargetReceipt(null);
    setCancelReasonInput('');
  };

  // Handler: Add Refund Request
  const handleCreateRefundRequest = () => {
    const amount = Number(refundAmountInput) || 0;
    if (amount <= 0) {
      showToast('Please enter a valid refund amount', 'error');
      return;
    }
    if (!refundReasonInput.trim()) {
      showToast('Please state the adjustment reason', 'error');
      return;
    }

    const requiresAdminRouting = amount > 10000;
    const studentParts = refundStudent.split(' (');
    const studentName = studentParts[0] || 'Student';
    const classInfo = studentParts[1]?.replace(')', '') || 'Class 8-A';

    const newRefund: RefundRecord = {
      id: `ref-${Date.now()}`,
      studentName,
      studentId: classInfo.split(' • ')[0] || 'STU-2026-0145',
      class: classInfo.split(' • ')[1] || 'Class 8-A',
      refundAmount: amount,
      category: refundCategoryInput,
      reason: refundReasonInput,
      date: new Date().toISOString().split('T')[0],
      status: requiresAdminRouting ? 'Pending Admin Approval' : 'Approved',
      approvedBy: requiresAdminRouting ? undefined : 'Suresh Bhat (Accountant)',
      routedToAdmin: requiresAdminRouting,
    };

    setRefunds(prev => [newRefund, ...prev]);
    setShowAddRefundModal(false);
    setRefundReasonInput('');

    if (requiresAdminRouting) {
      showToast(
        `Refund of ₹${amount.toLocaleString('en-IN')} exceeds ₹10,000 threshold. Routed to Principal for approval!`,
        'info'
      );
    } else {
      showToast(`Refund of ₹${amount.toLocaleString('en-IN')} approved & recorded!`, 'success');
    }
  };

  // Handler: Approve Refund (for accountant eligible items)
  const handleApproveRefund = (ref: RefundRecord) => {
    setRefunds(prev =>
      prev.map(r =>
        r.id === ref.id
          ? {
            ...r,
            status: 'Approved',
            approvedBy: 'Suresh Bhat (Accountant)',
          }
          : r
      )
    );
    showToast(`Refund for ${ref.studentName} marked as Approved!`, 'success');
  };

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant', 'Transactions & Audit Hub']} />
          <h1 className="text-[20px] sm:text-[22px] font-bold text-[#17153A] tracking-tight mt-1">
            Transactions Hub
          </h1>
        </div>
      </div>

      {/* Underline Tab Navigation Bar */}
      <Tabs
        tabs={[
          { key: 'receipts', label: 'Receipts Repository', icon: 'solar:bill-list-linear', count: receipts.length },
          { key: 'refunds', label: 'Refunds & Adjustments', icon: 'solar:restart-square-linear', count: refunds.filter(r => r.status === 'Pending Admin Approval').length || undefined },
          { key: 'reconciliation', label: 'Bank & Gateway Reconciliation', icon: 'solar:check-read-linear' },
        ]}
        active={activeSubTab}
        onChange={(val) => setActiveSubTab(val as any)}
      />

      {/* ==================================================================== */}
      {/* VIEW 1: RECEIPTS REPOSITORY */}
      {/* ==================================================================== */}
      {activeSubTab === 'receipts' && (
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Icon name="solar:magnifer-linear" size={16} className="absolute left-3.5 top-3 text-[#94A3B8]" />
              <input
                type="text"
                value={receiptSearchQuery}
                onChange={e => setReceiptSearchQuery(e.target.value)}
                placeholder="Search Receipt No, Student Name, or GR..."
                className="w-full pl-9 pr-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[13px] text-[#17153A] focus:bg-[#FFFFFF] focus:outline-none focus:ring-1 focus:ring-[#7C612A]"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={receiptModeFilter}
                onChange={e => setReceiptModeFilter(e.target.value)}
                className="px-3 py-2 text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl text-[#17153A]"
              >
                <option value="All">All Payment Modes</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="DD">Demand Draft</option>
                <option value="UPI">UPI / QR</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Online Gateway">Online Gateway</option>
              </select>

              <select
                value={receiptStatusFilter}
                onChange={e => setReceiptStatusFilter(e.target.value)}
                className="px-3 py-2 text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl text-[#17153A]"
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid / Valid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Receipts Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Receipt No.</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student Name</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Payment Mode</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Date & Time</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredReceipts.map(r => (
                    <tr key={r.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-4 font-mono text-[13px] font-bold text-[#17153A]">{r.receiptNo}</td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#17153A] text-[14px]">{r.studentName}</p>
                        <p className="text-[12px] text-[#64748B]">
                          {r.class}-{r.section} • {r.grNumber} • {r.instalment}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-[#17153A] text-[14px]">
                        ₹{r.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                          {r.mode}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-[#64748B]">
                        {r.date} <span className="text-[11px] text-[#94A3B8]">{r.time}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold ${r.status === 'Paid'
                            ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                            : 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]'
                            }`}
                        >
                          {r.status}
                        </span>
                        {r.cancelledReason && (
                          <p className="text-[10px] text-[#BE123C] mt-0.5 max-w-xs truncate" title={r.cancelledReason}>
                            {r.cancelledReason}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          {/* Download Original PDF */}
                          <button
                            type="button"
                            onClick={() => {
                              generateReceiptPdf({
                                receiptNo: r.receiptNo,
                                date: r.date,
                                time: r.time,
                                mode: r.mode,
                                amount: r.amount,
                                studentName: r.studentName,
                                class: r.class,
                                section: r.section,
                                rollNumber: r.rollNumber,
                                grNo: r.grNumber,
                                academicYear: '2026-2027',
                                instalment: r.instalment,
                                status: r.status === 'Paid' ? 'PAID' : 'CANCELLED',
                              });
                              showToast(`Official Receipt ${r.receiptNo}.pdf downloaded!`, 'success');
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] rounded-lg hover:bg-[#7C612A] hover:text-white transition-all cursor-pointer"
                          >
                            PDF
                          </button>

                          {/* Reprint Duplicate Voucher */}
                          <button
                            type="button"
                            onClick={() => {
                              generateReceiptPdf({
                                receiptNo: r.receiptNo,
                                date: r.date,
                                time: r.time,
                                mode: r.mode,
                                amount: r.amount,
                                studentName: r.studentName,
                                class: r.class,
                                section: r.section,
                                rollNumber: r.rollNumber,
                                grNo: r.grNumber,
                                academicYear: '2026-2027',
                                instalment: `${r.instalment} (Duplicate Copy)`,
                                status: r.status === 'Paid' ? 'PAID' : 'CANCELLED',
                              });
                              showToast(`Reprinted Fee Receipt ${r.receiptNo}.pdf downloaded!`, 'success');
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#17153A] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                          >
                            Reprint
                          </button>

                          {/* Cancel Receipt Button */}
                          {r.status === 'Paid' && (
                            <button
                              type="button"
                              onClick={() => {
                                setCancelTargetReceipt(r);
                                setCancelReasonInput('');
                              }}
                              className="px-2 py-1 text-[11px] font-semibold text-[#BE123C] hover:bg-[#FFF1F2] rounded-lg transition-colors cursor-pointer"
                              title="Cancel Receipt"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
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
      {/* VIEW 2: REFUNDS & ADJUSTMENTS */}
      {/* ==================================================================== */}
      {activeSubTab === 'refunds' && (
        <div className="space-y-5">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-bold text-[#17153A]">Fee Refunds & Excess Balance Adjustments</h2>
              <p className="text-[12px] text-[#64748B] mt-0.5">
                School leaving settlements, caution money refunds, and transport fee reversals
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddRefundModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
            >
              <Icon name="solar:add-circle-linear" size={16} />
              <span>Record Refund Request</span>
            </button>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student Details</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Category</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Refund Amount</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Reason & Notes</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Request Date</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {refunds.map(rf => (
                    <tr key={rf.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#17153A] text-[14px]">{rf.studentName}</p>
                        <p className="text-[12px] text-[#64748B]">{rf.studentId} • {rf.class}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                          {rf.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-[#BE123C] text-[14px]">
                        ₹{rf.refundAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-[#475569] max-w-xs">{rf.reason}</td>
                      <td className="px-5 py-4 text-[13px] text-[#64748B]">{rf.date}</td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold ${rf.status === 'Approved'
                            ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                            : rf.status === 'Rejected'
                              ? 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]'
                              : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                            }`}
                        >
                          {rf.status}
                        </span>
                        {rf.routedToAdmin && (
                          <p className="text-[10px] text-[#B45309] font-medium mt-0.5">Admin approval required</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {rf.status === 'Pending Admin Approval' && !rf.routedToAdmin ? (
                          <button
                            type="button"
                            onClick={() => handleApproveRefund(rf)}
                            className="px-3 py-1 text-[11px] font-bold text-white bg-[#15803D] hover:bg-[#166534] rounded-lg transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-[12px] text-[#94A3B8]">{rf.approvedBy || 'In Review'}</span>
                        )}
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
      {/* VIEW 3: GATEWAY SETTLEMENT & RECONCILIATION */}
      {/* ==================================================================== */}
      {activeSubTab === 'reconciliation' && (
        <div className="space-y-6">
          {/* Reconciliation KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Gross Settlement</span>
              <p className="text-[24px] font-bold text-[#17153A] mt-1">₹3.58 L</p>
              <span className="text-[11px] text-[#64748B]">Last 7 days online collections</span>
            </div>
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Gateway Fees + GST</span>
              <p className="text-[24px] font-bold text-[#BE123C] mt-1">₹7,963</p>
              <span className="text-[11px] text-[#64748B]">Platform service charges (2% + 18%)</span>
            </div>
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Net Bank Payout</span>
              <p className="text-[24px] font-bold text-[#15803D] mt-1">₹3.50 L</p>
              <span className="text-[11px] text-[#15803D] font-medium">Credited to HDFC Fee A/c</span>
            </div>
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Audit Discrepancies</span>
              <p className="text-[24px] font-bold text-[#15803D] mt-1">0</p>
              <span className="text-[11px] text-[#15803D] font-medium">100% reconciliation match</span>
            </div>
          </div>

          {/* Daily Settlement Report Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F8FAFC]">
              <div>
                <h3 className="font-bold text-[#17153A] text-[16px]">Daily Payment Gateway Settlement Audit</h3>
                <p className="text-[12px] text-[#64748B] mt-0.5">Matched settlement ledger vs actual bank payouts</p>
              </div>

              <button
                type="button"
                onClick={() => showToast('Reconciliation Audit Statement exported to Excel!', 'success')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#17153A] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <Icon name="solar:download-minimalistic-linear" size={14} className="text-[#7C612A]" />
                <span>Export Audit Statement</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Settlement Ref</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Date & Gateway</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Gross Total</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Fee + GST</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Net Credited</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Bank Reference / UTR</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {settlements.map(st => (
                    <tr key={st.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-4 font-mono text-[13px] font-bold text-[#17153A]">{st.settlementRef}</td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#17153A] text-[13px]">{st.date}</p>
                        <p className="text-[11px] text-[#64748B]">{st.gateway}</p>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-[#17153A] text-[14px]">
                        ₹{st.grossAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-right text-[13px] text-[#BE123C]">
                        ₹{(st.gatewayFee + st.gstAmount).toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-[#15803D] text-[14px]">
                        ₹{st.netPayout.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-[12px]">
                        <p className="font-mono text-[#475569]">{st.bankUtr}</p>
                        <p className="text-[11px] text-[#64748B]">{st.bankAccount}</p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold ${st.status === 'Settled'
                            ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                            : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                            }`}
                        >
                          {st.status}
                        </span>
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
      {/* MODAL: CANCEL RECEIPT */}
      {/* ==================================================================== */}
      <Modal
        open={Boolean(cancelTargetReceipt)}
        onClose={() => setCancelTargetReceipt(null)}
        title="Cancel Official Fee Receipt"
        footer={
          <>
            <button
              type="button"
              onClick={() => setCancelTargetReceipt(null)}
              className="px-4 py-2 text-[13px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] cursor-pointer"
            >
              Keep Valid
            </button>
            <button
              type="button"
              onClick={handleConfirmCancelReceipt}
              className="px-4 py-2 text-[13px] font-bold text-white bg-[#BE123C] hover:bg-[#9F1239] rounded-xl cursor-pointer"
            >
              Confirm Cancellation & Reverse Ledger
            </button>
          </>
        }
      >
        {cancelTargetReceipt && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3]">
              <p className="text-[13px] font-bold text-[#BE123C]">
                Receipt {cancelTargetReceipt.receiptNo} • ₹{cancelTargetReceipt.amount.toLocaleString('en-IN')}
              </p>
              <p className="text-[12px] text-[#64748B] mt-0.5">
                Student: {cancelTargetReceipt.studentName} ({cancelTargetReceipt.class}) • Mode: {cancelTargetReceipt.mode}
              </p>
            </div>

            <Textarea
              label="Mandatory Reason for Cancellation"
              required
              rows={3}
              value={cancelReasonInput}
              onChange={e => setCancelReasonInput(e.target.value)}
              placeholder="State reason: e.g. Cheque dishonoured, incorrect payment head entered, or duplicate cashier transaction..."
            />

            <p className="text-[11px] text-[#64748B]">
              Cancelling this receipt will invalidate the PDF voucher, reverse the student's payment allocation, and log an audit entry under your accountant credentials.
            </p>
          </div>
        )}
      </Modal>

      {/* ==================================================================== */}
      {/* MODAL: RECORD REFUND REQUEST */}
      {/* ==================================================================== */}
      <Modal
        open={showAddRefundModal}
        onClose={() => setShowAddRefundModal(false)}
        title="Record Fee Refund / Adjustment"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowAddRefundModal(false)}
              className="px-4 py-2 text-[13px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateRefundRequest}
              className="px-4 py-2 text-[13px] font-bold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl cursor-pointer"
            >
              Submit Refund Request
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Student"
            required
            value={refundStudent}
            onChange={e => setRefundStudent(e.target.value)}
            options={[
              { value: 'Vihaan Joshi (STU-2026-0145 • Class 8-A)', label: 'Vihaan Joshi (STU-2026-0145 • Class 8-A)' },
              { value: 'Myra Singh (STU-2026-0147 • Class 8-B)', label: 'Myra Singh (STU-2026-0147 • Class 8-B)' },
              { value: 'Ananya Deshmukh (STU-2026-0150 • Class 8-B)', label: 'Ananya Deshmukh (STU-2026-0150 • Class 8-B)' },
              { value: 'Aarav Sharma (STU-2026-0142 • Class 8-A)', label: 'Aarav Sharma (STU-2026-0142 • Class 8-A)' },
            ]}
          />

          <Select
            label="Adjustment Category"
            required
            value={refundCategoryInput}
            onChange={e => setRefundCategoryInput(e.target.value as any)}
            options={[
              { value: 'Excess Payment Adjustment', label: 'Excess Payment Adjustment' },
              { value: 'School Leaving Settlement', label: 'School Leaving Settlement' },
              { value: 'Transport Cancellation', label: 'Transport Cancellation' },
              { value: 'Caution Money Refund', label: 'Caution Money Refund' },
            ]}
          />

          <Input
            label="Refund Amount (₹)"
            type="number"
            required
            value={refundAmountInput}
            onChange={e => setRefundAmountInput(e.target.value === '' ? '' : Number(e.target.value))}
          />

          <Textarea
            label="Reason for Refund / Adjustment"
            required
            rows={3}
            value={refundReasonInput}
            onChange={e => setRefundReasonInput(e.target.value)}
            placeholder="Details of student settlement or adjustment..."
          />

          <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center gap-2">
            <Icon name="solar:danger-triangle-linear" size={16} className="text-[#B45309] shrink-0" />
            <span className="text-[12px] text-[#B45309] font-medium">
              Note: Refund requests exceeding ₹10,000 are automatically routed to the Principal / School Admin for approval.
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

