// main.js - Arquivo principal JavaScript para SafraGo

// Esperar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    inicializarAplicacao();
});

function inicializarAplicacao() {
    configurarNavegacao();
    configurarChat();
    configurarLogin();
    configurarInteracoes();
}

// ===== NAVEGAÇÃO E ROTEAMENTO =====
function configurarNavegacao() {
    // Navegação do menu inferior
    const menuItems = document.querySelectorAll('.menu-item, .bottom-nav a, .carrinho');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const texto = this.querySelector('span')?.textContent || '';
            navegarPara(texto);
        });
    });

    // Botão de voltar no chat
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }

    // Botão do chat na home
    const chatBtn = document.querySelector('.chat-btn');
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            window.location.href = 'chat.html';
        });
    }

    // Menu hamburguer
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            alert('Menu aberto!'); // Pode ser substituído por um drawer/sidebar real
        });
    }
}

function navegarPara(destino) {
    const rotas = {
        'Home': 'home2.html',
        'Pesquisar': 'pesquisa.html',
        'Favoritos': 'favoritos.html',
        'Perfil': 'perfil.html'
    };

    if (rotas[destino]) {
        window.location.href = rotas[destino];
    } else if (destino === '') {
        // Carrinho - comportamento especial
        abrirCarrinho();
    }
}

function abrirCarrinho() {
    alert('Carrinho aberto!'); // Substituir por modal real do carrinho
    // Exemplo: mostrarModalCarrinho();
}

// ===== FUNCIONALIDADES DO CHAT =====
function configurarChat() {
    const chatInput = document.querySelector('.chat-input input');
    const sendBtn = document.querySelector('.send-btn');

    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', enviarMensagem);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                enviarMensagem();
            }
        });
    }

    // Carregar histórico salvo no localStorage
    carregarHistoricoChat();

    // Se for a primeira vez, mostra mensagem de boas-vindas
    if (!localStorage.getItem('chatIniciado')) {
        setTimeout(() => {
            adicionarMensagem('Olá! Como posso ajudar você hoje?', 'other');
            salvarMensagem('Olá! Como posso ajudar você hoje?', 'other');
            localStorage.setItem('chatIniciado', 'true');
        }, 500);
    }
}

function enviarMensagem() {
    const chatInput = document.querySelector('.chat-input input');
    if (!chatInput || !chatInput.value.trim()) return;

    const texto = chatInput.value.trim();

    // Mensagem do usuário
    adicionarMensagem(texto, 'me');
    salvarMensagem(texto, 'me');

    chatInput.value = '';

    // Resposta simulada do "bot"
    setTimeout(() => {
        const resposta = 'Entendi! Vou verificar isso pra você.';
        adicionarMensagem(resposta, 'other');
        salvarMensagem(resposta, 'other');
    }, 800);
}

function adicionarMensagem(texto, tipo) {
    const chatContainer = document.querySelector('.chat-container');
    if (!chatContainer) return;

    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = `mensagem ${tipo}`;
    
    const hora = new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    mensagemDiv.innerHTML = `
        <div class="bubble">${texto}</div>
        <span class="hora">${hora}</span>
    `;
    
    chatContainer.appendChild(mensagemDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ====== HISTÓRICO DO CHAT ======
function salvarMensagem(texto, tipo) {
    const historico = JSON.parse(localStorage.getItem('chatHistorico')) || [];
    historico.push({ texto, tipo, hora: new Date().toISOString() });
    localStorage.setItem('chatHistorico', JSON.stringify(historico));
}

function carregarHistoricoChat() {
    const historico = JSON.parse(localStorage.getItem('chatHistorico')) || [];
    historico.forEach(msg => {
        adicionarMensagem(msg.texto, msg.tipo);
    });
}


// ===== FUNCIONALIDADES DE LOGIN =====
function configurarLogin() {
    const enterBtn = document.querySelector('.enter-btn');
    const googleBtn = document.querySelector('.google-btn');
    const phoneBtn = document.querySelector('.phone-btn');
    
    if (enterBtn) {
        enterBtn.addEventListener('click', fazerLogin);
    }
    
    if (googleBtn) {
        googleBtn.addEventListener('click', loginGoogle);
    }
    
    if (phoneBtn) {
        phoneBtn.addEventListener('click', loginTelefone);
    }
}

function fazerLogin() {
    const email = document.querySelector('input[type="email"]');
    const senha = document.querySelector('input[type="password"]');
    
    if (!email || !senha) return;
    
    if (!email.value || !senha.value) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Simulação de login
    console.log('Tentativa de login:', email.value);
    
    // Redirecionar para home após "login bem-sucedido"
    setTimeout(() => {
        window.location.href = 'home2.html';
    }, 1000);
}

function loginGoogle() {
    alert('Login com Google selecionado');
    // Implementar autenticação com Google
}

function loginTelefone() {
    alert('Login com Telefone selecionado');
    // Implementar autenticação com telefone
}

// ===== INTERAÇÕES GERAIS =====
function configurarInteracoes() {
    // Favoritar produtos
    const botoesFavorito = document.querySelectorAll('.fa-heart');
    botoesFavorito.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            this.style.color = this.classList.contains('active') ? 'red' : '';
        });
    });

    // Adicionar ao carrinho
    const cardsProduto = document.querySelectorAll('.card');
    cardsProduto.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.fa-heart')) {
                const nome = this.querySelector('.nome').textContent;
                const preco = this.querySelector('.preco').textContent;
                adicionarAoCarrinho(nome, preco);
            }
        });
    });
}

function adicionarAoCarrinho(nome, preco) {
    console.log('Produto adicionado ao carrinho:', nome, preco);
    
    // Feedback visual
    const feedback = document.createElement('div');
    feedback.textContent = `${nome} adicionado ao carrinho!`;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
    `;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

// ===== UTILITÁRIOS =====
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function mostrarLoading() {
    // Implementar loading spinner se necessário
}

function esconderLoading() {
    // Implementar esconder loading
}

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAplicacao);
} else {
    inicializarAplicacao();
}
