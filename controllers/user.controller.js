const db = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler.util.js');
const Usuario = db.Usuario;

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