const db = require("../models");
const Pelicula = db.Pelicula;

// Crear película
exports.create = async (req, res) => {
  try {
    const pelicula = await Pelicula.create(req.body);
    res.status(201).json(pelicula);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener todas
exports.findAll = async (_, res) => {
  try {
    const peliculas = await Pelicula.findAll();
    res.json(peliculas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener por ID
exports.findById = async (req, res) => {
  try {
    const pelicula = await Pelicula.findByPk(req.params.id);
    pelicula ? res.json(pelicula) : res.status(404).json({ message: "Película no encontrada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Buscar por título
exports.findByTitulo = async (req, res) => {
  try {
    const peliculas = await Pelicula.findAll({ where: { titulo: req.params.titulo } });
    peliculas.length > 0
      ? res.json(peliculas)
      : res.status(404).json({ message: "No se encontraron películas con ese título" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Actualizar
exports.update = async (req, res) => {
  try {
    const [updated] = await Pelicula.update(req.body, { where: { id: req.params.id } });
    updated ? res.json({ message: "Película actualizada" }) : res.status(404).json({ message: "Película no encontrada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Eliminar
exports.delete = async (req, res) => {
  try {
    const deleted = await Pelicula.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ message: "Película eliminada" }) : res.status(404).json({ message: "Película no encontrada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
