"use client";
import { useState, useEffect } from "react";

export default function AsientoForm({ seats = [], salas = [], initial = {}, onCancel = () => {}, onSave = () => {} }) {
  const [mode, setMode] = useState("single"); // 'single' | 'bulk'
  const [fila, setFila] = useState(initial.fila || "");
  const [numero, setNumero] = useState(initial.numero ?? "");
  const [tipo, setTipo] = useState(initial.tipo || "normal");
  const [estado, setEstado] = useState(initial.estado || "disponible");
  const [salaId, setSalaId] = useState(initial.salaId ?? (salas[0]?.id ?? ""));
  const [fromNumero, setFromNumero] = useState(1);
  const [count, setCount] = useState(10); 

  useEffect(() => {
    setFila(initial.fila || "");
    setNumero(initial.numero ?? "");
    setTipo(initial.tipo || "normal");
    setEstado(initial.estado || "disponible");
    setSalaId(initial.salaId ?? (salas[0]?.id ?? ""));
  }, [initial, salas]);

  const [formError, setFormError] = useState(null);
  useEffect(() => {
    if (!formError) return;
    const t = setTimeout(() => setFormError(null), 6000);
    return () => clearTimeout(t);
  }, [formError]);

  // crear array A..P
  const letters = Array.from({ length: 17 }, (_, i) => String.fromCharCode(65 + i));

  function validateSingle() {
    if (!fila) return "Selecciona la fila (A-P).";
    if (numero === "" || numero === null) return "Indica el número del asiento.";
    if (!salaId) return "Selecciona la sala.";
    const n = Number(numero);
    if (Number.isNaN(n) || n < 1 || n > 15) return "El número debe estar entre 1 y 15.";
    const dup = seats.some(s => {
      if (initial.id && s.id === initial.id) return false;
      return String(s.fila).toUpperCase() === String(fila).toUpperCase() && String(s.numero) === String(numero) && String(s.salaId) === String(salaId);
    });
    if (dup) return `Ya existe un asiento ${numero} en la fila ${fila} para la sala ${salaId}.`;
    return null;
  }

  function validateBulk() {
    if (!fila) return "Selecciona la fila para creación masiva.";
    if (!salaId) return "Selecciona la sala.";
    const from = Number(fromNumero);
    const cnt = Number(count);
    if (isNaN(from) || isNaN(cnt) || cnt <= 0) return "Número inicio y cantidad inválidos.";
    // adicional: si intentas crear más de 15, la página principal también valida, pero aquí avisamos rápido
    if (from < 1) return "Número inicio debe ser >= 1.";
    if (from + cnt - 1 > 15) return "Los números generados deben estar dentro de 1..15.";
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (mode === "single") {
      const v = validateSingle();
      if (v) { setFormError(v); return; }
      onSave({ fila: String(fila).toUpperCase(), numero: String(numero), tipo, estado, salaId });
    } else {
      const v = validateBulk();
      if (v) { setFormError(v); return; }
      const from = Number(fromNumero);
      const cnt = Number(count);
      onSave({ fila: String(fila).toUpperCase(), tipo, estado, salaId }, { bulk: { from, count: cnt } });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <div className="text-sm text-red-700 bg-red-50 border-l-4 border-red-600 p-2 rounded">{formError}</div>}

      <div className="flex gap-3">
        <button type="button" onClick={() => setMode("single")} className={`px-3 py-1 rounded ${mode === "single" ? "bg-black text-white" : "border"}`}>Individual</button>
        <button type="button" onClick={() => setMode("bulk")} className={`px-3 py-1 rounded ${mode === "bulk" ? "bg-black text-white" : "border"}`}>Masivo</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Fila</label>
          <select value={fila} onChange={e => setFila(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">-- Seleccionar fila --</option>
            {letters.map(letter => <option key={letter} value={letter}>{letter}</option>)}
          </select>
        </div>

        {mode === "single" ? (
          <div>
            <label className="block text-sm font-medium mb-1">Número</label>
            <input
              type="number"
              value={numero}
              onChange={e => {
                const val = e.target.value;
                if (val === "") { setNumero(""); return; }
                const n = Number(val);
                if (Number.isNaN(n)) {
                  setNumero("");
                  setFormError("Sólo se permiten números del 1 al 15.");
                  return;
                }
                if (n < 1 || n > 15) {
                  setNumero(String(n));
                  setFormError("El número debe estar entre 1 y 15.");
                  return;
                }
                setNumero(String(n));
              }}
              min={1}
              max={15}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
              }}
              className="w-full border rounded px-3 py-2"
              placeholder="1"
            />
            <div className="text-xs text-gray-500 mt-1">Valores permitidos: 1 — 15</div>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Número inicio</label>
              <input type="number" value={fromNumero} onChange={e => setFromNumero(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cantidad (ej. 10)</label>
              <input type="number" value={count} onChange={e => setCount(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Sala</label>
          <select value={salaId} onChange={e => setSalaId(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">-- Selecciona sala --</option>
            {salas && salas.length > 0 ? salas.map(s => <option key={s.id} value={s.id}>{s.nombre ?? `Sala ${s.id}`}</option>) : <option value="">(No hay salas cargadas)</option>}
          </select>
          {(!salas || salas.length === 0) && (
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">Sala ID (manual)</label>
              <input value={salaId} onChange={e => setSalaId(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="1" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="normal">Normal</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select value={estado} onChange={e => setEstado(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-black text-white rounded">Guardar</button>
      </div>
    </form>
  );
}

