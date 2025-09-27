module.exports = app => {
  const snacks = require('../controllers/snacks.controller.js');
  const router = require('express').Router();

  router.post('/', snacks.create);

  router.get('/', snacks.findAll);

  router.get('/:id', snacks.findOne);

  router.put('/:id', snacks.update);

  router.delete('/:id', snacks.delete);

  app.use('/api/snacks', router);
};