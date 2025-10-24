//libro de lealtad, donde se haran registros de los puntos acumulados por los usuarios
module.exports = (sequelize, DataTypes) => {
  const HistorialPuntos = sequelize.define('HistorialPuntos', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false },
    movimiento: { type: DataTypes.STRING, allowNull: false }, // 'acumulado' o 'redimido'
    puntos: { type: DataTypes.INTEGER, allowNull: false },
    descripcion: { type: DataTypes.STRING }
  }, { tableName: 'historial_puntos', timestamps: true });
  return HistorialPuntos;
};