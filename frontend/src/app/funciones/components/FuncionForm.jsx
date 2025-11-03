"use client";
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function FuncionForm({ initial = {}, onCancel = () => {}, onSave }) {
  const init = initial || {};
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);

  const [peliculaId, setPeliculaId] = useState(init.peliculaId ? String(init.peliculaId) : "");
  const [salaId, setSalaId] = useState(init.salaId ? String(init.salaId) : "");
  const [fechaLocal, setFechaLocal] = useState(() => {
    const f = init.fecha_hora || init.fecha || "";
    if (!f) return "";
    const d = new Date(f);
    if (isNaN(d)) return "";
    const pad = n => String(n).padStart(2, "0");
    const yyyy = d.getFullYear(), mm = pad(d.getMonth()+1), dd = pad(d.getDate());
    const hh = pad(d.getHours()), mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  });
  const [idioma, setIdioma] = useState(init.idioma || "");
  const [formato, setFormato] = useState(init.formato || "");

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.getPeliculas().then(d => mounted && setPeliculas(d || [])).catch(()=>{});
    api.getSalas().then(d => mounted && setSalas(d || [])).catch(()=>{});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const fresh = initial || {};
    setPeliculaId(fresh.peliculaId ? String(fresh.peliculaId) : "");
    setSalaId(fresh.salaId ? String(fresh.salaId) : "");
    setIdioma(fresh.idioma || "");
    setFormato(fresh.formato || "");
    if (fresh.fecha_hora || fresh.fecha) {
      const f = fresh.fecha_hora || fresh.fecha;
      const d = new Date(f);
      if (!isNaN(d)) {
        const pad = n => String(n).padStart(2, "0");
        const yyyy = d.getFullYear(), mm = pad(d.getMonth()+1), dd = pad(d.getDate());
        const hh = pad(d.getHours()), mi = pad(d.getMinutes());
        setFechaLocal(`${yyyy}-${mm}-${dd}T${hh}:${mi}`);
      }
    }
    setFormError(null);
  }, [initial]);

  function validate() {
    if (!peliculaId) return "Selecciona una película.";
    if (!salaId) return "Selecciona una sala.";
    if (!fechaLocal) return "Indica fecha y hora.";
    const d = new Date(fechaLocal);
    if (isNaN(d)) return "Fecha inválida.";
    if (d.getTime() < Date.now() - 1000) return "La fecha no puede ser pasada.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    const v = validate();
    if (v) { setFormError(v); return; }

    const payload = {
      peliculaId: Number(peliculaId),
      salaId: Number(salaId),
      fecha_hora: new Date(fechaLocal).toISOString(),
      idioma: idioma || null,
      formato: formato || null
    };

    try {
      setSubmitting(true);
      await onSave(payload);
    } catch (err) {
      setFormError(err?.body?.message || err?.message || "No fue posible guardar la función.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border shadow-sm text-black">
      {formError && <div className="mb-3 text-sm text-red-700 bg-red-50 border-l-4 border-red-600 p-3 rounded">{formError}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Película</label>
          <select value={peliculaId} onChange={e=>setPeliculaId(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">-- Seleccione película --</option>
            {peliculas.map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sala</label>
          <select value={salaId} onChange={e=>setSalaId(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">-- Seleccione sala --</option>
            {salas.map(s => <option key={s.id} value={s.id}>{s.nombre} (cap {s.capacidad ?? "-"})</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha y hora</label>
          <input type="datetime-local" value={fechaLocal} onChange={e=>setFechaLocal(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Idioma</label>
          <input value={idioma} onChange={e=>setIdioma(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Ej: Español, Inglés" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Formato</label>
          <input value={formato} onChange={e=>setFormato(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Ej: 2D, 3D" />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancelar</button>
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-black text-white rounded">{submitting ? "Guardando..." : "Guardar función"}</button>
      </div>
    </form>
  );
}
