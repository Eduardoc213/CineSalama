module.exports = app => {
  const catalogo = require('../controllers/catalogo.controller.js');
  const router = require('express').Router();

  // Listar películas
  router.get('/peliculas', catalogo.listPeliculas);

  // Listar funciones
  router.get('/funciones', catalogo.listFunciones);

  // Listar snacks
  router.get('/snacks', catalogo.listSnacks);

  // Listar promociones
  router.get('/promos', catalogo.listPromos);

  // Listar estrenos
  router.get('/estrenos', catalogo.listEstrenos);

  app.use('/api/catalogo', router);
};