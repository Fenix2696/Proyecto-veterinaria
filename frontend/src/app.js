import PetList from './components/PetList.js';
import PetForm from './components/PetForm.js';
import { getPets, createPet } from './services/api.js';

class App {
    constructor() {
        this.pets = [];
        this.petList = new PetList(this.pets, this.deletePet.bind(this));
        this.petForm = new PetForm(this.addPet.bind(this));
    }

    async init() {
        this.pets = await getPets();
        this.petList.updatePets(this.pets);
        this.render();
    }

    async addPet(petData) {
        const newPet = await createPet(petData);
        this.pets.push(newPet);
        this.petList.updatePets(this.pets);
    }

    async deletePet(id) {
        // Implement delete functionality
        // Update this.pets and this.petList
    }

    render() {
        const appDiv = document.getElementById('app');
        appDiv.innerHTML = `
            <h1>Veterinaria App</h1>
            ${this.petForm.render()}
            ${this.petList.render()}
        `;
    }
}

const app = new App();
app.init();