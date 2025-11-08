// config/db.js
const mongoose = require('mongoose');
const conectarDB = async () => {
  try {
    // Leemos la MONGO_URI desde nuestras variables de entorno
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('MongoDB Conectado');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    
    // Detiene la app si no se puede conectar
    process.exit(1); 
  }
};

module.exports = conectarDB;