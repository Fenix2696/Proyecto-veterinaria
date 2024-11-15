// script_create_user.js
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createUser() {
    const uri = "tu_uri_de_mongodb";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("mi_base_de_datos");
        
        // Generar hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('test123', salt);

        // Crear nuevo usuario
        await db.collection('users').insertOne({
            email: "test@test.com",
            password: hashedPassword,
            role: "veterinario"
        });

        console.log('Usuario creado exitosamente');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

createUser();