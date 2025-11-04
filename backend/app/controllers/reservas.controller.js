// controllers/reservas.controller.js
const db = require("../models");
const Reserva = db.Reserva;
const Asiento = db.Asiento;
const Funcion = db.Funcion;
const Usuario = db.Usuario;
const sequelize = db.sequelize;

// Create
exports.create = async (req, res) => {
  const payload = req.body || {};
  const usuarioId = payload.usuarioId;
  const funcionId = payload.funcionId;
  const asientoId = payload.asientoId;

  if (!usuarioId || !funcionId || !asientoId) {
    return res.status(400).json({ message: "usuarioId, funcionId y asientoId son requeridos" });
  }

  let tx;
  try {
    tx = await sequelize.transaction();

    const asiento = await Asiento.findByPk(asientoId, { transaction: tx, lock: tx.LOCK.UPDATE });
    if (!asiento) {
      await tx.rollback();
      return res.status(404).json({ message: "Asiento no encontrado" });
    }

    const estadoActual = String(asiento.estado || "").toLowerCase();
    if (estadoActual === "reservado" || estadoActual === "vendido") {
      await tx.rollback();
      return res.status(409).json({ message: "Asiento ya ocupado" });
    }

    await asiento.update({ estado: "reservado" }, { transaction: tx });

    const nueva = await Reserva.create({
      usuarioId,
      funcionId,
      asientoId,
      estado: payload.estado || "pendiente"
    }, { transaction: tx });

    await tx.commit();

    const created = await Reserva.findByPk(nueva.id, {
      include: [
        { model: Asiento, as: 'Asiento' },
        { model: Funcion, as: 'Funcion' },
        { model: Usuario, as: 'Usuario' }
      ]
    });

    return res.status(201).json(created || nueva);
  } catch (err) {
    if (tx) try { await tx.rollback(); } catch(_) {}
    console.error("reservas.create error:", err);
    return res.status(500).json({ message: err.message || "Error creando la reserva" });
  }
};

// Listar todas
exports.findAll = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        { model: Asiento, as: 'Asiento' },
        { model: Funcion, as: 'Funcion' },
        { model: Usuario, as: 'Usuario' }
      ],
      order: [["createdAt", "DESC"]]
    });
    res.json(reservas);
  } catch (err) {
    console.error("reservas.findAll error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Obtener por id
exports.findById = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id, {
      include: [
        { model: Asiento, as: 'Asiento' },
        { model: Funcion, as: 'Funcion' },
        { model: Usuario, as: 'Usuario' }
      ]
    });
    reserva ? res.json(reserva) : res.status(404).json({ message: "Reserva no encontrada" });
  } catch (err) {
    console.error("reservas.findById error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update (mantén tu transaccional, al final devuelve con includes 'as')
exports.update = async (req, res) => {
  const id = req.params.id;
  const body = req.body || {};
  let tx;
  try {
    tx = await sequelize.transaction();
    const reserva = await Reserva.findByPk(id, { transaction: tx, lock: tx.LOCK.UPDATE });
    if (!reserva) {
      await tx.rollback();
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (body.asientoId && Number(body.asientoId) !== Number(reserva.asientoId)) {
      const nuevoAsiento = await Asiento.findByPk(body.asientoId, { transaction: tx, lock: tx.LOCK.UPDATE });
      if (!nuevoAsiento) { await tx.rollback(); return res.status(404).json({ message: "Nuevo asiento no encontrado" }); }
      const estadoNuevo = String(nuevoAsiento.estado || "").toLowerCase();
      if (estadoNuevo === "reservado" || estadoNuevo === "vendido") { await tx.rollback(); return res.status(409).json({ message: "Nuevo asiento ya ocupado" }); }
      const asientoAnt = await Asiento.findByPk(reserva.asientoId, { transaction: tx, lock: tx.LOCK.UPDATE });
      if (asientoAnt) await asientoAnt.update({ estado: "disponible" }, { transaction: tx });
      await nuevoAsiento.update({ estado: "reservado" }, { transaction: tx });
      reserva.asientoId = Number(body.asientoId);
    }

    if (body.estado && String(body.estado).toLowerCase() !== String(reserva.estado || "").toLowerCase()) {
      const nuevoEstado = String(body.estado).toLowerCase();
      if (nuevoEstado === "pagado") {
        const asiento = await Asiento.findByPk(reserva.asientoId, { transaction: tx, lock: tx.LOCK.UPDATE });
        if (asiento) await asiento.update({ estado: "vendido" }, { transaction: tx });
      }
      if (nuevoEstado === "cancelado") {
        const asiento = await Asiento.findByPk(reserva.asientoId, { transaction: tx, lock: tx.LOCK.UPDATE });
        if (asiento) await asiento.update({ estado: "disponible" }, { transaction: tx });
      }
      reserva.estado = body.estado;
    }

    const allow = ["usuarioId", "funcionId"];
    allow.forEach(k => { if (body[k] !== undefined) reserva[k] = body[k]; });

    await reserva.save({ transaction: tx });
    await tx.commit();

    const updated = await Reserva.findByPk(reserva.id, {
      include: [{ model: Asiento, as: 'Asiento' }, { model: Funcion, as: 'Funcion' }, { model: Usuario, as: 'Usuario' }]
    });
    res.json(updated);
  } catch (err) {
    if (tx) try { await tx.rollback(); } catch(_) {}
    console.error("reservas.update error:", err);
    res.status(500).json({ message: err.message || "Error actualizando la reserva" });
  }
};

// Delete
exports.delete = async (req, res) => {
  const id = req.params.id;
  let tx;
  try {
    tx = await sequelize.transaction();
    const reserva = await Reserva.findByPk(id, { transaction: tx, lock: tx.LOCK.UPDATE });
    if (!reserva) { await tx.rollback(); return res.status(404).json({ message: "Reserva no encontrada" }); }

    const asiento = await Asiento.findByPk(reserva.asientoId, { transaction: tx, lock: tx.LOCK.UPDATE });
    if (asiento) {
      const est = String(asiento.estado || "").toLowerCase();
      if (est === "reservado" || est === "pendiente") {
        await asiento.update({ estado: "disponible" }, { transaction: tx });
      }
    }

    await Reserva.destroy({ where: { id }, transaction: tx });
    await tx.commit();
    res.json({ message: "Reserva eliminada" });
  } catch (err) {
    if (tx) try { await tx.rollback(); } catch(_) {}
    console.error("reservas.delete error:", err);
    res.status(500).json({ message: err.message || "Error eliminando la reserva" });
  }
};
