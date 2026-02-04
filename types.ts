
export type UserRole = 'PATIENT' | 'PHYSICIAN' | 'ATTENDANT' | 'INSTITUTION';
export type AppView = 'LANDING' | 'AUTH' | 'DASHBOARD' | 'PROFILE' | 'SEARCH' | 'ACRE_DIRECTORY';
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

export interface Institution {
  id: string;
  cidade: string;
  nome: string;
  tipo: string;
  cursos: string[];
  endereco: string;
  contato: string;
  website: string;
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

export const MOCK_INSTITUTIONS_ACRE: Institution[] = [
  { id: 'ac1', cidade: 'Rio Branco', nome: 'UFAC - Sede', tipo: 'Pública (Federal)', cursos: ['Medicina', 'Enfermagem', 'Nutrição', 'Ed. Física', 'C. Biológicas', 'Med. Veterinária'], endereco: 'Rodovia BR-364, Km 04 - Distrito Industrial', contato: '(68) 3901-2500', website: 'ufac.br' },
  { id: 'ac2', cidade: 'Cruzeiro do Sul', nome: 'UFAC - Campus Floresta', tipo: 'Pública (Federal)', cursos: ['Enfermagem', 'C. Biológicas', 'Engenharia Agronômica'], endereco: 'Estrada do Canela Fina, Km 12', contato: '(68) 3311-2500', website: 'ufac.br/site/campus/floresta' },
  { id: 'ac3', cidade: 'Rio Branco', nome: 'IFAC - Rio Branco', tipo: 'Pública (Federal)', cursos: ['C. Biológicas', 'Engenharia Agronômica'], endereco: 'Rodovia AC-01, Km 02', contato: '(68) 2106-6800', website: 'ifac.edu.br' },
  { id: 'ac4', cidade: 'Sena Madureira', nome: 'IFAC - Sena Madureira', tipo: 'Pública (Federal)', cursos: ['C. Biológicas', 'Zootecnia'], endereco: 'Rua Pedro Rodrigues de Souza, s/n', contato: '(68) 3323-2615', website: 'ifac.edu.br' },
  { id: 'ac5', cidade: 'Rio Branco', nome: 'Uninorte', tipo: 'Privada', cursos: ['Medicina', 'Odontologia', 'Fisioterapia', 'Biomedicina'], endereco: 'Alameda Polônia, 1235', contato: '(68) 3302-7000', website: 'uninorteac.com.br' },
  { id: 'ac6', cidade: 'Cruzeiro do Sul', nome: 'Afya Cruzeiro do Sul', tipo: 'Privada', cursos: ['Medicina'], endereco: 'Rodovia AC-405, Km 01', contato: '(68) 3322-1234', website: 'cruzeirodosul.afya.com.br' }
];

export const MOCK_PHYSICIANS_MANAUS: Physician[] = MOCK_PHYSICIANS;

// Fix for DashboardView.tsx: Add exported member MOCK_APPOINTMENTS
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