class App {
    constructor() {
        this.owners = []; // Aquí guardarás los propietarios
        this.init();
    }

    async init() {
        // Inicializa la interfaz
        this.render();
        // Configura los formularios
        this.setupOwnerForm();
        this.setupPetForm();
        // Carga propietarios de la base de datos
        await this.loadOwners();
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
        const ownerForm = document.getElementById('owner-form');
        ownerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const ownerName = document.getElementById('ownerName').value;
            const ownerEmail = document.getElementById('ownerEmail').value;
            await this.addOwner({ name: ownerName, email: ownerEmail });
            ownerForm.reset();
        });
    }

    async addOwner(ownerData) {
        await fetch('http://localhost:5000/api/owners', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ownerData),
        });
        await this.loadOwners(); // Recargar la lista después de agregar
    }

    setupPetForm() {
        const petForm = document.getElementById('pet-form');
        petForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const petName = document.getElementById('petName').value;
            const petOwnerId = document.getElementById('petOwnerId').value;
            await this.addPet({ name: petName, ownerId: petOwnerId });
            petForm.reset();
        });
    }

    async addPet(petData) {
        await fetch('http://localhost:5000/api/pets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(petData),
        });
        // Si necesitas cargar las mascotas después de agregar, puedes implementar esta funcionalidad.
    }

    render() {
        // Renderiza la lista de propietarios
        this.ownerList = new OwnerList(this.owners, this.deleteOwner.bind(this));
        document.getElementById('output').innerHTML = this.ownerList.render();
    }
}

const app = new App();
