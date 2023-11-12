import { Wabuse } from '@wabuse/wabuse';
import data from '../../json/acercade.json.js'; /* FUENTE DE DATOS JSON */
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
    <template data-wabuse data-src="/templates/avisolegal.tpl.html" data-json="avisolegal"></template>
  </main>

  <template data-wabuse data-src="/templates/footer.tpl.html" data-json="footer"></template>
`;

document.body.innerHTML = /* HTML */`
<div id="loading" class="loading">CARGANDO....</div>
<div id="main">
  ${HTMLbody}
</div>`;

