export default class PetList {
    constructor(pets, onDelete) {
        this.pets = pets;
        this.onDelete = onDelete;
    }

    updatePets(newPets) {
        this.pets = newPets;
    }

    render() {
        return `
            <h2>Lista de Mascotas</h2>
            <ul>
                ${this.pets.map(pet => `
                    <li>
                        ${pet.name} - ${pet.species}
                        <button onclick="app.deletePet('${pet._id}')">Eliminar</button>
                    </li>
                `).join('')}
            </ul>
        `;
    }
}