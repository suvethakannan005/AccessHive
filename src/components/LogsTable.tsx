import React from 'react';
import { Search, Filter, Download, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { EntryLog } from '../types';

interface LogsTableProps {
  logs: EntryLog[];
}

export default function LogsTable({ logs }: LogsTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Entry & Exit Logs</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="pl-10 pr-4 py-2 bg-white border border-primary/10 rounded-lg text-sm focus:outline-none focus:border-accent w-64"
            />
          </div>
          <button className="bg-white border border-primary/10 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-primary/5">
            <Download size={16} /> EXPORT CSV
          </button>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 text-xs uppercase tracking-wider text-primary/60">
                <th className="px-6 py-4 font-bold">Time</th>
                <th className="px-6 py-4 font-bold">Person</th>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">Gate</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Guard</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {logs.map((log) => (
                <tr key={log.log_id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">
                    {new Date(log.entry_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold">{log.person_name}</p>
                      <p className="text-[10px] opacity-40 font-mono">{log.person_id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-primary/5 rounded text-[10px] font-bold uppercase">
                      {log.person_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {log.gate_number}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {log.status === 'GRANTED' ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <XCircle size={16} className="text-red-500" />
                      )}
                      <span className={`font-bold text-xs ${log.status === 'GRANTED' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {log.status}
                      </span>
                    </div>
                    {log.reason && <p className="text-[10px] text-red-400 mt-1">{log.reason}</p>}
                  </td>
                  <td className="px-6 py-4 text-primary/60">
                    {log.security_guard}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-primary/30">
                    <AlertCircle size={48} className="mx-auto mb-2 opacity-10" />
                    <p>No activity logs found for the selected period</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
