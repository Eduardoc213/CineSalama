const db = require('../models');
const Usuario = db.Usuario;
const bcrypt = require('bcryptjs');
const { sendSuccess, sendError } = require('../utils/responseHandler.util.js');

exports.findAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    sendSuccess(res, usuarios);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.findOne = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      sendSuccess(res, usuario.toJSON());
    } else {
      sendError(res, `No se encontró un usuario con id=${req.params.id}.`, 404);
    }
  } catch (err) {
    sendError(res, "Error obteniendo el usuario.");
  }
};

exports.create = async (req, res) => {
  if (!req.body.nombre || !req.body.email || !req.body.password) {
    return sendError(res, "El nombre, email y password no pueden estar vacíos.", 400);
  }
  try {
    const nuevoUsuario = {
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 8)
    };
    const data = await Usuario.create(nuevoUsuario);
    sendSuccess(res, data.toJSON(), "Usuario creado exitosamente.", 201);
  } catch (err) {
    console.error("--- DETALLE DEL ERROR ---", err);
    sendError(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const [num] = await Usuario.update(req.body, { where: { id: req.params.id } });
    if (num === 1) {
      sendSuccess(res, null, "Usuario actualizado correctamente.");
    } else {
      sendError(res, `No se pudo actualizar el usuario con id=${req.params.id}.`, 404);
    }
  } catch (err) {
    sendError(res, "Error actualizando el usuario.");
  }
};

exports.delete = async (req, res) => {
  try {
    const num = await Usuario.destroy({ where: { id: req.params.id } });
    if (num === 1) {
      sendSuccess(res, null, "Usuario eliminado correctamente.");
    } else {
      sendError(res, `No se pudo eliminar el usuario con id=${req.params.id}.`, 404);
    }
  } catch (err) {
    sendError(res, "Error eliminando el usuario.");
  }
};