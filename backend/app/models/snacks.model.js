module.exports = (sequelize, DataTypes) => {
  const Snack = sequelize.define('Snack', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING },
    precio: { type: DataTypes.FLOAT, allowNull: false }
  }, { tableName: 'snacks', timestamps: true });
  return Snack;
};