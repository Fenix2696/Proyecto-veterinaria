// src/services/api.js
const API_URL = 'https://proyecto-veterinaria-uf7y.onrender.com/api';

// Funciones de autenticación
export async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en login');
    }
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
}

export async function verifyToken() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No hay token');

    const response = await fetch(`${API_URL}/auth/verify`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        localStorage.removeItem('token');
        throw new Error('Token inválido');
    }
    return response.json();
}

export function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

// Función para obtener headers con autorización
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Funciones para propietarios
export async function getOwners() {
    const response = await fetch(`${API_URL}/owners`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener propietarios');
    return response.json();
}

export async function addOwner(ownerData) {
    const response = await fetch(`${API_URL}/owners`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(ownerData),
    });
    if (!response.ok) throw new Error('Error al agregar propietario');
    return response.json();
}

export async function deleteOwner(ownerId) {
    const response = await fetch(`${API_URL}/owners/${ownerId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar propietario');
    return response.json();
}

// Funciones para mascotas
export async function getPets() {
    const response = await fetch(`${API_URL}/pets`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener mascotas');
    return response.json();
}

export async function addPet(petData) {
    const response = await fetch(`${API_URL}/pets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(petData),
    });
    if (!response.ok) throw new Error('Error al agregar mascota');
    return response.json();
}

export async function deletePet(petId) {
    const response = await fetch(`${API_URL}/pets/${petId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar mascota');
    return response.json();
}