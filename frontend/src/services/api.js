const API_URL = '/api';

async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la solicitud');
    }
    return response.json();
}

export async function getOwners() {
    const response = await fetch(`${API_URL}/owners`);
    return handleResponse(response);
}

export async function addOwner(ownerData) {
    const response = await fetch(`${API_URL}/owners`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ownerData),
    });
    return handleResponse(response);
}

export async function deleteOwner(ownerId) {
    const response = await fetch(`${API_URL}/owners/${ownerId}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
}

export async function getPets() {
    const response = await fetch(`${API_URL}/pets`);
    return handleResponse(response);
}

export async function addPet(petData) {
    const response = await fetch(`${API_URL}/pets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
    });
    return handleResponse(response);
}

export async function deletePet(petId) {
    const response = await fetch(`${API_URL}/pets/${petId}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
}