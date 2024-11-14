const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Login simplificado sin bcrypt
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Usuario hardcodeado para pruebas
    if (username === "admin" && password === "admin123") {
      const token = jwt.sign(
        { id: '1', role: 'admin' },
        process.env.JWT_SECRET || 'veterinaria-secret',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: { 
          id: '1', 
          username: 'admin', 
          role: 'admin' 
        }
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;