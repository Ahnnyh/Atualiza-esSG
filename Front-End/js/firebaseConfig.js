// Importa as funções necessárias do SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC7aLm7Ztcl7wHC9yvM_5vYULZeUCAUnCA",
  authDomain: "safraago.firebaseapp.com",
  projectId: "safraago",
  storageBucket: "safraago.firebasestorage.app",
  messagingSenderId: "952956524987",
  appId: "1:952956524987:web:282a8a47c1146335c68c9e",
  measurementId: "G-JHCCL31BZF"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o módulo de autenticação
const auth = getAuth(app);

// Exporta para ser usado nos outros arquivos
export { auth };
