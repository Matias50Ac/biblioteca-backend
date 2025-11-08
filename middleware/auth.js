// middleware/auth.js
const jwt = require('jsonwebtoken');
// Middleware 1: "verifyToken" (Verifica si estás logueado)
// Este guardia revisa si el token (la "credencial") es válido.
const verifyToken = (req, res, next) => {
  // Obtenemos el token desde el encabezado 'Authorization'
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No hay token, permiso no válido' });
  }

  try {
    // El token suele venir como "Bearer <token>".
    // Hacemos split para quedarnos solo con la parte del <token>.
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'Formato de token no válido' });
    }

    // Verificamos el token usando nuestra clave secreta
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Si el token es válido, guardamos los datos del usuario (payload) 
    // en el objeto 'req' para usarlo en las rutas.
    req.usuario = payload;
    next(); // ¡Importante! 'next()' le dice que puede continuar.
  } catch (error) {
    res.status(401).json({ msg: 'Token no es válido' });
  }
};

// Middleware 2: "isAdmin" (Verifica si eres Admin)
// Este guardia se usa *después* de 'verifyToken'.
const isAdmin = (req, res, next) => {
  // 'req.usuario' fue añadido por el guardia 'verifyToken'
  if (!req.usuario) {
    return res.status(401).json({ msg: 'Error de autenticación' });
  }

  // Revisamos el rol que venía en el token
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado. Se requiere rol de Administrador.' });
  }
  
  next(); // Si es admin, puede continuar.
};

module.exports = { verifyToken, isAdmin };