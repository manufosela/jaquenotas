import { Wabuse } from '@wabuse/wabuse';
import data from '../../json/index.json.js'; /* FUENTE DE DATOS JSON */
import { CommonTpl } from './common.html.mjs';

CommonTpl.detectLanguage();
const lang = CommonTpl.LANG;

const pageData = data.index[lang];

const header = pageData.header;
const footer = pageData.footer;
header.lang = lang;
footer.lang = lang;
window.WabuseDATA.header = header;
window.WabuseDATA.footer = footer;

const HTMLbody = /* html */`
  <template data-wabuse data-src="/templates/header.tpl.html" data-json="header"></template>

  <main class="invisible">
    <h1 class="resaltado">Jaquecastigo</h1>
    <article class="info">
      ${pageData.info}
    </article>
    <img src="/assets/images/jaquecastigo_logo.png" alt="jaquecaastigo logo">
  </main>

  <template data-wabuse data-src="/templates/footer.tpl.html" data-json="footer"></template>

`;

document.body.innerHTML = /* HTML */`
  <div id="loading" class="loading">CARGANDO....</div>  
  <div id="main">
    ${HTMLbody}
  </div>`;
