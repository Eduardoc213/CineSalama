"use client";
import Link from "next/link";
import React from "react";

export default function SalaCard({ sala, onEdit, onDelete }) {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded shadow-sm flex justify-between items-start">
      <div>
        <div className="text-black font-semibold text-lg">{sala.nombre || `Sala ${sala.id}`}</div>
        <div className="text-sm text-gray-700">Capacidad: <span className="text-black font-medium">{sala.capacidad}</span></div>
        <div className="text-sm text-gray-600">Tipo: {sala.tipo || "Estándar"}</div>
      </div>

      <div className="flex flex-col gap-2">
        <Link href={`/salas/${sala.id}`}>
          <button className="px-3 py-1 rounded bg-black text-white text-sm">Ver</button>
        </Link>
        <div className="flex gap-2">
          <button onClick={() => onEdit(sala)} className="px-3 py-1 border rounded text-sm text-black">Editar</button>
          <button onClick={() => onDelete(sala.id)} className="px-3 py-1 border rounded text-sm text-black">Eliminar</button>
        </div>
      </div>
    </div>
  );
}
