const db = require('../models');
const TarjetaLealtad = db.TarjetaLealtad;
const Usuario = db.Usuario;

// Obtener todas las tarjetas de lealtad
exports.findAll = async (req, res) => {
  try {
    const tarjetas = await TarjetaLealtad.findAll({ include: Usuario });
    res.json(tarjetas);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar tarjetas', details: err.message });
  }
};

// Obtener una tarjeta por ID
exports.findOne = async (req, res) => {
  try {
    const tarjeta = await TarjetaLealtad.findByPk(req.params.id, { include: Usuario });
    if (!tarjeta) return res.status(404).json({ error: 'Tarjeta no encontrada' });
    res.json(tarjeta);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar tarjeta', details: err.message });
  }
};

// Crear una tarjeta de lealtad
exports.create = async (req, res) => {
  try {
    const { numero, puntos, usuarioId } = req.body;
    // Validar usuario
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const tarjeta = await TarjetaLealtad.create({ numero, puntos, usuarioId });
    res.status(201).json(tarjeta);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear tarjeta', details: err.message });
  }
};

// Actualizar una tarjeta de lealtad
exports.update = async (req, res) => {
  try {
    const { numero, puntos, usuarioId } = req.body;
    const tarjeta = await TarjetaLealtad.findByPk(req.params.id);
    if (!tarjeta) return res.status(404).json({ error: 'Tarjeta no encontrada' });

    // Validar usuario si se actualiza
    if (usuarioId) {
      const usuario = await Usuario.findByPk(usuarioId);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await tarjeta.update({ numero, puntos, usuarioId });
    res.json(tarjeta);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar tarjeta', details: err.message });
  }
};

// Eliminar una tarjeta de lealtad
exports.delete = async (req, res) => {
  try {
    const tarjeta = await TarjetaLealtad.findByPk(req.params.id);
    if (!tarjeta) return res.status(404).json({ error: 'Tarjeta no encontrada' });
    await tarjeta.destroy();
    res.json({ message: 'Tarjeta eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar tarjeta', details: err.message });
  }
};