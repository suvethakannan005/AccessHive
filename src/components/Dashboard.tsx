import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { History, Users, UserPlus, ShieldAlert, Bus, Clock, TrendingUp } from 'lucide-react';

const data = [
  { name: '06:00', students: 10, staff: 5, visitors: 0 },
  { name: '08:00', students: 450, staff: 80, visitors: 5 },
  { name: '10:00', students: 120, staff: 20, visitors: 15 },
  { name: '12:00', students: 80, staff: 15, visitors: 25 },
  { name: '14:00', students: 60, staff: 10, visitors: 20 },
  { name: '16:00', students: 300, staff: 40, visitors: 10 },
  { name: '18:00', students: 50, staff: 15, visitors: 5 },
];

const deptData = [
  { name: 'CSE', value: 400 },
  { name: 'ECE', value: 300 },
  { name: 'MECH', value: 200 },
  { name: 'CIVIL', value: 150 },
  { name: 'IT', value: 250 },
];

const COLORS = ['#001F3F', '#D2B48C', '#8B4513', '#6B4423', '#003366'];

export default function Dashboard({ stats, recentLogs, alerts }: any) {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Entries Today" value={stats.totalEntries} icon={History} color="bg-primary" />
        <StatCard label="Students Inside" value={stats.studentsInside} icon={Users} color="bg-emerald-600" />
        <StatCard label="Visitors Inside" value={stats.visitorsInside} icon={UserPlus} color="bg-amber-600" />
        <StatCard label="Active Alerts" value={stats.activeAlerts} icon={ShieldAlert} color="bg-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Traffic Chart */}
          <div className="card h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" /> Peak Hour Traffic Analysis
              </h3>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-primary rounded-full" /> Students</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-accent rounded-full" /> Staff</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#001F3F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#001F3F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="students" stroke="#001F3F" fillOpacity={1} fill="url(#colorStudents)" strokeWidth={3} />
                <Area type="monotone" dataKey="staff" stroke="#D2B48C" fill="transparent" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Department Wise */}
            <div className="card h-[350px]">
              <h3 className="font-bold mb-6">Department-wise Entry</h3>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
                {deptData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1 text-[10px] font-bold">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}} />
                    {d.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Clock size={18} /> Recent Activity
              </h3>
              <div className="space-y-4">
                {recentLogs.slice(0, 5).map((log: any) => (
                  <div key={log.log_id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-primary/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${log.status === 'GRANTED' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="text-sm font-bold">{log.person_name}</p>
                        <p className="text-[10px] text-primary/60 uppercase">{log.person_type} • {log.gate_number}</p>
                      </div>
                    </div>
                    <p className="text-xs font-mono font-bold">{new Date(log.entry_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                ))}
                {recentLogs.length === 0 && <p className="text-center py-8 text-primary/30 text-sm">No recent activity</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Security Alerts */}
          <div className="card border-l-4 border-red-500">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-red-600">
              <ShieldAlert size={18} /> Security Alerts
            </h3>
            <div className="space-y-3">
              {alerts.filter((a: any) => !a.resolved).slice(0, 4).map((alert: any) => (
                <div key={alert.id} className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold text-red-700">{alert.type}</p>
                    <span className="text-[8px] bg-red-200 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase">{alert.severity}</span>
                  </div>
                  <p className="text-xs text-red-600 leading-tight">{alert.message}</p>
                  <p className="text-[10px] text-red-400 mt-2 font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
              {alerts.filter((a: any) => !a.resolved).length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShieldAlert className="text-emerald-600" size={24} />
                  </div>
                  <p className="text-emerald-600 text-sm font-bold">System Secure</p>
                  <p className="text-[10px] text-emerald-500/60">No active threats detected</p>
                </div>
              )}
            </div>
          </div>

          {/* Bus Arrivals */}
          <div className="card">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Bus size={18} /> Bus Arrivals
            </h3>
            <div className="space-y-3">
              <BusItem number="B05" driver="Muthu Swamy" route="Route A" time="08:15 AM" students={42} />
              <BusItem number="B12" driver="Selvam R." route="Route C" time="08:30 AM" students={38} />
              <BusItem number="B02" driver="Kumar P." route="Route B" time="08:45 AM" students={45} />
              <BusItem number="B08" driver="Anand K." route="Route D" time="09:00 AM" students={35} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="card flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-default">
      <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase opacity-40 tracking-wider">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function BusItem({ number, driver, route, time, students }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl border border-primary/5 hover:bg-secondary/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="bg-primary text-secondary w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm">
          {number}
        </div>
        <div>
          <p className="text-xs font-bold">{driver}</p>
          <p className="text-[10px] opacity-60">{route} • {students} Students</p>
        </div>
      </div>
      <p className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">{time}</p>
    </div>
  );
}
