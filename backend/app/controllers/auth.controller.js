const db = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler.util.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendResetEmail } = require('../utils/mailer.util.js');

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
      rol: usuario.rol,
      token: token
    };

    sendSuccess(res, userInfo, "Inicio de sesión exitoso.");

  } catch (err) {
    sendError(res, err.message);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendError(res, "El correo es requerido.", 400);
    }
    
    const usuario = await db.Usuario.findOne({ where: { email } });

    if (!usuario) {
      return sendSuccess(res, null, "Si el correo está registrado, recibirás un enlace.");
    }

    const resetToken = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    await sendResetEmail(usuario.email, resetToken);

    sendSuccess(res, null, "Si el correo está registrado, recibirás un enlace.");

  } catch (err) {
    sendSuccess(res, null, "Si el correo está registrado, recibirás un enlace.");
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return sendError(res, "Token y nueva contraseña son requeridos.", 400);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return sendError(res, "El enlace es inválido o ha expirado.", 401);
    }
    
    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    const [updated] = await db.Usuario.update(
      { password: hashedPassword },
      { where: { id: decoded.id } }
    );

    if (updated === 0) {
      return sendError(res, "No se pudo encontrar al usuario para actualizar.", 404);
    }

    sendSuccess(res, null, "Contraseña actualizada exitosamente.");

  } catch (err) {
    sendError(res, err.message);
  }
};