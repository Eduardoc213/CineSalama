const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./app/models');

const PORT = process.env.PORT || 3000;
const app = express();

// Lista segura de orígenes separada por comas (puedes definirla en .env)
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3001,http://192.168.0.3:3001')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow non-browser requests (curl, Postman) when origin is undefined
    if (!origin) return callback(null, true);
    return allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Origin','X-Requested-With','Content-Type','Accept','Authorization'],
};

app.use(cors(corsOptions));

// opcional: responder OPTIONS antes de rutas
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: "Bienvenido a la API del cine." });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/usuarios.routes')(app);
require('./app/routes/promos.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/snacks.routes')(app);
require('./app/routes/peliculas.routes')(app);
require('./app/routes/salas.routes')(app);
require('./app/routes/asientos.routes')(app);
require('./app/routes/estrenos.routes')(app);
require('./app/routes/funciones.routes')(app);
require('./app/routes/reservas.routes')(app);
require('./app/routes/ventas.routes')(app);
require('./app/routes/venta_items.routes')(app);
require('./app/routes/pagos.routes')(app);
require('./app/routes/facturas.routes')(app);
require('./app/routes/catalogo.routes')(app);
require('./app/routes/historial_puntos.routes')(app);
require('./app/routes/tarjetas_lealtad.routes')(app);
require('./app/routes/redemptions.routes')(app);


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