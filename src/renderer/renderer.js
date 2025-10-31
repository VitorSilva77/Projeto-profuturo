const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value;
  const password = passwordInput.value;

  try {

    const response = await window.api.login({ email, password });

    if (response.success) {
      console.log('Login bem-sucedido!', response.user);

    } else {

      errorMessage.innerText = response.error;
    }
  } catch (err) {
    console.error('Erro grave no login:', err);
    errorMessage.innerText = 'Erro inesperado no sistema.';
  }
});

async function checkSessionOnLoad() {
  const response = await window.api.getSession();
  if (response.success && response.user) {
    console.log('Já estava logado:', response.user.nome);
  } else {
    console.log('Nenhuma sessão ativa.');
  }
}

checkSessionOnLoad();