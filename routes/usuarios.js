// routes/usuarios.js
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth'); // Los guardias
const Usuario = require('../models/Usuario'); // <-- ¡CORREGIDO! (Con 'U' mayúscula)

// GET /api/usuarios (Obtener todos los usuarios)
// Esta ruta es SÚPER PRIVADA (Solo Admin)
router.get('/', [verifyToken, isAdmin], async (req, res) => {
  try {
    // Buscamos a todos los usuarios
    // .select('-password') es MUY importante.
    const usuarios = await Usuario.find().select('-password');

    res.json(usuarios);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

// --- ¡NUEVO CÓDIGO AÑADIDO! ---

// DELETE /api/usuarios/:id (Borrar un usuario) - SOLO ADMIN
router.delete('/:id', [verifyToken, isAdmin], async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // (Opcional: aquí podrías añadir lógica para no dejar que el admin se borre a sí mismo)
    // if (usuario.id === req.usuario.id) {
    //   return res.status(400).json({ msg: 'No puedes eliminar tu propia cuenta' });
    // }

    await usuario.deleteOne();
    res.json({ msg: 'Usuario eliminado' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

// PUT /api/usuarios/:id (Actualizar rol de usuario) - SOLO ADMIN
router.put('/:id', [verifyToken, isAdmin], async (req, res) => {
  const { rol } = req.body; // Solo permitimos actualizar el ROL

  if (!rol || (rol !== 'admin' && rol !== 'estudiante')) {
    return res.status(400).json({ msg: 'Rol no válido' });
  }

  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    usuario.rol = rol;
    await usuario.save();
    
    // Devolvemos el usuario sin la contraseña
    const usuarioActualizado = usuario.toObject();
    delete usuarioActualizado.password;
    
    res.json(usuarioActualizado);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;