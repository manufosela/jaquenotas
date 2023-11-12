import { showModal } from "./modal";

export function validateForm() {
  /**
   * Validates the form inputs before saving the data.
   * Checks if the required fields are filled and returns an error message if any field is missing.
   * 
   * @returns {string} - Returns 'OK' if the form is valid, or an error message if any required field is missing.
   */
  const form = document.querySelector('form');
  const { gradodolor, molestias, medicacion, duracion } = form.elements;
  const molestiasFields = [...form.elements.molestiasGroup];
  const molestiasGroup = molestiasFields.filter((field) => field.checked).map((field) => field.value).join(',');
  molestias.value = molestiasGroup;

  const requiredFields = ['fechahora', 'gradodolor'];
  for (const field of requiredFields) {
    if (!form.elements[field].value) {
      return `El campo "${form.elements[field].name}" es obligatorio.`;
    }
  }
  return 'OK';
}

function resetEntry() {
  document.getElementById('id').value = '';
  resetForm();
  document.getElementById('subSummary').innerHTML = '(Nueva entrada)';
  document.getElementById('borrar').classList.add('invisible');
}

export function resetForm() {
  document.getElementById('form').reset();
  document.getElementById('fechahora').value = new Date().toISOString().slice(0, 16);
}

/**
 * Validates the form inputs, creates or updates an entry in the `$allData` object,
 * and saves the data to the Firebase database using the `$appData.crud` component.
 * Updates the list of entries displayed on the page and shows a modal with a success message or an error message if there is an issue.
 * 
 * @param {Event} event - The event object.
 * @returns {void}
 */
export async function save(event, $allData, $appData, formData) {
  event.stopPropagation();
  event.preventDefault();
  const result = validateForm();
  if (result === 'OK') {
    // try {
    const form = document.querySelector('form');
    const { id, gradodolor, molestias, otros_sintomas, medicacion, duracion, fechahora, mismoprocesoanterior } = form.elements;
    const molestiasFields = [...form.elements.molestiasGroup];
    const molestiasGroup = molestiasFields.filter((field) => field.checked).map((field) => field.value).join(',');
    const entryId = id.value;
    const data = {
      gradodolor: gradodolor.value,
      molestias: molestiasGroup,
      otros_sintomas: otros_sintomas.value,
      medicacion: medicacion.value,
      duracion: duracion.value,
      fechahora: fechahora.value,
      mismoproceso: mismoprocesoanterior.checked,
    };
    delete data.molestiasGroup;
    if (entryId) {
      const [year, month, day, index] = entryId.split(',');
      $allData[year][month][day][parseInt(index, 10)] = data;
    } else {
      const year = data.fechahora.slice(0, 4);
      const month = data.fechahora.slice(5, 7);
      const day = data.fechahora.slice(8, 10);
      // CUANDO FUNCIONE: $allData[year]?.[month]?.[day] ??= [];
      if (!$allData[year]) {
        $allData[year] = {};
      }
      if (!$allData[year][month]) {
        $allData[year][month] = {};
      }
      if (!$allData[year][month][day]) {
        $allData[year][month][day] = [];
      }
      $allData[year][month][day].push(data);
    }
    await $appData.crud.insertData($allData, `/misjaquecas/${$appData.user}`, () => {
      const message = /* html */`
          <h3>${formData.mensajeDatosGuardados}:</h3>
          <ul class="entryList">
            <li><span class="field">${formData.gradodolor}</span> <span class="data">${data.gradodolor}</span></li>
            <li>${data.molestias ? `<span class="field">${formData.molestias}<span> <span class="data">${data.molestias}</span>` : `<span class="data">${formData.sinmolestias}</span>`}</li>
            <li>${data.otros_sintomas ? `<span class="field">${formData.otrossintomas}</span> <span class="data">${data.otros_sintomas}` : `<span class="data">${formData.sinotros}</span>`}</li>
            <li>${data.medicacion ? `<span class="field">${formData.medicacion}</span> <span class="data">${data.medicacion}` : `<span class="data">${formData.sinmedicacion}</span>`}</li>
            <li>${data.duracion ? `<span class="field">${formData.duracion}</span> <span class="data">${data.duracion}h` : ''}</li>
          </ul>
          <span class="field">${formData.contprocesoanterior}</span>: <span class="data">${data.mismoproceso ? formData.yes : formData.no}</span>
        `;

      showModal(message);
    });
    resetEntry();
    console.log('Data saved...');
    // } catch (error) {
    //   showModal(error);
    // }
  } else {
    showModal(result);
  }
}