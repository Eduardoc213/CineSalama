const db = require('../models');
const HistorialPuntos = db.HistorialPuntos;
const Usuario = db.Usuario;

// Registrar movimiento de puntos
exports.create = async (req, res) => {
  try {
    const { usuarioId, movimiento, puntos, descripcion } = req.body;

    // Validar usuario
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Registrar movimiento
    const historial = await HistorialPuntos.create({
      usuarioId,
      movimiento,
      puntos,
      descripcion
    });

    res.status(201).json(historial);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar movimiento de puntos', details: err.message });
  }
};

// Consultar movimientos de puntos por usuario
exports.findByUsuario = async (req, res) => {
  try {
    const movimientos = await HistorialPuntos.findAll({ where: { usuarioId: req.params.usuarioId } });
    res.json(movimientos);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar movimientos', details: err.message });
  }
};

// Consultar todos los movimientos de puntos
exports.findAll = async (req, res) => {
  try {
    const movimientos = await HistorialPuntos.findAll();
    res.json(movimientos);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar movimientos', details: err.message });
  }
};

// Consultar un movimiento de puntos por ID
exports.findOne = async (req, res) => {
  try {
    const movimiento = await HistorialPuntos.findByPk(req.params.id);
    if (!movimiento) return res.status(404).json({ error: 'Movimiento no encontrado' });
    res.json(movimiento);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar movimiento', details: err.message });
  }
};