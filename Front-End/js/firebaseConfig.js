// Front-End/js/firebaseConfig.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDFHI6DTyhFeWVOvJiGKB98UvdQIfgUkRU",
  authDomain: "safraagoo.firebaseapp.com",
  projectId: "safraagoo",
  storageBucket: "safraagoo.firebasestorage.app",
  messagingSenderId: "908982428349",
  appId: "1:908982428349:web:8ed044b0c37669f23d4dd4",
  measurementId: "G-F5KR6F0PHG"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

/*
  🔥 Função necessária para o CHAT funcionar
  Retorna o ID Token do Firebase → usado pelo backend PHP
*/
export function getSession() {
    return new Promise(resolve => {
        onAuthStateChanged(auth, async user => {
            if (!user) {
                resolve(null);
                return;
            }

            const token = await user.getIdToken(true);
            resolve({
                uid: user.uid,
                token
            });
        });
    });
}

// Exporta tudo
export { auth, db, provider, signInWithPopup };
