const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config();
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({
    origin: ['https://proyecto-veterinaria-uf7y.onrender.com']
}));

app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'veterinaria';

MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db(dbName);

    const ownersCollection = db.collection('owners');
    const petsCollection = db.collection('pets');

    // Rutas
    app.use('/api/auth', authRoutes);
    
    const ownersRouter = require('./routes/owners')(ownersCollection);
    const petsRouter = require('./routes/pets')(petsCollection);

    app.use('/api/owners', ownersRouter);
    app.use('/api/pets', petsRouter);

    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });