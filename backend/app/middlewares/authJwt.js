const jwt = require("jsonwebtoken");
const db = require('../models');

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      success: false,
      message: "No se proporcionó un token."
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "No autorizado. El token es inválido o ha expirado."
      });
    }
    req.userId = decoded.id;
    next();
  });
};

// --- NUEVA FUNCIÓN ---
// Verifica si el rol del usuario es Administrador
const isAdmin = async (req, res, next) => {
  try {
    const usuario = await db.Usuario.findByPk(req.userId);
    if (usuario.rol.toLowerCase() === "admin") {
      next(); // Si es admin, permite continuar
      return;
    }
    // Si no es admin, niega el acceso
    res.status(403).send({
      success: false,
      message: "Acceso denegado. Se requiere Rol de Administrador."
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "No se pudo verificar el rol del usuario."
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin // Exportamos ambas funciones
};