// models/Usuario.js
const mongoose = require('mongoose'); // <-- ¡AHORA SÍ ESTÁ DEFINIDO!
const bcrypt = require('bcryptjs'); // Usaremos bcrypt para encriptar

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No puede haber dos emails iguales
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
    enum: ['admin', 'estudiante'], // Solo permite estos dos valores
    default: 'estudiante',
  },
});

// Esto es un "hook" o "middleware" de Mongoose.
// Se ejecuta *antes* de que un usuario se guarde ('save').
UsuarioSchema.pre('save', async function (next) {
  // Si la contraseña no se ha modificado (ej: al editar el email), no la volvemos a encriptar
  if (!this.isModified('password')) {
    return next();
  }

  // Si la contraseña es nueva o se modificó, la encriptamos
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- ¡LA LÍNEA SEGURA, PERO AL FINAL! ---
// Esta línea "segura" revisa si el modelo ya existe antes de crearlo
module.exports = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);