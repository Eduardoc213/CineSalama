// Controlador para manejar el catálogo de películas, funciones, snacks, promociones y estrenos para el frontend.
//

const db = require('../models');
const Pelicula = db.Pelicula;
const Funcion = db.Funcion;
const Snack = db.Snack;
const Promo = db.Promo;
const Estreno = db.Estreno;

// Listar películas
exports.listPeliculas = async (req, res) => {
  try {
    const peliculas = await Pelicula.findAll();
    res.json(peliculas);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar películas', details: err.message });
  }
};

// Listar funciones
exports.listFunciones = async (req, res) => {
  try {
    const funciones = await Funcion.findAll({
      include: [
        { model: Pelicula, attributes: ['titulo', 'clasificacion', 'duracion'] }
      ]
    });
    res.json(funciones);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar funciones', details: err.message });
  }
};

// Listar snacks
exports.listSnacks = async (req, res) => {
  try {
    const snacks = await Snack.findAll();
    res.json(snacks);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar snacks', details: err.message });
  }
};

// Listar promociones
exports.listPromos = async (req, res) => {
  try {
    const promos = await Promo.findAll();
    res.json(promos);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar promociones', details: err.message });
  }
};

// Listar estrenos
exports.listEstrenos = async (req, res) => {
  try {
    const estrenos = await Estreno.findAll({
      include: [
        { model: Pelicula, attributes: ['titulo', 'clasificacion', 'duracion'] }
      ]
    });
    res.json(estrenos);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar estrenos', details: err.message });
  }
};