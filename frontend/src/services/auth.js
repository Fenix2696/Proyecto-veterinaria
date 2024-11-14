const API_URL = 'https://proyecto-veterinaria-uf7y.onrender.com/api';

export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) throw new Error('Login failed');
        
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    } catch (error) {
        throw new Error('Error en login');
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};