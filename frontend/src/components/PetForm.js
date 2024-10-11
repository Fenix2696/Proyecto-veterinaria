export default class PetForm {
    constructor(onSubmit) {
        this.onSubmit = onSubmit;
    }

    render() {
        return `
            <h2>Añadir Nueva Mascota</h2>
            <form id="pet-form">
                <input type="text" id="pet-name" placeholder="Nombre" required>
                <input type="text" id="pet-species" placeholder="Especie" required>
                <button type="submit">Añadir Mascota</button>
            </form>
        `;
    }

    setupListeners() {
        const form = document.getElementById('pet-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('pet-name').value;
            const species = document.getElementById('pet-species').value;
            this.onSubmit({ name, species });
            form.reset();
        });
    }
}