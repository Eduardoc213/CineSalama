import request from "./request";

const BASE = "/api"; // request se encargará de anteponer NEXT_PUBLIC_API_BASE

// Asientos
export const getAsientos = () => request(`${BASE}/asientos`);
export const getAsiento = (id) => request(`${BASE}/asientos/${id}`);
export const getAsientosBySala = (salaId) => request(`${BASE}/asientos/sala/${salaId}`);
export const createAsiento = (data) => request(`${BASE}/asientos`, { method: "POST", body: JSON.stringify(data) });
export const updateAsiento = (id, data) => request(`${BASE}/asientos/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteAsiento = (id) => request(`${BASE}/asientos/${id}`, { method: "DELETE" });

// Salas
export const getSalas = () => request(`${BASE}/salas`);
export const getSala = (id) => request(`${BASE}/salas/${id}`);
export const createSala = (data) => request(`${BASE}/salas`, { method: "POST", body: JSON.stringify(data) });
export const updateSala = (id, data) => request(`${BASE}/salas/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteSala = (id) => request(`${BASE}/salas/${id}`, { method: "DELETE" });

// Películas
export const getPeliculas = () => request(`${BASE}/peliculas`);
export const getPelicula = (id) => request(`${BASE}/peliculas/${id}`);
export const createPelicula = (data) => request(`${BASE}/peliculas`, { method: "POST", body: JSON.stringify(data) });
export const updatePelicula = (id, data) => request(`${BASE}/peliculas/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deletePelicula = (id) => request(`${BASE}/peliculas/${id}`, { method: "DELETE" });
export const getPeliculasByTitulo = (titulo) => request(`${BASE}/peliculas/titulo/${encodeURIComponent(titulo)}`);

// Estrenos
export const getEstrenos = () => request(`${BASE}/estrenos`);
export const getEstreno = (id) => request(`${BASE}/estrenos/${id}`);
export const createEstreno = (data) => request(`${BASE}/estrenos`, { method: "POST", body: JSON.stringify(data) });
export const updateEstreno = (id, data) => request(`${BASE}/estrenos/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteEstreno = (id) => request(`${BASE}/estrenos/${id}`, { method: "DELETE" });

// Funciones
export const getFunciones = () => request(`${BASE}/funciones`);
export const getFuncion = (id) => request(`${BASE}/funciones/${id}`);
export const createFuncion = (data) => request(`${BASE}/funciones`, { method: "POST", body: JSON.stringify(data) });
export const updateFuncion = (id, data) => request(`${BASE}/funciones/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteFuncion = (id) => request(`${BASE}/funciones/${id}`, { method: "DELETE" });

// Reservas
export const getReservas = () => request(`${BASE}/reservas`);
export const getReserva = (id) => request(`${BASE}/reservas/${id}`);
export const createReserva = (data) => request(`${BASE}/reservas`, { method: "POST", body: JSON.stringify(data) });
export const updateReserva = (id, data) => request(`${BASE}/reservas/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteReserva = (id) => request(`${BASE}/reservas/${id}`, { method: "DELETE" });

// Snacks - funciones actualizadas
export const getSnacks = () => request(`${BASE}/snacks`);
export const getSnack = (id) => request(`${BASE}/snacks/${id}`);
export const createSnack = (data) => request(`${BASE}/snacks`, { method: "POST", body: JSON.stringify(data) });
export const updateSnack = (id, data) => request(`${BASE}/snacks/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteSnack = (id) => request(`${BASE}/snacks/${id}`, { method: "DELETE" });

// Promociones
export const getPromos = () => request(`${BASE}/promos`);
export const getPromo = (id) => request(`${BASE}/promos/${id}`);
export const createPromo = (data) => request(`${BASE}/promos`, { method: "POST", body: JSON.stringify(data) });
export const updatePromo = (id, data) => request(`${BASE}/promos/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deletePromo = (id) => request(`${BASE}/promos/${id}`, { method: "DELETE" });

// Tarjetas de Lealtad
export const getTarjetasLealtad = () => request(`${BASE}/tarjetas_lealtad`);
export const getTarjetaLealtad = (id) => request(`${BASE}/tarjetas_lealtad/${id}`);
export const createTarjetaLealtad = (data) => request(`${BASE}/tarjetas_lealtad`, { method: "POST", body: JSON.stringify(data) });
export const updateTarjetaLealtad = (id, data) => request(`${BASE}/tarjetas_lealtad/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteTarjetaLealtad = (id) => request(`${BASE}/tarjetas_lealtad/${id}`, { method: "DELETE" });

// Historial de Puntos
export const getHistorialPuntos = () => request(`${BASE}/historial_puntos`);
export const getHistorialPuntosByUsuario = (usuarioId) => request(`${BASE}/historial_puntos/usuario/${usuarioId}`);
export const createHistorialPuntos = (data) => request(`${BASE}/historial_puntos`, { method: "POST", body: JSON.stringify(data) });

// Redenciones
export const getRedemptions = () => request(`${BASE}/redemptions`);
export const getRedemption = (id) => request(`${BASE}/redemptions/${id}`);
export const getRedemptionsByUsuario = (usuarioId) => request(`${BASE}/redemptions/usuario/${usuarioId}`);
export const createRedemption = (data) => request(`${BASE}/redemptions`, { method: "POST", body: JSON.stringify(data) });

// Ventas
export const getVentas = () => request(`${BASE}/ventas`);
export const getVenta = (id) => request(`${BASE}/ventas/${id}`);
export const createVenta = (data) => request(`${BASE}/ventas`, { method: "POST", body: JSON.stringify(data) });

// Pagos
export const getPagos = () => request(`${BASE}/pagos`);
export const getPago = (id) => request(`${BASE}/pagos/${id}`);
export const getPagosByVenta = (ventaId) => request(`${BASE}/pagos/venta/${ventaId}`);
export const createPago = (data) => request(`${BASE}/pagos`, { method: "POST", body: JSON.stringify(data) });

// Facturas
export const getFacturas = () => request(`${BASE}/facturas`);
export const getFactura = (id) => request(`${BASE}/facturas/${id}`);
export const getFacturasByVenta = (ventaId) => request(`${BASE}/facturas/venta/${ventaId}`);
export const createFactura = (data) => request(`${BASE}/facturas`, { method: "POST", body: JSON.stringify(data) });
export const updateFactura = (id, data) => request(`${BASE}/facturas/${id}`, { method: "PUT", body: JSON.stringify(data) });

// Catálogo
export const getCatalogoPeliculas = () => request(`${BASE}/catalogo/peliculas`);
export const getCatalogoFunciones = () => request(`${BASE}/catalogo/funciones`);
export const getCatalogoSnacks = () => request(`${BASE}/catalogo/snacks`);
export const getCatalogoPromos = () => request(`${BASE}/catalogo/promos`);
export const getCatalogoEstrenos = () => request(`${BASE}/catalogo/estrenos`);

const api = {
  // asientos
  getAsientos, getAsiento, getAsientosBySala, createAsiento, updateAsiento, deleteAsiento,
  
  // salas
  getSalas, getSala, createSala, updateSala, deleteSala,
  
  // peliculas
  getPeliculas, getPelicula, createPelicula, updatePelicula, deletePelicula, getPeliculasByTitulo,
  
  // estrenos
  getEstrenos, getEstreno, createEstreno, updateEstreno, deleteEstreno,
  
  // funciones
  getFunciones, getFuncion, createFuncion, updateFuncion, deleteFuncion,
  
  // reservas
  getReservas, getReserva, createReserva, updateReserva, deleteReserva,
  
  // snacks
  getSnacks, getSnack, createSnack, updateSnack, deleteSnack,
  
  // promociones
  getPromos, getPromo, createPromo, updatePromo, deletePromo,
  
  // tarjetas lealtad
  getTarjetasLealtad, getTarjetaLealtad, createTarjetaLealtad, updateTarjetaLealtad, deleteTarjetaLealtad,
  
  // historial puntos
  getHistorialPuntos, getHistorialPuntosByUsuario, createHistorialPuntos,
  
  // redenciones
  getRedemptions, getRedemption, getRedemptionsByUsuario, createRedemption,
  
  // ventas
  getVentas, getVenta, createVenta,
  
  // pagos
  getPagos, getPago, getPagosByVenta, createPago,
  
  // facturas
  getFacturas, getFactura, getFacturasByVenta, createFactura, updateFactura,
  
  // catálogo
  getCatalogoPeliculas, getCatalogoFunciones, getCatalogoSnacks, getCatalogoPromos, getCatalogoEstrenos
};

export default api;
export { api };