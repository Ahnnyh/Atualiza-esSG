// src/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const UsuarioModel = require('../models/UsuarioModel');

// Login 
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
        }

        // 1. Buscar usuário pelo email
        const usuario = await UsuarioModel.buscarPorEmail(email);

        if (!usuario) {
            return res.status(401).json({ mensagem: 'Usuário não encontrado.' });
        }

        // 2. Comparar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Senha incorreta.' });
        }

        // 3. Retornar dados do usuário
        res.json({
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email,
                tipo_usuario: usuario.tipo_usuario
            }
        });
    } catch (erro) {
        console.error('Erro no login:', erro);
        res.status(500).json({ mensagem: 'Erro no servidor durante login.' });
    }
});

module.exports = router;
