document.addEventListener('DOMContentLoaded', () => {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js não foi carregado. Os gráficos não serão renderizados.');
    return;
  }

  loadAttendanceChart();
  loadPerformanceChart();
});

function loadAttendanceChart() {
  const attendanceCtx = document.getElementById('attendanceChart');
  if (attendanceCtx) {
    new Chart(attendanceCtx, {
      type: 'doughnut',
      data: {
        labels: ['Presente', 'Ausente'],
        datasets: [{
          label: 'Frequência',
          data: [85, 15], // Dados de exemplo
          backgroundColor: ['#4CAF50', '#F44336'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Taxa de Frequência (Exemplo)'
          }
        }
      }
    });
  }
}


async function loadPerformanceChart() {
  const performanceCtx = document.getElementById('performanceChart');
  if (!performanceCtx) return;

  let chartLabels = ['Carregando...'];
  let chartData = [0];
  let chartColors = ['#DDD'];

  try {
    // 1. Busca os dados da API
    const response = await api.getCoursePerformanceReport();

    if (response.success && response.data.length > 0) {
      // 2. Processa os dados recebidos
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
    chartLabels = ['Erro de conexão com API'];
    chartData = [0];
    chartColors = ['#F44336'];
    console.error(err);
  }

  // 3. Renderiza o gráfico com os dados (reais ou de erro)
  new Chart(performanceCtx, {
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