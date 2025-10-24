const db = require("../models");
const Funcion = db.Funcion;
const Pelicula = db.Pelicula;
const Sala = db.Sala;
const { Op } = db.Sequelize;

/** Helper: suma minutos a una fecha y devuelve Date */
function addMinutes(date, minutes) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + (minutes || 0));
  return d;
}

/** Helper: verifica si dos intervalos se solapan */
function intervalsOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

/** Busca funciones en la misma sala en el mismo día y verifica solapamiento */
async function checkOverlap(salaId, newStart, newEnd, excludeFuncionId = null) {
  const startOfDay = new Date(newStart);
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(newStart);
  endOfDay.setHours(23,59,59,999);

  const where = {
    salaId,
    fecha_hora: { [Op.between]: [startOfDay, endOfDay] }
  };
  if (excludeFuncionId) where.id = { [Op.ne]: excludeFuncionId };

  const funciones = await Funcion.findAll({
    where,
    include: [{ model: Pelicula }] // necesitamos la duración de la película vinculada
  });

  for (const f of funciones) {
    const fStart = new Date(f.fecha_hora);
    const fDuration = (f.Pelicula && f.Pelicula.duracion) ? f.Pelicula.duracion : 0;
    const fEnd = addMinutes(fStart, fDuration);

    if (intervalsOverlap(newStart, newEnd, fStart, fEnd)) {
      return { conflict: true, funcion: f };
    }
  }
  return { conflict: false };
}

/** Crear función (valida solapamiento usando duracion de la pelicula) */
exports.create = async (req, res) => {
  try {
    const { peliculaId, salaId, fecha_hora, idioma, formato } = req.body;
    if (!peliculaId || !salaId || !fecha_hora) {
      return res.status(400).json({ message: "peliculaId, salaId y fecha_hora son requeridos" });
    }

    const pelicula = await Pelicula.findByPk(peliculaId);
    if (!pelicula) return res.status(404).json({ message: "Película no encontrada" });

    const sala = await Sala.findByPk(salaId);
    if (!sala) return res.status(404).json({ message: "Sala no encontrada" });

    const start = new Date(fecha_hora);
    if (isNaN(start)) return res.status(400).json({ message: "fecha_hora inválida" });

    const newEnd = addMinutes(start, pelicula.duracion || 0);

    // Validar solapamiento
    const overlap = await checkOverlap(salaId, start, newEnd);
    if (overlap.conflict) {
      return res.status(400).json({
        message: "La función se solapa con otra función en la misma sala",
        conflictWithId: overlap.funcion.id,
        conflictWithFecha_hora: overlap.funcion.fecha_hora
      });
    }

    const nueva = await Funcion.create({
      peliculaId,
      salaId,
      fecha_hora: start,
      idioma,
      formato
    });

    return res.status(201).json(nueva);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

/** Obtener todas (incluye pelicula y sala) */
exports.findAll = async (req, res) => {
  try {
    const funciones = await Funcion.findAll({
      include: [{ model: Pelicula }, { model: Sala }],
      order: [["fecha_hora", "ASC"]]
    });
    res.json(funciones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** Obtener por ID */
exports.findById = async (req, res) => {
  try {
    const funcion = await Funcion.findByPk(req.params.id, {
      include: [{ model: Pelicula }, { model: Sala }]
    });
    if (!funcion) return res.status(404).json({ message: "Función no encontrada" });
    res.json(funcion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** Actualizar: si cambian sala/pelicula/fecha_hora revalidamos solapamiento */
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const funcion = await Funcion.findByPk(id);
    if (!funcion) return res.status(404).json({ message: "Función no encontrada" });

    // Valores nuevos (si vienen) o mantén los antiguos
    const peliculaId = req.body.peliculaId ?? funcion.peliculaId;
    const salaId = req.body.salaId ?? funcion.salaId;
    const fecha_hora = req.body.fecha_hora ? new Date(req.body.fecha_hora) : new Date(funcion.fecha_hora);

    if (isNaN(fecha_hora)) return res.status(400).json({ message: "fecha_hora inválida" });

    const pelicula = await Pelicula.findByPk(peliculaId);
    if (!pelicula) return res.status(404).json({ message: "Película no encontrada" });

    // Recalcula rango y valida solapamiento excluyendo la propia función
    const newStart = fecha_hora;
    const newEnd = addMinutes(newStart, pelicula.duracion || 0);
    const overlap = await checkOverlap(salaId, newStart, newEnd, id);
    if (overlap.conflict) {
      return res.status(400).json({
        message: "La nueva fecha/hora se solapa con otra función en la misma sala",
        conflictWithId: overlap.funcion.id
      });
    }

    // Actualizar campos permitidos
    funcion.peliculaId = peliculaId;
    funcion.salaId = salaId;
    funcion.fecha_hora = newStart;
    if (req.body.idioma !== undefined) funcion.idioma = req.body.idioma;
    if (req.body.formato !== undefined) funcion.formato = req.body.formato;

    await funcion.save();
    res.json({ message: "Función actualizada", funcion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/** Eliminar */
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Funcion.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Función no encontrada" });
    res.json({ message: "Función eliminada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
