function updateViewDrawPage() {
    let html = `<table>
                  <tr>
                    <td><input type="checkbox"
                               onclick="selectAllOrNone(this.checked)"
                               ${getChecked(model.inputs.drawPage.selectAll)}/></td>
                    <td><b>Personer</b></td>
                    <td>
                    </td>
                  </tr>`;
    for (let person of model.participants) {
      html += `<tr>
                  <td><input type="checkbox"
                             onclick="togglePersonSelected(${person.id})" 
                             ${getChecked(person.isSelected)}"/></td>
                  <td>${person.name}</td>
                  <td><button class="litenKnapp"  onclick="deletePerson(${person.id})">x</button></td>
                </tr>`;
    }
    html += `<tr>
                <td></td>
                <td colspan="3">
                  <input 
                    size="10" 
                    type="text" 
                    oninput="model.inputs.drawPage.newPersonName=this.value" 
                    value="${model.inputs.drawPage.newPersonName}"
                    />
                  <button class="litenKnapp" onclick="addPerson()">legg til person</button>
                </td>
             </tr>
             <tr><td>&nbsp;</td></tr>
             <tr>
                <td colspan="3">
                  <button class="knapp" onclick="draw()">Trekk!</button>
                  <input 
                    type="number" 
                    size="1" 
                    value="${model.inputs.drawPage.drawCount}" 
                    onchange="model.inputs.drawPage.drawCount=parseInt(this.value)"
                    />
                  <button class="" onclick="changeDrawCount(1)">▲</button>
                  <button class="" onclick="changeDrawCount(-1)">▼</button>
                </td>
              </tr>
            </table>`;
    document.getElementById('app').innerHTML = `
        <div class="page">
            <div class="header">
                Vinlotterix 🍷
            </div>
            <div class="innhold">${html}</div>
            <div class="meny">
                <button class="knapp fixed" onclick="model.app.currentPage='draw'; updateView()">Personer</button><br />
                <button class="knapp fixed" onclick="model.app.currentPage='winners'; updateView()">Vinnere</button><br />
            </div>
        </div>  
    `;
  }
  
  function getChecked(isSelected) {
    return isSelected ? 'checked="checked"' : '';
  }