let currentAttendanceChart = null; 
let currentPerformanceChart = null; 
let currentProgressChart = null; 

async function loadGradeDistributionChart(courseId = null) {
  const performanceCtx = document.getElementById('performanceChart');
  if (!performanceCtx) return;

  if (currentPerformanceChart) {
    currentPerformanceChart.destroy();
  }

  const labels = ['0 - 1.9', '2 - 3.9', '4 - 5.9', '6 - 7.9', '8 - 10'];
  
  const dataMap = new Map();
  labels.forEach(label => dataMap.set(label, 0));

  let chartTitle = 'Distribuição de Notas (Geral)';

  try {
    const response = await api.getGradeDistributionReport(courseId);

    if (response.success) {
      
      if (response.data && response.data.length > 0) {
        response.data.forEach(item => {
          if (dataMap.has(item.faixa_nota)) {
            dataMap.set(item.faixa_nota, item.quantidade);
          }
        });
        if (courseId) {
          chartTitle = 'Distribuição de Notas (Curso Selecionado)';
        }
      } else {
        chartTitle = courseId ? 'Sem notas neste curso' : 'Nenhuma nota registrada';
      }
      
    } else {
      console.error('Erro ao buscar dados:', response.error);
      chartTitle = 'Erro ao carregar dados';
    }

  } catch (err) {
    console.error('Erro de comunicação ao buscar distribuição:', err);
    chartTitle = 'Erro de comunicação';
  }

  const chartData = labels.map(label => dataMap.get(label));

  currentPerformanceChart = new Chart(performanceCtx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Quantidade de Alunos',
        data: chartData,
        backgroundColor: '#2196F3',
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: chartTitle
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
}

async function loadEnrollmentStatusChart(courseId = null) {
  const statusCtx = document.getElementById('attendanceChart'); 
  if (!statusCtx) return;

  if (currentAttendanceChart) {
    currentAttendanceChart.destroy();
  }

  let title = 'Status de Matrículas (Geral)';
  if (courseId) {
    const card = document.querySelector(`.course-card[data-course-id="${courseId}"] h4`);
    const courseName = card ? card.textContent : 'Curso Selecionado';
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

  currentAttendanceChart = new Chart(statusCtx, {
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