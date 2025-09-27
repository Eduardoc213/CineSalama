const db = require("../models");
const Sala = db.Sala;
const Asiento = db.Asiento;

// CREAR SALA
exports.create = async (req, res) => {
  try {
    const sala = await Sala.create(req.body);
    res.status(201).json(sala);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// BUSCAR TODAS LAS SALAS (con asientos)
exports.findAll = async (_, res) => {
  try {
    const salas = await Sala.findAll({ include: Asiento });
    res.json(salas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// OBTENER POR ID (con asientos)
exports.findById = async (req, res) => {
  try {
    const sala = await Sala.findByPk(req.params.id, { include: Asiento });
    sala
      ? res.json(sala)
      : res.status(404).json({ message: "Sala no encontrada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MODIFICAR
exports.update = async (req, res) => {
  try {
    const [updated] = await Sala.update(req.body, { where: { id: req.params.id } });
    updated
      ? res.json({ message: "Sala actualizada" })
      : res.status(404).json({ message: "Sala no encontrada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ELIMINAR
exports.delete = async (req, res) => {
  try {
    const deleted = await Sala.destroy({ where: { id: req.params.id } });
    deleted
      ? res.json({ message: "Sala eliminada" })
      : res.status(404).json({ message: "Sala no encontrada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
