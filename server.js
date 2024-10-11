const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Log para verificar el directorio actual
console.log('Directorio actual:', __dirname);

// Log para verificar el contenido de la carpeta public
fs.readdir(path.join(__dirname, 'public'), (err, files) => {
  if (err) {
    console.error('Error al leer la carpeta public:', err);
  } else {
    console.log('Contenido de la carpeta public:', files);
  }
});

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// API simple
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hola desde la API!' });
});

// Ruta para la página principal
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  console.log('Intentando servir:', indexPath);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html no encontrado');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});