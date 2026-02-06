export type UserRole = 'PATIENT' | 'PHYSICIAN';
export type AppView = 'LANDING' | 'AUTH' | 'DASHBOARD' | 'PROFILE' | 'SEARCH';
export type Language = 'pt-BR' | 'en';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  verified?: boolean;
  crm?: string;
  specialty?: string;
  whatsapp?: string;
  googleCalendarConnected?: boolean;
  availabilityRules?: {
    start: string; // "08:00"
    end: string;   // "18:00"
    slotDuration: number; // 30 (minutos)
  };
}

export interface Appointment {
  id: string;
  physicianId: string;
  physicianName: string;
  patientId: string;
  patientName: string;
  time: string;
  date: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELED' | 'BLOCKED';
  plan: string;
  whatsapp: string;
  createdAt: number;
}

// Fixed missing Notification type referenced in App.tsx and other components
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: number;
}

export interface Physician {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  whatsapp: string;
  city: string;
  plans: string[];
  crm: string;
  availabilityRules?: {
    start: string;
    end: string;
    slotDuration: number;
  };
}

export const MOCK_DATA = {
  SPECIALTIES: ['Cardiologia', 'Dermatologia', 'Pediatria', 'Ortopedia', 'Ginecologia', 'Psiquiatria', 'Clínico Geral', 'Nutrição', 'Psicologia', 'Fisioterapia', 'Oftalmologia', 'Endocrinologia'],
  PLANS: ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Particular', 'Cassi', 'Hapvida'],
  CITIES: ['Manaus', 'Rio Branco', 'São Paulo', 'Curitiba']
};

export const CONSTANTS = {
  HERO_IMAGES: [
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000'
  ],
  P1_IMAGE: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1000',
  P2_IMAGE: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000',
  P3_IMAGE: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1000',
  BRIDGE_IMAGE: 'https://images.unsplash.com/photo-1504813184591-01592fd039e5?auto=format&fit=crop&q=80&w=2000',
  TEST1_IMAGE: 'https://i.pravatar.cc/150?u=test1',
  TEST2_IMAGE: 'https://i.pravatar.cc/150?u=test2',
  LINK_DEMO: '#',
  LINK_WHATS: 'https://wa.me/5592988880000',
  PRIV_URL: '#',
  TERMS_URL: '#'
};

export const MOCK_PHYSICIANS: Physician[] = [
  {
    id: 'phy-1',
    name: 'Dr. Lucas Silva',
    specialty: 'Cardiologia',
    avatar: 'https://i.pravatar.cc/150?u=phy1',
    whatsapp: '5592988880000',
    city: 'Manaus',
    plans: ['Unimed', 'Particular'],
    crm: '12345-AM',
    availabilityRules: { start: "08:00", end: "12:00", slotDuration: 30 }
  },
  {
    id: 'phy-2',
    name: 'Dra. Mariana Santos',
    specialty: 'Dermatologia',
    avatar: 'https://i.pravatar.cc/150?u=phy2',
    whatsapp: '5592988881111',
    city: 'Manaus',
    plans: ['Bradesco', 'Particular'],
    crm: '54321-AM',
    availabilityRules: { start: "14:00", end: "18:00", slotDuration: 60 }
  }
];

// Fixed missing MOCK_APPOINTMENTS referenced in DashboardView.tsx
export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    physicianId: 'phy-1',
    physicianName: 'Dr. Lucas Silva',
    patientId: 'pat-1',
    patientName: 'João Oliveira',
    time: '09:00',
    date: '2024-05-20',
    status: 'CONFIRMED',
    plan: 'Unimed',
    whatsapp: '5592988880000',
    createdAt: Date.now()
  },
  {
    id: 'app-2',
    physicianId: 'phy-1',
    physicianName: 'Dr. Lucas Silva',
    patientId: 'pat-2',
    patientName: 'Maria Souza',
    time: '10:30',
    date: '2024-05-20',
    status: 'PENDING',
    plan: 'Particular',
    whatsapp: '5592988881111',
    createdAt: Date.now()
  }
];