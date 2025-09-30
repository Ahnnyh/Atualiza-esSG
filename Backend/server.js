const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares Globais ---

app.use(cors());
app.use(express.json());

const db = require('./src/config/db');

app.get('/testar-conexao', async (req, res) => {
    try {
        // Tenta executar uma consulta simples no banco de dados
        await db.query('SELECT 1 + 1 AS solution'); 
        res.send('Conexão com o MySQL bem-sucedida!');
    } catch (error) {
        console.error('Erro de conexão com o banco de dados:', error.message);
        res.status(500).send('ERRO: Falha na conexão com o MySQL. Verifique as credenciais no .env.');
    }
});

// --- Rotas da API ---

// Rota de Usuários
app.use('/api/usuarios', require('./src/routes/usuarioRoutes')); 

// Rota de Produtos
app.use('/api/produtos', require('./src/routes/produtoRoutes')); 

// Rota de Compradores
app.use('/api/compradores', require('./src/routes/compradorRoutes')); 

// Rota de Produtores
app.use('/api/produtores', require('./src/routes/produtorRoutes')); 

// Rota de Mensagens
app.use('/api/mensagens', require('./src/routes/mensagemRoutes')); 

// Rota de Favoritos
app.use('/api/favoritos', require('./src/routes/favoritoRoutes')); 


// --- Inicialização do Servidor ---

app.listen(PORT, () => {
    console.log(`\nServidor rodando em http://localhost:${PORT}`);
    console.log(`--- Endpoints CRUD ---`);
    console.log(`Usuários: http://localhost:${PORT}/api/usuarios`);
    console.log(`Produtos: http://localhost:${PORT}/api/produtos`);
    console.log(`Compradores: http://localhost:${PORT}/api/compradores`);
    console.log(`Produtores: http://localhost:${PORT}/api/produtores`);
    console.log(`Mensagens: http://localhost:${PORT}/api/mensagens`);
    console.log(`Favoritos: http://localhost:${PORT}/api/favoritos`);
});
