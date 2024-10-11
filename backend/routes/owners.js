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
      res.status(500).send('Error fetching owners');
    }
  });

  // Añadir un nuevo propietario
  router.post('/', async (req, res) => {
    const ownerData = req.body;
    try {
      const result = await ownersCollection.insertOne(ownerData);
      res.status(201).json(result.ops[0]);
    } catch (error) {
      res.status(500).send('Error adding owner');
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
        res.status(404).send('Owner not found');
      }
    } catch (error) {
      res.status(500).send('Error fetching owner');
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
        res.status(404).send('Owner not found');
      }
    } catch (error) {
      res.status(500).send('Error updating owner');
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
        res.status(404).send('Owner not found');
      }
    } catch (error) {
      res.status(500).send('Error deleting owner');
    }
  });

  return router;
};
