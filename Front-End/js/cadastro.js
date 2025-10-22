// js/cadastro.js - NOVA VERSÃO PARA CADASTRO PESSOAL
import { auth } from "./firebaseConfig.js";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const arrowButton = document.querySelector(".arrow-button");

  if (!form) {
    console.error("❌ Formulário não encontrado!");
    return;
  }

  // Adicionar máscaras aos campos
  const cpfInput = document.getElementById("cpf");
  const telefoneInput = document.getElementById("telefone");
  const cepInput = document.getElementById("cep");

  if (cpfInput) {
    cpfInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2')
                     .replace(/(\d{3})(\d)/, '$1.$2')
                     .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
      }
    });
  }

  if (telefoneInput) {
    telefoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2')
                     .replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
      }
    });
  }

  if (cepInput) {
    cepInput.addEventListener("input", async (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 8) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
      }

      // Buscar CEP automaticamente
      if (value.replace(/\D/g, '').length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${value.replace(/\D/g, '')}/json/`);
          const data = await response.json();
          
          if (!data.erro) {
            document.getElementById("endereco").value = data.logradouro || '';
            document.getElementById("bairro").value = data.bairro || '';
            document.getElementById("cidade").value = data.localidade || '';
            document.getElementById("uf").value = data.uf || '';
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
        }
      }
    });
  }

  // Evento do botão de próxima tela
  arrowButton.addEventListener("click", async (e) => {
    e.preventDefault();

    // Coletar dados do formulário
    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cep = document.getElementById("cep").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const uf = document.getElementById("uf").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const bairro = document.getElementById("bairro").value.trim();
    const complemento = document.getElementById("complemento").value.trim();

    // Validação básica
    if (!nome || !email || !cpf) {
      alert("Por favor, preencha pelo menos nome, email e CPF.");
      return;
    }

    if (cpf.replace(/\D/g, '').length !== 11) {
      alert("CPF deve ter 11 dígitos.");
      return;
    }

    // Salvar dados no localStorage para usar na próxima tela
    const userData = {
      nome: `${nome} ${sobrenome}`,
      email,
      cpf,
      telefone,
      cep,
      cidade,
      uf,
      endereco,
      numero,
      bairro,
      complemento
    };

    localStorage.setItem("usuarioDados", JSON.stringify(userData));
    localStorage.setItem("usuarioEmail", email);

    // Redirecionar para tela de senha
    window.location.href = "cadastro_senha.html";
  });
});