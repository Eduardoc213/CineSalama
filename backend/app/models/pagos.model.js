module.exports = (sequelize, DataTypes) => {
  const Pago = sequelize.define('Pago', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ventaId: { type: DataTypes.INTEGER, allowNull: false },
    metodo: { type: DataTypes.STRING, allowNull: false }, // tarjeta, efectivo, paypal, stripe, etc.
    estado: { type: DataTypes.STRING, defaultValue: 'pendiente' }, // pendiente, pagado, fallido
    monto: { type: DataTypes.FLOAT, allowNull: false },
    referencia: { type: DataTypes.STRING }, // ID de transacción PayPal/Stripe
    detalles: { type: DataTypes.JSON },     // Respuesta completa opcional
  }, { tableName: 'pagos', timestamps: true });
  return Pago;
};//Permite registrar y gestionar los pagos asociados a cada venta, incluyendo detalles de la transacción y su estado.