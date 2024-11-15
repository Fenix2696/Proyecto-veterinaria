// script_update_password.js
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function updatePassword() {
    const uri = "tu_uri_de_mongodb";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("mi_base_de_datos");
        
        // Generar hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('ricardo12345', salt);

        // Actualizar el usuario
        await db.collection('users').updateOne(
            { email: "ricardo@gmail.com" },
            { $set: { password: hashedPassword } }
        );

        console.log('Contraseña actualizada exitosamente');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

updatePassword();