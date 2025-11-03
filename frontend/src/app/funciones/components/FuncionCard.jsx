"use client";
import React from "react";

export default function FuncionCard({ funcion, onEdit, onDelete }) {
  const pelicula = funcion.Pelicula || funcion.pelicula || {};
  const sala = funcion.Sala || funcion.sala || {};
  const fecha = funcion.fecha_hora ? new Date(funcion.fecha_hora) : (funcion.fecha ? new Date(funcion.fecha) : null);
  const fechaStr = fecha ? fecha.toLocaleString() : "Por definir";

  const titulo = pelicula?.titulo || `Pelicula ${funcion.peliculaId || ""}`;
  const poster = pelicula?.poster || "/placeholder-poster-2.jpg";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-4 flex gap-4">
      <div className="w-24 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
        <img src={poster} alt={titulo} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="text-lg font-semibold text-black">{titulo}</div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div> Sala: <span className="font-medium text-black">{sala?.nombre ?? funcion.salaId ?? "-"}</span> </div>
            <div> Fecha: <span className="font-medium text-black">{fechaStr}</span> </div>
            <div> Idioma: <span className="font-medium text-black">{funcion.idioma || "N/A"}</span> </div>
            <div> Formato: <span className="font-medium text-black">{funcion.formato || "N/A"}</span> </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={() => onEdit(funcion)} className="bg-black text-white px-3 py-1 rounded text-sm hover:opacity-95">Editar</button>
          <button onClick={() => onDelete(funcion.id)} className="px-3 py-1 border rounded text-sm text-black hover:bg-gray-50">Eliminar</button>
        </div>
      </div>
    </div>
  );
}
