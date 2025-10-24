const db = require('../models');
const Pago = db.Pago;
const Venta = db.Venta;

// Registrar un pago para una venta (solo método PayPal)
exports.create = async (req, res) => {
  try {
    const { ventaId, monto, referencia, detalles } = req.body;

    // Validar venta existente
    const venta = await Venta.findByPk(ventaId);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });

    // Validar método de pago (solo PayPal permitido)
    const metodo = 'paypal';
    const estado = 'pagado'; // Asumimos que el pago se realiza correctamente

    // Registrar el pago
    const pago = await Pago.create({
      ventaId,
      metodo,
      estado,
      monto,
      referencia,
      detalles
    });

    res.status(201).json(pago);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar el pago', details: err.message });
  }
};

// Consultar pagos por venta
exports.findByVenta = async (req, res) => {
  try {
    const pagos = await Pago.findAll({ where: { ventaId: req.params.ventaId } });
    res.json(pagos);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar pagos', details: err.message });
  }
};

// Consultar todos los pagos
exports.findAll = async (req, res) => {
  try {
    const pagos = await Pago.findAll();
    res.json(pagos);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar pagos', details: err.message });
  }
};

// Consultar un pago por ID
exports.findOne = async (req, res) => {
  try {
    const pago = await Pago.findByPk(req.params.id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json(pago);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar pago', details: err.message });
  }
};