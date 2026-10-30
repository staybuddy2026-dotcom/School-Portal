import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { poppinsRegularBase64, poppinsBoldBase64 } from '@/assets/fonts/poppinsFonts';
import type { StudentFeeLedgerAccount } from '@/types';

/**
 * Generates an institutional, audit-compliant Student Fee Ledger Statement PDF
 * adhering to standard CBSE/ICSE school financial statement formats.
 */
export function generateLedgerPdf(account: StudentFeeLedgerAccount): void {
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

  doc.setFont('Poppins', 'normal');

  const pageWidth = 210;
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182mm
  const rightMarginX = marginX + contentWidth; // 196mm

  // Core Brand Palette (HEX matching school rules)
  const primaryBurgundy: [number, number, number] = [86, 1, 16]; // #560110
  const royalGold: [number, number, number] = [124, 97, 42]; // #7C612A
  const midnightNavy: [number, number, number] = [23, 21, 58]; // #17153A
  const darkText: [number, number, number] = [30, 41, 59]; // #1E293B
  const mutedText: [number, number, number] = [100, 116, 139]; // #64748B
  const borderColor: [number, number, number] = [226, 232, 240]; // #E2E8F0
  const lightBg: [number, number, number] = [248, 250, 252]; // #F8FAFC

  // 1. Top Decorative Brand Ribbon
  doc.setFillColor(...royalGold);
  doc.rect(marginX, 10, contentWidth, 3, 'F');

  // 2. School Header
  doc.setFont('Poppins', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...midnightNavy);
  doc.text('SADVIDHYA INTERNATIONAL SCHOOL', pageWidth / 2, 19, { align: 'center' });

  doc.setFont('Poppins', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedText);
  doc.text('CBSE Affiliation No: 1930482 · School Code: 41209 · Bengaluru, Karnataka', pageWidth / 2, 23.5, { align: 'center' });

  doc.setFont('Poppins', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryBurgundy);
  doc.text('OFFICIAL STUDENT FEE LEDGER STATEMENT', pageWidth / 2, 29.5, { align: 'center' });

  // Divider line
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.3);
  doc.line(marginX, 32.5, rightMarginX, 32.5);

  // 3. Metadata Section (2 columns)
  const metaY = 37;
  const col1X = marginX;
  const col1ValX = marginX + 32;
  const col2X = marginX + 96;
  const col2ValX = marginX + 130;

  // Left Col
  doc.setFontSize(7.5);
  doc.setFont('Poppins', 'bold');
  doc.setTextColor(...mutedText);
  doc.text('Student Name:', col1X, metaY);
  doc.setFont('Poppins', 'bold');
  doc.setTextColor(...midnightNavy);
  doc.text(account.studentName, col1ValX, metaY);

  doc.setFont('Poppins', 'bold');
  doc.setTextColor(...mutedText);
  doc.text('Admission / GR No:', col1X, metaY + 4.5);
  doc.setFont('Poppins', 'normal');
  doc.setTextColor(...darkText);
  doc.text(`${account.studentId} (${account.grNumber})`, col1ValX, metaY + 4.5);

  doc.setFont('Poppins', 'bold');
  doc.setTextColor(...mutedText);
  doc.text('Class & Section:', col1X, metaY + 9);
  doc.setFont('Poppins', 'normal');
  doc.setTextColor(...darkText);
  doc.text(`${account.class} - ${account.section} (Roll: ${account.rollNumber})`, col1ValX, metaY + 9);

  // Right Col
  doc.setFont('Poppins', 'bold');
  doc.setTextColor(...mutedText);
  doc.text('Academic Year:', col2X, metaY);
  doc.setFont('Poppins', 'bold');
  doc.setTextColor(...royalGold);
  doc.text(account.academicYear, col2ValX, metaY);

  doc.setFont('Poppins', 'bold');
  doc.setTextColor(...mutedText);
  doc.text('Parent / Guardian:', col2X, metaY + 4.5);
  doc.setFont('Poppins', 'normal');
  doc.setTextColor(...darkText);
  doc.text(`${account.parentName} (${account.parentPhone})`, col2ValX, metaY + 4.5);

  doc.setFont('Poppins', 'bold');
  doc.setTextColor(...mutedText);
  doc.text('Ledger Status:', col2X, metaY + 9);
  doc.setFont('Poppins', 'bold');
  if (account.status === 'Paid') {
    doc.setTextColor(21, 128, 61); // Green
  } else if (account.status === 'Overdue') {
    doc.setTextColor(190, 18, 60); // Red
  } else {
    doc.setTextColor(180, 83, 9); // Amber
  }
  doc.text(account.status.toUpperCase(), col2ValX, metaY + 9);

  // 4. Financial Account Summary Cards (5-cell banner)
  const sumY = metaY + 13;
  const cardW = contentWidth / 5;
  const cardH = 13.5;

  const summaryItems = [
    { label: 'TOTAL FEE', val: `Rs. ${account.totalFee.toLocaleString('en-IN')}`, color: midnightNavy },
    { label: 'CONCESSION', val: `Rs. ${account.approvedConcession.toLocaleString('en-IN')}`, color: royalGold },
    { label: 'NET PAYABLE', val: `Rs. ${account.netPayable.toLocaleString('en-IN')}`, color: midnightNavy },
    { label: 'TOTAL PAID', val: `Rs. ${account.totalPaid.toLocaleString('en-IN')}`, color: [21, 128, 61] as [number, number, number] },
    { label: account.advanceBalance > 0 ? 'ADVANCE CREDIT' : 'OUTSTANDING DUE', val: account.advanceBalance > 0 ? `Rs. ${account.advanceBalance.toLocaleString('en-IN')}` : `Rs. ${account.outstandingDue.toLocaleString('en-IN')}`, color: account.advanceBalance > 0 ? [29, 78, 216] as [number, number, number] : (account.outstandingDue > 0 ? [190, 18, 60] as [number, number, number] : [21, 128, 61] as [number, number, number]) },
  ];

  summaryItems.forEach((item, idx) => {
    const x = marginX + idx * cardW;
    doc.setFillColor(...lightBg);
    doc.setDrawColor(...borderColor);
    doc.rect(x, sumY, cardW - 1.5, cardH, 'FD');

    doc.setFont('Poppins', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...mutedText);
    doc.text(item.label, x + (cardW - 1.5) / 2, sumY + 4.5, { align: 'center' });

    doc.setFont('Poppins', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...item.color);
    doc.text(item.val, x + (cardW - 1.5) / 2, sumY + 10, { align: 'center' });
  });

  let currentY = sumY + cardH + 5;

  // 5. Section: Fee Head Itemized Breakdown
  doc.setFont('Poppins', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...midnightNavy);
  doc.text('1. Assigned Fee Structure & Concession Allocation', marginX, currentY);

  autoTable(doc, {
    startY: currentY + 2,
    head: [['Fee Component', 'Category', 'Original Fee', 'Concession', 'Net Payable', 'Paid', 'Balance', 'Due Date', 'Status']],
    body: [
      ...account.feeHeads.map(fh => [
        fh.headName,
        fh.category,
        `Rs. ${fh.originalAmount.toLocaleString('en-IN')}`,
        fh.concessionAllocation > 0 ? `Rs. ${fh.concessionAllocation.toLocaleString('en-IN')}` : '-',
        `Rs. ${fh.netPayable.toLocaleString('en-IN')}`,
        `Rs. ${fh.amountPaid.toLocaleString('en-IN')}`,
        `Rs. ${fh.outstandingDue.toLocaleString('en-IN')}`,
        fh.dueDate,
        fh.status,
      ]),
      [
        'Total',
        '',
        `Rs. ${account.totalFee.toLocaleString('en-IN')}`,
        `Rs. ${account.approvedConcession.toLocaleString('en-IN')}`,
        `Rs. ${account.netPayable.toLocaleString('en-IN')}`,
        `Rs. ${account.totalPaid.toLocaleString('en-IN')}`,
        `Rs. ${account.outstandingDue.toLocaleString('en-IN')}`,
        '',
        account.status,
      ],
    ],
    theme: 'plain',
    styles: {
      font: 'Poppins',
      fontSize: 6.8,
      cellPadding: 1.6,
      textColor: darkText,
      valign: 'middle',
    },
    headStyles: {
      fillColor: midnightNavy,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 6.5,
    },
    columnStyles: {
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right', fontStyle: 'bold' },
      5: { halign: 'right' },
      6: { halign: 'right', fontStyle: 'bold' },
      8: { halign: 'center' },
    },
    margin: { left: marginX, right: marginX },
    didParseCell: (data) => {
      // Highlight footer row
      if (data.row.index === account.feeHeads.length) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [241, 245, 249];
        data.cell.styles.textColor = midnightNavy;
      }
    },
  });

  // @ts-expect-error - jspdf-autotable extends jsPDF instance with lastAutoTable
  currentY = doc.lastAutoTable.finalY + 6;

  // 6. Section: Installment Schedule
  doc.setFont('Poppins', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...midnightNavy);
  doc.text('2. Installment Due Schedule', marginX, currentY);

  autoTable(doc, {
    startY: currentY + 2,
    head: [['#', 'Installment Description', 'Due Date', 'Payable (Rs.)', 'Paid (Rs.)', 'Balance (Rs.)', 'Status']],
    body: account.installments.map(inst => [
      `#${inst.installmentNumber}`,
      inst.installmentName,
      inst.dueDate,
      `Rs. ${inst.amountPayable.toLocaleString('en-IN')}`,
      `Rs. ${inst.amountPaid.toLocaleString('en-IN')}`,
      `Rs. ${inst.remainingAmount.toLocaleString('en-IN')}`,
      inst.status,
    ]),
    theme: 'plain',
    styles: {
      font: 'Poppins',
      fontSize: 6.8,
      cellPadding: 1.6,
      textColor: darkText,
      valign: 'middle',
    },
    headStyles: {
      fillColor: royalGold,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 6.5,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right', fontStyle: 'bold' },
      6: { halign: 'center' },
    },
    margin: { left: marginX, right: marginX },
  });

  // @ts-expect-error - jspdf-autotable extends jsPDF instance with lastAutoTable
  currentY = doc.lastAutoTable.finalY + 6;

  // Check if we need a new page for payment history
  if (currentY > 210) {
    doc.addPage();
    currentY = 16;
  }

  // 7. Section: Payment & Transaction History
  doc.setFont('Poppins', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...midnightNavy);
  doc.text('3. Recorded Payments & Transaction History', marginX, currentY);

  if (account.transactions.length === 0) {
    doc.setFont('Poppins', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedText);
    doc.text('No payment transactions recorded for this academic account yet.', marginX, currentY + 5);
    currentY += 12;
  } else {
    autoTable(doc, {
      startY: currentY + 2,
      head: [['Receipt No.', 'Payment Date', 'Allocation / Component', 'Mode', 'Reference #', 'Amount (Rs.)', 'Status']],
      body: account.transactions.map(txn => [
        txn.receiptNo,
        txn.date,
        txn.allocation,
        txn.mode,
        txn.transactionRef,
        `Rs. ${txn.amount.toLocaleString('en-IN')}`,
        txn.status,
      ]),
      theme: 'plain',
      styles: {
        font: 'Poppins',
        fontSize: 6.8,
        cellPadding: 1.6,
        textColor: darkText,
        valign: 'middle',
      },
      headStyles: {
        fillColor: primaryBurgundy,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 6.5,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        5: { halign: 'right', fontStyle: 'bold' },
        6: { halign: 'center' },
      },
      margin: { left: marginX, right: marginX },
    });

    // @ts-expect-error - jspdf-autotable extends jsPDF instance with lastAutoTable
    currentY = doc.lastAutoTable.finalY + 6;
  }

  // Check page overflow for verification section
  if (currentY > 235) {
    doc.addPage();
    currentY = 20;
  }

  // 8. Concessions & Audit Notes (if any)
  if (account.concessions && account.concessions.length > 0) {
    doc.setFont('Poppins', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...royalGold);
    doc.text('Approved Institutional Concessions & Scholarships:', marginX, currentY);

    account.concessions.forEach((c, i) => {
      doc.setFont('Poppins', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...darkText);
      const text = `* ${c.type}: Rs. ${c.amount.toLocaleString('en-IN')} - Reason: ${c.reason} (Status: ${c.status} by ${c.approvedBy || 'Management'})`;
      doc.text(text, marginX, currentY + 3.8 * (i + 1));
    });

    currentY += 4.5 * (account.concessions.length + 1);
  }

  // 9. Signatures & Verification Block
  const sigY = Math.max(currentY + 6, 260);

  doc.setDrawColor(...borderColor);
  doc.line(marginX, sigY, marginX + 45, sigY);
  doc.line(rightMarginX - 45, sigY, rightMarginX, sigY);

  doc.setFont('Poppins', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...darkText);
  doc.text('Prepared By (Accounts Officer)', marginX, sigY + 4);
  doc.text('Authorized Finance Signatory', rightMarginX, sigY + 4, { align: 'right' });

  doc.setFont('Poppins', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(...mutedText);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · Valid institutional record`, pageWidth / 2, sigY + 9, { align: 'center' });

  // Save the PDF
  const filename = `Fee_Ledger_${account.studentName.replace(/\s+/g, '_')}_${account.academicYear}.pdf`;
  doc.save(filename);
}
