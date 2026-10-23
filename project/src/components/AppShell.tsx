import { type ReactNode, useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/Icon';
import { Avatar } from '@/components/ui';
import { navConfigs, roleLabels, roleNames, roleTitles } from '@/nav-config';
import type { Role } from '@/types';
import { notifications as allNotifications, students } from '@/data';
import { colors } from '@/theme';

interface AppShellProps {
  role: Role;
  activeKey: string;
  onNavigate: (key: string) => void;
  onSwitchRole?: (role: Role) => void;
  onLogout: () => void;
  children: ReactNode;
  selectedStudentId?: string;
  onSwitchStudent?: (id: string) => void;
}

export function AppShell({ role, activeKey, onNavigate, onLogout, children, selectedStudentId, onSwitchStudent }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [childDropdownOpen, setChildDropdownOpen] = useState(false);

  const navItems = navConfigs[role] || [];
  const unreadCount = allNotifications.filter(n => !n.read).length;
  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const groupedNav = navItems.reduce<Record<string, typeof navItems>>((acc, item) => {
    const g = item.group || '';
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  const profileTabKeys: Partial<Record<Role, string>> = {
    parent: 'parent-profile',
    teacher: 'teacher-profile',
    admin: 'admin-users',
    accountant: 'acc-profile',
    transport: 'trans-profile',
    nurse: 'nurse-profile',
  };

  const handleOpenProfile = () => {
    setProfileOpen(false);
    const targetKey = profileTabKeys[role];
    if (targetKey) {
      onNavigate(targetKey);
    }
  };

  // Direct Tab Redirect Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cleanQuery = searchQuery.trim().toLowerCase();

  const matchingTabs = cleanQuery
    ? navItems.filter(item =>
      item.label.toLowerCase().includes(cleanQuery) ||
      (item.group && item.group.toLowerCase().includes(cleanQuery))
    )
    : [];

  const findMatchingTab = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return undefined;

    // 1. Exact or prefix match with tab label
    const exact = navItems.find(item => item.label.toLowerCase() === q);
    if (exact) return exact;

    const startsWith = navItems.find(item => item.label.toLowerCase().startsWith(q));
    if (startsWith) return startsWith;

    const includes = navItems.find(item => item.label.toLowerCase().includes(q));
    if (includes) return includes;

    // 2. Keyword & synonym lookup
    const synonyms: Record<string, string> = {
      home: 'dashboard',
      pay: 'fees',
      payment: 'fees',
      due: 'fees',
      dues: 'fees',
      challan: 'fees',
      score: 'exam',
      marks: 'exam',
      grade: 'exam',
      result: 'exam',
      test: 'exam',
      holiday: 'calendar',
      vacation: 'calendar',
      date: 'calendar',
      notice: 'circular',
      notification: 'circular',
      circulars: 'circular',
      bus: 'transport',
      van: 'transport',
      route: 'transport',
      driver: 'transport',
      ticket: 'helpdesk',
      query: 'helpdesk',
      issue: 'helpdesk',
      complaint: 'helpdesk',
      support: 'help',
      faq: 'help',
      contact: 'help',
      schedule: 'time table',
      period: 'time table',
      routine: 'time table',
      subject: 'academic',
      syllabus: 'academic',
      study: 'academic',
      leave: 'attendance',
      present: 'attendance',
      absent: 'attendance',
      user: 'my profile',
      profile: 'my profile',
      account: 'my profile',
      activity: 'activity',
      sport: 'activity',
      sports: 'activity',
      event: 'event',
      events: 'event',
      discipline: 'discipline',
      behaviour: 'discipline',
      observation: 'observation',
      remarks: 'observation',
    };

    for (const [kw, targetLabel] of Object.entries(synonyms)) {
      if (q.includes(kw)) {
        const match = navItems.find(item => item.label.toLowerCase().includes(targetLabel));
        if (match) return match;
      }
    }

    return undefined;
  };

  const handleRedirectTab = (tabKey: string) => {
    onNavigate(tabKey);
    setSearchQuery('');
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = findMatchingTab(searchQuery);
    if (match) {
      handleRedirectTab(match.key);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  return (
    <div className="flex h-screen overflow-hidden bg-ink-50">
      {/* Mobile Sidebar Drawer Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-overlay-backdrop backdrop-blur-[3px] transition-opacity duration-200 animate-fade-in lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-ink-100 flex flex-col shadow-sidebar transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-ink-100/80 shrink-0 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-2xl bg-[${colors.brand.primary}] flex items-center justify-center text-white shadow-md shadow-primary-500/25 ring-2 ring-primary-100 shrink-0`}>
              <Icon name="solar:square-academic-cap-linear" size={22} strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[16px] font-extrabold text-ink-950 tracking-tight leading-tight truncate">Sadvidhya School</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[12px] font-semibold text-primary-700 tracking-wide uppercase truncate">{roleLabels[role]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Child Selector for Parent Portal in Slide Menu */}
        {role === 'parent' && onSwitchStudent && (
          <div className="p-3 border-b border-ink-100/80 bg-slate-50/60">
            <div className="relative">
              <button
                type="button"
                onClick={() => setChildDropdownOpen(!childDropdownOpen)}
                className={`w-full flex items-center justify-between gap-2.5 p-2 rounded-xl bg-white border border-ink-200/80 hover:border-[${colors.brand.primary}] shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 shadow-2xs flex items-center justify-center">
                    {selectedStudent.photo ? (
                      <img src={selectedStudent.photo} alt={selectedStudent.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className={`w-full h-full bg-[${colors.brand.primary}] text-white font-bold text-[12px] flex items-center justify-center`}>
                        {selectedStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[14px] font-bold text-[${colors.brand.navy}] leading-tight truncate`}>
                      {selectedStudent.name}
                    </p>
                    <p className="text-[12px] font-medium text-ink-400 mt-0.5">
                      {selectedStudent.class} · {selectedStudent.section}
                    </p>
                  </div>
                </div>
                <Icon
                  name={childDropdownOpen ? 'ChevronUp' : 'ChevronDown'}
                  size={15}
                  className="text-ink-400 shrink-0"
                />
              </button>

              {/* Dropdown list of children */}
              {childDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setChildDropdownOpen(false)} />
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-lg border border-ink-150 p-1.5 z-50 animate-fade-in space-y-1">
                    {students.map(s => {
                      const isSelected = s.id === selectedStudent.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            onSwitchStudent(s.id);
                            setChildDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${isSelected
                            ? `bg-primary-50 text-[${colors.brand.primary}] font-semibold`
                            : 'hover:bg-slate-50 text-ink-700'
                            }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full overflow-hidden text-[12px] font-bold flex items-center justify-center shrink-0 border border-ink-150 bg-slate-100">
                              {s.photo ? (
                                <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className={`w-full h-full flex items-center justify-center ${isSelected ? `bg-[${colors.brand.primary}] text-white` : 'bg-slate-100 text-ink-600'}`}>
                                  {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-bold truncate leading-tight">{s.name}</p>
                              <p className="text-[10px] text-ink-400">{s.class} · {s.section}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <Icon name="Check" size={15} className={`text-[${colors.brand.primary}] shrink-0`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 space-y-4">
          {Object.entries(groupedNav).map(([group, items]) => (
            <div key={group}>
              {group && (
                <div className="px-3 pt-2 pb-1.5 flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-ink-400 uppercase tracking-wider">{group}</span>
                </div>
              )}
              <div className="space-y-1">
                {items.map(item => {
                  const active = activeKey === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => { onNavigate(item.key); setSidebarOpen(false); }}
                      className={`group relative w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-all duration-150 ${active
                        ? 'bg-primary-50/90 text-primary-700 font-semibold shadow-2xs border border-primary-200/70'
                        : 'text-ink-600 hover:text-ink-950 hover:bg-ink-100/70'
                        }`}
                    >
                      {active && (
                        <span className="absolute left-0.5 top-2.5 bottom-2.5 w-1 rounded-r-full bg-primary-600 shadow-sm" />
                      )}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 ${active
                          ? 'text-primary-600 shadow-2xs'
                          : 'text-ink-400 group-hover:text-primary-600 group-hover:bg-white group-hover:shadow-2xs'
                          }`}
                      >
                        <Icon
                          name={item.icon}
                          width={item.iconWidth ?? (item.key === 'parent-dashboard' ? 24 : 20)}
                          height={item.iconHeight ?? (item.key === 'parent-dashboard' ? 24 : 20)}
                          strokeWidth={1.5}
                        />
                      </div>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>


      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-ink-200/60 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100">
              <Icon name="Menu" size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} className="relative w-9 h-9 rounded-lg flex items-center justify-center text-ink-500 transition-colors">
                <Icon name="mage:notification-bell" size={28} />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-error-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-pop border border-ink-200 z-50 animate-slide-up overflow-hidden">
                    <div className="px-4 py-3 border-b border-ink-100 flex items-center justify-between">
                      <p className="text-[14px] font-semibold text-ink-900">Notifications</p>
                      <span className="text-[12px] text-primary-600 font-medium cursor-pointer">Mark all read</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto scrollbar-thin">
                      {allNotifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 border-b border-ink-50 hover:bg-ink-50 cursor-pointer ${!n.read ? 'bg-primary-50/40' : ''}`}>
                          <div className="flex items-start gap-2.5">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${n.type === 'fee' ? 'bg-warning-50 text-warning-600' : n.type === 'circular' ? 'bg-primary-50 text-primary-600' : n.type === 'attendance' ? 'bg-error-50 text-error-600' : n.type === 'approval' ? 'bg-success-50 text-success-600' : 'bg-accent-50 text-accent-600'}`}>
                              <Icon name={n.type === 'fee' ? 'CreditCard' : n.type === 'circular' ? 'FileText' : n.type === 'attendance' ? 'CalendarCheck' : n.type === 'approval' ? 'CheckCircle' : 'PartyPopper'} size={14} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[14px] font-medium text-ink-800">{n.title}</p>
                              <p className="text-[12px] text-ink-500 mt-0.5 line-clamp-2">{n.message}</p>
                              <p className="text-[12px] text-ink-400 mt-1">{n.time}</p>
                            </div>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-1.5" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile menu */}
            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg transition-colors">
                <Avatar name={roleNames[role]} size="sm" />
                <div className="text-left hidden sm:block">
                  <p className="text-[14px] font-semibold text-ink-800 leading-tight">{roleNames[role]}</p>
                  <p className="text-[12px] text-ink-400">{roleTitles[role]}</p>
                </div>
                <Icon name="ChevronDown" size={14} className="text-ink-400 hidden sm:block" />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-pop border border-ink-200 z-50 animate-slide-up overflow-hidden">
                    <div
                      onClick={handleOpenProfile}
                      className="px-4 py-3 border-b border-ink-100 transition-colors"
                    >
                      <p className="text-[14px] font-semibold text-ink-800">{roleNames[role]}</p>
                      <p className="text-[12px] text-ink-400">{roleTitles[role]}</p>
                    </div>
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={handleOpenProfile}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-[14px] font-medium hover:bg-ink-50 transition-colors text-left cursor-pointer"
                      >
                        <Icon name="hugeicons:user-round" size={20} /> My Profile
                      </button>
                      <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-4 py-2 text-[14px] font-medium text-error-600 hover:bg-error-50 transition-colors">
                        <Icon name="solar:logout-linear" size={20} /> Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
            {children}
          </div>
        </main>
      </div >
    </div >
  );
}
