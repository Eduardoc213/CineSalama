const db = require('../models');
const Promo = db.Promo;

exports.findAll = async (req, res) => {
  try {
    const promos = await Promo.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: promos });
  } catch (err) {
    console.error('Error fetching promos:', err);
    res.status(500).json({ success: false, message: 'Error al obtener las promociones' });
  }
};

exports.findOne = async (req, res) => {
  try {
    const promo = await Promo.findByPk(req.params.id);
    if (promo) {
      res.json({ success: true, data: promo });
    } else {
      res.status(404).json({ success: false, message: `No se encontró una promoción con id=${req.params.id}.` });
    }
  } catch (err) {
    console.error('Error fetching promo:', err);
    res.status(500).json({ success: false, message: "Error obteniendo la promoción." });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, descuento, puntos_necesarios, fecha_expiracion, activa } = req.body;
    
    if (!nombre || !descuento) {
      return res.status(400).json({ success: false, message: "El nombre y descuento son obligatorios." });
    }

    const promoData = {
      nombre,
      descripcion: descripcion || '',
      descuento: parseFloat(descuento),
      puntos_necesarios: parseInt(puntos_necesarios) || 0,
      activa: activa !== undefined ? activa : true
    };

    if (fecha_expiracion) {
      promoData.fecha_expiracion = new Date(fecha_expiracion);
    }

    const nuevaPromo = await Promo.create(promoData);
    res.status(201).json({ success: true, data: nuevaPromo, message: "Promoción creada exitosamente." });
  } catch (err) {
    console.error('Error creating promo:', err);
    res.status(500).json({ success: false, message: err.message || "Error creando la promoción." });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, descripcion, descuento, puntos_necesarios, fecha_expiracion, activa } = req.body;
    
    const updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (descuento !== undefined) updateData.descuento = parseFloat(descuento);
    if (puntos_necesarios !== undefined) updateData.puntos_necesarios = parseInt(puntos_necesarios);
    if (fecha_expiracion !== undefined) updateData.fecha_expiracion = fecha_expiracion ? new Date(fecha_expiracion) : null;
    if (activa !== undefined) updateData.activa = activa;

    const [num] = await Promo.update(updateData, { 
      where: { id: req.params.id } 
    });
    
    if (num === 1) {
      const updatedPromo = await Promo.findByPk(req.params.id);
      res.json({ success: true, data: updatedPromo, message: "Promoción actualizada correctamente." });
    } else {
      res.status(404).json({ success: false, message: `No se pudo actualizar la promoción con id=${req.params.id}.` });
    }
  } catch (err) {
    console.error('Error updating promo:', err);
    res.status(500).json({ success: false, message: "Error actualizando la promoción." });
  }
};

exports.delete = async (req, res) => {
  try {
    const num = await Promo.destroy({ where: { id: req.params.id } });
    if (num === 1) {
      res.json({ success: true, message: "Promoción eliminada correctamente." });
    } else {
      res.status(404).json({ success: false, message: `No se pudo eliminar la promoción con id=${req.params.id}.` });
    }
  } catch (err) {
    console.error('Error deleting promo:', err);
    res.status(500).json({ success: false, message: "Error eliminando la promoción." });
  }
};