import { Wabuse } from '@wabuse/wabuse';
import data from '../../json/grafico.json.js'; /* FUENTE DE DATOS JSON */
import { CommonTpl } from './common.html.mjs';

CommonTpl.detectLanguage();
const lang = CommonTpl.LANG;

const pageData = data[lang];

const header = pageData.header;
const footer = pageData.footer;
header.lang = lang;
footer.lang = lang;
window.WabuseDATA.header = header;
window.WabuseDATA.footer = footer;

const HTMLbody = /* html */`
  <template data-wabuse data-src="/templates/header.tpl.html" data-json="header"></template>

  <main class="invisible">
      <h2>${header.grupoMenu.grafico}</h2>
      <section id="graphsYears" class="graphsYears">
        <canvas id="charGraphs"></canvas>
      </section>
  </main>

  <template data-wabuse data-src="/templates/footer.tpl.html" data-json="footer"></template>
`;

document.body.innerHTML = /* HTML */`
<div id="loading" class="loading">CARGANDO....</div>  
<div id="main">
  ${HTMLbody}
</div>`;
