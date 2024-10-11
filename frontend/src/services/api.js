const API_URL = 'http://localhost:5000/api';

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

// Añadir un nuevo pet
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
