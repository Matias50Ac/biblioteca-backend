// routes/libros.js
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth'); // Nuestros guardias
const Libro = require('../models/libro'); // Modelo de Libro

// GET /api/libros (Obtener todos los libros)
// Esta ruta es PÚBLICA (para Estudiantes y Admins)
router.get('/', async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});

// POST /api/libros (Crear un libro)
// Esta ruta es PRIVADA (Solo Admin)
// Fíjate cómo pasamos los middlewares en un array: [verifyToken, isAdmin]
router.post('/', [verifyToken, isAdmin], async (req, res) => {
  const { titulo, autor, isbn } = req.body;
  try {
    const nuevoLibro = new Libro({ titulo, autor, isbn });
    await nuevoLibro.save();
    res.status(201).json(nuevoLibro);
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});

// PUT /api/libros/:id (Actualizar un libro)
// Esta ruta es PRIVADA (Solo Admin)
router.put('/:id', [verifyToken, isAdmin], async (req, res) => {
  const { titulo, autor, isbn, disponible } = req.body;
  try {
    let libro = await Libro.findById(req.params.id);
    if (!libro) {
      return res.status(404).json({ msg: 'Libro no encontrado' });
    }

    // Actualizamos los campos
    libro.titulo = titulo || libro.titulo;
    libro.autor = autor || libro.autor;
    libro.isbn = isbn || libro.isbn;
    libro.disponible = disponible !== undefined ? disponible : libro.disponible;

    await libro.save();
    res.json(libro);
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});

// DELETE /api/libros/:id (Borrar un libro)
// Esta ruta es PRIVADA (Solo Admin)
router.delete('/:id', [verifyToken, isAdmin], async (req, res) => {
  try {
    let libro = await Libro.findById(req.params.id);
    if (!libro) {
      return res.status(404).json({ msg: 'Libro no encontrado' });
    }

    await libro.deleteOne(); // Usamos deleteOne() en Mongoose 
    res.json({ msg: 'Libro eliminado' });
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;