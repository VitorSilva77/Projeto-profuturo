document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const funcionalInput = document.getElementById('text'); 
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('login-error-message');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const funcional = funcionalInput.value;
    const password = passwordInput.value;

    if (!funcional || !password) {
      showError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await api.login({ funcional, password });

      if (response.success) {
        console.log('LOGIN.JS: Login bem-sucedido, dados do usuário:', response.user); 
        
        const userString = JSON.stringify(response.user);
        sessionStorage.setItem('profuturo_currentUser', userString);

        console.log('LOGIN.JS: Usuário salvo no sessionStorage:', userString);
        window.location.href = '../views/userPage.html';
      } else {

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