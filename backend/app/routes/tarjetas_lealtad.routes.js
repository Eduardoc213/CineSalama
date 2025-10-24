module.exports = app => {
  const tarjetasLealtad = require('../controllers/tarjetas_lealtad.controller.js');
  const router = require('express').Router();

  // Crear tarjeta de lealtad
  router.post('/', tarjetasLealtad.create);

  // Consultar todas las tarjetas de lealtad
  router.get('/', tarjetasLealtad.findAll);

  // Consultar tarjeta de lealtad por ID
  router.get('/:id', tarjetasLealtad.findOne);

  // Consultar tarjetas por usuario
  //router.get('/usuario/:usuarioId', tarjetasLealtad.findByUsuario);

  // Actualizar tarjeta de lealtad
  router.put('/:id', tarjetasLealtad.update);

  // Eliminar tarjeta de lealtad
  router.delete('/:id', tarjetasLealtad.delete);

  app.use('/api/tarjetas-lealtad', router);
};