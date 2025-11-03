"use client";
import React, { useState, useEffect } from "react";
import PeliculaCard from "./components/PeliculaCard";
import PeliculaForm from "./components/PeliculaForm";
import { api } from "../services/api";
import ErrorBox from "../../App/asientos/components/ErrorBox"; // reuse ErrorBox existente

export default function PeliculasPage() {
  const [peliculas, setPeliculas] = useState([]);
  const [editPelicula, setEditPelicula] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorUI, setErrorUI] = useState(null);
  const [successUI, setSuccessUI] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletePendingId, setDeletePendingId] = useState(null); // id pending deletion
  const [formValidationError, setFormValidationError] = useState(null);

  const classifications = [
    "A (Para todo publico)", "B (No apta para menores de 12 años)", "B15 (No apta para menores de 15 años)", "C (No apta para menores de 18 años)", "D (Peliculas para Adultos)" 
  ];

  const fetchPeliculas = async () => {
    try {
      setLoading(true);
      const data = await api.getPeliculas();
      setPeliculas(data || []);
    } catch (err) {
      console.error("Error al cargar películas:", err);
      setErrorUI("No se pudieron cargar las películas. Revisa la conexión.");
    } finally {
      setLoading(false);
      setTimeout(() => setErrorUI(null), 6000);
    }
  };

  useEffect(() => {
    fetchPeliculas();
  }, []);

  function SuccessBox({ message, onClose }) {
    if (!message) return null;
    return (
      <div className="border-l-4 border-green-600 bg-green-50 text-green-800 p-3 rounded-md shadow-sm flex justify-between items-start gap-4">
        <div>
          <div className="font-semibold">Éxito</div>
          <div className="text-sm mt-1 whitespace-pre-wrap">{message}</div>
        </div>
        <div>
          <button onClick={onClose} className="text-green-700 px-2 py-1 hover:underline">Cerrar</button>
        </div>
      </div>
    );
  }

  const handleSave = async (pelicula) => {
    try {
      setFormValidationError(null);
      setErrorUI(null);
      if (!pelicula?.titulo || String(pelicula.titulo).trim() === "") {
        setFormValidationError("El título es obligatorio.");
        return;
      }
      if (!pelicula?.clasificacion || String(pelicula.clasificacion).trim() === "") {
        setFormValidationError("Selecciona una clasificación.");
        return;
      }

      if (pelicula.duracion && (isNaN(Number(pelicula.duracion)) || Number(pelicula.duracion) <= 0)) {
        setFormValidationError("Duración inválida.");
        return;
      }

      setLoading(true);
      const payload = {
        ...pelicula,
        duracion: pelicula.duracion ? Number(pelicula.duracion) : null
      };

      if (pelicula.id) {
        await api.updatePelicula(pelicula.id, payload);
        setSuccessUI("Película actualizada correctamente.");
      } else {
        await api.createPelicula(payload);
        setSuccessUI("Película creada correctamente.");
      }

      setEditPelicula(null);
      setShowForm(false);
      fetchPeliculas();
    } catch (err) {
      console.error("Error al guardar película:", err);
      const msg = err?.body?.message || err?.message || String(err);
      setErrorUI("No se pudo guardar la película: " + msg);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessUI(null), 5000);
      setTimeout(() => setErrorUI(null), 8000);
    }
  };

  const handleDelete = async (id) => {
    setDeletePendingId(id);
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await api.deletePelicula(id);
      setSuccessUI("Película eliminada correctamente.");
      fetchPeliculas();
    } catch (err) {
      console.error("Error al eliminar película:", err);
      const msg = err?.body?.message || err?.message || String(err);
      setErrorUI("No se pudo eliminar la película: " + msg);
    } finally {
      setLoading(false);
      setDeletePendingId(null);
      setTimeout(() => setSuccessUI(null), 4000);
      setTimeout(() => setErrorUI(null), 8000);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Películas</h1>
            <p className="text-sm text-gray-700 mt-1 max-w-lg">
              Administra el catálogo de películas. Mantén la información actualizada.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setEditPelicula(null); setShowForm(s => !s); setFormValidationError(null); setErrorUI(null); }}
              className="bg-black text-white px-4 py-2 rounded-lg shadow hover:opacity-95"
            >
              {showForm ? "Cerrar formulario" : "Nueva película"}
            </button>
          </div>
        </div>

        {/* Mensajes*/}
        <div className="space-y-3 mb-4">
          {formValidationError && (
            <div className="text-sm text-red-700 bg-red-50 border-l-4 border-red-600 p-3 rounded">
              {formValidationError}
            </div>
          )}

          {errorUI && <ErrorBox message={errorUI} onClose={() => setErrorUI(null)} />}

          {successUI && <SuccessBox message={successUI} onClose={() => setSuccessUI(null)} />}

          {deletePendingId && (
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded flex items-center justify-between">
              <div className="text-sm">
                ¿Confirmar eliminación de la película <strong>{(peliculas || []).find(p => p.id === deletePendingId)?.titulo}</strong>?
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleConfirmDelete(deletePendingId)} className="px-3 py-1 bg-black text-white rounded">Confirmar</button>
                <button onClick={() => setDeletePendingId(null)} className="px-3 py-1 border rounded">Cancelar</button>
              </div>
            </div>
          )}
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="mb-6 p-5 bg-white rounded-xl border shadow-md">
            <PeliculaForm
              onSubmit={handleSave}
              initialData={editPelicula}
              classifications={classifications} // lista de opciones para clasificación
              onCancel={() => { setShowForm(false); setEditPelicula(null); setFormValidationError(null); }}
            />
          </div>
        )}

        {/* Lista / grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <div className="text-gray-600">Cargando...</div>}
          {!loading && peliculas.length === 0 && <div className="text-gray-700">No hay películas registradas.</div>}

          {peliculas.map(p => (
            <PeliculaCard
              key={p.id}
              pelicula={p}
              onEdit={(pel) => { setEditPelicula(pel); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
