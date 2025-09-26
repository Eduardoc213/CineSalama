//Permite desglosar cada venta en sus componentes (boletos, productos, etc.), facilitando el control,
//  auditoría y reporte de las ventas en el sistema del cine.

module.exports = (sequelize, DataTypes) => {
  const VentaItem = sequelize.define('VentaItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ventaId: { type: DataTypes.INTEGER, allowNull: false },
    tipo: { type: DataTypes.STRING, allowNull: false }, // 'boleto' o 'snack'
    productoId: { type: DataTypes.INTEGER, allowNull: false }, // id de funcion o snack
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precio_unitario: { type: DataTypes.FLOAT, allowNull: false }
  }, { tableName: 'venta_items', timestamps: false });
  return VentaItem;
};