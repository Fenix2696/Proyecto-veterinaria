// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (usersCollection) => {
    const router = express.Router();

    // Login
    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            // Buscar usuario por email
            const user = await usersCollection.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Verificar contraseña
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Crear token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    });

    // Verificar token
    router.get('/verify', async (req, res) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            
            if (!token) {
                return res.status(401).json({ message: 'No autorizado' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await usersCollection.findOne({ _id: decoded.userId });

            if (!user) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }

            const { password, ...userData } = user;
            res.json({ user: userData });
        } catch (error) {
            res.status(401).json({ message: 'Token inválido' });
        }
    });

    return router;
};

// routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

module.exports = (usersCollection) => {
    const router = express.Router();

    // Middleware para verificar token
    const auth = async (req, res, next) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            
            if (!token) {
                return res.status(401).json({ message: 'No autorizado' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

            if (!user) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Token inválido' });
        }
    };

    // Obtener todos los usuarios (protegido)
    router.get('/', auth, async (req, res) => {
        try {
            const users = await usersCollection.find({}).toArray();
            // Eliminar las contraseñas antes de enviar
            const usersWithoutPasswords = users.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            res.json(usersWithoutPasswords);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener usuarios' });
        }
    });

    // Registrar un nuevo usuario
    router.post('/register', async (req, res) => {
        try {
            const { email, password, name, role = 'veterinario' } = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await usersCollection.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'El usuario ya existe' });
            }

            // Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Crear nuevo usuario
            const result = await usersCollection.insertOne({
                email,
                password: hashedPassword,
                name,
                role,
                createdAt: new Date()
            });

            res.status(201).json({ 
                message: 'Usuario creado exitosamente',
                userId: result.insertedId
            });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({ message: 'Error al crear usuario' });
        }
    });

    // Actualizar usuario
    router.put('/:id', auth, async (req, res) => {
        try {
            const { password, ...updateData } = req.body;
            const userId = req.params.id;

            // Si se proporciona una nueva contraseña, encriptarla
            if (password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            }

            const result = await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $set: updateData }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.json({ message: 'Usuario actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar usuario' });
        }
    });

    // Eliminar usuario
    router.delete('/:id', auth, async (req, res) => {
        try {
            const result = await usersCollection.deleteOne({
                _id: new ObjectId(req.params.id)
            });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.json({ message: 'Usuario eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar usuario' });
        }
    });

    return router;
};