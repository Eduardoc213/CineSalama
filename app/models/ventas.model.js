//Permite registrar, controlar y auditar todas las ventas realizadas en el sistema del cine,
//  asociando cada venta a un usuario y a los ítems vendidos (a través del modelo venta_item).
module.exports = (sequelize, DataTypes) => {
  const Venta = sequelize.define('Venta', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false },
    total: { type: DataTypes.FLOAT, allowNull: false },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'ventas', timestamps: true });
  return Venta;
};