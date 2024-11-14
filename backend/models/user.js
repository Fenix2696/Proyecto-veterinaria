// backend/models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'veterinario'], default: 'veterinario' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
