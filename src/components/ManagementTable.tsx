import React from 'react';
import { Search, Filter, Download, UserPlus, Trash2, Edit } from 'lucide-react';
import { Student, Staff, BusDriver, PersonType } from '../types';

interface ManagementTableProps {
  type: PersonType;
  data: any[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function ManagementTable({ type, data, onDelete, onEdit }: ManagementTableProps) {
  const getHeaders = () => {
    switch (type) {
      case 'student':
        return ['ID', 'Name', 'Department', 'Year', 'Bus/Vehicle', 'Status'];
      case 'staff':
        return ['ID', 'Name', 'Department', 'Designation', 'Vehicle', 'Status'];
      case 'driver':
        return ['ID', 'Name', 'Bus Number', 'Phone', 'Vehicle', 'Status'];
      default:
        return [];
    }
  };

  const headers = getHeaders();

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button className="btn-primary flex items-center gap-2 text-sm">
            <UserPlus size={16} /> ADD {type.toUpperCase()}
          </button>
          <button className="bg-white border border-primary/10 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-primary/5">
            <Download size={16} /> EXPORT
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" />
            <input 
              type="text" 
              placeholder={`Search ${type}...`} 
              className="pl-10 pr-4 py-2 bg-white border border-primary/10 rounded-lg text-sm focus:outline-none focus:border-accent w-64"
            />
          </div>
          <button className="bg-white border border-primary/10 p-2 rounded-lg hover:bg-primary/5">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 text-xs uppercase tracking-wider text-primary/60">
                {headers.map(h => (
                  <th key={h} className="px-6 py-4 font-bold">{h}</th>
                ))}
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.map((item, idx) => (
                <tr key={idx} className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-accent-dark">
                    {item.student_id || item.staff_id || item.driver_id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.face_image} 
                        className="w-8 h-8 rounded-full object-cover border border-primary/10"
                        alt={item.name}
                      />
                      <span className="font-bold">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.department || item.bus_number}
                  </td>
                  <td className="px-6 py-4">
                    {item.year || item.designation || item.phone}
                  </td>
                  <td className="px-6 py-4">
                    {item.bus_number || item.vehicle_number || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">ACTIVE</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16} />
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
