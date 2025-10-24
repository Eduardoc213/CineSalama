const db = require('../models');
const VentaItem = db.VentaItem;
const Venta = db.Venta;
const Snack = db.Snack;
const Funcion = db.Funcion;

// Listar todos los items de venta
exports.findAll = async (req, res) => {
  try {
    const items = await VentaItem.findAll({
      include: [
        { model: Venta },
        { model: Snack },
        { model: Funcion }
      ]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar items de venta', details: err.message });
  }
};

// Obtener un item de venta por ID
exports.findOne = async (req, res) => {
  try {
    const item = await VentaItem.findByPk(req.params.id, {
      include: [
        { model: Venta },
        { model: Snack },
        { model: Funcion }
      ]
    });
    if (!item) return res.status(404).json({ error: 'Item de venta no encontrado' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar item de venta', details: err.message });
  }
};

// Crear un item de venta
exports.create = async (req, res) => {
  try {
    const { ventaId, tipo, productoId, cantidad, precio_unitario } = req.body;

    // Validar venta
    const venta = await Venta.findByPk(ventaId);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });

    // Validar producto según tipo
    if (tipo === 'snack') {
      const snack = await Snack.findByPk(productoId);
      if (!snack) return res.status(404).json({ error: 'Snack no encontrado' });
    } else if (tipo === 'boleto') {
      const funcion = await Funcion.findByPk(productoId);
      if (!funcion) return res.status(404).json({ error: 'Función no encontrada' });
    } else {
      return res.status(400).json({ error: 'Tipo de producto inválido' });
    }

    const item = await VentaItem.create({ ventaId, tipo, productoId, cantidad, precio_unitario });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear item de venta', details: err.message });
  }
};

// Actualizar un item de venta
exports.update = async (req, res) => {
  try {
    const { tipo, productoId, cantidad, precio_unitario } = req.body;
    const item = await VentaItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item de venta no encontrado' });

    // Validar producto según tipo si se actualiza
    if (tipo) {
      if (tipo === 'snack') {
        const snack = await Snack.findByPk(productoId);
        if (!snack) return res.status(404).json({ error: 'Snack no encontrado' });
      } else if (tipo === 'boleto') {
        const funcion = await Funcion.findByPk(productoId);
        if (!funcion) return res.status(404).json({ error: 'Función no encontrada' });
      } else {
        return res.status(400).json({ error: 'Tipo de producto inválido' });
      }
    }

    await item.update({ tipo, productoId, cantidad, precio_unitario });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar item de venta', details: err.message });
  }
};

// Eliminar un item de venta
exports.delete = async (req, res) => {
  try {
    const item = await VentaItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item de venta no encontrado' });
    await item.destroy();
    res.json({ message: 'Item de venta eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar item de venta', details: err.message });
  }
};