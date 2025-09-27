const db = require('../models');
const Promo = db.Promo;
const { sendSuccess, sendError } = require('../utils/responseHandler.util.js');

exports.findAll = async (req, res) => {
  try {
    const promos = await Promo.findAll();
    sendSuccess(res, promos);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.findOne = async (req, res) => {
  try {
    const promo = await Promo.findByPk(req.params.id);
    if (promo) {
      sendSuccess(res, promo);
    } else {
      sendError(res, `No se encontró una promoción con id=${req.params.id}.`, 404);
    }
  } catch (err) {
    sendError(res, "Error obteniendo la promoción.");
  }
};

exports.create = async (req, res) => {
  if (!req.body.nombre) {
    return sendError(res, "El nombre de la promoción no puede estar vacío.", 400);
  }
  try {
    const data = await Promo.create(req.body);
    sendSuccess(res, data.toJSON(), "Promoción creada exitosamente.", 201);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const [num] = await Promo.update(req.body, { where: { id: req.params.id } });
    if (num === 1) {
      sendSuccess(res, null, "Promoción actualizada correctamente.");
    } else {
      sendError(res, `No se pudo actualizar la promoción con id=${req.params.id}.`, 404);
    }
  } catch (err) {
    sendError(res, "Error actualizando la promoción.");
  }
};

exports.delete = async (req, res) => {
  try {
    const num = await Promo.destroy({ where: { id: req.params.id } });
    if (num === 1) {
      sendSuccess(res, null, "Promoción eliminada correctamente.");
    } else {
      sendError(res, `No se pudo eliminar la promoción con id=${req.params.id}.`, 404);
    }
  } catch (err) {
    sendError(res, "Error eliminando la promoción.");
  }
};