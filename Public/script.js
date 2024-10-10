document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('item-form');
    const input = document.getElementById('new-item');
    const list = document.getElementById('item-list');

    // Cargar items existentes
    fetch('/api/items')
        .then(response => response.json())
        .then(items => {
            items.forEach(item => addItemToList(item));
        });

    // Manejar envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = input.value.trim();
        if (name) {
            fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            })
            .then(response => response.json())
            .then(item => {
                addItemToList(item);
                input.value = '';
            });
        }
    });

    function addItemToList(item) {
        const li = document.createElement('li');
        li.textContent = item.name;
        list.appendChild(li);
    }
});