module.exports = app => {
  const ventaItems = require('../controllers/venta_items.controller.js');
  const router = require('express').Router();

  router.post('/', ventaItems.create);

  router.get('/', ventaItems.findAll);

  router.get('/:id', ventaItems.findOne);

  router.put('/:id', ventaItems.update);

  router.delete('/:id', ventaItems.delete);

  app.use('/api/venta-items', router);
};