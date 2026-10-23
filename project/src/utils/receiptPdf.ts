import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { poppinsRegularBase64, poppinsBoldBase64 } from '@/assets/fonts/poppinsFonts';

export interface FeeReceiptItem {
  description: string;
  subDescription?: string;
  term?: string;
  concession?: number;
  amount: number;
}

export interface FeeReceiptData {
  receiptNo: string;
  date?: string;
  time?: string;
  mode?: string;
  amount: number;
  instalment?: string;
  transactionId?: string;
  studentName?: string;
  class?: string;
  section?: string;
  rollNumber?: string;
  grNo?: string;
  fatherName?: string;
  academicYear?: string;
  status?: string;
  concession?: number;
  balanceDue?: number;
  items?: FeeReceiptItem[];
  paymentRemarks?: string;
}

// Convert numbers up to 10 crores into Indian English words
export function numberToIndianWords(num: number): string {
  if (isNaN(num) || num === 0) return 'Zero';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    const digit = n % 10;
    return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : '');
  }

  const parts: string[] = [];
  const rounded = Math.floor(Math.abs(num));

  const crore = Math.floor(rounded / 10000000);
  const lakh = Math.floor((rounded % 10000000) / 100000);
  const thousand = Math.floor((rounded % 100000) / 1000);
  const hundred = Math.floor((rounded % 1000) / 100);
  const remainder = rounded % 100;

  if (crore) parts.push(`${inWords(crore)} Crore`);
  if (lakh) parts.push(`${inWords(lakh)} Lakh`);
  if (thousand) parts.push(`${inWords(thousand)} Thousand`);
  if (hundred) parts.push(`${inWords(hundred)} Hundred`);
  if (remainder) {
    if (parts.length > 0) parts.push(`and ${inWords(remainder)}`);
    else parts.push(inWords(remainder));
  }

  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Generates an authentic institutional fee receipt PDF adhering to the
 * standard Indian educational receipt layout (Society Header, 2-column info,
 * clean itemized table with colored header, payment instrument details,
 * and statutory confirmation notes) formatted strictly for A4.
 */
export function generateReceiptPdf(data: FeeReceiptData): void {
  // Strict A4 dimensions: 210mm x 297mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  // Register Poppins fonts into jsPDF virtual file system
  doc.addFileToVFS('Poppins-Regular.ttf', poppinsRegularBase64);
  doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');
  doc.addFileToVFS('Poppins-Bold.ttf', poppinsBoldBase64);
  doc.addFont('Poppins-Bold.ttf', 'Poppins', 'bold');

  // Set default font family to Poppins throughout the PDF
  doc.setFont('Poppins', 'normal');

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 18;
  const contentWidth = pageWidth - marginX * 2; // 174mm
  const rightMarginX = marginX + contentWidth; // 192mm

  // Core Brand Palette
  const primaryBurgundy: [number, number, number] = [86, 1, 16]; // #560110
  const navyText: [number, number, number] = [23, 21, 58]; // #17153A
  const blackText: [number, number, number] = [17, 24, 39]; // #111827
  const mutedText: [number, number, number] = [75, 85, 99]; // #4B5563
  const borderColor: [number, number, number] = [209, 213, 219]; // #D1D5DB
  const lightBg: [number, number, number] = [248, 250, 252]; // #F8FAFC

  // 1. Top Decorative Brand Banner
  doc.setFillColor(...primaryBurgundy);
  doc.rect(marginX, 15, contentWidth, 3.5, 'F');

  // 2. School Header (Line 1: School Name, Line 2: Affiliation & Address, Line 3: Official Fee Receipt)
  doc.setFont('Poppins', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...navyText);
  doc.text('SADVIDHYA INTERNATIONAL SCHOOL', pageWidth / 2, 27, { align: 'center' });

  doc.setFont('Poppins', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...mutedText);
  doc.text('Affiliation No: 1930482 · Bengaluru, Karnataka', pageWidth / 2, 33, { align: 'center' });

  doc.setFont('Poppins', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryBurgundy);
  doc.text('OFFICIAL FEE RECEIPT', pageWidth / 2, 40.5, { align: 'center' });

  // Divider Line
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.4);
  doc.line(marginX, 45, rightMarginX, 45);

  // 3. Receipt Information (2-Column Key-Value)
  const metaStartY = 52;
  const col1KeyX = marginX;
  const col1ColonX = marginX + 30;
  const col1ValX = marginX + 34;

  const col2KeyX = 115;
  const col2ColonX = 145;
  const col2ValX = 149;

  // Left Column
  doc.setFont('Poppins', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...blackText);
  doc.text('Receipt Number', col1KeyX, metaStartY);
  doc.text(':', col1ColonX, metaStartY);
  doc.setFont('Poppins', 'normal');
  doc.text(data.receiptNo || 'RCP-2026-04521', col1ValX, metaStartY);

  doc.setFont('Poppins', 'bold');
  doc.text('Date & Time', col1KeyX, metaStartY + 5.5);
  doc.text(':', col1ColonX, metaStartY + 5.5);
  doc.setFont('Poppins', 'normal');
  const dateTimeStr = `${data.date || '2026-05-28'} ${data.time || '10:30 AM'}`;
  doc.text(dateTimeStr, col1ValX, metaStartY + 5.5);

  doc.setFont('Poppins', 'bold');
  doc.text('Payment Mode', col1KeyX, metaStartY + 11);
  doc.text(':', col1ColonX, metaStartY + 11);
  doc.setFont('Poppins', 'normal');
  doc.text(data.mode || 'Online', col1ValX, metaStartY + 11);

  // Right Column
  doc.setFont('Poppins', 'bold');
  doc.text('Transaction ID', col2KeyX, metaStartY);
  doc.text(':', col2ColonX, metaStartY);
  doc.setFont('Poppins', 'normal');
  const txnStr = data.transactionId || `TXN${(data.receiptNo || 'RCP-2026-04521')}`;
  doc.text(txnStr, col2ValX, metaStartY);

  doc.setFont('Poppins', 'bold');
  doc.text('Status', col2KeyX, metaStartY + 5.5);
  doc.text(':', col2ColonX, metaStartY + 5.5);
  doc.setFont('Poppins', 'bold');
  doc.setTextColor(5, 150, 105); // Green for SUCCESSFUL / PAID
  doc.text(data.status || 'SUCCESSFUL / PAID', col2ValX, metaStartY + 5.5);

  // 4. Section: STUDENT DETAILS
  const sSecY = 73;
  doc.setFillColor(...lightBg);
  doc.rect(marginX, sSecY, contentWidth, 6.5, 'F');
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.35);
  doc.rect(marginX, sSecY, contentWidth, 6.5, 'S');

  doc.setFont('Poppins', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...navyText);
  doc.text('STUDENT DETAILS', pageWidth / 2, sSecY + 4.5, { align: 'center' });

  // Student Fields
  const sFieldY = sSecY + 12;
  const sCol1KeyX = marginX;
  const sCol1ColonX = marginX + 32;
  const sCol1ValX = marginX + 36;

  const sCol2KeyX = 115;
  const sCol2ColonX = 145;
  const sCol2ValX = 149;

  // Left side
  doc.setFont('Poppins', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...blackText);
  doc.text('Student Name', sCol1KeyX, sFieldY);
  doc.text(':', sCol1ColonX, sFieldY);
  doc.setFont('Poppins', 'normal');
  doc.text(data.studentName || 'Aarav Sharma', sCol1ValX, sFieldY);

  doc.setFont('Poppins', 'bold');
  doc.text('Student ID / GR', sCol1KeyX, sFieldY + 5.5);
  doc.text(':', sCol1ColonX, sFieldY + 5.5);
  doc.setFont('Poppins', 'normal');
  doc.text(data.grNo || 'GR-9821', sCol1ValX, sFieldY + 5.5);

  doc.setFont('Poppins', 'bold');
  doc.text('Class & Section', sCol1KeyX, sFieldY + 11);
  doc.text(':', sCol1ColonX, sFieldY + 11);
  doc.setFont('Poppins', 'normal');
  const classSecStr = data.class ? (data.section ? `${data.class}-${data.section}` : data.class) : 'Class 8-A';
  doc.text(classSecStr, sCol1ValX, sFieldY + 11);

  // Right side
  doc.setFont('Poppins', 'bold');
  doc.text('Roll Number', sCol2KeyX, sFieldY);
  doc.text(':', sCol2ColonX, sFieldY);
  doc.setFont('Poppins', 'normal');
  doc.text(data.rollNumber || '07', sCol2ValX, sFieldY);

  doc.setFont('Poppins', 'bold');
  doc.text('Parent / Ward', sCol2KeyX, sFieldY + 5.5);
  doc.text(':', sCol2ColonX, sFieldY + 5.5);
  doc.setFont('Poppins', 'normal');
  doc.text(data.fatherName || 'Rajesh Sharma', sCol2ValX, sFieldY + 5.5);

  // 5. Section: FEE BREAKDOWN
  const feeSecY = sFieldY + 18;
  doc.setFillColor(...lightBg);
  doc.rect(marginX, feeSecY, contentWidth, 6.5, 'F');
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.35);
  doc.rect(marginX, feeSecY, contentWidth, 6.5, 'S');

  doc.setFont('Poppins', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...navyText);
  doc.text('FEE BREAKDOWN', pageWidth / 2, feeSecY + 4.5, { align: 'center' });

  // Fee Table via autoTable
  const totalAmount = data.amount || 25000;
  const formattedAmount = totalAmount.toLocaleString('en-IN');
  const concessionAmount = (data.concession || 0).toLocaleString('en-IN');
  const balanceDueStr = (data.balanceDue !== undefined ? data.balanceDue : 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const tableStartY = feeSecY + 8;
  const instalmentDesc = data.instalment || 'Instalment 1 - Tuition';

  autoTable(doc, {
    startY: tableStartY,
    margin: { left: marginX, right: marginX },
    head: [['Particulars', 'Amount Paid (INR)']],
    body: [
      [instalmentDesc, `₹${formattedAmount}`],
      ['Concession / Discount Applied', `₹${concessionAmount}`],
    ],
    theme: 'plain',
    headStyles: {
      fillColor: primaryBurgundy,
      textColor: [255, 255, 255],
      font: 'Poppins',
      fontSize: 8.5,
      fontStyle: 'bold',
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 134, halign: 'left' },
      1: { cellWidth: 40, halign: 'right' },
    },
    styles: {
      font: 'Poppins',
      fontSize: 8.2,
      cellPadding: 3,
      textColor: blackText,
      lineWidth: 0.25,
      lineColor: [0, 0, 0],
    },
    didDrawCell: (hookData) => {
      const { cell } = hookData;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2);
      doc.rect(cell.x, cell.y, cell.width, cell.height, 'S');
    },
  });

  // @ts-expect-error jspdf-autotable extends jsPDF with lastAutoTable property
  const finalTableY = doc.lastAutoTable ? doc.lastAutoTable.finalY : tableStartY + 25;

  // Total & Balance Due Lines
  const summaryY = finalTableY + 4;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.35);
  doc.line(marginX, summaryY, rightMarginX, summaryY);

  const totalLineY = summaryY + 5.5;
  doc.setFont('Poppins', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...blackText);
  doc.text('TOTAL AMOUNT PAID', marginX, totalLineY);
  doc.text(':', marginX + 55, totalLineY);
  doc.text(`₹${formattedAmount}`, rightMarginX, totalLineY, { align: 'right' });

  const balanceLineY = totalLineY + 5;
  doc.setFont('Poppins', 'normal');
  doc.text('Balance Due for Instalment', marginX, balanceLineY);
  doc.text(':', marginX + 55, balanceLineY);
  doc.text(`₹${balanceDueStr}`, rightMarginX, balanceLineY, { align: 'right' });

  // Double Bottom Border Under Totals
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.35);
  doc.line(marginX, balanceLineY + 3.5, rightMarginX, balanceLineY + 3.5);
  doc.setLineWidth(0.6);
  doc.line(marginX, balanceLineY + 4.5, rightMarginX, balanceLineY + 4.5);

  // 6. Amount in Words
  const wordsY = balanceLineY + 11;
  doc.setFont('Poppins', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...blackText);
  doc.text('Amount in words', marginX, wordsY);
  doc.text(':', marginX + 30, wordsY);
  doc.setFont('Poppins', 'normal');
  doc.text(`INR ${numberToIndianWords(totalAmount)} Only.`, marginX + 34, wordsY);

  // 7. ERP Disclaimer Statement
  const disclaimerY = wordsY + 14;
  doc.setFont('Poppins', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(...mutedText);
  doc.text('This is a computer-generated digital fee receipt issued by', marginX, disclaimerY);
  doc.text('the Sadvidhya International School ERP portal.', marginX, disclaimerY + 4);

  // 8. Bottom Decorative Brand Banner
  doc.setFillColor(...primaryBurgundy);
  doc.rect(marginX, pageHeight - 20, contentWidth, 3.5, 'F');

  // Trigger instant browser download with proper .pdf filename
  const sanitizedStudent = (data.studentName || 'Student').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
  const sanitizedReceipt = (data.receiptNo || 'RCP-2026').replace(/[^a-zA-Z0-9_-]/g, '');
  const fileName = `Fee_Receipt_${sanitizedReceipt}_${sanitizedStudent}.pdf`;

  doc.save(fileName);
}
