import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  Bus, 
  UserPlus, 
  History, 
  ShieldAlert, 
  Shield,
  Lock, 
  Unlock,
  Bell,
  Search,
  LogOut,
  Camera,
  QrCode,
  AlertTriangle,
  Car,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Student, 
  Staff, 
  BusDriver, 
  Visitor, 
  EntryLog, 
  SecurityAlert, 
  PersonType 
} from './types';
import { mockStudents, mockStaff, mockDrivers } from './data/mockData';

// Components
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import ManagementTable from './components/ManagementTable';
import VisitorRegistration from './components/VisitorRegistration';
import LogsTable from './components/LogsTable';
import Login from './components/Login';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [drivers, setDrivers] = useState<BusDriver[]>(mockDrivers);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [logs, setLogs] = useState<EntryLog[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isLockdown, setIsLockdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setCurrentUser(email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // Stats
  const stats = {
    totalEntries: logs.filter(l => l.status === 'GRANTED').length,
    studentsInside: 124 + logs.filter(l => l.person_type === 'student' && l.status === 'GRANTED').length,
    visitorsInside: visitors.filter(v => v.is_active).length,
    activeAlerts: alerts.filter(a => !a.resolved).length,
  };

  const addLog = (log: EntryLog) => {
    setLogs(prev => [log, ...prev]);
  };

  const addAlert = (alert: Omit<SecurityAlert, 'id' | 'timestamp' | 'resolved'>) => {
    const newAlert: SecurityAlert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      resolved: false
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleScanSuccess = (person: any, type: PersonType) => {
    const personId = person.student_id || person.staff_id || person.driver_id || person.visitor_id;
    
    // Check for suspicious activity: Same QR scanned multiple times in short time
    const recentLogs = logs.filter(l => 
      l.person_id === personId && 
      (new Date().getTime() - new Date(l.entry_time).getTime()) < 60000 // 1 minute
    );

    if (recentLogs.length > 0) {
      addAlert({
        type: 'RAPID_SCAN',
        message: `Suspicious activity: Multiple scans for ${person.name} (${personId})`,
        severity: 'medium'
      });
    }

    addLog({
      log_id: `LOG${Date.now()}`,
      person_type: type,
      person_id: personId,
      person_name: person.name,
      entry_time: new Date().toISOString(),
      gate_number: "GATE-01",
      security_guard: currentUser || "Officer Kumar",
      status: 'GRANTED',
      vehicle_number: person.vehicle_number
    });
  };

  const handleScanDenied = (reason: string, personId?: string) => {
    addLog({
      log_id: `LOG${Date.now()}`,
      person_type: 'visitor', // Default or unknown
      person_id: personId || 'UNKNOWN',
      person_name: 'Unknown User',
      entry_time: new Date().toISOString(),
      gate_number: "GATE-01",
      security_guard: currentUser || "Officer Kumar",
      status: 'DENIED',
      reason: reason
    });

    addAlert({
      type: reason === 'FACE MISMATCH DETECTED' ? 'FACE_MISMATCH' : 'INVALID_QR',
      message: `${reason} at GATE-01 ${personId ? `for ID: ${personId}` : ''}`,
      severity: 'high'
    });
  };

  const toggleLockdown = () => {
    setIsLockdown(!isLockdown);
    if (!isLockdown) {
      addAlert({
        type: 'SUSPICIOUS',
        message: 'EMERGENCY LOCKDOWN ACTIVATED BY ADMIN',
        severity: 'high'
      });
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'Gate Scanner', icon: Camera },
    { id: 'visitors', label: 'Visitor Registration', icon: UserPlus },
    { id: 'students', label: 'Student Management', icon: Users },
    { id: 'staff', label: 'Staff Management', icon: UserCheck },
    { id: 'drivers', label: 'Driver Management', icon: Bus },
    { id: 'logs', label: 'Entry Logs', icon: History },
    { id: 'alerts', label: 'Security Alerts', icon: ShieldAlert },
  ];

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-primary flex flex-col border-r border-primary/10">
        <div className="p-6 flex items-center gap-3 border-b border-primary/10">
          <div className="bg-primary p-2 rounded-lg">
            <Shield className="text-secondary w-6 h-6" />
          </div>
          <h1 className="font-bold text-lg leading-tight">AccessHive</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                activeTab === item.id 
                  ? 'bg-primary text-secondary font-semibold' 
                  : 'hover:bg-primary/5'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-primary/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
          <div className="mt-4">
            <button 
              onClick={toggleLockdown}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${
              isLockdown 
                ? 'bg-red-600 text-white animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                : 'bg-primary text-secondary'
            }`}
          >
            {isLockdown ? <Unlock size={20} /> : <Lock size={20} />}
            {isLockdown ? 'DISABLE LOCKDOWN' : 'EMERGENCY LOCKDOWN'}
          </button>
        </div>
      </div>
    </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-secondary overflow-hidden">
        {/* Header */}
        <header className="bg-white h-16 border-b border-primary/10 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 bg-primary/5 px-4 py-2 rounded-lg w-96 border border-primary/10">
            <Search size={18} className="text-primary/40" />
            <input 
              type="text" 
              placeholder="Search students, staff, or logs..." 
              className="bg-transparent border-none outline-none text-sm w-full text-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border-l pl-6 border-primary/10">
              <div className="text-right">
                <p className="text-sm font-bold capitalize text-primary">{currentUser?.split('@')[0]}</p>
                <p className="text-[10px] text-primary/60 uppercase tracking-wider">Security Personnel</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary font-bold">
                {currentUser?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {isLockdown && activeTab !== 'alerts' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-600 text-white p-4 rounded-xl mb-8 flex items-center gap-4 shadow-lg"
            >
              <AlertTriangle size={32} />
              <div>
                <h2 className="font-bold text-lg">SYSTEM LOCKDOWN ACTIVE</h2>
                <p className="text-sm opacity-90">All gate entry points are currently disabled. Only emergency personnel can bypass.</p>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'dashboard' && (
                <Dashboard stats={stats} recentLogs={logs} alerts={alerts} />
              )}

              {activeTab === 'scanner' && (
                <Scanner 
                  students={students}
                  staff={staff}
                  drivers={drivers}
                  visitors={visitors}
                  onScanSuccess={handleScanSuccess}
                  onScanDenied={handleScanDenied}
                  isLockdown={isLockdown}
                />
              )}

              {activeTab === 'visitors' && (
                <VisitorRegistration onRegister={(v) => setVisitors([...visitors, v])} />
              )}

              {activeTab === 'students' && (
                <ManagementTable type="student" data={students} />
              )}

              {activeTab === 'staff' && (
                <ManagementTable type="staff" data={staff} />
              )}

              {activeTab === 'drivers' && (
                <ManagementTable type="driver" data={drivers} />
              )}

              {activeTab === 'logs' && (
                <LogsTable logs={logs} />
              )}

              {activeTab === 'alerts' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Security Alerts & Incidents</h2>
                    <button 
                      onClick={() => setAlerts(alerts.map(a => ({...a, resolved: true})))}
                      className="btn-primary text-sm"
                    >
                      CLEAR ALL ALERTS
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className={`card border-l-4 ${alert.resolved ? 'border-emerald-500 opacity-60' : 'border-red-500'} flex items-center justify-between`}>
                        <div className="flex items-center gap-4">
                          <div className={`${alert.resolved ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'} p-3 rounded-full`}>
                            <ShieldAlert size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold">{alert.type}</h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                alert.severity === 'high' ? 'bg-red-100 text-red-600' : 
                                alert.severity === 'medium' ? 'bg-amber-100 text-amber-600' : 
                                'bg-blue-100 text-blue-600'
                              }`}>
                                {alert.severity}
                              </span>
                            </div>
                            <p className="text-sm text-primary/70">{alert.message}</p>
                            <p className="text-[10px] text-primary/40 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        {!alert.resolved && (
                          <button 
                            onClick={() => setAlerts(alerts.map(a => a.id === alert.id ? {...a, resolved: true} : a))}
                            className="text-xs font-bold text-accent-dark hover:underline"
                          >
                            MARK AS RESOLVED
                          </button>
                        )}
                      </div>
                    ))}
                    {alerts.length === 0 && (
                      <div className="card text-center py-12">
                        <ShieldAlert size={48} className="mx-auto mb-4 text-emerald-500 opacity-20" />
                        <p className="text-primary/40">No security alerts logged</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: number | string, icon: any, color: string }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`${color} p-3 rounded-xl text-white`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase opacity-60">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function BusItem({ number, driver, route, time }: { number: string, driver: string, route: string, time: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="bg-primary text-secondary w-8 h-8 rounded flex items-center justify-center text-xs font-bold">
          {number}
        </div>
        <div>
          <p className="text-xs font-bold">{driver}</p>
          <p className="text-[10px] opacity-60">{route}</p>
        </div>
      </div>
      <p className="text-[10px] font-mono font-bold text-accent-dark">{time}</p>
    </div>
  );
}
