
export type UserRole = 'PATIENT' | 'PHYSICIAN' | 'ATTENDANT';
export type AppView = 'LANDING' | 'AUTH' | 'DASHBOARD' | 'PROFILE' | 'SEARCH';
export type Language = 'pt-BR' | 'en';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  verified?: boolean;
  // Campos específicos de Médico
  crm?: string;
  specialty?: string;
  whatsapp?: string;
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    zip: string;
  };
  plans?: string[];
}

// Fix: Added missing fields and supported status variants (upper/lower case used in components)
export interface Appointment {
  id: string;
  physicianId: string;
  patientName: string;
  time: string;
  date: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELED' | 'BLOCKED' | 'confirmed' | 'pending' | 'canceled';
  plan: string;
  whatsapp: string;
  email?: string;
}

// Fix: Added missing Notification interface
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'WARNING' | 'ALERT' | 'INFO';
  read: boolean;
  createdAt: number;
}

// Fix: Added missing Physician interface
export interface Physician {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  whatsapp: string;
  city: string;
  plans: string[];
  lat?: number;
  lng?: number;
}

export const MOCK_DATA = {
  SPECIALTIES: ['Cardiologia', 'Dermatologia', 'Pediatria', 'Ortopedia', 'Ginecologia', 'Psiquiatria', 'Clínico Geral'],
  PLANS: ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Particular', 'Cassi', 'Hapvida'],
  CITIES: ['Manaus', 'Rio Branco', 'São Paulo', 'Curitiba']
};

// Fix: Added missing CONSTANTS
export const CONSTANTS = {
  HERO_IMAGE: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070',
  P1_IMAGE: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2070',
  P2_IMAGE: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=2070',
  P3_IMAGE: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=2070',
  TEST1_IMAGE: 'https://i.pravatar.cc/150?u=dr1',
  TEST2_IMAGE: 'https://i.pravatar.cc/150?u=dr2',
  LINK_DEMO: '#',
  LINK_WHATS: 'https://wa.me/559293022840',
  PRIV_URL: '#',
  TERMS_URL: '#'
};

// Fix: Added missing MOCK_PHYSICIANS
export const MOCK_PHYSICIANS: Physician[] = [
  { 
    id: 'phy1', 
    name: 'Dr. Arlindo Jr.', 
    specialty: 'Cardiologia', 
    avatar: 'https://i.pravatar.cc/150?u=phy1', 
    whatsapp: '559293022840', 
    city: 'Manaus', 
    plans: ['Unimed', 'Bradesco'], 
    lat: -3.105, 
    lng: -60.015 
  },
  { 
    id: 'phy2', 
    name: 'Dra. Ana Silva', 
    specialty: 'Dermatologia', 
    avatar: 'https://i.pravatar.cc/150?u=phy2', 
    whatsapp: '559293022841', 
    city: 'Manaus', 
    plans: ['SulAmérica', 'Particular'], 
    lat: -3.115, 
    lng: -60.025 
  }
];

// Fix: Added missing MOCK_PHYSICIANS_MANAUS
export const MOCK_PHYSICIANS_MANAUS = MOCK_PHYSICIANS;

// Fix: Added missing MOCK_APPOINTMENTS
export const MOCK_APPOINTMENTS: Appointment[] = [
  { 
    id: 'app1', 
    physicianId: 'phy1', 
    patientName: 'Carlos Souza', 
    time: '08:00', 
    date: '2024-05-20', 
    status: 'confirmed', 
    plan: 'Unimed', 
    whatsapp: '5592988887777', 
    email: 'carlos@email.com' 
  },
  { 
    id: 'app2', 
    physicianId: 'phy1', 
    patientName: 'Maria Lima', 
    time: '10:30', 
    date: '2024-05-20', 
    status: 'pending', 
    plan: 'Particular', 
    whatsapp: '5592988886666', 
    email: 'maria@email.com' 
  }
];
