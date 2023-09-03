import data from '../../json/index.json.js'; /* FUENTE DE DATOS JSON */
import { CommonTpl } from './common.html.mjs';

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
      <summary id="summaryGraficoAnual">${formData.grupoMenu.grafico}</summary>    
      <section id="graphsYears">
        <canvas id="charGraphs"></canvas>
      </section>
    </details>
    <details>
      <summary id="summaryEstadisticas">${formData.grupoMenu.estadisticas}</summary>
      <aside id="years"></aside>
      <aside id="months"></aside>
      <section id="stats" class="invisible">
        <canvas id="chartStatistics"></canvas>
      </section>
    </details>
    <details>
      <summary id="summaryListado">${formData.grupoMenu.listado}</summary>
      <section id="listado"></section>
    </details>
    <details open>
      <summary id="summaryIntroducirdatos">${formData.grupoMenu.insertar} <span class="subSummary" id="subSummary">${formData.newEntry}</span></summary>
      <nav id="navigation" class="invisible">
        <button id="btnLeft" class="navBtn" tabindex="0" data-increment="-1"> < </button>
        <span id="navDate"></span>
        <button id="btnRight" class="navBtn" tabindex="0" data-increment="1"> > </button>
      </nav>
      <form id="form" class="insertData">
        <input type="hidden" name="id" id="id">
        <label for="fecha" class="formElement1 required" required>${formData.fecha}</label>  
        <input type="datetime-local" id="fechahora" class="formElement2 fechahora">
      
        <label class="formElement4 required" for="gradodolor">${formData.gradodolor}</label>
        <select class="formElement5" name="gradodolor" id="gradodolor" required tabindex="0">
          <option value="" disabled selected>${formData.select}</option>
          <option value="D0">${formData.grupoDolor.D0}</option>
          <option value="D1">${formData.grupoDolor.D1}</option>
          <option value="D2">${formData.grupoDolor.D2}</option>
          <option value="D3">${formData.grupoDolor.D3}</option>
        </select>
        
        <input class="formElement6" type="checkbox" name="mismoprocesoanterior" id="mismoprocesoanterior" tabindex="0">
        <label class="formElement7" for="mismoprocesoanterior">${formData.mismoprocesoanterior}</label>
        
        <details class="formElement8" id="molestiasGroup" tabindex="0">
          <summary>${formData.molestias}</summary>
          <input type="hidden" name="molestias" id="molestias">
          <div><input type="checkbox" value="M1" name="molestiasGroup"><div>${formData.grupoMolestias.M1}</div></div>
          <div><input type="checkbox" value="M2" name="molestiasGroup"><div>${formData.grupoMolestias.M2}</div></div>
          <div><input type="checkbox" value="M3" name="molestiasGroup"><div>${formData.grupoMolestias.M3}</div></div>
          <div><input type="checkbox" value="M4" name="molestiasGroup"><div>${formData.grupoMolestias.M4}</div></div>
          <hr>
          <div><input type="checkbox" value="M5" name="molestiasGroup"><div>${formData.grupoMolestias.M5}</div></div>
          <div><input type="checkbox" value="M6" name="molestiasGroup"><div>${formData.grupoMolestias.M6}</div></div>
          <hr>
          <div><input type="checkbox" value="M7" name="molestiasGroup"><div>${formData.grupoMolestias.M7}</div></div>
          <div><input type="checkbox" value="M8" name="molestiasGroup"><div>${formData.grupoMolestias.M8}</div></div>
        </details>

        <label class="formElement10" for="otros_sintomas">${formData.otrossintomas}</label>
        <textarea class="formElement11" name="otros_sintomas" id="otros_sintomas" tabindex="0"></textarea>
        <span class="formElement12 units"></span>
        
        <label class="formElement13" for="medicacion">${formData.medicacion}</label>
        <input class="formElement14" type="text" name="medicacion" id="medicacion" tabindex="0">
        <span class="formElement15 units"></span>
        
        <label class="formElement16" for="duracion">${formData.duracion}</label>
        <input class="formElement17" type="number" name="duracion" id="duracion" tabindex="0" step="any" max="24" min="0">
        <span class="formElement18 units">${formData.units}</span>
        
        <button class="formElement19 btnDel invisible" id="borrar" aria-label="borrar información" tabindex="0">${formData.borrar}</button>
        <button class="formElement20 btnSave" id="guardar" aria-label="guardar información" tabindex="0">${formData.guardar}</button>
        <button class="formElement21 btnCancel invisible" id="cancel" aria-label="cancel edicion" tabindex="0">${formData.cancel}</button>
      </form>
    </detail>
  </main>

  <div class="modal-overlay invisible" id="modalOverlay">
    <div class="modal-content" id="modalContent">
      <p id="modalMessage"></p>
      <button id="closeModalBtn" class="btnClose">${formData.close}</button>
      <button id="yesModalBtn" class="btnYes invisible">${formData.yes}</button>
      <button id="noModalBtn" class="btnNo invisible">${formData.no}</button>
    </div>
  </div>
`;

document.body.innerHTML = /* HTML */`
<div id="loading" class="loading">CARGANDO....</div>  
<div id="main">
  ${HTMLbody}
</div>`;
