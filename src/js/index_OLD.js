// Common
import { DOMContentLoaded } from './lib/common.js';
import { createModal, showModal } from './lib/modal.js';
import './lib/chart.js';

// Components
import '@firebase-utils/firebase-loginbutton';
import '@firebase-utils/firebase-crud';
import 'header-logomenu';

import jsonData from '../json/index.json.js';

const $lang = navigator.language || navigator.userLanguage || localStorage.getItem('lang') || 'es';
let $appData = {};
const formData = jsonData.index[$lang].formData;

const $borderWidth = (window.innerWidth < 768 ? 5 : 10)
const $monthLetters = formData.monthLetters;

let gradodolor;
let molestias;
let molestiasFields;
let otros_sintomas;
let medicacion;
let duracion;
let fechahora;

function getDaysInMonth(year, month) {
  const lastDay = new Date(year, month, 0);
  return lastDay.getDate();
}

function validateForm() {
  /**
   * Validates the form inputs before saving the data.
   * Checks if the required fields are filled and returns an error message if any field is missing.
   * 
   * @returns {string} - Returns 'OK' if the form is valid, or an error message if any required field is missing.
   */
  const form = document.querySelector('form');
  const { gradodolor, molestias, medicacion, duracion } = form.elements;
  const molestiasFields = [...form.elements.molestiasGroup];
  const molestiasGroup = molestiasFields.filter((field) => field.checked).map((field) => field.value).join(',');
  molestias.value = molestiasGroup;

  const requiredFields = ['fechahora', 'gradodolor'];
  for (const field of requiredFields) {
    if (!form.elements[field].value) {
      return `El campo "${form.elements[field].name}" es obligatorio.`;
    }
  }
  return 'OK';
}

function resetEntry() {
  document.getElementById('navigation').classList.add('invisible');
  document.getElementById('id').value = '';
  resetForm();
  document.getElementById('subSummary').innerHTML = '(Nueva entrada)';
  document.getElementById('subSummary').classList.remove('subSummaryEditando');
  document.getElementById('borrar').classList.add('invisible');
  document.getElementById('cancel').classList.add('invisible');
}
function resetForm() {
  document.getElementById('form').reset();
  document.getElementById('fechahora').value = new Date().toISOString().slice(0, 16);
}

async function _deleteEntry(ev) {
  const id = ev.target.dataset.id || document.getElementById('id').value;
  const [year, month, day, index] = id.split(',');
  $allData[year][month][day].splice(index, 1);
  await $appData.crud.insertData($allData, `/misjaquecas/${$user}`);
  showModal('Entrada borrada correctamente.');
  resetEntry();
}

function deleteEntry(ev) {
  /**
   *  Deletes an entry from the `$allData` object and saves the data to the Firebase database using the `$appData.crud` component.
   *  Updates the list of entries displayed on the page and shows a modal with a success message or an error message if there is an issue.
   *  
   * @param {Event} ev - The event object.
   * @returns {void}
   * 
   */
  ev.preventDefault();
  const id = document.getElementById('id').value;
  const [year, month, day, index] = id.split(',');
  showConfirmModal(formData.mensajeModalBorrar, _deleteEntry);

}

async function save(event) {
  /**
   * Validates the form inputs, creates or updates an entry in the `$allData` object,
   * and saves the data to the Firebase database using the `$appData.crud` component.
   * Updates the list of entries displayed on the page and shows a modal with a success message or an error message if there is an issue.
   * 
   * @param {Event} event - The event object.
   * @returns {void}
   */
  event.preventDefault();
  const result = validateForm();
  if (result === 'OK') {
    try {
      const form = document.querySelector('form');
      const { id, gradodolor, molestias, otros_sintomas, medicacion, duracion, fechahora, mismoprocesoanterior } = form.elements;
      const molestiasFields = [...form.elements.molestiasGroup];
      const molestiasGroup = molestiasFields.filter((field) => field.checked).map((field) => field.value).join(',');
      const entryId = id.value;
      const data = {
        gradodolor: gradodolor.value,
        molestias: molestiasGroup,
        otros_sintomas: otros_sintomas.value,
        medicacion: medicacion.value,
        duracion: duracion.value,
        fechahora: fechahora.value,
        mismoproceso: mismoprocesoanterior.checked,
      };
      delete data.molestiasGroup;
      if (entryId) {
        const [year, month, day, index] = entryId.split(',');
        $allData[year][month][day][parseInt(index, 10)] = data;
      } else {
        const year = data.fechahora.slice(0, 4);
        const month = data.fechahora.slice(5, 7);
        const day = data.fechahora.slice(8, 10);
        // CUANDO FUNCIONE: $allData[year]?.[month]?.[day] ??= [];
        if (!$allData[year]) {
          $allData[year] = {};
        }
        if (!$allData[year][month]) {
          $allData[year][month] = {};
        }
        if (!$allData[year][month][day]) {
          $allData[year][month][day] = [];
        }
        $allData[year][month][day].push(data);
      }
      await $appData.crud.insertData($allData, `/misjaquecas/${$user}`, () => {
        const message = `
          ${formData.mensajeDatosGuardados}:

          ${formData.gradodolor} ${data.gradodolor}
          ${data.molestias ? `${formData.molestias} ${data.molestias}` : formData.sinmolestias}
          ${data.otros_sintomas ? `${formData.otrossintomas} ${data.otros_sintomas}` : formData.sinotros}
          ${data.medicacion ? `${formData.medicacion} ${data.medicacion}` : formData.sinmedicacion}
          ${data.duracion ? `${formData.duracion} ${data.duracion}h` : formData.sinduracion}

          ${formData.contprocesoanterior}: ${data.mismoproceso ? formData.yes : formData.no}
        `;

        showModal(message);
      });
      resetEntry();
      fillData();
      console.log('Data saved...');
    } catch (error) {
      showModal(error);
    }
  } else {
    showModal(result);
  }
}

function closeDetails(ev) {
  if (ev.target.id != 'molestiasGroup') {
    if (ev.target.open) {
      document.querySelectorAll('details').forEach((detail) => {
        if (detail !== ev.target) {
          detail.removeAttribute('open');
        }
      });
    }
  }
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
          Duración ${duracion}h
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
          console.log(nextDay.inicio, day.inicio);
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
  new Chart(ctx, {
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
    acc += `<option class="month" data-year="${year}" value="${month}">${month}</option>`;
    return acc;
  }, '');
  document.getElementById('months').innerHTML = /* HTML */`
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
    <select id="statsYear">
      <option value="" selected disabled>Selecciona un año</option>
      ${yearsHTML}
    </select>`;
  document.getElementById('statsYear').addEventListener('change', fillMonthsToStats);
}

const gotoPos = (ev) => {
  const increment = parseInt(ev.target.dataset.increment, 10);
  const id = document.getElementById('id').value;
  const [year, month, day, index] = id.split(',');
  const entryPos = parseInt(index, 10) + increment;
  if (entryPos >= 0 && entryPos < $allData[year][month][day].length) {
    document.getElementById('id').value = `${year},${month},${day},${entryPos}`;
    editEntry(ev);
  }
}

function manageNavigation(action, entryPos, maxEntriesDay) {
  const id = document.getElementById('id').value;
  const [year, month, day, index] = id.split(',');
  document.getElementById('subSummary').innerHTML = formData.editando;
  document.getElementById('subSummary').classList.add('subSummaryEditando');
  document.getElementById('navDate').innerHTML = `${entryPos + 1} de ${maxEntriesDay}<br>(${day}/${month}/${year})`;
  document.getElementById('navigation').classList.remove('invisible');
  const btnLeft = document.getElementById('btnLeft');
  const btnRight = document.getElementById('btnRight');
  btnLeft.removeEventListener('click', gotoPos);
  btnRight.removeEventListener('click', gotoPos);
  btnLeft.addEventListener('click', gotoPos);
  btnRight.addEventListener('click', gotoPos);
}

function editEntry(ev) {
  /**
   * Populates the form fields with the data of the selected entry when a user clicks on a link in the list.
   * 
   * @param {Event} ev - The event object triggered by clicking on a link in the list.
   * @returns {void}
   */
  ev.preventDefault();
  const id = ev.target.dataset.id || document.getElementById('id').value;
  const [year, month, day, index] = id.split(',');
  const entryPos = parseInt(index, 10);
  const entry = $allData[year][month][day][entryPos];
  const maxEntriesDay = $allData[year][month][day].length;
  gradodolor = document.getElementById('gradodolor');
  molestias = document.getElementById('molestias');
  molestiasFields = [...document.querySelectorAll('[name=molestiasGroup]')];
  otros_sintomas = document.getElementById('otros_sintomas');
  medicacion = document.getElementById('medicacion');
  duracion = document.getElementById('duracion');
  fechahora = document.getElementById('fechahora');

  document.getElementById('id').value = id;
  manageNavigation('edit', entryPos, maxEntriesDay);
  gradodolor.value = entry.gradodolor;
  molestias.value = entry.molestias;
  otros_sintomas.value = entry.otros_sintomas;
  medicacion.value = entry.medicacion;
  duracion.value = entry.duracion;
  fechahora.value = entry.fechahora;
  molestiasFields.forEach((field) => {
    if (entry.molestias.includes(field.value)) {
      field.checked = true;
    } else {
      field.checked = false;
    }
  });
  const form = document.getElementById('form');
  form.scrollIntoView();
  document.getElementById('borrar').classList.remove('invisible');
  document.getElementById('borrar').removeEventListener('click', deleteEntry);
  document.getElementById('borrar').addEventListener('click', deleteEntry);
  document.getElementById('cancel').classList.remove('invisible');
  document.getElementById('cancel').removeEventListener('click', resetEntry);
  document.getElementById('cancel').addEventListener('click', resetEntry);
  if (!document.getElementById('summaryIntroducirdatos').parentElement.open) {
    document.getElementById('summaryIntroducirdatos').click();
  }
}

/**
 * Populates a list of entries on the page.
 * Retrieves the entries from the $allData object, sorts them by date, and creates a list of links with the date and time of each entry.
 *
 * @example
 * fillListado();
 *
 * @returns {void} Updates the DOM by populating the listado element with a list of entries.
 */
function fillListado() {
  const listado = document.getElementById('listado');
  const years = Object.keys($allData).sort((a, b) => a - b);
  const list = years.reduce((acc, year) => {
    const months = Object.keys($allData[year]).sort((a, b) => a - b);
    const monthsList = months.reduce((acc, month) => {
      const days = Object.keys($allData[year][month]).sort((a, b) => a - b);
      const daysList = days.reduce((acc, day) => {
        const entries = $allData[year][month][day];
        console.log(year, month, day);
        console.log(entries);
        const entriesList = entries.reduce((acc, entry, index) => {
          const date = new Date(entry.fechahora);
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          acc += `<li><a href="#" data-id="${year},${month},${day},${index}">${date}</a></li>`;
          return acc;
        }, '');
        acc += /* html */`
          <ul>${entriesList}</ul>
        `;
        return acc;
      }, '');
      acc += /* html */`
        <details>
          <summary>${$monthLetters[month]}/${year}</summary>
          <ul>${daysList}</ul>
        </details>
      `;
      return acc;
    }, '');
    acc += /* html */`
      <details>
        <summary>${year}</summary>
        <ul>${monthsList}</ul>
      </details>
    `;
    return acc;
  }, '');
  listado.innerHTML = `${list}`;
  /* add event listener to each entry */
  const listadoLinks = [...document.querySelectorAll('#listado a')];
  listadoLinks.forEach((link) => {
    link.addEventListener('click', editEntry);
  });
}

async function fillData() {
  $allData = await $appData.crud.getData(`/misjaquecas/${$user}`) || {}
  console.log($allData);
  fillListado();
  fillYearsAndMonthsToStats();
  const currentYear = new Date().getFullYear();
  showGraphs(currentYear);
}

// function firebaseReady(ev) {
//   if (ev.detail.id === 'myCrud') {
//     crudReady = true;
//     $appData.crud = document.querySelector('firebase-crud');
//     $user = $appData.crud.userData.uid;
//   }
//   if (ev.detail.id === 'myLoginButton') {
//     fblogin = true;
//   }

//   if (fblogin && crudReady) {
//     document.addEventListener('firebase-signout', () => {
//       console.log('signout');
//       location.reload();
//     });
//     document.querySelector('main').classList.remove('invisible');
//     fillData();
//   }
// }

function moduleLoadedFunc() {
  document.addEventListener('wc-ready', firebaseReady);
  document.getElementById('fechahora').value = new Date().toISOString().slice(0, 16);
  $appData.modalOverlay = document.querySelector('.modal-overlay');
  // const closeModalBtn = document.getElementById('closeModalBtn');
  // closeModalBtn.addEventListener('click', closeModal);
  fillData();
}

document.addEventListener('DOMContentLoaded', () => {
  DOMContentLoaded();
  moduleLoadedFunc();
});
