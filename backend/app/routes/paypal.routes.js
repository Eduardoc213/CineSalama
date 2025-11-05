module.exports = app => {
  const paypal = require('../controllers/paypal.controller.js');
  const router = require('express').Router();
  
  // Crear orden de pago
  router.post('/create-order', paypal.createOrder);

  // Capturar orden de pago
  router.post('/capture-order', paypal.captureOrder);

  app.use('/api/paypal', router);
};