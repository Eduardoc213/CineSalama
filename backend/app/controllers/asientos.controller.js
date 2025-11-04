const db = require("../models");
const Asiento = db.Asiento;

// CREAR ASIENTO
exports.create = async (req, res) => {
  try {
    const asiento = await Asiento.create(req.body);
    res.status(201).json(asiento);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// BUSCAR TODOS LOS ASIENTOS
exports.findAll = async (_, res) => {
  try {
    const asientos = await Asiento.findAll();
    res.json(asientos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// OBTENER POR ID
exports.findById = async (req, res) => {
  try {
    const asiento = await Asiento.findByPk(req.params.id);
    asiento ? res.json(asiento) : res.status(404).json({ message: "Asiento no encontrado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// OBTENER ASIENTOS POR SALA
exports.findBySala = async (req, res) => {
  try {
    const asientos = await Asiento.findAll({ where: { salaId: req.params.salaId } });
    asientos.length
      ? res.json(asientos)
      : res.status(404).json({ message: "No hay asientos en esta sala" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MODIFICAR
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};

    // si intentan marcar reservado, hacerlo de forma condicional
    if (payload.estado && String(payload.estado).toLowerCase() === "reservado") {
      const [affected] = await Asiento.update(
        { ...payload, estado: "reservado" },
        {
          where: {
            id,
            estado: { [Op.notIn]: ["reservado", "vendido"] } // sólo si no está ocupado
          }
        }
      );

      if (affected === 0) {
        // verificar existencia real
        const exists = await Asiento.findByPk(id);
        if (!exists) return res.status(404).json({ message: "Asiento no encontrado" });
        return res.status(409).json({ message: "Asiento ya ocupado" });
      }

      const updated = await Asiento.findByPk(id);
      return res.json(updated);
    }

    // Normal update para otros campos permitidos
    const asiento = await Asiento.findByPk(id);
    if (!asiento) return res.status(404).json({ message: "Asiento no encontrado" });

    const allowed = ["fila", "numero", "tipo", "salaId", "estado"];
    Object.keys(payload).forEach(key => {
      if (allowed.includes(key)) asiento[key] = payload[key];
    });

    await asiento.save();
    return res.json(asiento);
  } catch (err) {
    console.error("Error updating Asiento:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ELIMINAR
exports.delete = async (req, res) => {
  try {
    const deleted = await Asiento.destroy({ where: { id: req.params.id } });
    deleted
      ? res.json({ message: "Asiento eliminado" })
      : res.status(404).json({ message: "Asiento no encontrado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
