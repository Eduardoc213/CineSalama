module.exports = app => {
  const ventas = require("../controllers/ventas.controller.js");
  const router = require("express").Router();
  const { verifyToken } = require("../middlewares/authJwt.js");

  router.post("/", ventas.create);

  router.get("/", ventas.findAll);

  router.get("/:id", ventas.findOne);


  app.use('/api/ventas', router);
};