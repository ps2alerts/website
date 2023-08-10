export const commonChartOptions = {
  root: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff',
        },
      },
      datalabels: {
        display: false,
        color: '#fff',
      },
    },
  },
  scales: {
    ticks: {
      color: '#fff',
    },
    grid: {
      color: '#50565d',
    },
  },
  datasets: {
    pointBorderWidth: 3,
    pointHoverBorderWidth: 5,
    vs: {
      label: 'VS',
      backgroundColor: '#6B46C1',
      borderColor: '#6B46C1',
      pointStyle: 'circle',
    },
    tr: {
      label: 'TR',
      backgroundColor: '#9b2c2c',
      borderColor: '#9b2c2c',
      pointStyle: 'rect',
    },
    nc: {
      label: 'NC',
      backgroundColor: '#2b6cb0',
      borderColor: '#2b6cb0',
      pointStyle: 'rectRot',
    },
    nsoDraws: {
      label: 'NSO',
      backgroundColor: '#4a5568',
      borderColor: '#4a5568',
      pointStyle: 'circle',
    },
  },
}
