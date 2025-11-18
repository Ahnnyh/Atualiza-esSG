const API_URL = "http://localhost:3000/chat";

// Carregar mensagens
export async function carregarMensagens(conversaId, token) {
    const res = await fetch(`${API_URL}/mensagem/${conversaId}`, {
        headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) {
        console.error("Erro ao carregar mensagens:", res.status);
        return [];
    }

    const data = await res.json();
    return data.messages;
}

// Enviar mensagem
export async function enviarMensagem(conversaId, destUid, texto, token) {
    const res = await fetch(`${API_URL}/mensagem`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            conversa_id: conversaId,
            destinatario_uid: destUid,
            mensagem: texto
        })
    });

    if (!res.ok) {
        console.error("Erro ao enviar mensagem:", res.status);
    }
}
