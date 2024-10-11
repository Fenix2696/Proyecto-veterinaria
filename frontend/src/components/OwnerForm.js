export default class OwnerForm {
    constructor(onSubmit) {
        this.onSubmit = onSubmit;
    }

    render() {
        return `
            <h2>Añadir Nuevo Propietario</h2>
            <form id="owner-form">
                <input type="text" id="owner-name" placeholder="Nombre" required>
                <input type="email" id="owner-email" placeholder="Email" required>
                <button type="submit">Añadir Propietario</button>
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
