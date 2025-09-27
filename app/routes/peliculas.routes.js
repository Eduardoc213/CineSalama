module.exports = app => {
  const controller = require("../controllers/peliculas.controller");
  const router = require("express").Router();

  router.post("/", controller.create);
  router.get("/", controller.findAll);
  router.get("/id/:id", controller.findById);
  router.get("/titulo/:titulo", controller.findByTitulo);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);

  app.use("/api/peliculas", router);
};
