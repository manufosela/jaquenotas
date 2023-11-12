import './lib/common';

// Components
import '@firebase-utils/firebase-loginbutton';
import '@firebase-utils/firebase-crud';
import 'header-logomenu';

const $lang = navigator.language || navigator.userLanguage || localStorage.getItem('lang') || 'es';

let $modalOverlay;
let $crud;
let $user;
let $allData;
const $borderWidth = (window.innerWidth < 768 ? 5 : 10)

let fblogin = false;
let crudReady = false;



function moduleLoadedFunc() {
  const contents = ['Jaquecastigo', '<span class="resaltado">Jaquecas</span>tigo', '<span class="resaltado">Já</span>quecastigo', 'Ja<span class="resaltado">qué</span>castigo', 'Jaque<span class="resaltado">castigo</span>', '<span class="resaltado">Jaquecastigo</span>'];
  let currentContentIndex = 0;

  setInterval(() => {
    const div = document.getElementById('dinamic-title');
    div.innerHTML = contents[currentContentIndex];
    currentContentIndex = (currentContentIndex + 1) % contents.length;
  }, 1000);
}

document.addEventListener('dom-content-loaded', moduleLoadedFunc);