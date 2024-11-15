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
    localStorage.setItem('user', JSON.stringify(data.user));
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
        localStorage.removeItem('user');
        throw new Error('Token inválido');
    }
    return response.json();
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

// Funciones de usuarios
export async function registerUser(userData) {
    const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en registro');
    }
    return response.json();
}

export async function getUsers() {
    const response = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return response.json();
}

export async function updateUser(userId, userData) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Error al actualizar usuario');
    return response.json();
}

export async function deleteUser(userId) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar usuario');
    return response.json();
}

// Funciones para propietarios
export async function getOwners() {
    const response = await fetch(`${API_URL}/owners`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener propietarios');
    return response.json();
}

export async function getOwnerById(ownerId) {
    const response = await fetch(`${API_URL}/owners/${ownerId}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener propietario');
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

export async function updateOwner(ownerId, ownerData) {
    const response = await fetch(`${API_URL}/owners/${ownerId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(ownerData),
    });
    if (!response.ok) throw new Error('Error al actualizar propietario');
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

export async function getPetById(petId) {
    const response = await fetch(`${API_URL}/pets/${petId}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener mascota');
    return response.json();
}

export async function getPetsByOwner(ownerId) {
    const response = await fetch(`${API_URL}/pets?ownerId=${ownerId}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener mascotas del propietario');
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

export async function updatePet(petId, petData) {
    const response = await fetch(`${API_URL}/pets/${petId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(petData),
    });
    if (!response.ok) throw new Error('Error al actualizar mascota');
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

// Función de utilidad para manejar errores
export function handleError(error) {
    console.error('Error:', error);
    if (error.message.includes('Token inválido') || error.message.includes('No hay token')) {
        logout();
    }
    return error.message;
}

// Agregar estas funciones al api.js existente

// Funciones del Dashboard
export async function getDashboardStats() {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener estadísticas');
    return response.json();
}

export async function getRecentActivity() {
    const response = await fetch(`${API_URL}/dashboard/activity`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener actividad reciente');
    return response.json();
}

// Función para obtener todas las estadísticas del dashboard
export async function getDashboardData() {
    try {
        const [owners, pets] = await Promise.all([
            getOwners(),
            getPets()
        ]);

        // Calcular estadísticas
        const stats = {
            totalOwners: owners.length,
            totalPets: pets.length,
            recentOwners: owners.slice(-5).reverse(), // Últimos 5 propietarios
            recentPets: pets.slice(-5).reverse(),     // Últimas 5 mascotas
            petsByOwner: {},
            // Puedes agregar más estadísticas aquí
        };

        // Calcular mascotas por propietario
        pets.forEach(pet => {
            if (pet.ownerId) {
                stats.petsByOwner[pet.ownerId] = (stats.petsByOwner[pet.ownerId] || 0) + 1;
            }
        });

        return stats;
    } catch (error) {
        throw new Error('Error al obtener datos del dashboard: ' + error.message);
    }
}

// También necesitarás estas funciones para las gráficas si las usas
export async function getMonthlyStats() {
    const response = await fetch(`${API_URL}/dashboard/monthly-stats`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener estadísticas mensuales');
    return response.json();
}

export async function getPetDistribution() {
    const response = await fetch(`${API_URL}/dashboard/pet-distribution`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener distribución de mascotas');
    return response.json();
}

// Función para actualizar el dashboard en tiempo real
export async function updateDashboard() {
    try {
        const stats = await getDashboardData();
        
        // Actualizar elementos del DOM
        document.getElementById('total-pets').textContent = stats.totalPets;
        document.getElementById('total-owners').textContent = stats.totalOwners;

        // Actualizar lista de propietarios recientes
        const recentOwnersList = document.getElementById('recent-owners');
        if (recentOwnersList) {
            recentOwnersList.innerHTML = stats.recentOwners.map(owner => `
                <li class="recent-item">
                    <span class="name">${owner.name}</span>
                    <span class="email">${owner.email}</span>
                </li>
            `).join('');
        }

        // Actualizar lista de mascotas recientes
        const recentPetsList = document.getElementById('recent-pets');
        if (recentPetsList) {
            recentPetsList.innerHTML = stats.recentPets.map(pet => `
                <li class="recent-item">
                    <span class="name">${pet.name}</span>
                    <span class="owner">(${pet.ownerName || 'Sin dueño'})</span>
                </li>
            `).join('');
        }

        return stats;
    } catch (error) {
        console.error('Error actualizando dashboard:', error);
        handleError(error);
    }
}

// Función para inicializar el dashboard
export async function initializeDashboard() {
    try {
        await updateDashboard();
        // Actualizar el dashboard cada 5 minutos
        setInterval(updateDashboard, 5 * 60 * 1000);
    } catch (error) {
        console.error('Error inicializando dashboard:', error);
        handleError(error);
    }
}