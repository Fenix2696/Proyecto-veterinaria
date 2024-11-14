// src/script.js
import { 
    login, 
    logout, 
    verifyToken, 
    getOwners, 
    addOwner, 
    deleteOwner,
    getPets,
    addPet,
    deletePet 
} from './services/api.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar si estamos en la página de login
    const isLoginPage = window.location.pathname.includes('login.html');

    if (isLoginPage) {
        setupLoginForm();
    } else {
        setupDashboard();
    }
});

// Configuración de la página de login
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');

            try {
                await login(email, password);
                window.location.href = 'index.html';
            } catch (error) {
                errorMessage.textContent = 'Credenciales inválidas';
                errorMessage.style.display = 'block';
            }
        });
    }
}

// Configuración del dashboard
async function setupDashboard() {
    try {
        await verifyToken();
        await loadOwners();
        await loadPets();
        setupEventListeners();
    } catch (error) {
        window.location.href = 'login.html';
    }
}

// Cargar propietarios
async function loadOwners() {
    try {
        const owners = await getOwners();
        updateOwnersList(owners);
        updateOwnersSelect(owners);
    } catch (error) {
        console.error('Error cargando propietarios:', error);
        showError('Error al cargar los propietarios');
    }
}

// Actualizar lista de propietarios
function updateOwnersList(owners) {
    const ownerList = document.getElementById('owner-list');
    if (ownerList) {
        ownerList.innerHTML = owners.map(owner => `
            <li>
                ${owner.name} (${owner.email})
                <button class="delete-owner" data-id="${owner._id}">Eliminar</button>
            </li>
        `).join('');
    }
}

// Actualizar select de propietarios
function updateOwnersSelect(owners) {
    const select = document.getElementById('pet-owner');
    if (select) {
        select.innerHTML = `
            <option value="">Seleccione un propietario</option>
            ${owners.map(owner => `
                <option value="${owner._id}">${owner.name}</option>
            `).join('')}
        `;
    }
}

// Cargar mascotas
async function loadPets() {
    try {
        const pets = await getPets();
        updatePetsList(pets);
    } catch (error) {
        console.error('Error cargando mascotas:', error);
        showError('Error al cargar las mascotas');
    }
}

// Actualizar lista de mascotas
function updatePetsList(pets) {
    const petList = document.getElementById('pet-list');
    if (petList) {
        petList.innerHTML = pets.map(pet => `
            <li>
                ${pet.name}
                <button class="delete-pet" data-id="${pet._id}">Eliminar</button>
            </li>
        `).join('');
    }
}

// Event Listeners
function setupEventListeners() {
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout();
        });
    }

    // Formulario de propietarios
    const ownerForm = document.getElementById('owner-form');
    if (ownerForm) {
        ownerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const ownerData = {
                name: document.getElementById('owner-name').value,
                email: document.getElementById('owner-email').value
            };
            try {
                await addOwner(ownerData);
                ownerForm.reset();
                await loadOwners();
                showSuccess('Propietario agregado exitosamente');
            } catch (error) {
                console.error('Error añadiendo propietario:', error);
                showError('Error al agregar el propietario');
            }
        });
    }

    // Formulario de mascotas
    const petForm = document.getElementById('pet-form');
    if (petForm) {
        petForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const petData = {
                name: document.getElementById('pet-name').value,
                ownerId: document.getElementById('pet-owner').value
            };
            try {
                await addPet(petData);
                petForm.reset();
                await loadPets();
                showSuccess('Mascota agregada exitosamente');
            } catch (error) {
                console.error('Error añadiendo mascota:', error);
                showError('Error al agregar la mascota');
            }
        });
    }

    // Eliminar propietario
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-owner')) {
            const ownerId = e.target.dataset.id;
            if (confirm('¿Está seguro de eliminar este propietario?')) {
                try {
                    await deleteOwner(ownerId);
                    await loadOwners();
                    await loadPets();
                    showSuccess('Propietario eliminado exitosamente');
                } catch (error) {
                    console.error('Error eliminando propietario:', error);
                    showError('Error al eliminar el propietario');
                }
            }
        }
    });

    // Eliminar mascota
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-pet')) {
            const petId = e.target.dataset.id;
            if (confirm('¿Está seguro de eliminar esta mascota?')) {
                try {
                    await deletePet(petId);
                    await loadPets();
                    showSuccess('Mascota eliminada exitosamente');
                } catch (error) {
                    console.error('Error eliminando mascota:', error);
                    showError('Error al eliminar la mascota');
                }
            }
        }
    });
}

// Utilidades
function showError(message) {
    alert(`Error: ${message}`);
}

function showSuccess(message) {
    alert(`Éxito: ${message}`);
}