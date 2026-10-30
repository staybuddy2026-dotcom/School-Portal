import { useState, useMemo, useEffect } from 'react';
import { Icon } from '@/components/Icon';
import { Breadcrumb, Modal, showToast, Select, Input } from '@/components/ui';
import { generateReceiptPdf } from '@/utils/receiptPdf';
import { generateLedgerPdf } from '@/utils/ledgerPdf';
import type {
  StudentFeeLedgerAccount,
  FeeHeadBreakdown,
  LedgerInstallment,
  LedgerTransaction,
  LedgerConcession,
  LedgerFeeStatus,
} from '@/types';
import { studentPhotos } from '@/data';

// =========================================================================
// DEFAULT CLASS FEE PRESETS (Aligns with FeesConfiguration)
// =========================================================================
const CLASS_FEE_PRESETS: Record<string, { total: number; heads: { name: string; category: FeeHeadBreakdown['category']; amount: number }[] }> = {
  'Class 1': {
    total: 45000,
    heads: [
      { name: 'Tuition Fee', category: 'Academic', amount: 20000 },
      { name: 'Admission Fee', category: 'Admission', amount: 10000 },
      { name: 'Term Fee', category: 'Academic', amount: 5000 },
      { name: 'Activity Fee', category: 'Activity', amount: 3000 },
      { name: 'Examination Fee', category: 'Examination', amount: 2000 },
      { name: 'Transport Fee', category: 'Transport', amount: 5000 },
    ],
  },
  'Class 5': {
    total: 78500,
    heads: [
      { name: 'Tuition Fee', category: 'Academic', amount: 45000 },
      { name: 'Admission Fee', category: 'Admission', amount: 12000 },
      { name: 'Term Fee', category: 'Academic', amount: 8000 },
      { name: 'Activity Fee', category: 'Activity', amount: 4500 },
      { name: 'Examination Fee', category: 'Examination', amount: 3000 },
      { name: 'Transport Fee', category: 'Transport', amount: 6000 },
    ],
  },
  'Class 6': {
    total: 84000,
    heads: [
      { name: 'Tuition Fee', category: 'Academic', amount: 50000 },
      { name: 'Admission Fee', category: 'Admission', amount: 12000 },
      { name: 'Term Fee', category: 'Academic', amount: 8000 },
      { name: 'Activity Fee', category: 'Activity', amount: 5000 },
      { name: 'Examination Fee', category: 'Examination', amount: 3000 },
      { name: 'Transport Fee', category: 'Transport', amount: 6000 },
    ],
  },
  'Class 7': {
    total: 93000,
    heads: [
      { name: 'Tuition Fee', category: 'Academic', amount: 55000 },
      { name: 'Admission Fee', category: 'Admission', amount: 15000 },
      { name: 'Term Fee', category: 'Academic', amount: 9000 },
      { name: 'Activity Fee', category: 'Activity', amount: 5000 },
      { name: 'Examination Fee', category: 'Examination', amount: 3000 },
      { name: 'Transport Fee', category: 'Transport', amount: 6000 },
    ],
  },
  'Class 8': {
    total: 98000,
    heads: [
      { name: 'Tuition Fee', category: 'Academic', amount: 60000 },
      { name: 'Admission Fee', category: 'Admission', amount: 15000 },
      { name: 'Term Fee', category: 'Academic', amount: 9000 },
      { name: 'Activity Fee', category: 'Activity', amount: 5000 },
      { name: 'Examination Fee', category: 'Examination', amount: 3000 },
      { name: 'Transport Fee', category: 'Transport', amount: 6000 },
    ],
  },
  'Class 9': {
    total: 106000,
    heads: [
      { name: 'Tuition Fee', category: 'Academic', amount: 65000 },
      { name: 'Admission Fee', category: 'Admission', amount: 16000 },
      { name: 'Term Fee', category: 'Academic', amount: 10000 },
      { name: 'Activity Fee', category: 'Activity', amount: 6000 },
      { name: 'Examination Fee', category: 'Examination', amount: 4000 },
      { name: 'Transport Fee', category: 'Transport', amount: 5000 },
    ],
  },
  'Class 10': {
    total: 117000,
    heads: [
      { name: 'Tuition Fee', category: 'Academic', amount: 72000 },
      { name: 'Admission Fee', category: 'Admission', amount: 18000 },
      { name: 'Term Fee', category: 'Academic', amount: 11000 },
      { name: 'Activity Fee', category: 'Activity', amount: 6000 },
      { name: 'Examination Fee', category: 'Examination', amount: 4000 },
      { name: 'Transport Fee', category: 'Transport', amount: 6000 },
    ],
  },
};

// =========================================================================
// REGISTERED STUDENT DIRECTORY (for Auto-Fill & Ledger Initialization)
// =========================================================================
interface RegisteredStudent {
  studentId: string;
  grNumber: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  photo?: string;
}

const REGISTERED_STUDENTS: RegisteredStudent[] = [
  { studentId: 'STU-2026-0142', grNumber: 'GR-9821', name: 'Aarav Sharma', class: 'Class 8', section: 'A', rollNumber: '07', parentName: 'Rajesh Sharma', parentPhone: '+91 98765 43210', parentEmail: 'rajesh.sharma@gmail.com', photo: studentPhotos['Aarav Sharma'] },
  { studentId: 'STU-2026-0143', grNumber: 'GR-9835', name: 'Diya Patel', class: 'Class 8', section: 'A', rollNumber: '12', parentName: 'Hardik Patel', parentPhone: '+91 98220 54123', parentEmail: 'hardik.patel@yahoo.com', photo: studentPhotos['Diya Patel'] },
  { studentId: 'STU-2026-0144', grNumber: 'GR-9844', name: 'Ishaan Verma', class: 'Class 8', section: 'A', rollNumber: '19', parentName: 'Amit Verma', parentPhone: '+91 97110 88231', parentEmail: 'amit.verma@outlook.com', photo: studentPhotos['Ishaan Verma'] },
  { studentId: 'STU-2026-0145', grNumber: 'GR-9850', name: 'Saanvi Reddy', class: 'Class 8', section: 'B', rollNumber: '04', parentName: 'Kiran Reddy', parentPhone: '+91 98450 12789', parentEmail: 'kiran.reddy@gmail.com', photo: studentPhotos['Saanvi Reddy'] },
  { studentId: 'STU-2026-0146', grNumber: 'GR-9862', name: 'Arjun Nair', class: 'Class 8', section: 'B', rollNumber: '15', parentName: 'Prakash Nair', parentPhone: '+91 99002 33412', parentEmail: 'prakash.nair@corp.com', photo: studentPhotos['Arjun Nair'] },
  { studentId: 'STU-2026-0147', grNumber: 'GR-9875', name: 'Ananya Gupta', class: 'Class 7', section: 'A', rollNumber: '02', parentName: 'Suresh Gupta', parentPhone: '+91 98112 66723', parentEmail: 'suresh.gupta@gmail.com', photo: studentPhotos['Ananya Gupta'] },
  { studentId: 'STU-2026-0148', grNumber: 'GR-9889', name: 'Vihaan Joshi', class: 'Class 7', section: 'A', rollNumber: '21', parentName: 'Mahesh Joshi', parentPhone: '+91 97230 44512', parentEmail: 'mahesh.joshi@gmail.com', photo: studentPhotos['Vihaan Joshi'] },
  { studentId: 'STU-2026-0149', grNumber: 'GR-9892', name: 'Myra Singh', class: 'Class 7', section: 'B', rollNumber: '11', parentName: 'Dilip Singh', parentPhone: '+91 98921 55670', parentEmail: 'dilip.singh@tcs.com', photo: studentPhotos['Myra Singh'] },
  { studentId: 'STU-2026-0150', grNumber: 'GR-9901', name: 'Kabir Mehta', class: 'Class 6', section: 'A', rollNumber: '09', parentName: 'Nitin Mehta', parentPhone: '+91 98200 44122', parentEmail: 'nitin.mehta@yahoo.com' },
  { studentId: 'STU-2026-0151', grNumber: 'GR-9915', name: 'Rhea Kapoor', class: 'Class 6', section: 'B', rollNumber: '18', parentName: 'Vikram Kapoor', parentPhone: '+91 98190 77812', parentEmail: 'vikram.kapoor@gmail.com' },
  { studentId: 'STU-2026-0152', grNumber: 'GR-9928', name: 'Aditya Deshmukh', class: 'Class 10', section: 'A', rollNumber: '05', parentName: 'Sanjay Deshmukh', parentPhone: '+91 98211 99234', parentEmail: 'sanjay.d@infra.in' },
  { studentId: 'STU-2026-0153', grNumber: 'GR-9934', name: 'Anushka Rao', class: 'Class 9', section: 'A', rollNumber: '14', parentName: 'Venkat Rao', parentPhone: '+91 99400 88211', parentEmail: 'venkat.rao@wipro.com' },
  { studentId: 'STU-2026-0154', grNumber: 'GR-9940', name: 'Devansh Trivedi', class: 'Class 1', section: 'A', rollNumber: '08', parentName: 'Jatin Trivedi', parentPhone: '+91 98240 11982', parentEmail: 'jatin.trivedi@gmail.com' },
  { studentId: 'STU-2026-0155', grNumber: 'GR-9952', name: 'Prisha Shah', class: 'Class 1', section: 'B', rollNumber: '16', parentName: 'Bhavin Shah', parentPhone: '+91 98790 33421', parentEmail: 'bhavin.shah@gmail.com' },
  { studentId: 'STU-2026-0156', grNumber: 'GR-9836', name: 'Diya Sharma', class: 'Class 5', section: 'B', rollNumber: '12', parentName: 'Rajesh Sharma', parentPhone: '+91 98765 43210', parentEmail: 'rajesh.sharma@gmail.com', photo: studentPhotos['Diya Sharma'] },
];

// =========================================================================
// INITIAL COMPREHENSIVE STUDENT FEE LEDGERS
// =========================================================================
const INITIAL_LEDGERS: StudentFeeLedgerAccount[] = [
  // 1. Aarav Sharma - Class 8-A (Partially Paid with Concession)
  {
    id: 'LEDGER-2026-001',
    studentId: 'STU-2026-0142',
    studentName: 'Aarav Sharma',
    grNumber: 'GR-9821',
    rollNumber: '07',
    class: 'Class 8',
    section: 'A',
    academicYear: '2026-2027',
    parentName: 'Rajesh Sharma',
    parentPhone: '+91 98765 43210',
    parentEmail: 'rajesh.sharma@gmail.com',
    photo: studentPhotos['Aarav Sharma'],
    totalFee: 98000,
    approvedConcession: 5000,
    netPayable: 93000,
    totalPaid: 48000,
    outstandingDue: 45000,
    advanceBalance: 0,
    status: 'Partially Paid',
    feeHeads: [
      { id: 'fh-1', headName: 'Tuition Fee', category: 'Academic', originalAmount: 60000, concessionAllocation: 5000, netPayable: 55000, amountPaid: 35000, outstandingDue: 20000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Partially Paid' },
      { id: 'fh-2', headName: 'Admission Fee', category: 'Admission', originalAmount: 15000, concessionAllocation: 0, netPayable: 15000, amountPaid: 15000, outstandingDue: 0, dueDate: '31 May 2026', status: 'Paid' },
      { id: 'fh-3', headName: 'Term Fee', category: 'Academic', originalAmount: 9000, concessionAllocation: 0, netPayable: 9000, amountPaid: 0, outstandingDue: 9000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Due' },
      { id: 'fh-4', headName: 'Activity Fee', category: 'Activity', originalAmount: 5000, concessionAllocation: 0, netPayable: 5000, amountPaid: 0, outstandingDue: 5000, dueDate: '10 Aug 2026', status: 'Due' },
      { id: 'fh-5', headName: 'Examination Fee', category: 'Examination', originalAmount: 3000, concessionAllocation: 0, netPayable: 3000, amountPaid: 0, outstandingDue: 3000, dueDate: '10 Aug 2026, 10 Nov 2026', status: 'Due' },
      { id: 'fh-6', headName: 'Transport Fee', category: 'Transport', originalAmount: 6000, concessionAllocation: 0, netPayable: 6000, amountPaid: 0, outstandingDue: 6000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Due' },
    ],
    installments: [
      { id: 'inst-1', installmentNumber: 1, installmentName: 'First Instalment (Term 1 & Admission)', dueDate: '2026-05-31', amountPayable: 31000, amountPaid: 31000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-2', installmentNumber: 2, installmentName: 'Second Instalment (Term 2 Tuition)', dueDate: '2026-08-10', amountPayable: 31000, amountPaid: 17000, remainingAmount: 14000, status: 'Partially Paid' },
      { id: 'inst-3', installmentNumber: 3, installmentName: 'Third Instalment (Term 3 & Final Exam)', dueDate: '2026-11-10', amountPayable: 31000, amountPaid: 0, remainingAmount: 31000, status: 'Due' },
    ],
    transactions: [
      { id: 'tx-1', receiptNo: 'RCP-2026-04521', date: '2026-05-28', time: '10:30 AM', allocation: 'First Instalment (Term 1 & Admission)', amount: 25000, mode: 'Online', transactionRef: 'PAY_ONLINE_984210', receivedBy: 'Payment Gateway (Razorpay)', status: 'Successful' },
      { id: 'tx-2', receiptNo: 'RCP-2026-04893', date: '2026-06-25', time: '02:15 PM', allocation: 'First Instalment Balance', amount: 6000, mode: 'UPI', transactionRef: 'UPI-20260625-7811', receivedBy: 'Suresh Bhat (Chief Accountant)', status: 'Successful' },
      { id: 'tx-3', receiptNo: 'RCP-2026-05102', date: '2026-08-05', time: '11:45 AM', allocation: 'Second Instalment (Partial)', amount: 17000, mode: 'Bank Transfer', transactionRef: 'NEFT-HDFC-991204', receivedBy: 'Suresh Bhat (Chief Accountant)', status: 'Cleared' },
    ],
    concessions: [
      { id: 'cnc-1', type: 'Sibling Discount', amount: 5000, reason: 'Younger sibling Diya Sharma enrolled in Class 5-B', status: 'Approved', approvedBy: 'Principal Dr. R. K. Iyer', approvalDate: '2026-04-12' },
    ],
    initializedAt: '2026-04-05',
    lastUpdated: '2026-08-05',
  },

  // 2. Diya Patel - Class 8-A (Fully Paid)
  {
    id: 'LEDGER-2026-002',
    studentId: 'STU-2026-0143',
    studentName: 'Diya Patel',
    grNumber: 'GR-9835',
    rollNumber: '12',
    class: 'Class 8',
    section: 'A',
    academicYear: '2026-2027',
    parentName: 'Hardik Patel',
    parentPhone: '+91 98220 54123',
    parentEmail: 'hardik.patel@yahoo.com',
    photo: studentPhotos['Diya Patel'],
    totalFee: 98000,
    approvedConcession: 0,
    netPayable: 98000,
    totalPaid: 98000,
    outstandingDue: 0,
    advanceBalance: 0,
    status: 'Paid',
    feeHeads: [
      { id: 'fh-1', headName: 'Tuition Fee', category: 'Academic', originalAmount: 60000, concessionAllocation: 0, netPayable: 60000, amountPaid: 60000, outstandingDue: 0, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Paid' },
      { id: 'fh-2', headName: 'Admission Fee', category: 'Admission', originalAmount: 15000, concessionAllocation: 0, netPayable: 15000, amountPaid: 15000, outstandingDue: 0, dueDate: '31 May 2026', status: 'Paid' },
      { id: 'fh-3', headName: 'Term Fee', category: 'Academic', originalAmount: 9000, concessionAllocation: 0, netPayable: 9000, amountPaid: 9000, outstandingDue: 0, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Paid' },
      { id: 'fh-4', headName: 'Activity Fee', category: 'Activity', originalAmount: 5000, concessionAllocation: 0, netPayable: 5000, amountPaid: 5000, outstandingDue: 0, dueDate: '10 Aug 2026', status: 'Paid' },
      { id: 'fh-5', headName: 'Examination Fee', category: 'Examination', originalAmount: 3000, concessionAllocation: 0, netPayable: 3000, amountPaid: 3000, outstandingDue: 0, dueDate: '10 Aug 2026, 10 Nov 2026', status: 'Paid' },
      { id: 'fh-6', headName: 'Transport Fee', category: 'Transport', originalAmount: 6000, concessionAllocation: 0, netPayable: 6000, amountPaid: 6000, outstandingDue: 0, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Paid' },
    ],
    installments: [
      { id: 'inst-1', installmentNumber: 1, installmentName: 'First Instalment (Term 1 & Admission)', dueDate: '2026-05-31', amountPayable: 33000, amountPaid: 33000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-2', installmentNumber: 2, installmentName: 'Second Instalment (Term 2 Tuition)', dueDate: '2026-08-10', amountPayable: 33000, amountPaid: 33000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-3', installmentNumber: 3, installmentName: 'Third Instalment (Term 3 & Final Exam)', dueDate: '2026-11-10', amountPayable: 32000, amountPaid: 32000, remainingAmount: 0, status: 'Paid' },
    ],
    transactions: [
      { id: 'tx-1', receiptNo: 'RCP-2026-04101', date: '2026-05-20', time: '11:00 AM', allocation: 'Full Annual Fee Clearance', amount: 98000, mode: 'Bank Transfer', transactionRef: 'RTGS-ICICI-00452', receivedBy: 'Suresh Bhat (Chief Accountant)', status: 'Cleared' },
    ],
    concessions: [],
    initializedAt: '2026-04-02',
    lastUpdated: '2026-05-20',
  },

  // 3. Ishaan Verma - Class 8-A (Overdue with Merit Concession)
  {
    id: 'LEDGER-2026-003',
    studentId: 'STU-2026-0144',
    studentName: 'Ishaan Verma',
    grNumber: 'GR-9844',
    rollNumber: '19',
    class: 'Class 8',
    section: 'A',
    academicYear: '2026-2027',
    parentName: 'Amit Verma',
    parentPhone: '+91 97110 88231',
    parentEmail: 'amit.verma@outlook.com',
    photo: studentPhotos['Ishaan Verma'],
    totalFee: 98000,
    approvedConcession: 10000,
    netPayable: 88000,
    totalPaid: 30000,
    outstandingDue: 58000,
    advanceBalance: 0,
    status: 'Overdue',
    feeHeads: [
      { id: 'fh-1', headName: 'Tuition Fee', category: 'Academic', originalAmount: 60000, concessionAllocation: 10000, netPayable: 50000, amountPaid: 15000, outstandingDue: 35000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Partially Paid' },
      { id: 'fh-2', headName: 'Admission Fee', category: 'Admission', originalAmount: 15000, concessionAllocation: 0, netPayable: 15000, amountPaid: 15000, outstandingDue: 0, dueDate: '31 May 2026', status: 'Paid' },
      { id: 'fh-3', headName: 'Term Fee', category: 'Academic', originalAmount: 9000, concessionAllocation: 0, netPayable: 9000, amountPaid: 0, outstandingDue: 9000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Overdue' },
      { id: 'fh-4', headName: 'Activity Fee', category: 'Activity', originalAmount: 5000, concessionAllocation: 0, netPayable: 5000, amountPaid: 0, outstandingDue: 5000, dueDate: '10 Aug 2026', status: 'Overdue' },
      { id: 'fh-5', headName: 'Examination Fee', category: 'Examination', originalAmount: 3000, concessionAllocation: 0, netPayable: 3000, amountPaid: 0, outstandingDue: 3000, dueDate: '10 Aug 2026, 10 Nov 2026', status: 'Due' },
      { id: 'fh-6', headName: 'Transport Fee', category: 'Transport', originalAmount: 6000, concessionAllocation: 0, netPayable: 6000, amountPaid: 0, outstandingDue: 6000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Due' },
    ],
    installments: [
      { id: 'inst-1', installmentNumber: 1, installmentName: 'First Instalment (Term 1 & Admission)', dueDate: '2026-05-31', amountPayable: 30000, amountPaid: 30000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-2', installmentNumber: 2, installmentName: 'Second Instalment (Term 2 Tuition)', dueDate: '2026-08-10', amountPayable: 29000, amountPaid: 0, remainingAmount: 29000, status: 'Overdue' },
      { id: 'inst-3', installmentNumber: 3, installmentName: 'Third Instalment (Term 3 & Final Exam)', dueDate: '2026-11-10', amountPayable: 29000, amountPaid: 0, remainingAmount: 29000, status: 'Due' },
    ],
    transactions: [
      { id: 'tx-1', receiptNo: 'RCP-2026-04289', date: '2026-05-30', time: '04:15 PM', allocation: 'First Instalment', amount: 30000, mode: 'Cheque', transactionRef: 'CHQ-552190', receivedBy: 'Suresh Bhat (Chief Accountant)', status: 'Cleared' },
    ],
    concessions: [
      { id: 'cnc-1', type: 'Merit Scholarship', amount: 10000, reason: 'State Mathematics Olympiad Rank 1 Awardee', status: 'Approved', approvedBy: 'Academic Council & Principal', approvalDate: '2026-04-10' },
    ],
    initializedAt: '2026-04-03',
    lastUpdated: '2026-05-30',
  },

  // 4. Saanvi Reddy - Class 8-B (Overdue, Pending Concession under review)
  {
    id: 'LEDGER-2026-004',
    studentId: 'STU-2026-0145',
    studentName: 'Saanvi Reddy',
    grNumber: 'GR-9850',
    rollNumber: '04',
    class: 'Class 8',
    section: 'B',
    academicYear: '2026-2027',
    parentName: 'Kiran Reddy',
    parentPhone: '+91 98450 12789',
    parentEmail: 'kiran.reddy@gmail.com',
    photo: studentPhotos['Saanvi Reddy'],
    totalFee: 98000,
    approvedConcession: 0, // Pending concession must NOT reduce payable!
    netPayable: 98000,
    totalPaid: 0,
    outstandingDue: 98000,
    advanceBalance: 0,
    status: 'Overdue',
    feeHeads: [
      { id: 'fh-1', headName: 'Tuition Fee', category: 'Academic', originalAmount: 60000, concessionAllocation: 0, netPayable: 60000, amountPaid: 0, outstandingDue: 60000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Overdue' },
      { id: 'fh-2', headName: 'Admission Fee', category: 'Admission', originalAmount: 15000, concessionAllocation: 0, netPayable: 15000, amountPaid: 0, outstandingDue: 15000, dueDate: '31 May 2026', status: 'Overdue' },
      { id: 'fh-3', headName: 'Term Fee', category: 'Academic', originalAmount: 9000, concessionAllocation: 0, netPayable: 9000, amountPaid: 0, outstandingDue: 9000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Overdue' },
      { id: 'fh-4', headName: 'Activity Fee', category: 'Activity', originalAmount: 5000, concessionAllocation: 0, netPayable: 5000, amountPaid: 0, outstandingDue: 5000, dueDate: '10 Aug 2026', status: 'Overdue' },
      { id: 'fh-5', headName: 'Examination Fee', category: 'Examination', originalAmount: 3000, concessionAllocation: 0, netPayable: 3000, amountPaid: 0, outstandingDue: 3000, dueDate: '10 Aug 2026, 10 Nov 2026', status: 'Due' },
      { id: 'fh-6', headName: 'Transport Fee', category: 'Transport', originalAmount: 6000, concessionAllocation: 0, netPayable: 6000, amountPaid: 0, outstandingDue: 6000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Due' },
    ],
    installments: [
      { id: 'inst-1', installmentNumber: 1, installmentName: 'First Instalment (Term 1 & Admission)', dueDate: '2026-05-31', amountPayable: 33000, amountPaid: 0, remainingAmount: 33000, status: 'Overdue' },
      { id: 'inst-2', installmentNumber: 2, installmentName: 'Second Instalment (Term 2 Tuition)', dueDate: '2026-08-10', amountPayable: 33000, amountPaid: 0, remainingAmount: 33000, status: 'Overdue' },
      { id: 'inst-3', installmentNumber: 3, installmentName: 'Third Instalment (Term 3 & Final Exam)', dueDate: '2026-11-10', amountPayable: 32000, amountPaid: 0, remainingAmount: 32000, status: 'Due' },
    ],
    transactions: [],
    concessions: [
      { id: 'cnc-1', type: 'Financial Assistance', amount: 15000, reason: 'Parent job transition - hardship request submitted', status: 'Pending' },
    ],
    initializedAt: '2026-04-06',
    lastUpdated: '2026-04-06',
  },

  // 5. Arjun Nair - Class 8-B (Staff Ward Concession, Cheque bounce recorded)
  {
    id: 'LEDGER-2026-005',
    studentId: 'STU-2026-0146',
    studentName: 'Arjun Nair',
    grNumber: 'GR-9862',
    rollNumber: '15',
    class: 'Class 8',
    section: 'B',
    academicYear: '2026-2027',
    parentName: 'Prakash Nair',
    parentPhone: '+91 99002 33412',
    parentEmail: 'prakash.nair@corp.com',
    photo: studentPhotos['Arjun Nair'],
    totalFee: 98000,
    approvedConcession: 8000,
    netPayable: 90000,
    totalPaid: 30000,
    outstandingDue: 60000,
    advanceBalance: 0,
    status: 'Due',
    feeHeads: [
      { id: 'fh-1', headName: 'Tuition Fee', category: 'Academic', originalAmount: 60000, concessionAllocation: 8000, netPayable: 52000, amountPaid: 20000, outstandingDue: 32000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Partially Paid' },
      { id: 'fh-2', headName: 'Admission Fee', category: 'Admission', originalAmount: 15000, concessionAllocation: 0, netPayable: 15000, amountPaid: 10000, outstandingDue: 5000, dueDate: '31 May 2026', status: 'Partially Paid' },
      { id: 'fh-3', headName: 'Term Fee', category: 'Academic', originalAmount: 9000, concessionAllocation: 0, netPayable: 9000, amountPaid: 0, outstandingDue: 9000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Due' },
      { id: 'fh-4', headName: 'Activity Fee', category: 'Activity', originalAmount: 5000, concessionAllocation: 0, netPayable: 5000, amountPaid: 0, outstandingDue: 5000, dueDate: '10 Aug 2026', status: 'Due' },
      { id: 'fh-5', headName: 'Examination Fee', category: 'Examination', originalAmount: 3000, concessionAllocation: 0, netPayable: 3000, amountPaid: 0, outstandingDue: 3000, dueDate: '10 Aug 2026, 10 Nov 2026', status: 'Due' },
      { id: 'fh-6', headName: 'Transport Fee', category: 'Transport', originalAmount: 6000, concessionAllocation: 0, netPayable: 6000, amountPaid: 0, outstandingDue: 6000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Due' },
    ],
    installments: [
      { id: 'inst-1', installmentNumber: 1, installmentName: 'First Instalment (Term 1 & Admission)', dueDate: '2026-05-31', amountPayable: 30000, amountPaid: 30000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-2', installmentNumber: 2, installmentName: 'Second Instalment (Term 2 Tuition)', dueDate: '2026-08-10', amountPayable: 30000, amountPaid: 0, remainingAmount: 30000, status: 'Due' },
      { id: 'inst-3', installmentNumber: 3, installmentName: 'Third Instalment (Term 3 & Final Exam)', dueDate: '2026-11-10', amountPayable: 30000, amountPaid: 0, remainingAmount: 30000, status: 'Due' },
    ],
    transactions: [
      { id: 'tx-1', receiptNo: 'RCP-2026-04312', date: '2026-05-25', time: '09:30 AM', allocation: 'First Instalment', amount: 30000, mode: 'Cash', transactionRef: 'CSH-882101', receivedBy: 'Suresh Bhat (Cash Counter 1)', status: 'Successful' },
      { id: 'tx-2', receiptNo: 'REV-2026-00109', date: '2026-08-12', time: '03:10 PM', allocation: 'Second Instalment Cheque Clearance', amount: 30000, mode: 'Cheque', transactionRef: 'CHQ-994101 (Bounce-Insufficient Funds)', receivedBy: 'Accounts Audit Desk', status: 'Bounced', remarks: 'Bank dishonour memo attached. Reversal applied.' },
    ],
    concessions: [
      { id: 'cnc-1', type: 'Staff Ward', amount: 8000, reason: 'Dependent ward of Sr. Faculty member Mr. Prakash Nair', status: 'Approved', approvedBy: 'Management Board', approvalDate: '2026-04-01' },
    ],
    initializedAt: '2026-04-01',
    lastUpdated: '2026-08-12',
  },

  // 6. Ananya Gupta - Class 7-A (Fully Paid)
  {
    id: 'LEDGER-2026-006',
    studentId: 'STU-2026-0147',
    studentName: 'Ananya Gupta',
    grNumber: 'GR-9875',
    rollNumber: '02',
    class: 'Class 7',
    section: 'A',
    academicYear: '2026-2027',
    parentName: 'Suresh Gupta',
    parentPhone: '+91 98112 66723',
    parentEmail: 'suresh.gupta@gmail.com',
    photo: studentPhotos['Ananya Gupta'],
    totalFee: 93000,
    approvedConcession: 5000,
    netPayable: 88000,
    totalPaid: 88000,
    outstandingDue: 0,
    advanceBalance: 0,
    status: 'Paid',
    feeHeads: [
      { id: 'fh-1', headName: 'Tuition Fee', category: 'Academic', originalAmount: 55000, concessionAllocation: 5000, netPayable: 50000, amountPaid: 50000, outstandingDue: 0, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Paid' },
      { id: 'fh-2', headName: 'Admission Fee', category: 'Admission', originalAmount: 15000, concessionAllocation: 0, netPayable: 15000, amountPaid: 15000, outstandingDue: 0, dueDate: '31 May 2026', status: 'Paid' },
      { id: 'fh-3', headName: 'Term Fee', category: 'Academic', originalAmount: 9000, concessionAllocation: 0, netPayable: 9000, amountPaid: 9000, outstandingDue: 0, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Paid' },
      { id: 'fh-4', headName: 'Activity Fee', category: 'Activity', originalAmount: 5000, concessionAllocation: 0, netPayable: 5000, amountPaid: 5000, outstandingDue: 0, dueDate: '10 Aug 2026', status: 'Paid' },
      { id: 'fh-5', headName: 'Examination Fee', category: 'Examination', originalAmount: 3000, concessionAllocation: 0, netPayable: 3000, amountPaid: 3000, outstandingDue: 0, dueDate: '10 Aug 2026, 10 Nov 2026', status: 'Paid' },
      { id: 'fh-6', headName: 'Transport Fee', category: 'Transport', originalAmount: 6000, concessionAllocation: 0, netPayable: 6000, amountPaid: 6000, outstandingDue: 0, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Paid' },
    ],
    installments: [
      { id: 'inst-1', installmentNumber: 1, installmentName: 'First Instalment (Term 1 & Admission)', dueDate: '2026-05-31', amountPayable: 30000, amountPaid: 30000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-2', installmentNumber: 2, installmentName: 'Second Instalment (Term 2 Tuition)', dueDate: '2026-08-10', amountPayable: 29000, amountPaid: 29000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-3', installmentNumber: 3, installmentName: 'Third Instalment (Term 3 & Final Exam)', dueDate: '2026-11-10', amountPayable: 29000, amountPaid: 29000, remainingAmount: 0, status: 'Paid' },
    ],
    transactions: [
      { id: 'tx-1', receiptNo: 'RCP-2026-03982', date: '2026-05-18', time: '10:00 AM', allocation: 'Term 1 & Term 2 Advance', amount: 59000, mode: 'UPI', transactionRef: 'UPI-20260518-1290', receivedBy: 'Suresh Bhat (Chief Accountant)', status: 'Successful' },
      { id: 'tx-2', receiptNo: 'RCP-2026-05340', date: '2026-09-10', time: '01:30 PM', allocation: 'Term 3 Final Clearance', amount: 29000, mode: 'Online', transactionRef: 'PAY_GATEWAY_88192', receivedBy: 'Payment Gateway (Razorpay)', status: 'Successful' },
    ],
    concessions: [
      { id: 'cnc-1', type: 'Sibling Discount', amount: 5000, reason: 'Elder brother in Class 10', status: 'Approved', approvedBy: 'Principal Dr. R. K. Iyer', approvalDate: '2026-04-10' },
    ],
    initializedAt: '2026-04-04',
    lastUpdated: '2026-09-10',
  },

  // 7. Vihaan Joshi - Class 7-A (Partially Paid)
  {
    id: 'LEDGER-2026-007',
    studentId: 'STU-2026-0148',
    studentName: 'Vihaan Joshi',
    grNumber: 'GR-9889',
    rollNumber: '21',
    class: 'Class 7',
    section: 'A',
    academicYear: '2026-2027',
    parentName: 'Mahesh Joshi',
    parentPhone: '+91 97230 44512',
    parentEmail: 'mahesh.joshi@gmail.com',
    photo: studentPhotos['Vihaan Joshi'],
    totalFee: 93000,
    approvedConcession: 0,
    netPayable: 93000,
    totalPaid: 31000,
    outstandingDue: 62000,
    advanceBalance: 0,
    status: 'Partially Paid',
    feeHeads: [
      { id: 'fh-1', headName: 'Tuition Fee', category: 'Academic', originalAmount: 55000, concessionAllocation: 0, netPayable: 55000, amountPaid: 16000, outstandingDue: 39000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Partially Paid' },
      { id: 'fh-2', headName: 'Admission Fee', category: 'Admission', originalAmount: 15000, concessionAllocation: 0, netPayable: 15000, amountPaid: 15000, outstandingDue: 0, dueDate: '31 May 2026', status: 'Paid' },
      { id: 'fh-3', headName: 'Term Fee', category: 'Academic', originalAmount: 9000, concessionAllocation: 0, netPayable: 9000, amountPaid: 0, outstandingDue: 9000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Due' },
      { id: 'fh-4', headName: 'Activity Fee', category: 'Activity', originalAmount: 5000, concessionAllocation: 0, netPayable: 5000, amountPaid: 0, outstandingDue: 5000, dueDate: '10 Aug 2026', status: 'Due' },
      { id: 'fh-5', headName: 'Examination Fee', category: 'Examination', originalAmount: 3000, concessionAllocation: 0, netPayable: 3000, amountPaid: 0, outstandingDue: 3000, dueDate: '10 Aug 2026, 10 Nov 2026', status: 'Due' },
      { id: 'fh-6', headName: 'Transport Fee', category: 'Transport', originalAmount: 6000, concessionAllocation: 0, netPayable: 6000, amountPaid: 0, outstandingDue: 6000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Due' },
    ],
    installments: [
      { id: 'inst-1', installmentNumber: 1, installmentName: 'First Instalment (Term 1 & Admission)', dueDate: '2026-05-31', amountPayable: 31000, amountPaid: 31000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-2', installmentNumber: 2, installmentName: 'Second Instalment (Term 2 Tuition)', dueDate: '2026-08-10', amountPayable: 31000, amountPaid: 0, remainingAmount: 31000, status: 'Due' },
      { id: 'inst-3', installmentNumber: 3, installmentName: 'Third Instalment (Term 3 & Final Exam)', dueDate: '2026-11-10', amountPayable: 31000, amountPaid: 0, remainingAmount: 31000, status: 'Due' },
    ],
    transactions: [
      { id: 'tx-1', receiptNo: 'RCP-2026-04410', date: '2026-05-29', time: '11:20 AM', allocation: 'First Instalment', amount: 31000, mode: 'Bank Transfer', transactionRef: 'NEFT-SBI-00918', receivedBy: 'Suresh Bhat (Chief Accountant)', status: 'Cleared' },
    ],
    concessions: [],
    initializedAt: '2026-04-05',
    lastUpdated: '2026-05-29',
  },

  // 8. Myra Singh - Class 7-B (Sports Scholarship Concession)
  {
    id: 'LEDGER-2026-008',
    studentId: 'STU-2026-0149',
    studentName: 'Myra Singh',
    grNumber: 'GR-9892',
    rollNumber: '11',
    class: 'Class 7',
    section: 'B',
    academicYear: '2026-2027',
    parentName: 'Dilip Singh',
    parentPhone: '+91 98921 55670',
    parentEmail: 'dilip.singh@tcs.com',
    photo: studentPhotos['Myra Singh'],
    totalFee: 93000,
    approvedConcession: 15000,
    netPayable: 78000,
    totalPaid: 52000,
    outstandingDue: 26000,
    advanceBalance: 0,
    status: 'Partially Paid',
    feeHeads: [
      { id: 'fh-1', headName: 'Tuition Fee', category: 'Academic', originalAmount: 55000, concessionAllocation: 15000, netPayable: 40000, amountPaid: 30000, outstandingDue: 10000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Partially Paid' },
      { id: 'fh-2', headName: 'Admission Fee', category: 'Admission', originalAmount: 15000, concessionAllocation: 0, netPayable: 15000, amountPaid: 15000, outstandingDue: 0, dueDate: '31 May 2026', status: 'Paid' },
      { id: 'fh-3', headName: 'Term Fee', category: 'Academic', originalAmount: 9000, concessionAllocation: 0, netPayable: 9000, amountPaid: 7000, outstandingDue: 2000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Partially Paid' },
      { id: 'fh-4', headName: 'Activity Fee', category: 'Activity', originalAmount: 5000, concessionAllocation: 0, netPayable: 5000, amountPaid: 0, outstandingDue: 5000, dueDate: '10 Aug 2026', status: 'Due' },
      { id: 'fh-5', headName: 'Examination Fee', category: 'Examination', originalAmount: 3000, concessionAllocation: 0, netPayable: 3000, amountPaid: 0, outstandingDue: 3000, dueDate: '10 Aug 2026, 10 Nov 2026', status: 'Due' },
      { id: 'fh-6', headName: 'Transport Fee', category: 'Transport', originalAmount: 6000, concessionAllocation: 0, netPayable: 6000, amountPaid: 0, outstandingDue: 6000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Due' },
    ],
    installments: [
      { id: 'inst-1', installmentNumber: 1, installmentName: 'First Instalment (Term 1 & Admission)', dueDate: '2026-05-31', amountPayable: 26000, amountPaid: 26000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-2', installmentNumber: 2, installmentName: 'Second Instalment (Term 2 Tuition)', dueDate: '2026-08-10', amountPayable: 26000, amountPaid: 26000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-3', installmentNumber: 3, installmentName: 'Third Instalment (Term 3 & Final Exam)', dueDate: '2026-11-10', amountPayable: 26000, amountPaid: 0, remainingAmount: 26000, status: 'Due' },
    ],
    transactions: [
      { id: 'tx-1', receiptNo: 'RCP-2026-04190', date: '2026-05-24', time: '03:40 PM', allocation: 'First Instalment', amount: 26000, mode: 'Online', transactionRef: 'PAY-ONLINE-3381', receivedBy: 'Payment Gateway (Razorpay)', status: 'Successful' },
      { id: 'tx-2', receiptNo: 'RCP-2026-05202', date: '2026-08-08', time: '11:15 AM', allocation: 'Second Instalment', amount: 26000, mode: 'UPI', transactionRef: 'UPI-20260808-9921', receivedBy: 'Suresh Bhat (Chief Accountant)', status: 'Successful' },
    ],
    concessions: [
      { id: 'cnc-1', type: 'Sports Excellence', amount: 15000, reason: 'National Interschool Swimming Gold Medalist', status: 'Approved', approvedBy: 'Sports Committee & Principal', approvalDate: '2026-04-15' },
    ],
    initializedAt: '2026-04-05',
    lastUpdated: '2026-08-08',
  },

  // 9. Kabir Mehta - Class 6-A (Overpaid by 1,000 -> Advance Credit Balance)
  {
    id: 'LEDGER-2026-009',
    studentId: 'STU-2026-0150',
    studentName: 'Kabir Mehta',
    grNumber: 'GR-9901',
    rollNumber: '09',
    class: 'Class 6',
    section: 'A',
    academicYear: '2026-2027',
    parentName: 'Nitin Mehta',
    parentPhone: '+91 98200 44122',
    parentEmail: 'nitin.mehta@yahoo.com',
    totalFee: 84000,
    approvedConcession: 0,
    netPayable: 84000,
    totalPaid: 85000,
    outstandingDue: 0,
    advanceBalance: 1000, // Overpayment handled via Advance Balance!
    status: 'Paid',
    feeHeads: [
      { id: 'fh-1', headName: 'Tuition Fee', category: 'Academic', originalAmount: 50000, concessionAllocation: 0, netPayable: 50000, amountPaid: 50000, outstandingDue: 0, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Paid' },
      { id: 'fh-2', headName: 'Admission Fee', category: 'Admission', originalAmount: 12000, concessionAllocation: 0, netPayable: 12000, amountPaid: 12000, outstandingDue: 0, dueDate: '31 May 2026', status: 'Paid' },
      { id: 'fh-3', headName: 'Term Fee', category: 'Academic', originalAmount: 8000, concessionAllocation: 0, netPayable: 8000, amountPaid: 8000, outstandingDue: 0, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Paid' },
      { id: 'fh-4', headName: 'Activity Fee', category: 'Activity', originalAmount: 5000, concessionAllocation: 0, netPayable: 5000, amountPaid: 5000, outstandingDue: 0, dueDate: '10 Aug 2026', status: 'Paid' },
      { id: 'fh-5', headName: 'Examination Fee', category: 'Examination', originalAmount: 3000, concessionAllocation: 0, netPayable: 3000, amountPaid: 3000, outstandingDue: 0, dueDate: '10 Aug 2026, 10 Nov 2026', status: 'Paid' },
      { id: 'fh-6', headName: 'Transport Fee', category: 'Transport', originalAmount: 6000, concessionAllocation: 0, netPayable: 6000, amountPaid: 7000, outstandingDue: 0, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Paid' },
    ],
    installments: [
      { id: 'inst-1', installmentNumber: 1, installmentName: 'First Instalment (Term 1 & Admission)', dueDate: '2026-05-31', amountPayable: 28000, amountPaid: 28000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-2', installmentNumber: 2, installmentName: 'Second Instalment (Term 2 Tuition)', dueDate: '2026-08-10', amountPayable: 28000, amountPaid: 28000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-3', installmentNumber: 3, installmentName: 'Third Instalment (Term 3 & Final Exam)', dueDate: '2026-11-10', amountPayable: 28000, amountPaid: 29000, remainingAmount: 0, status: 'Paid' },
    ],
    transactions: [
      { id: 'tx-1', receiptNo: 'RCP-2026-03819', date: '2026-05-15', time: '10:15 AM', allocation: 'Full Advance Annual Clearance with Excess Deposit', amount: 85000, mode: 'Bank Transfer', transactionRef: 'NEFT-AXIS-99210', receivedBy: 'Suresh Bhat (Chief Accountant)', status: 'Cleared', remarks: 'Rs. 1,000 recorded into student ledger credit wallet' },
    ],
    concessions: [],
    initializedAt: '2026-04-02',
    lastUpdated: '2026-05-15',
  },

  // 10. Devansh Trivedi - Class 1-A (Partially Paid - Inactive Student)
  {
    id: 'LEDGER-2026-010',
    studentId: 'STU-2026-0154',
    studentName: 'Devansh Trivedi',
    studentStatus: 'Inactive',
    grNumber: 'GR-9940',
    rollNumber: '08',
    class: 'Class 1',
    section: 'A',
    academicYear: '2026-2027',
    parentName: 'Jatin Trivedi',
    parentPhone: '+91 98240 11982',
    parentEmail: 'jatin.trivedi@gmail.com',
    totalFee: 45000,
    approvedConcession: 0,
    netPayable: 45000,
    totalPaid: 15000,
    outstandingDue: 30000,
    advanceBalance: 0,
    status: 'Partially Paid',
    feeHeads: [
      { id: 'fh-1', headName: 'Tuition Fee', category: 'Academic', originalAmount: 20000, concessionAllocation: 0, netPayable: 20000, amountPaid: 5000, outstandingDue: 15000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Partially Paid' },
      { id: 'fh-2', headName: 'Admission Fee', category: 'Admission', originalAmount: 10000, concessionAllocation: 0, netPayable: 10000, amountPaid: 10000, outstandingDue: 0, dueDate: '31 May 2026', status: 'Paid' },
      { id: 'fh-3', headName: 'Term Fee', category: 'Academic', originalAmount: 5000, concessionAllocation: 0, netPayable: 5000, amountPaid: 0, outstandingDue: 5000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Due' },
      { id: 'fh-4', headName: 'Activity Fee', category: 'Activity', originalAmount: 3000, concessionAllocation: 0, netPayable: 3000, amountPaid: 0, outstandingDue: 3000, dueDate: '10 Aug 2026', status: 'Due' },
      { id: 'fh-5', headName: 'Examination Fee', category: 'Examination', originalAmount: 2000, concessionAllocation: 0, netPayable: 2000, amountPaid: 0, outstandingDue: 2000, dueDate: '10 Aug 2026, 10 Nov 2026', status: 'Due' },
      { id: 'fh-6', headName: 'Transport Fee', category: 'Transport', originalAmount: 5000, concessionAllocation: 0, netPayable: 5000, amountPaid: 0, outstandingDue: 5000, dueDate: '31 May 2026, 10 Aug 2026, 10 Nov 2026', status: 'Due' },
    ],
    installments: [
      { id: 'inst-1', installmentNumber: 1, installmentName: 'First Instalment (Term 1 & Admission)', dueDate: '2026-05-31', amountPayable: 15000, amountPaid: 15000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-2', installmentNumber: 2, installmentName: 'Second Instalment (Term 2 Tuition)', dueDate: '2026-08-10', amountPayable: 15000, amountPaid: 0, remainingAmount: 15000, status: 'Due' },
      { id: 'inst-3', installmentNumber: 3, installmentName: 'Third Instalment (Term 3 & Final Exam)', dueDate: '2026-11-10', amountPayable: 15000, amountPaid: 0, remainingAmount: 15000, status: 'Due' },
    ],
    transactions: [
      { id: 'tx-1', receiptNo: 'RCP-2026-04612', date: '2026-05-31', time: '11:30 AM', allocation: 'First Instalment', amount: 15000, mode: 'UPI', transactionRef: 'UPI-20260531-1029', receivedBy: 'Suresh Bhat (Cash Counter 1)', status: 'Successful' },
    ],
    concessions: [],
    initializedAt: '2026-04-08',
    lastUpdated: '2026-05-31',
  },

  // 11. Aarav Sharma - Class 7-A (Academic Year 2025-2026 Historical Record)
  {
    id: 'LEDGER-2025-001',
    studentId: 'STU-2026-0142',
    studentName: 'Aarav Sharma',
    grNumber: 'GR-9821',
    rollNumber: '07',
    class: 'Class 7',
    section: 'A',
    academicYear: '2025-2026',
    parentName: 'Rajesh Sharma',
    parentPhone: '+91 98765 43210',
    parentEmail: 'rajesh.sharma@gmail.com',
    photo: studentPhotos['Aarav Sharma'],
    totalFee: 90000,
    approvedConcession: 5000,
    netPayable: 85000,
    totalPaid: 85000,
    outstandingDue: 0,
    advanceBalance: 0,
    status: 'Paid',
    feeHeads: [
      { id: 'fh-1', headName: 'Tuition Fee', category: 'Academic', originalAmount: 55000, concessionAllocation: 5000, netPayable: 50000, amountPaid: 50000, outstandingDue: 0, dueDate: '31 May 2025, 10 Aug 2025, 10 Nov 2025', status: 'Paid' },
      { id: 'fh-2', headName: 'Admission Fee', category: 'Admission', originalAmount: 15000, concessionAllocation: 0, netPayable: 15000, amountPaid: 15000, outstandingDue: 0, dueDate: '31 May 2025', status: 'Paid' },
      { id: 'fh-3', headName: 'Term Fee', category: 'Academic', originalAmount: 8000, concessionAllocation: 0, netPayable: 8000, amountPaid: 8000, outstandingDue: 0, dueDate: '31 May 2025, 10 Aug 2025, 10 Nov 2025', status: 'Paid' },
      { id: 'fh-4', headName: 'Activity Fee', category: 'Activity', originalAmount: 4500, concessionAllocation: 0, netPayable: 4500, amountPaid: 4500, outstandingDue: 0, dueDate: '10 Aug 2025', status: 'Paid' },
      { id: 'fh-5', headName: 'Examination Fee', category: 'Examination', originalAmount: 2500, concessionAllocation: 0, netPayable: 2500, amountPaid: 2500, outstandingDue: 0, dueDate: '10 Aug 2025, 10 Nov 2025', status: 'Paid' },
      { id: 'fh-6', headName: 'Transport Fee', category: 'Transport', originalAmount: 5000, concessionAllocation: 0, netPayable: 5000, amountPaid: 5000, outstandingDue: 0, dueDate: '31 May 2025, 10 Aug 2025, 10 Nov 2025', status: 'Paid' },
    ],
    installments: [
      { id: 'inst-1', installmentNumber: 1, installmentName: 'First Instalment', dueDate: '2025-05-31', amountPayable: 29000, amountPaid: 29000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-2', installmentNumber: 2, installmentName: 'Second Instalment', dueDate: '2025-08-10', amountPayable: 28000, amountPaid: 28000, remainingAmount: 0, status: 'Paid' },
      { id: 'inst-3', installmentNumber: 3, installmentName: 'Third Instalment', dueDate: '2025-11-10', amountPayable: 28000, amountPaid: 28000, remainingAmount: 0, status: 'Paid' },
    ],
    transactions: [
      { id: 'tx-1', receiptNo: 'RCP-2025-01290', date: '2025-05-22', time: '11:00 AM', allocation: 'First Instalment', amount: 29000, mode: 'Online', transactionRef: 'PAY-ONL-12908', receivedBy: 'Payment Gateway', status: 'Successful' },
      { id: 'tx-2', receiptNo: 'RCP-2025-02104', date: '2025-08-04', time: '02:30 PM', allocation: 'Second Instalment', amount: 28000, mode: 'Bank Transfer', transactionRef: 'NEFT-88412', receivedBy: 'Suresh Bhat', status: 'Cleared' },
      { id: 'tx-3', receiptNo: 'RCP-2025-03411', date: '2025-11-08', time: '09:45 AM', allocation: 'Third Instalment', amount: 28000, mode: 'UPI', transactionRef: 'UPI-20251108-984', receivedBy: 'Suresh Bhat', status: 'Successful' },
    ],
    concessions: [
      { id: 'cnc-1', type: 'Sibling Discount', amount: 5000, reason: 'Sibling benefit continuation', status: 'Approved', approvedBy: 'Principal Dr. R. K. Iyer', approvalDate: '2025-04-10' },
    ],
    initializedAt: '2025-04-01',
    lastUpdated: '2025-11-08',
  },
];

// Helper styles for status badges
const STATUS_STYLES: Record<LedgerFeeStatus, { bg: string; text: string; border: string; dot: string }> = {
  Paid: { bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]', border: 'border-[#BBF7D0]', dot: 'bg-[#16A34A]' },
  'Partially Paid': { bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]', border: 'border-[#FDE68A]', dot: 'bg-[#D97706]' },
  Due: { bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]', border: 'border-[#BFDBFE]', dot: 'bg-[#2563EB]' },
  Overdue: { bg: 'bg-[#FFF1F2]', text: 'text-[#BE123C]', border: 'border-[#FECDD3]', dot: 'bg-[#E11D48]' },
};

// Helper to get formatted due date
const getAccountDueDate = (acc: StudentFeeLedgerAccount): string => {
  if (acc.dueDate) return acc.dueDate;
  if (acc.outstandingDue === 0) return 'Settled';
  const pendingInst = acc.installments?.find(i => i.remainingAmount > 0);
  return pendingInst?.dueDate || '—';
};

// Helper to get payment method summary
const getAccountPaymentMethod = (acc: StudentFeeLedgerAccount): string => {
  if (acc.paymentMethod) return acc.paymentMethod;
  if (acc.transactions && acc.transactions.length > 0) {
    const validModes = Array.from(new Set(acc.transactions.filter(t => t.status !== 'Bounced').map(t => t.mode)));
    if (validModes.length > 0) return validModes.join(', ');
  }
  return '—';
};

// Reusable MetricSparkline component for financial summary cards (Parent Portal Dashboard style)
function MetricSparkline({
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
  const pillWidth = label.length > 3 ? 34 : 28;
  const halfWidth = pillWidth / 2;

  return (
    <svg viewBox="0 0 130 52" className="w-24 sm:w-28 h-11 overflow-visible shrink-0">
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${fillId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={peakX} cy={peakY} r="3.5" fill={color} stroke="#FFFFFF" strokeWidth="2" />
      <g transform={`translate(${peakX}, ${peakY})`}>
        <rect
          x={-halfWidth}
          y="-19"
          width={pillWidth}
          height="14"
          rx="7"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="1"
          filter="drop-shadow(0 1px 2px #0000000F)"
        />
        <text x="0" y="-9" textAnchor="middle" fontSize="8" fontWeight="700" fill="#475569">
          {label}
        </text>
      </g>
    </svg>
  );
}

export function StudentFeeLedger() {
  const [ledgers, setLedgers] = useState<StudentFeeLedgerAccount[]>(INITIAL_LEDGERS);
  const [selectedLedgerId, setSelectedLedgerId] = useState<string | null>(null);
  const [detailSelectedYear, setDetailSelectedYear] = useState<string>('2026-2027');

  // Statement View Installments Search
  const [installmentSearchQuery, setInstallmentSearchQuery] = useState('');

  // Filters & Search
  const [filterAcademicYear, setFilterAcademicYear] = useState('2026-2027');
  const [filterClass, setFilterClass] = useState('All');
  const [filterSection, setFilterSection] = useState('All');
  const [filterStudentStatus, setFilterStudentStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<'name' | 'class' | 'total' | 'due' | 'paid'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [showInitModal, setShowInitModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [collectTargetLedger, setCollectTargetLedger] = useState<StudentFeeLedgerAccount | null>(null);

  // Initialize Ledger Form State
  const [initYear, setInitYear] = useState('2026-2027');
  const [initSelectedStudentId, setInitSelectedStudentId] = useState('');
  const [initConcessionType, setInitConcessionType] = useState('None');
  const [initConcessionAmount, setInitConcessionAmount] = useState<number>(0);
  const [initConcessionReason, setInitConcessionReason] = useState('');
  const [initConcessionStatus, setInitConcessionStatus] = useState<'Approved' | 'Pending' | 'Rejected'>('Approved');
  const [initConcessionApprover, setInitConcessionApprover] = useState('Principal Dr. R. K. Iyer');
  const [initInstalmentCount, setInitInstalmentCount] = useState<number>(3);

  // Quick Fee Collection Form State
  const [collectAmount, setCollectAmount] = useState<number | ''>('');
  const [collectMode, setCollectMode] = useState<'Online' | 'Cash' | 'Cheque' | 'UPI' | 'Bank Transfer'>('Cash');
  const [collectAllocation, setCollectAllocation] = useState('');
  const [collectRef, setCollectRef] = useState('');
  const [collectRemarks, setCollectRemarks] = useState('');

  // Primary account selected by user
  const primaryAccount = useMemo(() => {
    if (!selectedLedgerId) return null;
    return ledgers.find(l => l.id === selectedLedgerId) || null;
  }, [ledgers, selectedLedgerId]);

  useEffect(() => {
    if (primaryAccount) {
      setDetailSelectedYear(primaryAccount.academicYear);
      setInstallmentSearchQuery('');
    }
  }, [primaryAccount]);

  // Available standards / academic years for the selected student
  const availableStandards = useMemo(() => {
    if (!primaryAccount) return [];
    const currentNumMatch = primaryAccount.class.match(/\d+/);
    const currentNum = currentNumMatch ? parseInt(currentNumMatch[0], 10) : 8;

    return [
      {
        year: '2026-2027',
        class: primaryAccount.class,
        label: `${primaryAccount.class} · 2026-2027 (Current Standard)`,
      },
      {
        year: '2025-2026',
        class: currentNum > 1 ? `Class ${currentNum - 1}` : 'Class 1',
        label: `${currentNum > 1 ? `Class ${currentNum - 1}` : 'Class 1'} · 2025-2026 (Previous Standard)`,
      },
      {
        year: '2024-2025',
        class: currentNum > 2 ? `Class ${currentNum - 2}` : 'Class 1',
        label: `${currentNum > 2 ? `Class ${currentNum - 2}` : 'Class 1'} · 2024-2025 (Historical Standard)`,
      },
    ];
  }, [primaryAccount]);

  // Derived account based on chosen standard/year
  const displayAccount = useMemo(() => {
    if (!primaryAccount) return null;
    if (detailSelectedYear === primaryAccount.academicYear) {
      return primaryAccount;
    }

    // Check if an explicit ledger already exists for this student & year
    const existing = ledgers.find(
      l => l.studentId === primaryAccount.studentId && l.academicYear === detailSelectedYear
    );
    if (existing) return existing;

    // Generate historical standard record
    const stdInfo = availableStandards.find(s => s.year === detailSelectedYear) || availableStandards[0];
    const preset = CLASS_FEE_PRESETS[stdInfo.class] || CLASS_FEE_PRESETS['Class 7'];
    const startYr = detailSelectedYear.split('-')[0] || '2025';

    const feeHeads: FeeHeadBreakdown[] = preset.heads.map((h, i) => ({
      id: `fh-hist-${i + 1}`,
      headName: h.name,
      category: h.category,
      originalAmount: h.amount,
      concessionAllocation: 0,
      netPayable: h.amount,
      amountPaid: h.amount,
      outstandingDue: 0,
      dueDate: `31 May ${startYr}, 10 Aug ${startYr}, 10 Nov ${startYr}`,
      paymentMethod: 'UPI',
      status: 'Paid',
    }));

    const instAmt = Math.round(preset.total / 3);
    const installments: LedgerInstallment[] = [
      { id: 'inst-h1', installmentNumber: 1, installmentName: 'First Instalment (Term 1 & Admission)', dueDate: `${startYr}-05-31`, amountPayable: instAmt, amountPaid: instAmt, remainingAmount: 0, paymentMethod: 'UPI', status: 'Paid' },
      { id: 'inst-h2', installmentNumber: 2, installmentName: 'Second Instalment (Term 2 Tuition)', dueDate: `${startYr}-08-10`, amountPayable: instAmt, amountPaid: instAmt, remainingAmount: 0, paymentMethod: 'Bank Transfer', status: 'Paid' },
      { id: 'inst-h3', installmentNumber: 3, installmentName: 'Third Instalment (Term 3 & Final Exam)', dueDate: `${startYr}-11-10`, amountPayable: preset.total - (instAmt * 2), amountPaid: preset.total - (instAmt * 2), remainingAmount: 0, paymentMethod: 'Online', status: 'Paid' },
    ];

    const histAccount: StudentFeeLedgerAccount = {
      ...primaryAccount,
      id: `HIST-${detailSelectedYear}-${primaryAccount.studentId}`,
      academicYear: detailSelectedYear,
      class: stdInfo.class,
      totalFee: preset.total,
      approvedConcession: 0,
      netPayable: preset.total,
      totalPaid: preset.total,
      outstandingDue: 0,
      advanceBalance: 0,
      status: 'Paid',
      feeHeads,
      installments,
      transactions: [
        { id: `tx-h1`, receiptNo: `RCP-${startYr}-0192`, date: `${startYr}-05-25`, allocation: 'First Instalment', amount: instAmt, mode: 'UPI', transactionRef: `UPI-${startYr}0525`, receivedBy: 'Suresh Bhat', status: 'Successful' },
        { id: `tx-h2`, receiptNo: `RCP-${startYr}-0384`, date: `${startYr}-08-04`, allocation: 'Second Instalment', amount: instAmt, mode: 'Bank Transfer', transactionRef: `NEFT-${startYr}0804`, receivedBy: 'Suresh Bhat', status: 'Cleared' },
        { id: `tx-h3`, receiptNo: `RCP-${startYr}-0591`, date: `${startYr}-11-08`, allocation: 'Third Instalment', amount: preset.total - (instAmt * 2), mode: 'Online', transactionRef: `PAY-${startYr}1108`, receivedBy: 'Razorpay', status: 'Successful' },
      ],
      concessions: [],
      dueDate: 'Settled',
      paymentMethod: 'UPI, Bank Transfer, Online',
    };

    return histAccount;
  }, [primaryAccount, detailSelectedYear, ledgers, availableStandards]);

  // Derived Filtered & Sorted Ledgers
  const filteredLedgers = useMemo(() => {
    return ledgers
      .filter(l => {
        const matchesYear = filterAcademicYear === 'All' || l.academicYear === filterAcademicYear;
        const matchesClass = filterClass === 'All' || l.class === filterClass;
        const matchesSection = filterSection === 'All' || l.section === filterSection;
        const studentStatus = l.studentStatus || 'Active';
        const matchesStudentStatus = filterStudentStatus === 'All' || studentStatus === filterStudentStatus;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          l.studentName.toLowerCase().includes(q) ||
          l.studentId.toLowerCase().includes(q) ||
          l.grNumber.toLowerCase().includes(q) ||
          l.rollNumber.toLowerCase().includes(q) ||
          l.parentName.toLowerCase().includes(q);

        return matchesYear && matchesClass && matchesSection && matchesStudentStatus && matchesSearch;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'name') cmp = a.studentName.localeCompare(b.studentName);
        else if (sortBy === 'class') cmp = a.class.localeCompare(b.class);
        else if (sortBy === 'total') cmp = a.totalFee - b.totalFee;
        else if (sortBy === 'due') cmp = a.outstandingDue - b.outstandingDue;
        else if (sortBy === 'paid') cmp = a.totalPaid - b.totalPaid;
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [ledgers, filterAcademicYear, filterClass, filterSection, filterStudentStatus, searchQuery, sortBy, sortOrder]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredLedgers.length / pageSize));
  const paginatedLedgers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLedgers.slice(start, start + pageSize);
  }, [filteredLedgers, currentPage, pageSize]);

  // Handle Sort Change
  const handleToggleSort = (field: 'name' | 'class' | 'total' | 'due' | 'paid') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Execute Fee Collection & Automatically Print Receipt
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectTargetLedger || !collectAmount || Number(collectAmount) <= 0) {
      showToast('Please enter a valid payment amount', 'error');
      return;
    }

    const payAmt = Number(collectAmount);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextReceiptNo = `RCP-${now.getFullYear()}-${String(Math.floor(10000 + Math.random() * 90000))}`;

    const newTxn: LedgerTransaction = {
      id: `tx-${Date.now()}`,
      receiptNo: nextReceiptNo,
      date: dateStr,
      time: timeStr,
      allocation: collectAllocation,
      amount: payAmt,
      mode: collectMode,
      transactionRef: collectRef.trim() || `TXN-${Date.now()}`,
      receivedBy: 'Suresh Bhat (Chief Accountant)',
      status: 'Successful',
      remarks: collectRemarks.trim() || undefined,
    };

    setLedgers(prev =>
      prev.map(account => {
        if (account.id !== collectTargetLedger.id) return account;

        const newTotalPaid = account.totalPaid + payAmt;
        const newOutstandingDue = Math.max(0, account.netPayable - newTotalPaid);
        const newAdvanceBalance = Math.max(0, newTotalPaid - account.netPayable);

        let newStatus: LedgerFeeStatus = 'Partially Paid';
        if (newOutstandingDue === 0) newStatus = 'Paid';
        else if (account.installments.some(i => i.status === 'Overdue' && i.remainingAmount > payAmt)) {
          newStatus = 'Overdue';
        }

        // Allocate payment across installments
        let remainingToDistribute = payAmt;
        const updatedInstallments = account.installments.map(inst => {
          if (remainingToDistribute <= 0) return inst;
          const needed = inst.remainingAmount;
          if (needed <= 0) return inst;

          const alloc = Math.min(needed, remainingToDistribute);
          remainingToDistribute -= alloc;
          const instPaid = inst.amountPaid + alloc;
          const instRemaining = Math.max(0, inst.amountPayable - instPaid);

          return {
            ...inst,
            amountPaid: instPaid,
            remainingAmount: instRemaining,
            status: (instRemaining === 0 ? 'Paid' : 'Partially Paid') as LedgerFeeStatus,
          };
        });

        // Allocate payment to matching fee head if applicable
        let headRemaining = payAmt;
        const updatedFeeHeads = account.feeHeads.map(head => {
          if (headRemaining <= 0) return head;
          if (head.headName === collectAllocation || head.outstandingDue > 0) {
            const alloc = Math.min(head.outstandingDue, headRemaining);
            headRemaining -= alloc;
            const newHeadPaid = head.amountPaid + alloc;
            const newHeadDue = Math.max(0, head.netPayable - newHeadPaid);
            return {
              ...head,
              amountPaid: newHeadPaid,
              outstandingDue: newHeadDue,
              status: (newHeadDue === 0 ? 'Paid' : 'Partially Paid') as LedgerFeeStatus,
            };
          }
          return head;
        });

        return {
          ...account,
          totalPaid: newTotalPaid,
          outstandingDue: newOutstandingDue,
          advanceBalance: newAdvanceBalance,
          status: newStatus,
          installments: updatedInstallments,
          feeHeads: updatedFeeHeads,
          transactions: [newTxn, ...account.transactions],
          lastUpdated: dateStr,
        };
      })
    );

    setShowCollectModal(false);

    // Generate Official Fee Receipt PDF instantly
    generateReceiptPdf({
      receiptNo: nextReceiptNo,
      date: dateStr,
      time: timeStr,
      mode: collectMode,
      amount: payAmt,
      instalment: collectAllocation,
      transactionId: collectRef || `TXN-${nextReceiptNo}`,
      studentName: collectTargetLedger.studentName,
      class: collectTargetLedger.class,
      section: collectTargetLedger.section,
      rollNumber: collectTargetLedger.rollNumber,
      grNo: collectTargetLedger.grNumber,
      fatherName: collectTargetLedger.parentName,
      academicYear: collectTargetLedger.academicYear,
      status: 'PAID',
      balanceDue: Math.max(0, collectTargetLedger.netPayable - (collectTargetLedger.totalPaid + payAmt)),
    });

    showToast(`Payment of ₹${payAmt.toLocaleString('en-IN')} recorded! Receipt ${nextReceiptNo}.pdf downloaded.`, 'success');
  };

  // Open Initialize Form
  const handleOpenInitModal = () => {
    setInitYear(filterAcademicYear !== 'All' ? filterAcademicYear : '2026-2027');
    setInitSelectedStudentId(REGISTERED_STUDENTS[0]?.studentId || '');
    setInitConcessionType('None');
    setInitConcessionAmount(0);
    setInitConcessionReason('');
    setInitConcessionStatus('Approved');
    setInitConcessionApprover('Principal Dr. R. K. Iyer');
    setInitInstalmentCount(3);
    setShowInitModal(true);
  };

  // Selected student preview in Initialize modal
  const initStudentData = useMemo(() => {
    return REGISTERED_STUDENTS.find(s => s.studentId === initSelectedStudentId) || REGISTERED_STUDENTS[0];
  }, [initSelectedStudentId]);

  // Derived fee presets for the selected student's class
  const classFeePreset = useMemo(() => {
    if (!initStudentData) return CLASS_FEE_PRESETS['Class 8'];
    return CLASS_FEE_PRESETS[initStudentData.class] || CLASS_FEE_PRESETS['Class 8'];
  }, [initStudentData]);

  // Handle Initialize Ledger Submit
  const handleInitializeLedgerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initStudentData) {
      showToast('Please select a student record', 'error');
      return;
    }

    // Duplicate account check
    const exists = ledgers.some(
      l => l.studentId === initStudentData.studentId && l.academicYear === initYear
    );
    if (exists) {
      showToast(`A fee ledger for ${initStudentData.name} in academic year ${initYear} already exists!`, 'error');
      return;
    }

    const totalFee = classFeePreset.total;
    // Only approved concessions reduce Net Payable!
    const approvedConcession = initConcessionType !== 'None' && initConcessionStatus === 'Approved' ? Number(initConcessionAmount) : 0;
    const netPayable = Math.max(0, totalFee - approvedConcession);

    // Distribute concession over tuition fee head
    const feeHeads: FeeHeadBreakdown[] = classFeePreset.heads.map((h, i) => {
      const concAlloc = h.name === 'Tuition Fee' ? approvedConcession : 0;
      const headNet = Math.max(0, h.amount - concAlloc);
      return {
        id: `fh-${i + 1}`,
        headName: h.name,
        category: h.category,
        originalAmount: h.amount,
        concessionAllocation: concAlloc,
        netPayable: headNet,
        amountPaid: 0,
        outstandingDue: headNet,
        dueDate: `31 May ${initYear.split('-')[0] || '2026'}, 10 Aug ${initYear.split('-')[0] || '2026'}, 10 Nov ${initYear.split('-')[0] || '2026'}`,
        status: 'Due',
      };
    });

    // Generate instalments
    const count = initInstalmentCount || 3;
    const baseInstalment = Math.floor(netPayable / count);
    const remainder = netPayable % count;
    const startYr = initYear.split('-')[0] || '2026';

    const defaultDates = [
      `${startYr}-05-31`,
      `${startYr}-08-10`,
      `${startYr}-11-10`,
      `${Number(startYr) + 1}-01-10`,
    ];

    const installments: LedgerInstallment[] = Array.from({ length: count }, (_, i) => {
      const amt = i === 0 ? baseInstalment + remainder : baseInstalment;
      return {
        id: `inst-${i + 1}`,
        installmentNumber: i + 1,
        installmentName: count === 3 ? (i === 0 ? 'First Instalment (Term 1 & Admission)' : i === 1 ? 'Second Instalment (Term 2 Tuition)' : 'Third Instalment (Term 3 & Final Exam)') : `Instalment ${i + 1}`,
        dueDate: defaultDates[i] || `${startYr}-10-31`,
        amountPayable: amt,
        amountPaid: 0,
        remainingAmount: amt,
        status: 'Due',
      };
    });

    const concessions: LedgerConcession[] = [];
    if (initConcessionType !== 'None' && initConcessionAmount > 0) {
      concessions.push({
        id: `cnc-${Date.now()}`,
        type: initConcessionType,
        amount: Number(initConcessionAmount),
        reason: initConcessionReason.trim() || `${initConcessionType} concession grant`,
        status: initConcessionStatus,
        approvedBy: initConcessionStatus === 'Approved' ? initConcessionApprover : undefined,
        approvalDate: initConcessionStatus === 'Approved' ? new Date().toISOString().split('T')[0] : undefined,
      });
    }

    const newLedger: StudentFeeLedgerAccount = {
      id: `LEDGER-${initYear.split('-')[0]}-${String(ledgers.length + 1).padStart(3, '0')}`,
      studentId: initStudentData.studentId,
      studentName: initStudentData.name,
      grNumber: initStudentData.grNumber,
      rollNumber: initStudentData.rollNumber,
      class: initStudentData.class,
      section: initStudentData.section,
      academicYear: initYear,
      parentName: initStudentData.parentName,
      parentPhone: initStudentData.parentPhone,
      parentEmail: initStudentData.parentEmail,
      photo: initStudentData.photo,
      totalFee,
      approvedConcession,
      netPayable,
      totalPaid: 0,
      outstandingDue: netPayable,
      advanceBalance: 0,
      status: 'Due',
      feeHeads,
      installments,
      transactions: [],
      concessions,
      initializedAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setLedgers(prev => [newLedger, ...prev]);
    setShowInitModal(false);
    setSelectedLedgerId(newLedger.id);
    showToast(`Fee Ledger initialized successfully for ${initStudentData.name} (${initYear})!`, 'success');
  };

  // =========================================================================
  // VIEW: DEDICATED STUDENT LEDGER DETAIL PAGE (Fee Statement)
  // =========================================================================
  if (displayAccount) {
    const acc = displayAccount;
    const statusStyle = STATUS_STYLES[acc.status] || STATUS_STYLES.Due;
    const paidPercent = Math.min(100, Math.round((acc.totalPaid / (acc.totalFee || 1)) * 100));
    const duePercent = Math.min(100, Math.round((acc.outstandingDue / (acc.totalFee || 1)) * 100));

    // Filtered installments according to search query
    const filteredInstallments = acc.installments.filter(inst => {
      if (installmentSearchQuery.trim()) {
        const q = installmentSearchQuery.toLowerCase().trim();
        const paymentMethod = inst.paymentMethod || (inst.amountPaid > 0 ? (acc.transactions[0]?.mode || 'UPI') : '—');
        const matches =
          inst.installmentName.toLowerCase().includes(q) ||
          inst.dueDate.toLowerCase().includes(q) ||
          inst.status.toLowerCase().includes(q) ||
          paymentMethod.toLowerCase().includes(q) ||
          inst.amountPayable.toString().includes(q) ||
          inst.amountPaid.toString().includes(q) ||
          inst.remainingAmount.toString().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    return (
      <div className="animate-fade-in space-y-6 pb-12 text-left font-['Poppins']">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Breadcrumb items={['Accountant', 'Student Fee Ledger', acc.studentName]} />
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedLedgerId(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CBD5E1] bg-white text-[12px] font-semibold text-[#17153A] hover:bg-[#FAF7F2] hover:border-[#7C612A] hover:text-[#7C612A] transition-all cursor-pointer shadow-2xs"
              >
                <Icon name="ArrowLeft" size={14} />
                <span>Back to Student Fee Ledger</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                generateLedgerPdf(acc);
                showToast(`Ledger statement PDF for "${acc.studentName}" generated successfully!`, 'success');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold text-[#7C612A] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#E8DFC8] transition-colors cursor-pointer shadow-2xs"
              title="Download Student Statement PDF"
            >
              <Icon name="Download" size={14} />
              <span>Download Statement</span>
            </button>
          </div>
        </div>

        {/* 1. Student Profile Dossier Card - World-Class Professional ERP Header (Matching Parent Portal) */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card-soft p-5 sm:p-6 transition-all duration-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left: Avatar + Details */}
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Student Portrait - Circular Avatar with subtle ring */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 aspect-square rounded-full overflow-hidden border-2 border-[#E2E8F0] ring-2 ring-[#F1F5F9] bg-[#F1F5F9] flex items-center justify-center">
                  {acc.photo ? (
                    <img
                      src={acc.photo}
                      alt={acc.studentName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#17153A] text-white flex items-center justify-center text-[18px] font-bold">
                      {acc.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                </div>
              </div>

              {/* Student Identity */}
              <div>
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <h1 className="text-[20px] sm:text-[22px] font-bold text-[#17153A] tracking-tight">
                    {acc.studentName}
                  </h1>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[12px] font-semibold border ${acc.studentStatus === 'Inactive'
                    ? 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]'
                    : 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${acc.studentStatus === 'Inactive' ? 'bg-[#E11D48]' : 'bg-[#16A34A]'}`} />
                    {acc.studentStatus || 'Active'} Student
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[12px] font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    Fee Status: {acc.status}
                  </span>
                </div>

                {/* Clean Single-Row Metadata Bar with pipe dividers (Matching Parent Portal) */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#64748B] font-medium">
                  <span className="font-semibold text-[#17153A]">
                    {acc.class} · Section {acc.section}
                  </span>
                  <span className="text-[#CBD5E1]">|</span>
                  <span>Roll: <strong className="text-[#17153A] font-semibold">{acc.rollNumber}</strong></span>
                  <span className="text-[#CBD5E1]">|</span>
                  <span>GR No: <strong className="text-[#17153A] font-mono font-semibold">{acc.grNumber}</strong></span>
                  <span className="text-[#CBD5E1]">|</span>
                  <span>ID: <strong className="text-[#17153A] font-mono font-semibold">{acc.studentId}</strong></span>
                  {acc.parentName && (
                    <>
                      <span className="text-[#CBD5E1]">|</span>
                      <span>Parent: <strong className="text-[#17153A] font-semibold">{acc.parentName}</strong> ({acc.parentPhone})</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Clean Session Status Badge */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] font-semibold text-[#17153A]">
                <Icon name="Calendar" size={14} className="text-[#7C612A]" />
                <span className="text-[#64748B] font-normal">Session:</span> {detailSelectedYear}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Three Financial Summary Metric Cards (Parent Portal Dashboard Style with Sparklines) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Total Fee */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-[0_2px_12px_#0F172A08] p-5 hover:border-[#7C612A]/40 transition-all duration-200">
            <div className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
              Total Fee <span className="text-[#94A3B8] font-normal lowercase tracking-normal">/ session</span>
            </div>
            <div className="flex items-end justify-between mt-3">
              <div>
                <div className="text-[26px] sm:text-[28px] font-bold text-[#17153A] font-mono tracking-tight leading-none">
                  ₹{acc.totalFee.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-[#64748B] block mt-1.5 font-medium">
                  Assigned Class Fee ({acc.class})
                </span>
              </div>
              <MetricSparkline
                color="#7C612A"
                fillId={`spark-fee-${acc.id}`}
                linePath="M 4 38 C 22 40, 36 28, 56 32 C 76 36, 84 14, 100 14 C 112 14, 120 22, 126 20"
                areaPath="M 4 38 C 22 40, 36 28, 56 32 C 76 36, 84 14, 100 14 C 112 14, 120 22, 126 20 L 126 52 L 4 52 Z"
                peakX={100}
                peakY={14}
                label="100%"
              />
            </div>
          </div>

          {/* Card 2: Paid Amount */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-[0_2px_12px_#0F172A08] p-5 hover:border-[#10B981]/40 transition-all duration-200">
            <div className="text-[13px] font-bold text-[#15803D] uppercase tracking-wider">
              Paid Amount <span className="text-[#94A3B8] font-normal lowercase tracking-normal">/ settled</span>
            </div>
            <div className="flex items-end justify-between mt-3">
              <div>
                <div className="text-[26px] sm:text-[28px] font-bold text-[#15803D] font-mono tracking-tight leading-none">
                  ₹{acc.totalPaid.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-[#64748B] block mt-1.5 font-medium">
                  Settled Payment Receipts
                </span>
              </div>
              <MetricSparkline
                color="#10B981"
                fillId={`spark-paid-${acc.id}`}
                linePath="M 4 40 C 22 40, 36 30, 54 34 C 72 36, 82 20, 98 20 C 110 20, 118 26, 126 24"
                areaPath="M 4 40 C 22 40, 36 30, 54 34 C 72 36, 82 20, 98 20 C 110 20, 118 26, 126 24 L 126 52 L 4 52 Z"
                peakX={98}
                peakY={20}
                label={`${paidPercent}%`}
              />
            </div>
          </div>

          {/* Card 3: Pending Amount */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-[0_2px_12px_#0F172A08] p-5 hover:border-[#BE123C]/40 transition-all duration-200">
            <div className="text-[13px] font-bold text-[#BE123C] uppercase tracking-wider">
              Pending Amount <span className="text-[#94A3B8] font-normal lowercase tracking-normal">/ due</span>
            </div>
            <div className="flex items-end justify-between mt-3">
              <div>
                <div className="text-[26px] sm:text-[28px] font-bold text-[#BE123C] font-mono tracking-tight leading-none">
                  ₹{acc.outstandingDue.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-[#64748B] block mt-1.5 font-medium">
                  Outstanding Balance Due
                </span>
              </div>
              <MetricSparkline
                color="#BE123C"
                fillId={`spark-due-${acc.id}`}
                linePath="M 4 42 C 20 42, 34 34, 52 36 C 70 38, 80 22, 98 22 C 110 22, 118 28, 126 26"
                areaPath="M 4 42 C 20 42, 34 34, 52 36 C 70 38, 80 22, 98 22 C 110 22, 118 28, 126 26 L 126 52 L 4 52 Z"
                peakX={98}
                peakY={22}
                label={`${duePercent}%`}
              />
            </div>
          </div>
        </div>

        {/* 3. Outside Table Toolbar: Search & Academic Year Selection */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Search inside installments */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <input
              type="text"
              placeholder="Search installments, dates, amounts, status..."
              value={installmentSearchQuery}
              onChange={e => setInstallmentSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-8 text-[13px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors font-['Poppins'] placeholder:text-[#94A3B8] shadow-2xs"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
              <Icon name="Search" size={14} />
            </span>
            {installmentSearchQuery && (
              <button
                type="button"
                onClick={() => setInstallmentSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#17153A] cursor-pointer"
              >
                <Icon name="X" size={14} />
              </button>
            )}
          </div>

          {/* Academic Year Selection (Outside Table) */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <span className="text-[12px] font-semibold text-[#64748B] whitespace-nowrap">
              Academic Year:
            </span>
            <div className="relative min-w-[200px]">
              <select
                value={detailSelectedYear}
                onChange={e => setDetailSelectedYear(e.target.value)}
                className="w-full h-10 pl-3.5 pr-8 text-[13px] font-semibold rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer font-['Poppins'] shadow-2xs"
              >
                {availableStandards.map(std => (
                  <option key={std.year} value={std.year}>
                    {std.year} ({std.class})
                  </option>
                ))}
              </select>
              <Icon name="ChevronDown" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 4. Section: Installments Breakdown */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div>
                <h3 className="text-[15px] font-bold text-[#17153A]">
                  {detailSelectedYear} — Installments Schedule
                </h3>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-['Poppins']">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="py-3 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Installment</th>
                  <th className="py-3 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Due Date</th>
                  <th className="py-3 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Total Amount (₹)</th>
                  <th className="py-3 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Paid Amount (₹)</th>
                  <th className="py-3 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Pending Amount (₹)</th>
                  <th className="py-3 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Payment Method</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[13px]">
                {filteredInstallments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#64748B] text-[13px]">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <Icon name="Search" size={20} className="text-[#94A3B8]" />
                        <span>No installments match the search filter.</span>
                        {installmentSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setInstallmentSearchQuery('')}
                            className="mt-1 text-[12px] font-semibold text-[#7C612A] hover:underline cursor-pointer"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInstallments.map(inst => {
                    const instStyle = STATUS_STYLES[inst.status] || STATUS_STYLES.Due;
                    const paymentMethod = inst.paymentMethod || (inst.amountPaid > 0 ? (acc.transactions[0]?.mode || 'UPI') : '—');
                    return (
                      <tr key={inst.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#17153A]">
                          {inst.installmentName}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[12px] text-[#475569] whitespace-nowrap">
                          {inst.dueDate}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-semibold text-[#17153A]">
                          ₹{inst.amountPayable.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-semibold text-[#15803D]">
                          ₹{inst.amountPaid.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-[#BE123C]">
                          ₹{inst.remainingAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {paymentMethod !== '—' ? (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                              {paymentMethod}
                            </span>
                          ) : (
                            <span className="text-[12px] text-[#94A3B8]">Pending Payment</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${instStyle.bg} ${instStyle.text} ${instStyle.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${instStyle.dot}`} />
                            {inst.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Section: Fee Heads Breakdown */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div>
                <h3 className="text-[15px] font-bold text-[#17153A]">
                  Student Fee Heads Breakdown
                </h3>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-['Poppins']">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="py-3 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Fee Head</th>
                  <th className="py-3 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Category</th>
                  <th className="py-3 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Due Date</th>
                  <th className="py-3 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Total Amount (₹)</th>
                  <th className="py-3 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Paid Amount (₹)</th>
                  <th className="py-3 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Pending Amount (₹)</th>
                  <th className="py-3 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Payment Method</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[13px]">
                {acc.feeHeads.map(head => {
                  const headStyle = STATUS_STYLES[head.status] || STATUS_STYLES.Due;
                  const paymentMethod = head.paymentMethod || (head.amountPaid > 0 ? (acc.transactions[0]?.mode || 'Online') : '—');
                  return (
                    <tr key={head.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#17153A]">{head.headName}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]">
                          {head.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[12px] font-mono text-[#64748B] whitespace-nowrap">
                        {head.dueDate}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-semibold text-[#17153A]">
                        ₹{head.originalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-semibold text-[#15803D]">
                        ₹{head.amountPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-[#BE123C]">
                        ₹{head.outstandingDue.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {paymentMethod !== '—' ? (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                            {paymentMethod}
                          </span>
                        ) : (
                          <span className="text-[12px] text-[#94A3B8]">Pending Payment</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${headStyle.bg} ${headStyle.text} ${headStyle.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${headStyle.dot}`} />
                          {head.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-[#F8FAFC] border-t-2 border-[#E2E8F0] font-bold text-[13px] text-[#17153A]">
                  <td className="py-3.5 px-4" colSpan={3}>Total Fee Heads Reconciliation</td>
                  <td className="py-3.5 px-3 text-right font-mono">₹{acc.feeHeads.reduce((sum, h) => sum + h.originalAmount, 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-[#15803D]">₹{acc.feeHeads.reduce((sum, h) => sum + h.amountPaid, 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-[#BE123C]">₹{acc.feeHeads.reduce((sum, h) => sum + h.outstandingDue, 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3" colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: MAIN STUDENT FEE LEDGER INDEX PAGE
  // =========================================================================
  return (
    <div className="animate-fade-in space-y-6 pb-12 text-left font-['Poppins']">
      {/* 1. Header with Breadcrumbs & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant', 'Student Fee Ledger']} />
          <h1 className="text-[20px] sm:text-[22px] font-bold text-[#17153A] tracking-tight mt-1">
            Student Fee Ledger
          </h1>
        </div>
        <button
          type="button"
          onClick={handleOpenInitModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#7C612A] hover:bg-[#560110] text-white text-[13px] font-semibold rounded-xl transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Icon name="Plus" size={16} />
          <span>Initialize Ledger</span>
        </button>
      </div>



      {/* 2. Search & Multi-Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Search by student name, admission ID, GR number, or roll no..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
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

        {/* Academic Year Filter */}
        <div className="relative w-full sm:w-40 shrink-0">
          <select
            value={filterAcademicYear}
            onChange={e => {
              setFilterAcademicYear(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-3.5 pr-8 text-[13px] font-semibold rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer font-['Poppins']"
          >
            <option value="All">All Years</option>
            <option value="2026-2027">2026-2027 (Active)</option>
            <option value="2025-2026">2025-2026 (Previous)</option>
            <option value="2024-2025">2024-2025 (Historical)</option>
          </select>
          <Icon name="ChevronDown" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
        </div>

        {/* Class Filter */}
        <div className="relative w-full sm:w-36 shrink-0">
          <select
            value={filterClass}
            onChange={e => {
              setFilterClass(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-3.5 pr-8 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer font-['Poppins']"
          >
            <option value="All">All Classes</option>
            {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11-Sci', 'Class 12-Sci'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <Icon name="ChevronDown" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
        </div>

        {/* Section Filter */}
        <div className="relative w-full sm:w-32 shrink-0">
          <select
            value={filterSection}
            onChange={e => {
              setFilterSection(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-3.5 pr-8 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer font-['Poppins']"
          >
            <option value="All">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
          <Icon name="ChevronDown" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
        </div>

        {/* Student Status Filter (Active / Inactive in school) */}
        <div className="relative w-full sm:w-36 shrink-0">
          <select
            value={filterStudentStatus}
            onChange={e => {
              setFilterStudentStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-3.5 pr-8 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer font-['Poppins']"
          >
            <option value="All">All Students</option>
            <option value="Active">Active Students</option>
            <option value="Inactive">Inactive Students</option>
          </select>
          <Icon name="ChevronDown" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
        </div>

        {/* Reset Filters */}
        {(filterAcademicYear !== '2026-2027' || filterClass !== 'All' || filterSection !== 'All' || filterStudentStatus !== 'All' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setFilterAcademicYear('2026-2027');
              setFilterClass('All');
              setFilterSection('All');
              setFilterStudentStatus('All');
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className="h-10 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-[12px] font-semibold text-[#7C612A] hover:bg-[#FAF7F2] transition-colors cursor-pointer shrink-0"
            title="Reset Filters"
          >
            Reset
          </button>
        )}
      </div>

      {/* 3. Student Ledger Main Table Card */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[430px]">
          <table className="w-full border-collapse text-left font-['Poppins']">
            <thead className="sticky top-0 z-10 bg-[#F8FAFC] shadow-[0_1px_0_0_#E2E8F0]">
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {/* 1. Student Image */}
                <th className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] text-center w-14">
                  Photo
                </th>

                {/* 2. Name */}
                <th
                  onClick={() => handleToggleSort('name')}
                  className="py-3.5 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Name</span>
                  </div>
                </th>

                {/* 3. GR No. */}
                <th className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] whitespace-nowrap">
                  GR No.
                </th>

                {/* 4. Roll No. */}
                <th className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] text-center whitespace-nowrap">
                  Roll No.
                </th>

                {/* 5. Student ID */}
                <th className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] whitespace-nowrap">
                  Student ID
                </th>

                {/* 6. Class & Section */}
                <th
                  onClick={() => handleToggleSort('class')}
                  className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Class & Section</span>
                  </div>
                </th>

                {/* 8. Total Fee */}
                <th
                  onClick={() => handleToggleSort('total')}
                  className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Total Fee</span>
                  </div>
                </th>

                {/* 9. Paid Amount */}
                <th
                  onClick={() => handleToggleSort('paid')}
                  className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Paid Amount</span>
                  </div>
                </th>

                {/* 10. Pending Amount */}
                <th
                  onClick={() => handleToggleSort('due')}
                  className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Pending Amount</span>
                  </div>
                </th>

                {/* 11. Due Date */}
                <th className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] whitespace-nowrap">
                  Due Date
                </th>

                {/* 12. Payment Method */}
                <th className="py-3.5 px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-[0.6px] whitespace-nowrap">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {paginatedLedgers.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-[#64748B]">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#F1F5F9] text-[#94A3B8] flex items-center justify-center mb-3">
                        <Icon name="Search" size={22} />
                      </div>
                      <p className="text-[14px] font-semibold text-[#17153A]">No student fee ledgers match your criteria</p>
                      <p className="text-[12px] text-[#64748B] mt-1 max-w-sm">
                        Try adjusting your search keywords, class, academic year, or student status filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLedgers.map((acc, idx) => {
                  const paymentMethod = getAccountPaymentMethod(acc);
                  const dueDate = getAccountDueDate(acc);

                  return (
                    <tr
                      key={acc.id}
                      onClick={() => setSelectedLedgerId(acc.id)}
                      className={`hover:bg-[#F8FAFC] transition-colors cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FCFDFE]'}`}
                    >
                      {/* 1. Student Image */}
                      <td className="py-3 px-3 text-center">
                        {acc.photo ? (
                          <img
                            src={acc.photo}
                            alt={acc.studentName}
                            className="w-9 h-9 rounded-full object-cover border border-[#E8DFC8] inline-block shadow-2xs"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C612A] to-[#560110] text-white inline-flex items-center justify-center font-bold text-[12px] shadow-2xs select-none">
                            {acc.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                        )}
                      </td>

                      {/* 2. Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#17153A] text-[13px] text-right whitespace-nowrap">{acc.studentName}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${acc.studentStatus === 'Inactive'
                            ? 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]'
                            : 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${acc.studentStatus === 'Inactive' ? 'bg-[#E11D48]' : 'bg-[#16A34A]'}`} />
                            {acc.studentStatus || 'Active'}
                          </span>
                        </div>
                      </td>

                      {/* 3. GR No. */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-[12px] font-semibold text-[#7C612A]">
                        {acc.grNumber}
                      </td>

                      {/* 4. Roll No. */}
                      <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-[12px] text-[#64748B]">
                        {acc.rollNumber}
                      </td>

                      {/* 5. Student ID */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] font-medium text-[#17153A]">
                        {acc.studentId}
                      </td>

                      {/* 6. Class & Section */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="text-[12px] font-semibold text-[#17153A]">{acc.class}</span>
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1]">
                            {acc.section}
                          </span>
                        </div>
                      </td>

                      {/* 8. Total Fee */}
                      <td className="py-3 px-3 text-right whitespace-nowrap font-mono text-[13px] font-bold text-[#17153A]">
                        ₹{acc.totalFee.toLocaleString('en-IN')}
                      </td>

                      {/* 9. Paid Amount */}
                      <td className="py-3 px-3 text-right whitespace-nowrap font-mono text-[13px] font-bold text-[#15803D]">
                        ₹{acc.totalPaid.toLocaleString('en-IN')}
                      </td>

                      {/* 10. Pending Amount */}
                      <td className="py-3 px-3 text-right whitespace-nowrap font-mono text-[13px] font-bold text-[#BE123C]">
                        ₹{acc.outstandingDue.toLocaleString('en-IN')}
                      </td>

                      {/* 11. Due Date */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-[#64748B]">
                        {dueDate === 'Settled' ? (
                          <span className="text-[#15803D] font-semibold">Settled</span>
                        ) : (
                          dueDate
                        )}
                      </td>

                      {/* 12. Payment Method */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {paymentMethod !== '—' ? (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                            {paymentMethod}
                          </span>
                        ) : (
                          <span className="text-[12px] text-[#94A3B8]">Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[12px] text-[#64748B]">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-[#17153A]">{filteredLedgers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredLedgers.length)}</strong> of <strong className="text-[#17153A]">{filteredLedgers.length}</strong> student ledgers
            </span>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <span>Rows:</span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-7 px-2 text-[12px] font-bold rounded-lg border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 self-center sm:self-auto">
            <span>Page <strong className="text-[#17153A]">{currentPage}</strong> of <strong className="text-[#17153A]">{totalPages}</strong></span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#17153A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Icon name="ChevronLeft" size={13} />
              <span>Previous</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#17153A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <Icon name="ChevronRight" size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: INITIALIZE / ADD STUDENT FEE LEDGER */}
      {/* ========================================================================= */}
      {showInitModal && (
        <Modal
          open={showInitModal}
          onClose={() => setShowInitModal(false)}
          title="Initialize Student Fee Ledger"
          size="lg"
          className="max-w-3xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-[12px] text-[#64748B]">
                Reconciled Total: <strong className="text-[#17153A]">₹{(classFeePreset.total - (initConcessionType !== 'None' && initConcessionStatus === 'Approved' ? Number(initConcessionAmount) : 0)).toLocaleString('en-IN')}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowInitModal(false)}
                  className="px-4 py-2 text-[13px] font-semibold text-[#64748B] hover:text-[#17153A] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInitializeLedgerSubmit}
                  className="px-4 py-2 text-[13px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Initialize Ledger Account
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-5 p-1 max-h-[70vh] overflow-y-auto scrollbar-thin">
            {/* Section A: Student Information */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F5F9]">
                <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#7C612A] flex items-center justify-center">
                  <Icon name="User" size={15} />
                </div>
                <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                  Section A: Student Information
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Select
                  label="Academic Year"
                  required
                  options={[
                    { value: '2026-2027', label: '2026-2027 (Active Term)' },
                    { value: '2025-2026', label: '2025-2026 (Previous Term)' },
                    { value: '2024-2025', label: '2024-2025 (Historical Term)' },
                  ]}
                  value={initYear}
                  onChange={e => setInitYear(e.target.value)}
                />

                <Select
                  label="Select Student"
                  required
                  options={REGISTERED_STUDENTS.map(s => ({
                    value: s.studentId,
                    label: `${s.name} (${s.class}-${s.section} · ${s.studentId})`,
                  }))}
                  value={initSelectedStudentId}
                  onChange={e => setInitSelectedStudentId(e.target.value)}
                />
              </div>

              {/* Auto-populated Identity Pill */}
              {initStudentData && (
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-4 gap-2 text-[12px]">
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Admission ID</span>
                    <strong className="font-mono text-[#17153A]">{initStudentData.studentId}</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[11px]">GR Number</span>
                    <strong className="font-mono text-[#7C612A]">{initStudentData.grNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Class & Section</span>
                    <strong className="text-[#17153A]">{initStudentData.class} - {initStudentData.section}</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Guardian</span>
                    <strong className="text-[#17153A] truncate block">{initStudentData.parentName}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Section B: Fee Structure and Breakdown */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#7C612A] flex items-center justify-center">
                    <Icon name="Layers" size={15} />
                  </div>
                  <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                    Section B: Fee Structure & Assigned Heads ({initStudentData?.class})
                  </h4>
                </div>
                <span className="font-mono font-bold text-[13px] text-[#7C612A]">
                  Total: ₹{classFeePreset.total.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="divide-y divide-[#F1F5F9] text-[12px]">
                {classFeePreset.heads.map((h, i) => (
                  <div key={i} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#17153A]">{h.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F1F5F9] text-[#64748B]">
                        {h.category}
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-[#17153A]">₹{h.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section C: Concession Details */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F5F9]">
                <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#7C612A] flex items-center justify-center">
                  <Icon name="Percent" size={15} />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                    Section C: Concession Details
                  </h4>
                  <p className="text-[11px] text-[#64748B]">Only approved concessions will reduce net payable amount</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <Select
                  label="Concession Type"
                  options={[
                    { value: 'None', label: 'None (Standard Fee)' },
                    { value: 'Sibling Discount', label: 'Sibling Discount' },
                    { value: 'Merit Scholarship', label: 'Merit Scholarship' },
                    { value: 'Staff Ward', label: 'Staff Ward Allowance' },
                    { value: 'Financial Assistance', label: 'Financial Assistance' },
                    { value: 'Sports Excellence', label: 'Sports Excellence' },
                    { value: 'Girl Child Scholarship', label: 'Girl Child Scholarship' },
                  ]}
                  value={initConcessionType}
                  onChange={e => setInitConcessionType(e.target.value)}
                />

                <Input
                  label="Concession Amount (₹)"
                  type="number"
                  min="0"
                  disabled={initConcessionType === 'None'}
                  value={initConcessionAmount}
                  onChange={e => setInitConcessionAmount(Number(e.target.value))}
                />

                <Select
                  label="Approval Status"
                  disabled={initConcessionType === 'None'}
                  options={[
                    { value: 'Approved', label: 'Approved (Deducts Payable)' },
                    { value: 'Pending', label: 'Pending (Under Review)' },
                    { value: 'Rejected', label: 'Rejected' },
                  ]}
                  value={initConcessionStatus}
                  onChange={e => setInitConcessionStatus(e.target.value as 'Approved' | 'Pending' | 'Rejected')}
                />
              </div>

              {initConcessionType !== 'None' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Authorized Approver"
                    value={initConcessionApprover}
                    onChange={e => setInitConcessionApprover(e.target.value)}
                  />
                  <Input
                    label="Reason & Justification"
                    placeholder="e.g. Sibling enrolled in Class 5-B"
                    value={initConcessionReason}
                    onChange={e => setInitConcessionReason(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Section D: Installments & Due Schedule */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F5F9]">
                <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#7C612A] flex items-center justify-center">
                  <Icon name="Calendar" size={15} />
                </div>
                <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                  Section D: Installment Schedule Frequency
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                <Select
                  label="Number of Installments"
                  options={[
                    { value: '2', label: '2 Installments (Half-Yearly)' },
                    { value: '3', label: '3 Installments (Term-wise)' },
                    { value: '4', label: '4 Installments (Quarterly)' },
                  ]}
                  value={String(initInstalmentCount)}
                  onChange={e => setInitInstalmentCount(Number(e.target.value))}
                />

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[12px] text-[#7C612A]">
                  <span className="font-semibold block">Automatic Due Dates:</span>
                  <span>31 May {initYear.split('-')[0]}, 10 Aug {initYear.split('-')[0]}, 10 Nov {initYear.split('-')[0]}</span>
                </div>
              </div>
            </div>

            {/* Section E: Live Reconciled Financial Summary */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
              <div>
                <span className="text-[#64748B] block text-[11px]">Total Fee</span>
                <strong className="text-[15px] font-bold font-mono text-[#17153A]">
                  ₹{classFeePreset.total.toLocaleString('en-IN')}
                </strong>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Approved Concession</span>
                <strong className="text-[15px] font-bold font-mono text-[#7C612A]">
                  ₹{(initConcessionType !== 'None' && initConcessionStatus === 'Approved' ? Number(initConcessionAmount) : 0).toLocaleString('en-IN')}
                </strong>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Net Payable</span>
                <strong className="text-[15px] font-bold font-mono text-[#17153A]">
                  ₹{(classFeePreset.total - (initConcessionType !== 'None' && initConcessionStatus === 'Approved' ? Number(initConcessionAmount) : 0)).toLocaleString('en-IN')}
                </strong>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Initial Status</span>
                <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                  Due
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: QUICK FEE COLLECTION & RECEIPT GENERATOR */}
      {/* ========================================================================= */}
      {showCollectModal && collectTargetLedger && (
        <Modal
          open={showCollectModal}
          onClose={() => setShowCollectModal(false)}
          title={`Collect Fee — ${collectTargetLedger.studentName}`}
          size="md"
          footer={
            <div className="flex items-center justify-end gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setShowCollectModal(false)}
                className="px-4 py-2 text-[13px] font-semibold text-[#64748B] hover:text-[#17153A] rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRecordPayment}
                className="px-4 py-2 text-[13px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Icon name="Check" size={15} strokeWidth={2} />
                <span>Record & Download Receipt</span>
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-left font-['Poppins']">
            {/* Student metadata banner */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] flex items-center justify-between text-[12px]">
              <div>
                <strong className="text-[14px] text-[#17153A] block">{collectTargetLedger.studentName}</strong>
                <span className="text-[#64748B]">{collectTargetLedger.class} - {collectTargetLedger.section} · {collectTargetLedger.studentId}</span>
              </div>
              <div className="text-right">
                <span className="text-[#64748B] text-[11px] block">Current Outstanding</span>
                <strong className="text-[15px] font-bold text-[#BE123C] font-mono">
                  ₹{collectTargetLedger.outstandingDue.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Select
                label="Allocate to Tranche / Head"
                required
                options={[
                  ...collectTargetLedger.installments.map(i => ({
                    value: i.installmentName,
                    label: `${i.installmentName} (Due: ₹${i.remainingAmount.toLocaleString('en-IN')})`,
                  })),
                  ...collectTargetLedger.feeHeads.map(h => ({
                    value: h.headName,
                    label: `${h.headName} (Due: ₹${h.outstandingDue.toLocaleString('en-IN')})`,
                  })),
                ]}
                value={collectAllocation}
                onChange={e => setCollectAllocation(e.target.value)}
              />

              <Input
                label="Amount Received (₹)"
                type="number"
                min="1"
                required
                value={collectAmount}
                onChange={e => setCollectAmount(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Select
                label="Payment Mode"
                required
                options={[
                  { value: 'Cash', label: 'Cash (Cash Counter 1)' },
                  { value: 'UPI', label: 'UPI / QR Code Scan' },
                  { value: 'Online', label: 'Online Payment Gateway' },
                  { value: 'Bank Transfer', label: 'Bank Transfer (NEFT/RTGS)' },
                  { value: 'Cheque', label: 'Bank Cheque' },
                ]}
                value={collectMode}
                onChange={e => setCollectMode(e.target.value as 'Online' | 'Cash' | 'Cheque' | 'UPI' | 'Bank Transfer')}
              />

              <Input
                label="Transaction / Cheque Reference #"
                required
                value={collectRef}
                onChange={e => setCollectRef(e.target.value)}
              />
            </div>

            <Input
              label="Auditor Remarks / Notes (Optional)"
              placeholder="e.g. Cleared at accounts counter"
              value={collectRemarks}
              onChange={e => setCollectRemarks(e.target.value)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
