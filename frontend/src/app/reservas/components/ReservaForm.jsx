"use client";
import React, { useEffect, useState, useMemo } from "react";
import { api } from "../../services/api";
import SeatMap from "../../asientos/components/SeatMap"; // reutilizamos SeatMap existente
import ErrorBox from "../../components/ErrorBox";

export default function ReservaForm({ initial = {}, onCancel = () => {}, onSave, currentUserId = null }) {
  const [funciones, setFunciones] = useState([]);
  const [asientos, setAsientos] = useState([]);
  const [usuarioId, setUsuarioId] = useState(initial.usuarioId || currentUserId || "");
  const [funcionId, setFuncionId] = useState(initial.funcionId || "");
  const [selectedSeat, setSelectedSeat] = useState(initial.asientoId ? String(initial.asientoId) : "");
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [errorUI, setErrorUI] = useState(null);
  const [successUI, setSuccessUI] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.getFunciones().then(d => { if (mounted) setFunciones(d || []); }).catch(()=>{});
    return () => { mounted = false; };
  }, []);

  // cuando cambia la función, cargar asientos de la sala asociada
  useEffect(() => {
    if (!funcionId) {
      setAsientos([]);
      setSelectedSeat("");
      return;
    }
    let mounted = true;
    setLoadingSeats(true);
    setErrorUI(null);
    setAsientos([]);

    api.getFuncion(funcionId)
      .then(async f => {
        if (!mounted) return;
        const salaId = f?.salaId ?? f?.Sala?.id;
        if (!salaId) {
          setAsientos([]);
          setSelectedSeat("");
          setLoadingSeats(false);
          setErrorUI("No se encontró la sala asociada a la función.");
          return;
        }
        const getAsientos = api.getAsientosBySala ? api.getAsientosBySala : (id => fetch(`/api/salas/${id}/asientos`).then(r=>r.json()));
        const a = await getAsientos(salaId);
        if (!mounted) return;
        // filtrar asientos disponibles (estado distinto de 'reservado' o 'vendido')
        const disponibles = (a || []).filter(s => !s.estado || (s.estado !== "reservado" && s.estado !== "vendido"));
        setAsientos(disponibles);
        setSelectedSeat(disponibles.length ? String(disponibles[0].id) : "");
      })
      .catch(err => {
        console.error("Error cargando asientos", err);
        setAsientos([]);
        setSelectedSeat("");
        setErrorUI("No fue posible cargar los asientos para la función seleccionada.");
      })
      .finally(() => setLoadingSeats(false));

    return () => { mounted = false; };
  }, [funcionId]);

  function handleSeatClickForSelection(seat) {
    // solo seleccionar si disponible
    if (!seat) return;
    if (seat.estado === "reservado" || seat.estado === "vendido") {
      setErrorUI("Ese asiento no está disponible.");
      return;
    }
    setSelectedSeat(String(seat.id));
    setErrorUI(null);
    setSuccessUI(`Asiento seleccionado: ${seat.fila}${seat.numero}`);
    setTimeout(()=>setSuccessUI(null), 2000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorUI(null);
    if (!usuarioId) { setErrorUI("Usuario requerido."); return; }
    if (!funcionId) { setErrorUI("Selecciona una función."); return; }
    if (!selectedSeat) { setErrorUI("Selecciona un asiento disponible."); return; }

    const payload = {
      usuarioId: Number(usuarioId),
      funcionId: Number(funcionId),
      asientoId: Number(selectedSeat),
      estado: initial.estado || "pendiente"
    };

    try {
      await onSave(payload);
    } catch (err) {
      const m = err?.body?.message || err?.message || String(err) || "Error al crear la reserva.";
      setErrorUI(m);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="text-black">
      {errorUI && <div className="mb-3"><ErrorBox message={errorUI} onClose={() => setErrorUI(null)} /></div>}
      {successUI && <div className="mb-3"><div className="bg-green-50 border-l-4 border-green-600 text-green-800 p-3 rounded">{successUI}</div></div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Usuario ID</label>
          <input value={usuarioId} onChange={e => setUsuarioId(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="ID del usuario" />
          <div className="text-xs text-gray-500 mt-1">Temporal: reemplaza por usuario autenticado luego.</div>

          <label className="block text-sm font-medium mt-4 mb-1">Función</label>
          <select value={funcionId} onChange={e => setFuncionId(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">-- Selecciona función --</option>
            {funciones.map(f => (
              <option key={f.id} value={f.id}>
                {f.Pelicula?.titulo || `Func ${f.id}`} — {new Date(f.fecha_hora || f.fecha || f.funcionFecha || "").toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Asientos (selecciona en el mapa)</label>
          <div className="mb-2 text-xs text-gray-600">Haz clic en un asiento disponible para seleccionarlo. Los reservados no son seleccionables.</div>

          <div className="p-3 bg-white border rounded">
            {loadingSeats ? (
              <div className="text-sm text-gray-600">Cargando asientos...</div>
            ) : asientos.length === 0 ? (
              <div className="text-sm text-gray-600">No hay asientos disponibles para la función seleccionada.</div>
            ) : (
              // SeatMap acepta seats + onSeatClick; utilizamos seats (pero SeatMap pinta 'reservado' y 'disponible')
              <SeatMap seats={asientos} onSeatClick={handleSeatClickForSelection} />
            )}
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Asiento seleccionado</label>
            <div className="w-full border rounded px-3 py-2">
              {selectedSeat ? `ID: ${selectedSeat}` : "Ninguno"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-black text-white rounded">Reservar</button>
      </div>
    </form>
  );
}
