const db = require("../models");
const Estreno = db.Estreno;
const Pelicula = db.Pelicula;

// CRUD
exports.create = async (req, res) => {
  try {
    const estreno = await Estreno.create(req.body);
    res.status(201).json(estreno);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findAll = async (_, res) => {
  try {
    const estrenos = await Estreno.findAll({ include: [Pelicula] });
    res.json(estrenos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findById = async (req, res) => {
  try {
    const estreno = await Estreno.findByPk(req.params.id, { include: [Pelicula] });
    estreno ? res.json(estreno) : res.status(404).json({ message: "Estreno no encontrado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Estreno.update(req.body, { where: { id: req.params.id } });
    updated ? res.json({ message: "Estreno actualizado" }) : res.status(404).json({ message: "Estreno no encontrado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Estreno.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ message: "Estreno eliminado" }) : res.status(404).json({ message: "Estreno no encontrado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
