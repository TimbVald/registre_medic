import { Patient, Doctor, Appointment, Consultation, Invoice, User, Prescription } from "@/types";

// Helper to generate dates
const getDate = (diffDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + diffDays);
  return date.toISOString();
};

export const mockUsers: User[] = [
  { id: "u1", name: "Dr. Admin", email: "admin@clinique.com", role: "ADMIN", avatar: "AD", status: "ACTIVE" },
  { id: "u2", name: "Dr. House", email: "house@clinique.com", role: "DOCTOR", avatar: "DH", status: "ACTIVE" },
  { id: "u3", name: "Sarah Connor", email: "sarah@clinique.com", role: "RECEPTIONIST", avatar: "SC", status: "INACTIVE" },
];

export const mockPatients: Patient[] = Array.from({ length: 25 }, (_, i) => ({
  id: `p${i + 1}`,
  firstName: ["Jean", "Marie", "Pierre", "Sophie", "Lucas", "Emma", "Thomas", "Léa", "Nicolas", "Julie"][i % 10],
  lastName: ["Dupont", "Martin", "Bernard", "Petit", "Robert", "Richard", "Durand", "Dubois", "Moreau", "Laurent"][i % 10],
  email: `patient${i + 1}@example.com`,
  phone: `06 ${Math.floor(Math.random() * 100).toString().padStart(2, '0')} ${Math.floor(Math.random() * 100).toString().padStart(2, '0')} ${Math.floor(Math.random() * 100).toString().padStart(2, '0')} ${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
  address: `${Math.floor(Math.random() * 100) + 1} Rue de la République, 7500${i % 9 + 1} Paris`,
  dateOfBirth: getDate(-Math.floor(Math.random() * 15000) - 5000), // Random age
  gender: i % 3 === 0 ? "MALE" : i % 3 === 1 ? "FEMALE" : "OTHER",
  lastVisit: getDate(-Math.floor(Math.random() * 30)),
  status: i % 10 === 0 ? "INACTIVE" : "ACTIVE",
  medicalHistory: i % 2 === 0 ? ["Hypertension", "Diabète type 2"] : ["Allergie Pénicilline"],
}));

export const mockDoctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Gregory House",
    specialization: "Diagnostiqueur",
    email: "house@clinique.com",
    phone: "01 23 45 67 89",
    schedule: [],
    avatar: "GH"
  },
  {
    id: "d2",
    name: "Dr. Meredith Grey",
    specialization: "Chirurgie Générale",
    email: "grey@clinique.com",
    phone: "01 23 45 67 90",
    schedule: [],
    avatar: "MG"
  },
  {
    id: "d3",
    name: "Dr. Derek Shepherd",
    specialization: "Neurochirurgie",
    email: "shepherd@clinique.com",
    phone: "01 23 45 67 91",
    schedule: [],
    avatar: "DS"
  },
  {
    id: "d4",
    name: "Dr. Cristina Yang",
    specialization: "Cardiothoracique",
    email: "yang@clinique.com",
    phone: "01 23 45 67 92",
    schedule: [],
    avatar: "CY"
  },
  {
    id: "d5",
    name: "Dr. John Dorian",
    specialization: "Médecine Interne",
    email: "jd@clinique.com",
    phone: "01 23 45 67 93",
    schedule: [],
    avatar: "JD"
  },
];

export const mockAppointments: Appointment[] = Array.from({ length: 30 }, (_, i) => {
    const patient = mockPatients[i % mockPatients.length];
    const doctor = mockDoctors[i % mockDoctors.length];
    return {
        id: `apt${i + 1}`,
        patientId: patient.id,
        doctorId: doctor.id,
        date: getDate(i - 10), // Some past, some future
        duration: 30,
        status: i < 10 ? "COMPLETED" : i < 12 ? "CANCELLED" : "CONFIRMED",
        reason: ["Consultation de routine", "Douleur abdominale", "Migraine persistante", "Vaccination", "Suivi post-opératoire"][i % 5],
        notes: "Rien à signaler",
        patient: patient,
        doctor: doctor
    };
});

export const mockConsultations: Consultation[] = Array.from({ length: 20 }, (_, i) => {
    const appointment = mockAppointments[i];
    return {
        id: `cons${i + 1}`,
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        date: appointment.date,
        symptoms: "Fièvre, toux, fatigue",
        diagnosis: "Grippe virale",
        prescription: [
            { medication: "Paracétamol", dosage: "1g", frequency: "3x/jour", duration: "5 jours", instructions: "3 fois par jour si fièvre" },
            { medication: "Vitamine C", dosage: "500mg", frequency: "1x/jour", duration: "10 jours", instructions: "Le matin" }
        ],
        notes: "Repos recommandé pendant 3 jours",
        patient: appointment.patient,
        doctor: appointment.doctor
    };
});

export const mockPrescriptions: Prescription[] = Array.from({ length: 15 }, (_, i) => {
    const patient = mockPatients[i % mockPatients.length];
    const doctor = mockDoctors[i % mockDoctors.length];
    const date = getDate(i - 5);
    return {
        id: `rx${i + 1}`,
        patientId: patient.id,
        doctorId: doctor.id,
        date: date,
        status: i < 5 ? 'COMPLETED' : 'ACTIVE',
        medications: [
            { medication: "Amoxicilline", dosage: "500mg", frequency: "3x/jour", duration: "7 jours", instructions: "Pendant les repas" },
            { medication: "Paracétamol", dosage: "1000mg", frequency: "4x/jour", duration: "5 jours", instructions: "Si douleur" }
        ],
        notes: "Bien s'hydrater",
        patient: patient,
        doctor: doctor
    };
});

export const mockInvoices: Invoice[] = Array.from({ length: 25 }, (_, i) => {
    const patient = mockPatients[i % mockPatients.length];
    const status = ["PAID", "PENDING", "OVERDUE", "CANCELLED"][i % 4] as any;
    const amount = (Math.floor(Math.random() * 10) + 1) * 25;
    
    return {
        id: `inv${i + 1}`,
        patientId: patient.id,
        amount: amount,
        status: status,
        date: getDate(i - 20),
        dueDate: getDate(i - 20 + 30),
        items: [
            { description: "Consultation", quantity: 1, unitPrice: 25, total: 25 },
            { description: "Actes techniques", quantity: 1, unitPrice: amount - 25, total: amount - 25 }
        ],
        patient: patient
    };
});
