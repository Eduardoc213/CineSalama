module.exports = (sequelize, DataTypes) => {
  const Asiento = sequelize.define('Asiento', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    salaId: { type: DataTypes.INTEGER, allowNull: false },
    fila: { type: DataTypes.STRING, allowNull: false },
    numero: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'asientos', timestamps: false });
  return Asiento;
};