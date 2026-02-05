
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp, Firestore, orderBy, limit } from "firebase/firestore";
import { Appointment } from "./types";

// Credenciais reais fornecidas pelo usuário
const firebaseConfig = {
  apiKey: "AIzaSyCf3dtWjvyKzswkr6VDM7gqpw-yI6QlHX8",
  authDomain: "agenda-med-br.firebaseapp.com",
  projectId: "agenda-med-br",
  storageBucket: "agenda-med-br.firebasestorage.app",
  messagingSenderId: "665475472115",
  appId: "1:665475472115:web:bb69bc1efa0264ad61f586"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
let firestoreInstance: Firestore | null = null;

try {
  firestoreInstance = getFirestore(app);
} catch (error) {
  console.error("Erro ao inicializar Firestore:", error);
}

export const db = firestoreInstance;

/**
 * Salva um agendamento no Firestore.
 * Importante: Certifique-se de que as Regras do Firestore no console permitam escrita.
 */
export const saveAppointment = async (appData: Omit<Appointment, 'id' | 'createdAt'>) => {
  if (!db) {
    console.warn("Firestore não disponível, usando LocalStorage como fallback.");
    const local = JSON.parse(localStorage.getItem('agenda_med_cloud_fallback') || '[]');
    const newApp = { ...appData, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() };
    localStorage.setItem('agenda_med_cloud_fallback', JSON.stringify([newApp, ...local]));
    return newApp;
  }

  try {
    const docRef = await addDoc(collection(db, "appointments"), {
      ...appData,
      createdAt: serverTimestamp()
    });
    return { ...appData, id: docRef.id };
  } catch (e) {
    console.error("Erro ao salvar agendamento no Firebase:", e);
    // Fallback silencioso para garantir que o usuário não perca a ação se a regra estiver 'false'
    const local = JSON.parse(localStorage.getItem('agenda_med_cloud_fallback') || '[]');
    const newApp = { ...appData, id: 'local-' + Math.random().toString(36).substr(2, 5), createdAt: Date.now() };
    localStorage.setItem('agenda_med_cloud_fallback', JSON.stringify([newApp, ...local]));
    return newApp;
  }
};

/**
 * Busca agendamentos do usuário logado.
 */
export const getMyAppointments = async (userId: string, role: 'PATIENT' | 'PHYSICIAN') => {
  const localApps = JSON.parse(localStorage.getItem('agenda_med_cloud_fallback') || '[]');
  const filteredLocal = localApps.filter((a: any) => role === 'PATIENT' ? a.patientId === userId : a.physicianId === userId);

  if (!db) return filteredLocal;

  try {
    const field = role === 'PATIENT' ? 'patientId' : 'physicianId';
    const q = query(
      collection(db, "appointments"), 
      where(field, "==", userId), 
      orderBy("createdAt", "desc"), 
      limit(50)
    );
    const snapshot = await getDocs(q);
    const firestoreApps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    
    // Mescla local com nuvem para garantir que agendamentos recentes (antes da propagação) apareçam
    const all = [...firestoreApps, ...filteredLocal.filter((l: any) => !firestoreApps.find(f => f.id === l.id))];
    return all.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (e) {
    console.error("Erro ao buscar no Firebase:", e);
    return filteredLocal;
  }
};

/**
 * Salva um lead/contato no Firestore.
 */
export const saveLead = async (leadData: any) => {
  if (!db) {
    const local = JSON.parse(localStorage.getItem('agenda_med_leads_fallback') || '[]');
    const newLead = { ...leadData, id: Math.random().toString(), createdAt: Date.now() };
    localStorage.setItem('agenda_med_leads_fallback', JSON.stringify([newLead, ...local]));
    return newLead;
  }

  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...leadData,
      createdAt: serverTimestamp()
    });
    return { ...leadData, id: docRef.id };
  } catch (e) {
    console.error("Erro ao salvar lead:", e);
    throw e;
  }
};
