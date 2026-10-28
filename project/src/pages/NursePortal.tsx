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
    case 'nurse-health': return <HealthProfile />;
    case 'nurse-visit-history':
    case 'nurse-visit-entry': return <VisitHistory />;
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
  const treatedCount = todayVisits.filter(v => v.status === 'treated').length;

  return (
    <div className="animate-fade-in space-y-6 pb-8 font-['Poppins']">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb items={['Nurse Portal', 'Dashboard']} />
          <div className="mt-1 flex items-center gap-3 flex-wrap">
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">
              Dashboard
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
        </div>
      </div>

      {/* 2. Key Performance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Today's Visits */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] group flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Today's Visits</p>
            <p className="text-[28px] font-bold text-[#17153A] mt-1 leading-none">{todayVisits.length}</p>
            <p className="text-[12px] text-[#7C612A] font-medium mt-1.5 flex items-center gap-1">
              <span>Total daily check-ins</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0 transition-transform shadow-2xs">
            <Icon name="ClipboardList" size={22} />
          </div>
        </div>

        {/* Card 2: In Infirmary Now */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] group flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">In Infirmary Now</p>
            <p className="text-[28px] font-bold text-[#17153A] mt-1 leading-none">{inInfirmary.length}</p>
            <p className="text-[12px] text-[#B45309] font-medium mt-1.5 flex items-center gap-1">
              <span>Under observation</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] flex items-center justify-center shrink-0 transition-transform shadow-2xs">
            <Icon name="HeartPulse" size={22} />
          </div>
        </div>

        {/* Card 3: Sent Home */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] group flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Sent Home</p>
            <p className="text-[28px] font-bold text-[#17153A] mt-1 leading-none">{sentHome.length}</p>
            <p className="text-[12px] text-[#BE123C] font-medium mt-1.5 flex items-center gap-1">
              <span>Referred to guardians</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] flex items-center justify-center shrink-0 transition-transform shadow-2xs">
            <Icon name="Home" size={22} />
          </div>
        </div>

        {/* Card 4: Treated & Released */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0]  flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Treated & Released</p>
            <p className="text-[28px] font-bold text-[#17153A] mt-1 leading-none">{treatedCount}</p>
            <p className="text-[12px] text-[#15803D] font-medium mt-1.5 flex items-center gap-1">
              <span>Resolved successfully</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            <Icon name="CheckCircle" size={22} />
          </div>
        </div>
      </div>

      {/* 3. Today's Check-ins Section */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0 shadow-2xs">
              <Icon name="ClipboardList" size={19} />
            </div>
            <div>
              <h3 className="font-bold text-[#17153A] text-[15px] sm:text-[16px]">Today's Check-ins</h3>
              <p className="text-[12px] text-[#64748B]">Chronological log of day visits and treatments</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          {todayVisits.map(v => (
            <div
              key={v.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <Avatar name={v.student} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[14px] font-bold text-[#17153A] truncate">{v.student}</p>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#E2E8F0] text-[#64748B]">
                      Class {v.class}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-0.5 flex items-center gap-1.5 truncate">
                    <span className="font-medium text-[#17153A]">{v.complaint}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
                <StatusBadge status={v.status} size="sm" dot />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NurseProfile() {
  const [profile, setProfile] = useState({
    // 1. Personal Details
    name: 'Pooja Sharma',
    gender: 'Female',
    dob: '14 August 1989',
    phone: '+91 98220 99001',
    email: 'nurse.farida@sadvidhya.edu.in',
    address: 'Plot No. 42, Green Avenue, Shivalik Hills, Ahmedabad, Gujarat 380015',
    photo: '/nurse-pooja.jpg',

    // 2. Job Details
    empId: 'EMP-2021-0045',
    joiningDate: '15 June 2021',
    qualification: 'B.Sc. Nursing, GNM Certified',
    registrationNo: 'GNC-REG-847291',
    experience: '5+ Years (Clinical & School Health)',
    employmentType: 'Full-time',

    // 3. Login Details
    username: 'nurse.farida',
    password: 'System-generated',
    accountStatus: 'Active' as 'Active' | 'Inactive',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [editForm, setEditForm] = useState({
    name: profile.name,
    gender: profile.gender,
    dob: profile.dob,
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
    qualification: profile.qualification,
    experience: profile.experience,
    employmentType: profile.employmentType,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });

  const handleOpenEdit = () => {
    setEditForm({
      name: profile.name,
      gender: profile.gender,
      dob: profile.dob,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      qualification: profile.qualification,
      experience: profile.experience,
      employmentType: profile.employmentType,
    });
    setShowEditModal(true);
  };

  const handleOpenPasswordModal = () => {
    setPasswordForm({ currentPass: '', newPass: '', confirmPass: '' });
    setShowCurrentPass(false);
    setShowNewPass(false);
    setShowConfirmPass(false);
    setShowPasswordModal(true);
  };

  const handleSaveProfile = () => {
    if (!editForm.name.trim()) {
      showToast('Full name is required', 'error');
      return;
    }
    if (!editForm.phone.trim()) {
      showToast('Mobile number is required', 'error');
      return;
    }
    if (!editForm.email.trim()) {
      showToast('Email address is required', 'error');
      return;
    }
    setProfile(prev => ({
      ...prev,
      name: editForm.name.trim(),
      gender: editForm.gender,
      dob: editForm.dob,
      phone: editForm.phone.trim(),
      email: editForm.email.trim(),
      address: editForm.address.trim(),
      qualification: editForm.qualification.trim(),
      experience: editForm.experience.trim(),
      employmentType: editForm.employmentType,
    }));
    setShowEditModal(false);
    showToast('Profile details updated successfully!', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPass) {
      showToast('Please enter your current password', 'error');
      return;
    }
    if (!passwordForm.newPass || passwordForm.newPass.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirmPass) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setPasswordForm({ currentPass: '', newPass: '', confirmPass: '' });
    setShowPasswordModal(false);
    showToast('Password changed successfully!', 'success');
  };

  const copyUsername = () => {
    navigator.clipboard?.writeText(profile.username);
    showToast('Username copied to clipboard!', 'info');
  };

  return (
    <div className="animate-fade-in space-y-6 pb-10 text-left font-['Poppins']">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Breadcrumb items={['Nurse Portal', 'My Profile']} />
          <h1 className="text-[22px] sm:text-[24px] font-bold text-[#17153A] tracking-tight mt-1">
            My Profile
          </h1>
        </div>
      </div>

      {/* 2. Executive Profile Hero Banner */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-card-soft">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Identity Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-[#FAF7F2] shadow-sm select-none"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7C612A] to-[#560110] text-white flex items-center justify-center font-bold text-[22px] ring-4 ring-[#FAF7F2] shadow-sm select-none">
                  PS
                </div>
              )}
              <span
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-[20px] sm:text-[22px] font-bold text-[#17153A] tracking-tight">
                  {profile.name}
                </h2>
              </div>
              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8] font-mono">
                  {profile.empId}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                  {profile.employmentType}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={handleOpenEdit}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-[#17153A] bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#7C612A] hover:bg-[#FAF7F2] hover:text-[#7C612A] rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <Icon name="Pencil" size={15} />
              <span>Edit Details</span>
            </button>
            <button
              type="button"
              onClick={handleOpenPasswordModal}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Icon name="KeyRound" size={15} />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Executive Profile Dossier: Two Clean Balanced Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* ========================================================================= */}
        {/* CARD 1: PERSONAL & CONTACT INFORMATION */}
        {/* ========================================================================= */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-card-soft flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 pb-0 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0 shadow-2xs">
                <Icon name="User" size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#17153A]">Personal Information</h3>
                <p className="text-[12px] text-[#64748B]">Primary identity and residential records</p>
              </div>
            </div>

            {/* Structured Rows */}
            <div className="divide-y divide-[#F8FAFC] text-[13px]">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B] flex items-center gap-2.5">
                  Full Name
                </span>
                <span className="font-semibold text-[#17153A] text-right">{profile.name}</span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B] flex items-center gap-2.5">
                  Gender
                </span>
                <span className="font-semibold text-[#17153A]">{profile.gender}</span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B] flex items-center gap-2.5">
                  Date of Birth
                </span>
                <span className="font-semibold text-[#17153A]">{profile.dob}</span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B] flex items-center gap-2.5">
                  Mobile Number
                </span>
                <span className="font-semibold text-[#17153A] font-mono">{profile.phone}</span>
              </div>

              <div className="flex items-center justify-between py-2.5 gap-2">
                <span className="text-[#64748B] flex items-center gap-2.5 shrink-0">
                  Email Address
                </span>
                <span className="font-semibold text-[#17153A] text-right truncate text-[12px]" title={profile.email}>
                  {profile.email}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 gap-2">
                <span className="text-[#64748B] flex items-center gap-2.5 shrink-0">
                  Residential Address
                </span>
                <span className="font-semibold text-[#17153A] text-right truncate text-[12px]" title={profile.address}>
                  {profile.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 2: PROFESSIONAL & CLINICAL CREDENTIALS */}
        {/* ========================================================================= */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-card-soft flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 pb-0 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0 shadow-2xs">
                <Icon name="GraduationCap" size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#17153A]">Professional Credentials</h3>
                <p className="text-[12px] text-[#64748B]">Clinical qualification, registration & service details</p>
              </div>
            </div>

            {/* Structured Rows */}
            <div className="divide-y divide-[#F8FAFC] text-[13px]">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B] flex items-center gap-2.5">
                  Employee ID
                </span>
                <span className="font-bold text-[#7C612A] font-mono px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8DFC8] text-[12px]">
                  {profile.empId}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 gap-2">
                <span className="text-[#64748B] flex items-center gap-2.5 shrink-0">
                  Qualification
                </span>
                <span className="font-semibold text-[#17153A] text-right text-[12px]">
                  {profile.qualification}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B] flex items-center gap-2.5">
                  Experience
                </span>
                <span className="font-semibold text-[#17153A] text-right text-[12px]">
                  {profile.experience}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B] flex items-center gap-2.5">
                  Joining Date
                </span>
                <span className="font-semibold text-[#17153A]">{profile.joiningDate}</span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#64748B] flex items-center gap-2.5">
                  Employment Type
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                  {profile.employmentType}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. EDIT PROFILE MODAL */}
      {/* ========================================================================= */}
      {
        showEditModal && (
          <Modal
            open={showEditModal}
            onClose={() => setShowEditModal(false)}
            title="Edit Profile Details"
            size="md"
            className="max-w-lg"
            overflowVisible={true}
            bodyClassName="p-5 sm:p-6 overflow-hidden font-['Poppins']"
            footer={
              <div className="flex items-center justify-end gap-2.5 w-full">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
              </div>
            }
          >
            <div className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Full Name"
                  required
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                />
                <div>
                  <label className="block text-[14px] font-semibold text-[#334155] mb-1.5 font-['Poppins']">
                    Gender
                  </label>
                  <select
                    value={editForm.gender}
                    onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full h-10 px-3.5 text-[14px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] font-['Poppins'] cursor-pointer"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Date of Birth"
                  value={editForm.dob}
                  onChange={e => setEditForm({ ...editForm, dob: e.target.value })}
                />
                <Input
                  label="Mobile Number"
                  required
                  value={editForm.phone}
                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>

              <Input
                label="Email Address"
                required
                type="email"
                value={editForm.email}
                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
              />

              <Textarea
                label="Address"
                rows={2}
                value={editForm.address}
                onChange={e => setEditForm({ ...editForm, address: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Qualification"
                  value={editForm.qualification}
                  onChange={e => setEditForm({ ...editForm, qualification: e.target.value })}
                />
                <Input
                  label="Experience"
                  value={editForm.experience}
                  onChange={e => setEditForm({ ...editForm, experience: e.target.value })}
                />
              </div>
            </div>
          </Modal>
        )
      }

      {/* ========================================================================= */}
      {/* 5. CHANGE PASSWORD MODAL (POPUP DIALOG) */}
      {/* ========================================================================= */}
      {
        showPasswordModal && (
          <Modal
            open={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
            title="Change Security Password"
            size="md"
            className="max-w-md"
            overflowVisible={true}
            bodyClassName="p-5 sm:p-6 overflow-hidden font-['Poppins']"
            footer={
              <div className="flex items-center justify-end gap-2.5 w-full">
                <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleChangePassword}
                >
                  Update Password
                </Button>
              </div>
            }
          >
            <div className="space-y-4 text-left">
              <div>
                <label className="text-[12px] font-semibold text-[#17153A] block mb-1">
                  Current Password <span className="text-[#BE123C]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    placeholder="Enter current password"
                    value={passwordForm.currentPass}
                    onChange={e => setPasswordForm({ ...passwordForm, currentPass: e.target.value })}
                    className="w-full h-10 pl-3.5 pr-10 text-[13px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors font-['Poppins'] placeholder:font-['Poppins']"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#17153A] cursor-pointer"
                  >
                    <Icon name={showCurrentPass ? 'solar:eye-bold' : 'solar:eye-closed-bold'} size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#17153A] block mb-1">
                  New Password <span className="text-[#BE123C]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    placeholder="Minimum 6 characters"
                    value={passwordForm.newPass}
                    onChange={e => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                    className="w-full h-10 pl-3.5 pr-10 text-[13px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors font-['Poppins'] placeholder:font-['Poppins']"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#17153A] cursor-pointer"
                  >
                    <Icon name={showNewPass ? 'solar:eye-bold' : 'solar:eye-closed-bold'} size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#17153A] block mb-1">
                  Confirm New Password <span className="text-[#BE123C]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    placeholder="Re-enter new password"
                    value={passwordForm.confirmPass}
                    onChange={e => setPasswordForm({ ...passwordForm, confirmPass: e.target.value })}
                    className="w-full h-10 pl-3.5 pr-10 text-[13px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors font-['Poppins'] placeholder:font-['Poppins']"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#17153A] cursor-pointer"
                  >
                    <Icon name={showConfirmPass ? 'solar:eye-bold' : 'solar:eye-closed-bold'} size={16} />
                  </button>
                </div>
              </div>

              {/* Password Validation Hints */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Icon
                    name={passwordForm.newPass.length >= 6 ? 'solar:check-circle-bold' : 'solar:close-circle-bold'}
                    size={14}
                    className={passwordForm.newPass.length >= 6 ? 'text-[#15803D]' : 'text-[#64748B]'}
                  />
                  <span className={passwordForm.newPass.length >= 6 ? 'text-[#15803D] font-medium' : 'text-[#64748B]'}>
                    At least 6 characters in length
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon
                    name={
                      passwordForm.newPass && passwordForm.newPass === passwordForm.confirmPass
                        ? 'solar:check-circle-bold'
                        : 'solar:close-circle-bold'
                    }
                    size={14}
                    className={
                      passwordForm.newPass && passwordForm.newPass === passwordForm.confirmPass
                        ? 'text-[#15803D]'
                        : 'text-[#64748B]'
                    }
                  />
                  <span
                    className={
                      passwordForm.newPass && passwordForm.newPass === passwordForm.confirmPass
                        ? 'text-[#15803D] font-medium'
                        : 'text-[#64748B]'
                    }
                  >
                    Passwords match
                  </span>
                </div>
              </div>
            </div>
          </Modal>
        )
      }
    </div >
  );
}



/* ========================================================================= */
/* 2. STUDENTS HEALTH PROFILE - DATA MODEL & DIRECTORY */
/* ========================================================================= */

interface StudentHealthRecord {
  id: string;
  name: string;
  classNum: string; // '1' to '12'
  section: string; // 'A', 'B', 'C'
  rollNo: string;
  grNo: string;
  gender: 'Male' | 'Female';
  age: number;
  bloodGroup: 'A+' | 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' | 'O-' | 'AB-';
  height: number; // cm
  weight: number; // kg
  allergies: string[];
  conditions: string[];
  dietaryRestrictions: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  emergencyContact: string;
  emergencyContactPerson: string;
  address: string;
  status: 'Healthy' | 'Special Care' | 'Allergy Flagged' | 'Under Medication';
  vaccinationStatus: 'Fully Vaccinated' | 'Partially Vaccinated' | 'Due for Booster';
  lastCheckupDate: string;
  vision: string;
  hearing: string;
  nurseNotes: string;
  visitsCount: number;
}

const initialStudentHealthRecords: StudentHealthRecord[] = [
  {
    id: 'STU-2026-0011',
    name: 'Kabir Sen',
    classNum: '1',
    section: 'A',
    rollNo: '1A-04',
    grNo: 'GR-10411',
    gender: 'Male',
    age: 6,
    bloodGroup: 'O+',
    height: 116,
    weight: 20,
    allergies: [],
    conditions: [],
    dietaryRestrictions: 'None (Regular meal plan)',
    fatherName: 'Mr. Anirudh Sen',
    fatherPhone: '+91 98251 11001',
    motherName: 'Mrs. Rohini Sen',
    motherPhone: '+91 98251 11002',
    emergencyContact: '+91 98251 11001',
    emergencyContactPerson: 'Father (Primary)',
    address: 'A-102, Shivalik Park, Prahlad Nagar, Ahmedabad',
    status: 'Healthy',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-09-10',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Active child. All growth milestone parameters normal for primary grade.',
    visitsCount: 4,
  },
  {
    id: 'STU-2026-0024',
    name: 'Ananya Mishra',
    classNum: '2',
    section: 'B',
    rollNo: '2B-09',
    grNo: 'GR-10382',
    gender: 'Female',
    age: 7,
    bloodGroup: 'B+',
    height: 122,
    weight: 22,
    allergies: ['Lactose Intolerance (Mild)'],
    conditions: [],
    dietaryRestrictions: 'Dairy-free school lunch and snacks',
    fatherName: 'Mr. Prakash Mishra',
    fatherPhone: '+91 98251 22002',
    motherName: 'Mrs. Rekha Mishra',
    motherPhone: '+91 98251 22003',
    emergencyContact: '+91 98251 22002',
    emergencyContactPerson: 'Father (Primary)',
    address: 'B-304, Maple Tree, Thaltej, Ahmedabad',
    status: 'Allergy Flagged',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-08-22',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Must not be served milk or cheese during midday meals. Canteen notified.',
    visitsCount: 2,
  },
  {
    id: 'STU-2026-0033',
    name: 'Reyansh Deshmukh',
    classNum: '3',
    section: 'A',
    rollNo: '3A-11',
    grNo: 'GR-10294',
    gender: 'Male',
    age: 8,
    bloodGroup: 'A+',
    height: 128,
    weight: 25,
    allergies: [],
    conditions: [],
    dietaryRestrictions: 'Vegetarian',
    fatherName: 'Mr. Sachin Deshmukh',
    fatherPhone: '+91 98251 33003',
    motherName: 'Mrs. Aarti Deshmukh',
    motherPhone: '+91 98251 33004',
    emergencyContact: '+91 98251 33003',
    emergencyContactPerson: 'Father (Primary)',
    address: 'Plot 45, Sterling City, Bopal, Ahmedabad',
    status: 'Healthy',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-07-18',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Healthy vitals. Cleared for all physical education and swimming lessons.',
    visitsCount: 0,
  },
  {
    id: 'STU-2026-0046',
    name: 'Myra Kapoor',
    classNum: '4',
    section: 'C',
    rollNo: '4C-06',
    grNo: 'GR-10175',
    gender: 'Female',
    age: 9,
    bloodGroup: 'AB+',
    height: 133,
    weight: 28,
    allergies: ['Egg Protein Allergy'],
    conditions: [],
    dietaryRestrictions: 'Egg-free diet',
    fatherName: 'Mr. Rohan Kapoor',
    fatherPhone: '+91 98251 44004',
    motherName: 'Mrs. Shalini Kapoor',
    motherPhone: '+91 98251 44005',
    emergencyContact: '+91 98251 44004',
    emergencyContactPerson: 'Father (Primary)',
    address: 'C-701, Orchid Heights, SG Highway, Ahmedabad',
    status: 'Allergy Flagged',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-09-04',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Carries oral antihistamine drops in pouch with Class Teacher Ms. Sheetal.',
    visitsCount: 1,
  },
  {
    id: 'STU-2026-0058',
    name: 'Vivaan Joshi',
    classNum: '5',
    section: 'B',
    rollNo: '5B-18',
    grNo: 'GR-10088',
    gender: 'Male',
    age: 10,
    bloodGroup: 'O+',
    height: 138,
    weight: 31,
    allergies: [],
    conditions: ['Juvenile Type-1 Diabetes (Insulin Dependent)'],
    dietaryRestrictions: 'Strict diabetic meal plan, scheduled snacks',
    fatherName: 'Dr. Hemant Joshi',
    fatherPhone: '+91 98251 55005',
    motherName: 'Dr. Meena Joshi',
    motherPhone: '+91 98251 55006',
    emergencyContact: '+91 98251 55005',
    emergencyContactPerson: 'Father (Physician)',
    address: 'D-503, Goyal Intercity, Drive-In Road, Ahmedabad',
    status: 'Special Care',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-10-02',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Blood glucose sensor attached. Visits infirmary at 11:30 AM daily for pre-lunch sugar check.',
    visitsCount: 14,
  },
  {
    id: 'STU-2026-0062',
    name: 'Tara Nair',
    classNum: '6',
    section: 'A',
    rollNo: '6A-21',
    grNo: 'GR-9942',
    gender: 'Female',
    age: 11,
    bloodGroup: 'A-',
    height: 142,
    weight: 34,
    allergies: [],
    conditions: [],
    dietaryRestrictions: 'None (Standard meal)',
    fatherName: 'Mr. Madhavan Nair',
    fatherPhone: '+91 98251 66006',
    motherName: 'Mrs. Priya Nair',
    motherPhone: '+91 98251 66007',
    emergencyContact: '+91 98251 66006',
    emergencyContactPerson: 'Father (Primary)',
    address: 'F-12, Godrej Garden City, Gota, Ahmedabad',
    status: 'Healthy',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-08-14',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Excellent athletic fitness. Member of junior school badminton team.',
    visitsCount: 1,
  },
  {
    id: 'STU-2026-0074',
    name: 'Saanvi Reddy',
    classNum: '7',
    section: 'B',
    rollNo: '7B-14',
    grNo: 'GR-9824',
    gender: 'Female',
    age: 12,
    bloodGroup: 'AB+',
    height: 148,
    weight: 39,
    allergies: ['Sulfa Drug Compounds'],
    conditions: ['Frequent Epistaxis (Anterior Nosebleed on hot days)'],
    dietaryRestrictions: 'Hydration priority',
    fatherName: 'Mr. K. Venkat Reddy',
    fatherPhone: '+91 98251 77007',
    motherName: 'Mrs. Lakshmi Reddy',
    motherPhone: '+91 98251 77008',
    emergencyContact: '+91 98251 77007',
    emergencyContactPerson: 'Father (Primary)',
    address: 'E-401, Sun Divine, Memnagar, Ahmedabad',
    status: 'Special Care',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-09-28',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Apply ice pack and pinch anterior nostrils forward for 10 mins if nosebleed recurs during PT class.',
    visitsCount: 4,
  },
  {
    id: 'STU-2026-0142',
    name: 'Aarav Sharma',
    classNum: '8',
    section: 'A',
    rollNo: '8A-12',
    grNo: 'GR-9821',
    gender: 'Male',
    age: 13,
    bloodGroup: 'B+',
    height: 145,
    weight: 38,
    allergies: ['Peanut Allergy (Severe)', 'Dust Mites'],
    conditions: ['Childhood Asthma (Mild - Exercise Induced)'],
    dietaryRestrictions: 'Strictly Nut-free diet',
    fatherName: 'Mr. Rajesh Sharma',
    fatherPhone: '+91 98765 43210',
    motherName: 'Mrs. Sunita Sharma',
    motherPhone: '+91 98765 43211',
    emergencyContact: '+91 98765 43210',
    emergencyContactPerson: 'Father (Primary)',
    address: 'B-402, Royal Residency, Bodakdev, Ahmedabad',
    status: 'Allergy Flagged',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-09-15',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Carries Salbutamol inhaler in school bag. Emergency EpiPen kept in infirmary emergency box #2.',
    visitsCount: 3,
  },
  {
    id: 'STU-2026-0143',
    name: 'Diya Patel',
    classNum: '8',
    section: 'A',
    rollNo: '8A-24',
    grNo: 'GR-9822',
    gender: 'Female',
    age: 13,
    bloodGroup: 'O+',
    height: 150,
    weight: 42,
    allergies: [],
    conditions: ['Dysmenorrhea (Recurrent Lower Abdominal Cramps)'],
    dietaryRestrictions: 'Regular diet, warm water advised',
    fatherName: 'Mr. Bhavesh Patel',
    fatherPhone: '+91 98252 88008',
    motherName: 'Mrs. Gitaben Patel',
    motherPhone: '+91 98252 88009',
    emergencyContact: '+91 98252 88008',
    emergencyContactPerson: 'Father (Primary)',
    address: 'G-11, Dev Castle, Vastrapur, Ahmedabad',
    status: 'Under Medication',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-09-20',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Rest in infirmary bed with heating pad permitted during painful cycle. Dicyclomine administered per parent consent.',
    visitsCount: 5,
  },
  {
    id: 'STU-2026-0144',
    name: 'Ishaan Verma',
    classNum: '8',
    section: 'B',
    rollNo: '8B-15',
    grNo: 'GR-9823',
    gender: 'Male',
    age: 13,
    bloodGroup: 'A+',
    height: 152,
    weight: 44,
    allergies: [],
    conditions: ['Ligament Laxity (Left Ankle Sprain History)'],
    dietaryRestrictions: 'None',
    fatherName: 'Mr. Rajesh Verma',
    fatherPhone: '+91 98252 99009',
    motherName: 'Mrs. Neha Verma',
    motherPhone: '+91 98252 99010',
    emergencyContact: '+91 98252 99009',
    emergencyContactPerson: 'Father (Primary)',
    address: 'H-203, Safal Parivesh, Prahlad Nagar, Ahmedabad',
    status: 'Healthy',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-08-30',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Wears supportive ankle brace during football practice. Cleared for standard academic curriculum.',
    visitsCount: 2,
  },
  {
    id: 'STU-2026-0191',
    name: 'Rohan Mehra',
    classNum: '9',
    section: 'A',
    rollNo: '9A-07',
    grNo: 'GR-9712',
    gender: 'Male',
    age: 14,
    bloodGroup: 'O-',
    height: 160,
    weight: 50,
    allergies: [],
    conditions: [],
    dietaryRestrictions: 'High-protein athletic meal plan',
    fatherName: 'Mr. Deepak Mehra',
    fatherPhone: '+91 98253 10010',
    motherName: 'Mrs. Vandana Mehra',
    motherPhone: '+91 98253 10011',
    emergencyContact: '+91 98253 10010',
    emergencyContactPerson: 'Father (Primary)',
    address: 'B-501, Gala Haven, South Bopal, Ahmedabad',
    status: 'Healthy',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-07-25',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Rare O-Negative blood group logged in emergency donor register. Track team captain.',
    visitsCount: 1,
  },
  {
    id: 'STU-2026-0198',
    name: 'Tanvi Saxena',
    classNum: '9',
    section: 'B',
    rollNo: '9B-22',
    grNo: 'GR-9745',
    gender: 'Female',
    age: 14,
    bloodGroup: 'B+',
    height: 155,
    weight: 46,
    allergies: ['Penicillin & Amoxicillin (Severe)'],
    conditions: [],
    dietaryRestrictions: 'Vegetarian',
    fatherName: 'Mr. Alok Saxena',
    fatherPhone: '+91 98253 20020',
    motherName: 'Mrs. Poonam Saxena',
    motherPhone: '+91 98253 20021',
    emergencyContact: '+91 98253 20020',
    emergencyContactPerson: 'Father (Primary)',
    address: 'C-302, Titanium City Centre, Satellite, Ahmedabad',
    status: 'Allergy Flagged',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-09-08',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'WARNING: Never administer Penicillin or Beta-lactam antibiotic compounds. Hospital alert card in file.',
    visitsCount: 0,
  },
  {
    id: 'STU-2026-0205',
    name: 'Advait Kulkarni',
    classNum: '10',
    section: 'A',
    rollNo: '10A-19',
    grNo: 'GR-9630',
    gender: 'Male',
    age: 15,
    bloodGroup: 'A+',
    height: 167,
    weight: 56,
    allergies: [],
    conditions: ['Mild Thoracic Scoliosis (Physiotherapy monitored)'],
    dietaryRestrictions: 'None',
    fatherName: 'Mr. Shrikant Kulkarni',
    fatherPhone: '+91 98253 30030',
    motherName: 'Mrs. Radhika Kulkarni',
    motherPhone: '+91 98253 30031',
    emergencyContact: '+91 98253 30030',
    emergencyContactPerson: 'Father (Primary)',
    address: 'J-601, Venus Atlantis, Anandnagar, Ahmedabad',
    status: 'Healthy',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-08-10',
    vision: '6/6 (Corrected with glasses -0.75 D)',
    hearing: 'Normal',
    nurseNotes: 'Ergonomic bench seating assigned in classroom 10-A per orthopedic doctor advice.',
    visitsCount: 2,
  },
  {
    id: 'STU-2026-0214',
    name: 'Priya Sengupta',
    classNum: '10',
    section: 'B',
    rollNo: '10B-08',
    grNo: 'GR-9655',
    gender: 'Female',
    age: 15,
    bloodGroup: 'AB-',
    height: 158,
    weight: 48,
    allergies: [],
    conditions: [],
    dietaryRestrictions: 'None',
    fatherName: 'Mr. Subhash Sengupta',
    fatherPhone: '+91 98253 40040',
    motherName: 'Mrs. Ananya Sengupta',
    motherPhone: '+91 98253 40041',
    emergencyContact: '+91 98253 40040',
    emergencyContactPerson: 'Father (Primary)',
    address: 'K-104, Iscon Platinum, Bopal, Ahmedabad',
    status: 'Healthy',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-06-15',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Annual medical clearance complete. Hemoglobin 12.8 g/dL (normal).',
    visitsCount: 1,
  },
  {
    id: 'STU-2026-0222',
    name: 'Siddharth Rao',
    classNum: '11',
    section: 'A',
    rollNo: '11A-03',
    grNo: 'GR-9510',
    gender: 'Male',
    age: 16,
    bloodGroup: 'B+',
    height: 173,
    weight: 62,
    allergies: [],
    conditions: ['Stress-induced Migraine Cephalea'],
    dietaryRestrictions: 'Avoid caffeinated beverages',
    fatherName: 'Mr. Nagesh Rao',
    fatherPhone: '+91 98253 50050',
    motherName: 'Mrs. Malini Rao',
    motherPhone: '+91 98253 50051',
    emergencyContact: '+91 98253 50050',
    emergencyContactPerson: 'Father (Primary)',
    address: 'M-201, Swati Clover, Shilaj, Ahmedabad',
    status: 'Under Medication',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-09-02',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Infirmary rest in dark room for 30 mins resolves acute episodes. Naproxen 250 mg available on doctor prescription.',
    visitsCount: 3,
  },
  {
    id: 'STU-2026-0229',
    name: 'Ananya Pandey',
    classNum: '11',
    section: 'B',
    rollNo: '11B-14',
    grNo: 'GR-9538',
    gender: 'Female',
    age: 16,
    bloodGroup: 'O+',
    height: 162,
    weight: 52,
    allergies: [],
    conditions: [],
    dietaryRestrictions: 'Vegetarian',
    fatherName: 'Mr. Vinod Pandey',
    fatherPhone: '+91 98253 60060',
    motherName: 'Mrs. Sushma Pandey',
    motherPhone: '+91 98253 60061',
    emergencyContact: '+91 98253 60060',
    emergencyContactPerson: 'Father (Primary)',
    address: 'P-502, Goyal Riviera, Judges Bungalow Road, Ahmedabad',
    status: 'Healthy',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-07-10',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'No clinical issues noted. Outstanding academic & debate team attendance.',
    visitsCount: 0,
  },
  {
    id: 'STU-2026-0238',
    name: 'Aryan Singhania',
    classNum: '12',
    section: 'A',
    rollNo: '12A-11',
    grNo: 'GR-9415',
    gender: 'Male',
    age: 17,
    bloodGroup: 'A+',
    height: 178,
    weight: 68,
    allergies: [],
    conditions: [],
    dietaryRestrictions: 'Athletic meal plan',
    fatherName: 'Mr. Vivek Singhania',
    fatherPhone: '+91 98253 70070',
    motherName: 'Mrs. Nandita Singhania',
    motherPhone: '+91 98253 70071',
    emergencyContact: '+91 98253 70070',
    emergencyContactPerson: 'Father (Primary)',
    address: 'R-801, The Grand Monarch, Ambli Road, Ahmedabad',
    status: 'Healthy',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-08-05',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Senior school basketball captain. Full medical clearance for inter-school competitions.',
    visitsCount: 1,
  },
  {
    id: 'STU-2026-0245',
    name: 'Meera Nambiar',
    classNum: '12',
    section: 'B',
    rollNo: '12B-05',
    grNo: 'GR-9442',
    gender: 'Female',
    age: 17,
    bloodGroup: 'O+',
    height: 165,
    weight: 54,
    allergies: ['Shellfish / Crustaceans', 'Aspirin (Mild Hives)'],
    conditions: [],
    dietaryRestrictions: 'Strictly Non-seafood',
    fatherName: 'Mr. R. Nambiar',
    fatherPhone: '+91 98253 80080',
    motherName: 'Mrs. Geetha Nambiar',
    motherPhone: '+91 98253 80081',
    emergencyContact: '+91 98253 80080',
    emergencyContactPerson: 'Father (Primary)',
    address: 'S-302, Indraprasth Gulmohar, Bodakdev, Ahmedabad',
    status: 'Allergy Flagged',
    vaccinationStatus: 'Fully Vaccinated',
    lastCheckupDate: '2026-09-12',
    vision: '6/6 (Normal)',
    hearing: 'Normal',
    nurseNotes: 'Do not administer Aspirin or Disprin. Use Paracetamol for fever complaints.',
    visitsCount: 2,
  },
];

function HealthProfile() {
  const [students, setStudents] = useState<StudentHealthRecord[]>(initialStudentHealthRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');

  // Modal states
  const [viewingStudent, setViewingStudent] = useState<StudentHealthRecord | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentHealthRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dossierTab, setDossierTab] = useState<'profile' | 'history' | 'visits' | 'treatment' | 'vaccination'>('profile');

  // Add form state
  const [addFormData, setAddFormData] = useState({
    name: '',
    classNum: '8',
    section: 'A',
    rollNo: '',
    grNo: '',
    age: 14,
    gender: 'Male' as 'Male' | 'Female',
    bloodGroup: 'B+' as StudentHealthRecord['bloodGroup'],
    height: 150,
    weight: 42,
    vision: '6/6 Both Eyes',
    hearing: 'Normal',
    allergies: '',
    conditions: '',
    emergencyContact: '',
    emergencyContactPerson: 'Father',
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    motherPhone: '',
    address: '',
    dietaryRestrictions: 'None',
    status: 'Healthy' as StudentHealthRecord['status'],
    nurseNotes: '',
  });

  const handleOpenAdd = () => {
    setAddFormData({
      name: '',
      classNum: '8',
      section: 'A',
      rollNo: String(students.length + 1),
      grNo: `GR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      age: 14,
      gender: 'Male',
      bloodGroup: 'B+',
      height: 150,
      weight: 42,
      vision: '6/6 Both Eyes',
      hearing: 'Normal',
      allergies: '',
      conditions: '',
      emergencyContact: '',
      emergencyContactPerson: 'Father',
      fatherName: '',
      fatherPhone: '',
      motherName: '',
      motherPhone: '',
      address: '',
      dietaryRestrictions: 'None',
      status: 'Healthy',
      nurseNotes: '',
    });
    setShowAddModal(true);
  };

  const handleSaveNewStudent = () => {
    if (!addFormData.name.trim()) {
      showToast('Please enter the student full name', 'error');
      return;
    }
    const emergencyNum = addFormData.emergencyContact.trim() || addFormData.fatherPhone.trim();
    if (!emergencyNum) {
      showToast('Please provide a parent or emergency phone number', 'error');
      return;
    }

    const newStudent: StudentHealthRecord = {
      id: `stu-${Date.now()}`,
      name: addFormData.name.trim(),
      rollNo: addFormData.rollNo.trim() || String(students.length + 1),
      grNo: addFormData.grNo.trim() || `GR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      classNum: addFormData.classNum,
      section: addFormData.section,
      age: Number(addFormData.age) || 14,
      gender: addFormData.gender,
      bloodGroup: addFormData.bloodGroup,
      height: Number(addFormData.height) || 150,
      weight: Number(addFormData.weight) || 45,
      vision: addFormData.vision || '6/6 Both Eyes',
      hearing: addFormData.hearing || 'Normal',
      allergies: addFormData.allergies ? addFormData.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
      conditions: addFormData.conditions ? addFormData.conditions.split(',').map(s => s.trim()).filter(Boolean) : [],
      vaccinationStatus: 'Fully Vaccinated',
      emergencyContact: emergencyNum,
      emergencyContactPerson: addFormData.emergencyContactPerson || 'Father',
      fatherName: addFormData.fatherName.trim() || 'Parent / Guardian',
      fatherPhone: addFormData.fatherPhone.trim() || emergencyNum,
      motherName: addFormData.motherName.trim() || '—',
      motherPhone: addFormData.motherPhone.trim() || '—',
      address: addFormData.address.trim() || 'Campus Residential / Local',
      dietaryRestrictions: addFormData.dietaryRestrictions.trim() || 'None',
      lastCheckupDate: new Date().toISOString().split('T')[0],
      visitsCount: 0,
      status: addFormData.status,
      nurseNotes: addFormData.nurseNotes.trim() || 'Initial health profile created by infirmary nurse.',
    };

    setStudents(prev => [newStudent, ...prev]);
    setShowAddModal(false);
    showToast(`Health profile for "${newStudent.name}" created successfully!`, 'success');
  };

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    height: 145,
    weight: 38,
    bloodGroup: 'B+' as StudentHealthRecord['bloodGroup'],
    allergies: '',
    conditions: '',
    dietaryRestrictions: '',
    emergencyContact: '',
    emergencyContactPerson: '',
    nurseNotes: '',
    status: 'Healthy' as StudentHealthRecord['status'],
  });

  const handleOpenEdit = (student: StudentHealthRecord) => {
    setEditingStudent(student);
    setEditFormData({
      height: student.height,
      weight: student.weight,
      bloodGroup: student.bloodGroup,
      allergies: student.allergies.join(', '),
      conditions: student.conditions.join(', '),
      dietaryRestrictions: student.dietaryRestrictions,
      emergencyContact: student.emergencyContact,
      emergencyContactPerson: student.emergencyContactPerson,
      nurseNotes: student.nurseNotes,
      status: student.status,
    });
  };

  const handleSaveStudentEdit = () => {
    if (!editingStudent) return;
    const updatedAllergies = editFormData.allergies
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const updatedConditions = editFormData.conditions
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    setStudents(prev =>
      prev.map(s =>
        s.id === editingStudent.id
          ? {
            ...s,
            height: Number(editFormData.height) || s.height,
            weight: Number(editFormData.weight) || s.weight,
            bloodGroup: editFormData.bloodGroup,
            allergies: updatedAllergies,
            conditions: updatedConditions,
            dietaryRestrictions: editFormData.dietaryRestrictions,
            emergencyContact: editFormData.emergencyContact,
            emergencyContactPerson: editFormData.emergencyContactPerson,
            nurseNotes: editFormData.nurseNotes,
            status: editFormData.status,
          }
          : s
      )
    );

    if (viewingStudent && viewingStudent.id === editingStudent.id) {
      setViewingStudent({
        ...viewingStudent,
        height: Number(editFormData.height) || viewingStudent.height,
        weight: Number(editFormData.weight) || viewingStudent.weight,
        bloodGroup: editFormData.bloodGroup,
        allergies: updatedAllergies,
        conditions: updatedConditions,
        dietaryRestrictions: editFormData.dietaryRestrictions,
        emergencyContact: editFormData.emergencyContact,
        emergencyContactPerson: editFormData.emergencyContactPerson,
        nurseNotes: editFormData.nurseNotes,
        status: editFormData.status,
      });
    }

    showToast(`Health record for ${editingStudent.name} updated successfully!`, 'success');
    setEditingStudent(null);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedClass !== 'All' ||
    selectedSection !== 'All';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedClass('All');
    setSelectedSection('All');
  };

  const handleExportCSV = () => {
    const headers = [
      'Student Name',
      'Roll No',
      'GR No',
      'Class',
      'Section',
      'Age',
      'Gender',
      'Blood Group',
      'Height (cm)',
      'Weight (kg)',
      'BMI',
      'Known Allergies',
      'Chronic Conditions',
      'Guardian Name',
      'Emergency Contact',
      'Health Status',
      'Total Infirmary Visits',
    ];

    const rows = filteredStudents.map(s => {
      const bmi = calculateBMI(s.height, s.weight);
      return [
        `"${s.name}"`,
        `"${s.rollNo}"`,
        `"${s.grNo}"`,
        `"Class ${s.classNum}"`,
        `"Section ${s.section}"`,
        s.age,
        `"${s.gender}"`,
        `"${s.bloodGroup}"`,
        s.height,
        s.weight,
        `"${bmi.bmi} (${bmi.category})"`,
        `"${s.allergies.join('; ') || 'None'}"`,
        `"${s.conditions.join('; ') || 'None'}"`,
        `"${s.fatherName}"`,
        `"${s.emergencyContact}"`,
        `"${s.status}"`,
        s.visitsCount,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Health_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Student health directory exported to CSV successfully!', 'success');
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.grNo.toLowerCase().includes(q) ||
      s.fatherName.toLowerCase().includes(q) ||
      s.allergies.some(a => a.toLowerCase().includes(q)) ||
      s.conditions.some(c => c.toLowerCase().includes(q));

    const matchClass = selectedClass === 'All' || s.classNum === selectedClass;
    const matchSection = selectedSection === 'All' || s.section === selectedSection;

    return matchQuery && matchClass && matchSection;
  });

  const renderStatusBadge = (status: StudentHealthRecord['status']) => {
    switch (status) {
      case 'Healthy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
            <span>Healthy & Cleared</span>
          </span>
        );
      case 'Special Care':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] animate-pulse" />
            <span>Special Care</span>
          </span>
        );
      case 'Allergy Flagged':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BE123C]" />
            <span>Allergy Flagged</span>
          </span>
        );
      case 'Under Medication':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6D28D9]" />
            <span>Under Medication</span>
          </span>
        );
      default:
        return null;
    }
  };

  const calculateBMI = (heightCm: number, weightKg: number) => {
    const heightM = heightCm / 100;
    const bmi = (weightKg / (heightM * heightM)).toFixed(1);
    const num = parseFloat(bmi);
    let category = 'Normal';
    let color = 'text-[#15803D]';
    if (num < 15.0) {
      category = 'Underweight';
      color = 'text-[#B45309]';
    } else if (num > 22.0) {
      category = 'Above Average';
      color = 'text-[#BE123C]';
    }
    return { bmi, category, color };
  };

  return (
    <div className="animate-fade-in space-y-6 pb-8 text-left">
      {/* 1. Header with Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb items={['Nurse Portal', 'Students Health Profile']} />
          <div className="mt-1">
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">
              Students Health Profile
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
            className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-[#7C612A] hover:bg-[#560110] rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Icon name="ic:round-plus" size={19} />
            <span>Add Student Health Profile</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Bar (Search, Class, Section, Reset) */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Search student, roll, GR, allergy..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-8 text-[13px] rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] placeholder-[#94A3B8] outline-none focus:border-[#7C612A] transition-colors"
          />
          <Icon name="solar:magnifer-linear" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#17153A] cursor-pointer"
            >
              <Icon name="solar:close-circle-linear" size={14} />
            </button>
          )}
        </div>

        {/* Class Filter */}
        <div className="relative w-full sm:w-44 shrink-0">
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="w-full h-10 pl-3.5 pr-9 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer"
          >
            <option value="All">All Classes (1 to 12)</option>
            {Array.from({ length: 12 }, (_, i) => String(i + 1)).map(c => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
          <Icon name="solar:alt-arrow-down-linear" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
        </div>

        {/* Section Filter */}
        <div className="relative w-full sm:w-40 shrink-0">
          <select
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="w-full h-10 pl-3.5 pr-9 text-[13px] font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#17153A] outline-none focus:border-[#7C612A] transition-colors appearance-none cursor-pointer"
          >
            <option value="All">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
          <Icon name="solar:alt-arrow-down-linear" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
        </div>

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="h-10 px-3.5 inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#BE123C] hover:text-[#560110] bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-[#FECDD3] rounded-xl transition-colors cursor-pointer shrink-0"
            title="Clear All"
          >
            <Icon name="solar:restart-linear" size={14} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* 3. Students Health Directory Table */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-card-soft overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center mx-auto mb-3">
              <Icon name="solar:user-cross-linear" size={28} />
            </div>
            <h3 className="text-[16px] font-bold text-[#17153A]">No Student Health Records Found</h3>
            <p className="text-[13px] text-[#64748B] mt-1 max-w-sm mx-auto">
              No student profiles match your search criteria. Try modifying your class, section, or search filters.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-3 px-4 py-1.5 text-[12px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl hover:bg-[#F3EDE2] transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-5 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider w-[28%]">
                    Student & Class
                  </th>
                  <th className="px-4 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center w-[12%]">
                    Blood Group
                  </th>
                  <th className="px-4 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider w-[20%]">
                    Height / Weight
                  </th>
                  <th className="px-4 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider w-[22%]">
                    Parent Contact
                  </th>
                  <th className="px-4 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center w-[18%]">
                    Health Status
                  </th>
                  <th className="px-4 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right w-[8%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredStudents.map(student => {
                  const bmi = calculateBMI(student.height, student.weight);
                  return (
                    <tr
                      key={student.id}
                      onClick={() => setViewingStudent(student)}
                      className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                    >
                      {/* Student Identity */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={student.name} size="sm" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-[#17153A] text-[14px] group-hover:text-[#7C612A] transition-colors">
                                {student.name}
                              </span>
                              <span className="text-[11px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] px-2 py-0.5 rounded-full">
                                Class {student.classNum}-{student.section}
                              </span>
                            </div>
                            <p className="text-[12px] text-[#64748B] mt-0.5 font-mono">
                              Roll #{student.rollNo} · {student.grNo}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Blood Group */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
                          {student.bloodGroup}
                        </span>
                      </td>

                      {/* Height / Weight / BMI */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="text-[13px] font-semibold text-[#17153A]">
                          {student.height} cm · {student.weight} kg
                        </div>
                        <div className={`text-[11px] font-medium ${bmi.color}`}>
                          BMI: {bmi.bmi} ({bmi.category})
                        </div>
                      </td>

                      {/* Parent Emergency Contact */}
                      <td className="px-4 py-3.5">
                        <div className="text-[13px] font-semibold text-[#17153A] truncate">
                          {student.fatherName}
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] text-[#64748B] mt-0.5">
                          <span className="font-mono">{student.emergencyContact}</span>
                        </div>
                      </td>

                      {/* Health Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        {renderStatusBadge(student.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setViewingStudent(student);
                              setDossierTab('profile');
                            }}
                            title="View Full Health Dossier"
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#7C612A] hover:bg-[#FAF7F2] border border-transparent hover:border-[#E8DFC8] transition-colors cursor-pointer"
                          >
                            <Icon name="solar:eye-linear" size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(student)}
                            title="Update Health Record"
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#17153A] hover:bg-[#F8FAFC] border border-transparent hover:border-[#CBD5E1] transition-colors cursor-pointer"
                          >
                            <Icon name="solar:pen-linear" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. VIEW STUDENT HEALTH DOSSIER MODAL (2-PARTITION CLEAN LAYOUT - NO SCROLL) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 5. VIEW STUDENT HEALTH DOSSIER MODAL (PERFECTLY BALANCED 2-PANEL LAYOUT)  */}
      {/* ========================================================================= */}
      {viewingStudent && (
        <Modal
          open={!!viewingStudent}
          onClose={() => setViewingStudent(null)}
          title={`Student Health Profile: ${viewingStudent.name}`}
          size="xl"
          className="max-w-4xl"
          bodyClassName="!bg-[#F1F5F9] p-5 sm:p-6 max-h-[85vh] overflow-y-auto scrollbar-thin font-['Poppins'] text-left"
          footer={
            <Button variant="outline" onClick={() => setViewingStudent(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-left">
            {/* Header Identity Card */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Avatar name={viewingStudent.name} size="lg" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[18px] sm:text-[19px] font-bold text-[#17153A] tracking-tight truncate">
                      {viewingStudent.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] px-2.5 py-0.5 rounded-full">
                      Class {viewingStudent.classNum}-{viewingStudent.section}
                    </span>
                    <span className="text-[11px] font-semibold text-[#17153A] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-0.5 rounded-full font-mono">
                      Roll #{viewingStudent.rollNo}
                    </span>
                    <span className="text-[11px] font-mono text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-0.5 rounded-full">
                      {viewingStudent.grNo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-[12px] text-[#64748B] flex-wrap">
                    <span>Age: <strong className="text-[#17153A] font-semibold">{viewingStudent.age} Years</strong></span>
                    <span>•</span>
                    <span>Gender: <strong className="text-[#17153A] font-semibold">{viewingStudent.gender}</strong></span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2.5 self-start sm:self-center">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[12px] font-bold bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3] shadow-2xs font-mono">
                  <Icon name="solar:drop-bold" size={12} />
                  <span>{viewingStudent.bloodGroup}</span>
                </div>
                {renderStatusBadge(viewingStudent.status)}
              </div>
            </div>

            {/* Header Tabs Navigation (Segmented Control) */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-1.5 flex items-center gap-1.5 shadow-2xs overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { key: 'profile', label: 'Health Profile', icon: 'solar:stethoscope-linear' },
                { key: 'history', label: 'Medical History', icon: 'solar:clipboard-text-linear' },
                { key: 'visits', label: 'Health Visits', icon: 'solar:calendar-linear' },
                { key: 'vaccination', label: 'Vaccination Records', icon: 'solar:shield-check-linear' },
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setDossierTab(tab.key as any)}
                  className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 text-[13px] font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    dossierTab === tab.key
                      ? 'bg-[#7C612A] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#17153A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Icon name={tab.icon} size={15} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab 1: Student Health Profile */}
            {dossierTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {/* Physical Parameters & Vitals */}
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 pb-3 mb-3.5 border-b border-[#F1F5F9]">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
                        <Icon name="solar:stethoscope-linear" size={16} />
                      </div>
                      <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                        Physical Parameters & Vitals
                      </h4>
                    </div>

                    {/* 3 Clean Metric Cards */}
                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] flex flex-col justify-between items-center transition-all">
                        <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Height</span>
                        <div className="my-1.5">
                          <span className="text-[20px] font-bold text-[#17153A] leading-none">{viewingStudent.height}</span>
                          <span className="text-[11px] font-semibold text-[#64748B] ml-1">cm</span>
                        </div>
                        <span className="text-[10px] text-[#64748B] font-medium bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                          Measured
                        </span>
                      </div>

                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] flex flex-col justify-between items-center transition-all">
                        <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Weight</span>
                        <div className="my-1.5">
                          <span className="text-[20px] font-bold text-[#17153A] leading-none">{viewingStudent.weight}</span>
                          <span className="text-[11px] font-semibold text-[#64748B] ml-1">kg</span>
                        </div>
                        <span className="text-[10px] text-[#64748B] font-medium bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                          Scale
                        </span>
                      </div>

                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] flex flex-col justify-between items-center transition-all">
                        <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">BMI Index</span>
                        <div className="my-1.5">
                          <span className={`text-[20px] font-bold leading-none ${calculateBMI(viewingStudent.height, viewingStudent.weight).color}`}>
                            {calculateBMI(viewingStudent.height, viewingStudent.weight).bmi}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                          Normal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parents & Emergency Contacts */}
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 pb-3 mb-3.5 border-b border-[#F1F5F9]">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
                        <Icon name="solar:phone-calling-linear" size={16} />
                      </div>
                      <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                        Parents & Emergency Contacts
                      </h4>
                    </div>

                    <div className="space-y-2.5 text-[12px]">
                      {/* Father / Guardian */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Father / Guardian</span>
                          <p className="text-[13px] font-semibold text-[#17153A] truncate">{viewingStudent.fatherName}</p>
                        </div>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#CBD5E1] text-[#15803D] font-mono text-[11px] font-semibold shrink-0">
                          <Icon name="solar:phone-calling-linear" size={13} />
                          {viewingStudent.fatherPhone}
                        </span>
                      </div>

                      {/* Mother */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Mother</span>
                          <p className="text-[13px] font-semibold text-[#17153A] truncate">{viewingStudent.motherName}</p>
                        </div>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#CBD5E1] text-[#15803D] font-mono text-[11px] font-semibold shrink-0">
                          <Icon name="solar:phone-calling-linear" size={13} />
                          {viewingStudent.motherPhone}
                        </span>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                        <div className="w-6 h-6 rounded-md bg-white border border-[#E2E8F0] text-[#7C612A] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon name="solar:map-point-linear" size={13} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Residential Address</span>
                          <p className="text-[12px] font-medium text-[#17153A] leading-snug mt-0.5">{viewingStudent.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Medical History (અગાઉની બીમારી અને medical background) */}
            {dossierTab === 'history' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {/* Allergies & Flags */}
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-[#F1F5F9]">
                      <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] flex items-center justify-center shrink-0">
                        <Icon name="AlertTriangle" size={16} />
                      </div>
                      <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                        Known Allergies & Clinical Alerts
                      </h4>
                    </div>

                    <div className="space-y-3 text-[12px]">
                      <div>
                        <span className="text-[#64748B] block mb-1.5 font-medium">Allergic Sensitivities:</span>
                        {viewingStudent.allergies.length > 0 ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {viewingStudent.allergies.map((al, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                                {al}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[#15803D] font-semibold bg-[#F0FDF4] px-2.5 py-1 rounded-md border border-[#BBF7D0] text-[11px] inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                            No known allergies reported
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#F8FAFC]">
                        <span className="text-[#64748B] block mb-1.5 font-medium">Chronic Medical Conditions:</span>
                        {viewingStudent.conditions.length > 0 ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {viewingStudent.conditions.map((cd, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
                                {cd}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[#15803D] font-semibold bg-[#F0FDF4] px-2.5 py-1 rounded-md border border-[#BBF7D0] text-[11px] inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                            No chronic conditions diagnosed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dietary Restrictions & Background */}
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-[#F1F5F9]">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
                        <Icon name="History" size={16} />
                      </div>
                      <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                        Medical Background & Diet Plan
                      </h4>
                    </div>

                    <div className="space-y-3 text-[12px]">
                      <div>
                        <span className="text-[#64748B] block mb-1 font-medium">Dietary Instructions & Precautions:</span>
                        <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] font-semibold text-[#17153A] text-[12px]">
                          {viewingStudent.dietaryRestrictions || 'None reported — regular school cafeteria meal plan.'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Health Visits (Nurse એ કરેલી દરેક visit નો record) */}
            {dossierTab === 'visits' && (() => {
              const studentVisits = viewingStudent.name === 'Kabir Sen'
                ? [
                    {
                      id: 'VIS-2026-081',
                      title: 'Routine Seasonal Health Screening',
                      status: 'Treated & Released',
                      statusBadge: 'text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0]',
                      action: 'Active child. All growth milestone parameters normal for primary grade.',
                      date: formatDateOnly(viewingStudent.lastCheckupDate),
                      attending: 'School Nurse',
                      icon: 'Stethoscope',
                    },
                    {
                      id: 'VIS-2026-064',
                      title: 'Playground Abrasion & First Aid',
                      status: 'First Aid Administered',
                      statusBadge: 'text-[#1D4ED8] bg-[#EFF6FF] border-[#BFDBFE]',
                      action: 'Minor superficial scrape on left knee during recess. Antiseptic wash applied with sterile adhesive dressing.',
                      date: '28/08/2026',
                      attending: 'Nurse Sneha Trivedi',
                      icon: 'HeartPulse',
                    },
                    {
                      id: 'VIS-2026-042',
                      title: 'Mild Headache & Infirmary Rest',
                      status: 'Monitored & Cleared',
                      statusBadge: 'text-[#7C3AED] bg-[#F5F3FF] border-[#DDD6FE]',
                      action: 'Reported slight headache after outdoor PT. Rested for 20 mins, hydration provided, vitals normal.',
                      date: '14/08/2026',
                      attending: 'School Nurse',
                      icon: 'Activity',
                    },
                    {
                      id: 'VIS-2026-019',
                      title: 'Annual Pediatric Dental & Vision Screening',
                      status: 'Completed & Cleared',
                      statusBadge: 'text-[#0F766E] bg-[#F0FDFA] border-[#99F6E4]',
                      action: 'Distant vision 6/6 bilateral, oral hygiene certified sound. Annual student health certificate approved.',
                      date: '15/07/2026',
                      attending: 'Dr. Mehta (Visiting Pediatrician)',
                      icon: 'Eye',
                    },
                  ]
                : [
                    {
                      id: `${viewingStudent.id}-V1`,
                      title: viewingStudent.name === 'Diya Patel' ? 'Stomach pain & nausea' : viewingStudent.name === 'Aarav Sharma' ? 'Headache and mild fever' : 'Routine Seasonal Health Screening',
                      status: viewingStudent.status === 'Under Medication' ? 'Under Care' : 'Treated & Released',
                      statusBadge: viewingStudent.status === 'Under Medication' ? 'text-[#D97706] bg-[#FFFBEB] border-[#FDE68A]' : 'text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0]',
                      action: viewingStudent.nurseNotes || 'Infirmary observation and rest provided.',
                      date: formatDateOnly(viewingStudent.lastCheckupDate),
                      attending: 'School Nurse',
                      icon: 'Stethoscope',
                    },
                    ...(viewingStudent.visitsCount >= 2 ? [
                      {
                        id: `${viewingStudent.id}-V2`,
                        title: 'First Aid Dressing & Antiseptic Care',
                        status: 'Treated & Cleared',
                        statusBadge: 'text-[#1D4ED8] bg-[#EFF6FF] border-[#BFDBFE]',
                        action: 'Superficial skin graze treated with povidone-iodine dressing.',
                        date: '22/08/2026',
                        attending: 'Nurse Sneha Trivedi',
                        icon: 'HeartPulse',
                      },
                    ] : []),
                    ...(viewingStudent.visitsCount >= 3 ? [
                      {
                        id: `${viewingStudent.id}-V3`,
                        title: 'Periodic Physical Fitness & Vitals Check',
                        status: 'Completed',
                        statusBadge: 'text-[#7C3AED] bg-[#F5F3FF] border-[#DDD6FE]',
                        action: 'Height, weight, and blood pressure recorded for health records.',
                        date: '10/08/2026',
                        attending: 'School Nurse',
                        icon: 'Activity',
                      },
                    ] : []),
                    ...(viewingStudent.visitsCount >= 4 ? [
                      {
                        id: `${viewingStudent.id}-V4`,
                        title: 'Annual Pediatric Dental & Vision Screening',
                        status: 'Completed & Cleared',
                        statusBadge: 'text-[#0F766E] bg-[#F0FDFA] border-[#99F6E4]',
                        action: 'Vision 6/6 bilateral, oral hygiene certified sound.',
                        date: '15/07/2026',
                        attending: 'Dr. Mehta (Visiting Pediatrician)',
                        icon: 'Eye',
                      },
                    ] : []),
                  ];

              return (
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
                        <Icon name="ClipboardList" size={16} />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                          Infirmary Visit History Log
                        </h4>
                        <p className="text-[11px] text-[#64748B]">All recorded campus clinic admissions and consultations</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#7C612A] border border-[#E8DFC8]">
                      {studentVisits.length} Recorded Visits
                    </span>
                  </div>

                  {studentVisits.length > 0 ? (
                    <div className="space-y-2.5">
                      {studentVisits.map((visit) => (
                        <div
                          key={visit.id}
                          className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#7C612A] shrink-0 shadow-sm">
                              <Icon name={visit.icon} size={16} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[13px] font-bold text-[#17153A]">
                                  {visit.title}
                                </span>
                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${visit.statusBadge}`}>
                                  {visit.status}
                                </span>
                              </div>
                              <p className="text-[12px] text-[#64748B] mt-0.5">
                                Action: <strong className="text-[#17153A]">{visit.action}</strong>
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-[11px] font-mono text-[#64748B] block">
                              Checkup: {visit.date}
                            </span>
                            <span className="text-[10px] text-[#7C612A] font-semibold">Attending: {visit.attending}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-[12px] text-[#64748B] bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1]">
                      <Icon name="CheckCircle" size={24} className="text-[#15803D] mx-auto mb-1.5" />
                      <p className="font-semibold text-[#17153A]">No Emergency Infirmary Visits</p>
                      <p className="text-[11px] mt-0.5">Student has a clean medical attendance record with zero acute visits recorded this academic year.</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Tab 4: Medicine & Treatment (આપવામાં આવેલી દવા અને treatment) */}
            {dossierTab === 'treatment' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {/* Administered Medications */}
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-[#F1F5F9]">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
                        <Icon name="Pill" size={16} />
                      </div>
                      <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                        Administered Medications & First Aid
                      </h4>
                    </div>

                    <div className="space-y-2.5 text-[12px]">
                      <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white border border-[#CBD5E1] text-[#7C612A] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon name="Pill" size={13} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#17153A]">ORS Hydration Solution</span>
                            <span className="text-[10px] font-semibold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">As Needed</span>
                          </div>
                          <p className="text-[11px] text-[#64748B]">Oral electrolyte sachet dissolved in 200ml water for physical exhaustion / fatigue.</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white border border-[#CBD5E1] text-[#7C612A] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon name="HeartPulse" size={13} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#17153A]">Paracetamol 250mg</span>
                            <span className="text-[10px] font-semibold text-[#7C612A] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DFC8]">With Consent</span>
                          </div>
                          <p className="text-[11px] text-[#64748B]">Administered under nurse supervision for mild fever / headache with parental consent on file.</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F8FAFC] flex items-center justify-between text-[11px]">
                        <span className="text-[#64748B]">Parent Medical Consent:</span>
                        <span className="font-semibold text-[#15803D] inline-flex items-center gap-1">
                          <Icon name="CheckCircle" size={13} />
                          Active & Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Treatment SOP & Nurse Clinical Notes */}
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-[#F1F5F9]">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
                        <Icon name="Stethoscope" size={16} />
                      </div>
                      <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                        Treatment Protocol & Nurse Remarks
                      </h4>
                    </div>

                    <div className="space-y-3 text-[12px]">
                      <div>
                        <span className="text-[#64748B] block mb-1 font-medium">Standard Infirmary Protocol:</span>
                        <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#334155] leading-relaxed">
                          First aid administered under standard School Infirmary Care Protocol (SOP-MED-02). Resting bed observation with vital temperature logging.
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F8FAFC]">
                        <span className="text-[#64748B] block mb-1 font-medium">Attending Nurse Clinical Remarks:</span>
                        <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[12px] text-[#17153A] italic leading-relaxed">
                          "{viewingStudent.nurseNotes || 'Standard care protocols apply. Student vitals are stable and monitored regularly.'}"
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Vaccination Records (રસીકરણની વિગતો) */}
            {dossierTab === 'vaccination' && (
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFC8] text-[#7C612A] flex items-center justify-center shrink-0">
                      <Icon name="ShieldCheck" size={16} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                        Official Vaccination & Immunization Chart
                      </h4>
                      <p className="text-[11px] text-[#64748B]">Verified against state pediatric immunization schedule</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] inline-flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                    {viewingStudent.vaccinationStatus}
                  </span>
                </div>

                {/* Immunization Chart Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[12px]">
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-[#17153A] block">BCG (Tuberculosis)</span>
                      <span className="text-[11px] text-[#64748B]">Single Dose at Birth</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-md border border-[#BBF7D0]">
                      Completed
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-[#17153A] block">Polio (OPV / IPV)</span>
                      <span className="text-[11px] text-[#64748B]">4 Primary Doses</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-md border border-[#BBF7D0]">
                      Completed
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-[#17153A] block">DTP Booster</span>
                      <span className="text-[11px] text-[#64748B]">Diphtheria, Tetanus, Pertussis</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-md border border-[#BBF7D0]">
                      Completed
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-[#17153A] block">MMR (Measles, Mumps)</span>
                      <span className="text-[11px] text-[#64748B]">Dose 1 & Dose 2</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-md border border-[#BBF7D0]">
                      Completed
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-[#17153A] block">Hepatitis B</span>
                      <span className="text-[11px] text-[#64748B]">3-Dose Pediatric Series</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-md border border-[#BBF7D0]">
                      Completed
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-[#17153A] block">Typhoid Booster</span>
                      <span className="text-[11px] text-[#64748B]">Annual Booster Dose</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-md border border-[#BBF7D0]">
                      Up to Date
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 6. EDIT STUDENT HEALTH RECORD MODAL */}
      {/* ========================================================================= */}
      {editingStudent && (
        <Modal
          open={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          title={`Update Health Record: ${editingStudent.name} (${editingStudent.classNum}-${editingStudent.section})`}
          size="lg"
          className="max-w-3xl"
          bodyClassName="!bg-[#F1F5F9] p-5 sm:p-6 max-h-[82vh] overflow-y-auto scrollbar-thin font-['Poppins'] text-left"
          footer={
            <div className="flex items-center justify-end gap-2.5 w-full">
              <Button variant="outline" onClick={() => setEditingStudent(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveStudentEdit}
              >
                Save Health Record
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            {/* Section 1: Physical Parameters & Medical Status */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
              <div className="flex items-center gap-2.5 pb-0">
                <div>
                  <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                    Physical Parameters & Medical Status
                  </h4>
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Height (cm)"
                    type="number"
                    required
                    value={editFormData.height}
                    onChange={e => setEditFormData({ ...editFormData, height: Number(e.target.value) })}
                  />
                  <Input
                    label="Weight (kg)"
                    type="number"
                    required
                    value={editFormData.weight}
                    onChange={e => setEditFormData({ ...editFormData, weight: Number(e.target.value) })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Select
                    label="Blood Group"
                    required
                    options={[
                      { value: 'A+', label: 'A+ (Positive)' },
                      { value: 'B+', label: 'B+ (Positive)' },
                      { value: 'O+', label: 'O+ (Positive)' },
                      { value: 'AB+', label: 'AB+ (Positive)' },
                      { value: 'A-', label: 'A- (Negative)' },
                      { value: 'B-', label: 'B- (Negative)' },
                      { value: 'O-', label: 'O- (Negative)' },
                      { value: 'AB-', label: 'AB- (Negative)' },
                    ]}
                    value={editFormData.bloodGroup}
                    onChange={e => setEditFormData({ ...editFormData, bloodGroup: e.target.value as any })}
                  />
                  <Select
                    label="Medical Clearance Status"
                    required
                    options={[
                      { value: 'Healthy', label: 'Healthy & Cleared' },
                      { value: 'Special Care', label: 'Special Care' },
                      { value: 'Allergy Flagged', label: 'Allergy Flagged' },
                      { value: 'Under Medication', label: 'Under Medication' },
                    ]}
                    value={editFormData.status}
                    onChange={e => setEditFormData({ ...editFormData, status: e.target.value as any })}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Emergency Contact Details */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
              <div className="flex items-center gap-2.5 pb-0">
                <div>
                  <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                    Emergency Contact Details
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Primary Emergency Contact Phone"
                  required
                  placeholder="+91 98765 43210"
                  value={editFormData.emergencyContact}
                  onChange={e => setEditFormData({ ...editFormData, emergencyContact: e.target.value })}
                />
                <Input
                  label="Contact Person Description"
                  placeholder="e.g. Father (Primary) / Mother"
                  value={editFormData.emergencyContactPerson}
                  onChange={e => setEditFormData({ ...editFormData, emergencyContactPerson: e.target.value })}
                />
              </div>
            </div>

            {/* Section 3: Clinical Precautions & Notes */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
              <div className="flex items-center gap-2.5 pb-0">
                <div>
                  <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                    Clinical Precautions & Care Notes
                  </h4>
                </div>
              </div>

              <div className="space-y-3.5">
                <Input
                  label="Known Allergies (comma-separated)"
                  placeholder="e.g. Peanut Allergy (Severe), Dust Mites"
                  value={editFormData.allergies}
                  onChange={e => setEditFormData({ ...editFormData, allergies: e.target.value })}
                />

                <Input
                  label="Existing Medical Conditions"
                  placeholder="e.g. Childhood Asthma, Juvenile Diabetes"
                  value={editFormData.conditions}
                  onChange={e => setEditFormData({ ...editFormData, conditions: e.target.value })}
                />

                <Input
                  label="Dietary Instructions / Canteen Note"
                  placeholder="e.g. Strict Nut-free meal, Dairy-free"
                  value={editFormData.dietaryRestrictions}
                  onChange={e => setEditFormData({ ...editFormData, dietaryRestrictions: e.target.value })}
                />

                <Textarea
                  label="Nurse Clinical Care Notes"
                  rows={2}
                  placeholder="e.g. Inhaler stored in infirmary cabinet..."
                  value={editFormData.nurseNotes}
                  onChange={e => setEditFormData({ ...editFormData, nurseNotes: e.target.value })}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 7. ADD STUDENT HEALTH PROFILE MODAL                                       */}
      {/* ========================================================================= */}
      {showAddModal && (
        <Modal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Student Health Profile"
          size="lg"
          className="max-w-3xl"
          bodyClassName="!bg-[#F1F5F9] p-5 sm:p-6 max-h-[82vh] overflow-y-auto scrollbar-thin font-['Poppins'] text-left"
          footer={
            <div className="flex items-center justify-end gap-2.5 w-full">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveNewStudent}
              >
                Create Health Profile
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            {/* Section 1: Student Identity & Academic Record */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
              <div className="flex items-center gap-2.5 pb-0">
                <div>
                  <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                    Student Identity & Academic Record
                  </h4>
                </div>
              </div>

              <div className="space-y-3.5">
                <Input
                  label="Student Full Name"
                  required
                  placeholder="e.g. Reyansh Patel"
                  value={addFormData.name}
                  onChange={e => setAddFormData({ ...addFormData, name: e.target.value })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Select
                    label="Class"
                    required
                    options={Array.from({ length: 12 }, (_, i) => ({
                      value: String(i + 1),
                      label: `Class ${i + 1}`,
                    }))}
                    value={addFormData.classNum}
                    onChange={e => setAddFormData({ ...addFormData, classNum: e.target.value })}
                  />
                  <Select
                    label="Section"
                    required
                    options={[
                      { value: 'A', label: 'Section A' },
                      { value: 'B', label: 'Section B' },
                      { value: 'C', label: 'Section C' },
                    ]}
                    value={addFormData.section}
                    onChange={e => setAddFormData({ ...addFormData, section: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Roll Number"
                    placeholder="e.g. 15"
                    value={addFormData.rollNo}
                    onChange={e => setAddFormData({ ...addFormData, rollNo: e.target.value })}
                  />
                  <Input
                    label="GR Number"
                    placeholder="e.g. GR-2026-0812"
                    value={addFormData.grNo}
                    onChange={e => setAddFormData({ ...addFormData, grNo: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Age (Years)"
                    type="number"
                    value={addFormData.age}
                    onChange={e => setAddFormData({ ...addFormData, age: Number(e.target.value) })}
                  />
                  <Select
                    label="Gender"
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                    ]}
                    value={addFormData.gender}
                    onChange={e => setAddFormData({ ...addFormData, gender: e.target.value as any })}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Physical Vitals & Medical Status */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
              <div className="flex items-center gap-2.5 pb-0">
                <div>
                  <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                    Physical Vitals & Medical Status
                  </h4>
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Height (cm)"
                    type="number"
                    value={addFormData.height}
                    onChange={e => setAddFormData({ ...addFormData, height: Number(e.target.value) })}
                  />
                  <Input
                    label="Weight (kg)"
                    type="number"
                    value={addFormData.weight}
                    onChange={e => setAddFormData({ ...addFormData, weight: Number(e.target.value) })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Select
                    label="Blood Group"
                    required
                    options={[
                      { value: 'A+', label: 'A+ (Positive)' },
                      { value: 'B+', label: 'B+ (Positive)' },
                      { value: 'O+', label: 'O+ (Positive)' },
                      { value: 'AB+', label: 'AB+ (Positive)' },
                      { value: 'A-', label: 'A- (Negative)' },
                      { value: 'B-', label: 'B- (Negative)' },
                      { value: 'O-', label: 'O- (Negative)' },
                      { value: 'AB-', label: 'AB- (Negative)' },
                    ]}
                    value={addFormData.bloodGroup}
                    onChange={e => setAddFormData({ ...addFormData, bloodGroup: e.target.value as any })}
                  />
                  <Select
                    label="Health Status"
                    required
                    options={[
                      { value: 'Healthy', label: 'Healthy & Cleared' },
                      { value: 'Special Care', label: 'Special Care' },
                      { value: 'Allergy Flagged', label: 'Allergy Flagged' },
                      { value: 'Under Medication', label: 'Under Medication' },
                    ]}
                    value={addFormData.status}
                    onChange={e => setAddFormData({ ...addFormData, status: e.target.value as any })}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Parent & Emergency Contacts */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
              <div className="flex items-center gap-2.5 pb-0">
                <div>
                  <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                    Parent & Emergency Contacts
                  </h4>
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Father / Guardian Name"
                    placeholder="e.g. Rajesh Patel"
                    value={addFormData.fatherName}
                    onChange={e => setAddFormData({ ...addFormData, fatherName: e.target.value })}
                  />
                  <Input
                    label="Father Phone Number"
                    placeholder="+91 98765 43210"
                    value={addFormData.fatherPhone}
                    onChange={e => setAddFormData({ ...addFormData, fatherPhone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Mother Name"
                    placeholder="e.g. Neha Patel"
                    value={addFormData.motherName}
                    onChange={e => setAddFormData({ ...addFormData, motherName: e.target.value })}
                  />
                  <Input
                    label="Primary Emergency Phone"
                    required
                    placeholder="+91 98765 43210"
                    value={addFormData.emergencyContact}
                    onChange={e => setAddFormData({ ...addFormData, emergencyContact: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Clinical Flags & Notes */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
              <div className="flex items-center gap-2.5 pb-0">
                <div>
                  <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                    Clinical Flags & Notes
                  </h4>
                </div>
              </div>

              <div className="space-y-3.5">
                <Input
                  label="Known Allergies (comma-separated, optional)"
                  placeholder="e.g. Peanut Allergy, Dust Mites, or None"
                  value={addFormData.allergies}
                  onChange={e => setAddFormData({ ...addFormData, allergies: e.target.value })}
                />

                <Input
                  label="Medical Conditions (optional)"
                  placeholder="e.g. Childhood Asthma, or None"
                  value={addFormData.conditions}
                  onChange={e => setAddFormData({ ...addFormData, conditions: e.target.value })}
                />

                <Textarea
                  label="Nurse Clinical Care Notes"
                  rows={2}
                  placeholder="e.g. Annual health checkup cleared, no routine medications required."
                  value={addFormData.nurseNotes}
                  onChange={e => setAddFormData({ ...addFormData, nurseNotes: e.target.value })}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
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
              Visit History
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

      {/* 3. Comprehensive Filter Bar (Search, Class, Section, Date, Status) */}
      <div className="space-y-3">
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
              className="h-8 px-3 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#BE123C] hover:text-[#560110] bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-[#FECDD3] rounded-xl transition-colors cursor-pointer shrink-0"
              title="Clear All"
            >
              <Icon name="solar:restart-linear" size={13} />
              <span>Clear All</span>
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
                Clear All
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
                    Health Issue
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

                    {/* Column 3: Health Issue */}
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
      {/* ========================================================================= */}
      {/* 5. ADD / EDIT VISIT RECORD MODAL */}
      {/* ========================================================================= */}
      <Modal
        open={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        title={editingVisit ? `Edit Infirmary Visit: ${editingVisit.student}` : 'Add Visit Record'}
        size="lg"
        className="max-w-3xl"
        bodyClassName="!bg-[#F1F5F9] p-5 sm:p-6 max-h-[82vh] overflow-y-auto scrollbar-thin font-['Poppins'] text-left"
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <Button variant="outline" onClick={() => setShowAddEditModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveVisit}
            >
              {editingVisit ? 'Save Changes' : 'Add Visit Record'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-left">
          {/* Section 1: Student Identification & Timing */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
            <div className="flex items-center gap-2.5 pb-0">
              <div>
                <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                  Student Identification & Timing
                </h4>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                <div className="sm:col-span-8">
                  <Input
                    label="Student Full Name"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={formData.student}
                    onChange={e => setFormData({ ...formData, student: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-4">
                  <Input
                    label="Roll No"
                    placeholder="e.g. 8A-12"
                    value={formData.rollNo}
                    onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <Input
                  label="Visit Date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
                <Input
                  label="Time In"
                  placeholder="10:00 AM"
                  value={formData.timeIn}
                  onChange={e => setFormData({ ...formData, timeIn: e.target.value })}
                />
                <Input
                  label="Time Out"
                  placeholder="10:30 AM"
                  value={formData.timeOut}
                  onChange={e => setFormData({ ...formData, timeOut: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Assessment & Medication */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
            <div className="flex items-center gap-2.5 pb-0">
              <div>
                <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                  Clinical Assessment & Medication
                </h4>
              </div>
            </div>

            <div className="space-y-3.5">
              <Input
                label="Health Issue / Chief Complaint"
                required
                placeholder="e.g. Sudden stomach pain and mild dizziness during 2nd period class..."
                value={formData.complaint}
                onChange={e => setFormData({ ...formData, complaint: e.target.value })}
              />

              <Input
                label="First Aid & Treatment Provided"
                required
                placeholder="e.g. Administered ORS electrolyte, applied ice pack, vitals checked..."
                value={formData.treatment}
                onChange={e => setFormData({ ...formData, treatment: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                <div className="sm:col-span-7">
                  <Input
                    label="Medicine Administered"
                    placeholder="e.g. Paracetamol (500 mg)"
                    value={formData.medicineGiven}
                    onChange={e => setFormData({ ...formData, medicineGiven: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-5">
                  <Input
                    label="Dosage / Qty"
                    placeholder="e.g. 1 Tablet / 5 ml"
                    value={formData.medicineQty}
                    onChange={e => setFormData({ ...formData, medicineQty: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Body Temperature"
                  placeholder="e.g. 98.6 °F"
                  value={formData.temperature}
                  onChange={e => setFormData({ ...formData, temperature: e.target.value })}
                />
                <Input
                  label="Pulse Rate"
                  placeholder="e.g. 76 bpm"
                  value={formData.pulse}
                  onChange={e => setFormData({ ...formData, pulse: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Outcome & Parent Notification */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
            <div className="flex items-center gap-2.5 pb-0">
              <div>
                <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                  Outcome & Parent Notification
                </h4>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* 1. Outcome Status (full container width) */}
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

              {/* 2. Clinical Notes / Recommendations (underneath Outcome Status) */}
              <Textarea
                label="Clinical Notes / Recommendations"
                rows={2}
                placeholder="e.g. Student stabilized after 20 mins rest. Advised light hydration..."
                value={formData.remarks}
                onChange={e => setFormData({ ...formData, remarks: e.target.value })}
              />

              {/* 3. Parent Notification Status (underneath Clinical Notes with designed checkbox) */}
              <div className="pt-0.5">
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={formData.parentInformed}
                      onChange={e => setFormData({ ...formData, parentInformed: e.target.checked })}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData.parentInformed
                        ? 'bg-[#7C612A] border-[#7C612A] text-white shadow-sm'
                        : 'bg-[#FFFFFF] border-[#CBD5E1] group-hover:border-[#7C612A]'
                        }`}
                    >
                      {formData.parentInformed && (
                        <Icon name="Check" size={13} className="text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-[13px] font-semibold text-[#334155] ">
                    Parent Notification Status
                  </span>
                </label>
              </div>
            </div>
          </div>
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
          overflowVisible={true}
          bodyClassName="p-5 sm:p-6 overflow-hidden"
          footer={
            <Button variant="outline" onClick={() => setViewingVisit(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-3.5 text-left">
            {/* Header Identity Card */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[17px] font-bold text-[#17153A] truncate">{viewingVisit.student}</h3>
                  <span className="text-[12px] font-semibold text-[#17153A] bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded-full">
                    Class {viewingVisit.classNum}-{viewingVisit.section}
                  </span>
                  <span className="text-[12px] font-semibold text-[#17153A] bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded-full">
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
          overflowVisible={true}
          bodyClassName="p-5 overflow-hidden"
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
    let badgeClass = 'bg-[#FAF7F2] text-[#7C612A] border-[#E8DFC8]';

    if (category === 'Medicine') {
      badgeClass = 'bg-[#FAF7F2] text-[#7C612A] border-[#E8DFC8]';
    } else if (category === 'Dressing Supplies') {
      badgeClass = 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]';
    } else if (category === 'First Aid') {
      badgeClass = 'bg-[#FFF1F2] text-[#560110] border-[#FECDD3]';
    } else if (category === 'Antiseptics & Disinfectants') {
      badgeClass = 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
    } else if (category === 'Sprays & Ointments') {
      badgeClass = 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]';
    } else {
      badgeClass = 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]';
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold border ${badgeClass}`}>
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
              Medicine Stock
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
            <Icon name="solar:download-minimalistic-linear" size={16} />
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
              className="h-10 px-3.5 inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#BE123C] hover:text-[#560110] bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-[#FECDD3] rounded-xl transition-colors cursor-pointer shrink-0"
              title="Clear All"
            >
              <Icon name="solar:restart-linear" size={14} />
              <span>Clear All</span>
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
            {(searchQuery || selectedCategory !== 'All Categories' || selectedStatus !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                  setSelectedStatus('All');
                }}
                className="mt-3 px-4 py-1.5 text-[12px] font-semibold text-[#7C612A] bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl hover:bg-[#F3EDE2] transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
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
        className="max-w-3xl"
        bodyClassName="!bg-[#F1F5F9] p-5 sm:p-6 max-h-[82vh] overflow-y-auto scrollbar-thin font-['Poppins'] text-left"
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <Button variant="outline" onClick={() => setShowAddEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveItem}>
              {editingItem ? 'Save Changes' : 'Add Item to Inventory'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-left">
          {/* Section 1: Item Identification */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
            <div className="flex items-center gap-2.5 pb-0">
              <div>
                <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                  Item Identification
                </h4>
              </div>
            </div>

            <div className="space-y-3.5">
              <Input
                label="Item Name"
                required
                placeholder="e.g. Paracetamol Tablets"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Select
                  label="Category"
                  required
                  options={[
                    { value: 'Medicine', label: 'Medicine' },
                    { value: 'First Aid', label: 'First Aid' },
                    { value: 'Dressing Supplies', label: 'Dressing Supplies' },
                    { value: 'Antiseptics & Disinfectants', label: 'Antiseptics' },
                    { value: 'Sprays & Ointments', label: 'Sprays & Ointments' },
                    { value: 'Consumables & Surgical', label: 'Consumables' },
                  ]}
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                />
                <Input
                  label="Strength"
                  placeholder="e.g. 500 mg, 100 ml"
                  value={formData.strength}
                  onChange={e => setFormData({ ...formData, strength: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Stock & Inventory Quantity */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
            <div className="flex items-center gap-2.5 pb-0">
              <div>
                <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                  Stock & Inventory Control
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <Input
                label="Current Stock Quantity"
                type="number"
                required
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
              />
              <Select
                label="Dispensing Unit"
                required
                options={unitOptions.map(u => ({ value: u, label: u }))}
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
              />
              <Input
                label="Minimum Stock Alert Level"
                type="number"
                required
                value={formData.minLevel}
                onChange={e => setFormData({ ...formData, minLevel: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Section 3: Batch Traceability & Sourcing */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
            <div className="flex items-center gap-2.5 pb-0">
              <div>
                <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                  Batch & Procurement Information
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
            </div>
          </div>

          {/* Section 4: Usage & Clinical Notes */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3.5">
            <div className="flex items-center gap-2.5 pb-0">
              <div>
                <h4 className="text-[13px] font-bold text-[#17153A] uppercase tracking-wider">
                  Usage & Storage Instructions
                </h4>
              </div>
            </div>

            <div className="space-y-3.5">
              <Input
                label="Used This Month"
                type="number"
                value={formData.usedThisMonth}
                onChange={e => setFormData({ ...formData, usedThisMonth: Number(e.target.value) })}
              />

              <Textarea
                label="Remarks / Clinical & Storage Notes"
                rows={2}
                placeholder="e.g. Store below 25°C in a dry place. For fever complaints. Pediatric dosage..."
                value={formData.remarks}
                onChange={e => setFormData({ ...formData, remarks: e.target.value })}
              />
            </div>
          </div>
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
            overflowVisible={true}
            bodyClassName="p-5 sm:p-6 overflow-hidden"
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
                  <div className="flex items-center gap-2 flex-wrap">
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
            overflowVisible={true}
            bodyClassName="p-5 overflow-hidden"
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
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm rounded-xl p-3 flex items-center justify-between">
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
            overflowVisible={true}
            bodyClassName="p-5 overflow-hidden"
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
