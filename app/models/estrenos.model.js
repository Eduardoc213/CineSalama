module.exports = (sequelize, DataTypes) => {
  const Estreno = sequelize.define('Estreno', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    peliculaId: { type: DataTypes.INTEGER, allowNull: false },
    fecha_estreno: { type: DataTypes.DATE, allowNull: false }
  }, { tableName: 'estrenos', timestamps: true });
  return Estreno;
};