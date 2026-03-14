export type PersonType = 'student' | 'staff' | 'driver' | 'visitor';

export interface Student {
  student_id: string;
  name: string;
  department: string;
  year: string;
  phone: string;
  email: string;
  hostel_or_day_scholar: 'hostel' | 'day_scholar';
  bus_number?: string;
  vehicle_number?: string;
  qr_code: string;
  face_image: string;
}

export interface Staff {
  staff_id: string;
  name: string;
  department: string;
  designation: string;
  phone: string;
  vehicle_number?: string;
  qr_code: string;
  face_image: string;
}

export interface BusDriver {
  driver_id: string;
  name: string;
  bus_number: string;
  phone: string;
  vehicle_number: string;
  qr_code: string;
  face_image: string;
}

export interface Visitor {
  visitor_id: string;
  name: string;
  phone: string;
  visitor_type: string;
  purpose_of_visit: string;
  person_to_meet: string;
  department: string;
  entry_time: string;
  exit_time?: string;
  qr_code: string;
  is_active: boolean;
}

export interface EntryLog {
  log_id: string;
  person_type: PersonType;
  person_id: string;
  person_name: string;
  vehicle_number?: string;
  entry_time: string;
  exit_time?: string;
  gate_number: string;
  security_guard: string;
  status: 'GRANTED' | 'DENIED';
  reason?: string;
}

export interface SecurityAlert {
  id: string;
  type: 'INVALID_QR' | 'FACE_MISMATCH' | 'RAPID_SCAN' | 'BLACKLISTED' | 'SUSPICIOUS';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
}

export interface VehicleEntry {
  vehicle_number: string;
  owner_name: string;
  person_type: string;
  department: string;
  entry_time: string;
}

export interface BusArrival {
  bus_number: string;
  driver_name: string;
  route: string;
  total_students: number;
  arrival_time: string;
}
