const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./app/models');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
  res.json({ message: "Bienvenido a la API del cine." });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/usuarios.routes')(app);
require('./app/routes/promos.routes')(app);
require('./app/routes/user.routes')(app);



db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });