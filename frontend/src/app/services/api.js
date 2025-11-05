import request from "./request";

const BASE = "/api"; // request se encargará de anteponer NEXT_PUBLIC_API_BASE

// Asientos
export const getAsientos = () => request(`${BASE}/asientos`);
export const getAsiento = (id) => request(`${BASE}/asientos/${id}`);
//export const getAsientosBySala = (salaId) => request(`${BASE}/salas/${salaId}/asientos`);
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

// funciones para pagar con PayPal
export const createPayPalOrder = (data) => request(`${BASE}/paypal/create-order`, { method: "POST", body: JSON.stringify(data) });
export const capturePayPalOrder = (data) => request(`${BASE}/paypal/capture-order`, { method: "POST", body: JSON.stringify(data) });

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
  
  // PayPal
  createPayPalOrder, capturePayPalOrder
};

export default api;
export { api };

