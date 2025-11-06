"use client";
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import SeatMap from "../../asientos/components/SeatMap";
import ErrorBox from "../../components/ErrorBox";

const SEAT_PRICE_Q = 40; // precio fijo en quetzales

export default function ReservaForm({ initial = {}, onCancel = () => {}, onSave, currentUserId = null }) {
  const [funciones, setFunciones] = useState([]);
  const [asientos, setAsientos] = useState([]); // todos los asientos de la sala
  const [funcionId, setFuncionId] = useState(initial.funcionId || "");
  const [selectedSeat, setSelectedSeat] = useState(initial.asientoId ? String(initial.asientoId) : "");
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [errorUI, setErrorUI] = useState(null);
  const [successUI, setSuccessUI] = useState(null);

  // El usuarioId ahora viene automáticamente del usuario logueado
  const usuarioId = currentUserId;

  useEffect(() => {
    let mounted = true;
    api.getFunciones().then(d => { if (mounted) setFunciones(d || []); }).catch(()=>{});
    return () => { mounted = false; };
  }, []);

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

        // obtener TODOS los asientos de la sala (para mostrar mapa con ocupados)
        const getAsientos = api.getAsientosBySala ? api.getAsientosBySala : (id => fetch(`/api/asientos/sala/${id}`).then(r=>r.json()));
        const a = await getAsientos(salaId);
        if (!mounted) return;

        // ponemos todos los asientos en el mapa
        setAsientos(a || []);

        // seleccionar por defecto el primer asiento disponible (si existe)
        const disponibles = (a || []).filter(s => !s.estado || (String(s.estado).toLowerCase() !== "reservado" && String(s.estado).toLowerCase() !== "vendido"));
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
    if (!seat) return;
    // SeatMap marcará __occupiedClick para clicks en asientos ocupados
    if (seat.__occupiedClick || String(seat.estado || "").toLowerCase() === "reservado" || String(seat.estado || "").toLowerCase() === "vendido") {
      setErrorUI("Ese asiento no está disponible.");
      return;
    }
    setSelectedSeat(String(seat.id));
    setErrorUI(null);
    setSuccessUI(`Asiento seleccionado: ${seat.fila}${seat.numero}`);
    setTimeout(() => setSuccessUI(null), 2000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorUI(null);
    
    if (!usuarioId) { 
      setErrorUI('Error: Usuario no identificado. Por favor, inicia sesión nuevamente.'); 
      return; 
    }
    if (!funcionId) { setErrorUI('Selecciona una función.'); return; }
    if (!selectedSeat) { setErrorUI('Selecciona un asiento disponible.'); return; }

    const payload = {
      usuarioId: Number(usuarioId),
      funcionId: Number(funcionId),
      asientoId: Number(selectedSeat),
      estado: initial.estado || 'pendiente'
    };

    try {
      await onSave(payload);
    } catch (err) {
      const m = err?.body?.message || err?.message || String(err) || 'Error al crear la reserva.';
      setErrorUI(m);
    }
  }

  // lista de asientos disponibles para mostrar en <select>
  const asientosDisponibles = (asientos || []).filter(s => !s.estado || (String(s.estado).toLowerCase() !== "reservado" && String(s.estado).toLowerCase() !== "vendido"));

  return (
    <form onSubmit={handleSubmit} className="text-black">
      {errorUI && <div className="mb-3"><ErrorBox message={errorUI} onClose={() => setErrorUI(null)} /></div>}
      {successUI && <div className="mb-3"><div className="bg-green-50 border-l-4 border-green-600 text-green-800 p-3 rounded">{successUI}</div></div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {/* CAMPO OCULTO - El usuario se asigna automáticamente */}
          <input type="hidden" value={usuarioId} />

          <label className="block text-sm font-medium mb-1">Película y Función</label>
          <select 
            value={funcionId} 
            onChange={e => setFuncionId(e.target.value)} 
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-black focus:border-black"
          >
            <option value="">-- Selecciona una función --</option>
            {funciones.map(f => (
              <option key={f.id} value={f.id}>
                {f.Pelicula?.titulo || `Película ${f.peliculaId}`} — {new Date(f.fecha_hora || f.fecha || f.funcionFecha || '').toLocaleString()}
              </option>
            ))}
          </select>
          
          <div className="mt-4 p-3 bg-gray-50 rounded border">
            <div className="text-sm font-medium text-gray-700">Reservando para:</div>
            <div className="text-sm text-gray-900 mt-1">Usuario actual (automático)</div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Selecciona asiento (lista)</label>
            {loadingSeats ? (
              <div className="text-sm text-gray-600">Cargando asientos...</div>
            ) : asientosDisponibles.length === 0 ? (
              <div className="text-sm text-gray-600">No hay asientos disponibles para la función seleccionada.</div>
            ) : (
              <select value={selectedSeat} onChange={e => setSelectedSeat(e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="">-- Selecciona asiento --</option>
                {asientosDisponibles.map(a => (
                  <option key={a.id} value={a.id}>{a.fila}{a.numero} ({a.tipo || "normal"})  — Q{SEAT_PRICE_Q}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Selecciona tu Asiento (mapa)</label>
          <div className="mb-2 text-xs text-gray-600">
            Haz clic en un asiento disponible para seleccionarlo. Los asientos ocupados no están disponibles y aparecerán bloqueados.
          </div>

          <div className="p-3 bg-white border border-gray-300 rounded">
            {loadingSeats ? (
              <div className="text-sm text-gray-600">Cargando asientos disponibles...</div>
            ) : asientos.length === 0 ? (
              <div className="text-sm text-gray-600">
                {funcionId ? 'No hay asientos configurados para esta sala.' : 'Selecciona una función primero.'}
              </div>
            ) : (
              // ahora pasamos TODOS los asientos para que el mapa muestre ocupados
              <SeatMap seats={asientos.map(s => ({ ...s, priceQ: SEAT_PRICE_Q }))} onSeatClick={handleSeatClickForSelection} />
            )}
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Asiento seleccionado</label>
            <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50">
              {selectedSeat ? 
                `Asiento seleccionado (ID: ${selectedSeat}) — Q${SEAT_PRICE_Q}` : 
                'Ningún asiento seleccionado'
              }
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3 justify-end">
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          Confirmar Reserva — Q{SEAT_PRICE_Q}
        </button>
      </div>
    </form>
  );
}
