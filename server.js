const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./app/models');

// Middlewares y rutas aquí...

db.sequelize.sync({ force: true })
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });
  