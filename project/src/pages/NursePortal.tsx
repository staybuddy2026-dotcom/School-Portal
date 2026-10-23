import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { PageHeader, StatusBadge, Card, Badge, Button, StatCard, Table, Avatar, Breadcrumb, Modal, Input, Select, Textarea, SectionHeader, EmptyState } from '@/components/ui';

interface NursePortalProps {
  activeKey: string;
}

export function NursePortal({ activeKey }: NursePortalProps) {
  switch (activeKey) {
    case 'nurse-dashboard': return <NurseDashboard />;
    case 'nurse-profile': return <NurseProfile />;
    case 'nurse-search': return <StudentSearch />;
    case 'nurse-health': return <HealthProfile />;
    case 'nurse-visit-entry': return <VisitEntry />;
    case 'nurse-visit-history': return <VisitHistory />;
    case 'nurse-medicine': return <MedicineStock />;
    case 'nurse-reports': return <NurseReports />;
    default: return <NurseDashboard />;
  }
}


const visitRecords = [
  { id: 'v1', date: '2026-10-13', timeIn: '10:30', timeOut: '11:15', student: 'Aarav Sharma', class: '8-A', complaint: 'Headache and mild fever', treatment: 'Paracetamol, rest', status: 'treated' },
  { id: 'v2', date: '2026-10-13', timeIn: '09:00', timeOut: '—', student: 'Diya Patel', class: '8-A', complaint: 'Stomach pain', treatment: 'Observation', status: 'in infirmary' },
  { id: 'v3', date: '2026-10-12', timeIn: '12:00', timeOut: '01:30', student: 'Ishaan Verma', class: '8-A', complaint: 'Ankle sprain', treatment: 'Cold compress, bandage', status: 'sent home' },
  { id: 'v4', date: '2026-10-12', timeIn: '11:00', timeOut: '11:45', student: 'Saanvi Reddy', class: '7-B', complaint: 'Nosebleed', treatment: 'First aid', status: 'treated' },
];

function NurseDashboard() {
  const todayVisits = visitRecords.filter(v => v.date === '2026-10-13');
  const inInfirmary = visitRecords.filter(v => v.status === 'in infirmary');
  const sentHome = visitRecords.filter(v => v.status === 'sent home' && v.date >= '2026-10-12');

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div>
        <Breadcrumb items={['Nurse Portal', 'Dashboard']} />
        <div className="mt-1">
          <h1 className="text-[22px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">Infirmary Dashboard</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">Monday, October 13, 2026 · Overview of medical visits and care</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Today's Visits</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">{todayVisits.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
            <Icon name="solar:clipboard-text-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">In Infirmary Now</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">{inInfirmary.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] flex items-center justify-center shrink-0">
            <Icon name="solar:heart-pulse-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Sent Home</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">{sentHome.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] flex items-center justify-center shrink-0">
            <Icon name="solar:home-2-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Treated & Released</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">{todayVisits.filter(v => v.status === 'treated').length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] flex items-center justify-center shrink-0">
            <Icon name="solar:check-circle-linear" size={20} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Students in Infirmary */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="font-bold text-[#17153A] text-[16px]">Students Currently in Infirmary</h3>
            <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
              {inInfirmary.length} Active
            </span>
          </div>
          <div className="p-5 space-y-3">
            {inInfirmary.length > 0 ? inInfirmary.map(v => (
              <div key={v.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]">
                <Avatar name={v.student} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#17153A] truncate">{v.student}</p>
                  <p className="text-[12px] text-[#64748B]">Class {v.class} · {v.complaint}</p>
                </div>
                <span className="text-[12px] font-medium text-[#7C612A] bg-[#FFFFFF] px-2.5 py-1 rounded-lg border border-[#E8DFC8] shrink-0">
                  Since {v.timeIn}
                </span>
              </div>
            )) : (
              <EmptyState icon={<Icon name="solar:check-circle-linear" size={28} className="text-[#15803D]" />} title="No Students in Infirmary" description="All clear — no students are currently under observation." />
            )}
          </div>
        </div>

        {/* Today's Visits */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="font-bold text-[#17153A] text-[16px]">Today's Check-ins</h3>
            <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">
              {todayVisits.length} Records
            </span>
          </div>
          <div className="p-5 space-y-3">
            {todayVisits.map(v => (
              <div key={v.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors">
                <Avatar name={v.student} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#17153A] truncate">{v.student}</p>
                  <p className="text-[12px] text-[#64748B] truncate">{v.complaint}</p>
                </div>
                <div className="shrink-0">
                  <StatusBadge status={v.status} size="sm" dot />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NurseProfile() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <PageHeader title="My Profile" breadcrumbs={['Nurse', 'My Profile']} />
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft p-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#F1F5F9]">
          <Avatar name="Farida Sheikh" size="lg" />
          <div>
            <h3 className="text-[18px] font-bold text-[#17153A]">Nurse Farida Sheikh</h3>
            <p className="text-[14px] text-[#64748B]">Staff Nurse · Campus Infirmary</p>
          </div>
        </div>
        <div className="space-y-3.5 max-w-md">
          <div className="flex justify-between items-center text-[14px] py-1">
            <span className="text-[#64748B]">Employee ID</span>
            <span className="font-semibold text-[#17153A]">EMP-2021-0045</span>
          </div>
          <div className="flex justify-between items-center text-[14px] py-1 border-t border-[#F8FAFC]">
            <span className="text-[#64748B]">Email</span>
            <span className="font-semibold text-[#17153A]">farida@greenwood.edu</span>
          </div>
          <div className="flex justify-between items-center text-[14px] py-1 border-t border-[#F8FAFC]">
            <span className="text-[#64748B]">Phone</span>
            <span className="font-semibold text-[#17153A]">+91 98220 99001</span>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-[#F1F5F9]">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-[14px] font-semibold text-[#17153A] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <Icon name="solar:key-linear" size={16} className="text-[#7C612A]" />
            <span>Change Password</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentSearch() {
  const [query, setQuery] = useState('');
  const results = [
    { id: 'STU-2026-0142', name: 'Aarav Sharma', class: '8-A', gr: 'GR-9821', blood: 'B+' },
    { id: 'STU-2026-0143', name: 'Diya Patel', class: '8-A', gr: 'GR-9822', blood: 'O+' },
    { id: 'STU-2026-0144', name: 'Ishaan Verma', class: '8-A', gr: 'GR-9823', blood: 'A+' },
    { id: 'STU-2026-0145', name: 'Saanvi Reddy', class: '7-B', gr: 'GR-9824', blood: 'AB+' },
  ].filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.id.toLowerCase().includes(query.toLowerCase()) || s.gr.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <PageHeader title="Student Search" breadcrumbs={['Nurse', 'Student Search']} />
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft p-5">
        <div className="relative mb-5">
          <Icon name="solar:magnifier-linear" size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by student name, ID, class, or GR number..."
            className="w-full h-11 pl-10 pr-4 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] placeholder-[#94A3B8] outline-none focus:border-[#7C612A] transition-colors"
          />
        </div>
        <div className="space-y-2.5">
          {results.map(s => (
            <div key={s.id} className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] transition-colors">
              <Avatar name={s.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#17153A] truncate">{s.name}</p>
                <p className="text-[12px] text-[#64748B]">{s.id} · Class {s.class} · {s.gr}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-md text-[12px] font-bold bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
                {s.blood}
              </span>
              <button
                type="button"
                className="px-3 py-1.5 text-[12px] font-semibold text-[#17153A] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                View Profile
              </button>
            </div>
          ))}
          {results.length === 0 && (
            <EmptyState icon={<Icon name="solar:danger-circle-linear" size={28} className="text-[#94A3B8]" />} title="No Results Found" description="Try a different student name or ID." />
          )}
        </div>
      </div>
    </div>
  );
}

function HealthProfile() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <PageHeader title="Student Health Profile" breadcrumbs={['Nurse', 'Health Profile']} />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft p-6">
          <div className="flex flex-col items-center text-center mb-5">
            <Avatar name="Aarav Sharma" size="lg" className="!w-20 !h-20 !text-[20px]" />
            <h3 className="text-[17px] font-bold text-[#17153A] mt-3">Aarav Sharma</h3>
            <p className="text-[14px] text-[#64748B]">Class 8-A · STU-2026-0142</p>
          </div>
          <div className="space-y-3 pt-5 border-t border-[#F1F5F9]">
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-[#64748B]">Blood Group</span>
              <span className="px-2.5 py-0.5 rounded-md text-[12px] font-bold bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">B+</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-[#64748B]">Height</span>
              <span className="font-semibold text-[#17153A]">145 cm</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-[#64748B]">Weight</span>
              <span className="font-semibold text-[#17153A]">38 kg</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-[#64748B]">Emergency Contact</span>
              <span className="font-semibold text-[#17153A]">+91 98765 43210</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-5">
            <div>
              <h3 className="font-bold text-[#17153A] text-[16px]">Medical Record</h3>
              <p className="text-[12px] text-[#64748B]">Annual health parameters & medical conditions</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-colors cursor-pointer"
            >
              <Icon name="solar:pen-2-linear" size={14} />
              <span>Update Record</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] text-[#64748B] font-semibold block mb-1">Blood Group</label>
              <input defaultValue="B+" className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none" />
            </div>
            <div>
              <label className="text-[12px] text-[#64748B] font-semibold block mb-1">Height (cm)</label>
              <input defaultValue="145" className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none" />
            </div>
            <div>
              <label className="text-[12px] text-[#64748B] font-semibold block mb-1">Weight (kg)</label>
              <input defaultValue="38" className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none" />
            </div>
            <div>
              <label className="text-[12px] text-[#64748B] font-semibold block mb-1">Emergency Contact</label>
              <input defaultValue="+91 98765 43210" className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[12px] text-[#64748B] font-semibold block mb-1">Known Allergies</label>
              <textarea rows={2} defaultValue="None reported" className="w-full px-3.5 py-2 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[12px] text-[#64748B] font-semibold block mb-1">Existing Medical Conditions</label>
              <textarea rows={2} defaultValue="None reported" className="w-full px-3.5 py-2 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none resize-none" />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]">
            <Icon name="solar:shield-check-linear" size={17} className="text-[#7C612A] shrink-0" />
            <span className="text-[12px] text-[#7C612A] font-medium">Health data is strictly restricted to authorized campus infirmary personnel.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisitEntry() {
  const [showEntry, setShowEntry] = useState(false);
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Nurse', 'Visit Entry']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Infirmary Visit Entry</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Log new student medical check-ins and notify guardians</p>
        </div>
        <button
          type="button"
          onClick={() => setShowEntry(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:add-circle-linear" size={16} />
          <span>New Visit Entry</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Date</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Complaint</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Treatment</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {visitRecords.map(v => (
                <tr key={v.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap text-[14px] text-[#475569]">{v.date}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={v.student} size="xs" />
                      <span className="font-semibold text-[#17153A] text-[14px]">{v.student}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[14px] text-[#334155]">{v.complaint}</td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{v.treatment}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={v.status} size="sm" dot />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <button type="button" className="text-[12px] font-semibold text-[#7C612A] hover:text-[#560110] px-2.5 py-1 rounded-lg hover:bg-[#FAF7F2] transition-colors cursor-pointer">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showEntry} onClose={() => setShowEntry(false)} title="New Infirmary Visit Entry" size="lg" footer={<><Button variant="outline" onClick={() => setShowEntry(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowEntry(false)} icon={<Icon name="solar:diskette-linear" size={16} />}>Save & Notify Parent</Button></>}>
        <div className="space-y-4">
          <Select label="Student" required options={[{ value: '', label: 'Search student...' }, { value: 'aarav', label: 'Aarav Sharma (8-A)' }, { value: 'diya', label: 'Diya Patel (8-A)' }, { value: 'ishaan', label: 'Ishaan Verma (8-A)' }]} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Visit Date" type="date" required />
            <Input label="Time In" type="time" required />
            <Input label="Time Out" type="time" />
          </div>
          <Textarea label="Complaint" rows={2} required placeholder="What is the student's complaint?" />
          <Textarea label="First Aid / Treatment Given" rows={2} required placeholder="Treatment provided" />
          <Textarea label="Remarks" rows={2} placeholder="Additional notes" />
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]">
            <Icon name="solar:bell-linear" size={16} className="text-[#7C612A]" />
            <span className="text-[12px] text-[#7C612A] font-medium">Parent will be notified immediately upon saving this record.</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" icon={<Icon name="solar:phone-calling-linear" size={14} />}>Call Parent for Pickup</Button>
            <Button variant="outline" size="sm" icon={<Icon name="solar:home-2-linear" size={14} />}>Mark as Sent Home</Button>
            <Button variant="outline" size="sm" icon={<Icon name="solar:stethoscope-linear" size={14} />}>Refer to Doctor</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function VisitHistory() {
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <PageHeader title="Visit History" breadcrumbs={['Nurse', 'Visit History']} />
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Select options={[{ value: 'all', label: 'All Classes' }, { value: '8a', label: 'Class 8-A' }, { value: '8b', label: 'Class 8-B' }, { value: '7a', label: 'Class 7-A' }]} value={filter} onChange={e => setFilter(e.target.value)} className="!w-auto" />
            <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="!w-auto" />
          </div>
          <Button size="sm" variant="outline" icon={<Icon name="solar:download-minimalistic-linear" size={14} />}>Export</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Date</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Time In</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Class</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Complaint</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {visitRecords.map(v => (
                <tr key={v.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{v.date}</td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{v.timeIn}</td>
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{v.student}</td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{v.class}</td>
                  <td className="px-5 py-4 text-[14px] text-[#334155]">{v.complaint}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                      v.status === 'treated' ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]' : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                    }`}>
                      {v.status}
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

function MedicineStock() {
  const [showAdd, setShowAdd] = useState(false);
  const stock = [
    { name: 'Paracetamol 500mg', stock: 120, unit: 'tablets', min: 50, status: 'in stock' },
    { name: 'Cotton Roll', stock: 8, unit: 'rolls', min: 10, status: 'low stock' },
    { name: 'Bandage (2 inch)', stock: 15, unit: 'rolls', min: 5, status: 'in stock' },
    { name: 'Antiseptic Solution', stock: 3, unit: 'bottles', min: 5, status: 'low stock' },
    { name: 'ORS Sachets', stock: 50, unit: 'sachets', min: 20, status: 'in stock' },
    { name: 'Ice Packs', stock: 12, unit: 'pieces', min: 5, status: 'in stock' },
  ];
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Nurse', 'Medicine Stock']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Infirmary Medicine Stock</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Inventory of medical supplies, first-aid kits, and reorder levels</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:add-circle-linear" size={16} />
          <span>Add Stock Item</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Total Items</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">{stock.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
            <Icon name="solar:medical-kit-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">In Stock</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">{stock.filter(s => s.status === 'in stock').length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] flex items-center justify-center shrink-0">
            <Icon name="solar:check-circle-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Low Stock</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">{stock.filter(s => s.status === 'low stock').length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] flex items-center justify-center shrink-0">
            <Icon name="solar:danger-circle-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Used This Month</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">47</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
            <Icon name="solar:chart-2-linear" size={20} />
          </div>
        </div>
      </div>

      {stock.filter(s => s.status === 'low stock').length > 0 && (
        <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center gap-3">
          <Icon name="solar:danger-triangle-linear" size={18} className="text-[#B45309] shrink-0" />
          <span className="text-[14px] text-[#B45309] font-medium">
            Low stock alert: {stock.filter(s => s.status === 'low stock').map(s => s.name).join(', ')}
          </span>
        </div>
      )}

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Item Name</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Stock</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Min Level</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Used This Month</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {stock.map((s, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{s.name}</td>
                  <td className="px-5 py-4 text-right font-medium text-[#17153A] text-[14px]">{s.stock} {s.unit}</td>
                  <td className="px-5 py-4 text-right text-[14px] text-[#64748B]">{s.min} {s.unit}</td>
                  <td className="px-5 py-4 text-right text-[14px] text-[#64748B]">{Math.floor(s.stock * 0.3)}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                      s.status === 'in stock' ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]' : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
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

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Stock Item" footer={<><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowAdd(false)}>Add Item</Button></>}>
        <div className="space-y-4">
          <Input label="Item Name" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Quantity" type="number" required />
            <Input label="Unit" placeholder="tablets, rolls, bottles" required />
          </div>
          <Input label="Minimum Stock Level" type="number" required />
        </div>
      </Modal>
    </div>
  );
}

function NurseReports() {
  const reports = [
    { name: 'Daily Visit Report', desc: 'Infirmary visits for a specific day', icon: 'solar:calendar-date-linear' },
    { name: 'Monthly Visit Report', desc: 'Complete monthly visit summary', icon: 'solar:calendar-mark-linear' },
    { name: 'Class-wise Visit Counts', desc: 'Visits grouped by class', icon: 'solar:users-group-rounded-linear' },
    { name: 'Frequent Visitors List', desc: 'Students with most visits', icon: 'solar:restart-linear' },
  ];
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <PageHeader title="Infirmary Reports" breadcrumbs={['Nurse', 'Reports']} />
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
