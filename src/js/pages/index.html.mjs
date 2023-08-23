import data from '../../json/index.json.js'; /* FUENTE DE DATOS JSON */
import {CommonTpl} from './common.html.mjs';

CommonTpl.detectLanguage();
const lang = CommonTpl.LANG;

const pageData = data.index[lang];
const formData = pageData.formData;

const HTMLbody = /* html */`
  <header>
    <firebase-loginbutton
      id="myLoginButton"
      api-key="AIzaSyCAfMOqGesYR_0EH-nNncWoJx8c3O--Kfs"
      domain="jaquenotas"
      zone="europe-west1"
      messaging-sender-id="59103377385"
      app-id="1:59103377385:web:2b79eac410e446de297d78"
      show-user
      class="loginbutton"
    ></firebase-loginbutton>
    <firebase-crud id="myCrud" reference-id="myLoginButton"></firebase-crud>
    <section class="title">
      <h1>${pageData.header.title}</h1>
      <h2 data-str="${pageData.header.subtitle}">${pageData.header.notlogged}</h2>
  </header>

  <main class="invisible">
    <details>
      <summary id="summaryEstadisticas">Estadisticas</summary>
      <aside id="years"></aside>
      <aside id="months"></aside>
      <section id="stats" class="invisible">
        <canvas id="my-chart"></canvas>
      </section>
    </details>
    <details>
      <summary id="summaryListado">Listado</summary>
      <section id="listado"></section>
    </details>
    <details open>
      <summary id="summaryIntroducirdatos">Introducir Datos</summary>
      <form id="form">
        <input type="hidden" name="id" id="id">
        <label for="fecha" class="formElement1 required" required>Fecha</label>  
        <input type="datetime-local" id="fechahora" class="formElement2 fechahora">
      
        <label class="formElement4 required" for="gradodolor">${formData.gradodolor}</label>
        <select class="formElement5" name="gradodolor" id="gradodolor" required tabindex="0">
          <option value="" disabled selected>Selecciona</option>
          <option value="D0">Dolor Ligero</option>
          <option value="D1">Dolor punzante</option>
          <option value="D2">Dolor muy punzante</option>
          <option value="D3">Dolor impide hacer vida normal</option>
        </select>
        
        <input class="formElement6" type="checkbox" name="mismoprocesoanterior" id="mismoprocesoanterior" tabindex="0">
        <label class="formElement7" for="mismoprocesoanterior">${formData.mismoprocesoanterior}</label>
        
        <details class="formElement8" id="molestiasGroup" tabindex="0">
          <summary>${formData.molestias}</summary>
          <input type="hidden" name="molestias" id="molestias">
          <div><input type="checkbox" value="M1" name="molestiasGroup"><div>Pequeña molestia ojo</div></div>
          <div><input type="checkbox" value="M2" name="molestiasGroup"><div>Molestia ojo</div></div>
          <div><input type="checkbox" value="M3" name="molestiasGroup"><div>Molestia intensa ojo</div></div>
          <div><input type="checkbox" value="M4" name="molestiasGroup"><div>Molestia muy intensa ojo</div></div>
          <hr>
          <div><input type="checkbox" value="M5" name="molestiasGroup"><div>Molestia media cara</div></div>
          <div><input type="checkbox" value="M6" name="molestiasGroup"><div>Molestia intensa media cara</div></div>
          <hr>
          <div><input type="checkbox" value="M7" name="molestiasGroup"><div>Fotofobia</div></div>
          <div><input type="checkbox" value="M8" name="molestiasGroup"><div>Nauseas</div></div>
        </details>

        <label class="formElement10" for="otros_sintomas">${formData.otrossintomas}</label>
        <textarea class="formElement11" name="otros_sintomas" id="otros_sintomas" tabindex="0"></textarea>
        <span class="formElement12"></span>
        
        <label class="formElement13" for="medicacion">${formData.medicacion}</label>
        <input class="formElement14" type="text" name="medicacion" id="medicacion" tabindex="0">
        <span class="formElement15"></span>
        
        <label class="formElement16" for="duracion">${formData.duracion}</label>
        <input class="formElement17" type="number" name="duracion" id="duracion" tabindex="0" step="any">
        <span class="formElement18">horas</span>
        
        <button class="formElement19" id="guardar" aria-label="guardar información" tabindex="0">${formData.guardar}</button>
      </form>
    </detail>
  </main>

  <div class="modal-overlay invisible" id="modalOverlay">
    <div class="modal-content" id="modalContent">
      <p id="modalMessage"></p>
      <button id="closeModalBtn">Close</button>
    </div>
  </div>
`;

document.body.innerHTML = /* HTML */`
<div id="loading" class="loading">CARGANDO....</div>  
<div id="main">
  ${HTMLbody}
</div>`;
