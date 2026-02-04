
export type UserRole = 'PATIENT' | 'PHYSICIAN' | 'ATTENDANT' | 'INSTITUTION';
export type AppView = 'LANDING' | 'AUTH' | 'DASHBOARD' | 'PROFILE' | 'SEARCH';
export type Language = 'pt-BR' | 'en';

export const CONSTANTS = {
  HERO_IMAGE: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070',
  P1_IMAGE: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=2070',
  P2_IMAGE: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2070',
  P3_IMAGE: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2070',
  TEST1_IMAGE: 'https://i.pravatar.cc/150?u=dr1',
  TEST2_IMAGE: 'https://i.pravatar.cc/150?u=dr2',
  QR_CODE_URL: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://agendamed.app',
  LINK_APP: 'https://agendamed.app/download',
  LINK_DEMO: 'https://calendly.com/agendamed/demo',
  LINK_WHATS: 'https://wa.me/559293022840?text=quero%20preencher%20minha%20agenda%20m%C3%A9dica!',
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

export const MOCK_PHYSICIANS: Physician[] = [
  { id: 'phy1', name: 'Dr. Arlindo Jr.', specialty: 'Cardiologia', city: 'Manaus', plans: ['Unimed', 'Particular'], avatar: 'https://i.pravatar.cc/150?u=arlindo' },
  { id: 'phy2', name: 'Dra. Samara Lima', specialty: 'Dermatologia', city: 'Manaus', plans: ['Bradesco', 'Particular'], avatar: 'https://i.pravatar.cc/150?u=samara' },
  { id: 'phy3', name: 'Dr. Victor Quantum', specialty: 'Neurologia', city: 'São Paulo', plans: ['Amil'], avatar: 'https://i.pravatar.cc/150?u=victor' },
  { id: 'phy4', name: 'Dra. Acreana Silva', specialty: 'Medicina da Família', city: 'Rio Branco', plans: ['Unimed', 'Sus'], avatar: 'https://i.pravatar.cc/150?u=acreana' }
];

export const MOCK_PHYSICIANS_MANAUS: Physician[] = MOCK_PHYSICIANS;

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', physicianId: 'phy1', patientName: 'Ana Silva', email: 'ana@email.com', whatsapp: '(11) 99999-9999', time: '09:00', status: 'confirmed' },
  { id: '2', physicianId: 'phy2', patientName: 'Bruno Costa', email: 'bruno@email.com', whatsapp: '(11) 98888-8888', time: '10:30', status: 'pending' }
];

export const MOCK_DATA = {
  SPECIALTIES: ['Cardiologia', 'Dermatologia', 'Pediatria', 'Ortopedia', 'Ginecologia', 'Neurologia', 'Medicina da Família'],
  PLANS: ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Particular', 'Sus'],
  CITIES: ['Manaus', 'Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'São Paulo']
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
