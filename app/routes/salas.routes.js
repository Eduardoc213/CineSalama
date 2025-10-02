module.exports = app => {
  const controller = require("../controllers/salas.controller");
  const router = require("express").Router();

  router.post("/", controller.create);
  router.get("/", controller.findAll);
  router.get("/:id", controller.findById);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);
  router.get("/:id/asientos", controller.findAllAsientosBySala);
  
  app.use("/api/salas", router);
};
