module.exports = app => {
  const redemptions = require('../controllers/redemptions.controller.js');
  const router = require('express').Router();

  // Registrar redención de promo por usuario
  router.post('/', redemptions.create);

  // Consultar todas las redenciones
  router.get('/', redemptions.findAll);

  // Consultar redenciones por usuario
  router.get('/usuario/:usuarioId', redemptions.findByUsuario);

  // Consultar una redención por ID
  router.get('/:id', redemptions.findOne);

  // Eliminar una redención
  //router.delete('/:id', redemptions.delete);

  app.use('/api/redemptions', router);
};