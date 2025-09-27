const db = require('../models');
const Redemption = db.Redemption;
const Promo = db.Promo;
const Usuario = db.Usuario;
const TarjetaLealtad = db.TarjetaLealtad;

// Registrar redención de promo por usuario
exports.create = async (req, res) => {
  try {
    const { usuarioId, promoId } = req.body;

    // Validar usuario
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Validar promo
    const promo = await Promo.findByPk(promoId);
    if (!promo) return res.status(404).json({ error: 'Promoción no encontrada' });

    // Validar puntos suficientes
    const tarjeta = await TarjetaLealtad.findOne({ where: { usuarioId } });
    if (!tarjeta || tarjeta.puntos < promo.puntos_necesarios) {
      return res.status(400).json({ error: 'Puntos insuficientes para redimir la promoción' });
    }

    // Registrar redención
    const redemption = await Redemption.create({
      usuarioId,
      promoId,
      fecha: new Date()
    });

    // Descontar puntos
    tarjeta.puntos -= promo.puntos_necesarios;
    await tarjeta.save();

    res.status(201).json(redemption);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar la redención', details: err.message });
  }
};

// Consultar redenciones por usuario
exports.findByUsuario = async (req, res) => {
  try {
    const redemptions = await Redemption.findAll({ where: { usuarioId: req.params.usuarioId } });
    res.json(redemptions);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar redenciones', details: err.message });
  }
};

// Consultar todas las redenciones
exports.findAll = async (req, res) => {
  try {
    const redemptions = await Redemption.findAll();
    res.json(redemptions);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar redenciones', details: err.message });
  }
};

// Consultar una redención por ID
exports.findOne = async (req, res) => {
  try {
    const redemption = await Redemption.findByPk(req.params.id);
    if (!redemption) return res.status(404).json({ error: 'Redención no encontrada' });
    res.json(redemption);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar redención', details: err.message });
  }
};