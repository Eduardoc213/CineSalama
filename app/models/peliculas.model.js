module.exports = (sequelize, DataTypes) => {
  const Pelicula = sequelize.define('Pelicula', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    clasificacion: { type: DataTypes.STRING },
    duracion: { type: DataTypes.INTEGER }, // minutos
    sinopsis: { type: DataTypes.TEXT },
    poster: { type: DataTypes.STRING }
  }, { tableName: 'peliculas', timestamps: true });
  return Pelicula;
};