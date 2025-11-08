// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// POST /api/auth/register (Crear un usuario)
router.post('/register', async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    // 1. Revisar si el email ya existe
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // 2. Crear el nuevo usuario
    usuario = new Usuario({ nombre, email, password, rol });
    // (El 'pre-save' en el Modelo se encargará de encriptar el password)

    // 3. Guardar el usuario en la BD
    await usuario.save();

    res.status(201).json({ msg: 'Usuario creado exitosamente' });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

// POST /api/auth/login (Iniciar sesión)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Revisar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // 2. Comparar la contraseña ingresada con la de la BD
    const passCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // 3. Si todo es correcto, crear el "payload" para el token
    // (Información que guardaremos en el token)
    const payload = {
      id: usuario.id,
      rol: usuario.rol,
      nombre: usuario.nombre
    };

    // 4. Firmar el token (JWT)
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }, // El token expira en 7 días
      (error, token) => {
        if (error) throw error;
        // 5. Devolver el token al cliente (Angular)
        res.json({ token });
      }
    );

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;