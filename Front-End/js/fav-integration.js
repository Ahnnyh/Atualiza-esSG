// Front-End/js/fav-integration.js
// Integração dos botões .btn-fav com o sistema de favoritos

import { 
  adicionarFavorito, 
  removerFavorito, 
  isProdutoFavoritoLocal, 
  carregarFavoritosParaCache 
} from './favoritos.js';

import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


// 🔥 ATUALIZA ÍCONES SOMENTE DEPOIS DO FIREBASE CARREGAR O USUÁRIO
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await carregarFavoritosParaCache();   // carrega favoritos do Firestore → cache
    atualizarIconesFavorito();            // deixa o coração vermelho se estiver no cache
  }
});


// 🟢 CAPTURA CLIQUES NOS BOTÕES DE FAVORITAR
document.body.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn-fav');
  if (!btn) return;

  e.preventDefault();

  const produtoId = btn.dataset.id;
  if (!produtoId) {
    console.warn("Botão .btn-fav sem data-id!");
    return;
  }

  // Já é favorito? então remove
  if (isProdutoFavoritoLocal(produtoId)) {
    await removerFavorito(produtoId);
    marcarComoNaoFavorito(btn);
    return;
  }

  // Senão, adiciona — extrai dados do card
  const card = btn.closest('.product-card') 
            || btn.closest('.card') 
            || document.querySelector(`[data-id='${produtoId}']`);

  const nome = card?.querySelector('.nome, h3')?.textContent?.trim()
              || card?.dataset?.name
              || 'Produto';

  const precoText = card?.querySelector('.preco, .packaging-price')?.textContent || '';
  const precoNum = precoText ? parseFloat(precoText.replace(/[^0-9,.-]+/g,"").replace(',', '.')) : null;

  const img = card?.querySelector('img')?.src || null;


  // ⭐⭐⭐ ADICIONADO — informações completas do card:
  const origem = card?.querySelector('.origem')?.textContent?.trim() || null;
  const categoria = card?.dataset?.categoria || null;
  const unidade = precoText.includes("/") ? precoText.split("/")[1].trim() : null;
  const fazenda = origem?.replace('Fazenda ', '') || null;


  // 🔥 ENVIA TUDO AO FAVORITO (sem remover linhas suas)
  await adicionarFavorito({
    produtoId,
    nome_produto: nome,
    preco: precoNum,
    imagem: img,

    // ⭐⭐⭐ Campos adicionados
    origem,
    categoria,
    unidade,
    fazenda
  });

  marcarComoFavorito(btn);
});



// 🔄 Atualiza todos os ícones conforme o cache local
export function atualizarIconesFavorito() {
  document.querySelectorAll('.btn-fav').forEach(btn => {
    const id = btn.dataset.id;
    if (isProdutoFavoritoLocal(id)) marcarComoFavorito(btn);
    else marcarComoNaoFavorito(btn);
  });
}



// ❤️ Deixa o coração vermelho
function marcarComoFavorito(btn) {
  const icon = btn.querySelector('i');
  btn.classList.add("favorito");

  if (icon) {
    icon.classList.remove('fa-regular');
    icon.classList.add('fa-solid');
  }

  // animação opcional
  btn.classList.add("animate");
  setTimeout(() => btn.classList.remove("animate"), 300);
}



// 🤍 Volta o coração para contorno
function marcarComoNaoFavorito(btn) {
  const icon = btn.querySelector('i');
  btn.classList.remove("favorito");

  if (icon) {
    icon.classList.remove('fa-solid');
    icon.classList.add('fa-regular');
    icon.style.color = "";
  }
}
