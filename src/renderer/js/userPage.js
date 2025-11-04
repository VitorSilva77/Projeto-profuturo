let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  
  try {
    const storedUser = localStorage.getItem('profuturo_currentUser');
    console.log('USERPAGE.JS: Valor lido do localStorage:', storedUser);

    if (storedUser) {
      currentUser = JSON.parse(storedUser); 
 
      if (!currentUser || !currentUser.id) { 
        console.warn('USERPAGE.JS: Sessão encontrada, mas inválida. Limpando.');
        localStorage.removeItem('profuturo_currentUser');
        currentUser = null;
      } else {
         console.log('USERPAGE.JS: Usuário (após JSON.parse):', currentUser);
         await api.restoreSession(currentUser);
         console.log('Sessão restaurada do localStorage.');
      }
    }

    if (currentUser) {
      console.log(`USERPAGE.JS: Renderizando página para: ${currentUser.nome}`);
      console.log(`Usuário logado: ${currentUser.nome} (Role: ${currentUser.role})`);
      initializePage(currentUser); 
      await loadPageContent();
    } else {
      console.warn('Nenhuma sessão válida encontrada. Redirecionando para o login.');
      window.location.href = 'index.html';
    }
  } catch (err) {
    console.error('Erro fatal ao verificar sessão (JSON corrompido?):', err);
    localStorage.removeItem('profuturo_currentUser'); 
    window.location.href = 'index.html';
  }
});

function initializePage(user) {
  renderUserInfo(user);
  applyRBAC(user.role_name);
  attachGlobalListeners();
  initializeThemeSwitcher();
}

async function loadPageContent() {
 
  await loadCourseCards();
  await loadDashboardData(null);
}

function attachGlobalListeners() {
  const logoutButton = document.querySelector('.logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        localStorage.removeItem('profuturo_currentUser');
        await api.logout();
        window.location.href = 'index.html';
      } catch (err) {
        console.error('Erro ao fazer logout:', err);
      }
    });
  }

  const registrationForm = document.querySelector('.registration form');
  if (registrationForm) {
    registrationForm.addEventListener('submit', handleRegistrationSubmit);
  }

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
  if (!roles.isTI && !roles.isRH && !roles.isProfessor) {
    document.querySelector('.charts')?.remove();
    document.querySelector('section.chart')?.remove();
  }

  if (roles.isProfessor) {
    const area = document.getElementById('area-criacao-cursos');
    if (area) area.style.display = 'block';
  }
  if (roles.isTI) {
    const area = document.getElementById('area-atribuicao-professores');
    if (area) area.style.display = 'block';
  }
}

function initializeThemeSwitcher() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (!darkModeToggle) return;

    const applyTheme = () => {
        if (darkModeToggle.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    };

    if (localStorage.getItem('darkMode') === 'enabled') {
        darkModeToggle.checked = true;
    }

    applyTheme();

    darkModeToggle.addEventListener('change', applyTheme);
}


async function loadCourseCards() {
  const container = document.querySelector('.courses-container');
  if (!container) return;

  try {
    let response;
    if (currentUser && currentUser.role_name === 'Professor') {
      response = await api.getCoursesByProfessor(currentUser.id);
    } else {
      response = await api.getAllCourses();
    }

    if (response.success) {
      if (response.data.length === 0) {
        container.innerHTML = '<p>Nenhum curso encontrado.</p>';
        return;
      }
      
      container.innerHTML = ''; 
      response.data.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card'; 
        card.dataset.courseId = course.id;

        const imagePath = course.imagem_path 
          ? course.imagem_path
          : '../assets/images/teste1.png'; // Imagem default local, caso o campo esteja null no banco

        card.innerHTML = `
          <img src="${imagePath}" alt="${course.titulo}" class="course-card-image">
          <div class="course-card-content">
            <h4>${course.titulo}</h4>
            <p>Carga horária: ${course.carga_horaria || 'N/D'}h</p>
          </div>
        `;
        container.appendChild(card);
      });
      
      setupCourseSelection();
    } else {
      container.innerHTML = `<p style="color: red;">${response.error || 'Não foi possível carregar os cursos.'}</p>`;
    }
  } catch (err) {
    console.error('Erro ao carregar cursos:', err);
    container.innerHTML = '<p style="color: red;">Erro de comunicação ao buscar os cursos.</p>';
  }
}

function setupCourseSelection() {
    const courseCards = document.querySelectorAll('.course-card');

    courseCards.forEach(card => {
        card.addEventListener('click', () => {
            const isAlreadySelected = card.classList.contains('selected');
            
            courseCards.forEach(c => c.classList.remove('selected'));

            if (isAlreadySelected) {
              
                loadDashboardData(); 
            } else {
                card.classList.add('selected');
                const courseId = card.dataset.courseId;
                loadDashboardData(courseId);
            }
        });
    });
}

/**
 * Carrega os dados do dashboard 
 * @param {string|null} courseId - O ID do curso para filtrar. Se for nulo, carrega dados de todos os cursos.
 */
async function loadDashboardData(courseId = null) {
    console.log(`Carregando dados do dashboard para o curso: ${courseId || 'Todos'}`);

    const chartSection = document.querySelector('section.chart');
    if (chartSection) {
        const title = chartSection.querySelector('.section-title');
        if (title) {
            title.textContent = courseId ? `Gráficos do Curso Selecionado` : 'Gráficos Gerais';
        }
    }
    try {
      if (typeof loadGradeDistributionChart === 'function') {
        await loadGradeDistributionChart(courseId);
      }
      
      if (typeof loadEnrollmentStatusChart === 'function') {
        loadEnrollmentStatusChart(courseId); 
      }

    } catch (err) {
      console.error('Erro ao recarregar os gráficos:', err);
    }
}

async function handleRegistrationSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  
  const funcional = document.getElementById('regFuncional').value;
  const nome = document.getElementById('regNome').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const roleName = document.getElementById('regRole').value;

  if (!funcional || !nome || !email || !password || !roleName) {
      alert('Por favor, preencha todos os campos.');
      return;
  }
  
  button.disabled = true;
  button.textContent = 'Salvando...';

  try {
    const response = await api.createUser({ funcional, nome, email, password, roleName });

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