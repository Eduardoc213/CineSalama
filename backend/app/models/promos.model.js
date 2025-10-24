module.exports = (sequelize, DataTypes) => {
  const Promo = sequelize.define('Promo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING },
    puntos_necesarios: { type: DataTypes.INTEGER, defaultValue: 0 },
    descuento: { type: DataTypes.FLOAT, defaultValue: 0 }
  }, { tableName: 'promos', timestamps: true });
  return Promo;
};