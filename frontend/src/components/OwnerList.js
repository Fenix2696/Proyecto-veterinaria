export default class OwnerList {
    constructor(onDelete) {
        this.onDelete = onDelete;
        this.owners = [];
    }

    updateOwners(owners) {
        this.owners = owners;
    }

    render() {
        return `
            <h2>Lista de Propietarios</h2>
            <ul id="owner-list">
                ${this.owners.map(owner => `
                    <li>
                        ${owner.name} (${owner.email})
                        <button class="delete-owner" data-id="${owner._id}">Eliminar</button>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    setupListeners() {
        const list = document.getElementById('owner-list');
        list.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-owner')) {
                const ownerId = e.target.getAttribute('data-id');
                this.onDelete(ownerId);
            }
        });
    }
}