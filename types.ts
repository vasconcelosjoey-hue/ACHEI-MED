
export type UserRole = 'PATIENT' | 'PHYSICIAN' | 'ATTENDANT';
export type AppView = 'AUTH' | 'DASHBOARD' | 'PROFILE' | 'SEARCH';
export type Language = 'pt-BR' | 'en';

export const CONSTANTS = {
  HERO_IMAGE: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070',
  P1_IMAGE: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=2070',
  P2_IMAGE: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2070',
  P3_IMAGE: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2070',
  TEST1_IMAGE: 'https://i.pravatar.cc/150?u=dr1',
  TEST2_IMAGE: 'https://i.pravatar.cc/150?u=dr2',
  QR_CODE_URL: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://acheimed.app',
  LINK_APP: 'https://acheimed.app/download',
  LINK_DEMO: 'https://calendly.com/acheimed/demo',
  LINK_WHATS: 'https://wa.me/5511999999999',
  PRIV_URL: '#',
  TERMS_URL: '#'
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Physician {
  id: string;
  name: string;
  specialty: string;
  city: string;
  plans: string[];
  avatar: string;
}

export interface Appointment {
  id: string;
  physicianId: string;
  patientId?: string;
  patientName: string;
  email: string;
  whatsapp: string;
  time: string;
  date?: string;
  status: string;
}

// Fixed mock physicians with IDs expected by DashboardView
export const MOCK_PHYSICIANS: Physician[] = [
  { id: 'phy1', name: 'Dr. Arlindo Jr.', specialty: 'Cardiologia', city: 'Manaus', plans: ['Unimed', 'Particular'], avatar: 'https://i.pravatar.cc/150?u=arlindo' },
  { id: 'phy2', name: 'Dra. Samara Lima', specialty: 'Dermatologia', city: 'Manaus', plans: ['Bradesco', 'Particular'], avatar: 'https://i.pravatar.cc/150?u=samara' },
  { id: 'phy3', name: 'Dr. Victor Quantum', specialty: 'Neurologia', city: 'São Paulo', plans: ['Amil'], avatar: 'https://i.pravatar.cc/150?u=victor' }
];

export const MOCK_PHYSICIANS_MANAUS: Physician[] = MOCK_PHYSICIANS;

// Added missing mock appointments for dashboard views
export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', physicianId: 'phy1', patientName: 'Ana Silva', email: 'ana@example.com', whatsapp: '92988887777', time: '09:00', status: 'pending' },
  { id: '2', physicianId: 'phy1', patientName: 'Bruno Costa', email: 'bruno@example.com', whatsapp: '92988886666', time: '10:30', status: 'confirmed' }
];

export const MOCK_DATA = {
  SPECIALTIES: ['Cardiologia', 'Dermatologia', 'Pediatria', 'Ortopedia', 'Ginecologia', 'Neurologia'],
  PLANS: ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Particular'],
  CITIES: ['Manaus', 'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba']
};

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  read: boolean;
  createdAt: number;
}
