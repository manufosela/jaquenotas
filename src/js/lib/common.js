// common imports to libs
import { createModal } from './modal.js';

/******** SHOW BODY / HIDE LOADING ********/
window.addEventListener('load', () => {
  document.getElementById('loading').classList.add('fadeoff');
  document.getElementById('main').classList.add('fadein');
});

window.window.$appData = {}; // modalOverlay, crud, user

let fblogin = false;
let crudReady = false;
let firstTime = true;

const urlLang = document.location.href.split('/')[3];
export let $lang = navigator.language || navigator.userLanguage || localStorage.getItem('lang') || 'es';
if (urlLang === 'es' || urlLang === 'en') {
  $lang = urlLang;
}

function firebaseReady(ev) {
  if (ev.detail.id === 'myCrud' && !crudReady && fblogin) {
    crudReady = true;
    window.$appData.crud = ev.detail.component;
    window.$appData.crud.dataUser = document.querySelector('firebase-loginbutton').dataUser;
    window.$appData.user = window.$appData.crud.dataUser.uid;
  }
  if (ev.detail.id === 'myLoginButton' && !fblogin) {
    fblogin = true;
    console.log('login ready');
  }

  if (fblogin && crudReady && firstTime) {
    document.addEventListener('firebase-signout', () => {
      console.log('signout');
      location.reload();
    });
    document.querySelector('main').classList.remove('invisible');
    document.dispatchEvent(new CustomEvent('dom-content-loaded', { detail: { appData: window.$appData } }));
    firstTime = false;
  }
}

function DOMContentLoaded() {
  document.addEventListener('wc-ready', firebaseReady);
  window.$appData.modalOverlay = createModal();
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded, { once: true });