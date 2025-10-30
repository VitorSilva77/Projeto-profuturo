let currentUser = null;

/**
 * 1. GUARDA DE SEGURANÇA
 * Esta função (IIFE) executa imediatamente para proteger a página.
 */
(async () => {
  try {
    const response = await api.getSession(); 

    if (response.success && response.user) {
      currentUser = response.user;
      initializeApp(currentUser);
    } else {
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
    
    attachGlobalListeners();
    renderUserInfo(user);
    applyRBAC(user.role);
    
    // Inicia o carregamento de todo o conteúdo dinâmico da página
    loadPageContent();
  });
}

/**
 * 3. ORQUESTRADOR DE CONTEÚDO
 * Chama as funções para carregar as diferentes partes da página.
 */
async function loadPageContent() {
  // Primeiro, carrega os cards dos cursos e configura os eventos de clique
  await loadCourseCards();
  // Em seguida, carrega os dados do dashboard (gráficos, etc.) para "Todos os Cursos"
  await loadDashboardData();
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
  if (!roles.isTI && !roles.isRH) {
    document.querySelector('a[href="#relatorios"]')?.closest('a').remove();
  }
  if (!roles.isTI) {
    document.querySelector('a[href="#configuracoes"]')?.closest('a').remove();
  }
  
  // --- Seções Principais ---
  if (!roles.isTI) {
    document.querySelector('.registration')?.remove();
  }
  if (!roles.isTI && !roles.isRH && !roles.isProfessor) {
     document.querySelector('.mural .form-container')?.remove();
  }
  if (!roles.isTI && !roles.isRH) {
    document.querySelector('.charts')?.remove();
    document.querySelector('section.chart')?.remove();
  }

  // Áreas Especiais (conforme seu HTML)
  if (roles.isProfessor) {
    const area = document.getElementById('area-criacao-cursos');
    if (area) area.style.display = 'block';
  }
  if (roles.isTI) {
    const area = document.getElementById('area-atribuicao-professores');
    if (area) area.style.display = 'block';
  }
}

/**
 * Carrega os cards dos cursos na tela, respeitando as permissões do usuário.
 */
async function loadCourseCards() {
  const container = document.querySelector('.courses-container');
  if (!container) return;

  try {
    let response;
    // A lógica de permissão original foi mantida aqui
    if (currentUser && currentUser.role === 'Professor') {
      response = await api.getCoursesByProfessor(currentUser.id);
    } else {
      response = await api.getAllCourses();
    }

    if (response.success) {
      if (response.data.length === 0) {
        container.innerHTML = '<p>Nenhum curso encontrado.</p>';
        return;
      }
      
      container.innerHTML = ''; // Limpa o container
      response.data.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card'; 
        card.dataset.courseId = course.id; // Adiciona o ID do curso ao elemento
        card.innerHTML = `
          <h4>${course.titulo}</h4>
          <p>Carga horária: ${course.carga_horaria || 'N/D'}h</p>
        `;
        container.appendChild(card);
      });
      
      // Após criar os cards, configura os eventos de clique neles
      setupCourseSelection();
    } else {
      container.innerHTML = `<p style="color: red;">${response.error || 'Não foi possível carregar os cursos.'}</p>`;
    }
  } catch (err) {
    console.error('Erro ao carregar cursos:', err);
    container.innerHTML = '<p style="color: red;">Erro de comunicação ao buscar os cursos.</p>';
  }
}

/**
 * Adiciona os eventos de clique aos cards de curso para seleção.
 */
function setupCourseSelection() {
    const courseCards = document.querySelectorAll('.course-card');

    courseCards.forEach(card => {
        card.addEventListener('click', () => {
            const isAlreadySelected = card.classList.contains('selected');
            
            // Primeiro, remove a seleção de todos os cards
            courseCards.forEach(c => c.classList.remove('selected'));

            if (isAlreadySelected) {
                // Se o card clicado já estava selecionado, ele é desmarcado.
                // Carregamos os dados de TODOS os cursos.
                loadDashboardData(); // Chama sem ID
            } else {
                // Se não estava selecionado, o marcamos.
                card.classList.add('selected');
                const courseId = card.dataset.courseId;
                // Carregamos os dados apenas para o curso selecionado.
                loadDashboardData(courseId);
            }
        });
    });
}

/**
 * Carrega os dados do dashboard (gráficos, relatórios, etc.).
 * @param {string|null} courseId - O ID do curso para filtrar. Se for nulo, carrega dados de todos os cursos.
 */
async function loadDashboardData(courseId = null) {
    console.log(`Carregando dados do dashboard para o curso: ${courseId || 'Todos'}`);
    
    // TODO: Implementar a lógica para buscar dados da API e renderizar os gráficos.
    // Exemplo:
    // const reportData = await api.getReportData({ courseId: courseId });
    // renderCharts(reportData); // Sua função que desenha os gráficos
    
    // Exemplo visual para feedback:
    const chartSection = document.querySelector('section.chart');
    if (chartSection) {
        const title = chartSection.querySelector('.section-title');
        if (title) {
            title.textContent = courseId ? `Relatórios do Curso Selecionado` : 'Relatórios Gerais';
        }
    }
}

// --- Handlers de Formulário ---

async function handleRegistrationSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  
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
      form.reset();
    } else {
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