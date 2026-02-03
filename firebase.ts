
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// PLACEHOLDER CONFIG - Replace with real values for production
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/*
FIRESTORE SECURITY RULES (Recommendation):
service cloud.firestore {
  match /databases/{database}/documents {
    match /leads/{lead} {
      allow create: if request.resource.data.name.size() > 0 
                    && request.resource.data.whatsapp.size() >= 8;
      allow read, update, delete: if false;
    }
  }
}
*/

export const saveLead = async (leadData: any) => {
  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...leadData,
      source: "landing",
      createdAt: serverTimestamp()
    });
    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};
