let currentAttendanceChart = null;
let currentPerformanceChart = null;
let currentProgressChart = null;


async function loadPerformanceChart(courseId = null) {
  const performanceCtx = document.getElementById('performanceChart');
  if (!performanceCtx) return;

  // Destrói o gráfico anterior
  if (currentPerformanceChart) {
    currentPerformanceChart.destroy();
  }

  let chartLabels = ['Carregando...'];
  let chartData = [0];
  let chartColors = ['#DDD'];

  try {
    // 1. Busca os dados da API (AGORA PASSANDO O courseId)
    const response = await api.getCoursePerformanceReport(courseId); 

    if (response.success && response.data.length > 0) {
      // 2. Processa os dados recebidos (lógica igual a antes)
      chartLabels = response.data.map(item => item.titulo);
      chartData = response.data.map(item => parseFloat(item.mediaNota).toFixed(2)); 
      chartColors = chartData.map(() => '#2196F3'); 

    } else if (response.data.length === 0) {
      chartLabels = ['Nenhum dado encontrado'];
      chartData = [0];
    } else {
      chartLabels = ['Erro ao carregar dados'];
      chartData = [0];
      chartColors = ['#F44336'];
      console.error(response.error);
    }
  } catch (err) {
    // ... (lógica de erro)
  }

  // 3. Renderiza o gráfico com os dados
  currentPerformanceChart = new Chart(performanceCtx, {
    type: 'bar',
    data: {
      labels: chartLabels,
      datasets: [{
        label: 'Média de Notas (Cursos Concluídos)',
        data: chartData,
        backgroundColor: chartColors,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Desempenho por Curso (Média de Nota Final)'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 10 
        }
      }
    }
  });
}

async function loadEnrollmentStatusChart(courseId = null) {
  const statusCtx = document.getElementById('attendanceChart'); 
  if (!statusCtx) return;

  if (currentStatusChart) {
    currentStatusChart.destroy();
  }

  let title = 'Status de Matrículas (Geral)';
  if (courseId) {
    const courseName = document.querySelector(`#courseFilter option[value="${courseId}"]`).textContent;
    title = `Status de Matrículas (${courseName})`;
  }

  const response = await api.getEnrollmentStatusReport(courseId);
  
  let concludedCount = 0;
  let inProgressCount = 0;

  if (response.success && response.data) {
    response.data.forEach(item => {
      if (item.status === 'concluido') {
        concludedCount = item.count;
      } else if (item.status === 'cursando') {
        inProgressCount = item.count;
      }
    });
  } else {
    console.error('Erro ao buscar dados de status:', response.error);
  }

  currentStatusChart = new Chart(statusCtx, {
    type: 'pie',
    data: {
      labels: ['Concluído', 'Cursando'],
      datasets: [{
        label: 'Status de Alunos',
        data: [concludedCount, inProgressCount],
        backgroundColor: ['#36A2EB', '#FFCE56'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title
        }
      }
    }
  });
}