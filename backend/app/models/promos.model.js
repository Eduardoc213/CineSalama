module.exports = (sequelize, DataTypes) => {
  const Promo = sequelize.define('Promo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING },
    precio: { type: DataTypes.FLOAT, defaultValue: 0 },
    descuento: { type: DataTypes.FLOAT, defaultValue: 0 },
    fecha_expiracion: { type: DataTypes.DATE },
    activa: { type: DataTypes.BOOLEAN, defaultValue: true },
    tipo: { type: DataTypes.STRING, defaultValue: 'precio' }
  }, { tableName: 'promos', timestamps: true });
  return Promo;
};