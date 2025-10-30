// src/renderer/js/userPage.js

// Variável global para armazenar os dados do usuário logado
let currentUser = null;

/**
 * 1. GUARDA DE SEGURANÇA
 * Esta função (IIFE) executa imediatamente para proteger a página.
 */
(async () => {
  try {
    const response = await api.getSession(); // Checa se já existe uma sessão no backend

    if (response.success && response.user) {
      // Usuário está logado
      currentUser = response.user;
      // Agora que sabemos quem é o usuário, podemos inicializar a página
      initializeApp(currentUser);
    } else {
      // Usuário NÃO está logado
      console.warn('Nenhuma sessão encontrada. Redirecionando para o login.');
      window.location.href = 'index.html';
    }
  } catch (err) {
    console.error('Erro fatal ao verificar sessão:', err);
    window.location.href = 'index.html';
  }
})();

/**
 * 2. INICIALIZAÇÃO
 * Esta função só é chamada DEPOIS que a sessão é confirmada.
 * Ela espera o DOM carregar para manipular os elementos.
 */
function initializeApp(user) {
  document.addEventListener('DOMContentLoaded', () => {
    console.log(`Usuário logado: ${user.nome} (Role: ${user.role})`);
    
    // Anexa os eventos principais
    attachGlobalListeners();
    
    // Renderiza informações dinâmicas
    renderUserInfo(user);
    
    // Aplica o Controle de Acesso Baseado em Role (RBAC)
    applyRBAC(user.role);
    
    // Carrega dados iniciais (cursos, avisos, etc.)
    loadInitialData();
  });
}

function attachGlobalListeners() {
  // Evento de Logout
  const logoutButton = document.querySelector('.logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        await api.logout();
        window.location.href = 'index.html';
      } catch (err) {
        console.error('Erro ao fazer logout:', err);
      }
    });
  }

  // Evento do formulário de Registro (se existir)
  const registrationForm = document.querySelector('.registration form');
  if (registrationForm) {
    registrationForm.addEventListener('submit', handleRegistrationSubmit);
  }

  // Evento do formulário de Avisos (se existir)
  const noticeForm = document.getElementById('formNotice');
  if (noticeForm) {
    noticeForm.addEventListener('submit', handleNoticeSubmit);
  }
}

function renderUserInfo(user) {
  // Atualiza o header com o nome do usuário
  const headerTitle = document.querySelector('.header h2');
  if (headerTitle) {
    headerTitle.textContent = `Dashboard - Olá, ${user.nome}!`;
  }
}

/**
 * Aplica o Controle de Acesso (RBAC) - Mostra/Esconde seções
 * Baseado nas roles: 'TI', 'RH', 'Professor'
 */
function applyRBAC(role) {
  const roles = {
    isTI: role === 'TI',
    isRH: role === 'RH',
    isProfessor: role === 'Professor',
  };

  // --- Menu Lateral ---
  // Relatórios: Visível para TI e RH
  if (!roles.isTI && !roles.isRH) {
    document.querySelector('a[href="#relatorios"]')?.closest('a').remove();
  }
  // Configurações: Visível apenas para TI
  if (!roles.isTI) {
    document.querySelector('a[href="#configuracoes"]')?.closest('a').remove();
  }
  
  // --- Seções do Main ---
  // Seção de Registro: Visível apenas para TI
  if (!roles.isTI) {
    document.querySelector('.registration')?.remove();
  }

  // Seção de Mural (Criar Aviso): Visível para TI, RH e Professor
  if (!roles.isTI && !roles.isRH && !roles.isProfessor) {
     document.querySelector('.mural .form-container')?.remove();
  }
  
  // Seção de Gráficos: Visível para TI e RH
  if (!roles.isTI && !roles.isRH) {
    document.querySelector('.charts')?.remove();
    document.querySelector('section.chart')?.remove();
  }

  // Áreas Especiais (conforme seu HTML)
  // Criação de Cursos: Professor
  if (roles.isProfessor) {
    document.getElementById('area-criacao-cursos').style.display = 'block';
  }
  // Atribuição de Professores: TI
  if (roles.isTI) {
    document.getElementById('area-atribuicao-professores').style.display = 'block';
  }
}

/**
 * Carrega dados dinâmicos da API
 */
async function loadInitialData() {
  // Carrega os cursos
  try {
    const response = await api.getAllCourses();
    const container = document.querySelector('.courses-container');
    
    if (response.success && container) {
      if (response.data.length === 0) {
        container.innerHTML = '<p>Nenhum curso encontrado.</p>';
        return;
      }
      
      container.innerHTML = ''; // Limpa o container
      response.data.forEach(course => {
        // Cria o "card" do curso
        const card = document.createElement('div');
        card.className = 'course-card'; // Adicione estilos para .course-card no CSS
        card.innerHTML = `
          <h4>${course.titulo}</h4>
          <p>Carga horária: ${course.carga_horaria || 'N/D'}h</p>
        `;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = `<p style="color: red;">${response.error || 'Não foi possível carregar os cursos.'}</p>`;
    }
  } catch (err) {
    console.error('Erro ao carregar cursos:', err);
  }
  
  // (Aqui você chamaria as funções para carregar avisos, relatórios, etc.)
}

// --- Handlers de Formulário ---

async function handleRegistrationSubmit(e) {
 e.preventDefault();
  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  
  // Pegar dados pelos IDs que definimos no HTML
  const nome = document.getElementById('regNome').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const roleName = document.getElementById('regRole').value;

  if (!nome || !email || !password || !roleName) {
      alert('Por favor, preencha todos os campos.');
      return;
  }
  
  button.disabled = true;
  button.textContent = 'Salvando...';

  try {
    const response = await api.createUser({ nome, email, password, roleName });

    if (response.success) {
      alert('Usuário criado com sucesso!');
      form.reset(); // Limpa o formulário
    } else {
      // Mostra o erro vindo do backend (ex: "Email já em uso")
      alert(`Erro ao salvar: ${response.error}`);
    }
  } catch (err) {
    console.error('Erro ao registrar:', err);
    alert('Erro de comunicação ao registrar usuário.');
  } finally {
    button.disabled = false;
    button.textContent = 'Salvar';
  }
}
