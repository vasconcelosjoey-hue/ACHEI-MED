
import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getFirestore, collection, addDoc, getDocs, query, where, 
  serverTimestamp, doc, updateDoc, getDoc, setDoc, 
  orderBy, limit, onSnapshot 
} from "firebase/firestore";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  sendEmailVerification, onAuthStateChanged, signOut, User as FirebaseUser,
  GoogleAuthProvider
} from "firebase/auth";
import { Appointment, User, Physician } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyCf3dtWjvyKzswkr6VDM7gqpw-yI6QlHX8",
  authDomain: "agenda-med-br.firebaseapp.com",
  projectId: "agenda-med-br",
  storageBucket: "agenda-med-br.firebasestorage.app",
  messagingSenderId: "665475472115",
  appId: "1:665475472115:web:bb69bc1efa0264ad61f586"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Persistência de Usuário (Profile no Firestore)
export const saveUserProfile = async (uid: string, data: Partial<User>) => {
  await setDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

export const getUserProfile = async (uid: string) => {
  const d = await getDoc(doc(db, "users", uid));
  return d.exists() ? d.data() as User : null;
};

// Salvar Agendamento
export const saveAppointment = async (appData: Omit<Appointment, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "appointments"), {
      ...appData,
      createdAt: serverTimestamp()
    });
    return { ...appData, id: docRef.id };
  } catch (e) {
    console.error("Erro ao agendar:", e);
    return null;
  }
};

export const saveLead = async (leadData: any) => {
  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...leadData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e) {
    console.error("Erro ao salvar lead:", e);
    throw e;
  }
};

export const getMyAppointments = async (userId: string, role: string) => {
  const field = role === 'PATIENT' ? 'patientId' : 'physicianId';
  const q = query(collection(db, "appointments"), where(field, "==", userId), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
};

export const subscribeToAppointments = (userId: string, role: string, callback: (apps: Appointment[]) => void) => {
  const field = role === 'PATIENT' ? 'patientId' : 'physicianId';
  const q = query(collection(db, "appointments"), where(field, "==", userId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    callback(apps);
  });
};

export const updateGoogleSync = async (uid: string, status: boolean) => {
  await updateDoc(doc(db, "users", uid), { googleCalendarConnected: status });
};
