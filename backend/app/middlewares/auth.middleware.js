
const verificarApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key']; 

  if (!apiKey) {
    return res.status(401).send({ success: false, message: "Acceso denegado." });
  }

  if (apiKey !== 'llavesecreta') {
    return res.status(403).send({ success: false, message: "API Key inválida." });
  }

  next();
};

module.exports = {
  verificarApiKey
};