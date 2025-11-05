const db = require('../models');
const Snack = db.Snack;

exports.findAll = async (req, res) => {
  try {
    const snacks = await Snack.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: snacks });
  } catch (err) {
    console.error('Error fetching snacks:', err);
    res.status(500).json({ success: false, message: 'Error al obtener los snacks' });
  }
};

exports.findOne = async (req, res) => {
  try {
    const snack = await Snack.findByPk(req.params.id);
    if (snack) {
      res.json({ success: true, data: snack });
    } else {
      res.status(404).json({ success: false, message: `No se encontró un snack con id=${req.params.id}.` });
    }
  } catch (err) {
    console.error('Error fetching snack:', err);
    res.status(500).json({ success: false, message: "Error obteniendo el snack." });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, precio, disponible } = req.body;
    
    if (!nombre || !precio) {
      return res.status(400).json({ success: false, message: "El nombre y precio son obligatorios." });
    }

    const snackData = {
      nombre,
      descripcion: descripcion || '',
      precio: parseFloat(precio),
      disponible: disponible !== undefined ? disponible : true
    };

    const nuevoSnack = await Snack.create(snackData);
    res.status(201).json({ success: true, data: nuevoSnack, message: "Snack creado exitosamente." });
  } catch (err) {
    console.error('Error creating snack:', err);
    res.status(500).json({ success: false, message: err.message || "Error creando el snack." });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, descripcion, precio, disponible } = req.body;
    
    const updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (precio !== undefined) updateData.precio = parseFloat(precio);
    if (disponible !== undefined) updateData.disponible = disponible;

    const [num] = await Snack.update(updateData, { 
      where: { id: req.params.id } 
    });
    
    if (num === 1) {
      const updatedSnack = await Snack.findByPk(req.params.id);
      res.json({ success: true, data: updatedSnack, message: "Snack actualizado correctamente." });
    } else {
      res.status(404).json({ success: false, message: `No se pudo actualizar el snack con id=${req.params.id}.` });
    }
  } catch (err) {
    console.error('Error updating snack:', err);
    res.status(500).json({ success: false, message: "Error actualizando el snack." });
  }
};

exports.delete = async (req, res) => {
  try {
    const num = await Snack.destroy({ where: { id: req.params.id } });
    if (num === 1) {
      res.json({ success: true, message: "Snack eliminado correctamente." });
    } else {
      res.status(404).json({ success: false, message: `No se pudo eliminar el snack con id=${req.params.id}.` });
    }
  } catch (err) {
    console.error('Error deleting snack:', err);
    res.status(500).json({ success: false, message: "Error eliminando el snack." });
  }
};