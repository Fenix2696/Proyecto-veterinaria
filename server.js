const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

app.use(express.static('public'));
app.use(express.json());

let db;

MongoClient.connect(mongoUri)
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db(dbName);
    })
    .catch(error => console.error('MongoDB connection error:', error));

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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});