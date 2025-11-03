"use client";
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function EstrenoForm({ initial = {}, onCancel = () => {}, onSave }) {
  const init = initial || {};
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);

  const [peliculaId, setPeliculaId] = useState(init.peliculaId ? String(init.peliculaId) : "");
  const [salaId, setSalaId] = useState(init.salaId ? String(init.salaId) : "");
  const [fechaLocal, setFechaLocal] = useState(() => {
    if (init.fecha_estreno) {
      const d = new Date(init.fecha_estreno);
      if (!isNaN(d)) {
        const pad = n => String(n).padStart(2, "0");
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const hh = pad(d.getHours());
        const mi = pad(d.getMinutes());
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
      }
    }
    return "";
  });

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.getPeliculas().then(list => { if (mounted) setPeliculas(list || []); }).catch(()=>{});
    api.getSalas().then(list => { if (mounted) setSalas(list || []); }).catch(()=>{});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const fresh = initial || {};
    setPeliculaId(fresh.peliculaId ? String(fresh.peliculaId) : "");
    setSalaId(fresh.salaId ? String(fresh.salaId) : "");
    if (fresh.fecha_estreno) {
      const d = new Date(fresh.fecha_estreno);
      if (!isNaN(d)) {
        const pad = n => String(n).padStart(2, "0");
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const hh = pad(d.getHours());
        const mi = pad(d.getMinutes());
        setFechaLocal(`${yyyy}-${mm}-${dd}T${hh}:${mi}`);
      }
    }
    setFormError(null);
  }, [initial]);

  function validate() {
    if (!peliculaId) return "Selecciona una película.";
    if (!fechaLocal) return "Indica fecha y hora del estreno.";
    const d = new Date(fechaLocal);
    if (isNaN(d)) return "Fecha/hora inválida.";
    if (d.getTime() < Date.now() - 1000) return "No puedes seleccionar una fecha pasada.";
    // opcional: requerir sala si quieres crear función automática
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    const v = validate();
    if (v) { setFormError(v); return; }

    const fechaISO = new Date(fechaLocal).toISOString();
    const payload = {
      peliculaId: Number(peliculaId),
      fecha_estreno: fechaISO,
      salaId: salaId ? Number(salaId) : undefined
    };

    try {
      setSubmitting(true);
      await onSave(payload);
    } catch (err) {
      const msg = err?.body?.message || err?.message || String(err) || "Error al guardar estreno.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border shadow-sm text-black">
      {formError && <div className="mb-3 text-sm text-red-700 bg-red-50 border-l-4 border-red-600 p-3 rounded">{formError}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Película</label>
          <select value={peliculaId} onChange={e => setPeliculaId(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">-- Selecciona una película --</option>
            {(peliculas || []).map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sala</label>
          <select value={salaId} onChange={e => setSalaId(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">-- Selecciona una sala --</option>
            {(salas || []).map(s => <option key={s.id} value={s.id}>{s.nombre ?? `Sala ${s.id}`} (cap {s.capacidad ?? "-"})</option>)}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium mb-1">Fecha y hora</label>
        <input type="datetime-local" value={fechaLocal} onChange={e => setFechaLocal(e.target.value)} className="w-full border rounded px-3 py-2" />
        <div className="text-xs text-gray-500 mt-1">Selecciona la fecha y hora del estreno (no se permiten fechas pasadas).</div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancelar</button>
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-black text-white rounded">
          {submitting ? "Guardando..." : (initial && initial.id ? "Guardar cambios" : "Guardar estreno")}
        </button>
      </div>
    </form>
  );
}
