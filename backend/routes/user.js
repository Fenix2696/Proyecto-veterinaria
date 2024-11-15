const express = require('express');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

module.exports = (usersCollection) => {
    const router = express.Router();

    // Obtener todos los usuarios
    router.get('/', auth, async (req, res) => {
        try {
            const users = await usersCollection.find({}).toArray();
            const usersWithoutPasswords = users.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            res.json(usersWithoutPasswords);
        } catch (error) {
            console.error('Error getting users:', error);
            res.status(500).json({ message: 'Error al obtener usuarios' });
        }
    });

    // Registrar nuevo usuario
    router.post('/register', async (req, res) => {
        try {
            const { email, password, name } = req.body;

            const existingUser = await usersCollection.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'El usuario ya existe' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const result = await usersCollection.insertOne({
                email,
                password: hashedPassword,
                name,
                role: 'veterinario',
                createdAt: new Date()
            });

            res.status(201).json({ 
                message: 'Usuario creado exitosamente',
                userId: result.insertedId 
            });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Error al crear usuario' });
        }
    });

    // Actualizar usuario
    router.put('/:id', auth, async (req, res) => {
        try {
            const { password, ...updateData } = req.body;
            const userId = req.params.id;

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
            console.error('Error updating user:', error);
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
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Error al eliminar usuario' });
        }
    });

    return router;
};