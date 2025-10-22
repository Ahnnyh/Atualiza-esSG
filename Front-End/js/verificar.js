// js/verificar.js - VERSÃO MELHORADA
import { auth } from "./firebaseConfig.js";
import {
  onAuthStateChanged,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnVerificar = document.getElementById("btnVerificar");
  const mensagem = document.getElementById("mensagem");
  const form = document.getElementById("formVerificacao");

  // Verificar estado da autenticação
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Usuário logado:", user.email);
      
      // Se já estiver verificado, redirecionar direto
      if (user.emailVerified) {
        mensagem.textContent = "✅ Seu e-mail já está verificado! Redirecionando para login...";
        mensagem.className = "sucesso";
        
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        mensagem.textContent = "📧 Aguardando verificação do e-mail...";
        mensagem.className = "info";
      }
    } else {
      mensagem.textContent = "❌ Nenhum usuário encontrado. Faça o cadastro novamente.";
      mensagem.className = "erro";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;

    if (!user) {
      mensagem.textContent = "❌ Usuário não encontrado. Faça o cadastro novamente.";
      mensagem.className = "erro";
      window.location.href = "cadastro_pessoal.html";
      return;
    }

    btnVerificar.disabled = true;
    mensagem.textContent = "🔄 Verificando status da verificação...";
    mensagem.className = "info";

    try {
      // Recarregar dados do usuário para verificar status mais recente
      await user.reload();
      const currentUser = auth.currentUser;

      if (currentUser.emailVerified) {
        mensagem.textContent = "✅ E-mail verificado com sucesso! Redirecionando para login...";
        mensagem.className = "sucesso";

        // Limpar dados temporários do localStorage
        localStorage.removeItem("usuarioEmail");
        localStorage.removeItem("usuarioDados");

        setTimeout(() => {
          window.location.href = "login.html";
        }, 2500);
      } else {
        mensagem.textContent = "❌ E-mail ainda não verificado. Verifique sua caixa de entrada e spam.";
        mensagem.className = "erro";
        
        // Adicionar botão para reenviar verificação
        setTimeout(() => {
          const reenviarBtn = document.createElement("button");
          reenviarBtn.textContent = "📧 Reenviar E-mail de Verificação";
          reenviarBtn.className = "btn-reenviar";
          reenviarBtn.style.marginTop = "10px";
          reenviarBtn.onclick = reenviarEmailVerificacao;
          mensagem.appendChild(reenviarBtn);
        }, 1000);
      }
    } catch (error) {
      console.error("Erro:", error);
      mensagem.textContent = "❌ Erro ao verificar: " + error.message;
      mensagem.className = "erro";
    } finally {
      btnVerificar.disabled = false;
    }
  });

  async function reenviarEmailVerificacao() {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await sendEmailVerification(user);
      mensagem.textContent = "📧 E-mail de verificação reenviado! Verifique sua caixa de entrada.";
      mensagem.className = "sucesso";
    } catch (error) {
      mensagem.textContent = "❌ Erro ao reenviar e-mail: " + error.message;
      mensagem.className = "erro";
    }
  }

  // Verificação automática a cada 5 segundos
  setInterval(() => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      user.reload().then(() => {
        if (user.emailVerified) {
          mensagem.textContent = "✅ E-mail verificado com sucesso! Redirecionando...";
          mensagem.className = "sucesso";
          setTimeout(() => {
            window.location.href = "login.html";
          }, 2000);
        }
      });
    }
  }, 5000);
});