// Usamos una ruta relativa en lugar de una URL absoluta
const API_URL = '/api';

// Obtener todos los propietarios
export async function getOwners() {
  const response = await fetch(`${API_URL}/owners`);
  if (!response.ok) {
    throw new Error('Error fetching owners');
  }
  return response.json();
}

// Añadir un nuevo propietario
export async function addOwner(ownerData) {
  const response = await fetch(`${API_URL}/owners`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ownerData),
  });
  if (!response.ok) {
    throw new Error('Error adding owner');
  }
  return response.json();
}

// Obtener un propietario específico por ID
export async function getOwnerById(ownerId) {
  const response = await fetch(`${API_URL}/owners/${ownerId}`);
  if (!response.ok) {
    throw new Error('Error fetching owner');
  }
  return response.json();
}

// Actualizar un propietario
export async function updateOwner(ownerId, ownerData) {
  const response = await fetch(`${API_URL}/owners/${ownerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ownerData),
  });
  if (!response.ok) {
    throw new Error('Error updating owner');
  }
  return response.json();
}

// Eliminar un propietario
export async function deleteOwner(ownerId) {
  const response = await fetch(`${API_URL}/owners/${ownerId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error deleting owner');
  }
  return response.json();
}

// Obtener todas las mascotas
export async function getPets() {
  const response = await fetch(`${API_URL}/pets`);
  if (!response.ok) {
    throw new Error('Error fetching pets');
  }
  return response.json();
}

// Añadir una nueva mascota
export async function addPet(petData) {
  const response = await fetch(`${API_URL}/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(petData),
  });
  if (!response.ok) {
    throw new Error('Error adding pet');
  }
  return response.json();
}

// Obtener una mascota específica por ID
export async function getPetById(petId) {
  const response = await fetch(`${API_URL}/pets/${petId}`);
  if (!response.ok) {
    throw new Error('Error fetching pet');
  }
  return response.json();
}

// Actualizar una mascota
export async function updatePet(petId, petData) {
  const response = await fetch(`${API_URL}/pets/${petId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(petData),
  });
  if (!response.ok) {
    throw new Error('Error updating pet');
  }
  return response.json();
}

// Eliminar una mascota
export async function deletePet(petId) {
  const response = await fetch(`${API_URL}/pets/${petId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error deleting pet');
  }
  return response.json();
}