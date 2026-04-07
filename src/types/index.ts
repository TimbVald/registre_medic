export type Role = 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string; // ISO date
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  medicalHistory?: string[];
  lastVisit?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface WorkingHours {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  schedule: WorkingHours[];
  avatar?: string;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // ISO date time
  duration: number; // minutes
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  patient?: Patient; // Joined data
  doctor?: Doctor; // Joined data
}

export interface PrescriptionItem {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  medications: PrescriptionItem[];
  notes?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  patient?: Patient;
  doctor?: Doctor;
}

export interface Consultation {
  id: string;
  appointmentId?: string; // Optional as it might be a walk-in or direct consultation
  patientId: string;
  doctorId: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  prescription: PrescriptionItem[];
  notes?: string;
  patient?: Patient; // Joined data
  doctor?: Doctor; // Joined data
}

export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total?: number; // Optional, can be calculated
}

export interface Invoice {
  id: string;
  patientId: string;
  appointmentId?: string;
  consultationId?: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  dueDate?: string;
  items: InvoiceItem[];
  patient?: Patient; // Joined data
}
