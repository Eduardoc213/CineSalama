module.exports = app => {
  const historialPuntos = require('../controllers/historial_puntos.controller.js');
  const router = require('express').Router();

  // Registrar movimiento de puntos
  router.post('/', historialPuntos.create);

  // Consultar todos los movimientos de puntos
  router.get('/', historialPuntos.findAll);

  // Consultar movimientos de puntos por usuario
  router.get('/usuario/:usuarioId', historialPuntos.findByUsuario);

  // Consultar un movimiento por ID
  router.get('/:id', historialPuntos.findOne);

  // Actualizar un movimiento de puntos
  //router.put('/:id', historialPuntos.update);

  // Eliminar un movimiento de puntos
  //router.delete('/:id', historialPuntos.delete);

  app.use('/api/historial-puntos', router);
};