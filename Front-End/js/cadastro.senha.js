// js/cadastro_senha.js - VERSÃO CORRIGIDA
import { auth } from "./firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formSenha");
  const mensagem = document.getElementById("msg");

  console.log("🔍 Procurando formulário...");
  console.log("Formulário encontrado:", form);
  console.log("Elemento de mensagem:", mensagem);

  if (!form) {
    console.error("❌ Formulário não encontrado! Verifique se o ID 'formSenha' existe no HTML.");
    
    // Tentar encontrar formulário de outra forma
    const formAlternativo = document.querySelector("form");
    console.log("Formulário alternativo:", formAlternativo);
    
    if (!formAlternativo) {
      alert("Erro: Formulário não encontrado. Contate o suporte.");
      return;
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("✅ Formulário submetido!");

    const senha = document.getElementById("senha").value.trim();
    const confirmar = document.getElementById("confirmarSenha").value.trim();

    console.log("Senha:", senha);
    console.log("Confirmar:", confirmar);

    if (!senha || !confirmar) {
      mostrarMensagem("Preencha todos os campos.", "erro");
      return;
    }

    if (senha.length < 6) {
      mostrarMensagem("A senha deve ter pelo menos 6 caracteres.", "erro");
      return;
    }

    if (senha !== confirmar) {
      mostrarMensagem("As senhas não coincidem!", "erro");
      return;
    }

    const email = localStorage.getItem("usuarioEmail");
    const userData = localStorage.getItem("usuarioDados");

    console.log("Email do localStorage:", email);
    console.log("Dados do usuário:", userData);

    if (!email) {
      mostrarMensagem("E-mail não encontrado. Volte e refaça o cadastro.", "erro");
      setTimeout(() => {
        window.location.href = "cadastro_pessoal.html";
      }, 2000);
      return;
    }

    try {
      mostrarMensagem("Criando sua conta...", "info");

      // ✅ Cria usuário no Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      console.log("✅ Usuário criado:", user.email);

      // ✅ Atualizar perfil com nome completo se existir
      if (userData) {
        try {
          const dados = JSON.parse(userData);
          await updateProfile(user, {
            displayName: dados.nome
          });
          console.log("✅ Perfil atualizado com nome:", dados.nome);
        } catch (profileError) {
          console.error("Erro ao atualizar perfil:", profileError);
        }
      }

      // ✅ Enviar e-mail de verificação
      await sendEmailVerification(user);
      console.log("✅ Email de verificação enviado");
      
      mostrarMensagem("📧 Um e-mail de verificação foi enviado para você. Redirecionando...", "sucesso");

      // ✅ Redirecionar para a página de verificação após 2 segundos
      setTimeout(() => {
        console.log("🔄 Redirecionando para verificar.html");
        window.location.href = "verificar.html";
      }, 2000);

    } catch (error) {
      console.error("❌ Erro no cadastro:", error);
      let mensagemErro = "Erro ao criar conta: ";
      
      switch(error.code) {
        case 'auth/email-already-in-use':
          mensagemErro = "Este e-mail já está em uso. Tente fazer login.";
          break;
        case 'auth/invalid-email':
          mensagemErro = "E-mail inválido.";
          break;
        case 'auth/weak-password':
          mensagemErro = "Senha muito fraca. Use pelo menos 6 caracteres.";
          break;
        case 'auth/network-request-failed':
          mensagemErro = "Erro de conexão. Verifique sua internet.";
          break;
        default:
          mensagemErro = error.message;
      }
      
      mostrarMensagem(mensagemErro, "erro");
    }
  });

  function mostrarMensagem(texto, tipo) {
    console.log(`Mensagem [${tipo}]:`, texto);
    
    if (mensagem) {
      mensagem.textContent = texto;
      mensagem.className = `mensagem ${tipo}`;
      
      // Estilos inline como fallback
      if (tipo === 'sucesso') {
        mensagem.style.backgroundColor = '#d4edda';
        mensagem.style.color = '#155724';
        mensagem.style.padding = '10px';
        mensagem.style.borderRadius = '5px';
        mensagem.style.margin = '10px 0';
      } else if (tipo === 'erro') {
        mensagem.style.backgroundColor = '#f8d7da';
        mensagem.style.color = '#721c24';
        mensagem.style.padding = '10px';
        mensagem.style.borderRadius = '5px';
        mensagem.style.margin = '10px 0';
      } else {
        mensagem.style.backgroundColor = '#d1ecf1';
        mensagem.style.color = '#0c5460';
        mensagem.style.padding = '10px';
        mensagem.style.borderRadius = '5px';
        mensagem.style.margin = '10px 0';
      }
    } else {
      // Fallback se o elemento msg não existir
      alert(texto);
    }
  }

  // Debug: verificar se todos os elementos estão carregados
  console.log("Elemento senha:", document.getElementById("senha"));
  console.log("Elemento confirmarSenha:", document.getElementById("confirmarSenha"));
});