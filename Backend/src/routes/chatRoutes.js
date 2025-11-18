const express = require("express");
const auth = require("../middleware/authMiddleware");
const { criarOuBuscarConversa, listarConversas } = require("../models/ConversaModel");
const { enviarMensagem, carregarMensagens } = require("../models/MensagemModel");

const router = express.Router();

// Criar conversa ou retornar existente
router.post("/conversa", auth, async (req, res) => {
    const { comprador_uid, vendedor_uid, produto_id } = req.body;
    try {
        const id = await criarOuBuscarConversa(comprador_uid, vendedor_uid, produto_id);
        res.json({ conversation_id: id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Enviar mensagem
router.post("/mensagem", auth, async (req, res) => {
    const { conversa_id, destinatario_uid, mensagem } = req.body;

    try {
        await enviarMensagem(conversa_id, req.user.uid, destinatario_uid, mensagem);
        const msgs = await carregarMensagens(conversa_id);
        res.json({ messages: msgs });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Listar mensagens
router.get("/mensagem/:id", auth, async (req, res) => {
    try {
        const msgs = await carregarMensagens(req.params.id);
        res.json({ messages: msgs });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Listar conversas
router.get("/conversas", auth, async (req, res) => {
    try {
        const conversas = await listarConversas(req.user.uid);
        res.json({ conversations: conversas });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
