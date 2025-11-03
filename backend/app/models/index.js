const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config');

// Inicializa la conexión
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  pool: dbConfig.pool,
  logging: false,
});

// Importa modelos
const Usuario = require('./usuarios.model')(sequelize, DataTypes);
const TarjetaLealtad = require('./tarjetas_lealtad.model')(sequelize, DataTypes);
const HistorialPuntos = require('./historial_puntos')(sequelize, DataTypes);
const Pelicula = require('./peliculas.model')(sequelize, DataTypes);
const Estreno = require('./estrenos.model')(sequelize, DataTypes);
const Sala = require('./salas.model')(sequelize, DataTypes);
const Asiento = require('./asientos.model')(sequelize, DataTypes);
const Funcion = require('./funciones.model')(sequelize, DataTypes);
const Reserva = require('./reservas.model')(sequelize, DataTypes);
const Venta = require('./ventas.model')(sequelize, DataTypes);
const VentaItem = require('./venta_items.model')(sequelize, DataTypes);
const Snack = require('./snacks.model')(sequelize, DataTypes);
const Pago = require('./pagos.model')(sequelize, DataTypes);
const Factura = require('./facturas.model')(sequelize, DataTypes);
const Promo = require('./promos.model')(sequelize, DataTypes);
const Redemption = require('./redemptions.model')(sequelize, DataTypes);

// RELACIONES

// Usuario
Usuario.hasMany(Venta, { foreignKey: 'usuarioId' });
Venta.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Usuario.hasMany(Reserva, { foreignKey: 'usuarioId' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Usuario.hasMany(TarjetaLealtad, { foreignKey: 'usuarioId' });
TarjetaLealtad.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Usuario.hasMany(HistorialPuntos, { foreignKey: 'usuarioId' });
HistorialPuntos.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Usuario.hasMany(Factura, { foreignKey: 'usuarioId' });
Factura.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Usuario.hasMany(Redemption, { foreignKey: 'usuarioId' });
Redemption.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Película y Estreno
Pelicula.hasMany(Estreno, { foreignKey: 'peliculaId' });
Estreno.belongsTo(Pelicula, { foreignKey: 'peliculaId' });

Pelicula.hasMany(Funcion, { foreignKey: 'peliculaId' });
Funcion.belongsTo(Pelicula, { foreignKey: 'peliculaId' });

// Sala y Asiento
Sala.hasMany(Funcion, { foreignKey: 'salaId' });
Funcion.belongsTo(Sala, { foreignKey: 'salaId' });

Sala.hasMany(Asiento, { as: 'asientos', foreignKey: 'salaId' });
Asiento.belongsTo(Sala, { as: 'sala', foreignKey: 'salaId' });


// Función y Reserva
Funcion.hasMany(Reserva, { foreignKey: 'funcionId' });
Reserva.belongsTo(Funcion, { foreignKey: 'funcionId' });

// Asiento y Reserva
Asiento.hasMany(Reserva, { foreignKey: 'asientoId' });
Reserva.belongsTo(Asiento, { foreignKey: 'asientoId' });

// Venta y sus dependientes
Venta.hasMany(VentaItem, { foreignKey: 'ventaId', onDelete: 'CASCADE' });
VentaItem.belongsTo(Venta, { foreignKey: 'ventaId', onDelete: 'CASCADE' });

Venta.hasOne(Pago, { foreignKey: 'ventaId', onDelete: 'CASCADE' });
Pago.belongsTo(Venta, { foreignKey: 'ventaId', onDelete: 'CASCADE' });

Venta.hasOne(Factura, { foreignKey: 'ventaId', onDelete: 'CASCADE' });
Factura.belongsTo(Venta, { foreignKey: 'ventaId', onDelete: 'CASCADE' });

// Promo y sus redenciones
Promo.hasMany(Redemption, { foreignKey: 'promoId', onDelete: 'CASCADE' });
Redemption.belongsTo(Promo, { foreignKey: 'promoId', onDelete: 'CASCADE' });

Snack.hasMany(VentaItem, { foreignKey: 'productoId', constraints: false, scope: { tipo: 'snack' } });
VentaItem.belongsTo(Snack, { foreignKey: 'productoId', constraints: false });

Funcion.hasMany(VentaItem, { foreignKey: 'productoId', constraints: false, scope: { tipo: 'boleto' } });
VentaItem.belongsTo(Funcion, { foreignKey: 'productoId', constraints: false });

// Exporta todo
module.exports = {
  sequelize,
  Sequelize,
  Usuario,
  TarjetaLealtad,
  HistorialPuntos,
  Pelicula,
  Estreno,
  Sala,
  Asiento,
  Funcion,
  Reserva,
  Venta,
  VentaItem,
  Snack,
  Pago,
  Factura,
  Promo,
  Redemption,
};