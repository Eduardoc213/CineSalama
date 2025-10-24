const db = require('../models');
const Usuario = db.Usuario;
const Venta = db.Venta;
const VentaItem = db.VentaItem;
const Snack = db.Snack;
const Funcion = db.Funcion;
const Pago = db.Pago;
const Factura = db.Factura;

exports.create = async (req, res) => {
  try {
    const { usuarioId, items, total, pago, factura } = req.body;

    // Validar usuario
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Validar productos
    for (const item of items) {
      if (item.tipo === 'boleto') {
        const funcion = await Funcion.findByPk(item.productoId);
        if (!funcion) return res.status(404).json({ error: `Función no encontrada (ID: ${item.productoId})` });
      } else if (item.tipo === 'snack') {
        const snack = await Snack.findByPk(item.productoId);
        if (!snack) return res.status(404).json({ error: `Snack no encontrado (ID: ${item.productoId})` });
      } else {
        return res.status(400).json({ error: `Tipo de producto inválido: ${item.tipo}` });
      }
    }

    // Crear venta
    const venta = await Venta.create({ usuarioId, total, fecha: new Date() });

    // Crear items de venta
    for (const item of items) {
      await VentaItem.create({
        ventaId: venta.id,
        tipo: item.tipo,
        productoId: item.productoId,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario
      });
    }

    // Asociar pago (opcional, si se envía)
    let pagoCreado = null;
    if (pago) {
      pagoCreado = await Pago.create({
        ventaId: venta.id,
        metodo: pago.metodo,
        estado: pago.estado,
        monto: pago.monto,
        referencia: pago.referencia,
        detalles: pago.detalles
      });
    }

    // Asociar factura (opcional, si se envía)
    let facturaCreada = null;
    if (factura) {
      facturaCreada = await Factura.create({
        usuarioId: usuarioId,
        ventaId: venta.id,
        rfc: factura.rfc,
        razon_social: factura.razon_social,
        total: factura.total,
        fecha: new Date()
      });
    }

    res.status(201).json({
      venta,
      items,
      pago: pagoCreado,
      factura: facturaCreada
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear la venta', details: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        { model: Usuario, attributes: ['id', 'nombre', 'email'] },
        { model: VentaItem },
        { model: Pago },
        { model: Factura }
      ]
    });
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar ventas', details: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id, {
      include: [
        { model: Usuario, attributes: ['id', 'nombre', 'email'] },
        { model: VentaItem },
        { model: Pago },
        { model: Factura }
      ]
    });
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar venta', details: err.message });
  }
};