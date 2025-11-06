const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./app/models');

const PORT = process.env.PORT || 3000;
const app = express();

// ✅ LISTA ACTUALIZADA DE ORÍGENES PERMITIDOS
const allowedOrigins = (process.env.CORS_ORIGINS || 
  'http://localhost:3000,http://localhost:3001,http://192.168.0.3:3001,https://cinesalamafrontend.onrender.com')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

console.log('🌐 Orígenes permitidos:', allowedOrigins);

// ✅ CONFIGURACIÓN MEJORADA DE CORS
const corsOptions = {
  origin: function (origin, callback) {
    // En desarrollo, permitir todos los orígenes
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔓 Desarrollo: Permitiendo origen ${origin}`);
      return callback(null, true);
    }
    
    // En producción, permitir requests sin origin (servidor a servidor)
    if (!origin) {
      console.log('🔓 Request sin origin (servidor a servidor)');
      return callback(null, true);
    }
    
    // Verificar si el origen está en la lista permitida
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ Origen permitido: ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ Origen bloqueado por CORS: ${origin}`);
      console.log(`📋 Orígenes permitidos: ${allowedOrigins.join(', ')}`);
      // En lugar de error, devolver false para que el navegador muestre el error claramente
      callback(null, false);
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
    'x-access-token',
    'Access-Control-Allow-Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MIDDLEWARE PARA LOGS DETALLADOS DE CORS
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});


app.options('/*', cors(corsOptions));

app.get('/', (req, res) => {
  console.log('✅ Ruta raíz accedida desde:', req.headers.origin);
  res.json({ 
    message: "Bienvenido a la API del cine.",
    origin: req.headers.origin,
    cors: "Configurado correctamente"
  });
});

// ... el resto de tu código se mantiene igual ...

// ✅ RUTA ESPECÍFICA PARA DIAGNÓSTICO DE CORS
app.get('/api/cors-test', (req, res) => {
  res.json({
    message: "✅ CORS está funcionando correctamente",
    yourOrigin: req.headers.origin,
    allowedOrigins: allowedOrigins,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ SINCRONIZAR BD (tu código actual)
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Base de datos sincronizada');
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
      console.log(`🌐 Prueba local: http://localhost:${PORT}/api/cors-test`);
      console.log(`🌐 Prueba CORS: https://cinesalamafrontend.onrender.com`);
      console.log(`📋 Orígenes permitidos:`, allowedOrigins);
    });
    
    server.on('error', (error) => {
      console.error('❌ Error del servidor:', error);
    });
  })
  .catch(err => {
    console.error('❌ Error al sincronizar la base de datos:', err);
    process.exit(1);
  });