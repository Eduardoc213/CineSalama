module.exports = app => {
  const ventas = require('../controllers/ventas.controller.js');
  const router = require('express').Router();

  router.post('/', ventas.create);

  router.get('/', ventas.findAll);

  router.get('/:id', ventas.findOne);

  // Rutas para actualizar y eliminar en caso de que se necesiten
  // router.put('/:id', ventas.update);
  // router.delete('/:id', ventas.delete);

  app.use('/api/ventas', router);
};