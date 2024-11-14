// frontend/src/services/auth.js
export const loginUser = async (credentials) => {
  const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
  });
  
  if (!response.ok) {
      throw new Error('Error en la autenticación');
  }
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

export const verifyToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
      throw new Error('No token found');
  }

  const response = await fetch('/api/auth/verify', {
      headers: {
          'Authorization': `Bearer ${token}`
      }
  });

  if (!response.ok) {
      localStorage.removeItem('token');
      throw new Error('Token inválido');
  }

  return await response.json();
};
