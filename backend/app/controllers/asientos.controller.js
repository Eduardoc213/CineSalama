const db = require("../models");
const Asiento = db.Asiento;

// CREAR ASIENTO
exports.create = async (req, res) => {
  try {
    const asiento = await Asiento.create(req.body);
    res.status(201).json(asiento);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// BUSCAR TODOS LOS ASIENTOS
exports.findAll = async (_, res) => {
  try {
    const asientos = await Asiento.findAll();
    res.json(asientos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// OBTENER POR ID
exports.findById = async (req, res) => {
  try {
    const asiento = await Asiento.findByPk(req.params.id);
    asiento ? res.json(asiento) : res.status(404).json({ message: "Asiento no encontrado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// OBTENER ASIENTOS POR SALA
exports.findBySala = async (req, res) => {
  try {
    const asientos = await Asiento.findAll({ where: { salaId: req.params.salaId } });
    asientos.length
      ? res.json(asientos)
      : res.status(404).json({ message: "No hay asientos en esta sala" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MODIFICAR
exports.update = async (req, res) => {
  try {
    const [updated] = await Asiento.update(req.body, { where: { id: req.params.id } });
    updated
      ? res.json({ message: "Asiento actualizado" })
      : res.status(404).json({ message: "Asiento no encontrado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ELIMINAR
exports.delete = async (req, res) => {
  try {
    const deleted = await Asiento.destroy({ where: { id: req.params.id } });
    deleted
      ? res.json({ message: "Asiento eliminado" })
      : res.status(404).json({ message: "Asiento no encontrado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
