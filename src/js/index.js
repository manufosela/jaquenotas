// Common
import './lib/common';

// Components
import '@firebase-utils/firebase-loginbutton';
import '@firebase-utils/firebase-crud';

let $modalOverlay;
let $crud;
let $user;
let $allData;

let gradodolor;
let molestias;
let molestiasFields;
let otros_sintomas;
let medicacion;
let duracion;
let fechahora;
function _closeModal() {
  /**
   * Closes the modal overlay by hiding it from the display.
   * 
   * @example
   * _closeModal();
   * 
   * @returns {void} This function does not return any value.
   */
  const closeModalBtn = document.getElementById('closeModalBtn');
  // closeModalBtn.removeEventListener('click', _closeModal);
  document.getElementById('modalMessage').innerHTML = '';
  $modalOverlay.classList.add('invisible');
}

function getDaysInMonth(year, month) {
  const lastDay = new Date(year, month, 0);
  return lastDay.getDate();
}

function showModal(message) {
  /**
   * Displays a modal overlay with a given message.
   * 
   * @param {string} message - The message to be displayed in the modal overlay.
   * @returns {void}
   */
  document.getElementById('modalMessage').innerText = message;
  const closeModalBtn = document.getElementById('closeModalBtn');
  $modalOverlay.classList.remove('invisible');
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

async function save(event) {
  /**
   * Validates the form inputs, creates or updates an entry in the `$allData` object,
   * and saves the data to the Firebase database using the `$crud` component.
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
      const { gradodolor, molestias, otros_sintomas, medicacion, duracion, fechahora, mismoprocesoanterior } = form.elements;
      const molestiasFields = [...form.elements.molestiasGroup];
      const molestiasGroup = molestiasFields.filter((field) => field.checked).map((field) => field.value).join(',');
      const data = {
        gradodolor: gradodolor.value,
        molestias: molestiasGroup,
        otros_sintomas: otros_sintomas.value,
        medicacion: medicacion.value,
        duracion: duracion.value,
        fechahora: fechahora.value,
        mismoproceso: mismoprocesoanterior.checked,
      };
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
      delete data.molestiasGroup;
      if (data.id) {
        const keys = data.id.split(',');
        const entry = $allData[keys[0]][keys[1]][keys[2]][parseInt(keys[3], 10)];
        const index = $allData[keys[0]][keys[1]][keys[2]].indexOf(entry);
        delete data.id
        $allData[keys[0]][keys[1]][keys[2]][index] = data;
        /** REFACTOR
        const {yearKey, monthKey, dayKey, posKey} = data.id.split(',');
        const entry = $allData[yearKey][monthKey][dayKey][parseInt(posKey, 10)];
        const index = $allData[yearKey][monthKey][dayKey].indexOf(entry);
        delete data.id
        $allData[yearKey][monthKey][dayKey][index] = data;
        // */
      } else {
        $allData[year][month][day].push(data);
        document.getElementById('id').value = `${year},${month},${day},${$allData[year][month][day].length - 1}`;
      }
      await $crud.insertData($allData, `/misjaquecas/${$user}`, () => {
        showModal(`
          Datos guardados correctamente:

          Grado de dolor ${data.gradodolor}
          Molestias ${data.molestias}
          Otros síntomas ${data.otros_sintomas}
          Medicación ${data.medicacion}
          Duracion ${data.duracion}
          Continuacion proceso anterior: ${data.mismoproceso ? 'Sí' : 'No' }
        `);
      });
      document.getElementById('form').reset();
      console.log('saving data...');
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
          Continuacion proceso anterior: ${item.mismoproceso ? 'Sí' : 'No' }`
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
    "1": "#FFC0C0",
    "2": "#FF8080",
    "3": "#FF4040",
    "4": "#FF0000"
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
              Continuacion proceso anterior: ${nextDay.mismoproceso ? 'Sí' : 'No' }`
          };
          dataMes.splice(index + 1, 0, newDay);
        }

      }
      // Si el nextItem tiene el mismo día, la duracion del item es la diferecia entra la hora de nextitem y la hora del item.
      // El borde del item es en discontinuo, usando la propiedad borderDash con valor [5, 5]. 
      // Si el next Item es en el siguiente dia, hay que ampliar la duracion de este item hasta el final del dia y crear 
      // un item nuevo para el siguiente dia hasta la hora de inicio del siguiente item y su duracion.

      // Comprobar que el siguiente por si sigue siendo continuación.
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
      borderWidth: 5,
      fill: false
    };
    if (mismoprocesoanterior) {
      lineObject.borderDash = [5, 5];
    }

    return lineObject;
  });
  // console.log(dataMes);
  // console.log(datasets);

  const ctx = document.getElementById('my-chart').getContext('2d');
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

function editEntry(ev) {
  /**
   * Populates the form fields with the data of the selected entry when a user clicks on a link in the list.
   * 
   * @param {Event} ev - The event object triggered by clicking on a link in the list.
   * @returns {void}
   */
  ev.preventDefault();
  const id = ev.target.dataset.id;
  const keys = id.split(',');
  const entry = $allData[keys[0]][keys[1]][keys[2]][parseInt(keys[3], 10)];
  gradodolor = document.getElementById('gradodolor');
  molestias = document.getElementById('molestias');
  molestiasFields = [...document.querySelectorAll('[name=molestiasGroup]')];
  otros_sintomas = document.getElementById('otros_sintomas');
  medicacion = document.getElementById('medicacion');
  duracion = document.getElementById('duracion');
  fechahora = document.getElementById('fechahora');
  
  document.getElementById('id').value = id;
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
  document.getElementById('summaryIntroducirdatos').click();
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
  /* get plain list of entries of allData */
  const allEntries = Object.values($allData).flatMap(year => Object.values(year).flatMap(month => Object.values(month).flat()));
  /* sort entries by date */
  const sortedEntries = allEntries.sort((a, b) => new Date(a.fechahora) - new Date(b.fechahora));
  /* create list of entries */
  const indexes = {};
  const list = sortedEntries.map((entry) => {
    const date = new Date(entry.fechahora);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const dateString = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    if (indexes[`${year}_${month}_${day}`]===undefined) {
      indexes[`${year}_${month}_${day}`] = 0;
    } else {
      indexes[`${year}_${month}_${day}`] += 1;
    }
    const index = indexes[`${year}_${month}_${day}`];
    return `<li><a href="#" data-id="${year},${month},${day},${index}">${dateString}</a></li>`;
  }).join('');
  listado.innerHTML = `<ul>${list}</ul>`;
  /* add event listener to each entry */
  const listadoLinks = [...document.querySelectorAll('#listado a')];
  listadoLinks.forEach((link) => {
    link.addEventListener('click', editEntry);
  });
}

async function firebaseReady() {
  document.addEventListener('firebase-signout', () => {
    console.log('signout');
    location.reload();
  });
  document.querySelector('main').classList.remove('invisible');
  const subtitle = document.querySelector('.title H2').dataset.str;
  document.querySelector('.title H2').innerHTML = subtitle;
  $user = $crud.userData.uid;
  $allData = await $crud.getData(`/misjaquecas/${$user}`) || {}
  fillListado();
  fillYearsAndMonthsToStats();
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('guardar').addEventListener('click', save);
  /* close all details except the one that is open */
  document.querySelectorAll('details').forEach((detail) => {
    detail.addEventListener('toggle', closeDetails);
  });
  document.addEventListener('wc-ready', firebaseReady);
  document.getElementById('fechahora').value = new Date().toISOString().slice(0, 16);
  $modalOverlay = document.querySelector('.modal-overlay');
  const closeModalBtn = document.getElementById('closeModalBtn');
  closeModalBtn.addEventListener('click', _closeModal);

  $crud = document.querySelector('firebase-crud');
});