// ─── MOCK DATA ────────────────────────────────────────────────
export const PATIENTS = [
  {
    id: '1',
    name: 'John Doe',
    room: '302',
    mrn: '#882-9910',
    status: 'Stable',
    vitals: '98.6°F',
    age: 45,
    gender: 'Male',
    bloodType: 'A+',
    residence: '142 Maple Street, Springfield, IL',
    admittedAt: Date.now() - 86400000,
  },
  {
    id: '2',
    name: 'Sarah Smith',
    room: '215',
    mrn: '#882-9911',
    status: 'Critical',
    vitals: '101.2°F',
    age: 62,
    gender: 'Female',
    bloodType: 'O-',
    residence: '87 Birchwood Ave, Columbus, OH',
    admittedAt: Date.now() - 43200000,
  },
  {
    id: '3',
    name: 'Robert Wilson',
    room: '404',
    mrn: '#882-9912',
    status: 'Observation',
    vitals: '99.1°F',
    age: 38,
    gender: 'Male',
    bloodType: 'B+',
    residence: '23 Oak Lane, Austin, TX',
    admittedAt: Date.now() - 21600000,
  },
];

export const INITIAL_TASKS = [
  {
    id: 't1',
    patientId: '1',
    title: 'Blood Test',
    priority: 'Medium',
    assignedRole: 'Lab',
    status: 'Pending',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 't2',
    patientId: '1',
    title: 'Administer Antibiotics',
    priority: 'High',
    assignedRole: 'Nurse',
    status: 'Pending',
    createdAt: Date.now() - 1800000,
  },
];

export const INITIAL_TIMELINE = [
  {
    id: 'e1',
    patientId: '1',
    message: 'Patient Admitted to Ward',
    timestamp: Date.now() - 7200000,
    type: 'completed',
  },
];
