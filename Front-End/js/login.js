// URL base da sua API
const API_URL = 'http://localhost:3000'; 

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const errorMessage = document.getElementById('errorMessage');

    // Verifica se os elementos necessários existem na página
    if (!loginBtn || !emailInput || !senhaInput || !errorMessage) {
        console.error('Elementos de login não encontrados no DOM.');
        return;
    }

    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário
        
        const email = emailInput.value;
        const senha = senhaInput.value;

        errorMessage.style.display = 'none'; // Esconde erros anteriores
        loginBtn.textContent = 'Entrando...';
        loginBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if (response.ok) {
                // Login bem-sucedido
                const { id_usuario, nome, tipo_usuario } = data.usuario;
                
                // 1. Armazenar dados na sessão/localStorage
                localStorage.setItem('user_id', id_usuario);
                localStorage.setItem('user_name', nome);
                localStorage.setItem('user_type', tipo_usuario);
                
                // 2. Redirecionar baseado no tipo de usuário
                if (tipo_usuario === 'P') {
                    // Produtor (P) / Vendedor
                    window.location.href = 'tela7_perfil_vendedor.html'; 
                } else if (tipo_usuario === 'C') {
                    // Comprador (C)
                    window.location.href = 'home2.html'; 
                } else {
                    // Tipo desconhecido ou não definido (fallback)
                    console.warn('Tipo de usuário desconhecido:', tipo_usuario);
                    window.location.href = 'home2.html'; 
                }

            } else {
                // Login falhou (401 Credenciais Inválidas ou 400 Campos Faltando)
                errorMessage.textContent = data.erro || 'Ocorreu um erro no login. Tente novamente.';
                errorMessage.style.display = 'block';
            }

        } catch (error) {
            console.error('Erro de rede ou servidor:', error);
            errorMessage.textContent = 'Falha na comunicação com o servidor. Verifique a conexão. (Certifique-se que o backend está rodando em http://localhost:3000)';
            errorMessage.style.display = 'block';
        } finally {
            loginBtn.textContent = 'Entrar';
            loginBtn.disabled = false;
        }
    });
});
