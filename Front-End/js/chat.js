import { getSession } from "./firebaseConfig.js";

const API_URL = "http://localhost/Backend/src/api/chat.php";

async function api(action, data = {}, method = "POST") {
    const session = await getSession();
    if (!session) {
        alert("Faça login!");
        return;
    }

    let options = {
        method,
        headers: {
            "Authorization": "Bearer " + session.token,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    if (method === "POST")
        options.body = new URLSearchParams({ action, ...data });

    const res = await fetch(API_URL + (method === "GET" ? `?action=${action}&` + new URLSearchParams(data) : ""), options);
    return res.json();
}

// LISTAR CONVERSAS (conversas.html)
export async function carregarConversas() {
    const r = await api("list_conversations", {}, "GET");
    return r.conversations;
}

// ABRIR CONVERSA (chat.html)
export async function carregarMensagens(conversaId) {
    const r = await api("get_messages", { conversa_id: conversaId }, "GET");
    return r.messages;
}

// ENVIAR MENSAGEM
export async function enviarMensagem(conversaId, destUid, texto) {
    return api("send_message", {
        conversa_id: conversaId,
        destinatario_uid: destUid,
        mensagem: texto
    });
}

// CRIAR CONVERSA A PARTIR DE UM PRODUTO (catalogo.html)
export async function iniciarConversa(compradorUid, vendedorUid, produtoId) {
    const r = await api("get_or_create_conversation", {
        comprador_uid: compradorUid,
        vendedor_uid: vendedorUid,
        produto_id: produtoId
    });
    return r.conversation_id;
}
