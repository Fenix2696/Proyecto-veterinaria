const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

app.use(cors());
app.use(express.json());

let db;
let petsCollection;
let ownersCollection;

MongoClient.connect(mongoUri, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    
    petsCollection = db.collection('pets');
    ownersCollection = db.collection('owners');
    
    // Opcional: Crear índices
    petsCollection.createIndex({ name: 1 });
    ownersCollection.createIndex({ email: 1 }, { unique: true });

    // Importar y usar las rutas
    const petsRoutes = require('./routes/pets')(petsCollection);
    const ownersRoutes = require('./routes/owners')(ownersCollection);

    app.use('/api/pets', petsRoutes);
    app.use('/api/owners', ownersRoutes);

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
