document.addEventListener('DOMContentLoaded', () => {

  (function checkSessionOnLogin() {
    try {
      const storedUser = localStorage.getItem('profuturo_currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user && user.id) {
          console.log('LOGIN.JS: Sessão ativa encontrada. Redirecionando para userPage...');
          window.location.href = '../views/userPage.html';
        } else {

          localStorage.removeItem('profuturo_currentUser');
        }
      }

    } catch (e) {
      console.warn('Limpando sessão corrompida do localStorage.');
      localStorage.removeItem('profuturo_currentUser');
    }
  })();

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
        localStorage.setItem('profuturo_currentUser', userString);

        console.log('LOGIN.JS: Usuário salvo no localStorage:', userString);
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