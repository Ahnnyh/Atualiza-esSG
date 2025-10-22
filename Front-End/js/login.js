// js/login.js
import { auth } from "./firebaseConfig.js";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const form = document.getElementById("formLogin");
const msg = document.getElementById("msg");
const esqueceuSenha = document.querySelector(".forgot-password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  if (!email || !senha) {
    msg.textContent = "❌ Preencha todos os campos";
    return;
  }

  msg.textContent = "Entrando...";

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    if (!user.emailVerified) {
      msg.textContent = "⚠️ Verifique seu email antes de continuar.";
      
      // Oferecer reenviar verificação
      setTimeout(() => {
        const reenviar = confirm("Deseja reenviar o email de verificação?");
        if (reenviar) {
          sendEmailVerification(user);
          alert("📧 Email de verificação reenviado!");
        }
      }, 1000);
      return;
    }

    msg.textContent = "✅ Login realizado! Redirecionando...";
    
    setTimeout(() => {
      window.location.href = "perfil.html";
    }, 1500);

  } catch (error) {
    console.error(error);
    let mensagemErro = "❌ Erro: ";
    
    switch(error.code) {
      case 'auth/user-not-found':
        mensagemErro += "Usuário não encontrado";
        break;
      case 'auth/wrong-password':
        mensagemErro += "Senha incorreta";
        break;
      case 'auth/invalid-email':
        mensagemErro += "Email inválido";
        break;
      default:
        mensagemErro += error.message;
    }
    
    msg.textContent = mensagemErro;
  }
});

// Esqueceu senha
esqueceuSenha.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = prompt("Digite seu email para redefinir a senha:");
  
  if (email) {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("📧 Email de redefinição de senha enviado!");
    } catch (error) {
      alert("❌ Erro: " + error.message);
    }
  }
});