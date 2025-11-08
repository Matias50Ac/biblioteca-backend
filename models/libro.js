// models/Libro.js
const mongoose = require('mongoose');

const LibroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true, // Quita espacios en blanco al inicio y al final
  },
  autor: {
    type: String,
    required: true,
    trim: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true, // El ISBN debe ser único
  },
  disponible: {
    type: Boolean,
    default: true, // Por defecto, un libro nuevo está disponible
  },
});

module.exports = mongoose.model('Libro', LibroSchema);