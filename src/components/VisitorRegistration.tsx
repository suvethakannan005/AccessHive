import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { UserPlus, Printer, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Visitor } from '../types';

interface VisitorRegistrationProps {
  onRegister: (visitor: Visitor) => void;
}

export default function VisitorRegistration({ onRegister }: VisitorRegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    visitor_type: 'Parent',
    purpose_of_visit: '',
    person_to_meet: '',
    department: ''
  });
  const [registeredVisitor, setRegisteredVisitor] = useState<Visitor | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVisitor: Visitor = {
      visitor_id: `VIS${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      entry_time: new Date().toISOString(),
      qr_code: `QR_VIS_${Date.now()}`,
      is_active: true
    };
    onRegister(newVisitor);
    setRegisteredVisitor(newVisitor);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      visitor_type: 'Parent',
      purpose_of_visit: '',
      person_to_meet: '',
      department: ''
    });
    setRegisteredVisitor(null);
  };

  if (registeredVisitor) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto card text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="bg-emerald-100 p-3 rounded-full">
            <CheckCircle className="text-emerald-600" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Registration Successful</h2>
        <p className="text-primary/60">Visitor pass has been generated for {registeredVisitor.name}</p>
        
        <div className="bg-white p-6 rounded-xl border-2 border-primary/5 inline-block shadow-inner">
          <QRCodeSVG value={registeredVisitor.qr_code} size={200} />
          <p className="mt-4 font-mono text-sm font-bold">{registeredVisitor.visitor_id}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => window.print()}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Printer size={18} /> PRINT PASS
          </button>
          <button 
            onClick={resetForm}
            className="btn-accent"
          >
            NEW REGISTRATION
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto card">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <UserPlus className="text-accent-dark" /> Visitor Registration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase opacity-60">Full Name</label>
            <input 
              required
              type="text" 
              className="input-field" 
              placeholder="John Doe"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase opacity-60">Phone Number</label>
            <input 
              required
              type="tel" 
              className="input-field" 
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase opacity-60">Visitor Type</label>
            <select 
              className="input-field"
              value={formData.visitor_type}
              onChange={e => setFormData({...formData, visitor_type: e.target.value})}
            >
              <option>Parent</option>
              <option>Guest</option>
              <option>Official</option>
              <option>Delivery</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase opacity-60">Department</label>
            <input 
              required
              type="text" 
              className="input-field" 
              placeholder="e.g. Computer Science"
              value={formData.department}
              onChange={e => setFormData({...formData, department: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase opacity-60">Person to Meet</label>
          <input 
            required
            type="text" 
            className="input-field" 
            placeholder="Staff or Student Name"
            value={formData.person_to_meet}
            onChange={e => setFormData({...formData, person_to_meet: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase opacity-60">Purpose of Visit</label>
          <textarea 
            required
            className="input-field h-24" 
            placeholder="Brief description of the visit purpose..."
            value={formData.purpose_of_visit}
            onChange={e => setFormData({...formData, purpose_of_visit: e.target.value})}
          ></textarea>
        </div>

        <button type="submit" className="w-full btn-primary py-3 text-lg font-bold shadow-lg shadow-primary/20">
          REGISTER & GENERATE QR
        </button>
      </form>
    </div>
  );
}
