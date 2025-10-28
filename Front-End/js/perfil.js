// js/perfil.js
import { auth, db } from "../js/firebaseConfig.js";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  updatePassword
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const senhaInput = document.getElementById("senha");
const btnSair = document.querySelector(".btn-logout");
const profileName = document.querySelector(".profile-name");

// Verifica login e carrega dados
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  emailInput.value = user.email;
  profileName.textContent = user.displayName || "Usuário";

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
    await setDoc(userRef, {
      nome: user.displayName || "",
      email: user.email
    });
  }

  // 🔹 Salvar alterações
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
      email: user.email // email não editável
    };

    try {
      // Atualiza Firestore
      await setDoc(userRef, dadosAtualizados, { merge: true });
      // Atualiza nome no Auth
      await updateProfile(user, { displayName: dadosAtualizados.nome });

      // Atualiza senha (se preenchida)
      if (senhaInput.value.trim()) {
        await updatePassword(user, senhaInput.value.trim());
        alert("Senha atualizada com sucesso!");
      }

      profileName.textContent = dadosAtualizados.nome || "Usuário";
      alert("✅ Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("❌ Erro ao salvar dados. Tente novamente.");
    }
  });

  // 🔹 Logout
  btnSair.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
});
