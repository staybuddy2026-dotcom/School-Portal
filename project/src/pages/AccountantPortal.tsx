import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { PageHeader, StatusBadge, Card, Badge, Button, StatCard, Table, Avatar, Breadcrumb, Modal, Input, Select, Textarea, SectionHeader, showToast } from '@/components/ui';
import { generateReceiptPdf } from '@/utils/receiptPdf';

interface AccountantPortalProps {
  activeKey: string;
}

export function AccountantPortal({ activeKey }: AccountantPortalProps) {
  switch (activeKey) {
    case 'acc-dashboard': return <AccDashboard />;
    case 'acc-profile': return <AccProfile />;
    case 'acc-fee-heads': return <FeeHeads />;
    case 'acc-fee-structure': return <FeeStructure />;
    case 'acc-instalments': return <Instalments />;
    case 'acc-ledger': return <StudentLedger />;
    case 'acc-concessions': return <Concessions />;
    case 'acc-late-fee': return <LateFee />;
    case 'acc-offline': return <OfflineCollection />;
    case 'acc-online': return <OnlineCollection />;
    case 'acc-receipts': return <Receipts />;
    case 'acc-refunds': return <Refunds />;
    case 'acc-reminders': return <FeeReminders />;
    case 'acc-transport-fee': return <TransportFee />;
    case 'acc-reconciliation': return <Reconciliation />;
    case 'acc-reports': return <FeeReports />;
    default: return <AccDashboard />;
  }
}


function AccDashboard() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div>
        <Breadcrumb items={['Accountant Portal', 'Dashboard']} />
        <div className="mt-1">
          <h1 className="text-[22px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">Accountant Dashboard</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">Monday, October 13, 2026 · Financial accounts & daily collection</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Today's Collection</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">₹1.2L</p>
            <p className="text-[12px] font-semibold text-[#15803D] mt-1">↑ 15% vs avg</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] flex items-center justify-center shrink-0">
            <Icon name="solar:wallet-money-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Month-to-Date</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">₹18.5L</p>
            <p className="text-[12px] font-semibold text-[#15803D] mt-1">↑ 8% vs last month</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
            <Icon name="solar:chart-2-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Total Dues</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">₹4.8L</p>
            <p className="text-[12px] font-semibold text-[#15803D] mt-1">↓ 5% decreasing</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] flex items-center justify-center shrink-0">
            <Icon name="solar:danger-circle-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Overdue Instalments</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">23</p>
            <p className="text-[12px] font-medium text-[#B45309] mt-1">Action required</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] flex items-center justify-center shrink-0">
            <Icon name="solar:alarm-linear" size={20} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="font-bold text-[#17153A] text-[16px]">Recent Payments</h3>
            <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">Latest 4</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Receipt</th>
                  <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                  <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                  <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {[
                  { receipt: 'RCP-05401', student: 'Aarav Sharma', amount: 15000, mode: 'Online' },
                  { receipt: 'RCP-05400', student: 'Diya Patel', amount: 25000, mode: 'Cash' },
                  { receipt: 'RCP-05399', student: 'Ishaan Verma', amount: 8000, mode: 'Cheque' },
                  { receipt: 'RCP-05398', student: 'Saanvi Reddy', amount: 25000, mode: 'Online' },
                ].map((p, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[12px] text-[#475569]">{p.receipt}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={p.student} size="xs" />
                        <span className="font-semibold text-[#17153A] text-[14px]">{p.student}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-[#17153A] text-[14px]">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-md text-[12px] font-medium bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                        {p.mode}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overdue Instalments */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="font-bold text-[#17153A] text-[16px]">Overdue Instalments</h3>
            <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
              Pending Payment
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                  <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Instalment</th>
                  <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                  <th className="px-5 py-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Overdue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {[
                  { student: 'Vihaan Joshi', inst: 'Instalment 2', due: 25000, days: '15 days' },
                  { student: 'Myra Singh', inst: 'Instalment 2', due: 25000, days: '3 days' },
                  { student: 'Aarav Sharma', inst: 'Transport T2', due: 8000, days: '5 days' },
                ].map((o, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={o.student} size="xs" />
                        <span className="font-semibold text-[#17153A] text-[14px]">{o.student}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-[#64748B]">{o.inst}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-[#BE123C] text-[14px]">₹{o.due.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-md text-[12px] font-semibold bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
                        {o.days}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccProfile() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <PageHeader title="My Profile" breadcrumbs={['Accountant', 'My Profile']} />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar name="Suresh Bhat" size="lg" className="!w-20 !h-20 !text-[20px] mb-3.5" />
            <h3 className="text-[18px] font-bold text-[#17153A]">Mr. Suresh Bhat</h3>
            <p className="text-[14px] text-[#64748B]">Chief Accountant · Finance Dept</p>
          </div>
          <div className="mt-5 space-y-3 pt-5 border-t border-[#F1F5F9]">
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-[#64748B]">Employee ID</span>
              <span className="font-semibold text-[#17153A]">EMP-2018-0019</span>
            </div>
            <div className="flex justify-between items-center text-[14px] pt-2 border-t border-[#F8FAFC]">
              <span className="text-[#64748B]">Email</span>
              <span className="font-semibold text-[#17153A]">suresh@greenwood.edu</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft p-6">
          <h3 className="font-bold text-[#17153A] text-[16px] pb-3.5 border-b border-[#F1F5F9] mb-4">Security & Password</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-[12px] font-semibold text-[#64748B] block mb-1">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] outline-none focus:border-[#7C612A]" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#64748B] block mb-1">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] outline-none focus:border-[#7C612A]" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#64748B] block mb-1">Confirm New Password</label>
              <input type="password" placeholder="••••••••" className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] outline-none focus:border-[#7C612A]" />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer mt-2"
            >
              <Icon name="solar:key-linear" size={16} />
              <span>Update Password</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeeHeads() {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant', 'Fee Heads']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Fee Heads Setup</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Define tuition, term, activity, transport, and penalty categories</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:add-circle-linear" size={16} />
          <span>Add Fee Head</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Fee Head</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Code</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Type</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { name: 'Tuition Fee', code: 'FH-001', type: 'Recurring', status: 'active' },
                { name: 'Admission Fee', code: 'FH-002', type: 'One-time', status: 'active' },
                { name: 'Term Fee', code: 'FH-003', type: 'Recurring', status: 'active' },
                { name: 'Activity Fee', code: 'FH-004', type: 'Recurring', status: 'active' },
                { name: 'Exam Fee', code: 'FH-005', type: 'Recurring', status: 'active' },
                { name: 'Transport Fee', code: 'FH-006', type: 'Recurring', status: 'active' },
                { name: 'Late Fee', code: 'FH-007', type: 'Penalty', status: 'active' },
              ].map(f => (
                <tr key={f.code} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{f.name}</td>
                  <td className="px-5 py-4 font-mono text-[12px] text-[#64748B]">{f.code}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                      {f.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                      {f.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button type="button" className="text-[12px] font-semibold text-[#7C612A] hover:text-[#560110] px-2.5 py-1 rounded-lg hover:bg-[#FAF7F2] transition-colors cursor-pointer">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Fee Head" footer={<><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowAdd(false)}>Save Fee Head</Button></>}>
        <div className="space-y-4">
          <Input label="Fee Head Name" required placeholder="e.g., Annual Lab Fee" />
          <Select label="Type" required options={[{ value: 'recurring', label: 'Recurring' }, { value: 'onetime', label: 'One-time' }, { value: 'penalty', label: 'Penalty' }]} />
          <Textarea label="Description" rows={2} placeholder="Category description and ledger notes" />
        </div>
      </Modal>
    </div>
  );
}

function FeeStructure() {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant', 'Fee Structure']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Class Fee Structure</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Component breakdown by class grade and academic year</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:add-circle-linear" size={16} />
          <span>Add Structure</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <Select options={[{ value: '2026', label: 'Academic Year 2026-27' }, { value: '2025', label: 'Academic Year 2025-26' }]} className="!w-auto" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Class</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Tuition</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Admission</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Activity</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Exam</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { class: 'Class 8', tuition: 75000, admission: 15000, activity: 5000, exam: 3000 },
                { class: 'Class 7', tuition: 70000, admission: 15000, activity: 5000, exam: 3000 },
                { class: 'Class 6', tuition: 65000, admission: 12000, activity: 4000, exam: 2500 },
                { class: 'Class 5', tuition: 60000, admission: 12000, activity: 4000, exam: 2500 },
              ].map(f => {
                const total = f.tuition + f.admission + f.activity + f.exam;
                return (
                  <tr key={f.class} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{f.class}</td>
                    <td className="px-5 py-4 text-right text-[14px] text-[#475569]">₹{f.tuition.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 text-right text-[14px] text-[#475569]">₹{f.admission.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 text-right text-[14px] text-[#475569]">₹{f.activity.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 text-right text-[14px] text-[#475569]">₹{f.exam.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 text-right font-bold text-[#17153A] text-[14px]">₹{total.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Fee Structure" footer={<><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowAdd(false)}>Save Structure</Button></>}>
        <div className="space-y-4">
          <Select label="Class" required options={[{ value: '8', label: 'Class 8' }, { value: '7', label: 'Class 7' }, { value: '6', label: 'Class 6' }]} />
          <Select label="Academic Year" required options={[{ value: '2026', label: '2026-27' }]} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tuition Fee" type="number" />
            <Input label="Admission Fee" type="number" />
            <Input label="Activity Fee" type="number" />
            <Input label="Exam Fee" type="number" />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Instalments() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant', 'Instalments']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Fee Instalments Schedule</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Due dates and amount distribution across academic terms</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:add-circle-linear" size={16} />
          <span>Add Instalment</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Instalment</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Due Date</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Classes</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { inst: 'Instalment 1', due: '31 May 2026', amount: 25000, classes: 'All' },
                { inst: 'Instalment 2', due: '10 August 2026', amount: 25000, classes: 'All' },
                { inst: 'Instalment 3', due: '10 November 2026', amount: 25000, classes: 'All' },
              ].map((i, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{i.inst}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{i.due}</td>
                  <td className="px-5 py-4 text-right font-bold text-[#17153A] text-[14px]">₹{i.amount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{i.classes}</td>
                  <td className="px-5 py-4 text-right">
                    <button type="button" className="text-[12px] font-semibold text-[#7C612A] hover:text-[#560110] px-2.5 py-1 rounded-lg hover:bg-[#FAF7F2] transition-colors cursor-pointer">
                      Edit
                    </button>
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

function StudentLedger() {
  const [selectedStudent, setSelectedStudent] = useState('Aarav Sharma');
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant', 'Student Fee Ledger']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Student Fee Ledger</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Individual student billing, receipts, concessions, and outstanding dues</p>
        </div>
        <Select options={[{ value: 'Aarav Sharma', label: 'Aarav Sharma (8-A)' }, { value: 'Diya Patel', label: 'Diya Patel (8-A)' }, { value: 'Ishaan Verma', label: 'Ishaan Verma (8-A)' }]} value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="!w-auto shrink-0" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
          <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Total Fee</p>
          <p className="text-[24px] font-bold text-[#17153A] mt-1">₹98,000</p>
        </div>
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
          <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Amount Paid</p>
          <p className="text-[24px] font-bold text-[#15803D] mt-1">₹48,000</p>
        </div>
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
          <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Concession</p>
          <p className="text-[24px] font-bold text-[#7C612A] mt-1">₹5,000</p>
        </div>
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
          <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Outstanding</p>
          <p className="text-[24px] font-bold text-[#BE123C] mt-1">₹45,000</p>
        </div>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="font-bold text-[#17153A] text-[16px]">Payment History — {selectedStudent}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Receipt No.</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Date</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Instalment</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Mode</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { receipt: 'RCP-2026-04521', date: '2026-05-28', inst: 'Instalment 1', amount: 25000, mode: 'Online', status: 'successful' },
                { receipt: 'RCP-2026-04893', date: '2026-06-25', inst: 'Transport T1', amount: 8000, mode: 'Online', status: 'successful' },
                { receipt: 'RCP-2026-05102', date: '2026-08-05', inst: 'Instalment 2', amount: 15000, mode: 'Online', status: 'successful' },
              ].map((p, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-mono text-[12px]">
                    <button
                      type="button"
                      onClick={() => {
                        generateReceiptPdf({
                          receiptNo: p.receipt,
                          date: p.date,
                          mode: p.mode,
                          amount: p.amount,
                          studentName: selectedStudent,
                          instalment: p.inst,
                          academicYear: '2026 - 2027',
                          status: 'PAID',
                        });
                        showToast(`Receipt ${p.receipt}.pdf downloaded successfully!`, 'success');
                      }}
                      title="Download official PDF receipt"
                      className="inline-flex items-center gap-1.5 font-bold text-[#7C612A] hover:text-[#560110] hover:underline cursor-pointer"
                    >
                      <Icon name="solar:download-minimalistic-linear" size={13} />
                      <span>{p.receipt}</span>
                    </button>
                  </td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{p.date}</td>
                  <td className="px-5 py-4 text-[14px] text-[#334155]">{p.inst}</td>
                  <td className="px-5 py-4 text-right font-bold text-[#17153A] text-[14px]">₹{p.amount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                      {p.mode}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                      {p.status}
                    </span>
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

function Concessions() {
  const [showApply, setShowApply] = useState(false);
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant', 'Concessions']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Concessions & Scholarships</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Sibling discounts, staff concessions, and merit scholarships</p>
        </div>
        <button
          type="button"
          onClick={() => setShowApply(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:add-circle-linear" size={16} />
          <span>Apply Concession</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Type</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Reason</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { student: 'Aarav Sharma', type: 'Sibling', amount: '₹5,000', reason: 'Second child in school', status: 'approved' },
                { student: 'Diya Patel', type: 'Staff', amount: '50%', reason: 'Staff child discount', status: 'approved' },
                { student: 'Ishaan Verma', type: 'Merit', amount: '₹15,000', reason: 'Class topper scholarship', status: 'pending approval' },
              ].map((c, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{c.student}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                      {c.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-[#7C612A] text-[14px]">{c.amount}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{c.reason}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                      c.status === 'approved' ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]' : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showApply} onClose={() => setShowApply(false)} title="Apply Fee Concession" footer={<><Button variant="outline" onClick={() => setShowApply(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowApply(false)}>Apply</Button></>}>
        <div className="space-y-4">
          <Select label="Student" required options={[{ value: '', label: 'Select student...' }, { value: 'aarav', label: 'Aarav Sharma' }, { value: 'diya', label: 'Diya Patel' }]} />
          <Select label="Concession Type" required options={[{ value: 'sibling', label: 'Sibling' }, { value: 'staff', label: 'Staff' }, { value: 'merit', label: 'Merit' }, { value: 'custom', label: 'Custom' }]} />
          <Input label="Amount / Percentage" required placeholder="e.g., ₹5000 or 10%" />
          <Textarea label="Reason" rows={2} required />
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]">
            <Icon name="solar:danger-triangle-linear" size={16} className="text-[#B45309]" />
            <span className="text-[12px] text-[#B45309] font-medium">Concessions exceeding ₹10,000 require administrative approval.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function LateFee() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <PageHeader title="Late Fee Configuration" breadcrumbs={['Accountant', 'Late Fee']} />
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft p-6">
        <h3 className="font-bold text-[#17153A] text-[16px] pb-3 border-b border-[#F1F5F9] mb-4">Current Late Fee Rules</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Fixed Late Fee</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">₹500</p>
            <p className="text-[12px] text-[#64748B] mt-1">Charged automatically after grace period</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Per-Day Late Fee</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">₹25/day</p>
            <p className="text-[12px] text-[#64748B] mt-1">Accrues after 7 days grace period</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Icon name="solar:pen-2-linear" size={15} />
          <span>Edit Late Fee Rules</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="font-bold text-[#17153A] text-[16px]">Late Fee Waivers</h3>
          <button
            type="button"
            className="px-3 py-1.5 text-[12px] font-semibold text-[#17153A] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            + Waive Late Fee
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Waived Amount</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Reason</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { student: 'Saanvi Reddy', amount: 500, reason: 'Genuine family emergency', date: '2026-09-15' },
                { student: 'Arjun Nair', amount: 250, reason: 'Medical ground', date: '2026-08-20' },
              ].map((w, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{w.student}</td>
                  <td className="px-5 py-4 text-right font-bold text-[#15803D] text-[14px]">₹{w.amount}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{w.reason}</td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{w.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OfflineCollection() {
  const [showCollect, setShowCollect] = useState(false);
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant', 'Offline Collection']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Offline Fee Collection</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Record payments via Cash, Cheque, Demand Draft, or Bank Transfer</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCollect(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:add-circle-linear" size={16} />
          <span>Record Payment</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Receipt No.</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Mode</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { receipt: 'RCP-05400', student: 'Diya Patel', amount: 25000, mode: 'Cash', status: 'collected', date: '2026-10-13' },
                { receipt: 'RCP-05399', student: 'Ishaan Verma', amount: 8000, mode: 'Cheque', status: 'cleared', date: '2026-10-12' },
                { receipt: 'RCP-05395', student: 'Arjun Nair', amount: 25000, mode: 'Cheque', status: 'bounced', date: '2026-10-10' },
                { receipt: 'RCP-05390', student: 'Myra Singh', amount: 25000, mode: 'DD', status: 'collected', date: '2026-10-08' },
                { receipt: 'RCP-05385', student: 'Vihaan Joshi', amount: 15000, mode: 'Bank Transfer', status: 'collected', date: '2026-10-05' },
              ].map((p, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-mono text-[12px] text-[#475569]">{p.receipt}</td>
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{p.student}</td>
                  <td className="px-5 py-4 text-right font-bold text-[#17153A] text-[14px]">₹{p.amount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                      {p.mode}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                      p.status === 'bounced' ? 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]' : 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showCollect} onClose={() => setShowCollect(false)} title="Record Offline Payment" footer={<><Button variant="outline" onClick={() => setShowCollect(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowCollect(false)}>Record & Print</Button></>}>
        <div className="space-y-4">
          <Select label="Student" required options={[{ value: '', label: 'Select student...' }, { value: 'aarav', label: 'Aarav Sharma' }, { value: 'diya', label: 'Diya Patel' }]} />
          <Select label="Instalment" required options={[{ value: '1', label: 'Instalment 1' }, { value: '2', label: 'Instalment 2' }, { value: '3', label: 'Instalment 3' }]} />
          <Select label="Payment Mode" required options={[{ value: 'cash', label: 'Cash' }, { value: 'cheque', label: 'Cheque' }, { value: 'dd', label: 'Demand Draft (DD)' }, { value: 'bank', label: 'Bank Transfer' }]} />
          <Input label="Amount (₹)" type="number" required />
          <Input label="Cheque / DD Number" placeholder="Reference if applicable" />
          <Input label="Bank Name" placeholder="Issuing bank" />
        </div>
      </Modal>
    </div>
  );
}

function OnlineCollection() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <PageHeader title="Online Fee Collection" breadcrumbs={['Accountant', 'Online Collection']} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
          <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Online Today</p>
          <p className="text-[24px] font-bold text-[#17153A] mt-1">₹65K</p>
        </div>
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
          <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Online MTD</p>
          <p className="text-[24px] font-bold text-[#15803D] mt-1">₹12L</p>
        </div>
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
          <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Failed Today</p>
          <p className="text-[24px] font-bold text-[#BE123C] mt-1">3</p>
        </div>
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft">
          <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Pending Match</p>
          <p className="text-[24px] font-bold text-[#B45309] mt-1">5</p>
        </div>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="font-bold text-[#17153A] text-[16px]">Payment Gateway Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Transaction ID</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Matched Instalment</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { txn: 'TXN-88541', student: 'Aarav Sharma', amount: 15000, inst: 'Instalment 2', status: 'matched' },
                { txn: 'TXN-88540', student: 'Saanvi Reddy', amount: 25000, inst: 'Instalment 3', status: 'matched' },
                { txn: 'TXN-88539', student: 'Unknown', amount: 25000, inst: '—', status: 'unmatched' },
                { txn: 'TXN-88538', student: 'Ishaan Verma', amount: 10000, inst: '—', status: 'failed' },
              ].map((t, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-mono text-[12px] text-[#475569]">{t.txn}</td>
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{t.student}</td>
                  <td className="px-5 py-4 text-right font-bold text-[#17153A] text-[14px]">₹{t.amount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{t.inst}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                      t.status === 'matched' ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]' :
                      t.status === 'failed' ? 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]' :
                      'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                    }`}>
                      {t.status}
                    </span>
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

function Receipts() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant', 'Receipts']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Fee Receipts Repository</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Search, download PDF vouchers, and review official receipts</p>
        </div>
        <Select options={[{ value: 'all', label: 'All Modes' }, { value: 'online', label: 'Online' }, { value: 'cash', label: 'Cash' }, { value: 'cheque', label: 'Cheque' }]} className="!w-auto" />
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Receipt No.</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Mode</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Date</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { no: 'RCP-2026-05401', student: 'Aarav Sharma', amount: 15000, mode: 'Online', date: '2026-10-13' },
                { no: 'RCP-2026-05400', student: 'Diya Patel', amount: 25000, mode: 'Cash', date: '2026-10-13' },
                { no: 'RCP-2026-05399', student: 'Ishaan Verma', amount: 8000, mode: 'Cheque', date: '2026-10-12' },
                { no: 'RCP-2026-05398', student: 'Saanvi Reddy', amount: 25000, mode: 'Online', date: '2026-10-12' },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-mono text-[12px] text-[#475569]">{r.no}</td>
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{r.student}</td>
                  <td className="px-5 py-4 text-right font-bold text-[#17153A] text-[14px]">₹{r.amount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                      {r.mode}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{r.date}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          generateReceiptPdf({
                            receiptNo: r.no,
                            date: r.date,
                            mode: r.mode,
                            amount: r.amount,
                            studentName: r.student,
                            instalment: 'Tuition & Academic Term Fee',
                            academicYear: '2026 - 2027',
                            status: 'PAID',
                          });
                          showToast(`Official Fee Receipt ${r.no}.pdf downloaded!`, 'success');
                        }}
                        className="px-2.5 py-1 text-[12px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] rounded-lg hover:bg-[#7C612A] hover:text-white transition-all cursor-pointer"
                      >
                        PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          generateReceiptPdf({
                            receiptNo: r.no,
                            date: r.date,
                            mode: r.mode,
                            amount: r.amount,
                            studentName: r.student,
                            instalment: 'Tuition & Academic Term Fee (Duplicate Copy)',
                            academicYear: '2026 - 2027',
                            status: 'PAID',
                          });
                          showToast(`Reprinted Fee Receipt ${r.no}.pdf downloaded!`, 'success');
                        }}
                        className="px-2.5 py-1 text-[12px] font-semibold text-[#17153A] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                      >
                        Reprint
                      </button>
                    </div>
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

function Refunds() {
  const [showRefund, setShowRefund] = useState(false);
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant', 'Refunds']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Fee Refunds & Adjustments</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">School leaving settlements and excess balance reversals</p>
        </div>
        <button
          type="button"
          onClick={() => setShowRefund(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:add-circle-linear" size={16} />
          <span>Record Refund</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Refund Amount</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Reason</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Date</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { student: 'Vihaan Joshi', amount: 8000, reason: 'School leaving - transport fee adjustment', date: '2026-09-28', status: 'approved' },
                { student: 'Myra Singh', amount: 5000, reason: 'Excess payment adjustment', date: '2026-09-15', status: 'pending approval' },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{r.student}</td>
                  <td className="px-5 py-4 text-right font-bold text-[#BE123C] text-[14px]">₹{r.amount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{r.reason}</td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{r.date}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                      r.status === 'approved' ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]' : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
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

      <Modal open={showRefund} onClose={() => setShowRefund(false)} title="Record Refund Request" footer={<><Button variant="outline" onClick={() => setShowRefund(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowRefund(false)}>Submit Refund</Button></>}>
        <div className="space-y-4">
          <Select label="Student" required options={[{ value: '', label: 'Select student...' }, { value: 'vihaan', label: 'Vihaan Joshi' }, { value: 'myra', label: 'Myra Singh' }]} />
          <Input label="Refund Amount (₹)" type="number" required />
          <Textarea label="Reason" rows={3} required placeholder="State refund context and adjustment details" />
        </div>
      </Modal>
    </div>
  );
}

function FeeReminders() {
  const [showSend, setShowSend] = useState(false);
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant', 'Fee Reminders']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Automated Fee Reminders</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Push, SMS, and WhatsApp alerts for upcoming instalments</p>
        </div>
        <button
          type="button"
          onClick={() => setShowSend(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:plain-linear" size={16} />
          <span>Send Reminder</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Reminder</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Target</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Channels</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Sent Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { title: 'Due Fee Reminder - Instalment 3', target: 'Class 8 Parents', channels: 'Push, SMS', date: '2026-10-12' },
                { title: 'Overdue Reminder - Transport Fee', target: '5 Students', channels: 'Push, WhatsApp', date: '2026-10-10' },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{r.title}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{r.target}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {r.channels.split(', ').map(c => (
                        <span key={c} className="px-2 py-0.5 rounded-md text-[12px] font-medium bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showSend} onClose={() => setShowSend(false)} title="Send Fee Reminder" footer={<><Button variant="outline" onClick={() => setShowSend(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowSend(false)}>Send Broadcast</Button></>}>
        <div className="space-y-4">
          <Select label="Reminder Type" required options={[{ value: 'due', label: 'Due Fee Reminder' }, { value: 'overdue', label: 'Overdue Fee Reminder' }]} />
          <Select label="Target" required options={[{ value: 'all', label: 'All Parents' }, { value: 'class', label: 'Selected Class' }, { value: 'students', label: 'Selected Students' }]} />
          <Textarea label="Message" rows={3} placeholder="Customize message copy..." />
          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-2 text-[14px] text-[#17153A] cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded text-[#7C612A]" defaultChecked /> Push</label>
            <label className="flex items-center gap-2 text-[14px] text-[#17153A] cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded text-[#7C612A]" defaultChecked /> SMS</label>
            <label className="flex items-center gap-2 text-[14px] text-[#17153A] cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded text-[#7C612A]" /> WhatsApp</label>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function TransportFee() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <PageHeader title="Transport Fee" breadcrumbs={['Accountant', 'Transport Fee']} />
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Route</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Transport Fee</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Paid</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Due</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { student: 'Aarav Sharma', route: 'Route 3 - Kothrud', fee: 16000, paid: 8000, due: 8000 },
                { student: 'Diya Patel', route: 'Route 1 - Camp', fee: 14000, paid: 14000, due: 0 },
                { student: 'Ishaan Verma', route: 'Route 5 - Baner', fee: 18000, paid: 9000, due: 9000 },
              ].map((t, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{t.student}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{t.route}</td>
                  <td className="px-5 py-4 text-right font-medium text-[#17153A] text-[14px]">₹{t.fee.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-right font-bold text-[#15803D] text-[14px]">₹{t.paid.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-right font-bold text-[#BE123C] text-[14px]">₹{t.due.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-right">
                    {t.due > 0 && (
                      <button type="button" className="px-3 py-1.5 text-[12px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-lg transition-colors cursor-pointer">
                        Collect
                      </button>
                    )}
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

function Reconciliation() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Accountant', 'Reconciliation']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Gateway Settlement & Bank Reconciliation</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Automated settlement audit for October 13, 2026</p>
        </div>
        <Button size="sm" variant="outline" icon={<Icon name="solar:download-minimalistic-linear" size={14} />}>Export Report</Button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Transaction ID</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Gateway</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { txn: 'TXN-88541', student: 'Aarav Sharma', amount: 15000, gateway: 'Razorpay', settlement: 'settled' },
                { txn: 'TXN-88540', student: 'Saanvi Reddy', amount: 25000, gateway: 'Razorpay', settlement: 'settled' },
                { txn: 'TXN-88539', student: 'Diya Patel', amount: 25000, gateway: 'Razorpay', settlement: 'pending' },
              ].map((t, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-mono text-[12px] text-[#475569]">{t.txn}</td>
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{t.student}</td>
                  <td className="px-5 py-4 text-right font-bold text-[#17153A] text-[14px]">₹{t.amount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{t.gateway}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                      t.settlement === 'settled' ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]' : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                    }`}>
                      {t.settlement}
                    </span>
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

function FeeReports() {
  const reports = [
    { name: 'Day Book', desc: 'Daily collections audit record', icon: 'solar:calendar-date-linear' },
    { name: 'Class-wise Collection', desc: 'Fee collections summary grouped by class', icon: 'solar:layers-linear' },
    { name: 'Fee-head Collection', desc: 'Breakdown by tuition, admission, activity', icon: 'solar:tag-linear' },
    { name: 'Outstanding Dues List', desc: 'Comprehensive pending fees ledger', icon: 'solar:danger-circle-linear' },
    { name: 'Defaulters Roster', desc: 'Students with overdue fees across terms', icon: 'solar:user-cross-linear' },
    { name: 'Concessions Report', desc: 'Scholarships and discounts granted', icon: 'Percent' },
    { name: 'Payment Mode Report', desc: 'Collection split by gateway, cash, cheque', icon: 'solar:card-linear' },
  ];
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <PageHeader title="Financial & Fee Reports" breadcrumbs={['Accountant', 'Reports']} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map(r => (
          <div key={r.name} className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-5 shadow-card-soft hover:border-[#CBD5E1] transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center mb-3.5">
              <Icon name={r.icon} size={20} />
            </div>
            <p className="font-bold text-[#17153A] text-[16px]">{r.name}</p>
            <p className="text-[14px] text-[#64748B] mt-1">{r.desc}</p>
            <div className="flex gap-2 mt-4 pt-4 border-t border-[#F1F5F9]">
              <button
                type="button"
                className="px-3 py-1.5 text-[12px] font-semibold text-[#17153A] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Icon name="solar:document-text-linear" size={14} className="text-[#7C612A]" />
                <span>Excel</span>
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-[12px] font-semibold text-[#17153A] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Icon name="solar:download-minimalistic-linear" size={14} className="text-[#7C612A]" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
