import { getOwners, getPets } from '../../services/api.js';

class Dashboard {
    constructor() {
        this.stats = {
            totalPets: 0,
            totalOwners: 0,
            petsBySpecies: {},
            recentActivity: []
        };
        this.init();
    }

    async init() {
        await this.updateStats();
        this.render();
    }

    async updateStats() {
        try {
            const [pets, owners] = await Promise.all([getPets(), getOwners()]);
            
            // Calcular mascotas por especie
            const petsBySpecies = pets.reduce((acc, pet) => {
                acc[pet.species] = (acc[pet.species] || 0) + 1;
                return acc;
            }, {});

            this.stats = {
                totalPets: pets.length,
                totalOwners: owners.length,
                petsBySpecies,
                recentOwners: owners.slice(-5), // Últimos 5 propietarios
                recentPets: pets.slice(-5) // Últimas 5 mascotas
            };
        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }

    render() {
        const dashboardHtml = `
            <div class="dashboard-container">
                <h2>Panel de Control</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Total Mascotas</h3>
                        <p class="stat-number">${this.stats.totalPets}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Total Propietarios</h3>
                        <p class="stat-number">${this.stats.totalOwners}</p>
                    </div>
                </div>

                <div class="dashboard-sections">
                    <div class="recent-activity">
                        <h3>Últimas Mascotas Registradas</h3>
                        <ul>
                            ${this.stats.recentPets?.map(pet => `
                                <li>${pet.name}</li>
                            `).join('') || 'No hay mascotas registradas'}
                        </ul>
                    </div>
                    
                    <div class="recent-activity">
                        <h3>Últimos Propietarios</h3>
                        <ul>
                            ${this.stats.recentOwners?.map(owner => `
                                <li>${owner.name}</li>
                            `).join('') || 'No hay propietarios registrados'}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = dashboardHtml;
        }
    }
}

export default Dashboard;