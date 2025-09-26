module.exports = (sequelize, DataTypes) => {
  const Reserva = sequelize.define('Reserva', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false },
    funcionId: { type: DataTypes.INTEGER, allowNull: false },
    asientoId: { type: DataTypes.INTEGER, allowNull: false },
    estado: { type: DataTypes.STRING, defaultValue: 'pendiente' } // pendiente, pagado, cancelado
  }, { tableName: 'reservas', timestamps: true });
  return Reserva;
};