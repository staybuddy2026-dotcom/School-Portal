import { useState, useMemo } from 'react';
import { Icon } from '@/components/Icon';
import { Breadcrumb, Modal, showToast, Select, Input, Tabs } from '@/components/ui';
import { generateReceiptPdf } from '@/utils/receiptPdf';
import { studentPhotos } from '@/data';

// ============================================================================
// Types
// ============================================================================
export interface CounterStudent {
  id: string;
  studentId: string;
  grNumber: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  photo?: string;
  parentName: string;
  parentPhone: string;
  totalFee: number;
  paidSoFar: number;
  dueAmount: number;
  tuitionDue: number;
  transportDue: number;
  transportRoute: string;
  transportStop: string;
  lateFeeDue: number;
  activeInstalmentName: string;
}

export interface CollectionRecord {
  id: string;
  receiptNo: string;
  date: string;
  time: string;
  studentName: string;
  studentId: string;
  class: string;
  amount: number;
  mode: 'Cash' | 'Cheque' | 'DD' | 'UPI' | 'Bank Transfer' | 'Online Gateway';
  referenceNo?: string;
  bankName?: string;
  instalment: string;
  status: 'Collected' | 'Cleared' | 'Pending Clearance' | 'Bounced';
  receivedBy: string;
  notes?: string;
}

export interface OnlineGatewayTxn {
  id: string;
  txnId: string;
  gateway: string;
  date: string;
  time: string;
  studentName: string;
  studentId: string;
  class: string;
  amount: number;
  matchedInstalment: string;
  status: 'Matched' | 'Unmatched' | 'Failed';
  failureReason?: string;
  paymentMethod: string;
}

export interface ChequeRecord {
  id: string;
  receiptNo: string;
  studentName: string;
  class: string;
  chequeNo: string;
  bankName: string;
  branch: string;
  amount: number;
  issueDate: string;
  depositDate: string;
  status: 'Pending Clearance' | 'Cleared' | 'Bounced';
  bounceReason?: string;
  bouncePenalty?: number;
}

export interface TransportFeeRecord {
  id: string;
  studentName: string;
  studentId: string;
  class: string;
  route: string;
  stop: string;
  vehicleNo: string;
  annualFee: number;
  paid: number;
  due: number;
  status: 'Paid' | 'Partially Paid' | 'Due' | 'Overdue';
}

// ============================================================================
// Mock Dataset for Fee Collection Hub
// ============================================================================
const INITIAL_STUDENTS: CounterStudent[] = [
  {
    id: 's1',
    studentId: 'STU-2026-0142',
    grNumber: 'GR-9821',
    name: 'Aarav Sharma',
    class: 'Class 8',
    section: 'A',
    rollNumber: '07',
    photo: studentPhotos['Aarav Sharma'],
    parentName: 'Rajesh Sharma',
    parentPhone: '+91 98765 43210',
    totalFee: 98000,
    paidSoFar: 48000,
    dueAmount: 45000,
    tuitionDue: 31000,
    transportDue: 8000,
    transportRoute: 'Route 3 - Kothrud Express',
    transportStop: 'Karve Statue, Kothrud',
    lateFeeDue: 500,
    activeInstalmentName: 'Instalment 2 (Term 2 Tuition)',
  },
  {
    id: 's2',
    studentId: 'STU-2026-0143',
    grNumber: 'GR-9835',
    name: 'Diya Patel',
    class: 'Class 8',
    section: 'A',
    rollNumber: '12',
    photo: studentPhotos['Diya Patel'],
    parentName: 'Hardik Patel',
    parentPhone: '+91 98220 54123',
    totalFee: 98000,
    paidSoFar: 98000,
    dueAmount: 0,
    tuitionDue: 0,
    transportDue: 0,
    transportRoute: 'Route 1 - Camp / Station',
    transportStop: 'Pune Station Circle',
    lateFeeDue: 0,
    activeInstalmentName: 'All Dues Cleared',
  },
  {
    id: 's3',
    studentId: 'STU-2026-0144',
    grNumber: 'GR-9844',
    name: 'Ishaan Verma',
    class: 'Class 8',
    section: 'A',
    rollNumber: '18',
    photo: studentPhotos['Ishaan Verma'],
    parentName: 'Manish Verma',
    parentPhone: '+91 97654 32109',
    totalFee: 98000,
    paidSoFar: 33000,
    dueAmount: 65000,
    tuitionDue: 33000,
    transportDue: 9000,
    transportRoute: 'Route 5 - Baner / Wakad',
    transportStop: 'Baner High Street',
    lateFeeDue: 750,
    activeInstalmentName: 'Instalment 2 (Term 2 Tuition)',
  },
  {
    id: 's4',
    studentId: 'STU-2026-0145',
    grNumber: 'GR-9852',
    name: 'Vihaan Joshi',
    class: 'Class 8',
    section: 'A',
    rollNumber: '24',
    photo: studentPhotos['Vihaan Joshi'],
    parentName: 'Sanjay Joshi',
    parentPhone: '+91 98901 23456',
    totalFee: 98000,
    paidSoFar: 66000,
    dueAmount: 32000,
    tuitionDue: 32000,
    transportDue: 0,
    transportRoute: 'Self Commute / Walking',
    transportStop: 'N/A',
    lateFeeDue: 0,
    activeInstalmentName: 'Instalment 3 (Term 3 & Final Exam)',
  },
  {
    id: 's5',
    studentId: 'STU-2026-0146',
    grNumber: 'GR-9860',
    name: 'Saanvi Reddy',
    class: 'Class 8',
    section: 'A',
    rollNumber: '31',
    photo: studentPhotos['Saanvi Reddy'],
    parentName: 'Venkat Reddy',
    parentPhone: '+91 98812 34567',
    totalFee: 98000,
    paidSoFar: 33000,
    dueAmount: 65000,
    tuitionDue: 33000,
    transportDue: 8000,
    transportRoute: 'Route 4 - Hadapsar / Magarpatta',
    transportStop: 'Magarpatta South Gate',
    lateFeeDue: 500,
    activeInstalmentName: 'Instalment 2 (Overdue)',
  },
  {
    id: 's6',
    studentId: 'STU-2026-0147',
    grNumber: 'GR-9878',
    name: 'Myra Singh',
    class: 'Class 8',
    section: 'B',
    rollNumber: '15',
    photo: studentPhotos['Myra Singh'],
    parentName: 'Gurpreet Singh',
    parentPhone: '+91 98234 56789',
    totalFee: 98000,
    paidSoFar: 48000,
    dueAmount: 50000,
    tuitionDue: 31000,
    transportDue: 9000,
    transportRoute: 'Route 2 - Aundh / SB Road',
    transportStop: 'Bremen Chowk, Aundh',
    lateFeeDue: 250,
    activeInstalmentName: 'Instalment 2 (Term 2 Tuition)',
  },
];

const INITIAL_COLLECTIONS: CollectionRecord[] = [
  {
    id: 'col-1',
    receiptNo: 'RCP-2026-05401',
    date: '2026-10-29',
    time: '11:15 AM',
    studentName: 'Vihaan Joshi',
    studentId: 'STU-2026-0145',
    class: 'Class 8-A',
    amount: 15000,
    mode: 'UPI',
    referenceNo: 'UPI-20261029-9831',
    instalment: 'Instalment 2 (Partial)',
    status: 'Collected',
    receivedBy: 'Suresh Bhat (Cashier)',
    notes: 'Partial payment received via Google Pay QR',
  },
  {
    id: 'col-2',
    receiptNo: 'RCP-2026-05400',
    date: '2026-10-29',
    time: '10:40 AM',
    studentName: 'Diya Patel',
    studentId: 'STU-2026-0143',
    class: 'Class 8-A',
    amount: 25000,
    mode: 'Cash',
    instalment: 'Term 2 Final Settlement',
    status: 'Collected',
    receivedBy: 'Suresh Bhat (Cashier)',
    notes: 'Counter cash deposit with stamp',
  },
  {
    id: 'col-3',
    receiptNo: 'RCP-2026-05399',
    date: '2026-10-28',
    time: '03:20 PM',
    studentName: 'Ishaan Verma',
    studentId: 'STU-2026-0144',
    class: 'Class 8-A',
    amount: 8000,
    mode: 'Cheque',
    referenceNo: 'CHQ-884129',
    bankName: 'HDFC Bank',
    instalment: 'Transport Fee Term 2',
    status: 'Cleared',
    receivedBy: 'Suresh Bhat (Cashier)',
  },
  {
    id: 'col-4',
    receiptNo: 'RCP-2026-05395',
    date: '2026-10-27',
    time: '12:05 PM',
    studentName: 'Arjun Nair',
    studentId: 'STU-2026-0148',
    class: 'Class 8-B',
    amount: 25000,
    mode: 'Cheque',
    referenceNo: 'CHQ-104928',
    bankName: 'Axis Bank',
    instalment: 'Instalment 2 Tuition',
    status: 'Bounced',
    receivedBy: 'Suresh Bhat (Cashier)',
    notes: 'Cheque bounced due to signature mismatch. Penalty ₹500 applied.',
  },
  {
    id: 'col-5',
    receiptNo: 'RCP-2026-05390',
    date: '2026-10-26',
    time: '11:50 AM',
    studentName: 'Myra Singh',
    studentId: 'STU-2026-0147',
    class: 'Class 8-B',
    amount: 25000,
    mode: 'DD',
    referenceNo: 'DD-004921',
    bankName: 'State Bank of India',
    instalment: 'Instalment 2 Tuition',
    status: 'Collected',
    receivedBy: 'Suresh Bhat (Cashier)',
  },
];

const INITIAL_GATEWAY_TXNS: OnlineGatewayTxn[] = [
  {
    id: 'og-1',
    txnId: 'pay_Nz820kd91aLkM',
    gateway: 'Razorpay',
    date: '2026-10-29',
    time: '12:02 PM',
    studentName: 'Aarav Sharma',
    studentId: 'STU-2026-0142',
    class: 'Class 8-A',
    amount: 15000,
    matchedInstalment: 'Instalment 2 (Tuition)',
    status: 'Matched',
    paymentMethod: 'UPI (PhonePe)',
  },
  {
    id: 'og-2',
    txnId: 'pay_NzgK9012a9jK',
    gateway: 'Razorpay',
    date: '2026-10-29',
    time: '11:18 AM',
    studentName: 'Saanvi Reddy',
    studentId: 'STU-2026-0146',
    class: 'Class 8-A',
    amount: 25000,
    matchedInstalment: 'Instalment 2 (Full)',
    status: 'Matched',
    paymentMethod: 'NetBanking (HDFC)',
  },
  {
    id: 'og-3',
    txnId: 'pay_Ny1094kd03kL',
    gateway: 'Razorpay',
    date: '2026-10-29',
    time: '09:45 AM',
    studentName: 'Ananya Deshmukh',
    studentId: 'STU-2026-0150',
    class: 'Class 8-B',
    amount: 25000,
    matchedInstalment: 'Pending Verification',
    status: 'Unmatched',
    paymentMethod: 'Credit Card (ICICI)',
  },
  {
    id: 'og-4',
    txnId: 'pay_Nx0941kd29Lz',
    gateway: 'Razorpay',
    date: '2026-10-28',
    time: '04:12 PM',
    studentName: 'Ishaan Verma',
    studentId: 'STU-2026-0144',
    class: 'Class 8-A',
    amount: 10000,
    matchedInstalment: 'None',
    status: 'Failed',
    failureReason: 'Bank Server Timeout / Insufficient Funds',
    paymentMethod: 'Debit Card (SBI)',
  },
];

const INITIAL_CHEQUES: ChequeRecord[] = [
  {
    id: 'chq-1',
    receiptNo: 'RCP-2026-05399',
    studentName: 'Ishaan Verma',
    class: 'Class 8-A',
    chequeNo: '884129',
    bankName: 'HDFC Bank',
    branch: 'Kothrud Branch, Pune',
    amount: 8000,
    issueDate: '2026-10-24',
    depositDate: '2026-10-26',
    status: 'Cleared',
  },
  {
    id: 'chq-2',
    receiptNo: 'RCP-2026-05404',
    studentName: 'Aarav Sharma',
    class: 'Class 8-A',
    chequeNo: '445901',
    bankName: 'ICICI Bank',
    branch: 'Shivajinagar Branch',
    amount: 16000,
    issueDate: '2026-10-27',
    depositDate: '2026-10-28',
    status: 'Pending Clearance',
  },
  {
    id: 'chq-3',
    receiptNo: 'RCP-2026-05395',
    studentName: 'Arjun Nair',
    class: 'Class 8-B',
    chequeNo: '104928',
    bankName: 'Axis Bank',
    branch: 'Camp Branch, Pune',
    amount: 25000,
    issueDate: '2026-10-22',
    depositDate: '2026-10-24',
    status: 'Bounced',
    bounceReason: 'Signature mismatch / Insufficient Balance',
    bouncePenalty: 500,
  },
];

const INITIAL_TRANSPORT_FEES: TransportFeeRecord[] = [
  {
    id: 'tr-1',
    studentName: 'Aarav Sharma',
    studentId: 'STU-2026-0142',
    class: 'Class 8-A',
    route: 'Route 3 - Kothrud Express',
    stop: 'Karve Statue',
    vehicleNo: 'MH-12-BQ-4012',
    annualFee: 16000,
    paid: 8000,
    due: 8000,
    status: 'Partially Paid',
  },
  {
    id: 'tr-2',
    studentName: 'Diya Patel',
    studentId: 'STU-2026-0143',
    class: 'Class 8-A',
    route: 'Route 1 - Camp / Station',
    stop: 'Pune Station Circle',
    vehicleNo: 'MH-12-BQ-4001',
    annualFee: 14000,
    paid: 14000,
    due: 0,
    status: 'Paid',
  },
  {
    id: 'tr-3',
    studentName: 'Ishaan Verma',
    studentId: 'STU-2026-0144',
    class: 'Class 8-A',
    route: 'Route 5 - Baner / Wakad',
    stop: 'Baner High Street',
    vehicleNo: 'MH-12-BQ-4015',
    annualFee: 18000,
    paid: 9000,
    due: 9000,
    status: 'Due',
  },
  {
    id: 'tr-4',
    studentName: 'Saanvi Reddy',
    studentId: 'STU-2026-0146',
    class: 'Class 8-A',
    route: 'Route 4 - Hadapsar',
    stop: 'Magarpatta South Gate',
    vehicleNo: 'MH-12-BQ-4018',
    annualFee: 16000,
    paid: 8000,
    due: 8000,
    status: 'Overdue',
  },
  {
    id: 'tr-5',
    studentName: 'Myra Singh',
    studentId: 'STU-2026-0147',
    class: 'Class 8-B',
    route: 'Route 2 - Aundh / SB Road',
    stop: 'Bremen Chowk',
    vehicleNo: 'MH-12-BQ-4008',
    annualFee: 18000,
    paid: 9000,
    due: 9000,
    status: 'Due',
  },
];

// ============================================================================
// Component: FeeCollectionHub
// ============================================================================
interface FeeCollectionHubProps {
  initialSubTab?: 'pos' | 'online' | 'cheques' | 'transport';
}

export function FeeCollectionHub({ initialSubTab = 'pos' }: FeeCollectionHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<'pos' | 'online' | 'cheques' | 'transport'>(initialSubTab);

  // Cashier State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<CounterStudent | null>(INITIAL_STUDENTS[0]);
  const [collections, setCollections] = useState<CollectionRecord[]>(INITIAL_COLLECTIONS);

  // Fee Selection Checklist State
  const [payTuition, setPayTuition] = useState(true);
  const [customTuitionAmount, setCustomTuitionAmount] = useState<number | ''>(25000);
  const [payTransport, setPayTransport] = useState(false);
  const [payLateFee, setPayLateFee] = useState(true);
  const [applyConcession, setApplyConcession] = useState(false);
  const [concessionType, setConcessionType] = useState('Sibling Discount');
  const [concessionValue, setConcessionValue] = useState<number>(2000);
  const [concessionReason, setConcessionReason] = useState('Sibling enrolled in Class 5');
  const [waiveLateFee, setWaiveLateFee] = useState(false);
  const [waiveReason, setWaiveReason] = useState('');

  // Payment Mode & Instrument Details
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Cheque' | 'DD' | 'UPI' | 'Bank Transfer'>('Cash');
  const [chequeNo, setChequeNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [chequeDate, setChequeDate] = useState('2026-10-29');
  const [ddNo, setDdNo] = useState('');
  const [upiRefNo, setUpiRefNo] = useState('');
  const [cashierRemarks, setCashierRemarks] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Online Gateway State
  const [gatewayTxns, setGatewayTxns] = useState<OnlineGatewayTxn[]>(INITIAL_GATEWAY_TXNS);
  const [gatewayFilterStatus, setGatewayFilterStatus] = useState<string>('All');
  const [matchingTxn, setMatchingTxn] = useState<OnlineGatewayTxn | null>(null);
  const [manualMatchStudentId, setManualMatchStudentId] = useState('');
  const [manualMatchInstalment, setManualMatchInstalment] = useState('Instalment 2');

  // Cheque Register State
  const [cheques, setCheques] = useState<ChequeRecord[]>(INITIAL_CHEQUES);
  const [chequeFilterStatus, setChequeFilterStatus] = useState<string>('All');
  const [bounceModalCheque, setBounceModalCheque] = useState<ChequeRecord | null>(null);
  const [bounceReasonInput, setBounceReasonInput] = useState('Insufficient Funds');
  const [bouncePenaltyInput, setBouncePenaltyInput] = useState<number>(500);

  // Transport Register State
  const [transportRecords, setTransportRecords] = useState<TransportFeeRecord[]>(INITIAL_TRANSPORT_FEES);
  const [transportRouteFilter, setTransportRouteFilter] = useState('All');

  // Filtered Student List for Search Dropdown
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return INITIAL_STUDENTS.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.grNumber.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.class.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Net Calculation on Cashier Counter
  const baseTuition = payTuition ? (Number(customTuitionAmount) || 0) : 0;
  const baseTransport = payTransport && selectedStudent ? selectedStudent.transportDue : 0;
  const calculatedLateFee = payLateFee && selectedStudent && !waiveLateFee ? selectedStudent.lateFeeDue : 0;
  const discountAmount = applyConcession ? Number(concessionValue) || 0 : 0;
  const grossPayable = baseTuition + baseTransport + calculatedLateFee;
  const netCollectAmount = Math.max(0, grossPayable - discountAmount);

  // Handler: Select Student
  const handleSelectStudent = (student: CounterStudent) => {
    setSelectedStudent(student);
    setSearchQuery('');
    setPayTuition(student.tuitionDue > 0);
    setCustomTuitionAmount(student.tuitionDue > 0 ? Math.min(25000, student.tuitionDue) : 0);
    setPayTransport(student.transportDue > 0);
    setPayLateFee(student.lateFeeDue > 0);
    setWaiveLateFee(false);
  };

  // Handler: Record & Generate Receipt
  const handleRecordPayment = () => {
    if (!selectedStudent) {
      showToast('Please select a student first', 'error');
      return;
    }
    if (netCollectAmount <= 0) {
      showToast('Collection amount must be greater than ₹0', 'error');
      return;
    }
    if (paymentMode === 'Cheque' && !chequeNo) {
      showToast('Please enter the Cheque Number', 'error');
      return;
    }
    if (paymentMode === 'DD' && !ddNo) {
      showToast('Please enter the Demand Draft Number', 'error');
      return;
    }

    setIsProcessingPayment(true);

    const receiptNo = `RCP-2026-${String(collections.length + 5402).padStart(5, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newRecord: CollectionRecord = {
      id: `col-${Date.now()}`,
      receiptNo,
      date: today,
      time: timeNow,
      studentName: selectedStudent.name,
      studentId: selectedStudent.studentId,
      class: `${selectedStudent.class}-${selectedStudent.section}`,
      amount: netCollectAmount,
      mode: paymentMode,
      referenceNo: paymentMode === 'Cheque' ? chequeNo : paymentMode === 'DD' ? ddNo : upiRefNo || undefined,
      bankName: paymentMode === 'Cheque' || paymentMode === 'DD' ? bankName : undefined,
      instalment: selectedStudent.activeInstalmentName,
      status: paymentMode === 'Cheque' ? 'Pending Clearance' : 'Collected',
      receivedBy: 'Suresh Bhat (Accountant)',
      notes: cashierRemarks || (applyConcession ? `${concessionType} of ₹${discountAmount} applied.` : undefined),
    };

    // If cheque, add to cheque clearance register
    if (paymentMode === 'Cheque') {
      const newCheque: ChequeRecord = {
        id: `chq-${Date.now()}`,
        receiptNo,
        studentName: selectedStudent.name,
        class: `${selectedStudent.class}-${selectedStudent.section}`,
        chequeNo: chequeNo || 'CHQ-UNKNOWN',
        bankName: bankName || 'Bank of Maharashtra',
        branch: branchName || 'Main Branch',
        amount: netCollectAmount,
        issueDate: chequeDate,
        depositDate: today,
        status: 'Pending Clearance',
      };
      setCheques(prev => [newCheque, ...prev]);
    }

    // Auto-generate official PDF voucher
    generateReceiptPdf({
      receiptNo,
      date: today,
      time: timeNow,
      mode: paymentMode,
      amount: netCollectAmount,
      studentName: selectedStudent.name,
      class: selectedStudent.class,
      section: selectedStudent.section,
      rollNumber: selectedStudent.rollNumber,
      grNo: selectedStudent.grNumber,
      fatherName: selectedStudent.parentName,
      academicYear: '2026-2027',
      instalment: selectedStudent.activeInstalmentName,
      status: 'PAID',
      concession: discountAmount,
      balanceDue: Math.max(0, selectedStudent.dueAmount - netCollectAmount),
      items: [
        ...(payTuition ? [{ description: selectedStudent.activeInstalmentName, amount: Number(customTuitionAmount) || 0 }] : []),
        ...(payTransport ? [{ description: `Transport Fee (${selectedStudent.transportRoute})`, amount: selectedStudent.transportDue }] : []),
        ...(payLateFee && !waiveLateFee ? [{ description: 'Late Payment Fee / Surcharge', amount: selectedStudent.lateFeeDue }] : []),
      ],
      paymentRemarks: cashierRemarks,
    });

    setCollections(prev => [newRecord, ...prev]);

    // Update selected student outstanding state
    setSelectedStudent(prev => {
      if (!prev) return null;
      const newPaid = prev.paidSoFar + netCollectAmount;
      const newDue = Math.max(0, prev.dueAmount - netCollectAmount);
      return {
        ...prev,
        paidSoFar: newPaid,
        dueAmount: newDue,
        tuitionDue: payTuition ? Math.max(0, prev.tuitionDue - (Number(customTuitionAmount) || 0)) : prev.tuitionDue,
        transportDue: payTransport ? 0 : prev.transportDue,
        lateFeeDue: payLateFee ? 0 : prev.lateFeeDue,
      };
    });

    // Reset cashier form inputs
    setChequeNo('');
    setBankName('');
    setBranchName('');
    setDdNo('');
    setUpiRefNo('');
    setCashierRemarks('');
    setIsProcessingPayment(false);

    showToast(`Payment recorded! Official receipt ${receiptNo} generated & downloaded.`, 'success');
  };

  // Handler: Mark Cheque Cleared
  const handleMarkChequeCleared = (chq: ChequeRecord) => {
    setCheques(prev => prev.map(c => (c.id === chq.id ? { ...c, status: 'Cleared' } : c)));
    setCollections(prev => prev.map(col => (col.receiptNo === chq.receiptNo ? { ...col, status: 'Cleared' } : col)));
    showToast(`Cheque #${chq.chequeNo} marked as Cleared! Ledger updated.`, 'success');
  };

  // Handler: Confirm Bounce
  const handleConfirmBounce = () => {
    if (!bounceModalCheque) return;
    setCheques(prev =>
      prev.map(c =>
        c.id === bounceModalCheque.id
          ? {
              ...c,
              status: 'Bounced',
              bounceReason: bounceReasonInput,
              bouncePenalty: bouncePenaltyInput,
            }
          : c
      )
    );
    setCollections(prev =>
      prev.map(col =>
        col.receiptNo === bounceModalCheque.receiptNo
          ? {
              ...col,
              status: 'Bounced',
              notes: `Cheque bounced: ${bounceReasonInput}. Penalty of ₹${bouncePenaltyInput} added.`,
            }
          : col
      )
    );
    showToast(`Cheque #${bounceModalCheque.chequeNo} marked as Bounced. Penalty ₹${bouncePenaltyInput} logged.`, 'warning');
    setBounceModalCheque(null);
  };

  // Handler: Auto-Match Online Transaction
  const handleMatchOnlineTxn = () => {
    if (!matchingTxn || !manualMatchStudentId) return;
    const student = INITIAL_STUDENTS.find(s => s.studentId === manualMatchStudentId);
    if (!student) return;

    setGatewayTxns(prev =>
      prev.map(t =>
        t.id === matchingTxn.id
          ? {
              ...t,
              studentName: student.name,
              studentId: student.studentId,
              class: `${student.class}-${student.section}`,
              matchedInstalment: manualMatchInstalment,
              status: 'Matched',
            }
          : t
      )
    );

    showToast(`Transaction ${matchingTxn.txnId} auto-matched to ${student.name} (${student.class})!`, 'success');
    setMatchingTxn(null);
  };

  // Filtered Online Gateway Txns
  const filteredGatewayTxns = useMemo(() => {
    if (gatewayFilterStatus === 'All') return gatewayTxns;
    return gatewayTxns.filter(t => t.status.toLowerCase() === gatewayFilterStatus.toLowerCase());
  }, [gatewayTxns, gatewayFilterStatus]);

  // Filtered Cheque Records
  const filteredCheques = useMemo(() => {
    if (chequeFilterStatus === 'All') return cheques;
    return cheques.filter(c => c.status.toLowerCase().includes(chequeFilterStatus.toLowerCase()));
  }, [cheques, chequeFilterStatus]);

  // Filtered Transport Records
  const filteredTransportRecords = useMemo(() => {
    if (transportRouteFilter === 'All') return transportRecords;
    return transportRecords.filter(t => t.route.includes(transportRouteFilter));
  }, [transportRecords, transportRouteFilter]);

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant', 'Fee Collection Hub']} />
          <h1 className="text-[20px] sm:text-[22px] font-bold text-[#17153A] tracking-tight mt-1">
            Fee Collection Hub
          </h1>
        </div>
      </div>

      {/* Underline Tab Navigation Bar */}
      <Tabs
        tabs={[
          { key: 'pos', label: 'Cashier Counter (POS)', icon: 'solar:wallet-money-linear' },
          { key: 'online', label: 'Online Gateway', icon: 'solar:card-2-linear', count: gatewayTxns.filter(t => t.status === 'Unmatched').length || undefined },
          { key: 'cheques', label: 'Cheque & DD Clearance', icon: 'solar:check-circle-linear', count: cheques.filter(c => c.status === 'Pending Clearance').length || undefined },
          { key: 'transport', label: 'Transport Counter', icon: 'solar:bus-linear' },
        ]}
        active={activeSubTab}
        onChange={(val) => setActiveSubTab(val as any)}
      />

      {/* ==================================================================== */}
      {/* VIEW 1: CASHIER COUNTER (POS / OFFLINE COLLECTION) */}
      {/* ==================================================================== */}
      {activeSubTab === 'pos' && (
        <div className="space-y-6">
          {/* Main 2-Column POS Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Student Search & Selection (4 Cols) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Search Box */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-5 shadow-card-soft">
                <label className="block text-[13px] font-bold text-[#17153A] mb-2 flex items-center gap-1.5">
                  <Icon name="solar:magnifer-linear" size={15} className="text-[#7C612A]" />
                  <span>Search Student</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by Name, GR No, or Roll..."
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[13px] text-[#17153A] placeholder-[#94A3B8] focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#7C612A]/30 focus:border-[#7C612A] transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-[#94A3B8] hover:text-[#17153A]"
                    >
                      <Icon name="solar:close-circle-linear" size={16} />
                    </button>
                  )}

                  {/* Autocomplete Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-[#F1F5F9]">
                      {searchResults.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleSelectStudent(s)}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-[#FAF7F2] transition-colors flex items-center gap-3 cursor-pointer"
                        >
                          <img
                            src={s.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={s.name}
                            className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0]"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-[#17153A] truncate">{s.name}</p>
                            <p className="text-[11px] text-[#64748B]">
                              {s.grNumber} • {s.class}-{s.section} • Roll #{s.rollNumber}
                            </p>
                          </div>
                          <span className="text-[12px] font-bold text-[#BE123C]">₹{s.dueAmount.toLocaleString('en-IN')}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Select Chips */}
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">Quick Students</p>
                  <div className="flex flex-wrap gap-1.5">
                    {INITIAL_STUDENTS.slice(0, 4).map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleSelectStudent(st)}
                        className={`px-2.5 py-1 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
                          selectedStudent?.id === st.id
                            ? 'bg-[#7C612A] text-white font-semibold'
                            : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                        }`}
                      >
                        {st.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Student Profile Card */}
              {selectedStudent && (
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-5 shadow-card-soft space-y-4">
                  <div className="flex items-center gap-3.5 pb-4 border-b border-[#F1F5F9]">
                    <img
                      src={selectedStudent.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={selectedStudent.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E8DFC8] shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[16px] font-bold text-[#17153A]">{selectedStudent.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                          {selectedStudent.grNumber}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#64748B] mt-0.5">
                        {selectedStudent.class}-{selectedStudent.section} • Roll No: {selectedStudent.rollNumber}
                      </p>
                      <p className="text-[11px] text-[#64748B]">Guardian: {selectedStudent.parentName} ({selectedStudent.parentPhone})</p>
                    </div>
                  </div>

                  {/* Financial Snapshot */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="text-[11px] text-[#64748B] font-medium uppercase">Total Annual Fee</span>
                      <p className="text-[16px] font-bold text-[#17153A] mt-0.5">₹{selectedStudent.totalFee.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
                      <span className="text-[11px] text-[#15803D] font-medium uppercase">Paid So Far</span>
                      <p className="text-[16px] font-bold text-[#15803D] mt-0.5">₹{selectedStudent.paidSoFar.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#BE123C] uppercase tracking-wider">Total Outstanding Due</span>
                      <p className="text-[20px] font-bold text-[#BE123C] mt-0.5">₹{selectedStudent.dueAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFFFFF] text-[#BE123C] border border-[#FECDD3]">
                      {selectedStudent.dueAmount === 0 ? 'No Dues' : 'Action Due'}
                    </span>
                  </div>

                  {/* Transport & Route Info */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] space-y-1">
                    <p className="text-[11px] font-bold text-[#7C612A] uppercase flex items-center gap-1.5">
                      <Icon name="solar:bus-linear" size={13} />
                      <span>Transport Route</span>
                    </p>
                    <p className="text-[12px] font-semibold text-[#17153A]">{selectedStudent.transportRoute}</p>
                    <p className="text-[11px] text-[#64748B]">Stop: {selectedStudent.transportStop}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Fee Counter Checklist & Payment Form (8 Cols) */}
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-6 shadow-card-soft space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                  <div>
                    <h2 className="text-[18px] font-bold text-[#17153A]">Counter Fee Billing Checklist</h2>
                    <p className="text-[12px] text-[#64748B] mt-0.5">
                      Select fee items to collect for {selectedStudent ? selectedStudent.name : 'student'}
                    </p>
                  </div>
                  <span className="text-[12px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] px-3 py-1 rounded-xl">
                    Series: 2026-27
                  </span>
                </div>

                {/* Checklist Breakdown */}
                {selectedStudent ? (
                  <div className="space-y-3">
                    {/* Item 1: Tuition Instalment */}
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        payTuition ? 'bg-[#FAF7F2] border-[#E8DFC8]' : 'bg-[#F8FAFC] border-[#E2E8F0] opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={payTuition}
                            onChange={e => setPayTuition(e.target.checked)}
                            className="w-4 h-4 rounded text-[#7C612A] accent-[#7C612A] cursor-pointer"
                          />
                          <div>
                            <p className="text-[14px] font-bold text-[#17153A]">{selectedStudent.activeInstalmentName}</p>
                            <p className="text-[12px] text-[#64748B]">
                              Class 8 Term Tuition, Activity & Exam fee • Outstanding: ₹{selectedStudent.tuitionDue.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-[#64748B]">Pay (₹):</span>
                          <input
                            type="number"
                            disabled={!payTuition}
                            value={customTuitionAmount}
                            onChange={e => setCustomTuitionAmount(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-28 px-3 py-1.5 text-right font-bold text-[14px] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg text-[#17153A] focus:outline-none focus:ring-1 focus:ring-[#7C612A]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Item 2: Transport Fee */}
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        payTransport ? 'bg-[#FAF7F2] border-[#E8DFC8]' : 'bg-[#F8FAFC] border-[#E2E8F0] opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={payTransport}
                            onChange={e => setPayTransport(e.target.checked)}
                            disabled={selectedStudent.transportDue <= 0}
                            className="w-4 h-4 rounded text-[#7C612A] accent-[#7C612A] cursor-pointer"
                          />
                          <div>
                            <p className="text-[14px] font-bold text-[#17153A]">Transport Fee ({selectedStudent.transportRoute})</p>
                            <p className="text-[12px] text-[#64748B]">
                              Stop: {selectedStudent.transportStop} • Outstanding: ₹{selectedStudent.transportDue.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </label>
                        <span className="text-[14px] font-bold text-[#17153A]">
                          ₹{selectedStudent.transportDue.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Item 3: Late Fee Fine */}
                    {selectedStudent.lateFeeDue > 0 && (
                      <div className="p-4 rounded-xl border bg-[#FFF1F2] border-[#FECDD3] flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={payLateFee && !waiveLateFee}
                            onChange={e => setPayLateFee(e.target.checked)}
                            disabled={waiveLateFee}
                            className="w-4 h-4 rounded text-[#BE123C] accent-[#BE123C] cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-[14px] font-bold text-[#BE123C]">Late Payment Fine</p>
                              {waiveLateFee && (
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#15803D] text-white">
                                  WAIVED
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-[#BE123C]/80">Accrued past grace period (+14 days)</p>
                          </div>
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setWaiveLateFee(!waiveLateFee)}
                            className="text-[12px] font-semibold text-[#7C612A] underline hover:text-[#560110] cursor-pointer"
                          >
                            {waiveLateFee ? 'Undo Waiver' : 'Waive Fine'}
                          </button>
                          <span className={`text-[14px] font-bold ${waiveLateFee ? 'line-through text-[#94A3B8]' : 'text-[#BE123C]'}`}>
                            ₹{selectedStudent.lateFeeDue}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Concession / Discount Bar */}
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={applyConcession}
                            onChange={e => setApplyConcession(e.target.checked)}
                            className="w-4 h-4 rounded text-[#7C612A] accent-[#7C612A]"
                          />
                          <span className="text-[13px] font-bold text-[#17153A]">Apply Concession / Discount Voucher</span>
                        </label>
                        {applyConcession && (
                          <span className="text-[12px] font-semibold text-[#15803D]">-₹{Number(concessionValue).toLocaleString('en-IN')}</span>
                        )}
                      </div>

                      {applyConcession && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E2E8F0]">
                          <select
                            value={concessionType}
                            onChange={e => setConcessionType(e.target.value)}
                            className="px-3 py-1.5 text-[12px] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg text-[#17153A]"
                          >
                            <option value="Sibling Discount">Sibling Discount</option>
                            <option value="Staff Ward Concession">Staff Ward Concession</option>
                            <option value="Merit Scholarship">Merit Scholarship</option>
                            <option value="Management Discretion">Management Discretion</option>
                          </select>
                          <input
                            type="number"
                            value={concessionValue}
                            onChange={e => setConcessionValue(Number(e.target.value))}
                            placeholder="Discount Amount (₹)"
                            className="px-3 py-1.5 text-[12px] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg text-[#17153A]"
                          />
                          <input
                            type="text"
                            value={concessionReason}
                            onChange={e => setConcessionReason(e.target.value)}
                            placeholder="Reason for concession"
                            className="px-3 py-1.5 text-[12px] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg text-[#17153A]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-[#64748B]">
                    <Icon name="solar:user-linear" size={32} className="mx-auto text-[#94A3B8] mb-2" />
                    <p className="text-[14px] font-medium">Please search and select a student from the left panel to begin</p>
                  </div>
                )}

                {/* Payment Mode Selector */}
                <div className="pt-4 border-t border-[#F1F5F9] space-y-4">
                  <label className="block text-[13px] font-bold text-[#17153A]">Select Payment Mode</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {(['Cash', 'Cheque', 'DD', 'UPI', 'Bank Transfer'] as const).map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPaymentMode(mode)}
                        className={`py-2.5 px-3 rounded-xl border text-[13px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          paymentMode === mode
                            ? 'bg-[#17153A] text-white border-[#17153A] shadow-sm'
                            : 'bg-[#FFFFFF] text-[#475569] border-[#CBD5E1] hover:border-[#7C612A]'
                        }`}
                      >
                        <Icon
                          name={
                            mode === 'Cash'
                              ? 'solar:wad-of-money-linear'
                              : mode === 'Cheque'
                              ? 'solar:document-text-linear'
                              : mode === 'DD'
                              ? 'solar:card-2-linear'
                              : mode === 'UPI'
                              ? 'solar:qr-code-linear'
                              : 'solar:bank-linear'
                          }
                          size={18}
                        />
                        <span>{mode}</span>
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Mode Details Input */}
                  {paymentMode === 'Cheque' && (
                    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Input
                        label="Cheque Number"
                        required
                        value={chequeNo}
                        onChange={e => setChequeNo(e.target.value)}
                        placeholder="6-digit cheque no"
                      />
                      <Input
                        label="Bank Name"
                        required
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                        placeholder="e.g. HDFC Bank"
                      />
                      <Input
                        label="Cheque Date"
                        type="date"
                        value={chequeDate}
                        onChange={e => setChequeDate(e.target.value)}
                      />
                    </div>
                  )}

                  {paymentMode === 'DD' && (
                    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Demand Draft (DD) No."
                        required
                        value={ddNo}
                        onChange={e => setDdNo(e.target.value)}
                        placeholder="DD reference number"
                      />
                      <Input
                        label="Issuing Bank"
                        required
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                        placeholder="e.g. State Bank of India"
                      />
                    </div>
                  )}

                  {(paymentMode === 'UPI' || paymentMode === 'Bank Transfer') && (
                    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="UTR / Transaction Ref No."
                        required
                        value={upiRefNo}
                        onChange={e => setUpiRefNo(e.target.value)}
                        placeholder="e.g. UPI-20261029-XXXX"
                      />
                      <Input
                        label="Accountant Cashier Notes"
                        value={cashierRemarks}
                        onChange={e => setCashierRemarks(e.target.value)}
                        placeholder="Remarks or payer name"
                      />
                    </div>
                  )}
                </div>

                {/* Final Total & Action Bar */}
                <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#F8FAFC] -mx-6 -mb-6 p-6 rounded-b-2xl">
                  <div>
                    <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Total Collection Amount</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-[26px] font-bold text-[#17153A]">₹{netCollectAmount.toLocaleString('en-IN')}</span>
                      {discountAmount > 0 && (
                        <span className="text-[12px] text-[#15803D] font-medium">(Concession of ₹{discountAmount} applied)</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isProcessingPayment || !selectedStudent || netCollectAmount <= 0}
                      onClick={handleRecordPayment}
                      className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-bold text-white bg-[#7C612A] hover:bg-[#560110] active:scale-[0.98] rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon name="solar:printer-linear" size={18} />
                      <span>{isProcessingPayment ? 'Recording...' : 'Record Payment & Print Receipt'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Collections Feed */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="solar:history-linear" size={17} className="text-[#7C612A]" />
                    <h3 className="font-bold text-[#17153A] text-[15px]">Today's Recent Counter Collections</h3>
                  </div>
                  <span className="text-[12px] font-medium text-[#64748B]">{collections.length} Transactions</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <th className="px-4 py-3 text-[11px] font-bold text-[#64748B] uppercase">Receipt No.</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-[#64748B] uppercase">Student</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-[#64748B] uppercase text-right">Amount</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-[#64748B] uppercase">Mode</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-[#64748B] uppercase text-center">Status</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-[#64748B] uppercase text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {collections.slice(0, 5).map(c => (
                        <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-4 py-3 text-[12px] font-mono text-[#475569]">{c.receiptNo}</td>
                          <td className="px-4 py-3">
                            <p className="text-[13px] font-bold text-[#17153A]">{c.studentName}</p>
                            <p className="text-[11px] text-[#64748B]">{c.class} • {c.instalment}</p>
                          </td>
                          <td className="px-4 py-3 text-right text-[13px] font-bold text-[#17153A]">
                            ₹{c.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                              {c.mode}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                c.status === 'Collected' || c.status === 'Cleared'
                                  ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                                  : c.status === 'Bounced'
                                  ? 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]'
                                  : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                generateReceiptPdf({
                                  receiptNo: c.receiptNo,
                                  date: c.date,
                                  time: c.time,
                                  mode: c.mode,
                                  amount: c.amount,
                                  studentName: c.studentName,
                                  class: c.class,
                                  academicYear: '2026-2027',
                                  instalment: c.instalment,
                                  status: 'PAID',
                                });
                                showToast(`Official Receipt ${c.receiptNo}.pdf downloaded!`, 'success');
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] rounded-lg hover:bg-[#7C612A] hover:text-white transition-all cursor-pointer"
                            >
                              PDF Voucher
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* VIEW 2: ONLINE GATEWAY COLLECTIONS */}
      {/* ==================================================================== */}
      {activeSubTab === 'online' && (
        <div className="space-y-6">
          {/* Online Gateway Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Gateway Today</span>
              <p className="text-[24px] font-bold text-[#17153A] mt-1">₹40,000</p>
              <span className="text-[11px] text-[#15803D] font-medium">2 Settlements today</span>
            </div>
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Gateway MTD</span>
              <p className="text-[24px] font-bold text-[#15803D] mt-1">₹14.85 L</p>
              <span className="text-[11px] text-[#64748B]">Auto-matched to bank</span>
            </div>
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Unmatched Txns</span>
              <p className="text-[24px] font-bold text-[#B45309] mt-1">
                {gatewayTxns.filter(t => t.status === 'Unmatched').length}
              </p>
              <span className="text-[11px] text-[#B45309] font-medium">Requires manual student link</span>
            </div>
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Failed Online</span>
              <p className="text-[24px] font-bold text-[#BE123C] mt-1">
                {gatewayTxns.filter(t => t.status === 'Failed').length}
              </p>
              <span className="text-[11px] text-[#BE123C] font-medium">Auto-notified parents</span>
            </div>
          </div>

          {/* Gateway Transactions Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F8FAFC]">
              <div>
                <h3 className="font-bold text-[#17153A] text-[16px]">Payment Gateway Feed (Razorpay & NetBanking)</h3>
                <p className="text-[12px] text-[#64748B] mt-0.5">Real-time webhook sync from school payment gateway</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#64748B] font-medium">Status:</span>
                <select
                  value={gatewayFilterStatus}
                  onChange={e => setGatewayFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg text-[#17153A]"
                >
                  <option value="All">All Transactions</option>
                  <option value="Matched">Matched</option>
                  <option value="Unmatched">Unmatched</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Txn ID / Gateway</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student Details</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Matched Instalment</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredGatewayTxns.map(tx => (
                    <tr key={tx.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-mono text-[13px] font-bold text-[#17153A]">{tx.txnId}</p>
                        <p className="text-[11px] text-[#64748B]">{tx.gateway} • {tx.paymentMethod} • {tx.time}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#17153A] text-[14px]">{tx.studentName}</p>
                        <p className="text-[12px] text-[#64748B]">{tx.studentId} • {tx.class}</p>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-[#17153A] text-[14px]">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-[#475569]">{tx.matchedInstalment}</td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold ${
                            tx.status === 'Matched'
                              ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                              : tx.status === 'Failed'
                              ? 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]'
                              : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                          }`}
                        >
                          {tx.status}
                        </span>
                        {tx.failureReason && (
                          <p className="text-[10px] text-[#BE123C] mt-0.5 max-w-xs">{tx.failureReason}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {tx.status === 'Unmatched' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setMatchingTxn(tx);
                              setManualMatchStudentId('STU-2026-0142');
                            }}
                            className="px-3 py-1.5 text-[12px] font-bold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] rounded-lg hover:bg-[#7C612A] hover:text-white transition-all cursor-pointer"
                          >
                            Match to Student
                          </button>
                        ) : tx.status === 'Matched' ? (
                          <button
                            type="button"
                            onClick={() => {
                              generateReceiptPdf({
                                receiptNo: `RCP-GW-${tx.txnId.slice(-6)}`,
                                date: tx.date,
                                time: tx.time,
                                mode: 'Online Gateway',
                                amount: tx.amount,
                                studentName: tx.studentName,
                                class: tx.class,
                                academicYear: '2026-2027',
                                instalment: tx.matchedInstalment,
                                status: 'PAID',
                              });
                              showToast('Gateway voucher downloaded!', 'success');
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#17153A] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                          >
                            PDF
                          </button>
                        ) : (
                          <span className="text-[12px] text-[#94A3B8]">Failed</span>
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
      {/* VIEW 3: CHEQUE & DD CLEARANCE REGISTER */}
      {/* ==================================================================== */}
      {activeSubTab === 'cheques' && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F8FAFC]">
              <div>
                <h3 className="font-bold text-[#17153A] text-[16px]">Cheque & Demand Draft Clearing Register</h3>
                <p className="text-[12px] text-[#64748B] mt-0.5">Track clearance dates and bounce penalties</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#64748B] font-medium">Filter:</span>
                <select
                  value={chequeFilterStatus}
                  onChange={e => setChequeFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg text-[#17153A]"
                >
                  <option value="All">All Cheques & DDs</option>
                  <option value="Pending Clearance">Pending Clearance</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Bounced">Bounced</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Receipt & Student</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Instrument Details</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Deposit Date</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredCheques.map(chq => (
                    <tr key={chq.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-mono text-[12px] text-[#7C612A] font-bold">{chq.receiptNo}</p>
                        <p className="font-bold text-[#17153A] text-[14px]">{chq.studentName}</p>
                        <p className="text-[11px] text-[#64748B]">{chq.class}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#17153A] text-[13px]">Cheque #{chq.chequeNo}</p>
                        <p className="text-[12px] text-[#475569]">{chq.bankName} • {chq.branch}</p>
                        <p className="text-[11px] text-[#64748B]">Issued: {chq.issueDate}</p>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-[#17153A] text-[14px]">
                        ₹{chq.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-[#64748B]">{chq.depositDate}</td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold ${
                            chq.status === 'Cleared'
                              ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                              : chq.status === 'Bounced'
                              ? 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]'
                              : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                          }`}
                        >
                          {chq.status}
                        </span>
                        {chq.bounceReason && (
                          <p className="text-[11px] text-[#BE123C] mt-0.5">{chq.bounceReason}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {chq.status === 'Pending Clearance' ? (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleMarkChequeCleared(chq)}
                              className="px-2.5 py-1 text-[11px] font-bold text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg hover:bg-[#15803D] hover:text-white transition-all cursor-pointer"
                            >
                              Mark Cleared
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setBounceModalCheque(chq);
                                setBounceReasonInput('Insufficient Balance / Signature');
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-[#BE123C] bg-[#FFF1F2] border border-[#FECDD3] rounded-lg hover:bg-[#BE123C] hover:text-white transition-all cursor-pointer"
                            >
                              Mark Bounced
                            </button>
                          </div>
                        ) : (
                          <span className="text-[12px] text-[#94A3B8]">Completed</span>
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
      {/* VIEW 4: TRANSPORT FEE COUNTER */}
      {/* ==================================================================== */}
      {activeSubTab === 'transport' && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F8FAFC]">
              <div>
                <h3 className="font-bold text-[#17153A] text-[16px]">Transport Route Fees & Student Allocations</h3>
                <p className="text-[12px] text-[#64748B] mt-0.5">Collect bus fees for students allocated to school routes</p>
              </div>

              {/* Route Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#64748B] font-medium">Filter Route:</span>
                <select
                  value={transportRouteFilter}
                  onChange={e => setTransportRouteFilter(e.target.value)}
                  className="px-3 py-1.5 text-[12px] font-semibold bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg text-[#17153A]"
                >
                  <option value="All">All Routes</option>
                  <option value="Route 1">Route 1 - Camp</option>
                  <option value="Route 2">Route 2 - Aundh</option>
                  <option value="Route 3">Route 3 - Kothrud</option>
                  <option value="Route 4">Route 4 - Hadapsar</option>
                  <option value="Route 5">Route 5 - Baner</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Route & Bus Stop</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Annual Fee</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Paid</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Due</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredTransportRecords.map(tr => (
                    <tr key={tr.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#17153A] text-[14px]">{tr.studentName}</p>
                        <p className="text-[11px] text-[#64748B]">{tr.studentId} • {tr.class}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#17153A] text-[13px]">{tr.route}</p>
                        <p className="text-[12px] text-[#64748B]">Stop: {tr.stop} • Bus: {tr.vehicleNo}</p>
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-[#17153A] text-[14px]">
                        ₹{tr.annualFee.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-[#15803D] text-[14px]">
                        ₹{tr.paid.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-[#BE123C] text-[14px]">
                        ₹{tr.due.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold ${
                            tr.status === 'Paid'
                              ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                              : tr.status === 'Overdue'
                              ? 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]'
                              : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                          }`}
                        >
                          {tr.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {tr.due > 0 ? (
                          <button
                            type="button"
                            onClick={() => {
                              const st = INITIAL_STUDENTS.find(s => s.name === tr.studentName);
                              if (st) {
                                setSelectedStudent(st);
                                setPayTransport(true);
                                setPayTuition(false);
                                setActiveSubTab('pos');
                                showToast(`Loaded ${tr.studentName} transport fee on cashier counter!`, 'info');
                              }
                            }}
                            className="px-3 py-1.5 text-[12px] font-bold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer"
                          >
                            Collect Bus Fee
                          </button>
                        ) : (
                          <span className="text-[12px] text-[#15803D] font-bold">Cleared</span>
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
      {/* MODAL: MATCH ONLINE TRANSACTION */}
      {/* ==================================================================== */}
      <Modal
        open={Boolean(matchingTxn)}
        onClose={() => setMatchingTxn(null)}
        title="Auto-Match Gateway Transaction"
        footer={
          <>
            <button
              type="button"
              onClick={() => setMatchingTxn(null)}
              className="px-4 py-2 text-[13px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleMatchOnlineTxn}
              className="px-4 py-2 text-[13px] font-bold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl cursor-pointer"
            >
              Link & Verify Match
            </button>
          </>
        }
      >
        {matchingTxn && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]">
              <p className="text-[12px] text-[#64748B]">Transaction ID</p>
              <p className="font-mono text-[14px] font-bold text-[#17153A]">{matchingTxn.txnId}</p>
              <p className="text-[14px] font-bold text-[#7C612A] mt-1">₹{matchingTxn.amount.toLocaleString('en-IN')}</p>
            </div>

            <Select
              label="Select Student to Match"
              required
              value={manualMatchStudentId}
              onChange={e => setManualMatchStudentId(e.target.value)}
              options={INITIAL_STUDENTS.map(s => ({
                value: s.studentId,
                label: `${s.name} (${s.studentId} • ${s.class})`,
              }))}
            />

            <Select
              label="Target Fee Instalment"
              required
              value={manualMatchInstalment}
              onChange={e => setManualMatchInstalment(e.target.value)}
              options={[
                { value: 'Instalment 1', label: 'Instalment 1 (Term 1)' },
                { value: 'Instalment 2', label: 'Instalment 2 (Term 2)' },
                { value: 'Instalment 3', label: 'Instalment 3 (Final)' },
                { value: 'Transport Fee', label: 'Transport Fee' },
              ]}
            />
          </div>
        )}
      </Modal>

      {/* ==================================================================== */}
      {/* MODAL: MARK CHEQUE BOUNCED */}
      {/* ==================================================================== */}
      <Modal
        open={Boolean(bounceModalCheque)}
        onClose={() => setBounceModalCheque(null)}
        title="Record Bounced Cheque"
        footer={
          <>
            <button
              type="button"
              onClick={() => setBounceModalCheque(null)}
              className="px-4 py-2 text-[13px] font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmBounce}
              className="px-4 py-2 text-[13px] font-bold text-white bg-[#BE123C] hover:bg-[#9F1239] rounded-xl cursor-pointer"
            >
              Confirm Bounce & Apply Penalty
            </button>
          </>
        }
      >
        {bounceModalCheque && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3]">
              <p className="text-[12px] font-semibold text-[#BE123C]">
                Cheque #{bounceModalCheque.chequeNo} • Amount: ₹{bounceModalCheque.amount.toLocaleString('en-IN')}
              </p>
              <p className="text-[12px] text-[#64748B] mt-0.5">
                Student: {bounceModalCheque.studentName} ({bounceModalCheque.class})
              </p>
            </div>

            <Select
              label="Reason for Cheque Return"
              required
              value={bounceReasonInput}
              onChange={e => setBounceReasonInput(e.target.value)}
              options={[
                { value: 'Insufficient Funds', label: 'Insufficient Funds' },
                { value: 'Signature Mismatch', label: 'Signature Mismatch' },
                { value: 'Post-dated / Stale Cheque', label: 'Post-dated / Stale Cheque' },
                { value: 'Payment Stopped by Drawer', label: 'Payment Stopped by Drawer' },
              ]}
            />

            <Input
              label="Bank Bounce Penalty / Surcharge (₹)"
              type="number"
              required
              value={bouncePenaltyInput}
              onChange={e => setBouncePenaltyInput(Number(e.target.value))}
            />

            <p className="text-[11px] text-[#64748B]">
              This will restore the student's outstanding balance, reverse the payment record, and automatically levy the penalty.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
