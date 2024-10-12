import { getOwners, addOwner, deleteOwner, getPets, addPet, deletePet } from './services/api.js';

class OwnerList {
    constructor(owners, deleteCallback) {
        this.owners = owners;
        this.deleteCallback = deleteCallback;
    }

    render() {
        return `
            <h2>Lista de Propietarios</h2>
            <ul>
                ${this.owners.map(owner => `
                    <li>
                        ${owner.name} (${owner.email})
                        <button onclick="app.deleteOwner('${owner._id}')">Eliminar</button>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    updateOwners(owners) {
        this.owners = owners;
    }
}

class PetList {
    constructor(pets, deleteCallback) {
        this.pets = pets;
        this.deleteCallback = deleteCallback;
    }

    render() {
        return `
            <h2>Lista de Mascotas</h2>
            <ul>
                ${this.pets.map(pet => `
                    <li>
                        ${pet.name} (Dueño ID: ${pet.ownerId})
                        <button onclick="app.deletePet('${pet._id}')">Eliminar</button>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    updatePets(pets) {
        this.pets = pets;
    }
}

class App {
    constructor() {
        this.owners = [];
        this.pets = [];
        this.init();
    }

    async init() {
        this.render();
        this.setupListeners();
        await this.loadOwners();
        await this.loadPets();
    }

    async loadOwners() {
        try {
            this.owners = await getOwners();
            this.render();
        } catch (error) {
            console.error('Error loading owners:', error);
            this.showError('Error al cargar los propietarios');
        }
    }

    async loadPets() {
        try {
            this.pets = await getPets();
            this.render();
        } catch (error) {
            console.error('Error loading pets:', error);
            this.showError('Error al cargar las mascotas');
        }
    }

    async addOwner(ownerData) {
        try {
            await addOwner(ownerData);
            await this.loadOwners();
            this.showSuccess('Propietario agregado exitosamente');
        } catch (error) {
            console.error('Error adding owner:', error);
            this.showError('Error al agregar el propietario');
        }
    }

    async deleteOwner(ownerId) {
        try {
            await deleteOwner(ownerId);
            await this.loadOwners();
            this.showSuccess('Propietario eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting owner:', error);
            this.showError('Error al eliminar el propietario');
        }
    }

    async addPet(petData) {
        try {
            await addPet(petData);
            await this.loadPets();
            this.showSuccess('Mascota agregada exitosamente');
        } catch (error) {
            console.error('Error adding pet:', error);
            this.showError('Error al agregar la mascota');
        }
    }

    async deletePet(petId) {
        try {
            await deletePet(petId);
            await this.loadPets();
            this.showSuccess('Mascota eliminada exitosamente');
        } catch (error) {
            console.error('Error deleting pet:', error);
            this.showError('Error al eliminar la mascota');
        }
    }

    render() {
        const appContainer = document.getElementById('app');
        const ownerList = new OwnerList(this.owners, this.deleteOwner.bind(this));
        const petList = new PetList(this.pets, this.deletePet.bind(this));
        
        appContainer.innerHTML = `
            <h1>Veterinaria App</h1>
            
            <h2>Agregar Propietario</h2>
            <form id="owner-form">
                <input type="text" id="ownerName" placeholder="Nombre del propietario" required>
                <input type="email" id="ownerEmail" placeholder="Email" required>
                <button type="submit">Agregar Propietario</button>
            </form>

            ${ownerList.render()}

            <h2>Agregar Mascota</h2>
            <form id="pet-form">
                <input type="text" id="petName" placeholder="Nombre de la mascota" required>
                <input type="text" id="petOwnerId" placeholder="ID del propietario" required>
                <button type="submit">Agregar Mascota</button>
            </form>

            ${petList.render()}
        `;

        this.setupListeners();
    }

    setupListeners() {
        const ownerForm = document.getElementById('owner-form');
        ownerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('ownerName').value;
            const email = document.getElementById('ownerEmail').value;
            await this.addOwner({ name, email });
            ownerForm.reset();
        });

        const petForm = document.getElementById('pet-form');
        petForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('petName').value;
            const ownerId = document.getElementById('petOwnerId').value;
            await this.addPet({ name, ownerId });
            petForm.reset();
        });
    }

    showError(message) {
        alert(`Error: ${message}`);
    }

    showSuccess(message) {
        alert(`Éxito: ${message}`);
    }
}

// Inicializar la aplicación
const app = new App();

// Hacer la instancia de App disponible globalmente
window.app = app;