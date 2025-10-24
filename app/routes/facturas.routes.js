module.exports = app => {
  const facturas = require('../controllers/facturas.controller.js');
  const router = require('express').Router();

  // Crear factura
  router.post('/', facturas.create);

  // Consultar todas las facturas
  router.get('/', facturas.findAll);

  // Consultar facturas por venta
  router.get('/venta/:ventaId', facturas.findByVenta);

  // Consultar una factura por ID
  router.get('/:id', facturas.findOne);

  // Actualizar una factura por ID
  router.put('/:id', facturas.update);

  // Eliminar una factura
  //router.delete('/:id', facturas.delete);

  app.use('/api/facturas', router);
};