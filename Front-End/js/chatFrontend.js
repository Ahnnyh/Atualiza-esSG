import { carregarMensagens, enviarMensagem } from "./chat.js";
import { getSession } from "./firebaseConfig.js";

const params = new URLSearchParams(location.search);
const conversaId = params.get("id");
const destUid = params.get("dest");
const box = document.getElementById("mensagens");

// Validar parâmetros
if (!conversaId || !destUid) {
    box.innerHTML = "<p style='padding:20px;'>Erro: conversa ou destinatário não definido.</p>";
    throw new Error("Parâmetros ausentes");
}

async function atualizar() {
    try {
        const session = await getSession();
        if (!session || !session.token) return;

        const msgs = await carregarMensagens(conversaId, session.token);
        if (!msgs || !Array.isArray(msgs)) return;

        const meuUid = session.uid;
        box.innerHTML = "";

        msgs.forEach(m => {
            const div = document.createElement("div");
            div.classList.add("msg");
            const nome = m.remetente_uid === meuUid ? "Você" : m.remetente_uid;
            div.innerHTML = `<p><b>${nome}:</b> ${m.mensagem}</p>`;
            box.appendChild(div);
        });

        box.scrollTop = box.scrollHeight;
    } catch (err) {
        console.error("Erro ao atualizar chat:", err);
    }
}

atualizar();
setInterval(atualizar, 1500);

document.getElementById("sendBtn").onclick = async () => {
    const input = document.getElementById("msg");
    const texto = input.value.trim();
    if (!texto) return;

    const session = await getSession();
    if (!session || !session.token) return;

    await enviarMensagem(conversaId, destUid, texto, session.token);
    input.value = "";
    atualizar();
};
