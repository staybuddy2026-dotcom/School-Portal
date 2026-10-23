import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { PageHeader, StatusBadge, Card, Badge, Button, StatCard, Table, Tabs, Avatar, Breadcrumb, Modal, Input, Select, Textarea, SectionHeader } from '@/components/ui';

interface TransportPortalProps {
  activeKey: string;
}

export function TransportPortal({ activeKey }: TransportPortalProps) {
  switch (activeKey) {
    case 'trans-dashboard': return <TransDashboard />;
    case 'trans-profile': return <TransProfile />;
    case 'trans-vehicles': return <Vehicles />;
    case 'trans-drivers': return <Drivers />;
    case 'trans-routes': return <Routes />;
    case 'trans-stops': return <Stops />;
    case 'trans-allocation': return <Allocation />;
    case 'trans-requests': return <TransportRequests />;
    case 'trans-tracking': return <LiveTracking />;
    case 'trans-trip-log': return <TripLog />;
    case 'trans-notifications': return <TransNotifications />;
    case 'trans-fee-setup': return <TransFeeSetup />;
    case 'trans-reports': return <TransReports />;
    default: return <TransDashboard />;
  }
}


function TransDashboard() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div>
        <Breadcrumb items={['Transport Portal', 'Dashboard']} />
        <div className="mt-1">
          <h1 className="text-[22px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">Transport Dashboard</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">Monday, October 13, 2026 · 14 buses currently on route</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Active Buses</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">18</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
            <Icon name="solar:bus-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">On Routes Now</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">14</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] flex items-center justify-center shrink-0">
            <Icon name="solar:routing-2-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Students Transport</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">680</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
            <Icon name="solar:users-group-rounded-linear" size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-card-soft flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Pending Requests</p>
            <p className="text-[24px] font-bold text-[#17153A] mt-1">3</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] flex items-center justify-center shrink-0">
            <Icon name="solar:inbox-linear" size={20} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft p-5 sm:p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
            <div>
              <h3 className="font-bold text-[#17153A] text-[16px]">Delayed Trips</h3>
              <p className="text-[12px] text-[#64748B]">Real-time route alerts</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              2 Delayed
            </span>
          </div>
          <div className="space-y-3">
            {[
              { route: 'Route 5 - Baner to School', bus: 'MH-12 CD 5678', delay: '15 min', reason: 'Traffic on Baner Road' },
              { route: 'Route 8 - Aundh to School', bus: 'MH-12 EF 9012', delay: '25 min', reason: 'Vehicle breakdown' },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]">
                <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
                  <Icon name="solar:danger-triangle-linear" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#17153A] truncate">{d.route}</p>
                  <p className="text-[12px] text-[#64748B]">{d.bus} · {d.reason}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] shrink-0">
                  +{d.delay}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft p-5 sm:p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
            <div>
              <h3 className="font-bold text-[#17153A] text-[16px]">Pending Requests</h3>
              <p className="text-[12px] text-[#64748B]">Parent applications</p>
            </div>
            <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">3 New</span>
          </div>
          <div className="space-y-3">
            {[
              { type: 'Start Transport', student: 'Saanvi Reddy', class: '7-B' },
              { type: 'Change Stop', student: 'Arjun Nair', class: '8-B' },
              { type: 'Stop Transport', student: 'Vihaan Joshi', class: '7-A' },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8] flex items-center justify-center shrink-0">
                  <Icon name="solar:inbox-linear" size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#17153A] truncate">{r.type}</p>
                  <p className="text-[12px] text-[#64748B] truncate">{r.student} · {r.class}</p>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 text-[12px] font-semibold text-[#17153A] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer shrink-0"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TransProfile() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <PageHeader title="My Profile" breadcrumbs={['Transport', 'My Profile']} />
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft p-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#F1F5F9]">
          <Avatar name="Imran Khan" size="lg" />
          <div>
            <h3 className="text-[18px] font-bold text-[#17153A]">Mr. Imran Khan</h3>
            <p className="text-[14px] text-[#64748B]">Transport Manager · School Fleet</p>
          </div>
        </div>
        <div className="space-y-3.5 max-w-md">
          <div className="flex justify-between items-center text-[14px] py-1">
            <span className="text-[#64748B]">Employee ID</span>
            <span className="font-semibold text-[#17153A]">EMP-2020-0031</span>
          </div>
          <div className="flex justify-between items-center text-[14px] py-1 border-t border-[#F8FAFC]">
            <span className="text-[#64748B]">Email</span>
            <span className="font-semibold text-[#17153A]">imran@greenwood.edu</span>
          </div>
          <div className="flex justify-between items-center text-[14px] py-1 border-t border-[#F8FAFC]">
            <span className="text-[#64748B]">Phone</span>
            <span className="font-semibold text-[#17153A]">+91 98220 88990</span>
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

function Vehicles() {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Transport', 'Vehicles']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">School Fleet Vehicles</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Registration details, capacity, and compliance certifications</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:add-circle-linear" size={16} />
          <span>Add Vehicle</span>
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { no: 'MH-12 AB 1234', cap: 45, insurance: '2027-03-15', fitness: '2027-06-30', puc: '2027-01-15', status: 'active', alerts: 0 },
          { no: 'MH-12 AB 3456', cap: 42, insurance: '2026-12-10', fitness: '2027-01-20', puc: '2026-11-01', status: 'active', alerts: 1 },
          { no: 'MH-12 CD 5678', cap: 50, insurance: '2027-05-20', fitness: '2027-03-15', puc: '2027-02-10', status: 'active', alerts: 0 },
          { no: 'MH-12 EF 9012', cap: 40, insurance: '2026-10-25', fitness: '2026-11-30', puc: '2026-10-20', status: 'maintenance', alerts: 3 },
          { no: 'MH-12 GH 3456', cap: 45, insurance: '2027-08-15', fitness: '2027-07-20', puc: '2027-06-10', status: 'active', alerts: 0 },
        ].map(v => (
          <div key={v.no} className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-5 shadow-card-soft hover:border-[#CBD5E1] transition-all">
            <div className="flex items-start justify-between mb-3.5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  v.status === 'active' ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]' : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                }`}>
                  <Icon name="solar:bus-linear" size={18} />
                </div>
                <div>
                  <p className="font-bold text-[#17153A] text-[14px]">{v.no}</p>
                  <p className="text-[12px] text-[#64748B]">Capacity: {v.cap} seats</p>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold capitalize ${
                v.status === 'active' ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]' : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
              }`}>
                {v.status}
              </span>
            </div>

            {v.alerts > 0 && (
              <div className="p-2.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] flex items-center gap-2 mb-3">
                <Icon name="solar:danger-triangle-linear" size={14} className="text-[#BE123C] shrink-0" />
                <span className="text-[12px] text-[#BE123C] font-semibold">{v.alerts} document(s) expiring soon</span>
              </div>
            )}

            <div className="space-y-1.5 text-[12px] pt-2 border-t border-[#F8FAFC]">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Insurance</span>
                <span className={v.insurance < '2026-11' ? 'text-[#BE123C] font-bold' : 'text-[#334155] font-medium'}>{v.insurance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Fitness Cert</span>
                <span className={v.fitness < '2026-12' ? 'text-[#BE123C] font-bold' : 'text-[#334155] font-medium'}>{v.fitness}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">PUC</span>
                <span className={v.puc < '2026-11' ? 'text-[#BE123C] font-bold' : 'text-[#334155] font-medium'}>{v.puc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Vehicle" footer={<><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowAdd(false)}>Add Vehicle</Button></>}>
        <div className="space-y-4">
          <Input label="Vehicle Registration Number" required placeholder="e.g., MH-12 AB 1234" />
          <Input label="Capacity" type="number" required />
          <Input label="Insurance Expiry Date" type="date" required />
          <Input label="Fitness Certificate Expiry" type="date" required />
          <Input label="PUC Expiry Date" type="date" required />
        </div>
      </Modal>
    </div>
  );
}

function Drivers() {
  const [tab, setTab] = useState<'drivers' | 'conductors'>('drivers');
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Transport', 'Drivers & Conductors']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Drivers & Conductors</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Staff credentials, licenses, and assigned vehicle routes</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:add-circle-linear" size={16} />
          <span>Add {tab === 'drivers' ? 'Driver' : 'Conductor'}</span>
        </button>
      </div>

      {/* Segmented Tab Bar */}
      <div className="bg-[#FFFFFF] p-1.5 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_#00000004] inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setTab('drivers')}
          className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-all cursor-pointer ${
            tab === 'drivers' ? 'bg-[#17153A] text-white shadow-sm' : 'text-[#64748B] hover:text-[#17153A]'
          }`}
        >
          Drivers
        </button>
        <button
          type="button"
          onClick={() => setTab('conductors')}
          className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-all cursor-pointer ${
            tab === 'conductors' ? 'bg-[#17153A] text-white shadow-sm' : 'text-[#64748B] hover:text-[#17153A]'
          }`}
        >
          Conductors
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Name</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Licence No.</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Licence Expiry</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Phone</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Assigned Vehicle</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {(tab === 'drivers' ? [
                { name: 'Ramesh Yadav', licence: 'MH14 20180001234', expiry: '2028-06-15', phone: '+91 98220 11234', vehicle: 'MH-12 AB 1234' },
                { name: 'Suresh Patil', licence: 'MH14 20190002345', expiry: '2027-03-20', phone: '+91 98220 11223', vehicle: 'MH-12 AB 3456' },
                { name: 'Ashok Kumar', licence: 'MH14 20200003456', expiry: '2029-01-10', phone: '+91 98220 33445', vehicle: 'MH-12 CD 5678' },
              ] : [
                { name: 'Vijay More', licence: 'MH14 20190004567', expiry: '2028-08-20', phone: '+91 98220 55667', vehicle: 'MH-12 AB 1234' },
                { name: 'Ganpat Rao', licence: 'MH14 20200005678', expiry: '2027-12-15', phone: '+91 98220 77889', vehicle: 'MH-12 AB 3456' },
              ]).map((d, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={d.name} size="sm" />
                      <span className="font-semibold text-[#17153A] text-[14px]">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[12px] text-[#475569]">{d.licence}</td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{d.expiry}</td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{d.phone}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-md text-[12px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                      {d.vehicle}
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

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={`Add ${tab === 'drivers' ? 'Driver' : 'Conductor'}`} footer={<><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowAdd(false)}>Add</Button></>}>
        <div className="space-y-4">
          <Input label="Full Name" required />
          <Input label="Licence Number" required />
          <Input label="Licence Expiry Date" type="date" required />
          <Input label="Contact Number" required />
          <Select label="Assign Vehicle" options={[{ value: '', label: 'Select...' }, { value: '1', label: 'MH-12 AB 1234' }, { value: '2', label: 'MH-12 AB 3456' }]} />
        </div>
      </Modal>
    </div>
  );
}

function Routes() {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Transport', 'Routes']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Transport Routes</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Route coverage, origins, destinations, and assigned crew</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:add-circle-linear" size={16} />
          <span>Create Route</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Route Name</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">From</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">To</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Vehicle</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Driver</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Students</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { route: 'Route 1 - Camp', from: 'Camp Area', to: 'School', bus: 'MH-12 AB 1234', driver: 'Ramesh Yadav', students: 42 },
                { route: 'Route 3 - Kothrud', from: 'Kothrud', to: 'School', bus: 'MH-12 AB 3456', driver: 'Suresh Patil', students: 38 },
                { route: 'Route 5 - Baner', from: 'Baner', to: 'School', bus: 'MH-12 CD 5678', driver: 'Ashok Kumar', students: 45 },
                { route: 'Route 8 - Aundh', from: 'Aundh', to: 'School', bus: 'MH-12 EF 9012', driver: 'Vijay More', students: 33 },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{r.route}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{r.from}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{r.to}</td>
                  <td className="px-5 py-4 font-mono text-[12px] text-[#475569]">{r.bus}</td>
                  <td className="px-5 py-4 text-[14px] text-[#334155]">{r.driver}</td>
                  <td className="px-5 py-4 text-right font-semibold text-[#17153A] text-[14px]">{r.students}</td>
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

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create Route" footer={<><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowAdd(false)}>Create Route</Button></>}>
        <div className="space-y-4">
          <Input label="Route Name" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Starting Point" required />
            <Input label="Ending Point" required />
          </div>
          <Select label="Assign Vehicle" required options={[{ value: '', label: 'Select...' }, { value: '1', label: 'MH-12 AB 1234' }, { value: '2', label: 'MH-12 AB 3456' }]} />
          <Select label="Assign Driver" required options={[{ value: '', label: 'Select...' }, { value: '1', label: 'Ramesh Yadav' }, { value: '2', label: 'Suresh Patil' }]} />
          <Select label="Assign Conductor" options={[{ value: '', label: 'None' }, { value: '1', label: 'Vijay More' }]} />
        </div>
      </Modal>
    </div>
  );
}

function Stops() {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Transport', 'Stops']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Bus Stops & Timings</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Pick-up and drop scheduled timings by route order</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:add-circle-linear" size={16} />
          <span>Add Stop</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <Select options={[{ value: '1', label: 'Route 1 - Camp' }, { value: '3', label: 'Route 3 - Kothrud' }, { value: '5', label: 'Route 5 - Baner' }]} className="!w-auto" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Order</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Stop Name</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Pickup Time</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Drop Time</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Students</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { order: 1, stop: 'Green Park Avenue', pickup: '07:15 AM', drop: '03:45 PM', students: 8 },
                { order: 2, stop: 'Kothrud Bus Stand', pickup: '07:20 AM', drop: '03:40 PM', students: 12 },
                { order: 3, stop: 'Dahanukar Colony', pickup: '07:25 AM', drop: '03:35 PM', students: 6 },
                { order: 4, stop: 'E-Square Junction', pickup: '07:30 AM', drop: '03:30 PM', students: 5 },
                { order: 5, stop: 'Paud Road Corner', pickup: '07:35 AM', drop: '03:25 PM', students: 7 },
              ].map(s => (
                <tr key={s.order} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 text-center font-bold text-[#7C612A] text-[14px]">{s.order}</td>
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{s.stop}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{s.pickup}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{s.drop}</td>
                  <td className="px-5 py-4 text-right font-semibold text-[#17153A] text-[14px]">{s.students}</td>
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

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Stop" footer={<><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowAdd(false)}>Add Stop</Button></>}>
        <div className="space-y-4">
          <Input label="Stop Name" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pickup Time" type="time" required />
            <Input label="Drop Time" type="time" required />
          </div>
          <Input label="Map Location (Lat/Lng)" placeholder="18.5074, 73.8077" />
        </div>
      </Modal>
    </div>
  );
}

function Allocation() {
  const [showAllocate, setShowAllocate] = useState(false);
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Transport', 'Student Allocation']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Student Allocation</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Assign students to specific route stops and verify vehicle capacity</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAllocate(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:add-circle-linear" size={16} />
          <span>Allocate Student</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between flex-wrap gap-3">
          <Select options={[{ value: '3', label: 'Route 3 - Kothrud' }, { value: '1', label: 'Route 1 - Camp' }]} className="!w-auto" />
          <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
            38 / 42 seats filled
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Class</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Stop</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Pickup</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { student: 'Aarav Sharma', class: '8-A', stop: 'Green Park Avenue', pickup: '07:15 AM' },
                { student: 'Diya Patel', class: '8-A', stop: 'Kothrud Bus Stand', pickup: '07:20 AM' },
                { student: 'Ishaan Verma', class: '8-A', stop: 'Dahanukar Colony', pickup: '07:25 AM' },
              ].map((s, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={s.student} size="xs" />
                      <span className="font-semibold text-[#17153A] text-[14px]">{s.student}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{s.class}</td>
                  <td className="px-5 py-4 text-[14px] text-[#334155]">{s.stop}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{s.pickup}</td>
                  <td className="px-5 py-4 text-right">
                    <button type="button" className="text-[12px] font-semibold text-[#BE123C] hover:text-[#9F1239] px-2.5 py-1 rounded-lg hover:bg-[#FFF1F2] transition-colors cursor-pointer">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showAllocate} onClose={() => setShowAllocate(false)} title="Allocate Student to Route" footer={<><Button variant="outline" onClick={() => setShowAllocate(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowAllocate(false)}>Allocate Student</Button></>}>
        <div className="space-y-4">
          <Select label="Student" required options={[{ value: '', label: 'Select student...' }, { value: '1', label: 'Aarav Sharma (8-A)' }, { value: '2', label: 'Diya Patel (8-A)' }]} />
          <Select label="Route" required options={[{ value: '3', label: 'Route 3 - Kothrud (4 seats left)' }, { value: '1', label: 'Route 1 - Camp (3 seats left)' }]} />
          <Select label="Stop" required options={[{ value: '', label: 'Select stop...' }, { value: '1', label: 'Green Park Avenue' }, { value: '2', label: 'Kothrud Bus Stand' }]} />
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]">
            <Icon name="solar:info-circle-linear" size={16} className="text-[#7C612A]" />
            <span className="text-[12px] text-[#7C612A] font-medium">Bus capacity will be validated automatically before confirming allocation.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function TransportRequests() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <PageHeader title="Transport Requests" breadcrumbs={['Transport', 'Transport Requests']} />
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Request Type</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Class</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Details</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Date</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { type: 'Start Transport', student: 'Saanvi Reddy', class: '7-B', detail: 'New transport request for Route 3', date: '2026-10-10' },
                { type: 'Change Stop', student: 'Arjun Nair', class: '8-B', detail: 'Requesting change from Stop 3 to Stop 5', date: '2026-10-08' },
                { type: 'Stop Transport', student: 'Vihaan Joshi', class: '7-A', detail: 'Discontinuing transport from Nov 1', date: '2026-10-05' },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                      r.type === 'Start Transport' ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]' :
                      r.type === 'Stop Transport' ? 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]' :
                      'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                    }`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{r.student}</td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{r.class}</td>
                  <td className="px-5 py-4 text-[14px] text-[#334155]">{r.detail}</td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{r.date}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" className="px-2.5 py-1 text-[12px] font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded-lg transition-colors cursor-pointer">
                        Approve
                      </button>
                      <button type="button" className="px-2.5 py-1 text-[12px] font-semibold text-[#BE123C] border border-[#FECDD3] hover:bg-[#FFF1F2] rounded-lg transition-colors cursor-pointer">
                        Reject
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

function LiveTracking() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Transport', 'Live Tracking']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Live Bus Tracking</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Real-time GPS positioning and vehicle status</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          14 buses on route
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft p-5">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E8DFC8]">
            <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='none'%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23e2e8f0' stroke-width='0.5'/%3E%3C/svg%3E")` }} />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
              {[
                { x: 80, y: 200, label: 'R1', color: '#7C612A' },
                { x: 200, y: 120, label: 'R3', color: '#15803D' },
                { x: 320, y: 80, label: 'R5', color: '#B45309' },
                { x: 150, y: 50, label: 'R8', color: '#BE123C' },
                { x: 300, y: 220, label: 'R2', color: '#17153A' },
              ].map((b, i) => (
                <g key={i}>
                  <circle cx={b.x} cy={b.y} r="14" fill={b.color} opacity="0.15" />
                  <circle cx={b.x} cy={b.y} r="7" fill={b.color} />
                  <text x={b.x + 12} y={b.y + 4} fontSize="10" fill="#17153A" fontWeight="bold">{b.label}</text>
                </g>
              ))}
            </svg>
            <div className="absolute top-3 left-3 bg-[#FFFFFF]/95 backdrop-blur rounded-xl px-3.5 py-2 border border-[#E2E8F0] shadow-sm">
              <p className="text-[12px] font-bold text-[#17153A]">City Map Tracking</p>
              <p className="text-[12px] text-[#64748B]">5 buses shown · Real-time GPS</p>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft p-5">
          <h3 className="font-bold text-[#17153A] text-[16px] pb-3 border-b border-[#F1F5F9] mb-3">Active Buses</h3>
          <div className="space-y-3">
            {[
              { route: 'Route 1', bus: 'MH-12 AB 1234', speed: '32 km/h', status: 'on route' },
              { route: 'Route 3', bus: 'MH-12 AB 3456', speed: '28 km/h', status: 'on route' },
              { route: 'Route 5', bus: 'MH-12 CD 5678', speed: '0 km/h', status: 'delayed' },
              { route: 'Route 8', bus: 'MH-12 EF 9012', speed: '—', status: 'stopped' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  b.status === 'on route' ? 'bg-[#F0FDF4] text-[#15803D]' : b.status === 'delayed' ? 'bg-[#FFFBEB] text-[#B45309]' : 'bg-[#FFF1F2] text-[#BE123C]'
                }`}>
                  <Icon name="solar:bus-linear" size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#17153A] truncate">{b.route}</p>
                  <p className="text-[12px] text-[#64748B]">{b.bus} · {b.speed}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                  b.status === 'on route' ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]' :
                  b.status === 'delayed' ? 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]' :
                  'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]'
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TripLog() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <PageHeader title="Trip Log" breadcrumbs={['Transport', 'Trip Log']} />
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-3 flex-wrap">
          <Select options={[{ value: '1', label: 'Route 1 - Camp' }, { value: '3', label: 'Route 3 - Kothrud' }]} className="!w-auto" />
          <Input type="date" className="!w-auto" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Vehicle</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Start Time</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">End Time</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Distance</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { bus: 'MH-12 AB 3456', start: '07:15 AM', end: '08:00 AM', distance: '12.5 km', status: 'completed' },
                { bus: 'MH-12 AB 3456', start: '03:30 PM', end: '04:15 PM', distance: '12.8 km', status: 'completed' },
                { bus: 'MH-12 AB 1234', start: '07:00 AM', end: '07:50 AM', distance: '15.2 km', status: 'completed' },
              ].map((t, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-mono text-[12px] text-[#17153A] font-semibold">{t.bus}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{t.start}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{t.end}</td>
                  <td className="px-5 py-4 text-right font-semibold text-[#17153A] text-[14px]">{t.distance}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
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

function TransNotifications() {
  const [showSend, setShowSend] = useState(false);
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Transport', 'Notifications']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Parent Route Notifications</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Broadcast route delays, maintenance alerts, and changes</p>
        </div>
        <button
          type="button"
          onClick={() => setShowSend(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:plain-linear" size={16} />
          <span>Send Notification</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Title</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Target</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Type</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { title: 'Route 5 delayed by 15 minutes', target: 'Route 5 Parents', type: 'Delay', date: '2026-10-13' },
                { title: 'Route 8 bus breakdown - backup arranged', target: 'Route 8 Parents', type: 'Breakdown', date: '2026-10-12' },
                { title: 'Route 3 stop change notification', target: 'Route 3, Stop 3', type: 'Route Change', date: '2026-10-10' },
              ].map((n, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{n.title}</td>
                  <td className="px-5 py-4 text-[14px] text-[#475569]">{n.target}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                      n.type === 'Delay' ? 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]' :
                      n.type === 'Breakdown' ? 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]' :
                      'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                    }`}>
                      {n.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[14px] text-[#64748B]">{n.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showSend} onClose={() => setShowSend(false)} title="Send Parent Notification" footer={<><Button variant="outline" onClick={() => setShowSend(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowSend(false)}>Send Broadcast</Button></>}>
        <div className="space-y-4">
          <Select label="Notification Type" required options={[{ value: 'delay', label: 'Delay' }, { value: 'breakdown', label: 'Bus Breakdown' }, { value: 'change', label: 'Route Change' }]} />
          <Select label="Target" required options={[{ value: 'route', label: 'Affected Route' }, { value: 'stop', label: 'Affected Stop' }]} />
          <Input label="Title" required />
          <Textarea label="Message" rows={3} required />
        </div>
      </Modal>
    </div>
  );
}

function TransFeeSetup() {
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Transport', 'Transport Fee Setup']} />
          <h1 className="text-[20px] font-bold text-[#17153A]">Transport Fee Structure</h1>
          <p className="text-[12px] text-[#64748B] mt-0.5">Route-based fee rules, slabs, and distance tariffs</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Icon name="solar:add-circle-linear" size={16} />
          <span>Add Fee Rule</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Route</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Fee Type</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { route: 'Route 1 - Camp', type: 'Fixed', amount: 14000 },
                { route: 'Route 3 - Kothrud', type: 'Fixed', amount: 16000 },
                { route: 'Route 5 - Baner', type: 'Distance-based', amount: 18000 },
                { route: 'Route 8 - Aundh', type: 'Distance-based', amount: 20000 },
              ].map((f, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#17153A] text-[14px]">{f.route}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                      {f.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-[#17153A] text-[14px]">
                    ₹{f.amount.toLocaleString('en-IN')}<span className="text-[12px] text-[#64748B] font-normal">/year</span>
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
    </div>
  );
}

function TransReports() {
  const reports = [
    { name: 'Route-wise Student List', desc: 'Students grouped by route and boarding stops', icon: 'solar:routing-2-linear' },
    { name: 'Bus-wise Student List', desc: 'Students grouped by assigned school bus', icon: 'solar:bus-linear' },
    { name: 'Stop-wise Student List', desc: 'Students grouped by arrival stop order', icon: 'solar:map-point-linear' },
    { name: 'Vehicle Document Expiry', desc: 'Certificates, PUC, insurance compliance alerts', icon: 'solar:danger-circle-linear' },
    { name: 'Trip History Report', desc: 'Complete daily vehicle trip log report', icon: 'solar:history-linear' },
  ];
  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <PageHeader title="Transport Reports" breadcrumbs={['Transport', 'Reports']} />
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
