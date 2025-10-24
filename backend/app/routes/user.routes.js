module.exports = app => {
  const { verifyToken } = require("../middlewares/authJwt.js");
  const controller = require("../controllers/user.controller.js");
  const router = require("express").Router();


  router.get("/profile", [verifyToken], controller.getProfile);

  app.use('/api/user', router);
};