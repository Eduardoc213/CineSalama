module.exports = (sequelize, DataTypes) => {
  const Sala = sequelize.define('Sala', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    capacidad: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'salas', timestamps: true });
  return Sala;
};