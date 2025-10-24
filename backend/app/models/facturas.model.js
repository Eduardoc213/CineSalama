module.exports = (sequelize, DataTypes) => {
  const Factura = sequelize.define('Factura', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false },
    ventaId: { type: DataTypes.INTEGER, allowNull: false },
    rfc: { type: DataTypes.STRING, allowNull: false },
    razon_social: { type: DataTypes.STRING, allowNull: false },
    total: { type: DataTypes.FLOAT, allowNull: false },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'facturas', timestamps: true });
  return Factura;
};