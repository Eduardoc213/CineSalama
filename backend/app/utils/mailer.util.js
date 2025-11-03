// app/utils/mailer.util.js
const nodemailer = require('nodemailer');

// Configura el 'transporter' usando las variables de .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // tu-correo-de-gmail@gmail.com
    pass: process.env.EMAIL_PASS, // tu contraseña de aplicación de 16 letras
  },
});

/**
 * Envía un correo de reseteo de contraseña
 * @param {string} to - El correo del destinatario
 * @param {string} token - El token de reseteo
 */
exports.sendResetEmail = (to, token) => {
  // IMPORTANTE: Esta URL debe apuntar a tu FRONTEND
  // Asumiendo que tu Next.js corre en el puerto 3001
  const resetUrl = `http://localhost:3001/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Restablece tu contraseña de CineHa',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="text-align: center; color: #333;">Restablece tu Contraseña</h2>
        <p>Hola,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña en CineHa. Si no fuiste tú, puedes ignorar este correo.</p>
        <p>Haz clic en el siguiente botón para continuar. Este enlace expira en 15 minutos:</p>
        <p style="text-align: center; margin: 25px 0;">
          <a href="${resetUrl}" style="background-color: #000000; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Restablecer Contraseña
          </a>
        </p>
        <p>Si el botón no funciona, copia y pega esta URL en tu navegador:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p style="margin-top: 30px; font-size: 0.9em; color: #777;">Gracias,<br>El equipo de CineHa</p>
      </div>
    `,
  };

  // Devuelve la promesa para que el controlador sepa si se envió
  return transporter.sendMail(mailOptions);
};