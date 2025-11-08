// index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db');

// 1. Conectar a la BD
conectarDB();

const app = express();

app.use(express.json()); // Habilita express para que pueda leer JSON
app.use(cors()); // Permite que tu frontend se conecte a este backend

// ... (código anterior: middlewares, etc.)

// 4. Rutas
app.get('/', (req, res) => {
  res.send('API de Biblioteca funcionando ¡Correctamente!');
});

// ------ AÑADE ESTAS LÍNEAS ------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/libros', require('./routes/libros'));
app.use('/api/prestamos', require('./routes/prestamos'));
app.use('/api/usuarios', require('./routes/usuarios'));

// 5. Definir el puerto
const PORT = process.env.PORT || 4000; 

// 6. Arrancar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});