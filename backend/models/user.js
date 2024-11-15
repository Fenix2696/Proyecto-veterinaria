const { Schema } = require('mongodb');

const userSchema = {
    email: String,
    password: String,
    name: String,
    role: {
        type: String,
        default: 'veterinario'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
};

module.exports = userSchema;