require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createUser() {
    // Usar la variable de entorno
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('Error: MONGODB_URI no está definida en las variables de entorno');
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado a MongoDB');
        
        const db = client.db(process.env.MONGODB_DB || 'mi_base_de_datos');
        
        // Generar hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('test123', salt);

        // Crear nuevo usuario
        const result = await db.collection('users').insertOne({
            email: "test@test.com",
            password: hashedPassword,
            role: "veterinario",
            createdAt: new Date()
        });

        console.log('Usuario creado exitosamente con ID:', result.insertedId);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

createUser();