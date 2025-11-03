"use client";
import { useState, useEffect, useMemo } from "react";
import useFetch from "../hooks/useFetch";
import { api } from "../services/api";
import SeatMap from "./components/SeatMap";
import AsientoForm from "./components/AsientoForm";
import ErrorBox from "./components/ErrorBox";

export default function AsientosPage() {
  const { data: asientos, setData, loading, error, refetch } = useFetch(() => api.getAsientos(), []);
  const [salas, setSalas] = useState([]);
  const [selectedSala, setSelectedSala] = useState(""); // id de sala seleccionada para filtrar
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errorUI, setErrorUI] = useState(null);
  const [successUI, setSuccessUI] = useState(null);
  const [deletePendingId, setDeletePendingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (api.getSalas) {
      api.getSalas().then(list => {
        if (!mounted) return;
        setSalas(list || []);
        // si no hay sala seleccionada por defecto, usar la primera
        if (!selectedSala && list && list.length > 0) setSelectedSala(String(list[0].id));
      }).catch(() => { /* ignore */ });
    }
    return () => { mounted = false; };
  }, []);

  const seatsFiltered = useMemo(() => {
    if (!asientos || asientos.length === 0) return [];
    const arr = selectedSala ? asientos.filter(s => String(s.salaId) === String(selectedSala)) : asientos.slice();
    // ordenar: fila alfabeticamente, luego numero numéricamente
    arr.sort((a, b) => {
      const fa = String(a.fila || "").toUpperCase();
      const fb = String(b.fila || "").toUpperCase();
      if (fa !== fb) return fa.localeCompare(fb, undefined, { numeric: false });
      const na = Number(a.numero);
      const nb = Number(b.numero);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return String(a.numero).localeCompare(String(b.numero), undefined, { numeric: true });
    });
    return arr;
  }, [asientos, selectedSala]);

  useEffect(() => {
    if (salas && salas.length > 0 && !selectedSala) setSelectedSala(String(salas[0].id));
  }, [salas, selectedSala]);

  async function handleCreate(data, options = {}) {
    try {
      const filaNorm = String(data.fila || "").toUpperCase();
      const salaNorm = String(data.salaId || "");

      // --- VALIDACIÓN: máximo 15 asientos por fila (single) ---
      if (!options.bulk) {
        const existentes = (asientos || []).filter(a => String(a.fila || "").toUpperCase() === filaNorm && String(a.salaId) === salaNorm).length;
        if (existentes + 1 > 15) {
          setErrorUI(`No se pueden tener más de 15 asientos en la fila ${filaNorm} (sala ${salaNorm}).`);
          return;
        }

        if ((asientos || []).some(a => String(a.fila).toUpperCase() === filaNorm && String(a.numero) === String(data.numero) && String(a.salaId) === salaNorm)) {
          setErrorUI(`Ya existe un asiento ${data.numero} en la fila ${data.fila} para la sala ${data.salaId}.`);
          return;
        }

        const nuevo = await api.createAsiento(data);
        setData(prev => prev ? [nuevo, ...prev] : [nuevo]);
        setShowForm(false);
        setErrorUI(null);
        setSuccessUI(`Asiento ${nuevo.fila}${nuevo.numero} creado correctamente.`);
        setTimeout(() => setSuccessUI(null), 5000);
        return;
      }

      // --- MODO MASIVO ---
      const { from, count } = options.bulk;
      const cnt = Number(count) || 0;

      // validar count razonable
      if (cnt <= 0) {
        setErrorUI("Cantidad inválida para creación masiva.");
        return;
      }

      // validar límite 15 asientos por fila (existentes + count <= 15)
      const existentesMasivo = (asientos || []).filter(a => String(a.fila || "").toUpperCase() === filaNorm && String(a.salaId) === salaNorm).length;
      if (existentesMasivo + cnt > 15) {
        setErrorUI(`No se pueden crear ${cnt} asientos: ya hay ${existentesMasivo} en la fila ${filaNorm}. Límite por fila = 15.`);
        return;
      }

      const tasks = [];
      for (let i = 0; i < cnt; i++) {
        const numero = String(Number(from) + i);
        const asiento = { ...data, numero };
        const dup = (asientos || []).some(a => String(a.fila).toUpperCase() === filaNorm && String(a.numero) === String(asiento.numero) && String(a.salaId) === salaNorm);
        if (dup) tasks.push(Promise.reject({ __meta: { numero }, body: { message: "Ya existe (omitido)" } }));
        else tasks.push(api.createAsiento(asiento));
      }

      const results = await Promise.allSettled(tasks);
      const created = results.filter(r => r.status === "fulfilled").map(r => r.value);
      const failed = results.filter(r => r.status === "rejected").map(r => r.reason);

      if (created.length) {
        setData(prev => prev ? [...created, ...prev] : [...created]);
        setSuccessUI(`${created.length} asientos creados correctamente.`);
        setTimeout(() => setSuccessUI(null), 5000);
      }

      if (failed.length) {
        const msgs = failed.map((f, idx) => {
          const num = f?.__meta?.numero ?? (Number(from) + idx);
          const m = f?.body?.message || f?.message || String(f);
          return `Asiento ${num}: ${m}`;
        }).slice(0, 10).join("\n");
        setErrorUI(`Algunos asientos no se crearon:\n${msgs}`);
      } else {
        setErrorUI(null);
      }

      setShowForm(false);
    } catch (err) {
      setErrorUI(err?.body?.message || err?.message || String(err));
    }
  }

  async function handleUpdate(id, payload) {
    try {
      const dup = (asientos || []).some(a => a.id !== id && String(a.fila).toUpperCase() === String(payload.fila).toUpperCase() && String(a.numero) === String(payload.numero) && String(a.salaId) === String(payload.salaId));
      if (dup) { setErrorUI(`Ya existe un asiento ${payload.numero} en la fila ${payload.fila} para la sala ${payload.salaId}.`); return; }

      await api.updateAsiento(id, payload);
      setData(prev => prev.map(a => a.id === id ? { ...a, ...payload } : a));
      setEditing(null);
      setShowForm(false);
      setErrorUI(null);
    } catch (err) {
      const serverMsg = err?.body?.message || err?.message || String(err);
      if (String(serverMsg).toLowerCase().includes("no encontrado") || String(serverMsg).toLowerCase().includes("not found")) {
        try { const fresh = await api.getAsientos(); setData(fresh); } catch (_) {}
        setErrorUI("No fue posible actualizar: el asiento ya no existe en el servidor. Se actualizó la lista.");
      } else {
        setErrorUI(serverMsg);
      }
    }
  }

  async function handleDelete(id) {
    setDeletePendingId(id);
  }

  async function handleConfirmDelete(id) {
    try {
      const asiento = (asientos || []).find(a => a.id === id);
      await api.deleteAsiento(id);
      setData(prev => prev.filter(a => a.id !== id));
      setSuccessUI(`Asiento ${asiento?.fila ?? ""}${asiento?.numero ?? ""} eliminado correctamente.`);
      setDeletePendingId(null);
      setTimeout(() => setSuccessUI(null), 5000);
    } catch (err) {
      setErrorUI(err?.body?.message || err?.message || String(err));
      setDeletePendingId(null);
    }
  }

  if (loading) return <div className="min-h-screen bg-white text-black p-6">Cargando asientos...</div>;
  if (error) return <div className="min-h-screen bg-white text-black p-6">Error: {String(error.message || error)}</div>;
  const salaInfo = salas.find(s => String(s.id) === String(selectedSala));

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

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Gestión de Asientos</h1>
            <p className="mt-1 text-sm text-gray-700">Selecciona una sala para ver sus asientos ordenados por fila y número.</p>
          </div>

          <div className="flex gap-3 items-center">
            <select
              value={selectedSala}
              onChange={e => setSelectedSala(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">-- Todas las salas --</option>
              {salas.map(s => <option key={s.id} value={String(s.id)}>{s.nombre ?? `Sala ${s.id}`}</option>)}
            </select>

            <button onClick={() => { setEditing(null); setShowForm(s => !s); }} className="bg-black text-white px-4 py-2 rounded-lg shadow">
              {showForm ? "Cerrar" : "Nuevo Asiento"}
            </button>
          </div>
        </header>

        {errorUI && <div className="mb-4"><ErrorBox message={errorUI} onClose={() => setErrorUI(null)} /></div>}
        {successUI && <div className="mb-4"><SuccessBox message={successUI} onClose={() => setSuccessUI(null)} /></div>}

        {deletePendingId && (
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded flex items-center justify-between">
            <div className="text-sm">
              ¿Confirmar eliminación del asiento <strong>{(asientos || []).find(a => a.id === deletePendingId)?.fila}{(asientos || []).find(a => a.id === deletePendingId)?.numero}</strong>?
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleConfirmDelete(deletePendingId)} className="px-3 py-1 bg-black text-white rounded">Confirmar</button>
              <button onClick={() => setDeletePendingId(null)} className="px-3 py-1 border rounded">Cancelar</button>
            </div>
          </div>
        )}

        {showForm && (
          <div className="mb-6 p-4 bg-white rounded-lg border shadow-sm">
            <AsientoForm
              seats={asientos || []}
              salas={salas}
              initial={editing || {}}
              onCancel={() => { setShowForm(false); setEditing(null); setErrorUI(null); }}
              onSave={(data, opts) => {
                if (editing) handleUpdate(editing.id, data);
                else handleCreate(data, opts);
              }}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Lista de asientos {salaInfo ? `— ${salaInfo.nombre ?? `Sala ${salaInfo.id}`}` : ""}</h2>
            <div className="space-y-3">
              {seatsFiltered.length === 0 && <div className="text-gray-600">No hay asientos en la sala seleccionada.</div>}
              {seatsFiltered.map(a => (
                <div key={a.id} className="p-3 border rounded-lg flex justify-between items-center bg-white">
                  <div>
                    <div className="font-medium">{a.fila}{a.numero} <span className="text-xs text-gray-500">({a.tipo})</span></div>
                    <div className="text-sm text-gray-600">Estado: <span className={a.estado === "reservado" ? "text-red-600" : "text-green-600"}>{a.estado}</span> — Sala: {a.salaId}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(a); setShowForm(true); }} className="px-3 py-1 border rounded text-sm">Editar</button>
                    <button onClick={() => setDeletePendingId(a.id)} className="px-3 py-1 border rounded text-sm text-red-600">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-1">Vista de sala (mapa)</h2>
            <div className="text-sm text-gray-600 mb-3">{salaInfo ? `${salaInfo.nombre ?? `Sala ${salaInfo.id}`} — visualizando ${seatsFiltered.length} asientos` : "Mostrando asientos de todas las salas (selecciona una para filtrar)"} </div>

            <div className="p-4 bg-white border rounded-lg">
              <SeatMap seats={seatsFiltered} salaInfo={salaInfo} onSeatClick={async (seat) => {
                const prevState = seat.estado;
                const newEstado = prevState === "reservado" ? "disponible" : "reservado";
                setData(prev => prev.map(a => a.id === seat.id ? { ...a, estado: newEstado } : a));
                try {
                  await api.updateAsiento(seat.id, { ...seat, estado: newEstado });
                } catch (err) {
                  setData(prev => prev.map(a => a.id === seat.id ? { ...a, estado: prevState } : a));
                  const msg = err?.body?.message || err?.message || String(err);
                  if (String(msg).toLowerCase().includes("no encontrado")) {
                    try { const fresh = await api.getAsientos(); setData(fresh); } catch (_) {}
                    setErrorUI("No fue posible actualizar: el asiento ya no existe en el servidor.");
                  } else {
                    setErrorUI(msg);
                  }
                }
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
