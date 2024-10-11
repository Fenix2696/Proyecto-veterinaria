const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

let db;

// Conexión a MongoDB
MongoClient.connect(mongoUri, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  })
  .catch(error => console.error('MongoDB connection error:', error));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.get('/api/items', async (req, res) => {
  try {
    const items = await db.collection('items').find().toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener items' });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const result = await db.collection('items').insertOne(req.body);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear item' });
  }
});

// Ruta para la página principal
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});