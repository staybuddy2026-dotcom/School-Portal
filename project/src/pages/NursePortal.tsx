import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { PageHeader, StatusBadge, Card, Badge, Button, StatCard, Table, Avatar, Breadcrumb, Modal, Input, Select, Textarea, SectionHeader, EmptyState, showToast } from '@/components/ui';
import { formatDateOnly } from '@/utils/date';

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

interface VisitHistoryItem {
  id: string;
  date: string;
  timeIn: string;
  timeOut: string;
  student: string;
  rollNo: string;
  classNum: string; // '1' to '12'
  section: string; // 'A', 'B', 'C'
  complaint: string;
  treatment: string;
  medicineGiven: string;
  medicineQty: string;
  temperature: string;
  pulse: string;
  status: 'Treated' | 'In Infirmary' | 'Sent Home' | 'Referred';
  parentInformed: boolean;
  remarks: string;
}

const initialVisitHistoryRecords: VisitHistoryItem[] = [
  {
    id: 'VIS-2026-101',
    date: '2026-10-19',
    timeIn: '09:15 AM',
    timeOut: '09:45 AM',
    student: 'Aarav Sharma',
    rollNo: '8A-12',
    classNum: '8',
    section: 'A',
    complaint: 'Headache and mild fever after morning test',
    treatment: 'Bed rest in quiet ward, cold forehead compress',
    medicineGiven: 'Paracetamol Tablets (500 mg)',
    medicineQty: '1 Tablet',
    temperature: '100.4 °F',
    pulse: '82 bpm',
    status: 'Treated',
    parentInformed: true,
    remarks: 'Temperature reduced to 98.8°F after 30 mins rest. Student sent back to 3rd period class.',
  },
  {
    id: 'VIS-2026-102',
    date: '2026-10-19',
    timeIn: '10:00 AM',
    timeOut: '11:15 AM',
    student: 'Diya Patel',
    rollNo: '8A-24',
    classNum: '8',
    section: 'A',
    complaint: 'Severe abdominal cramps and dizziness',
    treatment: 'Infirmary observation bed, hot water bag applied',
    medicineGiven: 'Dicyclomine Tablets (10 mg)',
    medicineQty: '1 Tablet',
    temperature: '98.6 °F',
    pulse: '76 bpm',
    status: 'In Infirmary',
    parentInformed: true,
    remarks: 'Under observation in bed 2. Warm water given. Awaiting improvement before lunch.',
  },
  {
    id: 'VIS-2026-103',
    date: '2026-10-19',
    timeIn: '10:30 AM',
    timeOut: '11:00 AM',
    student: 'Ishaan Verma',
    rollNo: '8B-15',
    classNum: '8',
    section: 'B',
    complaint: 'Ankle twisted while running on football field',
    treatment: 'RICE protocol: Ice pack applied, crepe bandage support wrapped',
    medicineGiven: 'Pain Relief Spray (Volini)',
    medicineQty: 'Topical Application',
    temperature: '98.4 °F',
    pulse: '88 bpm',
    status: 'Sent Home',
    parentInformed: true,
    remarks: 'Swelling noted on lateral malleolus. Father Mr. Rajesh Verma arrived for pickup at 11:05 AM.',
  },
  {
    id: 'VIS-2026-104',
    date: '2026-10-18',
    timeIn: '11:15 AM',
    timeOut: '11:45 AM',
    student: 'Saanvi Reddy',
    rollNo: '7B-08',
    classNum: '7',
    section: 'B',
    complaint: 'Active nosebleed (epistaxis) due to dry weather',
    treatment: 'Head tilted forward, nasal pinch technique, ice pack on bridge of nose',
    medicineGiven: 'Sterile Cotton Roll Swabs',
    medicineQty: '2 Swabs',
    temperature: '98.6 °F',
    pulse: '80 bpm',
    status: 'Treated',
    parentInformed: false,
    remarks: 'Bleeding stopped within 7 minutes. Advised to stay well hydrated and avoid picking nose.',
  },
  {
    id: 'VIS-2026-105',
    date: '2026-10-18',
    timeIn: '01:20 PM',
    timeOut: '01:50 PM',
    student: 'Reyansh Mehta',
    rollNo: '6A-19',
    classNum: '6',
    section: 'A',
    complaint: 'Abrasions on both knees from slip during lunch recess',
    treatment: 'Wound irrigation with normal saline, Betadine antiseptic swab, sterile adhesive strips',
    medicineGiven: 'Antiseptic Solution (Betadine 5%) + First Aid Band-Aid',
    medicineQty: '2 Strips',
    temperature: '98.5 °F',
    pulse: '84 bpm',
    status: 'Treated',
    parentInformed: false,
    remarks: 'Superficial skin loss, no foreign objects. Clean dressing applied. Advised PE teacher to excuse from running.',
  },
  {
    id: 'VIS-2026-106',
    date: '2026-10-17',
    timeIn: '08:45 AM',
    timeOut: '09:30 AM',
    student: 'Ananya Gupta',
    rollNo: '9C-04',
    classNum: '9',
    section: 'C',
    complaint: 'Dizziness, exhaustion and blackouts during morning assembly',
    treatment: 'Laid flat with legs elevated (Trendelenburg position), fresh air, ORS hydration',
    medicineGiven: 'ORS Electrolyte Sachets (WHO Formula)',
    medicineQty: '1 Sachet in 250ml water',
    temperature: '98.2 °F',
    pulse: '90 bpm',
    status: 'Treated',
    parentInformed: true,
    remarks: 'Skipped breakfast. Energy and blood pressure stabilized after ORS fluid intake. Student felt alert and returned to class.',
  },
  {
    id: 'VIS-2026-107',
    date: '2026-10-17',
    timeIn: '10:10 AM',
    timeOut: '10:45 AM',
    student: 'Kabir Joshi',
    rollNo: '5B-11',
    classNum: '5',
    section: 'B',
    complaint: 'Continuous allergic sneezing and watery red itchy eyes',
    treatment: 'Facial wash with sterile cold water, oral anti-allergy antihistamine syrup',
    medicineGiven: 'Cetirizine Syrup (Pediatric 5 mg/5 ml)',
    medicineQty: '5 ml',
    temperature: '98.7 °F',
    pulse: '78 bpm',
    status: 'Treated',
    parentInformed: true,
    remarks: 'Pollen allergy flare-up during gardening club activity. Symptoms subsided after 20 mins.',
  },
  {
    id: 'VIS-2026-108',
    date: '2026-10-16',
    timeIn: '02:00 PM',
    timeOut: '02:40 PM',
    student: 'Tanvi Kulkarni',
    rollNo: '10A-22',
    classNum: '10',
    section: 'A',
    complaint: 'Deep glass laceration on right thumb in chemistry laboratory',
    treatment: 'Direct pressure hemostasis, Betadine disinfection, sterile gauze pad & micro-pore dressing',
    medicineGiven: 'Roller Cotton Bandage + Betadine 5%',
    medicineQty: '1 Dressing',
    temperature: '98.6 °F',
    pulse: '92 bpm',
    status: 'Sent Home',
    parentInformed: true,
    remarks: 'Bleeding controlled. Advised tetanus toxoid booster verification. Mother picked up student for precautionary clinic visit.',
  },
  {
    id: 'VIS-2026-109',
    date: '2026-10-15',
    timeIn: '09:30 AM',
    timeOut: '10:15 AM',
    student: 'Vivaan Nair',
    rollNo: '3A-07',
    classNum: '3',
    section: 'A',
    complaint: 'Nausea, cold sweats, and two episodes of vomiting',
    treatment: 'Rehydration sips, oral anti-emetic drops, rest on bed 1',
    medicineGiven: 'Domperidone Suspension Drops',
    medicineQty: '3 ml',
    temperature: '99.0 °F',
    pulse: '86 bpm',
    status: 'In Infirmary',
    parentInformed: true,
    remarks: 'Vomiting ceased. Resting comfortably under blanket. Guardian contacted for early pickup.',
  },
  {
    id: 'VIS-2026-110',
    date: '2026-10-14',
    timeIn: '11:00 AM',
    timeOut: '11:30 AM',
    student: 'Riya Chawla',
    rollNo: '11B-14',
    classNum: '11',
    section: 'B',
    complaint: 'Pounding one-sided migraine with sensitivity to classroom lights',
    treatment: 'Rest in dark air-conditioned room, cold gel eye mask',
    medicineGiven: 'Paracetamol Tablets (500 mg)',
    medicineQty: '1 Tablet',
    temperature: '98.4 °F',
    pulse: '74 bpm',
    status: 'Treated',
    parentInformed: false,
    remarks: 'Headache intensity diminished from 8/10 to 2/10. Student resumed laboratory session.',
  },
  {
    id: 'VIS-2026-111',
    date: '2026-10-14',
    timeIn: '01:10 PM',
    timeOut: '01:45 PM',
    student: 'Aryan Deshmukh',
    rollNo: '12A-03',
    classNum: '12',
    section: 'A',
    complaint: 'High-grade fever (102.8°F), severe rigors, chills and body weakness',
    treatment: 'Immediate tepid sponging, paracetamol dose, vital sign recording every 10 mins',
    medicineGiven: 'Paracetamol Tablets (650 mg)',
    medicineQty: '1 Tablet',
    temperature: '102.8 °F',
    pulse: '104 bpm',
    status: 'Referred',
    parentInformed: true,
    remarks: 'Fever did not come down below 102°F. Immediate hospital referral letter issued to parents for blood work (CBC/Dengue).',
  },
  {
    id: 'VIS-2026-112',
    date: '2026-10-13',
    timeIn: '10:45 AM',
    timeOut: '11:15 AM',
    student: 'Kiara Sen',
    rollNo: '4C-16',
    classNum: '4',
    section: 'C',
    complaint: 'Wasp sting on left forearm during nature walk',
    treatment: 'Stinger inspected and removed, ice cube applied, soothing calamine lotion applied',
    medicineGiven: 'Calamine Antiseptic Lotion',
    medicineQty: 'Topical Application',
    temperature: '98.6 °F',
    pulse: '82 bpm',
    status: 'Treated',
    parentInformed: true,
    remarks: 'No signs of anaphylaxis or generalized hives. Local erythema subsided after 20 mins.',
  },
  {
    id: 'VIS-2026-113',
    date: '2026-10-12',
    timeIn: '11:30 AM',
    timeOut: '12:00 PM',
    student: 'Devansh Bhatt',
    rollNo: '2B-09',
    classNum: '2',
    section: 'B',
    complaint: 'Head bump & swelling above left eyebrow from corridor collision',
    treatment: 'Cold gel ice pack applied for 20 mins, pupil symmetry & orientation evaluated',
    medicineGiven: 'Burnol Antiseptic Ointment + Ice Pack',
    medicineQty: 'Topical Application',
    temperature: '98.5 °F',
    pulse: '88 bpm',
    status: 'Treated',
    parentInformed: true,
    remarks: 'No nausea, disorientation or vision impairment. Concussion checklist cleared. Class teacher briefed.',
  },
  {
    id: 'VIS-2026-114',
    date: '2026-10-11',
    timeIn: '02:15 PM',
    timeOut: '02:45 PM',
    student: 'Meera Swaminathan',
    rollNo: '7A-21',
    classNum: '7',
    section: 'A',
    complaint: 'Epigastric acidity, heartburn and sour belching',
    treatment: 'Warm water, upright sitting posture, liquid antacid administration',
    medicineGiven: 'Antacid Gel Suspension (Digene)',
    medicineQty: '10 ml',
    temperature: '98.6 °F',
    pulse: '76 bpm',
    status: 'Treated',
    parentInformed: false,
    remarks: 'Discomfort relieved completely within 15 mins. Advised not to stay on empty stomach.',
  },
];

function VisitHistory() {
  const [visitsList, setVisitsList] = useState<VisitHistoryItem[]>(initialVisitHistoryRecords);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSection, setSelectedSection] = useState('All Sections');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Modals State
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState<VisitHistoryItem | null>(null);
  const [viewingVisit, setViewingVisit] = useState<VisitHistoryItem | null>(null);
  const [deleteConfirmVisit, setDeleteConfirmVisit] = useState<VisitHistoryItem | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Omit<VisitHistoryItem, 'id'>>({
    date: '2026-10-19',
    timeIn: '10:00 AM',
    timeOut: '10:30 AM',
    student: '',
    rollNo: '',
    classNum: '8',
    section: 'A',
    complaint: '',
    treatment: '',
    medicineGiven: 'Paracetamol Tablets (500 mg)',
    medicineQty: '1 Tablet',
    temperature: '98.6 °F',
    pulse: '78 bpm',
    status: 'Treated',
    parentInformed: true,
    remarks: '',
  });

  // Filter Records
  const filteredVisits = visitsList.filter(item => {
    // Search query matches student, roll no, complaint, treatment, or medicine
    const matchesSearch =
      item.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.complaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.medicineGiven.toLowerCase().includes(searchQuery.toLowerCase());

    // Class Filter
    const matchesClass =
      selectedClass === 'All Classes' || item.classNum === selectedClass.replace('Class ', '');

    // Section Filter
    const matchesSection =
      selectedSection === 'All Sections' || item.section === selectedSection.replace('Section ', '');

    // Date Filter
    const matchesDate = !selectedDate || item.date === selectedDate;

    // Status Filter
    const matchesStatus =
      selectedStatus === 'All Statuses' || item.status === selectedStatus;

    return matchesSearch && matchesClass && matchesSection && matchesDate && matchesStatus;
  });

  // Counts for Metric Cards
  const totalVisits = visitsList.length;
  const treatedCount = visitsList.filter(v => v.status === 'Treated').length;
  const inInfirmaryCount = visitsList.filter(v => v.status === 'In Infirmary').length;
  const sentHomeCount = visitsList.filter(v => v.status === 'Sent Home' || v.status === 'Referred').length;

  const handleOpenAdd = () => {
    setEditingVisit(null);
    setFormData({
      date: '2026-10-19',
      timeIn: '10:00 AM',
      timeOut: '10:30 AM',
      student: '',
      rollNo: '',
      classNum: '8',
      section: 'A',
      complaint: '',
      treatment: '',
      medicineGiven: 'Paracetamol Tablets (500 mg)',
      medicineQty: '1 Tablet',
      temperature: '98.6 °F',
      pulse: '78 bpm',
      status: 'Treated',
      parentInformed: true,
      remarks: '',
    });
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (item: VisitHistoryItem) => {
    setEditingVisit(item);
    setFormData({
      date: item.date,
      timeIn: item.timeIn,
      timeOut: item.timeOut,
      student: item.student,
      rollNo: item.rollNo,
      classNum: item.classNum,
      section: item.section,
      complaint: item.complaint,
      treatment: item.treatment,
      medicineGiven: item.medicineGiven,
      medicineQty: item.medicineQty,
      temperature: item.temperature,
      pulse: item.pulse,
      status: item.status,
      parentInformed: item.parentInformed,
      remarks: item.remarks,
    });
    setShowAddEditModal(true);
  };

  const handleSaveVisit = () => {
    if (!formData.student.trim()) {
      showToast('Please enter the student name', 'error');
      return;
    }
    if (!formData.complaint.trim()) {
      showToast('Please specify the complaint or symptom', 'error');
      return;
    }
    if (!formData.treatment.trim()) {
      showToast('Please specify the treatment given', 'error');
      return;
    }

    if (editingVisit) {
      setVisitsList(prev =>
        prev.map(item =>
          item.id === editingVisit.id
            ? { ...item, ...formData }
            : item
        )
      );
      showToast(`Updated visit record for "${formData.student}" successfully!`, 'success');
    } else {
      const newRecord: VisitHistoryItem = {
        id: `VIS-2026-${String(visitsList.length + 101).padStart(3, '0')}`,
        ...formData,
      };
      setVisitsList(prev => [newRecord, ...prev]);
      showToast(`Logged infirmary visit for "${formData.student}"!`, 'success');
    }

    setShowAddEditModal(false);
  };

  const handleDeleteVisit = (id: string) => {
    const item = visitsList.find(v => v.id === id);
    setVisitsList(prev => prev.filter(v => v.id !== id));
    setDeleteConfirmVisit(null);
    showToast(`Removed visit record for "${item?.student || 'Student'}"`, 'info');
  };

  const handleExportCSV = () => {
    const headers = [
      'Visit ID',
      'Date',
      'Time In',
      'Time Out',
      'Student Name',
      'Roll No',
      'Class',
      'Section',
      'Complaint',
      'Treatment Given',
      'Medicine Administered',
      'Dosage / Qty',
      'Temperature',
      'Pulse',
      'Outcome Status',
      'Parent Informed',
      'Nurse Clinical Remarks',
    ];

    const rows = filteredVisits.map(item => [
      `"${item.id}"`,
      `"${item.date}"`,
      `"${item.timeIn}"`,
      `"${item.timeOut}"`,
      `"${item.student.replace(/"/g, '""')}"`,
      `"${item.rollNo}"`,
      `"Class ${item.classNum}"`,
      `"Section ${item.section}"`,
      `"${item.complaint.replace(/"/g, '""')}"`,
      `"${item.treatment.replace(/"/g, '""')}"`,
      `"${item.medicineGiven.replace(/"/g, '""')}"`,
      `"${item.medicineQty}"`,
      `"${item.temperature}"`,
      `"${item.pulse}"`,
      `"${item.status}"`,
      item.parentInformed ? '"Yes"' : '"No"',
      `"${(item.remarks || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Infirmary_Visit_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Visit history exported to CSV successfully!', 'success');
  };

  const renderOutcomeBadge = (status: VisitHistoryItem['status']) => {
    switch (status) {
      case 'Treated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
            <span>Treated</span>
          </span>
        );
      case 'In Infirmary':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] animate-pulse" />
            <span>In Infirmary</span>
          </span>
        );
      case 'Sent Home':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BE123C]" />
            <span>Sent Home</span>
          </span>
        );
      case 'Referred':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
            <Icon name="solar:shield-warning-linear" size={13} className="text-[#DC2626]" />
            <span>Referred</span>
          </span>
        );
      default:
        return null;
    }
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedClass !== 'All Classes' ||
    selectedSection !== 'All Sections' ||
    selectedDate !== '' ||
    selectedStatus !== 'All Statuses';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedClass('All Classes');
    setSelectedSection('All Sections');
    setSelectedDate('');
    setSelectedStatus('All Statuses');
  };

  return (
    <div className="animate-fade-in space-y-6 pb-8 text-left">
      {/* 1. Header with Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb items={['Nurse Portal', 'Visit History']} />
          <div className="mt-1">
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">
              Infirmary Visit History & Treatment Log
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-semibold text-[#17153A] bg-[#FFFFFF] border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-xl transition-all shadow-xs cursor-pointer"
            title="Export CSV"
          >
            <Icon name="solar:download-minimalistic-linear" size={16} />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Icon name="ic:round-plus" size={20} />
            <span>Add Visit Record</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Total Visits Logged</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">{totalVisits}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
            <Icon name="solar:clipboard-check-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#15803D] uppercase tracking-wider">Treated & Sent to Class</p>
            <p className="text-[24px] font-bold text-[#15803D] mt-1">{treatedCount}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] flex items-center justify-center shrink-0">
            <Icon name="solar:check-circle-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#B45309] uppercase tracking-wider">In Infirmary Now</p>
            <p className="text-[24px] font-bold text-[#B45309] mt-1">{inInfirmaryCount}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] flex items-center justify-center shrink-0">
            <Icon name="solar:bed-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#BE123C] uppercase tracking-wider">Sent Home / Referred</p>
            <p className="text-[24px] font-bold text-[#BE123C] mt-1">{sentHomeCount}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] flex items-center justify-center shrink-0">
            <Icon name="solar:ambulance-linear" size={20} />
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Filter Bar (Search, Class, Section, Date, Status) */}
      <div className="bg-[#FFFFFF] p-4 sm:p-4.5 rounded-2xl border border-[#E2E8F0] shadow-card-soft space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search student, roll, complaint, medicine..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-[13px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] placeholder-[#94A3B8] outline-none focus:border-[#7C612A] transition-colors"
            />
            <Icon name="solar:magnifer-linear" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          </div>

          {/* Class Filter */}
          <div className="relative">
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full h-[38px] pl-3.5 pr-9 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer"
            >
              <option value="All Classes">All Classes</option>
              {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <Icon name="solar:alt-arrow-down-linear" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
          </div>

          {/* Section Filter */}
          <div className="relative">
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="w-full h-[38px] pl-3.5 pr-9 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer"
            >
              <option value="All Sections">All Sections</option>
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
              <option value="Section C">Section C</option>
            </select>
            <Icon name="solar:alt-arrow-down-linear" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
          </div>

          {/* Date Picker Filter */}
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full h-[38px] px-3.5 text-[13px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors cursor-pointer"
              title="Filter by Visit Date"
            />
          </div>

          {/* Outcome Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full h-[38px] pl-3.5 pr-9 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer"
            >
              <option value="All Statuses">All Statuses ({visitsList.length})</option>
              <option value="Treated">Treated ({treatedCount})</option>
              <option value="In Infirmary">In Infirmary ({inInfirmaryCount})</option>
              <option value="Sent Home">Sent Home</option>
              <option value="Referred">Referred</option>
            </select>
            <Icon name="solar:alt-arrow-down-linear" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-[12px]">
            <p className="text-[#64748B]">
              Showing <strong className="text-[#17153A]">{filteredVisits.length}</strong> of{' '}
              <strong className="text-[#17153A]">{visitsList.length}</strong> records matching current filters
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[#BE123C] hover:text-[#560110] font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Icon name="solar:close-circle-linear" size={14} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Visits Records Table */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        {filteredVisits.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center mx-auto mb-3">
              <Icon name="solar:clipboard-remove-linear" size={28} />
            </div>
            <h3 className="text-[16px] font-bold text-[#17153A]">No Visit Records Found</h3>
            <p className="text-[13px] text-[#64748B] mt-1 max-w-sm mx-auto">
              No medical records match your current filters. Clear the filters or log a new visit entry.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-3 px-4 py-1.5 text-[12px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl hover:bg-[#F3EDE2] transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider w-[15%]">
                    Visit Date & Time
                  </th>
                  <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider w-[20%]">
                    Student & Class
                  </th>
                  <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider w-[22%]">
                    Complaint & Vitals
                  </th>
                  <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider w-[25%]">
                    Treatment & Medicine
                  </th>
                  <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider w-[10%]">
                    Outcome
                  </th>
                  <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right w-[8%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredVisits.map(item => (
                  <tr
                    key={item.id}
                    onClick={() => setViewingVisit(item)}
                    className="hover:bg-[#FAF7F2]/40 transition-colors group cursor-pointer"
                  >
                    {/* Column 1: Date & Time In/Out */}
                    <td className="px-5 py-4 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#17153A]">
                        <span>{formatDateOnly(item.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-1 font-mono">
                        <Icon name="solar:clock-circle-linear" size={12} className="text-[#94A3B8]" />
                        <span>{item.timeIn} – {item.timeOut}</span>
                      </div>
                    </td>

                    {/* Column 2: Student Name, Roll No, Class Badge */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={item.student} size="sm" />
                        <div className="min-w-0">
                          <p className="font-semibold text-[#17153A] text-[14px] group-hover:text-[#7C612A] transition-colors truncate">
                            {item.student}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] px-1.5 py-0.5 rounded-md">
                              Class {item.classNum}-{item.section}
                            </span>
                            <span className="text-[11px] font-mono text-[#64748B]">
                              Roll #{item.rollNo}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 3: Complaint & Vitals */}
                    <td className="px-5 py-4 align-middle">
                      <p className="text-[13px] text-[#17153A] font-medium leading-snug line-clamp-2">
                        {item.complaint}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] px-1.5 py-0.5 rounded-md">
                          <Icon name="solar:thermometer-linear" size={11} />
                          <span>{item.temperature}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#475569] bg-[#F1F5F9] px-1.5 py-0.5 rounded-md">
                          <Icon name="solar:heart-pulse-linear" size={11} />
                          <span>{item.pulse}</span>
                        </span>
                      </div>
                    </td>

                    {/* Column 4: Treatment & Medicine Administered */}
                    <td className="px-5 py-4 align-middle">
                      <p className="text-[13px] text-[#334155] leading-snug line-clamp-1">
                        {item.treatment}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#17153A] bg-[#F8FAFC] border border-[#CBD5E1] px-2 py-0.5 rounded-md">
                          <Icon name="solar:pill-bold" size={11} className="text-[#7C612A]" />
                          <span>{item.medicineGiven}</span>
                        </span>
                        {item.medicineQty && (
                          <span className="text-[11px] text-[#64748B] font-medium">
                            ({item.medicineQty})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Column 5: Outcome Status */}
                    <td className="px-5 py-4 align-middle whitespace-nowrap">
                      {renderOutcomeBadge(item.status)}
                    </td>

                    {/* Column 6: Actions */}
                    <td
                      className="px-5 py-4 align-middle text-right whitespace-nowrap"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center justify-end gap-1">
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => setViewingVisit(item)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#17153A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                          title="View Full Case Sheet"
                        >
                          <Icon name="solar:eye-linear" size={16} />
                        </button>

                        {/* Edit Record */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#7C612A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                          title="Edit Visit Record"
                        >
                          <Icon name="solar:pen-linear" size={16} />
                        </button>

                        {/* Delete Record */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmVisit(item)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#BE123C] hover:bg-[#FFF1F2] transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Icon name="solar:trash-bin-trash-linear" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. ADD / EDIT VISIT RECORD MODAL */}
      {/* ========================================================================= */}
      <Modal
        open={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        title={editingVisit ? `Edit Infirmary Visit: ${editingVisit.student}` : 'Log New Infirmary Visit'}
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <Button variant="outline" onClick={() => setShowAddEditModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveVisit}
              icon={<Icon name={editingVisit ? "solar:check-circle-bold" : "solar:add-circle-bold"} size={16} />}
            >
              {editingVisit ? 'Save Changes' : 'Log Visit Record'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-left">
          {/* Row 1: Student Name, Roll No, Class, Section */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            <div className="sm:col-span-2">
              <Input
                label="Student Full Name"
                required
                placeholder="e.g. Aarav Sharma"
                value={formData.student}
                onChange={e => setFormData({ ...formData, student: e.target.value })}
              />
            </div>
            <div>
              <Input
                label="Roll Number"
                placeholder="e.g. 8A-12"
                value={formData.rollNo}
                onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
              />
            </div>
            <div>
              <Select
                label="Class"
                required
                options={Array.from({ length: 12 }, (_, i) => ({
                  value: String(i + 1),
                  label: `Class ${i + 1}`,
                }))}
                value={formData.classNum}
                onChange={e => setFormData({ ...formData, classNum: e.target.value })}
              />
            </div>
          </div>

          {/* Row 2: Section, Date, Time In, Time Out */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            <div>
              <Select
                label="Section"
                required
                options={[
                  { value: 'A', label: 'Section A' },
                  { value: 'B', label: 'Section B' },
                  { value: 'C', label: 'Section C' },
                ]}
                value={formData.section}
                onChange={e => setFormData({ ...formData, section: e.target.value })}
              />
            </div>
            <div>
              <Input
                label="Visit Date"
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Input
                label="Time In"
                placeholder="e.g. 10:15 AM"
                value={formData.timeIn}
                onChange={e => setFormData({ ...formData, timeIn: e.target.value })}
              />
            </div>
            <div>
              <Input
                label="Time Out"
                placeholder="e.g. 10:45 AM"
                value={formData.timeOut}
                onChange={e => setFormData({ ...formData, timeOut: e.target.value })}
              />
            </div>
          </div>

          {/* Row 3: Complaint / Symptoms */}
          <Textarea
            label="Chief Complaint / Symptoms"
            required
            rows={2}
            placeholder="e.g. Sudden stomach pain and dizziness during 2nd period class..."
            value={formData.complaint}
            onChange={e => setFormData({ ...formData, complaint: e.target.value })}
          />

          {/* Row 4: Treatment Administered */}
          <Textarea
            label="First Aid & Treatment Provided"
            required
            rows={2}
            placeholder="e.g. Cleaned wound with Betadine, applied sterile dressing, checked pulse..."
            value={formData.treatment}
            onChange={e => setFormData({ ...formData, treatment: e.target.value })}
          />

          {/* Row 5: Medicine Given, Dosage/Qty, Vitals */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            <div className="sm:col-span-2">
              <Input
                label="Medicine Administered"
                placeholder="e.g. Paracetamol Tablets (500 mg)"
                value={formData.medicineGiven}
                onChange={e => setFormData({ ...formData, medicineGiven: e.target.value })}
              />
            </div>
            <div>
              <Input
                label="Dosage / Qty"
                placeholder="e.g. 1 Tab, 5 ml"
                value={formData.medicineQty}
                onChange={e => setFormData({ ...formData, medicineQty: e.target.value })}
              />
            </div>
            <div>
              <Input
                label="Temperature"
                placeholder="e.g. 98.6 °F"
                value={formData.temperature}
                onChange={e => setFormData({ ...formData, temperature: e.target.value })}
              />
            </div>
          </div>

          {/* Row 6: Pulse, Outcome Status, Parent Informed Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <Input
                label="Pulse Rate"
                placeholder="e.g. 78 bpm"
                value={formData.pulse}
                onChange={e => setFormData({ ...formData, pulse: e.target.value })}
              />
            </div>
            <div>
              <Select
                label="Outcome Status"
                required
                options={[
                  { value: 'Treated', label: 'Treated & Sent to Class' },
                  { value: 'In Infirmary', label: 'Resting in Infirmary' },
                  { value: 'Sent Home', label: 'Sent Home with Parents' },
                  { value: 'Referred', label: 'Referred to Doctor' },
                ]}
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
              />
            </div>
            <div className="flex flex-col justify-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.parentInformed}
                  onChange={e => setFormData({ ...formData, parentInformed: e.target.checked })}
                  className="w-4 h-4 rounded text-[#7C612A] border-[#CBD5E1] focus:ring-0 cursor-pointer"
                />
                <span className="text-[13px] font-semibold text-[#17153A]">Guardian / Parent Informed</span>
              </label>
            </div>
          </div>

          {/* Row 7: Clinical Remarks */}
          <Textarea
            label="Nurse Clinical Remarks / Follow-up Notes"
            rows={2}
            placeholder="e.g. Student stabilized after 20 mins. Advised not to run in sports today..."
            value={formData.remarks}
            onChange={e => setFormData({ ...formData, remarks: e.target.value })}
          />
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 6. VIEW CASE SHEET MODAL (COMPACT - NO SCROLL) */}
      {/* ========================================================================= */}
      {viewingVisit && (
        <Modal
          open={!!viewingVisit}
          onClose={() => setViewingVisit(null)}
          title="Infirmary Visit Case Sheet"
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                onClick={() => {
                  const it = viewingVisit;
                  setViewingVisit(null);
                  handleOpenEdit(it);
                }}
                icon={<Icon name="solar:pen-linear" size={15} />}
              >
                Edit Record
              </Button>
              <Button variant="outline" onClick={() => setViewingVisit(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-3.5 text-left">
            {/* Header Identity Card */}
            <div className="bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[17px] font-bold text-[#17153A] truncate">{viewingVisit.student}</h3>
                  <span className="text-[11px] font-semibold text-[#7C612A] bg-[#FFFFFF] border border-[#E8DFC8] px-2 py-0.5 rounded-md">
                    Class {viewingVisit.classNum}-{viewingVisit.section}
                  </span>
                  <span className="text-[11px] font-mono text-[#64748B] bg-[#FFFFFF] border border-[#E2E8F0] px-2 py-0.5 rounded-md">
                    Roll #{viewingVisit.rollNo}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[12px] text-[#64748B]">
                  <span>Date: <strong className="text-[#17153A] font-semibold">{formatDateOnly(viewingVisit.date)}</strong></span>
                  <span>•</span>
                  <span>Time: <strong className="text-[#17153A] font-semibold">{viewingVisit.timeIn} – {viewingVisit.timeOut}</strong></span>
                </div>
              </div>
              <div className="shrink-0">
                {renderOutcomeBadge(viewingVisit.status)}
              </div>
            </div>

            {/* 3 Metric Strip Cards: Vitals & Parent Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Body Temperature</span>
                <div className="my-1">
                  <span className="text-[18px] font-bold text-[#B45309]">{viewingVisit.temperature}</span>
                </div>
                <span className="text-[11px] text-[#64748B]">Recorded at entry</span>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Pulse Rate</span>
                <div className="my-1">
                  <span className="text-[18px] font-bold text-[#17153A]">{viewingVisit.pulse}</span>
                </div>
                <span className="text-[11px] text-[#64748B]">Radial pulse</span>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Parent Notification</span>
                <div className="my-1">
                  {viewingVisit.parentInformed ? (
                    <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[#15803D]">
                      <Icon name="solar:check-circle-bold" size={15} />
                      <span>Informed & Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#64748B]">
                      <Icon name="solar:close-circle-linear" size={15} />
                      <span>Not Required</span>
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#64748B]">Guardian status</span>
              </div>
            </div>

            {/* Complaint & Treatment Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[#7C612A] mb-1">
                  <Icon name="solar:clipboard-text-linear" size={15} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Complaint & Symptoms</span>
                </div>
                <p className="text-[13px] text-[#17153A] font-medium leading-snug">
                  {viewingVisit.complaint}
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[#7C612A] mb-1">
                  <Icon name="solar:stethoscope-linear" size={15} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">First Aid / Treatment</span>
                </div>
                <p className="text-[13px] text-[#17153A] font-medium leading-snug">
                  {viewingVisit.treatment}
                </p>
              </div>
            </div>

            {/* Medicine Administered & Clinical Remarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[#7C612A] mb-1">
                  <Icon name="solar:pill-bold" size={15} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Medicine Administered</span>
                </div>
                <p className="text-[13px] font-bold text-[#17153A]">
                  {viewingVisit.medicineGiven}
                </p>
                {viewingVisit.medicineQty && (
                  <p className="text-[11px] text-[#64748B] mt-0.5 font-medium">Dosage: {viewingVisit.medicineQty}</p>
                )}
              </div>

              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[#7C612A] mb-1">
                  <Icon name="solar:notes-linear" size={15} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Clinical & Follow-up Notes</span>
                </div>
                <p className="text-[12px] text-[#475569] leading-snug italic">
                  "{viewingVisit.remarks || 'No further precautions noted.'}"
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 7. DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {deleteConfirmVisit && (
        <Modal
          open={!!deleteConfirmVisit}
          onClose={() => setDeleteConfirmVisit(null)}
          title="Delete Visit Record"
          size="sm"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" onClick={() => setDeleteConfirmVisit(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteVisit(deleteConfirmVisit.id)}
                icon={<Icon name="solar:trash-bin-trash-bold" size={15} />}
              >
                Delete Record
              </Button>
            </div>
          }
        >
          <div className="text-left space-y-2">
            <p className="text-[14px] text-[#17153A]">
              Are you sure you want to permanently delete the medical visit record for{' '}
              <strong className="font-bold text-[#BE123C]">{deleteConfirmVisit.student}</strong> (Class {deleteConfirmVisit.classNum}-{deleteConfirmVisit.section})?
            </p>
            <p className="text-[12px] text-[#64748B]">
              This action cannot be undone and will be logged in school health audit records.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

interface StockItem {
  id: string;
  name: string; // Item Name
  category: 'Medicine' | 'First Aid' | 'Dressing Supplies' | 'Antiseptics & Disinfectants' | 'Sprays & Ointments' | 'Consumables & Surgical';
  strength: string; // Medicine Strength
  stock: number; // Stock Quantity
  unit: string; // Unit
  minLevel: number; // Minimum Stock Level
  expiryDate: string; // Expiry Date (YYYY-MM-DD)
  batchNumber: string; // Batch Number
  supplierName: string; // Supplier Name
  purchaseDate: string; // Purchase Date (YYYY-MM-DD)
  usedThisMonth: number; // Used This Month
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired'; // Status
  remarks: string; // Remarks
}

const initialStockItems: StockItem[] = [
  {
    id: 'STK-001',
    name: 'Paracetamol Tablets',
    category: 'Medicine',
    strength: '500 mg',
    stock: 120,
    unit: 'Tablets',
    minLevel: 50,
    expiryDate: '2027-08-20',
    batchNumber: 'BT-2026-881',
    supplierName: 'Apex Pharma Labs',
    purchaseDate: '2026-06-15',
    usedThisMonth: 36,
    status: 'In Stock',
    remarks: 'Used for student fever, headache & body aches. Store in dry place below 25°C.',
  },
  {
    id: 'STK-002',
    name: 'Cotton Roll (Absorbent)',
    category: 'Dressing Supplies',
    strength: '500 g',
    stock: 6,
    unit: 'Rolls',
    minLevel: 10,
    expiryDate: '2028-12-31',
    batchNumber: 'CTN-4019',
    supplierName: 'Apollo Healthcare Supplies',
    purchaseDate: '2026-05-10',
    usedThisMonth: 8,
    status: 'Low Stock',
    remarks: 'Sterile surgical absorbent cotton for wound dressing and swab preparation.',
  },
  {
    id: 'STK-003',
    name: 'Roller Cotton Bandage (2 inch)',
    category: 'Dressing Supplies',
    strength: '2 inch x 5 m',
    stock: 18,
    unit: 'Rolls',
    minLevel: 5,
    expiryDate: '2028-04-15',
    batchNumber: 'BND-9022',
    supplierName: 'Apex Surgical & First Aid',
    purchaseDate: '2026-07-01',
    usedThisMonth: 4,
    status: 'In Stock',
    remarks: 'Breathable elastic support bandage for joint sprains and holding dressing pads.',
  },
  {
    id: 'STK-004',
    name: 'Antiseptic Solution (Betadine)',
    category: 'Antiseptics & Disinfectants',
    strength: '5% w/v (100 ml)',
    stock: 3,
    unit: 'Bottles',
    minLevel: 5,
    expiryDate: '2027-02-28',
    batchNumber: 'ANT-7731',
    supplierName: 'MedLife Distributors',
    purchaseDate: '2026-04-12',
    usedThisMonth: 2,
    status: 'Low Stock',
    remarks: 'Povidone-iodine topical antiseptic for cleaning cuts. Check student for iodine allergies.',
  },
  {
    id: 'STK-005',
    name: 'ORS Electrolyte Sachets',
    category: 'Medicine',
    strength: '21.8 g (WHO Formula)',
    stock: 65,
    unit: 'Sachets',
    minLevel: 25,
    expiryDate: '2027-11-30',
    batchNumber: 'ORS-1120',
    supplierName: 'Sun Pharma Logistics',
    purchaseDate: '2026-08-04',
    usedThisMonth: 15,
    status: 'In Stock',
    remarks: 'Oral rehydration salts for dehydration, heat stroke, fatigue & sports ground fainting.',
  },
  {
    id: 'STK-006',
    name: 'Cetirizine Syrup (Pediatric)',
    category: 'Medicine',
    strength: '5 mg / 5 ml (60 ml)',
    stock: 8,
    unit: 'Bottles',
    minLevel: 4,
    expiryDate: '2027-01-15',
    batchNumber: 'CTZ-3321',
    supplierName: 'MedLife Distributors',
    purchaseDate: '2026-06-20',
    usedThisMonth: 3,
    status: 'In Stock',
    remarks: 'Antihistamine for allergic rhinitis, insect bites & hives. Follow pediatric dosage chart.',
  },
  {
    id: 'STK-007',
    name: 'Burnol Antiseptic Ointment',
    category: 'Sprays & Ointments',
    strength: '20 g Tube',
    stock: 0,
    unit: 'Tubes',
    minLevel: 4,
    expiryDate: '2026-12-10',
    batchNumber: 'BRN-5541',
    supplierName: 'Apex Surgical & First Aid',
    purchaseDate: '2026-03-14',
    usedThisMonth: 4,
    status: 'Out of Stock',
    remarks: 'Urgent replenishment PO-2026-092 pending with vendor. Used for minor heat burns.',
  },
  {
    id: 'STK-008',
    name: 'Adhesive First Aid Strips (Band-Aid)',
    category: 'First Aid',
    strength: 'Standard 72x19mm',
    stock: 150,
    unit: 'Strips',
    minLevel: 50,
    expiryDate: '2028-09-30',
    batchNumber: 'BA-9904',
    supplierName: 'Apollo Healthcare Supplies',
    purchaseDate: '2026-08-11',
    usedThisMonth: 42,
    status: 'In Stock',
    remarks: 'Waterproof sterile medicated strips for minor classroom cuts, grazed knees & finger nicks.',
  },
  {
    id: 'STK-009',
    name: 'Volini Rapid Pain Relief Spray',
    category: 'Sprays & Ointments',
    strength: '55 g Spray Can',
    stock: 2,
    unit: 'Bottles',
    minLevel: 3,
    expiryDate: '2026-11-20',
    batchNumber: 'VOL-2190',
    supplierName: 'Sun Pharma Logistics',
    purchaseDate: '2025-11-15',
    usedThisMonth: 5,
    status: 'Low Stock',
    remarks: 'Immediate pain relief spray for playground injuries, sprains, and muscle cramps.',
  },
  {
    id: 'STK-010',
    name: 'Sterile Eye Wash Saline Solution',
    category: 'First Aid',
    strength: '250 ml Bottle',
    stock: 2,
    unit: 'Bottles',
    minLevel: 3,
    expiryDate: '2026-09-30',
    batchNumber: 'EWS-0988',
    supplierName: 'Apollo Healthcare Supplies',
    purchaseDate: '2025-10-05',
    usedThisMonth: 1,
    status: 'Expired',
    remarks: 'Expired last month. Quarantined bottle; replace immediately from central buffer store.',
  },
];

const categoryOptions = [
  'All Categories',
  'Medicine',
  'First Aid',
  'Dressing Supplies',
  'Antiseptics & Disinfectants',
  'Sprays & Ointments',
  'Consumables & Surgical',
];

const unitOptions = [
  'Tablets',
  'Bottles',
  'Rolls',
  'Sachets',
  'Tubes',
  'Strips',
  'Boxes',
  'Packs',
  'Pieces',
];

function MedicineStock() {
  const [stockList, setStockList] = useState<StockItem[]>(initialStockItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'stock-asc' | 'stock-desc' | 'expiry' | 'used'>('name');

  // Modals state
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [viewingItem, setViewingItem] = useState<StockItem | null>(null);
  const [dispenseItem, setDispenseItem] = useState<StockItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<StockItem | null>(null);

  // Dispense Form State
  const [dispenseQty, setDispenseQty] = useState(1);
  const [dispenseStudent, setDispenseStudent] = useState('');
  const [dispenseComplaint, setDispenseComplaint] = useState('');

  // Add/Edit Form State - All 13 fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'Medicine' as StockItem['category'],
    strength: '',
    stock: 0,
    unit: 'Tablets',
    minLevel: 10,
    expiryDate: '',
    batchNumber: '',
    supplierName: '',
    purchaseDate: '',
    usedThisMonth: 0,
    status: 'In Stock' as StockItem['status'],
    remarks: '',
  });

  // Calculate status based on stock, minLevel, and expiry date
  const computeStatus = (stock: number, minLevel: number, expiryDate: string): StockItem['status'] => {
    if (expiryDate) {
      const exp = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (exp < today) {
        return 'Expired';
      }
    }
    if (Number(stock) <= 0) return 'Out of Stock';
    if (Number(stock) <= Number(minLevel)) return 'Low Stock';
    return 'In Stock';
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Medicine',
      strength: '',
      stock: 50,
      unit: 'Tablets',
      minLevel: 10,
      expiryDate: '2027-12-31',
      batchNumber: `BT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierName: 'Apex Pharma Labs',
      purchaseDate: new Date().toISOString().split('T')[0],
      usedThisMonth: 0,
      status: 'In Stock',
      remarks: '',
    });
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (item: StockItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      strength: item.strength,
      stock: item.stock,
      unit: item.unit,
      minLevel: item.minLevel,
      expiryDate: item.expiryDate,
      batchNumber: item.batchNumber,
      supplierName: item.supplierName,
      purchaseDate: item.purchaseDate,
      usedThisMonth: item.usedThisMonth,
      status: item.status,
      remarks: item.remarks,
    });
    setShowAddEditModal(true);
  };

  const handleSaveItem = () => {
    if (!formData.name.trim()) {
      showToast('Item Name is required', 'error');
      return;
    }
    if (formData.stock < 0) {
      showToast('Stock quantity cannot be negative', 'error');
      return;
    }

    const calculatedStatus = computeStatus(formData.stock, formData.minLevel, formData.expiryDate);

    if (editingItem) {
      setStockList(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? {
              ...item,
              ...formData,
              status: calculatedStatus,
            }
            : item
        )
      );
      showToast(`Updated "${formData.name}" successfully!`, 'success');
    } else {
      const newItem: StockItem = {
        id: `STK-${String(stockList.length + 1).padStart(3, '0')}`,
        ...formData,
        status: calculatedStatus,
      };
      setStockList(prev => [newItem, ...prev]);
      showToast(`Added "${formData.name}" to medical stock!`, 'success');
    }

    setShowAddEditModal(false);
  };

  const handleDeleteItem = (id: string) => {
    const item = stockList.find(s => s.id === id);
    setStockList(prev => prev.filter(s => s.id !== id));
    setDeleteConfirmItem(null);
    showToast(`Removed "${item?.name || 'Item'}" from inventory`, 'info');
  };

  const handleOpenDispense = (item: StockItem) => {
    setDispenseItem(item);
    setDispenseQty(1);
    setDispenseStudent('Diya Patel (8-A)');
    setDispenseComplaint('Mild headache & fatigue');
  };

  const handleConfirmDispense = () => {
    if (!dispenseItem) return;
    if (dispenseQty <= 0) {
      showToast('Dispense quantity must be at least 1', 'error');
      return;
    }
    if (dispenseQty > dispenseItem.stock) {
      showToast(`Cannot dispense ${dispenseQty}. Only ${dispenseItem.stock} ${dispenseItem.unit} available in stock.`, 'error');
      return;
    }

    setStockList(prev =>
      prev.map(item => {
        if (item.id === dispenseItem.id) {
          const newStock = item.stock - dispenseQty;
          const newUsed = item.usedThisMonth + dispenseQty;
          const newStatus = computeStatus(newStock, item.minLevel, item.expiryDate);
          return {
            ...item,
            stock: newStock,
            usedThisMonth: newUsed,
            status: newStatus,
          };
        }
        return item;
      })
    );

    showToast(
      `Dispensed ${dispenseQty} ${dispenseItem.unit} of ${dispenseItem.name} for ${dispenseStudent || 'patient'}. Remaining: ${dispenseItem.stock - dispenseQty}`,
      'success'
    );
    setDispenseItem(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'Item Name',
      'Category',
      'Medicine Strength',
      'Stock Quantity',
      'Unit',
      'Minimum Stock Level',
      'Expiry Date',
      'Batch Number',
      'Supplier Name',
      'Purchase Date',
      'Used This Month',
      'Status',
      'Remarks',
    ];

    const rows = stockList.map(item => [
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.strength}"`,
      item.stock,
      `"${item.unit}"`,
      item.minLevel,
      item.expiryDate,
      `"${item.batchNumber}"`,
      `"${item.supplierName}"`,
      item.purchaseDate,
      item.usedThisMonth,
      `"${item.status}"`,
      `"${(item.remarks || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Infirmary_Medicine_Stock_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Stock inventory exported to CSV successfully!', 'success');
  };

  // Status & Counts
  const totalItemsCount = stockList.length;
  const inStockCount = stockList.filter(s => s.status === 'In Stock').length;
  const lowStockCount = stockList.filter(s => s.status === 'Low Stock').length;
  const outOfStockCount = stockList.filter(s => s.status === 'Out of Stock').length;
  const expiredCount = stockList.filter(s => s.status === 'Expired').length;
  const totalUsedThisMonth = stockList.reduce((acc, curr) => acc + curr.usedThisMonth, 0);

  // Filter & Sort
  const filteredStock = stockList
    .filter(item => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.strength.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.remarks.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;

      const matchStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'In Stock' && item.status === 'In Stock') ||
        (selectedStatus === 'Low Stock' && item.status === 'Low Stock') ||
        (selectedStatus === 'Out of Stock' && item.status === 'Out of Stock') ||
        (selectedStatus === 'Expired' && item.status === 'Expired');

      return matchSearch && matchCategory && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stock-asc') return a.stock - b.stock;
      if (sortBy === 'stock-desc') return b.stock - a.stock;
      if (sortBy === 'expiry') return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      if (sortBy === 'used') return b.usedThisMonth - a.usedThisMonth;
      return 0;
    });

  // Render Status Badge
  const renderStatusBadge = (status: StockItem['status']) => {
    switch (status) {
      case 'In Stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
            <span>In Stock</span>
          </span>
        );
      case 'Low Stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] animate-pulse" />
            <span>Low Stock</span>
          </span>
        );
      case 'Out of Stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BE123C]" />
            <span>Out of Stock</span>
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
            <span>Expired</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Render Category Badge
  const renderCategoryBadge = (category: StockItem['category']) => {
    let icon = 'solar:medical-kit-linear';
    let badgeClass = 'bg-[#FAF7F2] text-[#7C612A] border-[#E8DFC8]';

    if (category === 'Medicine') {
      icon = 'solar:pill-linear';
      badgeClass = 'bg-[#FAF7F2] text-[#7C612A] border-[#E8DFC8]';
    } else if (category === 'Dressing Supplies') {
      icon = 'solar:bandage-linear';
      badgeClass = 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]';
    } else if (category === 'First Aid') {
      icon = 'solar:medical-kit-linear';
      badgeClass = 'bg-[#FFF1F2] text-[#560110] border-[#FECDD3]';
    } else if (category === 'Antiseptics & Disinfectants') {
      icon = 'solar:shield-cross-linear';
      badgeClass = 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
    } else if (category === 'Sprays & Ointments') {
      icon = 'solar:bottle-linear';
      badgeClass = 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]';
    } else {
      icon = 'solar:box-minimalistic-linear';
      badgeClass = 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]';
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[12px] font-medium border ${badgeClass}`}>
        <Icon name={icon} size={13} />
        <span>{category}</span>
      </span>
    );
  };

  return (
    <div className="animate-fade-in space-y-5 pb-8">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Nurse', 'Medicine Stock']} />
          <div className="flex items-center gap-2.5 mt-1">
            <h1 className="text-[20px] sm:text-[22px] font-bold text-[#17153A] tracking-tight">
              Infirmary Medicine Stock
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-semibold text-[#17153A] bg-[#FFFFFF] border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-xl transition-all shadow-xs cursor-pointer"
            title="Export CSV"
          >
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Icon name="ic:round-plus" size={20} />
            <span>Add Stock Item</span>
          </button>
        </div>
      </div>

      {/* 2. Sleek Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by medicine, strength, batch #, supplier..."
            className="w-full h-10 pl-9 pr-8 text-[13px] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl focus:bg-white focus:border-[#7C612A] outline-none transition-all placeholder:text-[#94A3B8]"
          />
          <Icon name="solar:magnifer-linear" size={16} className="absolute left-3 top-3 text-[#64748B]" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-[#94A3B8] hover:text-[#17153A] cursor-pointer"
            >
              <Icon name="solar:close-circle-linear" size={15} />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="h-10 pl-3.5 pr-9 text-[13px] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl font-medium text-[#17153A] focus:bg-white focus:border-[#7C612A] outline-none cursor-pointer appearance-none"
            >
              <option value="All Categories">All Categories</option>
              <option value="Medicine">Medicine</option>
              <option value="First Aid">First Aid</option>
              <option value="Dressing Supplies">Dressing Supplies</option>
              <option value="Antiseptics & Disinfectants">Antiseptics & Disinfectants</option>
              <option value="Sprays & Ointments">Sprays & Ointments</option>
              <option value="Consumables & Surgical">Consumables & Surgical</option>
            </select>
            <Icon
              name="solar:alt-arrow-down-linear"
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="h-10 pl-3.5 pr-9 text-[13px] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl font-medium text-[#17153A] focus:bg-white focus:border-[#7C612A] outline-none cursor-pointer appearance-none"
            >
              <option value="All">All Statuses ({totalItemsCount})</option>
              <option value="In Stock">In Stock ({inStockCount})</option>
              <option value="Low Stock">Low Stock ({lowStockCount})</option>
              <option value="Out of Stock">Out of Stock ({outOfStockCount})</option>
              <option value="Expired">Expired ({expiredCount})</option>
            </select>
            <Icon
              name="solar:alt-arrow-down-linear"
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
            />
          </div>

          {(searchQuery || selectedCategory !== 'All Categories' || selectedStatus !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
                setSelectedStatus('All');
              }}
              className="text-[12px] font-semibold text-[#7C612A] hover:text-[#560110] px-2 py-1 cursor-pointer flex items-center gap-1"
            >
            </button>
          )}
        </div>
      </div>

      {/* 3. Medical Inventory Table */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        {filteredStock.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center mx-auto mb-3">
              <Icon name="solar:medical-kit-linear" size={22} />
            </div>
            <p className="text-[15px] font-bold text-[#17153A]">No medicine stock items found</p>
            <p className="text-[13px] text-[#64748B] mt-1 max-w-sm mx-auto">
              No inventory records match your current filters. Clear filters or add a new medicine.
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider w-[30%]">
                  Medicine & Details
                </th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider w-[14%]">
                  Current Stock
                </th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider w-[12%]">
                  Used (Month)
                </th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider w-[18%]">
                  Expiry & Sourcing
                </th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider w-[14%]">
                  Status
                </th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right w-[12%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredStock.map(item => {
                const isExp = item.status === 'Expired';
                const isLow = item.status === 'Low Stock';
                const isOut = item.status === 'Out of Stock';
                const pct = Math.min(100, Math.round((item.stock / (item.minLevel * 2 || 1)) * 100));

                return (
                  <tr
                    key={item.id}
                    onClick={() => setViewingItem(item)}
                    className="hover:bg-[#FAF7F2]/40 transition-colors group cursor-pointer"
                  >
                    {/* Column 1: Medicine Name + Strength Badge + Category & Batch */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#17153A] text-[14px] group-hover:text-[#7C612A] transition-colors">
                          {item.name}
                        </span>
                        {item.strength && item.strength !== 'N/A' && (
                          <span className="text-[11px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] px-2 py-0.5 rounded-md shrink-0">
                            {item.strength}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[12px] text-[#64748B]">
                        <span className="font-medium text-[#475569]">{item.category}</span>
                      </div>
                    </td>

                    {/* Column 2: Current Stock & Threshold */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-[15px] font-bold ${isOut ? 'text-[#BE123C]' : isLow ? 'text-[#B45309]' : 'text-[#17153A]'}`}>
                          {item.stock}
                        </span>
                        <span className="text-[12px] text-[#64748B] font-medium">{item.unit}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                      </div>
                    </td>

                    {/* Column 3: Used This Month */}
                    <td className="px-5 py-4 align-middle whitespace-nowrap">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[14px] font-bold text-[#17153A]">{item.usedThisMonth}</span>
                        <span className="text-[12px] text-[#64748B] font-medium">{item.unit}</span>
                      </div>
                    </td>

                    {/* Column 4: Expiry & Supplier */}
                    <td className="px-5 py-4 align-middle">
                      {isExp ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-2 py-0.5 rounded-md">
                          <span>Expired: {formatDateOnly(item.expiryDate)}</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#17153A]">
                          <span>Exp: {formatDateOnly(item.expiryDate)}</span>
                        </div>
                      )}
                      <p className="text-[12px] text-[#64748B] truncate max-w-[200px] mt-0.5" title={item.supplierName}>
                        {item.supplierName}
                      </p>
                    </td>

                    {/* Column 5: Status */}
                    <td className="px-5 py-4 align-middle whitespace-nowrap">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* Column 6: Quick Action Icons */}
                    <td
                      className="px-5 py-4 align-middle text-right whitespace-nowrap"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center justify-end gap-1">
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => setViewingItem(item)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#17153A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                          title="View Full Specification"
                        >
                          <Icon name="solar:eye-linear" size={16} />
                        </button>

                        {/* Edit Item */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#7C612A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                          title="Edit Stock Item"
                        >
                          <Icon name="solar:pen-linear" size={16} />
                        </button>

                        {/* Delete Item */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmItem(item)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#BE123C] hover:bg-[#FFF1F2] transition-colors cursor-pointer"
                          title="Delete Item"
                        >
                          <Icon name="solar:trash-bin-trash-linear" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. ADD / EDIT STOCK ITEM MODAL (ALL 13 FIELDS) */}
      {/* ========================================================================= */}
      <Modal
        open={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        title={editingItem ? `Edit Stock Item: ${editingItem.name}` : 'Add New Medicine Stock Item'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAddEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveItem}>
              {editingItem ? 'Save Changes' : 'Add Item to Inventory'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-left">
          {/* Row 1: Item Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Item Name"
              required
              placeholder="e.g. Paracetamol Tablets"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <Select
              label="Category"
              required
              options={[
                { value: 'Medicine', label: 'Medicine' },
                { value: 'First Aid', label: 'First Aid' },
                { value: 'Dressing Supplies', label: 'Dressing Supplies' },
                { value: 'Antiseptics & Disinfectants', label: 'Antiseptics & Disinfectants' },
                { value: 'Sprays & Ointments', label: 'Sprays & Ointments' },
                { value: 'Consumables & Surgical', label: 'Consumables & Surgical' },
              ]}
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as any })}
            />
          </div>

          {/* Row 2: Medicine Strength, Stock Quantity, Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Medicine Strength"
              placeholder="e.g. 500 mg, 100 ml, 5%"
              value={formData.strength}
              onChange={e => setFormData({ ...formData, strength: e.target.value })}
            />
            <Input
              label="Stock Quantity"
              type="number"
              required
              value={formData.stock}
              onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
            />
            <Select
              label="Unit"
              required
              options={unitOptions.map(u => ({ value: u, label: u }))}
              value={formData.unit}
              onChange={e => setFormData({ ...formData, unit: e.target.value })}
            />
          </div>

          {/* Row 3: Minimum Stock Level, Batch Number, Expiry Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Minimum Stock Level"
              type="number"
              required
              value={formData.minLevel}
              onChange={e => setFormData({ ...formData, minLevel: Number(e.target.value) })}
            />
            <Input
              label="Batch Number"
              required
              placeholder="e.g. BT-2026-881"
              value={formData.batchNumber}
              onChange={e => setFormData({ ...formData, batchNumber: e.target.value })}
            />
            <Input
              label="Expiry Date"
              type="date"
              required
              value={formData.expiryDate}
              onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>

          {/* Row 4: Supplier Name, Purchase Date, Used This Month */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Supplier Name"
              placeholder="e.g. Apex Pharma Labs"
              value={formData.supplierName}
              onChange={e => setFormData({ ...formData, supplierName: e.target.value })}
            />
            <Input
              label="Purchase Date"
              type="date"
              value={formData.purchaseDate}
              onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
            />
            <Input
              label="Used This Month"
              type="number"
              value={formData.usedThisMonth}
              onChange={e => setFormData({ ...formData, usedThisMonth: Number(e.target.value) })}
            />
          </div>

          {/* Row 5: Remarks */}
          <Textarea
            label="Remarks / Clinical & Storage Notes"
            rows={2}
            placeholder="e.g. Store in a cool dry place below 25°C. For fever complaints. Pediatric dosage..."
            value={formData.remarks}
            onChange={e => setFormData({ ...formData, remarks: e.target.value })}
          />
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 2. VIEW DETAILS MODAL (ALL 13 FIELDS COMPREHENSIVE OVERVIEW) */}
      {/* ========================================================================= */}
      {
        viewingItem && (
          <Modal
            open={!!viewingItem}
            onClose={() => setViewingItem(null)}
            title="Medicine Stock Specification Sheet"
            size="lg"
            footer={
              <Button variant="outline" onClick={() => setViewingItem(null)}>
                Close
              </Button>
            }
          >
            <div className="space-y-5 text-left">
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[18px] font-bold text-[#17153A]">{viewingItem.name}</h3>
                    {renderStatusBadge(viewingItem.status)}
                    {renderCategoryBadge(viewingItem.category)}
                  </div>
                </div>
              </div>

              {/* 4 Information Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card 1: Inventory & Stock */}
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 shadow-card-soft">
                  <div className="flex items-center gap-2 mb-3 text-[#7C612A]">
                    <Icon name="solar:box-minimalistic-linear" size={17} />
                    <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#17153A]">
                      Stock & Consumption
                    </h4>
                  </div>
                  <div className="space-y-2.5 text-[13px]">
                    <div className="flex justify-between border-b border-[#F1F5F9] pb-1.5">
                      <span className="text-[#64748B]">Current Available Stock:</span>
                      <span className="font-bold text-[#17153A]">{viewingItem.stock} {viewingItem.unit}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#F1F5F9] pb-1.5">
                      <span className="text-[#64748B]">Minimum Stock Level:</span>
                      <span className="font-medium text-[#17153A]">{viewingItem.minLevel} {viewingItem.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Used This Month:</span>
                      <span className="font-semibold text-[#560110]">{viewingItem.usedThisMonth} {viewingItem.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Batch & Expiry */}
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 shadow-card-soft">
                  <div className="flex items-center gap-2 mb-3 text-[#7C612A]">
                    <Icon name="solar:calendar-date-linear" size={17} />
                    <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#17153A]">
                      Batch & Expiration
                    </h4>
                  </div>
                  <div className="space-y-2.5 text-[13px]">
                    <div className="flex justify-between border-b border-[#F1F5F9] pb-1.5">
                      <span className="text-[#64748B]">Batch Number:</span>
                      <span className="font-mono font-bold text-[#17153A]">{viewingItem.batchNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#F1F5F9] pb-1.5">
                      <span className="text-[#64748B]">Expiry Date:</span>
                      <span className={`font-semibold ${viewingItem.status === 'Expired' ? 'text-[#DC2626]' : 'text-[#17153A]'}`}>
                        {formatDateOnly(viewingItem.expiryDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[#64748B]">Medicine Strength:</span>
                      <span className="font-semibold text-[#7C612A]">{viewingItem.strength || 'Standard'}</span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Supplier & Procurement */}
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 shadow-card-soft">
                  <div className="flex items-center gap-2 mb-3 text-[#7C612A]">
                    <Icon name="solar:shop-2-linear" size={17} />
                    <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#17153A]">
                      Supplier & Sourcing
                    </h4>
                  </div>
                  <div className="space-y-2 text-[13px]">
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Primary Supplier:</span>
                      <span className="font-bold text-[#17153A] text-[14px]">{viewingItem.supplierName || 'Not specified'}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-[#64748B] block text-[11px]">Purchase Record Date:</span>
                      <span className="font-medium text-[#17153A]">{formatDateOnly(viewingItem.purchaseDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Clinical Remarks */}
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 shadow-card-soft">
                  <div className="flex items-center gap-2 mb-3 text-[#7C612A]">
                    <Icon name="solar:notes-linear" size={17} />
                    <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#17153A]">
                      Remarks & Storage
                    </h4>
                  </div>
                  <p className="text-[13px] text-[#475569] leading-relaxed italic bg-[#F8FAFC] p-3 rounded-lg border border-[#F1F5F9]">
                    "{viewingItem.remarks || 'No specific remarks or precautions noted.'}"
                  </p>
                </div>
              </div>
            </div>
          </Modal>
        )
      }

      {/* ========================================================================= */}
      {/* 3. QUICK DISPENSE / LOG USAGE MODAL */}
      {/* ========================================================================= */}
      {
        dispenseItem && (
          <Modal
            open={!!dispenseItem}
            onClose={() => setDispenseItem(null)}
            title={`Dispense ${dispenseItem.name}`}
            size="md"
            footer={
              <>
                <Button variant="outline" onClick={() => setDispenseItem(null)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirmDispense}>
                  Confirm Dispense
                </Button>
              </>
            }
          >
            <div className="space-y-4 text-left">
              <div className="bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-bold text-[#17153A]">{dispenseItem.name}</p>
                  <p className="text-[12px] text-[#64748B]">
                    Batch: {dispenseItem.batchNumber} · Strength: {dispenseItem.strength}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#64748B] uppercase block">Available</span>
                  <span className="text-[16px] font-bold text-[#15803D]">
                    {dispenseItem.stock} {dispenseItem.unit}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={`Quantity to Dispense (${dispenseItem.unit})`}
                  type="number"
                  min={1}
                  max={dispenseItem.stock}
                  required
                  value={dispenseQty}
                  onChange={e => setDispenseQty(Number(e.target.value))}
                />
                <Input
                  label="Recipient (Student / Staff)"
                  required
                  placeholder="e.g. Diya Patel (8-A)"
                  value={dispenseStudent}
                  onChange={e => setDispenseStudent(e.target.value)}
                />
              </div>

              <Input
                label="Reason / Complaint"
                placeholder="e.g. Mild fever and headache after sports"
                value={dispenseComplaint}
                onChange={e => setDispenseComplaint(e.target.value)}
              />

              <p className="text-[11px] text-[#64748B]">
                * Dispensing automatically deducts {dispenseQty} {dispenseItem.unit} from available stock and increments this month's usage tally.
              </p>
            </div>
          </Modal>
        )
      }

      {/* ========================================================================= */}
      {/* 4. DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {
        deleteConfirmItem && (
          <Modal
            open={!!deleteConfirmItem}
            onClose={() => setDeleteConfirmItem(null)}
            title="Confirm Delete Stock Item"
            size="sm"
            footer={
              <>
                <Button variant="outline" onClick={() => setDeleteConfirmItem(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteItem(deleteConfirmItem.id)}
                >
                  Delete Item
                </Button>
              </>
            }
          >
            <div className="text-left space-y-2">
              <p className="text-[14px] text-[#17153A]">
                Are you sure you want to remove <strong className="text-[#560110]">{deleteConfirmItem.name}</strong> ({deleteConfirmItem.batchNumber}) from the infirmary inventory?
              </p>
              <p className="text-[12px] text-[#64748B]">
                This action cannot be undone. All stock levels, batch data, and monthly usage statistics for this item will be removed.
              </p>
            </div>
          </Modal>
        )
      }
    </div >
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
