const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./app/models');

const PORT = process.env.PORT || 3000;
const app = express();

// ✅ CAPTURAR ERRORES NO MANEJADOS
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

// Lista segura de orígenes
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://192.168.0.3:3001,https://cinesalamafrontend.onrender.com')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

console.log('🌐 Orígenes permitidos:', allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    if (!origin) return callback(null, true);
    return allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'x-access-token'
  ],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MIDDLEWARE PARA LOGS DE RUTAS
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  console.log('✅ Ruta raíz accedida');
  res.json({ message: "Bienvenido a la API del cine." });
});

// ✅ CARGAR RUTAS CON MANEJO DE ERRORES
console.log('🔄 Cargando rutas...');

const loadRoute = (routePath, routeName) => {
  try {
    require(routePath)(app);
    console.log(`✅ ${routeName} cargado`);
    return true;
  } catch (error) {
    console.error(`❌ Error cargando ${routeName}:`, error.message);
    return false;
  }
};

// Cargar rutas individualmente para identificar cuál falla
loadRoute('./app/routes/auth.routes', 'auth.routes');
loadRoute('./app/routes/usuarios.routes', 'usuarios.routes');
loadRoute('./app/routes/promos.routes', 'promos.routes');
loadRoute('./app/routes/user.routes', 'user.routes');
loadRoute('./app/routes/snacks.routes', 'snacks.routes');
loadRoute('./app/routes/peliculas.routes', 'peliculas.routes');
loadRoute('./app/routes/salas.routes', 'salas.routes');
loadRoute('./app/routes/asientos.routes', 'asientos.routes');
loadRoute('./app/routes/estrenos.routes', 'estrenos.routes');
loadRoute('./app/routes/funciones.routes', 'funciones.routes');
loadRoute('./app/routes/reservas.routes', 'reservas.routes');
loadRoute('./app/routes/ventas.routes', 'ventas.routes');
loadRoute('./app/routes/venta_items.routes', 'venta_items.routes');
loadRoute('./app/routes/pagos.routes', 'pagos.routes');
loadRoute('./app/routes/facturas.routes', 'facturas.routes');
loadRoute('./app/routes/catalogo.routes', 'catalogo.routes');
loadRoute('./app/routes/historial_puntos.routes', 'historial_puntos.routes');
loadRoute('./app/routes/tarjetas_lealtad.routes', 'tarjetas_lealtad.routes');
loadRoute('./app/routes/redemptions.routes', 'redemptions.routes');
loadRoute('./app/routes/paypal.routes', 'paypal.routes');

// ✅ RUTA PARA VERIFICAR
app.get('/api/routes', (req, res) => {
  res.json({ 
    message: "API funcionando",
    availableRoutes: [
      '/api/auth/login',
      '/api/peliculas',
      '/api/funciones'
    ]
  });
});

// ✅ SINCRONIZAR BD CON MANEJO DE ERRORES
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Base de datos sincronizada');
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
      console.log(`🌐 Prueba: http://localhost:${PORT}/`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api/routes`);
    });
    
    // ✅ MANEJAR ERRORES DEL SERVIDOR
    server.on('error', (error) => {
      console.error('❌ Error del servidor:', error);
    });
    
  })
  .catch(err => {
    console.error('❌ Error al sincronizar la base de datos:', err);
    process.exit(1);
  });

// ✅ MANTENER EL PROCESO ACTIVO
console.log('🔄 Servidor iniciado, manteniendo proceso activo...');