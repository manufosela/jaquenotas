let $modalOverlay;

export function resetButtons() {
  document.getElementById('yesModalBtn').classList.add('invisible');
  document.getElementById('noModalBtn').classList.add('invisible');
  document.getElementById('closeModalBtn').classList.remove('invisible');
}

/**
 * Closes the modal overlay by hiding it from the display.
 * 
 * @example
 * closeModal();
 * 
 * @returns {void} This function does not return any value.
 */
export function closeModal() {
  document.getElementById('modalMessage').innerHTML = '';
  $modalOverlay.classList.add('invisible');
  resetButtons();
}

/**
 *  Displays a modal overlay with a given message and a confirmation button.
 * Calls a callback function when the user clicks on the confirmation button.
 * 
 * @param {string} message - The message to be displayed in the modal overlay.
 * @param {function} callback - The callback function to be called when the user clicks on the confirmation button.
 * @returns {void}
 * 
 */
export function showConfirmModal(message, callback) {
  document.getElementById('modalMessage').innerHTML = message;
  document.getElementById('closeModalBtn').classList.add('invisible');
  document.getElementById('yesModalBtn').classList.remove('invisible');
  document.getElementById('noModalBtn').classList.remove('invisible');
  document.getElementById('yesModalBtn').addEventListener('click', callback);
  document.getElementById('noModalBtn').addEventListener('click', closeModal);
  $modalOverlay.classList.remove('invisible');
}

/**
 * Displays a modal overlay with a given message.
 * 
 * @param {string} message - The message to be displayed in the modal overlay.
 * @returns {void}
 */
export function showModal(message) {
  document.getElementById('modalMessage').innerHTML = message;
  const closeModalBtn = document.getElementById('closeModalBtn');
  $modalOverlay.classList.remove('invisible');
}

/**
 * Creates a modal overlay in the DOM.
 * 
 * @returns {void}
 */
export function createModal() {
  document.body.innerHTML += /* HTML */`
    <div class="modal-overlay invisible" id="modalOverlay">
      <div class="modal-content" id="modalContent">
        <p id="modalMessage"></p>
        <button id="closeModalBtn" class="btnClose">Cerrar</button>
        <button id="yesModalBtn" class="btnYes invisible">Sí</button>
        <button id="noModalBtn" class="btnNo invisible">No</button>
      </div>
    </div>
  `;
  const closeModalBtn = document.getElementById('closeModalBtn');
  closeModalBtn.addEventListener('click', closeModal);
  $modalOverlay = document.getElementById('modalOverlay');
}