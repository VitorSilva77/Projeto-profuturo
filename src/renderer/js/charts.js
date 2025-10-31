let currentAttendanceChart = null;
let currentPerformanceChart = null;
let currentProgressChart = null;

function loadAttendanceChart(courseId = null) {
  const attendanceCtx = document.getElementById('attendanceChart');
  if (!attendanceCtx) return;

  // Destrói o gráfico anterior
  if (currentAttendanceChart) {
    currentAttendanceChart.destroy();
  }
  
  // Lógica de exemplo:
  // (Você precisará de uma API de backend para frequência)
  let data = [85, 15];
  let title = 'Taxa de Frequência (Geral)';
  if (courseId) {
    data = [92, 8]; // Dados de exemplo para curso específico
    title = `Taxa de Frequência (Curso Específico)`;
  }

  currentAttendanceChart = new Chart(attendanceCtx, {
    type: 'doughnut',
    data: {
      labels: ['Presente', 'Ausente'],
      datasets: [{
        label: 'Frequência',
        data: data, // Dados dinâmicos
        backgroundColor: ['#4CAF50', '#F44336'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title // Título dinâmico
        }
      }
    }
  });
}


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