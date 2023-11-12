import { $lang } from './lib/common';
import { save } from './lib/form.js';
import jsonData from '../json/insertar.json.js';

// Components
import '@firebase-utils/firebase-loginbutton';
import '@firebase-utils/firebase-crud';
import 'header-logomenu';

const formData = jsonData[$lang].formData;

let $appData;
let $allData;

async function insertarFn(ev) {
  $appData = ev.detail.appData;
  $allData = await $appData.crud.getData(`/misjaquecas/${$appData.user}`) || {}
  document.getElementById('fechahora').value = new Date().toISOString().slice(0, 16);
  document.getElementById('guardar').addEventListener('click', (ev) => { save(ev, $allData, $appData, formData) });
}

document.addEventListener('dom-content-loaded', insertarFn);