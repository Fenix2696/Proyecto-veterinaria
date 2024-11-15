const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (petsCollection) => {
    const router = express.Router();

    // Obtener todas las mascotas
    router.get('/', async (req, res) => {
        try {
            const pets = await petsCollection.find().toArray();
            res.json(pets);
        } catch (error) {
            console.error('Error fetching pets:', error);
            res.status(500).json({ message: 'Error fetching pets' });
        }
    });

    // Añadir una nueva mascota
    router.post('/', async (req, res) => {
        const petData = req.body;
        try {
            const result = await petsCollection.insertOne(petData);
            res.status(201).json({ ...petData, _id: result.insertedId });
        } catch (error) {
            console.error('Error adding pet:', error);
            res.status(500).json({ message: 'Error adding pet' });
        }
    });

    // Obtener una mascota específica por ID
    router.get('/:id', async (req, res) => {
        const petId = req.params.id;
        try {
            const pet = await petsCollection.findOne({ _id: new ObjectId(petId) });
            if (pet) {
                res.json(pet);
            } else {
                res.status(404).json({ message: 'Pet not found' });
            }
        } catch (error) {
            console.error('Error fetching pet:', error);
            res.status(500).json({ message: 'Error fetching pet' });
        }
    });

    // Actualizar una mascota
    router.put('/:id', async (req, res) => {
        const petId = req.params.id;
        const petData = req.body;
        try {
            const result = await petsCollection.updateOne(
                { _id: new ObjectId(petId) },
                { $set: petData }
            );
            if (result.matchedCount > 0) {
                res.json({ message: 'Pet updated successfully' });
            } else {
                res.status(404).json({ message: 'Pet not found' });
            }
        } catch (error) {
            console.error('Error updating pet:', error);
            res.status(500).json({ message: 'Error updating pet' });
        }
    });

    // Eliminar una mascota
    router.delete('/:id', async (req, res) => {
        const petId = req.params.id;
        try {
            const result = await petsCollection.deleteOne({ _id: new ObjectId(petId) });
            if (result.deletedCount > 0) {
                res.json({ message: 'Pet deleted successfully' });
            } else {
                res.status(404).json({ message: 'Pet not found' });
            }
        } catch (error) {
            console.error('Error deleting pet:', error);
            res.status(500).json({ message: 'Error deleting pet' });
        }
    });

    return router;
};