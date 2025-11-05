const db = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler.util.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { sendResetEmail } = require('../utils/mailer.util.js'); 


exports.login = async (req, res) => {
  console.log('📨 Petición de login recibida:', req.body.email);
  
  if (!req.body.email || !req.body.password) {
    console.log('❌ Faltan credenciales');
    return sendError(res, "El email y la contraseña son requeridos.", 400);
  }

  try {
    console.log('🔍 Buscando usuario:', req.body.email);
    const usuario = await db.Usuario.findOne({ where: { email: req.body.email } });

    if (!usuario) {
      console.log('❌ Usuario no encontrado:', req.body.email);
      return sendError(res, "Credenciales inválidas.", 404); 
    }

    console.log('✅ Usuario encontrado, verificando contraseña...');
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      usuario.password
    );

    if (!passwordIsValid) {
      console.log('❌ Contraseña inválida para usuario:', req.body.email);
      return sendError(res, "Credenciales inválidas.", 401); 
    }

    console.log('✅ Login exitoso, generando token...');
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

    console.log('✅ Login completado para:', req.body.email);
    sendSuccess(res, userInfo, "Inicio de sesión exitoso.");

  } catch (err) {
    console.error('❌ Error en login:', err);
    sendError(res, err.message);
  }
};


exports.forgotPassword = async (req, res) => {
  console.log('📨 Petición de forgot-password recibida:', req.body.email);
  try {
    const { email } = req.body;
    if (!email) {
      console.log('❌ Correo no proporcionado');
      return sendError(res, "El correo es requerido.", 400);
    }
    
    console.log('🔍 Buscando usuario para reseteo:', email);
    const usuario = await db.Usuario.findOne({ where: { email } });

    if (!usuario) {
      console.log('⚠️  Usuario no encontrado (respuesta genérica):', email);
      // Por seguridad, no revelamos si el usuario existe.
      return sendSuccess(res, null, "Si el correo está registrado, recibirás un enlace.");
    }

    console.log('✅ Usuario encontrado, generando token de reseteo...');
    // Crea un token de reseteo especial (de corta duración)
    const resetToken = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // ¡Solo 15 minutos de validez!
    );

    console.log('✉️  Enviando correo de reseteo a:', email);
    // Envía el correo usando el 'mailer' que creamos
    await sendResetEmail(usuario.email, resetToken);

    console.log('✅ Solicitud de reseteo completada para:', email);
    sendSuccess(res, null, "Si el correo está registrado, recibirás un enlace.");

  } catch (err) {
    console.error('❌ Error en forgotPassword:', err);
    // Damos una respuesta genérica para no filtrar información
    sendSuccess(res, null, "Si el correo está registrado, recibirás un enlace.");
  }
};


exports.resetPassword = async (req, res) => {
  console.log('📨 Petición de reset-password recibida.');
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      console.log('❌ Faltan token o nueva contraseña');
      return sendError(res, "Token y nueva contraseña son requeridos.", 400);
    }

    // 1. Verifica el token
    console.log('🔍 Verificando token...');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log('❌ Token inválido o expirado:', err.message);
      return sendError(res, "El enlace es inválido o ha expirado.", 401);
    }
    
    console.log('✅ Token verificado. Hasheando nueva contraseña...');
    // 2. Hashea la nueva contraseña
    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    // 3. Actualiza al usuario en la BD
    console.log('🔄 Actualizando contraseña para usuario ID:', decoded.id);
    const [updated] = await db.Usuario.update(
      { password: hashedPassword },
      { where: { id: decoded.id } } // Busca por el ID que estaba en el token
    );

    if (updated === 0) {
      console.log('❌ No se encontró usuario para actualizar ID:', decoded.id);
      return sendError(res, "No se pudo encontrar al usuario para actualizar.", 404);
    }

    console.log('✅ Contraseña actualizada exitosamente para ID:', decoded.id);
    sendSuccess(res, null, "Contraseña actualizada exitosamente.");

  } catch (err) {
    console.error('❌ Error en resetPassword:', err);
    sendError(res, err.message);
  }
};