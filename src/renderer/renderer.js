// Exemplo em src/renderer/renderer.js (ou um componente de Login)

// Não precisa de 'require' ou 'import'.
// O 'window.api' foi injetado pelo preload.js!

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    // 1. CHAMA A API DO PRELOAD
    const response = await window.api.login({ email, password });

    // 2. O 'response' é o objeto { success: true/false, ... }
    //    retornado pelo seu 'authController'
    if (response.success) {
      console.log('Login bem-sucedido!', response.user);
      // Redireciona para o dashboard
      // window.location.href = 'dashboard.html';
    } else {
      // Mostra o erro (ex: "Senha incorreta.")
      errorMessage.innerText = response.error;
    }
  } catch (err) {
    // Isso pegaria um erro de rede ou um crash do IPC
    console.error('Erro grave no login:', err);
    errorMessage.innerText = 'Erro inesperado no sistema.';
  }
});

// Exemplo de como checar a sessão ao carregar a página
async function checkSessionOnLoad() {
  const response = await window.api.getSession();
  if (response.success && response.user) {
    console.log('Já estava logado:', response.user.nome);
    // Redireciona para o dashboard
  } else {
    console.log('Nenhuma sessão ativa.');
    // Garante que está na tela de login
  }
}

checkSessionOnLoad();