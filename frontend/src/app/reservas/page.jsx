"use client";
import React, { useEffect, useState, useMemo } from "react";
import { api } from "../services/api";
import ReservaForm from "./components/ReservaForm";
import ReservaCard from "./components/ReservaCard";
import ErrorBox from "../components/ErrorBox";
import SuccessBox from "../components/SuccessBox";

export default function ReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [errorUI, setErrorUI] = useState(null);
  const [successUI, setSuccessUI] = useState(null);
  const [deletePendingId, setDeletePendingId] = useState(null);
  const currentUserId = useMemo(() => {
    if (typeof window === "undefined") return null;
    const qs = new URLSearchParams(window.location.search);
    return qs.get("userId") || window.localStorage.getItem("userId") || null;
  }, []);

  const isAdmin = useMemo(() => {
    if (typeof window === "undefined") return false;
    const qs = new URLSearchParams(window.location.search);
    return qs.get("admin") === "1" || window.localStorage.getItem("isAdmin") === "1";
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getReservas();
      const sorted = (data || []).slice().sort((a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0));
      setReservas(sorted);
    } catch (err) {
      console.error("Error cargando reservas", err);
      setErrorUI("No se pudieron cargar las reservas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Mostrar reservas: admin -> todas, usuario -> solo las suyas (si currentUserId existe)
  const visibleReservas = useMemo(() => {
    if (isAdmin) return reservas;
    if (!currentUserId) return reservas.filter(r => false); 
    return (reservas || []).filter(r => String(r.usuarioId) === String(currentUserId));
  }, [reservas, isAdmin, currentUserId]);

  // Crear reserva: hacemos createReserva, luego marcamos asiento como reservado.
  const handleCreate = async (payload) => {
    try {
      setErrorUI(null);
      setSuccessUI(null);
      setLoading(true);
      const newRes = await api.createReserva(payload);

      // intentar bloquear asiento
      try {
        await api.updateAsiento(payload.asientoId, { estado: "reservado" });
      } catch (err) {
        console.warn("No se pudo marcar asiento como reservado:", err);
        // rollback: eliminar reserva creada si no se pudo reservar el asiento
        try {
          if (newRes && newRes.id) await api.deleteReserva(newRes.id);
        } catch (rollbackErr) {
          console.error("Rollback de reserva falló:", rollbackErr);
        }
        setErrorUI("No fue posible reservar el asiento (otro usuario pudo haberlo tomado). Intenta con otro asiento.");
        setLoading(false);
        await load();
        return;
      }

      setSuccessUI("Reserva creada correctamente.");
      setShowForm(false);
      await load();
    } catch (err) {
      console.error("Error creando reserva", err);
      setErrorUI(err?.body?.message || err?.message || "No se pudo crear la reserva.");
      await load();
    } finally {
      setLoading(false);
      setTimeout(() => { setErrorUI(null); setSuccessUI(null); }, 6000);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      setErrorUI(null);
      setSuccessUI(null);
      await api.updateReserva(id, { estado: "pagado" });
      setSuccessUI("Reserva marcada como pagada.");
      await load();
    } catch (err) {
      console.error("Error marcando pagado", err);
      setErrorUI(err?.body?.message || "No se pudo marcar como pagado.");
    } finally {
      setTimeout(() => { setErrorUI(null); setSuccessUI(null); }, 5000);
    }
  };

  const handleCancel = async (id) => {
    try {
      setErrorUI(null);
      setSuccessUI(null);
      await api.updateReserva(id, { estado: "cancelado" });
      setSuccessUI("Reserva cancelada.");
      await load();
    } catch (err) {
      console.error("Error cancelando", err);
      setErrorUI(err?.body?.message || "No se pudo cancelar la reserva.");
      setTimeout(()=>setErrorUI(null), 5000);
    }
  };

  const handleDelete = (id) => {
    setDeletePendingId(id);
  };

  const confirmDelete = async (id) => {
    try {
      setErrorUI(null);
      setSuccessUI(null);
      await api.deleteReserva(id);
      setSuccessUI("Reserva eliminada.");
      setDeletePendingId(null);
      await load();
    } catch (err) {
      console.error("Error eliminando reserva", err);
      setErrorUI(err?.body?.message || "No se pudo eliminar la reserva.");
      setDeletePendingId(null);
    } finally {
      setTimeout(()=>{ setErrorUI(null); setSuccessUI(null); }, 6000);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Reservas</h1>
            <p className="mt-1 text-sm text-gray-700">Mis reservas.</p>
          </div>
          <div className="flex gap-3 items-center">
            <button onClick={() => setShowForm(s => !s)} className="bg-black text-white px-4 py-2 rounded-lg shadow">
              {showForm ? "Cerrar" : "Nueva Reserva"}
            </button>
            <div className="text-xs text-gray-500">
              {isAdmin ? "Modo: Administrador (todas las reservas)" : (currentUserId ? `Usuario: ${currentUserId}` : "Usuario no identificado")}
            </div>
          </div>
        </header>

        <div className="space-y-3 mb-4">
          {errorUI && <ErrorBox message={errorUI} onClose={() => setErrorUI(null)} />}
          {successUI && <SuccessBox message={successUI} onClose={() => setSuccessUI(null)} />}

          {deletePendingId && (
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded flex items-center justify-between">
              <div className="text-sm">
                ¿Confirmar eliminación de la reserva <strong>{deletePendingId}</strong>?
              </div>
              <div className="flex gap-2">
                <button onClick={() => confirmDelete(deletePendingId)} className="px-3 py-1 bg-black text-white rounded">Confirmar</button>
                <button onClick={() => setDeletePendingId(null)} className="px-3 py-1 border rounded">Cancelar</button>
              </div>
            </div>
          )}
        </div>

        {showForm && (
          <div className="mb-6 p-4 bg-white rounded-xl border shadow-sm">
            <ReservaForm
              onCancel={() => setShowForm(false)}
              onSave={handleCreate}
              currentUserId={currentUserId}
            />
          </div>
        )}

        {loading ? (
          <div className="text-gray-600">Cargando reservas...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {visibleReservas.length === 0 && <div className="text-gray-700">No hay reservas visibles.</div>}
            {visibleReservas.map(r => (
              <ReservaCard
                key={r.id}
                reserva={r}
                onMarkPaid={handleMarkPaid}
                onCancel={handleCancel}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
