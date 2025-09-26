module.exports = (sequelize, DataTypes) => {
  const TarjetaLealtad = sequelize.define('TarjetaLealtad', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    numero: { type: DataTypes.STRING, allowNull: false, unique: true },
    puntos: { type: DataTypes.INTEGER, defaultValue: 0 },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'tarjetas_lealtad', timestamps: true });
  return TarjetaLealtad;
};