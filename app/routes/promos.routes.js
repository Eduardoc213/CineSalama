module.exports = app => {
  const promos = require('../controllers/promos.controller.js');
  const { verifyToken, isAdmin } = require("../middlewares/authJwt.js");
  const router = require('express').Router();

  router.get('/', promos.findAll);
  router.get('/:id', promos.findOne);

  router.post('/', [verifyToken, isAdmin], promos.create);
  router.put('/:id', [verifyToken, isAdmin], promos.update);
  router.delete('/:id', [verifyToken, isAdmin], promos.delete);

  app.use('/api/promos', router);
};