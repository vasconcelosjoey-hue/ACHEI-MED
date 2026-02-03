
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, Firestore } from "firebase/firestore";

// CONFIGURAÇÃO DE DEMONSTRAÇÃO
const firebaseConfig = {
  apiKey: "DEMO_MODE_KEY",
  authDomain: "achei-med.firebaseapp.com",
  projectId: "achei-med",
  storageBucket: "achei-med.appspot.com",
  messagingSenderId: "000000000",
  appId: "1:000000000:web:demo"
};

// Inicialização segura
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let firestoreInstance: Firestore | null = null;
try {
  // Tentativa de obter a instância, mas sem quebrar o app se falhar
  firestoreInstance = getFirestore(app);
} catch (error) {
  console.warn("Firestore service not available. App running in offline/demo mode.");
}

export const db = firestoreInstance;

export const saveLead = async (leadData: any) => {
  if (!db) {
    console.info("Simulando salvamento de lead (Modo Demo):", leadData);
    return { id: "demo-lead-" + Date.now() };
  }

  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...leadData,
      source: "landing",
      createdAt: serverTimestamp()
    });
    return docRef;
  } catch (e) {
    console.warn("Falha ao salvar no Firestore (usando fallback):", e);
    return { id: "demo-lead-" + Date.now() };
  }
};
