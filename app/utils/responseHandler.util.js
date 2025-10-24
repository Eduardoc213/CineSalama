/**
 * 
 * @param {object} res 
 * @param {object|array} data 
 * @param {string} message 
 * @param {number} statusCode 
 */
const sendSuccess = (res, data, message = "Operación exitosa", statusCode = 200) => {
  res.status(statusCode).send({
    success: true,
    message,
    data
  });
};

/**
 * 
 * @param {object} res 
 * @param {string} message 
 * @param {number} statusCode 
 */
const sendError = (res, message = "Ocurrió un error", statusCode = 500) => {
  res.status(statusCode).send({
    success: false,
    message
  });
};

module.exports = {
  sendSuccess,
  sendError
};