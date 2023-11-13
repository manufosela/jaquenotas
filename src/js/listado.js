import './lib/common';
import { showModal, showConfirmModal, resetButtons } from './lib/modal.js';
import { save, resetForm } from './lib/form.js';
import jsonData from '../json/listado.json.js';
import { getForm } from '../components/form.html.mjs';

// Components
import '@firebase-utils/firebase-loginbutton';
import '@firebase-utils/firebase-crud';
import 'header-logomenu';

const $lang = navigator.language || navigator.userLanguage || localStorage.getItem('lang') || 'es';
const pageData = jsonData[$lang];

let $allData;
const $monthLetters = pageData.monthLetters;


async function _deleteEntry(ev) {
  const id = ev.target.dataset.id;
  const [year, month, day, index] = id.split(',');
  $allData[year][month][day].splice(index, 1);
  await window.$appData.crud.insertData($allData, `/misjaquecas/${window.$appData.user}`);
  showModal('Entrada borrada correctamente.');
  resetButtons();
  document.querySelector(['a[data-id="', id, '"]'].join('')).parentElement.remove();
}

/**
 *  Deletes an entry from the `$allData` object and saves the data to the Firebase database using the `window.$appData.crud` component.
 *  Updates the list of entries displayed on the page and shows a modal with a success message or an error message if there is an issue.
 *  
 * @param {Event} ev - The event object.
 * @returns {void}
 * 
 */
function deleteEntry(ev) {
  ev.preventDefault();
  try {
    const id = ev.target.dataset.id;
    const [year, month, day, index] = id.split(',');
    showConfirmModal(pageData.mensajeModalBorrar, _deleteEntry);
    document.getElementById('yesModalBtn').dataset.id = id;
  } catch (error) {
    showModal(pageData.error);
  }
}

/**
 * Populates the form fields with the data of the selected entry when a user clicks on a link in the list.
 * 
 * @param {Event} ev - The event object triggered by clicking on a link in the list.
 * @returns {void}
 */
function editEntry(ev) {
  ev.preventDefault();
  const id = ev.target.dataset.id || document.getElementById('id').value;
  const [year, month, day, index] = id.split(',');
  const entryPos = parseInt(index, 10);
  const entry = $allData[year][month][day][entryPos];
  const maxEntriesDay = $allData[year][month][day].length;
  document.querySelector('.btnClose').click();
  // open new modal with the form
  const formHTML = getForm(pageData);
  showModal(formHTML);

  document.getElementById('id').value = id;
  const gradodolor = document.getElementById('gradodolor');
  const molestias = document.getElementById('molestias');
  const molestiasFields = [...document.querySelectorAll('[name=molestiasGroup]')];
  const otros_sintomas = document.getElementById('otros_sintomas');
  const medicacion = document.getElementById('medicacion');
  const duracion = document.getElementById('duracion');
  const fechahora = document.getElementById('fechahora');

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
  document.getElementById('borrar').dataset.id = id;
  document.getElementById('guardar').dataset.id = id;
  document.getElementById('borrar').classList.remove('invisible');
  document.getElementById('borrar').removeEventListener('click', deleteEntry);
  document.getElementById('borrar').addEventListener('click', deleteEntry);
  document.getElementById('guardar').removeEventListener('click', save);
  document.getElementById('guardar').addEventListener('click', (ev) => { save(ev, $allData, window.$appData, pageData) });
}

function nextEntry(ev, el) {
  ev.preventDefault();
  const items = [...document.querySelectorAll('#listado a')];
  const currentIndex = items.indexOf(el);
  const nextA = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;
  if (nextA) {
    document.querySelector('.btnClose').click();
    nextA.click();
    if (currentIndex + 1 === items.length) {
      ev.target.classList.add('disabled');
    }
  }
}

function prevEntry(ev, el) {
  ev.preventDefault();
  const items = [...document.querySelectorAll('#listado a')];
  const currentIndex = items.indexOf(el);
  var prevA = currentIndex > 0 ? items[currentIndex - 1] : null;
  if (prevA) {
    document.querySelector('.btnClose').click();
    prevA.click();
    if (currentIndex - 1 === 0) {
      ev.target.classList.add('disabled');
    }
  }
}

function showEntry(ev) {
  if (ev.target.tagName === 'A') {
    ev.preventDefault();
    const el = ev.target;
    const id = el.dataset.id || document.getElementById('id').value;
    const [year, month, day, index] = id.split(',');
    const entryPos = parseInt(index, 10);
    const data = $allData[year][month][day][entryPos];
    const date = new Date(data.fechahora);
    const diaSemana = date.toLocaleDateString($lang, { weekday: 'long' });
    const message = /* html */`
      <nav><a class="prevEntry" href="#prev">${pageData.prev}</a> <a class="nextEntry" href="#next">${pageData.next}</a></nav>
      <h3>${diaSemana} ${data.fechahora.slice(0, 10)} ${data.fechahora.slice(11, 16)}</h3>

      <ul class="entryList">
        <li><span class="field">${pageData.gradodolor}</span> <span class="data">${data.gradodolor}</span></li>
        <li>${data.molestias ? `<span class="field">${pageData.molestias}<span> <span class="data">${data.molestias}</span>` : `<span class="data">${pageData.sinmolestias}</span>`}</li>
        <li>${data.otros_sintomas ? `<span class="field">${pageData.otrossintomas}</span> <span class="data">${data.otros_sintomas}` : `<span class="data">${pageData.sinotros}</span>`}</li>
        <li>${data.medicacion ? `<span class="field">${pageData.medicacion}</span> <span class="data">${data.medicacion}` : `<span class="data">${pageData.sinmedicacion}</span>`}</li>
        <li>${data.duracion ? `<span class="field">${pageData.duracion}</span> <span class="data">${data.duracion}h` : ''}</li>
      </ul>
      <span class="field">${pageData.contprocesoanterior}</span>: <span class="data">${data.mismoproceso ? pageData.yes : pageData.no}</span>
      <button class="btnEdit" data-id="${id}">${pageData.editar}</button>
    `;

    showModal(message);
    document.querySelector('a.prevEntry').addEventListener('click', (ev) => { prevEntry(ev, el) });
    document.querySelector('a.nextEntry').addEventListener('click', (ev) => { nextEntry(ev, el) });
    document.querySelector('button.btnEdit').addEventListener('click', editEntry);
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
  const currentYear = new Date().getFullYear();
  const listado = document.getElementById('listado');
  const years = Object.keys($allData).sort((a, b) => a - b);
  const list = years.reduce((acc, year) => {
    const months = Object.keys($allData[year]).sort((a, b) => a - b);
    const monthsList = months.reduce((acc, month) => {
      const days = Object.keys($allData[year][month]).sort((a, b) => a - b);
      const daysList = days.reduce((acc, day) => {
        const entries = $allData[year][month][day];
        // console.log(year, month, day);
        // console.log(entries);
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
      <li>
        <details>
          <summary>${$monthLetters[month]}/${year}</summary>
          ${daysList}
        </details>
      </li>
      `;
      return acc;
    }, '');
    acc += /* html */`
      <li>
        <details ${(parseInt(year) === currentYear) ? 'open' : ''}>
          <summary>${year}</summary>
          <ul>${monthsList}</ul>
        </details>
      </li>
    `;
    return acc;
  }, '');
  listado.innerHTML = `<ul>${list}</ul>`;

  listado.addEventListener('click', showEntry);
}


async function listadoFn(ev) {
  window.$appData = ev.detail.appData;
  $allData = await window.$appData.crud.getData(`/misjaquecas/${window.$appData.user}`) || {}
  fillListado();
}

document.addEventListener('dom-content-loaded', listadoFn);