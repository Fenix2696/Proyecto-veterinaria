require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function updatePassword() {
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
        const hashedPassword = await bcrypt.hash('ricardo12345', salt);

        // Actualizar el usuario
        const result = await db.collection('users').updateOne(
            { email: "ricardo@gmail.com" },
            { $set: { password: hashedPassword } }
        );

        if (result.matchedCount > 0) {
            console.log('Contraseña actualizada exitosamente');
        } else {
            console.log('No se encontró el usuario');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

updatePassword();