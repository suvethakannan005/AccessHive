import React, { useState, useEffect, useRef } from 'react';
import { Camera, QrCode, UserCheck, UserX, ShieldAlert, RefreshCw, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Student, Staff, BusDriver, Visitor, EntryLog, PersonType } from '../types';

interface ScannerProps {
  students: Student[];
  staff: Staff[];
  drivers: BusDriver[];
  visitors: Visitor[];
  onScanSuccess: (person: any, type: PersonType) => void;
  onScanDenied: (reason: string, personId?: string) => void;
  isLockdown: boolean;
}

export default function Scanner({ 
  students, 
  staff, 
  drivers, 
  visitors, 
  onScanSuccess, 
  onScanDenied,
  isLockdown 
}: ScannerProps) {
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanType, setScanType] = useState<PersonType | null>(null);
  const [isVerifyingFace, setIsVerifyingFace] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');
  const [manualId, setManualId] = useState('');
  const [scannerError, setScannerError] = useState<string | null>(null);

  useEffect(() => {
    if (scanResult || isLockdown) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 20, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        handleScan(decodedText);
      },
      (error) => {
        if (error?.includes('NotFoundException')) return;
      }
    );

    return () => {
      scanner.clear().catch(err => {
        // Silently handle the common 'removeChild' error in React
        if (err?.toString().includes('removeChild')) return;
      });
    };
  }, [scanResult, isLockdown]);

  const handleScan = (decodedText: string) => {
    if (isLockdown) {
      onScanDenied("SYSTEM LOCKDOWN ACTIVE");
      return;
    }

    // Search in all databases
    const student = students.find(s => s.qr_code === decodedText || s.student_id === decodedText);
    const staffMember = staff.find(s => s.qr_code === decodedText || s.staff_id === decodedText);
    const driver = drivers.find(d => d.qr_code === decodedText || d.driver_id === decodedText);
    const visitor = visitors.find(v => v.qr_code === decodedText || v.visitor_id === decodedText);

    if (student) {
      setScanResult(student);
      setScanType('student');
      startFaceVerification(student, 'student');
    } else if (staffMember) {
      setScanResult(staffMember);
      setScanType('staff');
      startFaceVerification(staffMember, 'staff'); // Staff needs face recognition
    } else if (driver) {
      setScanResult(driver);
      setScanType('driver');
      // Drivers DON'T need face recognition - Grant access immediately
      setVerificationStatus('success');
      setTimeout(() => {
        onScanSuccess(driver, 'driver');
        resetScanner();
      }, 4000);
    } else if (visitor) {
      if (!visitor.is_active) {
        onScanDenied("QR CODE EXPIRED", visitor.visitor_id);
      } else {
        setScanResult(visitor);
        setScanType('visitor');
        startFaceVerification(visitor, 'visitor');
      }
    } else {
      onScanDenied("INVALID QR CODE");
    }
  };

  const startFaceVerification = (person: any, type: PersonType) => {
    setIsVerifyingFace(true);
    setVerificationStatus('verifying');
    
    // Simulate AI Face Recognition
    setTimeout(() => {
      const isMatch = Math.random() > 0.05; // 95% success rate for demo
      if (isMatch) {
        setVerificationStatus('success');
        setTimeout(() => {
          onScanSuccess(person, type);
          resetScanner();
        }, 4000); // 4 seconds as requested
      } else {
        setVerificationStatus('failed');
        onScanDenied("FACE MISMATCH DETECTED", person.student_id || person.staff_id || person.visitor_id);
        setTimeout(resetScanner, 2000);
      }
    }, 1500);
  };

  const resetScanner = () => {
    setScanResult(null);
    setScanType(null);
    setIsVerifyingFace(false);
    setVerificationStatus('idle');
    setManualId('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner View */}
        <div className="card relative overflow-hidden flex flex-col items-center justify-center min-h-[450px] bg-black border-4 border-primary/20">
          {isLockdown ? (
            <div className="text-center p-8 space-y-4">
              <ShieldAlert size={80} className="text-red-500 mx-auto animate-pulse" />
              <h2 className="text-2xl font-bold text-white">SCANNER DISABLED</h2>
              <p className="text-red-400">System is in emergency lockdown mode.</p>
            </div>
          ) : (
            <>
              {/* Scanner Container - Always present to avoid DOM removal errors */}
              <div className={`w-full h-full flex flex-col items-center p-4 ${scanResult ? 'hidden' : 'flex'}`}>
                <div id="reader" className="w-full max-w-sm overflow-hidden rounded-xl border-2 border-accent/30"></div>
                
                <div className="mt-6 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Camera size={20} />
                    <span className="font-bold tracking-wider">LIVE CAMERA FEED</span>
                  </div>
                  <p className="text-secondary/40 text-[10px] uppercase">Align QR Code within the frame</p>
                </div>

                <div className="mt-auto pt-6 w-full max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-[1px] flex-1 bg-secondary/10"></div>
                    <span className="text-[10px] text-secondary/30 uppercase">Manual Entry</span>
                    <div className="h-[1px] flex-1 bg-secondary/10"></div>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      placeholder="Enter ID or QR Data" 
                      className="bg-secondary/5 border border-secondary/10 rounded-lg px-3 py-2 text-secondary text-sm flex-1 outline-none focus:border-accent transition-all"
                    />
                    <button 
                      onClick={() => handleScan(manualId)}
                      className="btn-primary px-4 py-2 text-xs font-bold"
                    >
                      VERIFY
                    </button>
                  </div>
                </div>
              </div>

              {/* Verification Overlay */}
              {scanResult && (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 bg-secondary/98 text-primary z-20">
                  <AnimatePresence mode="wait">
                    {verificationStatus === 'verifying' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-6 w-full"
                      >
                        <div className="relative w-64 h-64 mx-auto overflow-hidden rounded-3xl border-4 border-primary shadow-[0_0_50px_rgba(0,31,63,0.1)]">
                          {/* Live Face Scan Simulation */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-scan-fast z-10" />
                          <img 
                            src={scanResult.face_image || "https://picsum.photos/seed/face/200/200"} 
                            className="w-full h-full object-cover grayscale"
                            alt="Scanning Face"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-[2px] bg-primary shadow-[0_0_15px_#001F3F] animate-scan-line" />
                          </div>
                          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary" />
                          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-primary" />
                          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-primary" />
                          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="text-primary animate-spin" size={20} />
                            <h3 className="text-2xl font-bold text-primary tracking-widest uppercase">Biometric Match</h3>
                          </div>
                          <p className="text-xs font-mono opacity-60">ANALYZING FACIAL GEOMETRY...</p>
                        </div>
                      </motion.div>
                    )}

                    {verificationStatus === 'success' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        className="text-center space-y-4"
                      >
                        <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(5,150,105,0.2)]">
                          <UserCheck size={56} className="text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-emerald-700">ACCESS GRANTED</h3>
                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                          <p className="text-lg font-medium text-primary">Welcome, {scanResult.name}</p>
                          <p className="text-xs text-primary/50 mt-1">Entry logged successfully</p>
                        </div>
                      </motion.div>
                    )}

                    {verificationStatus === 'failed' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        className="text-center space-y-4"
                      >
                        <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                          <UserX size={56} className="text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-red-700">ACCESS DENIED</h3>
                        <p className="text-lg text-primary/80">Face Mismatch Detected</p>
                        <div className="flex gap-4 mt-6">
                          <button onClick={resetScanner} className="btn-primary px-6 py-2 font-bold">RETRY SCAN</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>

        {/* Profile Card / Info */}
        <div className="space-y-6">
          <div className={`card h-full transition-all duration-500 ${scanResult ? 'border-primary border-2 shadow-primary/5' : ''}`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <UserCheck className="text-primary" /> 
                Live Profile Data
              </h3>
              {scanResult && (
                <button onClick={resetScanner} className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors">
                  <XCircle size={24} />
                </button>
              )}
            </div>
            
            {scanResult ? (
              <div className="space-y-8">
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <img 
                      src={scanResult.face_image || "https://picsum.photos/seed/visitor/200/200"} 
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-primary/5 shadow-lg"
                      alt="Profile"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-primary text-secondary text-[10px] font-bold px-2 py-1 rounded-lg border-2 border-white shadow-sm">
                      VERIFIED
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-primary">{scanResult.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary text-secondary text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {scanType}
                      </span>
                      <span className="px-3 py-1 bg-secondary text-primary text-[10px] font-bold rounded-full border border-primary/10 uppercase tracking-wider">
                        {scanResult.student_id || scanResult.staff_id || scanResult.driver_id || scanResult.visitor_id}
                      </span>
                    </div>
                    <p className="text-sm text-primary/60 font-medium">
                      {scanResult.department || scanResult.designation || 'Campus Visitor'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 p-6 bg-secondary/30 rounded-2xl border border-primary/5">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase opacity-40 font-black tracking-widest">Phone Number</p>
                    <p className="text-base font-bold text-primary">{scanResult.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase opacity-40 font-black tracking-widest">Transport</p>
                    <p className="text-base font-bold text-primary">{scanResult.bus_number || scanResult.vehicle_number || 'N/A'}</p>
                  </div>
                  {scanResult.email && (
                    <div className="col-span-2 space-y-1">
                      <p className="text-[10px] uppercase opacity-40 font-black tracking-widest">Email Address</p>
                      <p className="text-base font-bold text-primary">{scanResult.email}</p>
                    </div>
                  )}
                  {scanResult.year && (
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase opacity-40 font-black tracking-widest">Academic Year</p>
                      <p className="text-base font-bold text-primary">{scanResult.year}</p>
                    </div>
                  )}
                  {scanResult.hostel_or_day_scholar && (
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase opacity-40 font-black tracking-widest">Residency</p>
                      <p className="text-base font-bold text-primary capitalize">{scanResult.hostel_or_day_scholar.replace('_', ' ')}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                  <QrCode size={40} className="text-primary/20" />
                </div>
                <div>
                  <p className="text-primary/60 font-bold">No Active Scan</p>
                  <p className="text-xs text-primary/40 mt-1 max-w-[200px] mx-auto">
                    Please present a valid campus QR code to the camera for verification.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        #reader {
          border: none !important;
        }
        #reader__scan_region {
          background: #000;
        }
        #reader__dashboard_section_csr button {
          background: #001F3F !important;
          color: #F5F5DC !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          font-weight: bold !important;
          cursor: pointer !important;
          margin-top: 10px !important;
        }
        #reader__status_span {
          display: none !important;
        }
        #reader__dashboard_section_csr span:nth-child(2) {
          display: none !important;
        }
        #reader__dashboard_section_csr button:nth-child(3) {
          display: none !important;
        }
        /* Hide the 'Scan an image file' link/button */
        #reader__dashboard_section_csr a, 
        #reader__dashboard_section_csr button[id*="file"] {
          display: none !important;
        }

        @keyframes scan-line {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes scan-fast {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan-line {
          position: absolute;
          animation: scan-line 2s ease-in-out infinite;
        }
        .animate-scan-fast {
          animation: scan-fast 1.5s linear infinite;
          opacity: 0.05;
        }
      `}</style>
    </div>
  );
}
