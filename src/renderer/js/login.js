// src/renderer/js/login.js

// Espera o conteúdo da página carregar
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const funcionalInput = document.getElementById('text'); 
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('login-error-message');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    const funcional = funcionalInput.value;
    const password = passwordInput.value;

    if (!funcional || !password) {
      showError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Chama a função 'login' do preload.js (via api.js)
      const response = await api.login({ funcional, password });

      if (response.success) {
        // SUCESSO!
        console.log('Login bem-sucedido:', response.user);
        // Redireciona para a página principal
        window.location.href = '../views/userPage.html';
      } else {
        // FALHA
        showError(response.error || 'Credenciais inválidas.');
      }
    } catch (err) {
      console.error('Erro ao tentar fazer login:', err);
      showError('Erro de comunicação com o sistema.');
    }
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }
});