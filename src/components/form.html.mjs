export function getForm(formData) {
  return /*html*/`
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
    </form>
  `;
}