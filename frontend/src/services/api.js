const API_URL = '/api';

export async function getOwners() {
    const response = await fetch(`${API_URL}/owners`);
    if (!response.ok) throw new Error('Error fetching owners');
    return response.json();
}

export async function addOwner(ownerData) {
    const response = await fetch(`${API_URL}/owners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ownerData),
    });
    if (!response.ok) throw new Error('Error adding owner');
    return response.json();
}

export async function deleteOwner(ownerId) {
    const response = await fetch(`${API_URL}/owners/${ownerId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error deleting owner');
    return response.json();
}

export async function getPets() {
    const response = await fetch(`${API_URL}/pets`);
    if (!response.ok) throw new Error('Error fetching pets');
    return response.json();
}

export async function addPet(petData) {
    const response = await fetch(`${API_URL}/pets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(petData),
    });
    if (!response.ok) throw new Error('Error adding pet');
    return response.json();
}

export async function deletePet(petId) {
    const response = await fetch(`${API_URL}/pets/${petId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error deleting pet');
    return response.json();
}