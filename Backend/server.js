// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares Globais ---
app.use(cors());
app.use(express.json());

const db = require('./src/config/db');

// Teste de conexão
app.get('/testar-conexao', async (req, res) => {
    try {
        await db.query('SELECT 1 + 1 AS solution'); 
        res.send('Conexão com o MySQL bem-sucedida!');
    } catch (error) {
        console.error('Erro de conexão com o banco de dados:', error.message);
        res.status(500).send('ERRO: Falha na conexão com o MySQL.');
    }
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../Front-End/front')));
app.use('/js', express.static(path.join(__dirname, '../Front-End/js')));
app.use('/imagens', express.static(path.join(__dirname, '../Front-End/imagens')));

// Página inicial → login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Front-End/front/login.html'));
});

// --- Rotas da API ---
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/usuarios', require('./src/routes/usuarioRoutes')); 
app.use('/api/produtos', require('./src/routes/produtoRoutes')); 
app.use('/api/compradores', require('./src/routes/compradorRoutes')); 
app.use('/api/produtores', require('./src/routes/produtorRoutes')); 
app.use('/api/mensagens', require('./src/routes/mensagemRoutes')); 
app.use('/api/favoritos', require('./src/routes/favoritoRoutes'));

// --- Rotas do chat ---
const chatRoutes = require("./src/routes/chatRoutes");
app.use("/chat", chatRoutes);

// --- Inicialização do servidor ---
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
