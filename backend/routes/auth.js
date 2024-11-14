const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Usuario de prueba (reemplazar con base de datos real)
        if (email === "admin@veterinaria.com" && password === "admin123") {
            const token = jwt.sign(
                { id: '1', role: 'admin' },
                process.env.JWT_SECRET || 'tu-secreto-seguro',
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: '1',
                    email: 'admin@veterinaria.com',
                    role: 'admin'
                }
            });
        } else {
            res.status(401).json({
                message: 'Correo o contraseña incorrectos'
            });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            message: 'Error en el servidor'
        });
    }
});

module.exports = router;