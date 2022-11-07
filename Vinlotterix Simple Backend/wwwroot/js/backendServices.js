async function getParticipants() {
    const response = await axios.get(`/participants`);
    return response.data;
}

async function getWinners() {
    const response = await axios.get(`/winners`);
    return response.data.reverse();
}

async function addParticipant(name) {
    await axios.post(`/participants`, { name });
}

async function deleteParticipant(id) {
    await axios.delete(`/participants/` + id);
}

async function draw(count, ids) {
    const drawModel = {
        Count: count,
        Ids: ids
    };
    await axios.post(`/draw`, drawModel);
}