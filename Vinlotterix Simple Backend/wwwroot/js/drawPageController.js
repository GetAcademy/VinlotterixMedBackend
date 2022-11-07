function selectAllOrNone(selectAll) {
    model.inputs.drawPage.selectAll = selectAll;
    for (let person of model.participants) {
        person.isSelected = selectAll;
    }
    updateView();
}

async function addPerson() {
    const name = model.inputs.drawPage.newPersonName;
    await addParticipant(name);
    model.participants = await getParticipants();
}

function togglePersonSelected(id) {
    const person = findPerson(id);
    person.isSelected = !person.isSelected;
    updateView();
}

async function deletePerson(id) {
    await deleteParticipant(id);
    await getParticipants();
}

async function draw() {
    const count = model.inputs.drawPage.drawCount;
    const selectedPeople = model.participants.filter(p => p.isSelected);
    const ids = selectedPeople.map(p => p.id);

    await draw(count, ids);
    await getWinners();

    model.app.currentPage = 'winners';
    updateView();
}

function changeDrawCount(delta) {
    model.inputs.drawPage.drawCount =
        Math.max(1, model.inputs.drawPage.drawCount + delta);
    updateView();
}

function findPerson(id) {
    return model.participants.find(p => p.id === id);
}