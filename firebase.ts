
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

// Singleton initialization pattern
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

let firestoreInstance: Firestore | null = null;
try {
  firestoreInstance = getFirestore(app);
} catch (error) {
  console.error("Erro ao inicializar Firestore:", error);
}

export const db = firestoreInstance;

export const saveLead = async (leadData: any) => {
  if (!db) {
    console.warn("Firestore não disponível. Operando em modo demo.");
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
    console.warn("Erro ao salvar lead (modo offline/demo):", e);
    return { id: "demo-lead-" + Date.now() };
  }
};
