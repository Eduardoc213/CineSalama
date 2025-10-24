const db = require('../models');
const Snack = db.Snack;

// Obtener todos los snacks
exports.findAll = async (req, res) => {
  try {
    const snacks = await Snack.findAll();
    res.json(snacks);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener snacks', details: err.message });
  }
};

// Obtener un snack por ID
exports.findOne = async (req, res) => {
  try {
    const snack = await Snack.findByPk(req.params.id);
    if (!snack) return res.status(404).json({ error: 'Snack no encontrado' });
    res.json(snack);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener snack', details: err.message });
  }
};

// Crear un snack
exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    const nuevoSnack = await Snack.create({ nombre, descripcion, precio });
    res.status(201).json(nuevoSnack);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear snack', details: err.message });
  }
};

// Actualizar un snack
exports.update = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    const snack = await Snack.findByPk(req.params.id);
    if (!snack) return res.status(404).json({ error: 'Snack no encontrado' });
    await snack.update({ nombre, descripcion, precio });
    res.json(snack);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar snack', details: err.message });
  }
};

// Eliminar un snack
exports.delete = async (req, res) => {
  try {
    const snack = await Snack.findByPk(req.params.id);
    if (!snack) return res.status(404).json({ error: 'Snack no encontrado' });
    await snack.destroy();
    res.json({ message: 'Snack eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar snack', details: err.message });
  }
};