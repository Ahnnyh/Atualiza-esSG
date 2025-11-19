// Front-End/js/controle-favoritos.js
import { auth, db } from "./firebaseConfig.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

let isVendedor = false;

// ⬇️ Exportar para fav-integration.js
export { isVendedor };

auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  try {
    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      console.warn("Documento do usuário não encontrado.");
      return;
    }

    const dados = snap.data();

    // campo correto no seu Firestore:
    const tipo = (dados.tipoUsuario || "").toLowerCase().trim();

    console.log("Tipo de usuário carregado:", tipo);

    isVendedor = tipo === "vendedor";

    if (isVendedor) {
      removerFavoritosDoDOM();

      // remove corações que aparecerem depois (dinamicamente)
      const observer = new MutationObserver(() => removerFavoritosDoDOM());
      observer.observe(document.body, { childList: true, subtree: true });
    }

  } catch (err) {
    console.error("Erro ao buscar tipo de usuário:", err);
  }
});

function removerFavoritosDoDOM() {
  document.querySelectorAll(".btn-fav").forEach(btn => btn.remove());
}
