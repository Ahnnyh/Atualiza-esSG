// home-auth.js
import { auth } from "./firebaseConfig.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

console.log("✅ home-auth.js carregado. Aguardando autenticação...");

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ Usuário autenticado:", user.email);

    // Aqui antes mostrava a mensagem de boas-vindas
    // Agora deixamos a página carregar normalmente
  } else {
    console.log("❌ Nenhum usuário autenticado. Redirecionando para login...");
    window.location.href = "login.html";
  }
});

// 🔹 Botão de sair (caso exista na página)
const btnLogout = document.getElementById("logoutBtn");
if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}
