import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKE8ERDO7KzeIC8vxn19aG4I42Ww7VyL8",
  authDomain: "codebridge-formulas.firebaseapp.com",
  projectId: "codebridge-formulas",
  storageBucket: "codebridge-formulas.firebasestorage.app",
  messagingSenderId: "931378177213",
  appId: "1:931378177213:web:72ba50087ab2cb8b1783d4",
  measurementId: "G-WYNCT0297V"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;