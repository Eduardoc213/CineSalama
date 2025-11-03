"use client";
import { useEffect, useState } from "react";

export default function SalaForm({ initial = {}, onCancel, onSave }) {
  const [nombre, setNombre] = useState(initial.nombre || "");
  const [capacidad, setCapacidad] = useState(initial.capacidad || "");
  const [tipo, setTipo] = useState(initial.tipo || "estandar");
  const [descripcion, setDescripcion] = useState(initial.descripcion || "");

  useEffect(() => {
    setNombre(initial.nombre || "");
    setCapacidad(initial.capacidad || "");
    setTipo(initial.tipo || "estandar");
    setDescripcion(initial.descripcion || "");
  }, [initial]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!nombre || !capacidad) {
      return alert("Nombre y capacidad son requeridos.");
    }
    onSave && onSave({
      nombre,
      capacidad: Number(capacidad),
      tipo,
      descripcion
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 border rounded">
      <div>
        <label className="block text-sm text-black font-medium mb-1">Nombre</label>
        <input value={nombre} onChange={e=>setNombre(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm text-black font-medium mb-1">Capacidad</label>
        <input type="number" value={capacidad} onChange={e=>setCapacidad(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm text-black font-medium mb-1">Tipo</label>
        <select value={tipo} onChange={e=>setTipo(e.target.value)} className="w-full border rounded px-3 py-2">
          <option value="estandar">Estándar</option>
          <option value="vip">VIP</option>
          <option value="3d">3D</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-black font-medium mb-1">Descripción</label>
        <textarea value={descripcion} onChange={e=>setDescripcion(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} />
      </div>

      <div className="flex gap-3">
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">Guardar</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded text-black">Cancelar</button>
      </div>
    </form>
  );
}
