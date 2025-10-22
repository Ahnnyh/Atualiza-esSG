// js/perfil.js
import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const emailEl = document.getElementById("emailUsuario");
const btnSair = document.getElementById("logout");

onAuthStateChanged(auth, (user) => {
  if (user) {
    emailEl.textContent = user.email + (user.emailVerified ? " ✅" : " (não verificado)");
  } else {
    // se o usuário não estiver logado, volta para o login
    window.location.href = "login.html";
  }
});

btnSair.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
