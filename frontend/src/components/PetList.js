export default class PetList {
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