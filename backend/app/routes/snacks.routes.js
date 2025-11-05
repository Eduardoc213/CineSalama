module.exports = app => {
  const snacks = require('../controllers/snacks.controller.js');
  const { verifyToken, isAdmin } = require("../middlewares/authJwt.js");
  const router = require('express').Router();

  router.get('/', snacks.findAll);
  router.get('/:id', snacks.findOne);
  router.post('/', [verifyToken, isAdmin], snacks.create);
  router.put('/:id', [verifyToken, isAdmin], snacks.update);
  router.delete('/:id', [verifyToken, isAdmin], snacks.delete);

  app.use('/api/snacks', router);
};