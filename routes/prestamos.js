// routes/prestamos.js
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const Prestamo = require('../models/prestamo');
const Libro = require('../models/libro');
const Usuario = require('../models/usuario'); // <-- ¡AÑADE ESTA LÍNEA!
// POST /api/prestamos (Crear un préstamo) - SOLO ADMIN
router.post('/', [verifyToken, isAdmin], async (req, res) => {
  const { libroId, usuarioId } = req.body;

  try {
    // 1. Verificar que el libro esté disponible
    const libro = await Libro.findById(libroId);
    if (!libro || !libro.disponible) {
      return res.status(400).json({ msg: 'El libro no está disponible' });
    }

    // 2. Crear el préstamo
    const nuevoPrestamo = new Prestamo({
      libro: libroId,
      usuario: usuarioId,
      fechaPrestamo: new Date()
    });
    await nuevoPrestamo.save();

    // 3. Marcar el libro como NO disponible
    libro.disponible = false;
    await libro.save();

    res.status(201).json(nuevoPrestamo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

// PUT /api/prestamos/:id/devolver (Devolver un libro) - SOLO ADMIN
router.put('/:id/devolver', [verifyToken, isAdmin], async (req, res) => {
  try {
    const prestamo = await Prestamo.findById(req.params.id);

    if (!prestamo) {
      return res.status(404).json({ msg: 'Préstamo no encontrado' });
    }
    if (prestamo.fechaDevolucion) {
      return res.status(400).json({ msg: 'Este libro ya fue devuelto' });
    }

    // 1. Marcar el préstamo como devuelto
    prestamo.fechaDevolucion = new Date();
    await prestamo.save();
    
    // 2. Marcar el libro como disponible nuevamente
    await Libro.findByIdAndUpdate(prestamo.libro, { disponible: true });

    res.json(prestamo);
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});

// GET /api/prestamos/mis-prestamos (Ver mis préstamos) - ESTUDIANTE
// (El estudiante solo necesita estar logueado, por eso solo usamos 'verifyToken')
router.get('/mis-prestamos', verifyToken, async (req, res) => {
  try {
    // req.usuario.id viene del token que inyectó el middleware 'verifyToken'
    const prestamos = await Prestamo.find({ usuario: req.usuario.id })
     .populate('libro', 'titulo autor'); // .populate "rellena" los datos del libro
     res.json(prestamos);
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});

// GET /api/prestamos (Ver TODOS los préstamos) - SOLO ADMIN
router.get('/', [verifyToken, isAdmin], async (req, res) => {
  try {
     const prestamos = await Prestamo.find()
     .populate('libro', 'titulo')
     .populate('usuario', 'nombre email'); // Rellenamos datos de libro y usuario
     res.json(prestamos);
   } catch (error) {
     res.status(500).send('Error del servidor');
   }
});

module.exports = router;