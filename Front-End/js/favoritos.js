// Front-End/js/favoritos.js
// Gerencia favoritos no Firestore (Opção A - front-end only)
// Requisitos: Front-End/js/firebaseConfig.js deve exportar { auth, db, getSession } (já existe)

// IMPORTS do Firebase (modular v11)
import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
    doc,
    setDoc,
    deleteDoc,
    getDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/*
  Estratégia:
  - Estrutura no Firestore: coleção users/{uid}/favoritos/{produtoId}
  - Cada documento favorito guarda dados básicos: produtoId, nome_produto, preco, imagem, criadoEm
  - Suporte realtime: onSnapshot para atualizar UI quando o usuário adicionar/remover
*/

// Contêiner padrão na página favoritos.html onde lista será renderizada:
// <div id="favoritosContainer"></div>

// Exportamos funções:
// - iniciarFavoritos()  -> inicia listener quando página favoritos.html abrir
// - adicionarFavorito(produtoObj) -> usado pelos botões "curtir" nos cards
// - removerFavorito(produtoId) -> remover pelo id do produto
// - isProdutoFavoritoLocal(produtoId) -> util se quiser marcar ícones ao montar cards

let currentUser = null;
let favoritosCache = new Map(); // produtoId -> docId/obj

// Observa autenticação em todo o site para manter currentUser
onAuthStateChanged(auth, user => {
    if (user) {
        currentUser = user;
        // se estiver na página de favoritos, iniciar o listener (se houver container)
        if (document.getElementById('favoritosContainer')) {
            iniciarFavoritos();
        } else {
            // também podemos carregar a lista de favoritos para marcar corações na montagem do catálogo
            carregarFavoritosParaCache(); // popula favoritosCache
        }
    } else {
        currentUser = null;
        // limpa cache e UI de favoritos
        favoritosCache.clear();
        const favContainer = document.getElementById('favoritosContainer');
        if (favContainer) favContainer.innerHTML = '<p>Faça login para ver seus favoritos.</p>';
        // remove marcações nos botões (se quiser)
    }
});

/* ---------- Função: iniciarFavoritos ---------- 
   Coloque no onload de favoritos.html para renderizar e ouvir mudanças em tempo real.
*/
export function iniciarFavoritos() {
    if (!currentUser) {
        document.getElementById('favoritosContainer').innerHTML = '<p>Faça login para ver seus favoritos.</p>';
        return;
    }

    const colRef = collection(db, `users/${currentUser.uid}/favoritos`);
    const q = query(colRef, orderBy('criadoEm', 'desc'));

    // Escuta realtime
    onSnapshot(q, snapshot => {
        const container = document.getElementById('favoritosContainer');
        if (!container) return;
        container.innerHTML = '';

        if (snapshot.empty) {
            container.innerHTML = '<p>Você ainda não favoritou nenhum produto.</p>';
            favoritosCache.clear();
            return;
        }

        snapshot.docs.forEach(docSnap => {
            const data = docSnap.data();
            const produtoId = String(data.produtoId);
            // Mantém cache: mapa produtoId -> docId
            favoritosCache.set(produtoId, { docId: docSnap.id, data });

            // Renderiza cartão do favorito
            const card = montarCardFavorito(data, produtoId);
            container.appendChild(card);
        });

        // Opcional: adicionar estilo de grade, etc.
    }, err => {
        console.error('Erro ao escutar favoritos:', err);
        const container = document.getElementById('favoritosContainer');
        if (container) container.innerHTML = '<p>Erro ao carregar favoritos.</p>';
    });
}

/* ---------- Função: carregarFavoritosParaCache ----------
   Usa getDocs para popular o cache (sem listener) — útil para páginas que exibem cards (home/catalogo)
*/
export async function carregarFavoritosParaCache() {
    favoritosCache.clear();
    if (!currentUser) return;
    try {
        const colRef = collection(db, `users/${currentUser.uid}/favoritos`);
        const snapshot = await getDocs(colRef);
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            favoritosCache.set(String(data.produtoId), { docId: docSnap.id, data });
        });
    } catch (err) {
        console.error('Erro ao carregar favoritos para cache:', err);
    }
}

/* ---------- Função: adicionarFavorito ----------
   produtoObj deve conter: { produtoId (string|number), nome_produto, preco, imagem (url opcional) }
   Exemplo de uso nos cards: adicionarFavorito({ produtoId: 12, nome_produto: 'Tomate', preco: 7.5, imagem: '/imagens/tomate.png' })
*/
export async function adicionarFavorito(produtoObj) {
    if (!currentUser) return alert('Faça login para favoritar produtos.');

    const produtoId = String(produtoObj.produtoId);
    const docRef = doc(db, `users/${currentUser.uid}/favoritos`, produtoId);

    try {
        await setDoc(docRef, {
            produtoId,
            nome_produto: produtoObj.nome_produto,
            preco: produtoObj.preco,
            imagem: produtoObj.imagem,
            origem: produtoObj.origem,
            categoria: produtoObj.categoria,
            unidade: produtoObj.unidade,
            fazenda: produtoObj.fazenda,
            criadoEm: new Date()
        });

        // irá disparar onSnapshot e atualizar UI automaticamente
    } catch (err) {
        console.error('Erro ao adicionar favorito:', err);
        alert('Erro ao favoritar. Veja o console para detalhes.');
    }
}

/* ---------- Função: removerFavorito ----------
   Remove o doc de favoritos pelo produtoId
*/
export async function removerFavorito(produtoId) {
    if (!currentUser) return;
    const pid = String(produtoId);
    const docRef = doc(db, `users/${currentUser.uid}/favoritos`, pid);
    try {
        await deleteDoc(docRef);
        // onSnapshot atualiza UI
    } catch (err) {
        console.error('Erro ao remover favorito:', err);
        alert('Erro ao remover favorito.');
    }
}

/* ---------- Helper: isProdutoFavoritoLocal ----------
   Retorna true se o produtoId está no cache local
*/
export function isProdutoFavoritoLocal(produtoId) {
    return favoritosCache.has(String(produtoId));
}

/* ---------- Helper: montarCardFavorito (DOM) ----------
   Dom do favorito na página favoritos.html — você pode estilizar com CSS
*/
/* ---------- Helper: montarCardFavorito (DOM) ---------- */
function montarCardFavorito(data, produtoId) {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-fav';
    wrapper.style.position = "relative";
    wrapper.setAttribute("data-id", produtoId);

    // imagem
    const img = document.createElement('img');
    img.src = data.imagem || '/imagens/default.png';
    img.alt = data.nome_produto || 'Produto';

    // info
    const info = document.createElement('div');
    info.className = "info-fav";
    info.innerHTML = `
  <h3>${data.nome_produto}</h3>
  <div class="preco">R$ ${data.preco}</div>
  ${data.unidade ? `<div class="unidade">Unidade: ${data.unidade}</div>` : ''}
  ${data.origem ? `<div class="origem">${data.origem}</div>` : ''}

`;

    // ❤️ botão de favorito - igual ao catálogo
    const btn = document.createElement("button");
    btn.className = "btn-fav favorito"; // já começa preenchido
    btn.setAttribute("data-id", produtoId);
    btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;

    // clicou → remover favorito
    btn.addEventListener("click", async (e) => {
        e.preventDefault();
        await removerFavorito(produtoId);
    });

    wrapper.appendChild(img);
    wrapper.appendChild(info);
    wrapper.appendChild(btn);

    return wrapper;
}
