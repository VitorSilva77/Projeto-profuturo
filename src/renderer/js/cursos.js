document.addEventListener('DOMContentLoaded', () => {

    const storedUser = localStorage.getItem('profuturo_currentUser');
    if (!storedUser) {
        window.location.href = 'index.html';
        return;
    }

    const searchInput = document.getElementById('searchInput');
    const workloadFilter = document.getElementById('workloadFilter');
    
    let allCourses = [];  


    async function loadCourses() {
        const container = document.getElementById('courses-container');
        if (!container) return;

        try {
            const response = await api.getAllCourses();
            if (response.success) {
                allCourses = response.data;
                if (allCourses.length === 0) {
                    container.innerHTML = '<p>Nenhum curso encontrado.</p>';
                } else {
                    renderCourses(allCourses);
                }
            } else {
                container.innerHTML = `<p style="color: red;">${response.error || 'Não foi possível carregar os cursos.'}</p>`;
            }
        } catch (err) {
            console.error('Erro ao carregar cursos:', err);
            container.innerHTML = '<p style="color: red;">Erro de comunicação ao buscar os cursos.</p>';
        }
    }

    function renderCourses(courses) {
        const container = document.getElementById('courses-container');
        container.innerHTML = ''; 

        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';
            card.dataset.courseId = course.id;

            const imagePath = course.imagem_path 
                ? course.imagem_path
                : '../assets/images/teste1.png';

            card.innerHTML = `
                <img src="${imagePath}" alt="${course.titulo}" class="course-card-image">
                <div class="course-card-content">
                    <h4>${course.titulo}</h4>
                    <p>${course.descricao || 'Sem descrição disponível.'}</p>
                </div>
                <div class="course-card-footer">
                    <span>Carga horária: ${course.carga_horaria || 'N/D'}h</span>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function filterAndRender() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedWorkload = workloadFilter.value;

        const filteredCourses = allCourses.filter(course => {
            const matchesSearch = course.titulo.toLowerCase().includes(searchTerm);
            
            let matchesWorkload = true;
            if (selectedWorkload !== 'all') {
                const workload = parseInt(course.carga_horaria, 10);
                if (!isNaN(workload)) {
                    switch (selectedWorkload) {
                        case '0-20':
                            matchesWorkload = workload > 0 && workload <= 20;
                            break;
                        case '21-40':
                            matchesWorkload = workload > 20 && workload <= 40;
                            break;
                        case '41-80':
                            matchesWorkload = workload > 40 && workload <= 80;
                            break;
                        case '81+':
                            matchesWorkload = workload > 80;
                            break;
                    }
                } else {
                    matchesWorkload = false; 
                }
            }

            return matchesSearch && matchesWorkload;
        });

        renderCourses(filteredCourses);
    }

    
    searchInput.addEventListener('input', filterAndRender);
    workloadFilter.addEventListener('change', filterAndRender);

   
    loadCourses();
});

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