import { $lang } from './lib/common';
import { showModal } from './lib/modal.js';
import './lib/chart.js';
import jsonData from '../json/estadisticas.json.js';

// Components
import '@firebase-utils/firebase-loginbutton';
import '@firebase-utils/firebase-crud';
import 'header-logomenu';

const $borderWidth = (window.innerWidth < 768 ? 5 : 10)

let $appData;
let $allData;
let $chart;

const pageData = jsonData[$lang];

function getDaysInMonth(year, month) {
  const lastDay = new Date(year, month, 0);
  return lastDay.getDate();
}

function cookData(entrada) {
  const salida = [];

  for (const dia in entrada) {
    entrada[dia].forEach(item => {
      const horaInicio = new Date(item.fechahora).getHours();
      const duracion = item.duracion !== "" ? parseInt(item.duracion) : undefined;
      let grado = 1;

      if (item.gradodolor.startsWith("D")) {
        grado = parseInt(item.gradodolor.slice(1)) + 1;
      }

      salida.push({
        dia: parseInt(dia),
        inicio: horaInicio,
        duracion: duracion,
        grado: grado,
        medicacion: item.medicacion,
        otros_sintomas: item.otros_sintomas,
        molestias: item.molestias,
        mismoproceso: item.mismoproceso,
        label: `Día ${dia}
          Duración ${(duracion) ? `${duracion} h` : 'Enlaza con el sig episodio'}
          Grado ${grado}
          Medication ${item.medicacion}
          Otros síntomas ${item.otros_sintomas}
          Continuacion proceso anterior: ${item.mismoproceso ? 'Sí' : 'No'}`
      });
    });
  }

  return salida;
}

function checkNextItem(data, index) {
  if (index < data.length - 1) {
    const nextItem = data[index + 1];
    const mismoproceso = nextItem.mismoproceso;
    return mismoproceso;
  }
  return false;
}

function showStats(ev) {
  document.getElementById('stats').classList.remove('invisible');
  const selectedIndex = ev.target.selectedIndex;
  const selectedOption = ev.target.options[selectedIndex];
  const year = selectedOption.dataset.year;
  const month = ev.target.value;
  const gradoColor = {
    "1": "#C0C0FF",
    "2": "#8080FF",
    "3": "#4040FF",
    "4": "#8A2BE2"
  };
  const allHours = Array.from({ length: 24 }, (_, i) => i);

  const dataMes = cookData($allData[year][month]);
  const datasets = dataMes.map((day, index) => {
    const lines = [];

    const mismoprocesoanterior = checkNextItem(dataMes, index);
    if (mismoprocesoanterior) {
      if (index < dataMes.length - 1) {
        if (dataMes[index + 1].dia === day.dia) {
          const nextDay = dataMes[index + 1];
          day.duracion = nextDay.inicio - day.inicio;
          // console.log(nextDay.inicio, day.inicio);
        } else {
          const nextDay = dataMes[index + 1];
          day.duracion = 24 - day.inicio;
          const newDay = {
            dia: nextDay.dia,
            inicio: 0,
            duracion: nextDay.inicio,
            grado: nextDay.grado,
            medicacion: nextDay.medicacion,
            otros_sintomas: nextDay.otros_sintomas,
            molestias: nextDay.molestias,
            mismoproceso: nextDay.mismoproceso,
            label: `Día ${nextDay.dia}
              Duración ${nextDay.inicio}h
              Grado ${nextDay.grado}
              Medication ${nextDay.medicacion}
              Otros síntomas ${nextDay.otros_sintomas}
              Continuacion proceso anterior: ${nextDay.mismoproceso ? 'Sí' : 'No'}`
          };
          dataMes.splice(index + 1, 0, newDay);
        }

      }
    }

    const dia = day.dia;
    const duracion = day.duracion || 0;
    const startHour = day.inicio;
    const endHour = day.inicio + duracion;

    if (endHour <= 24) {
      lines.push({
        x: dia,
        y: startHour,
      });
      lines.push({
        x: dia,
        y: endHour,
      });
    }

    const lineObject = {
      data: lines,
      label: day.label,
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      borderColor: gradoColor[day.grado],
      borderWidth: $borderWidth,
      responsive: true,
      fill: false
    };
    if (mismoprocesoanterior) {
      lineObject.borderDash = [5, 5];
    }

    return lineObject;
  });
  // console.log(dataMes);
  // console.log(datasets);

  const ctx = document.getElementById('chartStatistics').getContext('2d');
  if ($chart) {
    $chart.destroy();
  }
  $chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: allHours,
      datasets: datasets,
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: 'Día del mes'
          },
          ticks: {
            stepSize: 1
          },
          suggestedMin: 1,
          suggestedMax: getDaysInMonth(year, month)
        },
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Duracion'
          },
          ticks: {
            stepSize: 1
          },
          suggestedMin: 0,
          suggestedMax: 23
        }
      },
      plugins: {
        legend: {
          display: false
        },
      },
      responsive: true,
      interaction: {
        mode: 'dataset',
        intersect: true,
      },
    },
  });
}

function fillMonthsToStats(ev) {
  const year = ev.target.value;
  const months = Object.keys($allData[year]).sort((a, b) => a - b);
  const monthsHTML = months.reduce((acc, month) => {
    acc += `<option class="month" data-year="${year}" value="${month}">${jsonData[$lang].monthLetters[month]}</option>`;
    return acc;
  }, '');
  document.getElementById('months').innerHTML = /* HTML */`
  <label>Mes</label>
  <select id="statsMonth">
      <option value="" selected disabled>Selecciona un mes</option>
      ${monthsHTML}
      </select>`;
  document.getElementById('statsMonth').addEventListener('change', showStats);
}

function fillYearsAndMonthsToStats() {
  const years = Object.keys($allData).sort((a, b) => a - b);
  const yearsHTML = years.reduce((acc, year) => {
    acc += `<option value="${year}">${year}</option>`;
    return acc;
  }, '');
  document.getElementById('years').innerHTML = /* HTML */`
    <label>${pageData.year}</label>
    <select id="statsYear">
      <option value="" selected disabled>${pageData.selectyear}</option>
      ${yearsHTML}
    </select>`;
  document.getElementById('statsYear').addEventListener('change', fillMonthsToStats);
}

async function estadisticasFn(ev) {
  $appData = ev.detail.appData;
  $allData = await $appData.crud.getData(`/misjaquecas/${$appData.user}`) || {}
  fillYearsAndMonthsToStats();
}

document.addEventListener('dom-content-loaded', estadisticasFn);