const API_URL = 'https://proyecto-veterinaria-uf7y.onrender.com/api';

// Funciones de autenticación
export async function login(credentials) {
   const response = await fetch(`${API_URL}/auth/login`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(credentials),
   });
   if (!response.ok) throw new Error('Error en login');
   const data = await response.json();
   localStorage.setItem('token', data.token);
   return data;
}

export function logout() {
   localStorage.removeItem('token');
   localStorage.removeItem('user');
}

// Función para obtener headers con autorización
function getAuthHeaders() {
   const token = localStorage.getItem('token');
   return {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
   };
}

// Funciones existentes modificadas con autenticación
export async function getOwners() {
   const response = await fetch(`${API_URL}/owners`, {
       headers: getAuthHeaders()
   });
   if (!response.ok) throw new Error('Error fetching owners');
   return response.json();
}

export async function addOwner(ownerData) {
   const response = await fetch(`${API_URL}/owners`, {
       method: 'POST',
       headers: getAuthHeaders(),
       body: JSON.stringify(ownerData),
   });
   if (!response.ok) throw new Error('Error adding owner');
   return response.json();
}

export async function deleteOwner(ownerId) {
   const response = await fetch(`${API_URL}/owners/${ownerId}`, {
       method: 'DELETE',
       headers: getAuthHeaders()
   });
   if (!response.ok) throw new Error('Error deleting owner');
   return response.json();
}

export async function getPets() {
   const response = await fetch(`${API_URL}/pets`, {
       headers: getAuthHeaders()
   });
   if (!response.ok) throw new Error('Error fetching pets');
   return response.json();
}

export async function addPet(petData) {
   const response = await fetch(`${API_URL}/pets`, {
       method: 'POST',
       headers: getAuthHeaders(),
       body: JSON.stringify(petData),
   });
   if (!response.ok) throw new Error('Error adding pet');
   return response.json();
}

export async function deletePet(petId) {
   const response = await fetch(`${API_URL}/pets/${petId}`, {
       method: 'DELETE',
       headers: getAuthHeaders()
   });
   if (!response.ok) throw new Error('Error deleting pet');
   return response.json();
}

// Nuevas funciones para usuarios
export async function getUsers() {
   const response = await fetch(`${API_URL}/users`, {
       headers: getAuthHeaders()
   });
   if (!response.ok) throw new Error('Error fetching users');
   return response.json();
}

export async function addUser(userData) {
   const response = await fetch(`${API_URL}/auth/register`, {
       method: 'POST',
       headers: getAuthHeaders(),
       body: JSON.stringify(userData),
   });
   if (!response.ok) throw new Error('Error adding user');
   return response.json();
}