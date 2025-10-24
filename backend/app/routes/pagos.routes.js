module.exports = app => {
  const pagos = require('../controllers/pagos.controller.js');
  const router = require('express').Router();

  // Registrar un pago
  router.post('/', pagos.create);

  // Consultar todos los pagos
  router.get('/', pagos.findAll);

  // Consultar pagos por venta
  router.get('/venta/:ventaId', pagos.findByVenta);

  // Consultar un pago por ID
  router.get('/:id', pagos.findOne);

  // Actualizar un pago
  //router.put('/:id', pagos.update);

  // Eliminar un pago
  //router.delete('/:id', pagos.delete);

  app.use('/api/pagos', router);
};