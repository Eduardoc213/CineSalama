const db = require('../models');
const Factura = db.Factura;
const Usuario = db.Usuario;
const Venta = db.Venta;

// Crear factura para una venta
exports.create = async (req, res) => {
  try {
    const { usuarioId, ventaId, rfc, razon_social, total } = req.body;

    // Validar usuario
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Validar venta
    const venta = await Venta.findByPk(ventaId);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });

    // Crear factura
    const factura = await Factura.create({
      usuarioId,
      ventaId,
      rfc,
      razon_social,
      total,
      fecha: new Date()
    });

    res.status(201).json(factura);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear la factura', details: err.message });
  }
};

// Consultar facturas por venta
exports.findByVenta = async (req, res) => {
  try {
    const facturas = await Factura.findAll({ where: { ventaId: req.params.ventaId } });
    res.json(facturas);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar facturas', details: err.message });
  }
};

// Consultar todas las facturas
exports.findAll = async (req, res) => {
  try {
    const facturas = await Factura.findAll();
    res.json(facturas);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar facturas', details: err.message });
  }
};

// Actualizar una factura por ID
exports.update = async (req, res) => {
  try {
    const { rfc, razon_social, total } = req.body;
    const factura = await Factura.findByPk(req.params.id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
    await factura.update({ rfc, razon_social, total });
    res.json(factura);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar factura', details: err.message });
  }
};

// consultar una factura por ID
exports.findOne = async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(factura);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar factura', details: err.message });
  }
};