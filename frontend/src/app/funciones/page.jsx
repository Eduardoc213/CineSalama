"use client";
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import FuncionCard from "./components/FuncionCard";
import FuncionForm from "./components/FuncionForm";
import ErrorBox from "../components/ErrorBox";
import SuccessBox from "../components/SuccessBox";

export default function FuncionesPage() {
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [errorUI, setErrorUI] = useState(null);
  const [successUI, setSuccessUI] = useState(null);
  const [deletePendingId, setDeletePendingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getFunciones();
      setFunciones(data || []);
    } catch (err) {
      console.error("Error cargando funciones", err);
      setErrorUI("No se pudieron cargar las funciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (payload) => {
    try {
      setErrorUI(null);
      setSuccessUI(null);
      setLoading(true);

      if (editing && editing.id) {
        await api.updateFuncion(editing.id, payload);
        setSuccessUI("Función actualizada correctamente.");
      } else {
        await api.createFuncion(payload);
        setSuccessUI("Función creada correctamente.");
      }

      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      console.error("Error guardando función", err);
      const msg = err?.body?.message || err?.message || "No se pudo guardar la función.";
      setErrorUI(msg);
    } finally {
      setLoading(false);
      setTimeout(() => { setSuccessUI(null); setErrorUI(null); }, 6000);
    }
  };

  const handleEdit = (f) => { setEditing(f); setShowForm(true); setErrorUI(null); setSuccessUI(null); };
  const handleDelete = (id) => { setDeletePendingId(id); };

  const confirmDelete = async (id) => {
    try {
      setLoading(true);
      await api.deleteFuncion(id);
      setSuccessUI("Función eliminada correctamente.");
      setDeletePendingId(null);
      await load();
    } catch (err) {
      console.error("Error eliminando funcion", err);
      setErrorUI(err?.body?.message || "No se pudo eliminar la función.");
      setDeletePendingId(null);
    } finally {
      setLoading(false);
      setTimeout(() => { setSuccessUI(null); setErrorUI(null); }, 6000);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Funciones</h1>
            <p className="mt-1 text-sm text-gray-700">Administra funciones — evita solapamientos y fechas pasadas.</p>
          </div>

          <div className="flex gap-3 items-center">
            <button onClick={() => { setEditing(null); setShowForm(s => !s); setErrorUI(null); }} className="bg-black text-white px-4 py-2 rounded-lg shadow">
              {showForm ? "Cerrar" : "Nueva Función"}
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {errorUI && <ErrorBox message={errorUI} onClose={() => setErrorUI(null)} />}
          {successUI && <SuccessBox message={successUI} onClose={() => setSuccessUI(null)} />}
          {deletePendingId && (
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded flex items-center justify-between">
              <div className="text-sm">¿Confirmar eliminación de la función <strong>{(funciones||[]).find(x=>x.id===deletePendingId)?.id}</strong>?</div>
              <div className="flex gap-2">
                <button onClick={() => confirmDelete(deletePendingId)} className="px-3 py-1 bg-black text-white rounded">Confirmar</button>
                <button onClick={() => setDeletePendingId(null)} className="px-3 py-1 border rounded">Cancelar</button>
              </div>
            </div>
          )}
        </div>

        {showForm && (
          <div className="mb-6 p-4 bg-white rounded-xl border shadow-sm">
            <FuncionForm initial={editing || {}} onCancel={() => { setShowForm(false); setEditing(null); setErrorUI(null); }} onSave={handleSave} />
          </div>
        )}

        {loading ? <div className="text-gray-600">Cargando funciones...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(funciones||[]).length === 0 && <div className="text-gray-700">No hay funciones.</div>}
            {(funciones||[]).map(f => <FuncionCard key={f.id} funcion={f} onEdit={handleEdit} onDelete={(id)=> setDeletePendingId(id)} />)}
          </div>
        )}
      </div>
    </div>
  );
}
