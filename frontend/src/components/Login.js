import { login } from '../services/auth.js';

class Login {
    constructor() {
        this.setupListeners();
    }

    setupListeners() {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                await login({ username, password });
                window.location.href = '/index.html';
            } catch (error) {
                document.getElementById('error-message').style.display = 'block';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Login();
});

export default Login;