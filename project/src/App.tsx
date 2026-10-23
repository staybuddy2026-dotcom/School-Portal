import { useState } from 'react';
import type { Role } from '@/types';
import { AppShell } from '@/components/AppShell';
import { Login } from '@/pages/Login';
import { ParentPortal } from '@/pages/ParentPortal';
import { AdminPortal } from '@/pages/AdminPortal';
import { TeacherPortal } from '@/pages/TeacherPortal';
import { AccountantPortal } from '@/pages/AccountantPortal';
import { TransportPortal } from '@/pages/TransportPortal';
import { NursePortal } from '@/pages/NursePortal';

type AppState =
  | { mode: 'login' }
  | { mode: 'app'; role: Role };

function App() {
  const [state, setState] = useState<AppState>({ mode: 'login' });
  const [activeKey, setActiveKey] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('s1');

  const handleLogin = (role: Role) => {
    const defaultKeys: Record<Role, string> = {
      public: '',
      superadmin: 'admin-dashboard',
      admin: 'admin-dashboard',
      parent: 'parent-dashboard',
      teacher: 'teacher-dashboard',
      accountant: 'acc-dashboard',
      transport: 'trans-dashboard',
      nurse: 'nurse-dashboard',
    };
    setActiveKey(defaultKeys[role]);
    setState({ mode: 'app', role });
  };

  const handleLogout = () => {
    setState({ mode: 'login' });
  };

  const handleSwitchRole = (role: Role) => {
    const defaultKeys: Record<Role, string> = {
      public: '',
      superadmin: 'admin-dashboard',
      admin: 'admin-dashboard',
      parent: 'parent-dashboard',
      teacher: 'teacher-dashboard',
      accountant: 'acc-dashboard',
      transport: 'trans-dashboard',
      nurse: 'nurse-dashboard',
    };
    setActiveKey(defaultKeys[role]);
    setState({ mode: 'app', role });
  };

  if (state.mode === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  const { role } = state;

  return (
    <AppShell
      role={role}
      activeKey={activeKey}
      onNavigate={setActiveKey}
      onSwitchRole={handleSwitchRole}
      onLogout={handleLogout}
      selectedStudentId={selectedStudentId}
      onSwitchStudent={setSelectedStudentId}
    >
      {role === 'parent' && <ParentPortal activeKey={activeKey} selectedStudentId={selectedStudentId} />}
      {(role === 'superadmin' || role === 'admin') && <AdminPortal activeKey={activeKey} />}
      {role === 'teacher' && <TeacherPortal activeKey={activeKey} />}
      {role === 'accountant' && <AccountantPortal activeKey={activeKey} />}
      {role === 'transport' && <TransportPortal activeKey={activeKey} />}
      {role === 'nurse' && <NursePortal activeKey={activeKey} />}
    </AppShell>
  );
}

export default App;
