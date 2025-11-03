// app/routes/auth.routes.js
module.exports = app => {
  const auth = require('../controllers/auth.controller.js');
  const router = require('express').Router();

  // Ruta existente
  router.post('/login', auth.login);

  // --- NUEVAS RUTAS ---
  router.post('/forgot-password', auth.forgotPassword);
  router.post('/reset-password', auth.resetPassword);

  app.use('/api/auth', router);
};