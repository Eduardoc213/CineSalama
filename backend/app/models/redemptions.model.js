// este modelo se implementa para registrar y gestionar el proceso de canje de 
// promociones, cupones o beneficios por parte de los usuarios.
// copn la finalidad de controlar y auditar el uso de promociones dentro del sistema del cine, 
// evitando fraudes y mejorando la experiencia del usuario

module.exports = (sequelize, DataTypes) => {
  const Redemption = sequelize.define('Redemption', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false },
    promoId: { type: DataTypes.INTEGER, allowNull: false },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'redemptions', timestamps: false });
  return Redemption;
};