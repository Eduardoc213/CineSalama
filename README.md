# 🎬 CineSalama

Sistema de gestión de cine con reserva de entradas y pagos en línea.

## 📋 Descripción

CineSalama es una aplicación web fullstack que permite a los usuarios:
- 👤 Registrarse e iniciar sesión
- 🎞️ Ver películas disponibles
- 📅 Consultar horarios de funciones
- 🎟️ Reservar entradas
- 💳 Realizar pagos con PayPal

## 🏗️ Arquitectura

Monorepo con estructura de carpetas:

```
CineSalama/
├── backend/                 # API REST (Node.js + Express)
│   ├── app/
│   │   ├── config/         # Configuración de BD
│   │   ├── controllers/    # Controladores de rutas
│   │   ├── models/         # Modelos de Sequelize
│   │   ├── routes/         # Definición de rutas
│   │   ├── middleware/     # Middleware personalizado
│   │   └── utils/          # Utilidades (JWT)
│   ├── .env.example        # Variables de entorno ejemplo
│   ├── package.json
│   └── server.js           # Punto de entrada
├── frontend/               # Aplicación Next.js
│   ├── src/
│   │   ├── app/            # Páginas y layouts
│   │   ├── components/     # Componentes React
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilidades
│   │   └── styles/         # CSS/Tailwind
│   ├── public/             # Archivos estáticos
│   ├── .env.local.example  # Variables de entorno ejemplo
│   ├── package.json
│   └── next.config.mjs
├── .gitignore
└── README.md
```

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Base de Datos:** PostgreSQL (NeonDB)
- **ORM:** Sequelize
- **Autenticación:** JWT (JSON Web Tokens)
- **Pagos:** PayPal SDK

### Frontend
- **Framework:** Next.js 13+ (App Router)
- **Lenguaje:** JavaScript/JSX
- **Estilos:** Tailwind CSS
- **Cliente HTTP:** Fetch API / Axios
- **Estado:** Context API / Zustand (opcional)
- **UI:** Componentes personalizados

### Infraestructura
- **Hosting:** Render (Backend y Frontend)
- **Base de Datos:** NeonDB (PostgreSQL)
- **Versionamiento:** Git + GitHub

## 📦 Requisitos Previos

### Instalación Local
- **Node.js** v18 o superior
- **npm** v9 o superior (o pnpm)
- **Git** instalado
- Cuenta en **NeonDB** (https://console.neon.tech)
- Credenciales de **PayPal** (Sandbox)

### Verificar Versiones
```bash
node --version      # v18.0.0 o superior
npm --version       # v9.0.0 o superior
git --version       # git version 2.x.x
```

## 🚀 Instalación Local

### 1. Clonar Repositorio

```bash
git clone https://github.com/Eduardoc213/CineSalama.git
cd CineSalama
```

### 2. Configuración Backend

#### 2.1 Acceder a carpeta backend
```bash
cd backend
```

#### 2.2 Crear archivo `.env`
```bash
cp .env.example .env
```

#### 2.3 Llenar variables de entorno

Editar `backend/.env` con tus datos:

```env
# ========== BASE DE DATOS ==========
DB_HOST=pg-xxxxx.neon.tech
DB_USER=neondb_owner
DB_PASSWORD=tu_contraseña_neon
DB_NAME=neondb
DB_DIALECT=postgres
DB_PORT=5432

# ========== NODE ==========
NODE_ENV=development
PORT=3000

# ========== AUTENTICACIÓN ==========
JWT_SECRET=tu_jwt_secret_super_seguro_cambiar_en_produccion

# ========== CORS ==========
CORS_ORIGINS=http://localhost:3001,http://localhost:3000

# ========== PAYPAL ==========
PAYPAL_CLIENT_ID=tu_paypal_client_id_sandbox
PAYPAL_CLIENT_SECRET=tu_paypal_client_secret_sandbox

# ========== URLs ==========
FRONTEND_URL=http://localhost:3001
```

**¿Cómo obtener cada variable?**

| Variable                                       | Origen | Instrucciones                                                              |
|------------------------------------------------|--------|----------------------------------------------------------------------------|
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | NeonDB | https://console.neon.tech → Project → Connection String                    |
| `JWT_SECRET`                                   | Generar| `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`     | PayPal | https://developer.paypal.com → Apps & Credentials (Sandbox)                |

#### 2.4 Instalar dependencias
```bash
npm install
```

#### 2.5 Inicializar base de datos (opcional)
```bash
npm run db:seed    # Si tienes script de seed
# o
npm run db:sync    # Para sincronizar modelos
```

#### 2.6 Iniciar servidor
```bash
npm start
# o en modo desarrollo con nodemon
npm run dev
```

**Respuesta esperada:**
```
✅ Server running on http://localhost:3000
✅ Database connected successfully
```

### 3. Configuración Frontend

#### 3.1 En otra terminal, acceder a carpeta frontend
```bash
cd frontend
```

#### 3.2 Crear archivo `.env.local`
```bash
cp .env.local.example .env.local
```

#### 3.3 Llenar variables de entorno

Editar `frontend/.env.local`:

```env
# ========== API ==========
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# ========== PAYPAL ==========
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_paypal_client_id_sandbox

# ========== ENTORNO ==========
NEXT_PUBLIC_ENV=development
```

#### 3.4 Instalar dependencias
```bash
npm install
# o
pnpm install
```

#### 3.5 Iniciar servidor de desarrollo
```bash
npm run dev
# o
pnpm dev
```

**Respuesta esperada:**
```
▲ Next.js 13.x.x
- Local:        http://localhost:3001
- Environments: .env.local

✓ Ready in 2.5s
```

## 🧪 Pruebas Locales

### 1. Verificar Backend

```bash
# En terminal backend
curl http://localhost:3000/api/routes

# Respuesta esperada
{
  "message": "API funcionando",
  "timestamp": "2025-11-06T10:30:00.000Z"
}
```

### 2. Verificar Frontend

Abrir navegador en `http://localhost:3001`

Debe cargar la página principal sin errores en consola.

### 3. Prueba de Registro

1. Ir a `/registro`
2. Llenar formulario
3. Hacer clic en "Registrarse"
4. Verificar en logs del backend: `User created successfully`

### 4. Prueba de Login

1. Ir a `/login`
2. Usar credenciales creadas
3. Debe redirigir a dashboard

### 5. Prueba de Reserva (si está implementado)

1. Navegar a películas
2. Seleccionar una función
3. Seleccionar asientos
4. Completar reserva
5. Presionar "Pagar con PayPal"
6. Debe redirigir a PayPal Sandbox

## 📚 Estructura de Archivos Importante

### Backend

```
backend/
├── app/
│   ├── config/
│   │   └── database.js          # Configuración Sequelize
│   ├── controllers/
│   │   ├── auth.controller.js   # Autenticación
│   │   ├── movies.controller.js # Películas
│   │   ├── reservas.controller.js # Reservas
│   │   └── paypal.controller.js # Pagos
│   ├── models/
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── Funcion.js
│   │   └── Reserva.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── movies.routes.js
│   │   └── paypal.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # Verificar JWT
│   │   └── errorHandler.js      # Manejo de errores
│   └── utils/
│       └── jwt.util.js          # Gestión JWT
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

### Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.js            # Layout principal
│   │   ├── page.js              # Página inicio
│   │   ├── login/
│   │   ├── registro/
│   │   ├── peliculas/
│   │   ├── reservas/
│   │   └── ...
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── Card.js
│   │   └── ...
│   ├── lib/
│   │   ├── api.js               # Cliente API
│   │   ├── auth.js              # Utilidades auth
│   │   └── ...
│   └── styles/
│       └── globals.css
├── public/
├── .env.local.example
├── package.json
└── next.config.mjs
```

## 🔐 Variables de Entorno

### Backend (.env)

```env
# Requeridas en producción
DB_HOST              # Host de PostgreSQL
DB_USER              # Usuario de BD
DB_PASSWORD          # Contraseña de BD
DB_NAME              # Nombre de BD
DB_DIALECT           # postgres
NODE_ENV             # development o production
JWT_SECRET           # Clave secreta JWT (mínimo 32 caracteres)
PAYPAL_CLIENT_ID     # ID de cliente PayPal
PAYPAL_CLIENT_SECRET # Secret de PayPal

# Opcionales
PORT                 # Puerto (default: 3000)
CORS_ORIGINS         # URLs permitidas
FRONTEND_URL         # URL del frontend
```

### Frontend (.env.local)

```env
# Requeridas
NEXT_PUBLIC_API_URL           # URL base de API
NEXT_PUBLIC_PAYPAL_CLIENT_ID  # ID PayPal público

# Opcionales
NEXT_PUBLIC_ENV               # Entorno (development/production)
```

## 🐛 Debugging

### Backend

Habilitar logs detallados:

```javascript
// En server.js
import morgan from 'morgan';
app.use(morgan('dev'));
```

Ver logs en consola:
```bash
npm run dev   # Con nodemon
```

### Frontend

Abrir DevTools (F12):

1. **Console:** Ver errores de JavaScript
2. **Network:** Ver peticiones HTTP
3. **Application:** Ver localStorage/sessionStorage

## 📝 Scripts Disponibles

### Backend

```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar con nodemon (desarrollo)
npm run test       # Ejecutar tests (si existen)
npm run db:seed    # Poblar base de datos
```

### Frontend

```bash
npm run dev        # Iniciar servidor desarrollo
npm run build      # Compilar para producción
npm run start      # Iniciar compilado
npm run lint       # Ejecutar linter
```

## 🌐 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh` - Refrescar token

### Películas
- `GET /api/movies` - Listar películas
- `GET /api/movies/:id` - Detalle película
- `POST /api/movies` - Crear película (admin)
- `PUT /api/movies/:id` - Editar película (admin)
- `DELETE /api/movies/:id` - Eliminar película (admin)

### Funciones
- `GET /api/funciones` - Listar funciones
- `GET /api/funciones/:id` - Detalle función
- `POST /api/funciones` - Crear función (admin)

### Reservas
- `GET /api/reservas` - Mis reservas
- `POST /api/reservas` - Crear reserva
- `GET /api/reservas/:id` - Detalle reserva
- `DELETE /api/reservas/:id` - Cancelar reserva

### PayPal
- `POST /api/paypal/create-payment` - Crear pago
- `GET /api/paypal/execute-payment` - Ejecutar pago
- `GET /api/paypal/cancel-payment` - Cancelar pago

## 📦 Deployment en Render

Para instrucciones detalladas de deployment, consulta las secciones a continuación.

### Quick Start Render

#### Requisitos
- Cuenta en [Render](https://render.com)
- Repositorio GitHub conectado
- Variables de entorno configuradas
- NeonDB para base de datos

#### Backend Deployment

1. **Crear Web Service:**
   - Dashboard → "New +" → "Web Service"
   - Conectar repositorio `CineSalama`
   - Seleccionar rama `main`

2. **Configurar Build:**

| Campo         | Valor                       |
|-------        |-------                      |
| Name          | `cineha-backend`            |
| Environment   | Node                        |
| Region        | Ohio (o tu preferencia)     |
| Build Command | `cd backend && npm install` |
| Start Command | `cd backend && npm start`   |

3. **Configurar Variables de Entorno:**

```
DB_HOST=pg-xxxxx.neon.tech
DB_USER=neondb_owner
DB_PASSWORD=tu_contraseña
DB_NAME=neondb
DB_DIALECT=postgres
NODE_ENV=production
JWT_SECRET=generar_uuid_fuerte
CORS_ORIGINS=https://cineha-frontend.onrender.com
PAYPAL_CLIENT_ID=tu_id_produccion
PAYPAL_CLIENT_SECRET=tu_secret_produccion
FRONTEND_URL=https://cineha-frontend.onrender.com
```

4. **Deploy:**
   - Presionar "Create Web Service"
   - Esperar a que termine (5-10 minutos)

#### Frontend Deployment

1. **Crear Web Service:**
   - Dashboard → "New +" → "Web Service"
   - Conectar repositorio `CineSalama`

2. **Configurar Build:**

| Campo | Valor |
|-------|-------|
| Name | `cineha-frontend` |
| Environment | Node |
| Build Command | `cd frontend && npm install && npm run build` |
| Start Command | `cd frontend && npm run start` |

3. **Configurar Variables de Entorno:**

```
NEXT_PUBLIC_API_URL=https://cineha-backend.onrender.com/api
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_id_paypal
NODE_ENV=production
```

4. **Deploy:**
   - Presionar "Create Web Service"
   - Esperar a que termine

### Verificar Deployment

```bash
# Backend
curl https://cineha-backend.onrender.com/api/routes

# Frontend
Abrir https://cineha-frontend.onrender.com
```

### Troubleshooting Render

**Backend no inicia:**
```
Error: Cannot find module 'express'

Solución:
- Verificar que build command sea: cd backend && npm install
- Verificar que package.json esté en backend/
```

**Frontend no conecta a backend:**
```
Error: CORS policy

Solución:
- Verificar CORS_ORIGINS en backend .env
- Debe incluir https://cineha-frontend.onrender.com
- Redeploy backend después de cambios
```

**PayPal no funciona:**
```
Error: Payment rejected

Solución:
- Verificar credenciales de PayPal en .env
- Usar Sandbox si no es producción
- URLs de retorno deben ser HTTPS
```

### URLs en Producción

| Servicio | URL |
|----------|-----|
| Frontend | https://cineha-frontend.onrender.com |
| Backend | https://cineha-backend.onrender.com/api |
| Base de Datos | postgresql://... (NeonDB) |

## 🔄 Workflow de Desarrollo

### 1. Crear Feature Branch

```bash
git checkout -b feature/nueva-funcionalidad
```

### 2. Realizar Cambios

```bash
# Backend
cd backend
npm run dev

# Frontend (otra terminal)
cd frontend
npm run dev
```

### 3. Commit y Push

```bash
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

### 4. Pull Request

1. Ir a GitHub
2. Crear PR a rama `main`
3. Revisar cambios
4. Mergear a `main`

### 5. Auto-Deploy en Render

Una vez mergeado a `main`:
- Render detecta cambios
- Auto-redeploy (si está habilitado)
- Verificar en Render → Logs

## 📊 Base de Datos - Schema

### Tabla: usuarios

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  rol VARCHAR(20) DEFAULT 'usuario',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: películas

```sql
CREATE TABLE películas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  duracion INT,
  clasificacion VARCHAR(10),
  poster_url VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: funciones

```sql
CREATE TABLE funciones (
  id SERIAL PRIMARY KEY,
  película_id INT REFERENCES películas(id),
  sala INT,
  horario TIMESTAMP NOT NULL,
  precio DECIMAL(10,2),
  asientos_disponibles INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: reservas

```sql
CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  función_id INT REFERENCES funciones(id),
  asientos INT,
  estado VARCHAR(20) DEFAULT 'pendiente',
  total DECIMAL(10,2),
  transacción_id VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Seguridad

### Mejores Prácticas Implementadas

- ✅ Contraseñas hasheadas (bcrypt)
- ✅ JWT para autenticación stateless
- ✅ CORS configurado
- ✅ Variables de entorno protegidas
- ✅ Validación de entrada en backend
- ✅ Errores genéricos al usuario

### Recomendaciones Adicionales

Para producción:

1. **HTTPS obligatorio**
   ```javascript
   // middleware
   app.use((req, res, next) => {
     if (req.header('x-forwarded-proto') !== 'https') {
       res.redirect(`https://${req.header('host')}${req.url}`);
     } else {
       next();
     }
   });
   ```

2. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

3. **Helmet.js para headers HTTP**
   ```bash
   npm install helmet
   ```

4. **CSRF Protection** (si usa formularios HTML)
   ```bash
   npm install csurf
   ```

## 📞 Soporte y Documentación

### Enlaces Útiles

- [Documentación Express.js](https://expressjs.com/)
- [Documentación Next.js](https://nextjs.org/docs)
- [Sequelize ORM](https://sequelize.org/)
- [NeonDB](https://neon.tech/)
- [Render Docs](https://render.com/docs)
- [PayPal Developer](https://developer.paypal.com/)

### Contacto

- 📧 Email: eduardocamaja213@gmail.com
- 🐙 GitHub: [Eduardoc213](https://github.com/Eduardoc213)

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📅 Changelog

### v1.0.0 (2025-09-25)
- ✨ Inicial release
- 👤 Sistema de autenticación
- 🎬 Gestión de películas
- 🎟️ Sistema de reservas
- 💳 Integración PayPal

---

**Hecho con ❤️ por Eduardo Camaja, Bresler Avizai y Rony Tabique**
