"use client";
import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { api } from "../services/api";
import SalaCard from "./components/SalaCard";
import SalaForm from "./components/SalaForm";
import SeatMap from "../asientos/components/SeatMap";
import ErrorBox from "../asientos/components/ErrorBox";

export default function SalasPage() {
  const { data: salas, setData, loading, error, refetch } = useFetch(() => api.getSalas(), []);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [errorUI, setErrorUI] = useState(null);
  const [successUI, setSuccessUI] = useState(null);
  const [deletePendingId, setDeletePendingId] = useState(null);
  const [viewingSala, setViewingSala] = useState(null); 
  const [viewSeats, setViewSeats] = useState([]); 
  const [mapLoading, setMapLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function autoReleasePastFunctions() {
      if (!salas || salas.length === 0) return;
      const now = new Date();
      const toUpdate = [];
      salas.forEach(s => {
        if (s?.pelicula && s?.funcionFecha) {
          const f = new Date(s.funcionFecha);
          if (!isNaN(f) && f <= now) {
            toUpdate.push(s);
          }
        }
      });

      if (toUpdate.length === 0) return;

      setData(prev => {
        if (!prev) return prev;
        return prev.map(s => {
          if (toUpdate.some(t => t.id === s.id)) {
            return { ...s, pelicula: null, funcionFecha: null };
          }
          return s;
        });
      });

      const results = await Promise.allSettled(toUpdate.map(s => {
        return api.updateSala?.(s.id, { pelicula: null, funcionFecha: null });
      }));

      const failed = results.map((r, idx) => ({ r, sala: toUpdate[idx] })).filter(x => x.r.status === "rejected");
      if (failed.length > 0 && mounted) {
        setErrorUI(`No fue posible liberar ${failed.length} sala(s) automáticamente. Revisa la conexión o inténtalo manualmente.`);
      } else if (mounted && failed.length === 0) {
        setSuccessUI(`${toUpdate.length} sala(s) liberadas automáticamente al vencer la función.`);
        setTimeout(() => setSuccessUI(null), 5000);
      }
    }

    autoReleasePastFunctions();
    return () => { mounted = false; };
  }, [salas]);

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

  function extractSeatsCount(payload) {
    const keys = ["capacidad", "cantidad", "numeroAsientos", "cantidadAsientos", "asientos"];
    for (const k of keys) {
      if (payload[k] !== undefined && payload[k] !== null) {
        const n = Number(payload[k]);
        if (!Number.isNaN(n)) return n;
      }
    }
    return null;
  }

  function validateSeatsCount(payload) {
    const n = extractSeatsCount(payload);
    if (n === null) return { ok: true };
    if (!Number.isInteger(n)) return { ok: false, msg: "La cantidad de asientos debe ser un número entero." };
    if (n < 50) return { ok: false, msg: "El mínimo de asientos por sala es 50." };
    if (n > 255) return { ok: false, msg: "El máximo de asientos por sala es 255." };
    return { ok: true };
  }

  async function handleCreate(payload) {
    try {
      const v = validateSeatsCount(payload);
      if (!v.ok) {
        setErrorUI(v.msg);
        return;
      }

      const nuevo = await api.createSala(payload);
      setData(prev => prev ? [nuevo, ...prev] : [nuevo]);
      setShowForm(false);
      setSuccessUI("Sala creada correctamente.");
      setTimeout(() => setSuccessUI(null), 4000);
    } catch (err) {
      setErrorUI("Error creando sala: " + (err?.body?.message || err?.message || String(err)));
    }
  }

  async function handleUpdate(id, payload) {
    try {
      const v = validateSeatsCount(payload);
      if (!v.ok) {
        setErrorUI(v.msg);
        return;
      }

      await api.updateSala(id, payload);
      setData(prev => prev.map(s => (s.id === id ? { ...s, ...payload } : s)));
      setEditing(null);
      setShowForm(false);
      setSuccessUI("Sala actualizada correctamente.");
      setTimeout(() => setSuccessUI(null), 4000);
    } catch (err) {
      setErrorUI("Error actualizando sala: " + (err?.body?.message || err?.message || String(err)));
    }
  }

  function onEdit(sala) {
    setEditing(sala);
    setShowForm(true);
  }

  function onDelete(id) {
    setDeletePendingId(id);
  }

  async function handleConfirmDelete(id) {
    try {
      const sala = (salas || []).find(s => s.id === id);
      await api.deleteSala(id);
      setData(prev => prev.filter(s => s.id !== id));
      setDeletePendingId(null);
      setSuccessUI(`Sala ${sala?.nombre ?? sala?.id ?? ""} eliminada correctamente.`);
      setTimeout(() => setSuccessUI(null), 4000);
    } catch (err) {
      setErrorUI("Error al eliminar: " + (err?.body?.message || err?.message || String(err)));
      setDeletePendingId(null);
    }
  }

async function handleViewMap(sala) {
  setViewingSala(sala);
  setMapLoading(true);
  try {
    let seats = [];

    if (api.getAsientosBySala) {
      seats = await api.getAsientosBySala(sala.id);
    } else {
      const res = await fetch(`/api/salas/${sala.id}/asientos`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      seats = await res.json();
    }
    seats = (seats || []).map(s => ({ ...s, numero: String(s.numero) }));
    setViewSeats(seats);
  } catch (err) {
    setErrorUI("No se pudieron cargar los asientos para la vista de sala: " + (err?.message || String(err)));
  } finally {
    setMapLoading(false);
  }
}

  async function handleToggleSeat(seat) {
    const prev = seat.estado;
    const newEstado = prev === "reservado" ? "disponible" : "reservado";
    setViewSeats(prevSeats => prevSeats.map(s => s.id === seat.id ? { ...s, estado: newEstado } : s));
    setData(prev => prev ? prev.map(s => s.id === seat.id ? { ...s, estado: newEstado } : s) : prev);

    try {
      await api.updateAsiento(seat.id, { ...seat, estado: newEstado });
      setSuccessUI(`Asiento ${seat.fila}${seat.numero} actualizado.`);
      setTimeout(() => setSuccessUI(null), 3000);
    } catch (err) {
      setViewSeats(prevSeats => prevSeats.map(s => s.id === seat.id ? { ...s, estado: prev } : s));
      setData(prev => prev ? prev.map(s => s.id === seat.id ? { ...s, estado: prev } : s) : prev);
      setErrorUI("Error actualizando asiento: " + (err?.body?.message || err?.message || String(err)));
    }
  }

  if (loading) return <div className="p-6 bg-white text-black">Cargando salas...</div>;
  if (error) return <div className="p-6 bg-white text-red-600">Error: {String(error.message || error)}</div>;

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Salas — Panel</h1>
            <p className="mt-1 text-sm text-gray-700 max-w-xl">
              Administra salas, visualiza su mapa (vista superior), controla asignación de películas y configura la capacidad.
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={() => { setEditing(null); setShowForm(s => !s); }}
              className="bg-black text-white px-4 py-2 rounded-lg shadow hover:opacity-95"
            >
              {showForm ? "Cerrar" : "Nueva Sala"}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-3 mb-4">
          {errorUI && <ErrorBox message={errorUI} onClose={() => setErrorUI(null)} />}
          {successUI && <div className="mb-0"><SuccessBox message={successUI} onClose={() => setSuccessUI(null)} /></div>}
          {deletePendingId && (
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded flex items-center justify-between">
              <div className="text-sm">
                ¿Confirmar eliminación de la sala <strong>{(salas || []).find(s => s.id === deletePendingId)?.nombre}</strong>?
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleConfirmDelete(deletePendingId)} className="px-3 py-1 bg-black text-white rounded">Confirmar</button>
                <button onClick={() => setDeletePendingId(null)} className="px-3 py-1 border rounded">Cancelar</button>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-6 p-5 bg-white rounded-xl border shadow-md">
            <SalaForm
              initial={editing || {}}
              onCancel={() => { setShowForm(false); setEditing(null); setErrorUI(null); }}
              onSave={(data) => { // same signature: create or update handled here
                if (editing) handleUpdate(editing.id, data);
                else handleCreate(data);
              }}
            />
          </div>
        )}

        {/* Salas grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(salas || []).length === 0 && <div className="text-gray-700">No hay salas registradas.</div>}

          {(salas || []).map(s => {
            // determine movie status
            const hasMovie = !!s.pelicula;
            let movieStatus = "Disponible";
            if (hasMovie) {
              if (s.funcionFecha) {
                const f = new Date(s.funcionFecha);
                if (!isNaN(f) && f > new Date()) movieStatus = "Ocupada";
                else movieStatus = "Disponible";
              } else {
                movieStatus = "Ocupada";
              }
            }

            return (
              <div key={s.id} className="p-4 bg-white rounded-xl border shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{s.nombre ?? `Sala ${s.id}`}</h3>
                    <div className="text-sm text-gray-600">Capacidad: <strong>{s.capacidad ?? s.cantidad ?? s.numeroAsientos ?? "-"}</strong></div>
                    {s.funcionFecha && (
                      <div className="mt-2 text-xs text-gray-500">Función: {new Date(s.funcionFecha).toLocaleString()}</div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(s)} className="px-3 py-1 border rounded hover:shadow">Editar</button>
                      <button onClick={() => onDelete(s.id)} className="px-3 py-1 border rounded text-red-600">Eliminar</button>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleViewMap(s)} className="px-3 py-1 bg-black text-white rounded shadow">Ver mapa</button>
                    </div>
                  </div>
                </div>

                {/* small footer with extra info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div>Creada: {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "-"}</div>
                  <div>ID: {s.id}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map modal / panel */}
        {viewingSala && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
            <div className="absolute inset-0 bg-black/40" onClick={() => setViewingSala(null)} />
            <div className="relative max-w-4xl w-full bg-white rounded-xl shadow-xl p-6 z-60">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{viewingSala.nombre ?? `Sala ${viewingSala.id}`}</h3>
                  <div className="text-sm text-gray-600">{viewingSala.pelicula ? `Película: ${viewingSala.pelicula}` : "Sin película asignada"}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <button onClick={() => setViewingSala(null)} className="px-3 py-1 border rounded">Cerrar</button>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                {mapLoading ? (
                  <div className="text-center p-8 text-gray-600">Cargando mapa...</div>
                ) : (
                  <SeatMap seats={viewSeats} onSeatClick={handleToggleSeat} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
