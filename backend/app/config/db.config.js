// Configuración de la base de datos en este caso NEON db
require('dotenv').config();

module.exports = {
  HOST: "ep-crimson-fire-adm1sci0-pooler.c-2.us-east-1.aws.neon.tech",
  USER: "neondb_owner",
  PASSWORD: "npg_1Qtm7vXqKHJa",
  DB: "neondb",
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};