const db = require("../models");
const Reserva = db.Reserva;

// CRUD
exports.create = async (req, res) => {
  try {
    const reserva = await Reserva.create(req.body);
    res.status(201).json(reserva);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findAll = async (_, res) => {
  try {
    const reservas = await Reserva.findAll();
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findById = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    reserva ? res.json(reserva) : res.status(404).json({ message: "Reserva no encontrada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Reserva.update(req.body, { where: { id: req.params.id } });
    updated ? res.json({ message: "Reserva actualizada" }) : res.status(404).json({ message: "Reserva no encontrada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Reserva.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ message: "Reserva eliminada" }) : res.status(404).json({ message: "Reserva no encontrada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
