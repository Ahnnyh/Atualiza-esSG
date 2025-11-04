// Front-End/js/login.js
import { auth } from "./firebaseConfig.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin");
  const msg = document.getElementById("msg");
  const esqueceuSenha = document.querySelector(".forgot-password");

  // 🔹 Login com e-mail e senha
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
      msg.textContent = "Preencha todos os campos.";
      msg.style.color = "red";
      return;
    }

    msg.textContent = "Entrando...";
    msg.style.color = "gray";

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      msg.textContent = "Login realizado com sucesso!";
      msg.style.color = "green";

      // 🔹 Salva o login ativo (opcional)
      localStorage.setItem("usuarioLogado", JSON.stringify({
        uid: user.uid,
        email: user.email
      }));

      // 🔹 Redireciona após login para o welcome
      setTimeout(() => {
        window.location.href = "welcome.html"; // 👉 welcome
      }, 1500);
    } catch (error) {
      console.error("Erro de login:", error);
      let mensagemErro = "❌ ";

      switch (error.code) {
        case "auth/user-not-found":
          mensagemErro += "Usuário não encontrado.";
          break;
        case "auth/wrong-password":
          mensagemErro += "Senha incorreta.";
          break;
        case "auth/invalid-email":
          mensagemErro += "Email inválido.";
          break;
        default:
          mensagemErro += "Erro ao fazer login.";
      }

      msg.textContent = mensagemErro;
      msg.style.color = "red";
    }
  });

  // 🔹 Esqueceu a senha
  esqueceuSenha.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = prompt("Digite seu email para redefinir a senha:");
    if (!email) return;

    try {
      await sendPasswordResetEmail(auth, email);
      alert("📧 Email de redefinição de senha enviado!");
    } catch (error) {
      alert("❌ Erro: " + error.message);
    }
  });
});

// ==============================
//  Login com Google 

import { provider, signInWithPopup, db } from "./firebaseConfig.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const googleLoginBtn = document.getElementById("googleLoginBtn");
  if (!googleLoginBtn) return;

  googleLoginBtn.addEventListener("click", async () => {
    try {
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //  Dados básicos do usuário Google
      const userData = {
        uid: user.uid,
        nome: user.displayName || "",
        email: user.email || "",
        foto: user.photoURL || "",
        criadoEm: new Date().toISOString(),
      };

      //  Verifica se já existe no Firestore
      const userRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        //  Já existe → login antigo
        console.log("Usuário já cadastrado, redirecionando para welcome...");
        localStorage.setItem("usuarioGoogle", JSON.stringify(userData));

        window.location.href = "welcome.html";
        setTimeout(() => {
          window.location.href = "home2.html";
        }, 3000);
      } else {
        //  Primeira vez → cria documento e vai para cadastro
        await setDoc(userRef, userData);

        localStorage.setItem("usuarioGoogle", JSON.stringify(userData));
        console.log("Novo usuário Google, redirecionando para cadastro pessoal...");
        window.location.href = "cadastro_pessoal_Google.html";

        //  Depois do cadastro_pessoal.html, ao finalizar:
        // salve `localStorage.setItem("cadastroCompleto", "true");`
        // para que ele vá depois para welcome.html e home2.html
      }
    } catch (error) {
      console.error("Erro no login com Google:", error);
      alert("❌ Erro ao fazer login com o Google. Tente novamente.");
    }
  });
});


