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
    <h1 id="dinamic-title">Jaquecastigo</h1>
    <img src="/assets/images/jaquecastigo_logo.png" alt="jaquecaastigo logo">
    <article class="info">
      ${pageData.infoList.map(item => `<p>${item}</p>`).join('')}
    </article>
    <article class="info">
      <h2>${pageData.avisolegal}</h2>
      <ul>
        ${pageData.avisolegalList.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </article>
    <article class="info">
    <h2>${pageData.libraries}</h2>
    <ul>
      <li><a href="https://www.chartjs.org/" target="_blank">Chart.js</a></li>
      <li><a href="https://www.npmjs.com/package/@wabuse/wabuse" target="_blank">@wabuse/wabuse</a></li>
    </ul>
  </article>
  </main>

  <template data-wabuse data-src="/templates/footer.tpl.html" data-json="footer"></template>
`;

document.body.innerHTML = /* HTML */`
<div id="loading" class="loading">${header.loading}</div>  
<div id="main">
  ${HTMLbody}
</div>`;
