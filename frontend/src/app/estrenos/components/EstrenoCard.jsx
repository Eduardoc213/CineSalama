"use client";
import React from "react";

export default function EstrenoCard({ estreno, onEdit, onDelete }) {
  // soporta varios esquemas: estreno.pelicula, estreno.Pelicula, titulo directo
  const titulo = estreno.pelicula?.titulo || estreno.Pelicula?.titulo || estreno.titulo || `Película ${estreno.peliculaId || ""}`;
  const poster = estreno.pelicula?.poster || estreno.Pelicula?.poster || estreno.poster || "/placeholder-poster-2.jpg";
  const fecha = estreno.fecha_estreno ? new Date(estreno.fecha_estreno) : (estreno.funcionFecha ? new Date(estreno.funcionFecha) : null);
  const fechaStr = fecha ? fecha.toLocaleString() : "Por definir";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-4 flex gap-4">
      <div className="w-28 h-40 bg-gray-100 rounded overflow-hidden flex-shrink-0">
        {poster ? <img src={poster} alt={titulo} className="w-full h-full object-cover" /> : <div className="text-xs text-gray-500 flex items-center justify-center h-full">Sin poster</div>}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="text-lg font-semibold text-black">{titulo}</div>
          <div className="text-sm text-gray-700 mt-1">Estreno: <span className="text-black font-medium">{fechaStr}</span></div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={() => onEdit(estreno)} className="bg-black text-white px-3 py-1 rounded text-sm">Editar</button>
          <button onClick={() => onDelete(estreno.id)} className="px-3 py-1 border rounded text-sm">Eliminar</button>
        </div>
      </div>
    </div>
  );
}
