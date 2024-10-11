import PetForm from './components/PetForm.js';
import PetList from './components/PetList.js';
import OwnerForm from './components/OwnerForm.js';
import OwnerList from './components/OwnerList.js';

class App {
    constructor() {
        this.pets = []; // Aquí guardarás las mascotas
        this.owners = []; // Aquí guardarás los propietarios
        this.init();
    }

    async init() {
        // Inicializa la interfaz
        this.render();
        // Configura los formularios
        this.setupPetForm();
        this.setupOwnerForm();
        // Carga mascotas y propietarios de la base de datos
        await this.loadPets();
        await this.loadOwners();
    }

    async loadPets() {
        const pets = await this.fetchPets();
        this.petList.updatePets(pets);
        this.render(); // Para actualizar la lista
    }

    async fetchPets() {
        const response = await fetch('http://localhost:5000/api/pets');
        return response.json();
    }

    setupPetForm() {
        const petForm = new PetForm(this.addPet.bind(this));
        document.getElementById('app').innerHTML += petForm.render();
        petForm.setupListeners();
    }

    async addPet(petData) {
        await fetch('http://localhost:5000/api/pets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(petData),
        });
        await this.loadPets(); // Recargar la lista después de agregar
    }

    async deletePet(petId) {
        await fetch(`http://localhost:5000/api/pets/${petId}`, {
            method: 'DELETE',
        });
        await this.loadPets(); // Recargar la lista después de eliminar
    }

    render() {
        // Renderiza la lista de mascotas
        this.petList = new PetList(this.pets, this.deletePet.bind(this));
        document.getElementById('app').innerHTML += this.petList.render();

        // Renderiza la lista de propietarios
        this.ownerList = new OwnerList(this.owners, this.deleteOwner.bind(this));
        document.getElementById('app').innerHTML += this.ownerList.render();
    }

    async loadOwners() {
        const owners = await this.fetchOwners();
        this.ownerList.updateOwners(owners);
        this.render(); // Para actualizar la lista
    }

    async fetchOwners() {
        const response = await fetch('http://localhost:5000/api/owners');
        return response.json();
    }

    setupOwnerForm() {
        const ownerForm = new OwnerForm(this.addOwner.bind(this));
        document.getElementById('app').innerHTML += ownerForm.render();
        ownerForm.setupListeners();
    }

    async addOwner(ownerData) {
        await fetch('http://localhost:5000/api/owners', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ownerData),
        });
        await this.loadOwners(); // Recargar la lista después de agregar
    }

    async deleteOwner(ownerId) {
        await fetch(`http://localhost:5000/api/owners/${ownerId}`, {
            method: 'DELETE',
        });
        await this.loadOwners(); // Recargar la lista después de eliminar
    }
}

const app = new App();
