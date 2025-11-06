const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./app/models');

const PORT = process.env.PORT || 3000;
const app = express();

// ✅ LISTA ACTUALIZADA DE ORÍGENES PERMITIDOS - CORREGIR DOMINIO
const allowedOrigins = (process.env.CORS_ORIGINS || 
  'http://localhost:3000,http://localhost:3001,http://192.168.0.3:3001,https://cinesalamafrontend.cremeter.com')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

console.log('🌐 Orígenes permitidos:', allowedOrigins);

// ✅ CONFIGURACIÓN SIMPLIFICADA DE CORS
const corsOptions = {
  origin: function (origin, callback) {
    // En desarrollo, permitir todos los orígenes
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // En producción, permitir requests sin origin
    if (!origin) return callback(null, true);
    
    // Verificar si el origen está en la lista permitida
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ Origen bloqueado: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'x-access-token'
  ]
};

// ✅ SOLO ESTE MIDDLEWARE CORS - EL MÁS IMPORTANTE
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MIDDLEWARE PARA LOGS
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ 
    message: "Bienvenido a la API del cine.",
    status: "✅ Funcionando correctamente"
  });
});

// ✅ CARGAR RUTAS (tu código actual)
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

// Cargar rutas individualmente
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

// ✅ RUTA DE VERIFICACIÓN
app.get('/api/health', (req, res) => {
  res.json({ 
    message: "API funcionando",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ SINCRONIZAR BD
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Base de datos sincronizada');
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('❌ Error al sincronizar la base de datos:', err);
    process.exit(1);
  });