const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

let db;

MongoClient.connect(mongoUri, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db(dbName);
    })
    .catch(error => console.error('MongoDB connection error:', error));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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
        res.status(201).json(result.ops ? result.ops[0] : result.insertedId);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear item' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use((req, res) => {
    res.status(404).send('Página no encontrada');
  });