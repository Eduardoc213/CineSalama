const db = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler.util.js');
const Usuario = db.Usuario;
const bcrypt = require('bcryptjs'); // <-- Importante: Añadimos bcrypt

// --- Tu función existente ---
exports.getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.userId);

    if (!usuario) {
      return sendError(res, "Usuario no encontrado.", 404);
    }

    sendSuccess(res, {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      rol: usuario.rol
    });

  } catch (err) {
    sendError(res, err.message);
  }
};

// --- FUNCIÓN NUEVA AÑADIDA ---
// Esta función actualiza el perfil del usuario que está logueado
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // Obtenido del token (verifyToken)
    const { nombre, telefono, password } = req.body;

    // 1. Prepara los datos a actualizar
    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (telefono) updateData.telefono = telefono;

    // 2. Maneja la contraseña (solo si se provee una nueva)
    if (password) {
      if (password.length < 6) {
        return sendError(res, "La contraseña debe tener al menos 6 caracteres.", 400);
      }
      // Si el usuario mandó una contraseña, la hasheamos
      updateData.password = bcrypt.hashSync(password, 8);
    }

    // 3. Actualiza en la base de datos
    const [updated] = await Usuario.update(updateData, {
      where: { id: userId }
    });

    if (updated === 0) {
      return sendError(res, "No se pudo actualizar el usuario.", 404);
    }

    sendSuccess(res, null, "Perfil actualizado exitosamente.");

  } catch (err) {
    sendError(res, err.message);
  }
};