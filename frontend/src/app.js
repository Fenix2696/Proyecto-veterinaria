import { getOwners, addOwner, deleteOwner, getPets, addPet, deletePet } from './services/api.js';
import { isAuthenticated, logout } from './services/auth.js';
import Dashboard from './components/Dashboard/Dashboard.js';

class OwnerForm {
    constructor(onSubmit) {
        this.onSubmit = onSubmit;
    }

    render() {
        return `
            <h2>Agregar Propietario</h2>
            <form id="owner-form">
                <input type="text" id="owner-name" placeholder="Nombre del propietario" required>
                <input type="email" id="owner-email" placeholder="Email del propietario" required>
                <button type="submit">Agregar Propietario</button>
            </form>
        `;
    }

    setupListeners() {
        const form = document.getElementById('owner-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('owner-name').value;
            const email = document.getElementById('owner-email').value;
            this.onSubmit({ name, email });
            form.reset();
        });
    }
}

class OwnerList {
    constructor(onDelete) {
        this.onDelete = onDelete;
        this.owners = [];
    }

    updateOwners(owners) {
        this.owners = owners;
    }

    render() {
        return `
            <h2>Lista de Propietarios</h2>
            <ul id="owner-list">
                ${this.owners.map(owner => `
                    <li>
                        ${owner.name} (${owner.email})
                        <button class="delete-owner" data-id="${owner._id}">Eliminar</button>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    setupListeners() {
        const list = document.getElementById('owner-list');
        list.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-owner')) {
                const ownerId = e.target.getAttribute('data-id');
                this.onDelete(ownerId);
            }
        });
    }
}

class PetForm {
    constructor(onSubmit, owners) {
        this.onSubmit = onSubmit;
        this.owners = owners;
    }

    updateOwners(owners) {
        this.owners = owners;
    }

    render() {
        return `
            <h2>Agregar Mascota</h2>
            <form id="pet-form">
                <input type="text" id="pet-name" placeholder="Nombre de la mascota" required>
                <select id="pet-owner" required>
                    <option value="">Seleccione un propietario</option>
                    ${this.owners.map(owner => `
                        <option value="${owner._id}">${owner.name}</option>
                    `).join('')}
                </select>
                <button type="submit">Agregar Mascota</button>
            </form>
        `;
    }

    setupListeners() {
        const form = document.getElementById('pet-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('pet-name').value;
            const ownerId = document.getElementById('pet-owner').value;
            this.onSubmit({ name, ownerId });
            form.reset();
        });
    }
}

class PetList {
    constructor(onDelete, owners) {
        this.onDelete = onDelete;
        this.pets = [];
        this.owners = owners;
    }

    updatePets(pets) {
        this.pets = pets;
    }

    updateOwners(owners) {
        this.owners = owners;
    }

    getOwnerName(ownerId) {
        const owner = this.owners.find(owner => owner._id === ownerId);
        return owner ? owner.name : 'Propietario desconocido';
    }

    render() {
        return `
            <h2>Lista de Mascotas</h2>
            <ul id="pet-list">
                ${this.pets.map(pet => `
                    <li>
                        ${pet.name} (Dueño: ${this.getOwnerName(pet.ownerId)})
                        <button class="delete-pet" data-id="${pet._id}">Eliminar</button>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    setupListeners() {
        const list = document.getElementById('pet-list');
        list.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-pet')) {
                const petId = e.target.getAttribute('data-id');
                this.onDelete(petId);
            }
        });
    }
}

class App {
    constructor() {
        if (!isAuthenticated()) {
            window.location.href = '/login.html';
            return;
        }

        this.setupLogoutButton();
        this.dashboard = new Dashboard();
        this.owners = [];
        this.pets = [];
        this.ownerForm = new OwnerForm(this.handleAddOwner.bind(this));
        this.ownerList = new OwnerList(this.handleDeleteOwner.bind(this));
        this.petForm = new PetForm(this.handleAddPet.bind(this), this.owners);
        this.petList = new PetList(this.handleDeletePet.bind(this), this.owners);
        this.init();
    }

    setupLogoutButton() {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.textContent = 'Cerrar Sesión';
        logoutBtn.onclick = () => logout();
        document.querySelector('#app').insertBefore(logoutBtn, document.querySelector('#app').firstChild);
    }

    async init() {
        this.renderComponents();
        await this.loadOwners();
        await this.loadPets();
    }

    renderComponents() {
        document.getElementById('owner-form-container').innerHTML = this.ownerForm.render();
        document.getElementById('owner-list-container').innerHTML = this.ownerList.render();
        document.getElementById('pet-form-container').innerHTML = this.petForm.render();
        document.getElementById('pet-list-container').innerHTML = this.petList.render();
        
        this.ownerForm.setupListeners();
        this.ownerList.setupListeners();
        this.petForm.setupListeners();
        this.petList.setupListeners();
    }

    async loadOwners() {
        try {
            this.owners = await getOwners();
            this.ownerList.updateOwners(this.owners);
            this.petForm.updateOwners(this.owners);
            this.petList.updateOwners(this.owners);
            document.getElementById('owner-list-container').innerHTML = this.ownerList.render();
            document.getElementById('pet-form-container').innerHTML = this.petForm.render();
            this.ownerList.setupListeners();
            this.petForm.setupListeners();
        } catch (error) {
            console.error('Error loading owners:', error);
            this.showError('Error al cargar los propietarios');
        }
    }

    async loadPets() {
        try {
            this.pets = await getPets();
            this.petList.updatePets(this.pets);
            document.getElementById('pet-list-container').innerHTML = this.petList.render();
            this.petList.setupListeners();
        } catch (error) {
            console.error('Error loading pets:', error);
            this.showError('Error al cargar las mascotas');
        }
    }

    async handleAddOwner(ownerData) {
        try {
            await addOwner(ownerData);
            await this.loadOwners();
            this.showSuccess('Propietario agregado exitosamente');
        } catch (error) {
            console.error('Error adding owner:', error);
            this.showError('Error al agregar el propietario');
        }
    }

    async handleDeleteOwner(ownerId) {
        try {
            await deleteOwner(ownerId);
            await this.loadOwners();
            await this.loadPets();
            this.showSuccess('Propietario eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting owner:', error);
            this.showError('Error al eliminar el propietario');
        }
    }

    async handleAddPet(petData) {
        try {
            await addPet(petData);
            await this.loadPets();
            this.showSuccess('Mascota agregada exitosamente');
        } catch (error) {
            console.error('Error adding pet:', error);
            this.showError('Error al agregar la mascota');
        }
    }

    async handleDeletePet(petId) {
        try {
            await deletePet(petId);
            await this.loadPets();
            this.showSuccess('Mascota eliminada exitosamente');
        } catch (error) {
            console.error('Error deleting pet:', error);
            this.showError('Error al eliminar la mascota');
        }
    }

    showError(message) {
        alert(`Error: ${message}`);
    }

    showSuccess(message) {
        alert(`Éxito: ${message}`);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

export default App;