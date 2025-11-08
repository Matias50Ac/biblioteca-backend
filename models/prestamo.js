// models/Prestamo.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PrestamoSchema = new Schema({
  // 'ref' le dice a Mongoose a qué otro modelo está apuntando este ID
  libro: {
    type: Schema.Types.ObjectId,
    ref: 'Libro', // Se refiere al modelo 'Libro' que creamos
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario', // Se refiere al modelo 'Usuario'
    required: true,
  },
  fechaPrestamo: {
    type: Date,
    default: Date.now,
  },
  fechaDevolucion: {
    type: Date,
    default: null, // Será 'null' hasta que el libro sea devuelto
  },
});

module.exports = mongoose.model('Prestamo', PrestamoSchema);