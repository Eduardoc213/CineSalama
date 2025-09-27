const db = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler.util.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return sendError(res, "El email y la contraseña son requeridos.", 400);
  }

  try {
    const usuario = await db.Usuario.findOne({ where: { email: req.body.email } });

    if (!usuario) {
      return sendError(res, "Credenciales inválidas.", 404); 
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      usuario.password
    );

    if (!passwordIsValid) {
      return sendError(res, "Credenciales inválidas.", 401); 
    }

    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET, 
      { expiresIn: 86400 }
    );

    const userInfo = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: token
    };

    sendSuccess(res, userInfo, "Inicio de sesión exitoso.");

  } catch (err) {
    sendError(res, err.message);
  }
};