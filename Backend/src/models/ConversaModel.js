import db from "../config/db.js";

export async function criarOuBuscarConversa(compradorUid, vendedorUid, produtoId) {
    const [rows] = await db.query(
        "SELECT id FROM conversas WHERE comprador_uid=? AND vendedor_uid=? AND produto_id=?",
        [compradorUid, vendedorUid, produtoId]
    );

    if (rows.length > 0) return rows[0].id;

    const [result] = await db.query(
        "INSERT INTO conversas (comprador_uid, vendedor_uid, produto_id, atualizada_em) VALUES (?,?,?,NOW())",
        [compradorUid, vendedorUid, produtoId]
    );

    return result.insertId;
}

export async function listarConversas(uid) {
    const [rows] = await db.query(
        "SELECT * FROM conversas WHERE comprador_uid=? OR vendedor_uid=? ORDER BY atualizada_em DESC",
        [uid, uid]
    );
    return rows;
}
