class Login {
  constructor() {
      this.form = document.getElementById('login-form');
      this.errorMessage = document.getElementById('error-message');
      this.setupListeners();
  }

  setupListeners() {
      this.form.addEventListener('submit', async (e) => {
          e.preventDefault();
          await this.handleLogin();
      });
  }

  async handleLogin() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
          const response = await fetch('https://proyecto-veterinaria-uf7y.onrender.com/api/auth/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password })
          });

          const data = await response.json();

          if (!response.ok) {
              throw new Error(data.message || 'Error al iniciar sesión');
          }

          localStorage.setItem('token', data.token);
          window.location.href = 'index.html';
      } catch (error) {
          this.errorMessage.textContent = error.message;
          this.errorMessage.style.display = 'block';
      }
  }
}

// Inicializar solo si estamos en la página de login
if (document.getElementById('login-form')) {
  new Login();
}

export default Login;