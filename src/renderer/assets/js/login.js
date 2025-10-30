document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const funcional = document.getElementById('text').value;
    const senha = document.getElementById('password').value;
    const errorMessage = document.getElementById('login-error-message');
    
    try {

        const result = await window.auth.login({ funcional, senha });
        
        if (result.success) {
            window.location.href = 'userPage.html';
            
        } else {
            errorMessage.textContent = result.message || 'Funcional ou senha incorretos.';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        errorMessage.textContent = 'Erro de comunicação com o servidor. Tente novamente.';
        errorMessage.style.display = 'block';
    }
});