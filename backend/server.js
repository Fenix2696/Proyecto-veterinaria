const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde el directorio 'dist' del frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db(dbName);

    const petsCollection = db.collection('pets');
    const ownersCollection = db.collection('owners');

    // Importar y usar las rutas
    const ownersRouter = require('./routes/owners')(ownersCollection);
const petsRouter = require('./routes/pets')(petsCollection);

app.use('/api/owners', ownersRouter);
app.use('/api/pets', petsRouter);

    // Manejar cualquier solicitud que no sea de la API
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });

    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Manejador de errores general
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});