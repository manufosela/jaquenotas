import { $lang } from './lib/common';
import { showModal } from './lib/modal.js';
import './lib/chart.js';
import jsonData from '../json/grafico.json.js';

// Components
import '@firebase-utils/firebase-loginbutton';
import '@firebase-utils/firebase-crud';
import 'header-logomenu';

const pageData = jsonData[$lang];

let $allData;

function cookGraphData(datos) {
  const datosProcesados = {};
  for (let mes = 1; mes <= 12; mes += 1) {
    const gradodolorCount = {};
    const mesStr = String(mes).padStart(2, '0');
    if (datos[mesStr]) {
      for (let dia in datos[mesStr]) {
        for (let i = 0; i < datos[mesStr][dia].length; i++) {
          const gradodolor = datos[mesStr][dia][i].gradodolor;
          if (!gradodolorCount[gradodolor]) {
            gradodolorCount[gradodolor] = 1;
          } else {
            gradodolorCount[gradodolor]++;
          }
        }
      }
    }
    datosProcesados[mes] = gradodolorCount;
  }
  return datosProcesados;
}

function showGraphs(year = new Date().getFullYear()) {
  const yearData = $allData[year];
  const datosProcesados = cookGraphData(yearData);

  const labels = Object.keys(datosProcesados); // Meses en el eje X
  const datasets = [];

  // Colores para los distintos tipos de gradodolor
  const colores = {
    D0: 'rgba(75, 192, 192, 0.7)',
    D1: 'rgba(255, 206, 86, 0.7)',
    D2: 'rgba(255, 99, 132, 0.7)',
    D3: 'rgba(255, 0, 0, 0.7)',
  };

  for (const gradodolor in colores) {
    const data = labels.map(function (mes) {
      return datosProcesados[mes][gradodolor] || 0;
    });

    datasets.push({
      label: gradodolor,
      data: data,
      backgroundColor: colores[gradodolor],
    });
  }

  // Configurar el gráfico con Chart.js
  const ctx = document.getElementById('charGraphs').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      scales: {
        x: {
          stacked: true, // Para apilar las barras
        },
        y: {
          beginAtZero: true,
          stacked: true, // Para apilar las barras
        },
      },
    },
  });
}

async function graficoFn(ev) {
  window.$appData = ev.detail.appData;
  $allData = await window.$appData.crud.getData(`/misjaquecas/${window.$appData.user}`) || {}
  const currentYear = new Date().getFullYear();
  showGraphs(currentYear);
}

document.addEventListener('dom-content-loaded', graficoFn);