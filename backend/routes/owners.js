const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (ownersCollection) => {
    const router = express.Router();

    // Obtener todos los propietarios
    router.get('/', async (req, res) => {
        try {
            const owners = await ownersCollection.find().toArray();
            res.json(owners);
        } catch (error) {
            console.error('Error fetching owners:', error);
            res.status(500).json({ message: 'Error fetching owners' });
        }
    });

    // Añadir un nuevo propietario
    router.post('/', async (req, res) => {
        const ownerData = req.body;
        try {
            const result = await ownersCollection.insertOne(ownerData);
            res.status(201).json({ ...ownerData, _id: result.insertedId });
        } catch (error) {
            console.error('Error adding owner:', error);
            res.status(500).json({ message: 'Error adding owner' });
        }
    });

    // Obtener un propietario específico por ID
    router.get('/:id', async (req, res) => {
        const ownerId = req.params.id;
        try {
            const owner = await ownersCollection.findOne({ _id: new ObjectId(ownerId) });
            if (owner) {
                res.json(owner);
            } else {
                res.status(404).json({ message: 'Owner not found' });
            }
        } catch (error) {
            console.error('Error fetching owner:', error);
            res.status(500).json({ message: 'Error fetching owner' });
        }
    });

    // Actualizar un propietario
    router.put('/:id', async (req, res) => {
        const ownerId = req.params.id;
        const ownerData = req.body;
        try {
            const result = await ownersCollection.updateOne(
                { _id: new ObjectId(ownerId) },
                { $set: ownerData }
            );
            if (result.matchedCount > 0) {
                res.json({ message: 'Owner updated successfully' });
            } else {
                res.status(404).json({ message: 'Owner not found' });
            }
        } catch (error) {
            console.error('Error updating owner:', error);
            res.status(500).json({ message: 'Error updating owner' });
        }
    });

    // Eliminar un propietario
    router.delete('/:id', async (req, res) => {
        const ownerId = req.params.id;
        try {
            const result = await ownersCollection.deleteOne({ _id: new ObjectId(ownerId) });
            if (result.deletedCount > 0) {
                res.json({ message: 'Owner deleted successfully' });
            } else {
                res.status(404).json({ message: 'Owner not found' });
            }
        } catch (error) {
            console.error('Error deleting owner:', error);
            res.status(500).json({ message: 'Error deleting owner' });
        }
    });

    return router;
};