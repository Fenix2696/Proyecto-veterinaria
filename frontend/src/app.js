import { getOwners, addOwner, deleteOwner, getPets, addPet, deletePet } from './services/api.js';
import OwnerForm from './components/OwnerForm.js';
import OwnerList from './components/OwnerList.js';
import PetForm from './components/PetForm.js';
import PetList from './components/PetList.js';

class App {
    constructor() {
        this.owners = [];
        this.pets = [];
        this.ownerForm = new OwnerForm(this.handleAddOwner.bind(this));
        this.ownerList = new OwnerList(this.handleDeleteOwner.bind(this));
        this.petForm = new PetForm(this.handleAddPet.bind(this), this.owners);
        this.petList = new PetList(this.handleDeletePet.bind(this), this.owners);
        this.init();
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
            await this.loadPets(); // Recargar mascotas en caso de que se hayan eliminado algunas
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
    window.app = new App();
});