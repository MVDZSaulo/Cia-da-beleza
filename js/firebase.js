import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyAqwvfNgFCKno8IYSmOQHual4Ks7tWIO1c",
  authDomain: "cia-da-beleza-beb00.firebaseapp.com",
  projectId: "cia-da-beleza-beb00",
  storageBucket: "cia-da-beleza-beb00.firebasestorage.app",
  messagingSenderId: "567844800760",
  appId: "1:567844800760:web:8f16e64daa0315a9ae130d"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function getUserRole(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data().role;
  }

  return null;
}
