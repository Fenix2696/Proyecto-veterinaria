// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

module.exports = (usersCollection) => {
    const router = express.Router();

    // Login
    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log('Intento de login para:', email); // Log para debugging

            // Buscar usuario por email
            const user = await usersCollection.findOne({ email });
            if (!user) {
                console.log('Usuario no encontrado:', email);
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Verificar contraseña
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('Contraseña incorrecta para:', email);
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Crear token
            const token = jwt.sign(
                { 
                    userId: user._id,
                    email: user.email,
                    role: user.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            console.log('Login exitoso para:', email);

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
            const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

            if (!user) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }

            const { password, ...userData } = user;
            res.json({ user: userData });
        } catch (error) {
            console.error('Error en verificación de token:', error);
            res.status(401).json({ message: 'Token inválido' });
        }
    });

    // Registro de usuario
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

            console.log('Usuario registrado:', email);

            res.status(201).json({ 
                message: 'Usuario creado exitosamente',
                userId: result.insertedId
            });
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({ message: 'Error al crear usuario' });
        }
    });

    // Cambiar contraseña
    router.post('/change-password', async (req, res) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ message: 'No autorizado' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { currentPassword, newPassword } = req.body;

            const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Verificar contraseña actual
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Contraseña actual incorrecta' });
            }

            // Encriptar nueva contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Actualizar contraseña
            await usersCollection.updateOne(
                { _id: new ObjectId(decoded.userId) },
                { $set: { password: hashedPassword } }
            );

            res.json({ message: 'Contraseña actualizada exitosamente' });
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            res.status(500).json({ message: 'Error al cambiar contraseña' });
        }
    });

    // Logout (opcional, ya que el token se maneja del lado del cliente)
    router.post('/logout', (req, res) => {
        res.json({ message: 'Sesión cerrada exitosamente' });
    });

    // Recuperación de contraseña (envío de email)
    router.post('/forgot-password', async (req, res) => {
        try {
            const { email } = req.body;
            const user = await usersCollection.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Aquí irían las funciones para enviar email de recuperación
            // Por ahora solo enviamos una respuesta exitosa
            res.json({ message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña' });
        } catch (error) {
            console.error('Error en recuperación de contraseña:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    });

    return router;
};