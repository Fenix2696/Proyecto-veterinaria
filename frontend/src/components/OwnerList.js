export default class OwnerList {
    constructor(owners, onDelete) {
        this.owners = owners;
        this.onDelete = onDelete;
    }

    updateOwners(newOwners) {
        this.owners = newOwners;
    }

    render() {
        return `
            <h2>Lista de Propietarios</h2>
            <ul>
                ${this.owners.map(owner => `
                    <li>
                        ${owner.name} - ${owner.email}
                        <button onclick="app.deleteOwner('${owner._id}')">Eliminar</button>
                    </li>
                `).join('')}
            </ul>
        `;
    }
}
