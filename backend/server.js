// Verificación de variables de entorno al inicio
const requiredEnvVars = [
    'MONGODB_URI',
    'MONGODB_DB',
    'JWT_SECRET',
    'PORT'
];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`Error: Variable de entorno ${varName} no está definida`);
        process.exit(1);
    }
});

console.log('Variables de entorno cargadas correctamente');
console.log('Base de datos:', process.env.MONGODB_DB);
console.log('Ambiente:', process.env.NODE_ENV);


const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config();

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
        const dashboardRouter = require('./routes/dashboard')(db);

        // Usar las rutas
        app.use('/api/auth', authRouter);
        app.use('/api/users', usersRouter);
        app.use('/api/owners', ownersRouter);
        app.use('/api/pets', petsRouter);
        app.use('/api/dashboard', dashboardRouter);

        // Servir archivos estáticos
        app.use(express.static(path.join(__dirname, '../frontend/public')));

        // Agregar headers de seguridad
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });

        // Ruta para verificar que el servidor está funcionando
        app.get('/api/health', (req, res) => {
            res.json({ status: 'OK', timestamp: new Date() });
        });

        // Ruta catch-all para SPA
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
        });

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
            console.log(`MongoDB connected to: ${dbName}`);
        });
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    });

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});