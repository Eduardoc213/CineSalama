"use client";
import React, { useState, useEffect } from "react";

export default function PeliculaForm({ onSubmit, onCancel = () => {}, initialData = {}, classifications = [] }) {

  const init = initialData || {};

  const [titulo, setTitulo] = useState(init.titulo || "");
  const [duracion, setDuracion] = useState(init.duracion != null ? String(init.duracion) : "");
  const [clasificacion, setClasificacion] = useState(init.clasificacion || "");
  const [sinopsis, setSinopsis] = useState(init.sinopsis || "");
  const [poster, setPoster] = useState(init.poster || "");
  const [id, setId] = useState(init.id || null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fresh = initialData || {};
    setTitulo(fresh.titulo || "");
    setDuracion(fresh.duracion != null ? String(fresh.duracion) : "");
    setClasificacion(fresh.clasificacion || "");
    setSinopsis(fresh.sinopsis || "");
    setPoster(fresh.poster || "");
    setId(fresh.id || null);
    setErrors({});
    setFormError(null);
  }, [initialData]);

  function validate() {
    const e = {};
    if (!titulo || String(titulo).trim() === "") e.titulo = "El título es obligatorio.";
    if (duracion) {
      const n = Number(duracion);
      if (Number.isNaN(n) || !Number.isFinite(n) || n <= 0) e.duracion = "Duración inválida (minutos).";
    }
    if (!clasificacion || String(clasificacion).trim() === "") e.clasificacion = "Selecciona una clasificación.";
    if (sinopsis && sinopsis.length > 1200) e.sinopsis = "La sinopsis es muy larga (máx 1200 caracteres).";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    const eFields = validate();
    setErrors(eFields);
    if (Object.keys(eFields).length > 0) {
      setFormError("Corrige los errores del formulario.");
      return;
    }

    const payload = {
      ...(initialData || {}),
      titulo: String(titulo).trim(),
      duracion: duracion === "" ? null : Number(duracion),
      clasificacion: String(clasificacion),
      sinopsis: sinopsis ? String(sinopsis).trim() : null,
      poster: poster ? String(poster).trim() : null
    };

    try {
      setSubmitting(true);
   
      await onSubmit(payload);
      
    } catch (err) {
      const msg = err?.body?.message || err?.message || String(err) || "Error desconocido al guardar.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="text-sm text-red-700 bg-red-50 border-l-4 border-red-600 p-3 rounded">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Título <span className="text-red-600">*</span></label>
          <input
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            className={`w-full border rounded px-3 py-2 ${errors.titulo ? "border-red-500" : ""}`}
            placeholder="Título de la película"
            maxLength={200}
          />
          {errors.titulo && <div className="text-xs text-red-600 mt-1">{errors.titulo}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Clasificación <span className="text-red-600">*</span></label>
          <select
            value={clasificacion}
            onChange={e => setClasificacion(e.target.value)}
            className={`w-full border rounded px-3 py-2 ${errors.clasificacion ? "border-red-500" : ""}`}
          >
            <option value="">-- Selecciona clasificación --</option>
            {classifications && classifications.length > 0
              ? classifications.map(c => <option key={c} value={c}>{c}</option>)
              : <option value="A">A</option>
            }
          </select>
          {errors.clasificacion && <div className="text-xs text-red-600 mt-1">{errors.clasificacion}</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Duración (min)</label>
          <input
            value={duracion}
            onChange={e => {
              const v = e.target.value;
              if (v === "") { setDuracion(""); return; }
              if (!/^\d*$/.test(v)) return;
              setDuracion(v);
            }}
            className={`w-full border rounded px-3 py-2 ${errors.duracion ? "border-red-500" : ""}`}
            placeholder="Ej. 120"
            inputMode="numeric"
            min={1}
            max={600}
          />
          {errors.duracion && <div className="text-xs text-red-600 mt-1">{errors.duracion}</div>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Poster (URL)</label>
          <input
            value={poster}
            onChange={e => setPoster(e.target.value)}
            className={`w-full border rounded px-3 py-2 ${errors.poster ? "border-red-500" : ""}`}
            placeholder="https://ejemplo.com/poster.jpg"
          />
          {errors.poster && <div className="text-xs text-red-600 mt-1">{errors.poster}</div>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Sinopsis</label>
        <textarea
          value={sinopsis}
          onChange={e => setSinopsis(e.target.value)}
          className={`w-full border rounded px-3 py-2 min-h-[100px] ${errors.sinopsis ? "border-red-500" : ""}`}
          placeholder="Breve sinopsis (opcional)"
          maxLength={1200}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <div>{errors.sinopsis ? <span className="text-red-600">{errors.sinopsis}</span> : "Máx 1200 caracteres."}</div>
          <div>{sinopsis.length}/1200</div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => { setErrors({}); setFormError(null); onCancel(); }} className="px-4 py-2 border rounded">
          Cancelar
        </button>
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-black text-white rounded">
          {submitting ? "Guardando..." : id ? "Guardar cambios" : "Crear película"}
        </button>
      </div>
    </form>
  );
}
