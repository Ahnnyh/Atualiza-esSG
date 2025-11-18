import db from "../config/db.js";

export async function enviarMensagem(conversaId, remetente, destinatario, mensagem) {
    await db.query(
        "INSERT INTO mensagens (conversa_id, remetente_uid, destinatario_uid, mensagem) VALUES (?,?,?,?)",
        [conversaId, remetente, destinatario, mensagem]
    );

    await db.query(
        "UPDATE conversas SET ultima_msg=?, atualizada_em=NOW() WHERE id=?",
        [mensagem, conversaId]
    );
}

export async function carregarMensagens(conversaId) {
    const [rows] = await db.query(
        "SELECT * FROM mensagens WHERE conversa_id=? ORDER BY enviada_em ASC",
        [conversaId]
    );
    return rows;
}
