// backend/routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Obtener todos los usuarios (protegido, solo admin)
router.get('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'No autorizado' });
    }
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});

// Registrar un nuevo usuario con validaciones
router.post(
    '/register',
    [
        body('username').isLength({ min: 3 }).withMessage('Username debe tener al menos 3 caracteres'),
        body('password').isLength({ min: 6 }).withMessage('Password debe tener al menos 6 caracteres'),
        body('email').isEmail().withMessage('Email inválido'),
        body('role').optional().isIn(['admin', 'veterinario']).withMessage('Role inválido')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username, password, email, name, role } = req.body;

            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'El usuario ya existe' });
            }

            user = new User({
                username,
                password,
                email,
                name,
                role: role || 'veterinario'
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();
            res.status(201).json({ message: 'Usuario creado exitosamente' });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({ message: 'Error al crear usuario' });
        }
    }
);

// Actualizar usuario con protección de roles
router.put('/:id', auth, async (req, res) => {
    const { password, ...updateData } = req.body;

    // Permitir que el usuario admin o el usuario mismo puedan actualizar
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
        return res.status(403).json({ message: 'No autorizado para actualizar este usuario' });
    }

    try {
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
});

// Eliminar usuario solo si el rol es admin
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'No autorizado para eliminar usuarios' });
    }
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
});

module.exports = router;
