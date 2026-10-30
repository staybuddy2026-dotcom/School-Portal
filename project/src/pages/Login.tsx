import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { Button, Input } from '@/components/ui';
import { colors } from '@/theme';
import type { Role } from '@/types';

interface LoginProps {
  onLogin: (role: Role) => void;
  onBack?: () => void;
}

interface RoleItem {
  role: Role;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  demoEmail: string;
  isFeatured?: boolean;
}

const roles: RoleItem[] = [
  {
    role: 'admin',
    title: 'School Admin',
    subtitle: 'Students & Office',
    badge: 'Operations',
    icon: 'solar:buildings-2-linear',
    iconColor: 'text-[#B45309]',
    iconBg: 'bg-[#FEF7EC] border-[#FDE68A]',
    demoEmail: 'admin@sadvidhya.edu',
  },
  {
    role: 'teacher',
    title: 'Teacher',
    subtitle: 'Classes & Grading',
    badge: 'Faculty',
    icon: 'solar:book-2-linear',
    iconColor: 'text-[#059669]',
    iconBg: 'bg-[#ECFDF5] border-[#A7F3D0]',
    demoEmail: 'teacher@sadvidhya.edu',
  },
  {
    role: 'accountant',
    title: 'Accountant',
    subtitle: 'Fee & Billing',
    badge: 'Finance',
    icon: 'solar:card-linear',
    iconColor: 'text-[#C2410C]',
    iconBg: 'bg-[#FFF7ED] border-[#FED7AA]',
    demoEmail: 'accounts@sadvidhya.edu',
  },
  {
    role: 'transport',
    title: 'Transport',
    subtitle: 'Bus & Routes',
    badge: 'Fleet Ops',
    icon: 'solar:bus-linear',
    iconColor: 'text-[#0891B2]',
    iconBg: 'bg-[#F0FDFA] border-[#A5F3FC]',
    demoEmail: 'transport@sadvidhya.edu',
  },
  {
    role: 'nurse',
    title: 'Nurse',
    subtitle: 'Health & Clinic',
    badge: 'Infirmary',
    icon: 'solar:heart-pulse-linear',
    iconColor: 'text-[#7C3AED]',
    iconBg: 'bg-[#F5F3FF] border-[#DDD6FE]',
    demoEmail: 'clinic@sadvidhya.edu',
  },
  {
    role: 'parent',
    title: 'Parent',
    subtitle: 'Students & Fees',
    badge: 'Family',
    icon: 'solar:users-group-rounded-linear',
    iconColor: 'text-[#475569]',
    iconBg: 'bg-[#F1F5F9] border-[#E2E8F0]',
    demoEmail: 'parent@sadvidhya.edu',
  },
];

export function Login({ onLogin, onBack }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectRole = (item: RoleItem) => {
    setSelectedRole(item.role);
    setEmail(item.demoEmail);
    setPassword('password123');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(selectedRole);
    }, 450);
  };

  const activeRole = roles.find(r => r.role === selectedRole);

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen overflow-y-auto lg:overflow-hidden bg-[#F8FAFC] font-sans flex flex-col justify-between items-center py-4 px-4 sm:px-6 relative">
      {/* Top back button if provided */}
      <div className="w-full max-w-5xl flex items-center justify-between relative z-10">
        {onBack ? (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#64748B] hover:text-[#17153A] transition-colors cursor-pointer"
          >
            <Icon name="solar:arrow-left-linear" size={13} />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* Centered Main Content Area */}
      <div className="w-full max-w-5xl mx-auto my-auto relative z-10 py-1">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-4 sm:mb-5">
          <div className="w-11 h-11 rounded-xl bg-[#560110] flex items-center justify-center text-white shadow-sm ring-3 ring-white mb-2">
            <Icon name="solar:square-academic-cap-linear" size={22} strokeWidth={1.5} />
          </div>
          <h1 className="text-[20px] sm:text-[24px] font-bold text-[#17153A] tracking-tight">
            Sadvidhya International School
          </h1>
          <p className="text-[12px] text-[#64748B] mt-0.5 font-medium">
            Campus ERP Portal · Select your role to sign in
          </p>
        </div>

        {!selectedRole ? (
          /* Role Cards Grid - 3 on top, 3 on bottom, perfectly centered */
          <div className="animate-fade-in w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {roles.map(r => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleSelectRole(r)}
                  className="group relative flex flex-col justify-between p-4 sm:p-4.5 rounded-[18px] sm:rounded-[20px] bg-white border border-[#E2E8F0] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(23,21,58,0.08)] hover:-translate-y-0.5 transition-all duration-200 text-left cursor-pointer overflow-hidden"
                >
                  {/* Top row: Icon Box */}
                  <div className="flex items-start justify-between w-full">
                    <div
                      className={`w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border ${r.iconBg} ${r.iconColor} group-hover:scale-105 transition-transform shadow-2xs`}
                    >
                      <Icon name={r.icon} size={19} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Middle content: Title & Subtitle */}
                  <div className="w-full my-2 sm:my-2.5">
                    <h3 className="text-[14px] sm:text-[16px] font-bold leading-snug text-[#17153A] group-hover:text-[#560110] transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-[12px] text-[#64748B] font-normal mt-0.5 truncate">{r.subtitle}</p>
                  </div>

                  {/* Bottom row: "Access Portal" & Circular Arrow Button */}
                  <div className="flex items-center justify-between w-full pt-2 sm:pt-2.5 border-t border-[#F1F5F9]">
                    <span className="text-[12px] font-semibold text-[#17153A] group-hover:text-[#560110] transition-colors">
                      Access Portal
                    </span>
                    <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] group-hover:bg-[#17153A] group-hover:text-white group-hover:border-[#17153A] transition-all shadow-2xs">
                      <Icon name="solar:arrow-right-linear" size={12} strokeWidth={1.5} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Minimal Sign In Form */
          activeRole && (
            <div className="animate-scale-in max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary-600 hover:text-primary-700 mb-4 transition-colors"
              >
                <Icon name="solar:arrow-left-linear" size={13} strokeWidth={1.5} />
                <span>Choose different role</span>
              </button>

              <div className="bg-white rounded-3xl border border-ink-150 p-6 sm:p-8 shadow-card">
                <div className="flex items-center gap-3.5 pb-5 mb-5 border-b border-ink-100">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${activeRole.iconBg} ${activeRole.iconColor}`}
                  >
                    <Icon name={activeRole.icon} size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-ink-950 leading-tight">
                      {activeRole.title} Sign In
                    </h3>
                    <p className="text-[12px] text-ink-400 font-medium mt-0.5">{activeRole.subtitle}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="you@sadvidhya.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    error={error && !email ? error : undefined}
                  />

                  <Input
                    label="Password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />

                  {error && (
                    <p className="text-[12px] text-error-600 font-medium">{error}</p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full !rounded-xl font-bold mt-2 shadow-sm"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : `Sign In as ${activeRole.title}`}
                  </Button>
                </form>
              </div>
            </div>
          )
        )}
      </div>

      {/* Centered Footer */}
      <div className="relative z-10 text-[12px] text-ink-400 text-center py-2">
        © 2026 Sadvidhya International School · All rights reserved.
      </div>
    </div>
  );
}
