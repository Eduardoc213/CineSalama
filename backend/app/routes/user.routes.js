// app/routes/user.routes.js
module.exports = app => {
  const { verifyToken } = require("../middlewares/authJwt.js");
  // Asegúrate de importar ambas funciones
  const controller = require("../controllers/user.controller.js");
  const router = require("express").Router();

  // Ruta existente
  router.get("/profile", [verifyToken], controller.getProfile);

  // --- RUTA NUEVA AÑADIDA ---
  router.put("/profile", [verifyToken], controller.updateProfile);

  app.use('/api/user', router);
};