import { Student, Staff, BusDriver } from '../types';

export const mockStudents: Student[] = [
  {
    student_id: "S001",
    name: "Sowmika",
    department: "EEE",
    year: "2nd Year",
    phone: "9840012345",
    email: "sowmika@college.edu",
    hostel_or_day_scholar: "day_scholar",
    bus_number: "Bus 5",
    qr_code: "STUDENT_QR_1",
    face_image: "https://pzikzlhksnvxongcvonq.supabase.co/storage/v1/object/public/datasets/sowmi.jpeg"
  },
  {
    student_id: "S002",
    name: "Suvetha",
    department: "MECH",
    year: "4th Year",
    phone: "9840012346",
    email: "suvetha@college.edu",
    hostel_or_day_scholar: "hostel",
    qr_code: "STUDENT_QR_2",
    face_image: "https://pzikzlhksnvxongcvonq.supabase.co/storage/v1/object/public/datasets/SUVETHA.jpg"
  },
  {
    student_id: "S003",
    name: "Akila",
    department: "IT",
    year: "4th Year",
    phone: "9840012347",
    email: "akila@college.edu",
    hostel_or_day_scholar: "day_scholar",
    bus_number: "Out Bus",
    qr_code: "STUDENT_QR_3",
    face_image: "https://pzikzlhksnvxongcvonq.supabase.co/storage/v1/object/public/datasets/Akila.jpg"
  },
  {
    student_id: "S004",
    name: "Keerthi",
    department: "ECE",
    year: "3rd Year",
    phone: "9840012348",
    email: "keerthi@college.edu",
    hostel_or_day_scholar: "day_scholar",
    bus_number: "Bus 2",
    qr_code: "STUDENT_QR_4",
    face_image: "https://pzikzlhksnvxongcvonq.supabase.co/storage/v1/object/public/datasets/kaviya.jpeg"
  },
  {
    student_id: "S005",
    name: "Vijay",
    department: "CIVIL",
    year: "3rd Year",
    phone: "9840012349",
    email: "vijay@college.edu",
    hostel_or_day_scholar: "day_scholar",
    bus_number: "Out Bus",
    qr_code: "STUDENT_QR_5",
    face_image: "https://pzikzlhksnvxongcvonq.supabase.co/storage/v1/object/public/datasets/vijay.jpeg"
  }
];

export const mockStaff: Staff[] = [
  {
    staff_id: "STAFF001",
    name: "Dr. Meenakshi",
    department: "EEE",
    designation: "Professor",
    phone: "9988776655",
    qr_code: "STAFF_QR_1",
    face_image: "https://picsum.photos/seed/staff1/200/200"
  },
  {
    staff_id: "STAFF002",
    name: "Mr. Rajesh",
    department: "MECH",
    designation: "Assistant Professor",
    phone: "9988776644",
    qr_code: "STAFF_QR_2",
    face_image: "https://picsum.photos/seed/staff2/200/200"
  },
  {
    staff_id: "STAFF003",
    name: "Mrs. Priya",
    department: "CSE",
    designation: "Associate Professor",
    phone: "9988776633",
    qr_code: "STAFF_QR_3",
    face_image: "https://picsum.photos/seed/staff3/200/200"
  },
  {
    staff_id: "STAFF004",
    name: "Dr. Anand",
    department: "IT",
    designation: "HOD",
    phone: "9988776622",
    qr_code: "STAFF_QR_4",
    face_image: "https://picsum.photos/seed/staff4/200/200"
  },
  {
    staff_id: "STAFF005",
    name: "Ms. Kavitha",
    department: "ECE",
    designation: "Lecturer",
    phone: "9988776611",
    qr_code: "STAFF_QR_5",
    face_image: "https://picsum.photos/seed/staff5/200/200"
  }
];

export const mockDrivers: BusDriver[] = [
  {
    driver_id: "DRV001",
    name: "Muthu",
    bus_number: "Bus 5",
    phone: "9123456789",
    vehicle_number: "TN-05-BUS-0005",
    qr_code: "DRIVER_QR_1",
    face_image: "https://picsum.photos/seed/drv1/200/200"
  },
  {
    driver_id: "DRV002",
    name: "Selvam",
    bus_number: "Bus 12",
    phone: "9123456788",
    vehicle_number: "TN-05-BUS-0012",
    qr_code: "DRIVER_QR_2",
    face_image: "https://picsum.photos/seed/drv2/200/200"
  },
  {
    driver_id: "DRV003",
    name: "Kumar",
    bus_number: "Bus 2",
    phone: "9123456787",
    vehicle_number: "TN-05-BUS-0002",
    qr_code: "DRIVER_QR_3",
    face_image: "https://picsum.photos/seed/drv3/200/200"
  },
  {
    driver_id: "DRV004",
    name: "Anand",
    bus_number: "Bus 8",
    phone: "9123456786",
    vehicle_number: "TN-05-BUS-0008",
    qr_code: "DRIVER_QR_4",
    face_image: "https://picsum.photos/seed/drv4/200/200"
  },
  {
    driver_id: "DRV005",
    name: "Ravi",
    bus_number: "Bus 15",
    phone: "9123456785",
    vehicle_number: "TN-05-BUS-0015",
    qr_code: "DRIVER_QR_5",
    face_image: "https://picsum.photos/seed/drv5/200/200"
  },
  {
    driver_id: "DRV006",
    name: "Gopal",
    bus_number: "Bus 20",
    phone: "9123456784",
    vehicle_number: "TN-05-BUS-0020",
    qr_code: "DRIVER_QR_6",
    face_image: "https://picsum.photos/seed/drv6/200/200"
  }
];
