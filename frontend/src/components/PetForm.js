export default class PetForm {
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