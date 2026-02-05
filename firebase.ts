
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp, Firestore, orderBy, limit } from "firebase/firestore";
import { Appointment } from "./types";

const firebaseConfig = {
  apiKey: "DEMO_MODE_KEY",
  authDomain: "agenda-med.firebaseapp.com",
  projectId: "agenda-med",
  storageBucket: "agenda-med.appspot.com",
  messagingSenderId: "000000000",
  appId: "1:000000000:web:demo"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
let firestoreInstance: Firestore | null = null;
try {
  firestoreInstance = getFirestore(app);
} catch (error) {
  console.warn("Firestore not available.");
}

export const db = firestoreInstance;

export const saveAppointment = async (appData: Omit<Appointment, 'id' | 'createdAt'>) => {
  if (!db) {
    // Fallback LocalStorage para Demo sem Firebase
    const local = JSON.parse(localStorage.getItem('agenda_med_cloud_fallback') || '[]');
    const newApp = { ...appData, id: Math.random().toString(), createdAt: Date.now() };
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
    console.error("Error saving appointment:", e);
    return null;
  }
};

export const getMyAppointments = async (userId: string, role: 'PATIENT' | 'PHYSICIAN') => {
  if (!db) {
    const local = JSON.parse(localStorage.getItem('agenda_med_cloud_fallback') || '[]');
    return local.filter((a: any) => role === 'PATIENT' ? a.patientId === userId : a.physicianId === userId);
  }

  try {
    const field = role === 'PATIENT' ? 'patientId' : 'physicianId';
    const q = query(collection(db, "appointments"), where(field, "==", userId), orderBy("createdAt", "desc"), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
  } catch (e) {
    console.error("Error fetching appointments:", e);
    return [];
  }
};

// Fix: added missing saveLead function
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
    console.error("Error saving lead:", e);
    throw e;
  }
};
