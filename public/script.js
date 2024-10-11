document.addEventListener('DOMContentLoaded', () => {
    const apiButton = document.getElementById('apiButton');
    const apiResponse = document.getElementById('apiResponse');

    apiButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/hello');
            const data = await response.json();
            apiResponse.textContent = data.message;
        } catch (error) {
            apiResponse.textContent = 'Error al llamar a la API';
            console.error('Error:', error);
        }
    });
});