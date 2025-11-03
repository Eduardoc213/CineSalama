"use client";
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import EstrenoCard from "./components/EstrenoCard";
import EstrenoForm from "./components/EstrenoForm";
import ErrorBox from "../components/ErrorBox";
import SuccessBox from "../components/SuccessBox";

export default function EstrenosPage() {
  const [estrenos, setEstrenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [errorUI, setErrorUI] = useState(null);
  const [successUI, setSuccessUI] = useState(null);
  const [deletePendingId, setDeletePendingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getEstrenos();
      setEstrenos(data || []);
    } catch (err) {
      console.error("Error al cargar estrenos", err);
      setErrorUI("No se pudieron cargar los estrenos.");
      setTimeout(() => setErrorUI(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Validar: no permitir misma pelicula ya estrenada (si no es edición)
  async function peliculaYaTieneEstreno(peliculaId) {
    try {
      const list = await api.getEstrenos();
      return (list || []).some(s => {
        const pid = s.peliculaId ?? s.pelicula?.id ?? s.peliculaId;
        return String(pid) === String(peliculaId);
      });
    } catch (err) {
      // si falla petición, no bloquear por defecto
      return false;
    }
  }

  const handleSave = async (payload) => {
    try {
      setErrorUI(null);
      setSuccessUI(null);
      // validar fecha 
      const fecha = payload?.fecha_estreno ? new Date(payload.fecha_estreno) : null;
      if (!fecha || isNaN(fecha)) { setErrorUI("Indica fecha y hora del estreno."); return; }
      if (fecha.getTime() < Date.now() - 1000) { setErrorUI("No puedes crear un estreno en una fecha pasada."); return; }

      // validar duplicado (si es nueva creación)
      if (!editing || !editing.id) {
        const dup = await peliculaYaTieneEstreno(payload.peliculaId);
        if (dup) {
          setErrorUI("Esa película ya tiene un estreno registrado. No se puede crear dos estrenos para la misma película.");
          return;
        }
      } else {
        // si editando y cambia peliculaId, verificar también
        if (String(editing.peliculaId) !== String(payload.peliculaId)) {
          const dup = await peliculaYaTieneEstreno(payload.peliculaId);
          if (dup) {
            setErrorUI("Esa película ya tiene un estreno registrado. No se puede crear dos estrenos para la misma película.");
            return;
          }
        }
      }

      setLoading(true);

      let createdEstreno = null;
      if (editing && editing.id) {
        await api.updateEstreno(editing.id, payload);
        createdEstreno = { ...(editing || {}), ...payload, id: editing.id };
        setSuccessUI("Estreno actualizado correctamente.");
      } else {
        const res = await api.createEstreno(payload);
        createdEstreno = res && res.id ? res : null;
        if (!createdEstreno) {
          await load();
          const list = await api.getEstrenos();
          const found = (list || []).find(s => {
            const f = new Date(s.fecha_estreno ?? s.funcionFecha ?? s.fecha ?? s.fechaHora);
            return String(s.peliculaId ?? s.pelicula?.id ?? "") === String(payload.peliculaId)
              && f && Math.abs(f.getTime() - new Date(payload.fecha_estreno).getTime()) < 2000;
          });
          createdEstreno = found || null;
        } else {
          await load();
        }
        setSuccessUI("Estreno creado correctamente.");
      }

      // crea la funcion automaticamente al crear un estreno
      try {
        if (typeof api.createFuncion === "function") {
          const peliculaIdForFuncion = createdEstreno?.peliculaId ?? payload.peliculaId ?? null;
          const salaIdForFuncion = payload.salaId ?? null;
          const fechaISOforFuncion = payload.fecha_estreno ?? null;

          if (!peliculaIdForFuncion || !salaIdForFuncion || !fechaISOforFuncion) {
            // no intentamos crear la función automáticamente si faltan campos obligatorios
            console.warn("No se creó función automáticamente por que no ingreso la sala.");
          } else {
            const funcionPayload = {
              peliculaId: Number(peliculaIdForFuncion),
              salaId: Number(salaIdForFuncion),
              fecha_hora: String(fechaISOforFuncion) 
            };
            await api.createFuncion(funcionPayload);
            setSuccessUI(prev => (prev ? prev + " Función creada automáticamente." : "Función creada automáticamente."));
          }
        }
      } catch (err) {
        console.warn("No se pudo crear función automáticamente:", err);
        setErrorUI("Advertencia: no se pudo crear la función automáticamente. Verifica campos vacios.");
      }


      setShowForm(false);
      setEditing(null);
      setTimeout(() => { setSuccessUI(null); setErrorUI(null); }, 6000);
    } catch (err) {
      console.error("Error guardando estreno", err);
      setErrorUI("No se pudo guardar el estreno: " + (err?.body?.message || err?.message || String(err)));
    } finally {
      setLoading(false);
      await load();
    }
  };

  const handleEdit = (e) => { setEditing(e); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleDelete = (id) => { setDeletePendingId(id); };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await api.deleteEstreno(id);
      setSuccessUI("Estreno eliminado correctamente.");
      setDeletePendingId(null);
      await load();
    } catch (err) {
      console.error("Error eliminando estreno", err);
      setErrorUI("No se pudo eliminar el estreno: " + (err?.body?.message || err?.message || String(err)));
      setDeletePendingId(null);
    } finally {
      setLoading(false);
      setTimeout(() => { setSuccessUI(null); setErrorUI(null); }, 5000);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Estrenos — Panel</h1>
            <p className="mt-1 text-sm text-gray-700">Administra estrenos y funciones.</p>
          </div>

          <div className="flex gap-3 items-center">
            <button onClick={() => { setEditing(null); setShowForm(s => !s); setErrorUI(null); }} className="bg-black text-white px-4 py-2 rounded-lg shadow">
              {showForm ? "Cerrar" : "Nuevo Estreno"}
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {errorUI && <ErrorBox message={errorUI} onClose={() => setErrorUI(null)} />}
          {successUI && <SuccessBox message={successUI} onClose={() => setSuccessUI(null)} />}
          {deletePendingId && (
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded flex items-center justify-between">
              <div className="text-sm">
                ¿Confirmar eliminación del estreno <strong>{(estrenos || []).find(x => x.id === deletePendingId)?.titulo}</strong>?
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleConfirmDelete(deletePendingId)} className="px-3 py-1 bg-black text-white rounded">Confirmar</button>
                <button onClick={() => setDeletePendingId(null)} className="px-3 py-1 border rounded">Cancelar</button>
              </div>
            </div>
          )}
        </div>

        {showForm && (
          <div className="mb-6 p-4 bg-white rounded-xl border shadow-sm">
            <EstrenoForm initial={editing || {}} onCancel={() => { setShowForm(false); setEditing(null); setErrorUI(null); }} onSave={handleSave} />
          </div>
        )}

        {loading ? <div className="text-gray-600">Cargando...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(estrenos || []).length === 0 && <div className="text-gray-700">No hay estrenos.</div>}
            {(estrenos || []).map(e => <EstrenoCard key={e.id} estreno={e} onEdit={handleEdit} onDelete={(id)=> setDeletePendingId(id)} />)}
          </div>
        )}
      </div>
    </div>
  );
}
