import { Wabuse } from '@wabuse/wabuse';
import data from '../../json/insertar.json.js'; /* FUENTE DE DATOS JSON */
import { CommonTpl } from './common.html.mjs';
import { getForm } from '../../components/form.html.mjs';

CommonTpl.detectLanguage();
const lang = CommonTpl.LANG;

const pageData = data[lang];
const formData = pageData.formData;
window.WabuseDATA.formData = formData;
formData.lang = lang;

const header = pageData.header;
const footer = pageData.footer;
header.lang = lang;
footer.lang = lang;
window.WabuseDATA.header = header;
window.WabuseDATA.footer = footer;

const HTMLbody = /* html */`
  <template data-wabuse data-src="/templates/header.tpl.html" data-json="header"></template>

  <main class="invisible">
    <h2 id="summaryIntroducirdatos">${formData.grupoMenu.insertar}</h2>
    <span class="subSummary" id="subSummary">${formData.newEntry}</span>
    ${getForm(formData)}
  </main>

  <template data-wabuse data-src="/templates/footer.tpl.html" data-json="footer"></template>
`;

document.body.innerHTML = /* HTML */`
<div id="loading" class="loading">CARGANDO....</div>  
<div id="main">
  ${HTMLbody}
</div>`;
