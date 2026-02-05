
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
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    zip: string;
  };
  plans?: string[];
}

export interface Appointment {
  id: string;
  physicianId: string;
  physicianName: string;
  patientId: string;
  patientName: string;
  time: string;
  date: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELED' | 'BLOCKED' | 'confirmed' | 'pending' | 'canceled';
  plan: string;
  whatsapp: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'WARNING' | 'ALERT' | 'INFO';
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
}

export const MOCK_DATA = {
  SPECIALTIES: ['Cardiologia', 'Dermatologia', 'Pediatria', 'Ortopedia', 'Ginecologia', 'Psiquiatria', 'Clínico Geral', 'Nutrição', 'Psicologia', 'Fisioterapia', 'Oftalmologia', 'Endocrinologia'],
  PLANS: ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Particular', 'Cassi', 'Hapvida'],
  CITIES: ['Manaus', 'Rio Branco', 'São Paulo', 'Curitiba']
};

export const CONSTANTS = {
  // Hero Image: Professional doctor with high-tech vibe
  HERO_IMAGE: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1000',
  // Pillar 1: Smart Waiting List (Concept of time/efficiency)
  P1_IMAGE: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1000',
  // Pillar 2: Data Security (Digital shielding/servers)
  P2_IMAGE: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000',
  // Pillar 3: Attendant Management (Collaborative tech)
  P3_IMAGE: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1000',
  // Bridge Background
  BRIDGE_IMAGE: 'https://images.unsplash.com/photo-1504813184591-01592fd039e5?auto=format&fit=crop&q=80&w=2000',
  TEST1_IMAGE: 'https://i.pravatar.cc/150?u=test1',
  TEST2_IMAGE: 'https://i.pravatar.cc/150?u=test2',
  LINK_DEMO: '#',
  LINK_WHATS: 'https://wa.me/5592988880000',
  PRIV_URL: '#',
  TERMS_URL: '#'
};

const generateDoctors = (): Physician[] => {
  const firstNames = ['Lucas', 'Mariana', 'Ricardo', 'Beatriz', 'Felipe', 'Juliana', 'Gabriel', 'Fernanda', 'Tiago', 'Camila'];
  const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Lima', 'Carvalho', 'Ferreira', 'Ribeiro', 'Almeida'];
  const doctors: Physician[] = [];

  for (let i = 1; i <= 50; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const spec = MOCK_DATA.SPECIALTIES[Math.floor(Math.random() * MOCK_DATA.SPECIALTIES.length)];
    
    doctors.push({
      id: `phy-${i}`,
      name: `Dr(a). ${fn} ${ln}`,
      specialty: spec,
      avatar: `https://i.pravatar.cc/150?u=phy${i}`,
      whatsapp: '5592988880000',
      city: 'Manaus',
      plans: ['Particular', MOCK_DATA.PLANS[Math.floor(Math.random() * MOCK_DATA.PLANS.length)]],
      crm: `${10000 + i}-AM`
    });
  }
  return doctors;
};

export const MOCK_PHYSICIANS: Physician[] = generateDoctors();

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    physicianId: 'phy-1',
    physicianName: 'Dr. Lucas Silva',
    patientId: 'pat-1',
    patientName: 'Maria Oliveira',
    time: '09:00',
    date: '2024-05-20',
    status: 'confirmed',
    plan: 'Unimed',
    whatsapp: '5592988887777',
    createdAt: Date.now()
  }
];
