const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors({
    origin: ['https://proyecto-veterinaria-uf7y.onrender.com', 'http://localhost:3000']
}));
app.use(express.json());

// Configuración MongoDB
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'veterinaria';

MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        const db = client.db(dbName);

        // Inicializar colecciones
        const usersCollection = db.collection('users');
        const ownersCollection = db.collection('owners');
        const petsCollection = db.collection('pets');

        // Configurar rutas con las colecciones
        const authRouter = require('./routes/auth')(usersCollection);
        const usersRouter = require('./routes/users')(usersCollection);
        const ownersRouter = require('./routes/owners')(ownersCollection);
        const petsRouter = require('./routes/pets')(petsCollection);

        // Usar las rutas
        app.use('/api/auth', authRouter);
        app.use('/api/users', usersRouter);
        app.use('/api/owners', ownersRouter);
        app.use('/api/pets', petsRouter);

        // Servir archivos estáticos
        app.use(express.static(path.join(__dirname, '../frontend/public')));

        // Ruta para todas las demás peticiones
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
        });

        // Iniciar servidor
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    });