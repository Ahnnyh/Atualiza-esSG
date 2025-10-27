// js/perfil.js
import { auth } from "../js/firebaseConfig.js";
import {
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const db = getFirestore();

// Elementos da página
const form = document.querySelector(".profile-form");
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const cpfInput = document.getElementById("cpf_cnpj");
const telefoneInput = document.getElementById("telefone");
const enderecoInput = document.getElementById("endereco");
const numeroInput = document.getElementById("numero");
const cidadeInput = document.getElementById("cidade");
const cepInput = document.getElementById("cep");
const btnSair = document.querySelector(".btn-logout");
const profileName = document.querySelector(".profile-name");

// --- Verifica se o usuário está logado ---
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  console.log("Usuário logado:", user.email);
  emailInput.value = user.email;

  // Busca dados no Firestore
  const userRef = doc(db, "usuarios", user.uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const dados = docSnap.data();

    nomeInput.value = dados.nome || "";
    cpfInput.value = dados.cpf_cnpj || "";
    telefoneInput.value = dados.telefone || "";
    enderecoInput.value = dados.endereco || "";
    numeroInput.value = dados.numero || "";
    cidadeInput.value = dados.cidade || "";
    cepInput.value = dados.cep || "";

    profileName.textContent = dados.nome || "Usuário";
  } else {
    console.log("⚠️ Nenhum dado encontrado para este usuário.");
    profileName.textContent = user.displayName || user.email.split("@")[0];
  }

  // Evento de salvar alterações
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dadosAtualizados = {
      nome: nomeInput.value.trim(),
      cpf_cnpj: cpfInput.value.trim(),
      telefone: telefoneInput.value.trim(),
      endereco: enderecoInput.value.trim(),
      numero: numeroInput.value.trim(),
      cidade: cidadeInput.value.trim(),
      cep: cepInput.value.trim(),
      email: user.email
    };

    try {
      await setDoc(userRef, dadosAtualizados, { merge: true });
      await updateProfile(user, { displayName: dadosAtualizados.nome });
      alert("✅ Dados atualizados com sucesso!");
      profileName.textContent = dadosAtualizados.nome || "Usuário";
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("❌ Erro ao salvar dados. Tente novamente.");
    }
  });

  // Logout
  btnSair.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
});
