// frontend/src/components/Login.js
class Login {
  constructor() {
      // Evitar múltiples instancias
      if (localStorage.getItem('token')) {
          window.location.href = '/index.html';
          return;
      }
      this.setupListeners();
  }

  setupListeners() {
      const form = document.getElementById('login-form');
      if (!form) return; // Evitar errores si el formulario no existe

      form.removeEventListener('submit', this.handleSubmit); // Remover listener previo
      form.addEventListener('submit', this.handleSubmit);
  }

  async handleSubmit(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const errorMsg = document.getElementById('error-message');

      try {
          const response = await fetch('https://proyecto-veterinaria-uf7y.onrender.com/api/auth/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ username, password })
          });

          if (!response.ok) {
              throw new Error('Credenciales inválidas');
          }

          const data = await response.json();
          localStorage.setItem('token', data.token);
          window.location.href = '/index.html';
      } catch (error) {
          errorMsg.style.display = 'block';
          errorMsg.textContent = 'Usuario o contraseña incorrectos';
      }
  }
}

// Solo inicializar si estamos en la página de login
if (document.getElementById('login-form')) {
  new Login();
}

export default Login;