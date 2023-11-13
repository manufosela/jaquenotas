import { $lang } from './lib/common';
import { save } from './lib/form.js';
import jsonData from '../json/insertar.json.js';

// Components
import '@firebase-utils/firebase-loginbutton';
import '@firebase-utils/firebase-crud';
import 'header-logomenu';

const formData = jsonData[$lang].formData;

let $allData;

async function insertarFn(ev) {
  window.$appData = ev.detail.appData;
  $allData = await window.$appData.crud.getData(`/misjaquecas/${window.$appData.user}`) || {}
  document.getElementById('fechahora').value = new Date().toISOString().slice(0, 16);
  document.getElementById('guardar').addEventListener('click', (ev) => { save(ev, $allData, window.$appData, formData) });
}

document.addEventListener('dom-content-loaded', insertarFn);