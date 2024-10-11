document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.getElementById('itemList');
    const itemForm = document.getElementById('itemForm');
    const itemInput = document.getElementById('itemInput');

    // Función para cargar y mostrar items
    const loadItems = async () => {
        try {
            const response = await fetch('/api/items');
            const items = await response.json();
            itemList.innerHTML = items.map(item => `<li>${item.name}</li>`).join('');
        } catch (error) {
            console.error('Error al cargar items:', error);
        }
    };

    // Cargar items al iniciar
    loadItems();

    // Manejar el envío del formulario
    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = itemInput.value.trim();
        if (name) {
            try {
                const response = await fetch('/api/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name }),
                });
                if (response.ok) {
                    itemInput.value = '';
                    loadItems();  // Recargar la lista después de añadir
                }
            } catch (error) {
                console.error('Error al añadir item:', error);
            }
        }
    });
});