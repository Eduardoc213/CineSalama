module.exports = (sequelize, DataTypes) => {
  const Funcion = sequelize.define('Funcion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    peliculaId: { type: DataTypes.INTEGER, allowNull: false },
    salaId: { type: DataTypes.INTEGER, allowNull: false },
    fecha_hora: { type: DataTypes.DATE, allowNull: false },
    idioma: { type: DataTypes.STRING },
    formato: { type: DataTypes.STRING } // 2D, 3D, etc.
  }, { tableName: 'funciones', timestamps: true });
  return Funcion;
};