// src/backend/models/asientos.model.js  (o donde esté)
module.exports = (sequelize, DataTypes) => {
  const Asiento = sequelize.define('Asiento', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    salaId: { type: DataTypes.INTEGER, allowNull: false },
    fila: { type: DataTypes.STRING, allowNull: false },
    numero: { type: DataTypes.INTEGER, allowNull: false },
    tipo: { type: DataTypes.STRING, allowNull: false, defaultValue: 'normal' },    // normal, VIP, etc
    estado: { type: DataTypes.STRING, allowNull: false, defaultValue: 'disponible' } // disponible, reservado, vendido
  }, {
    tableName: 'asientos',
    timestamps: false
  });

  return Asiento;
};
