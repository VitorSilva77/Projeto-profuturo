let currentUser = null;

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

function initializeApp(user) {
  document.addEventListener('DOMContentLoaded', () => {
    console.log(`Usuário logado: ${user.nome} (Role: ${user.role})`);
    
    attachGlobalListeners();
    renderUserInfo(user);
    applyRBAC(user.role);
    
    loadPageContent();
  });
}

async function loadPageContent() {
 
  await loadCourseCards();
  await loadDashboardData();
}

function attachGlobalListeners() {
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


async function loadCourseCards() {
  const container = document.querySelector('.courses-container');
  if (!container) return;

  try {
    let response;
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
      
      container.innerHTML = ''; 
      response.data.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card'; 
        card.dataset.courseId = course.id;
        card.innerHTML = `
          <h4>${course.titulo}</h4>
          <p>Carga horária: ${course.carga_horaria || 'N/D'}h</p>
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
            title.textContent = courseId ? `Relatórios do Curso Selecionado` : 'Relatórios Gerais';
        }
    }
}

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