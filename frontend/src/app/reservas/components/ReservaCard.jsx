"use client";
import React from "react";

export default function ReservaCard({ reserva, onMarkPaid, onCancel, onDelete }) {
  const fecha = reserva.createdAt ? new Date(reserva.createdAt).toLocaleString() : "";
  const peliculaTitulo = reserva.Funcion?.Pelicula?.titulo || reserva.Funcion?.pelicula?.titulo || reserva.peliculaTitulo || `Func ${reserva.funcionId}`;
  const asientoLabel = reserva.Asiento ? `${reserva.Asiento.fila || ""}${reserva.Asiento.numero || ""}` : (reserva.asientoId ? String(reserva.asientoId) : "-");

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-4 flex flex-col md:flex-row justify-between gap-4 items-start">
      <div>
        <div className="text-sm text-gray-600">Reserva ID: <span className="text-black font-medium">{reserva.id}</span></div>
        <div className="text-lg font-semibold text-black mt-1">{peliculaTitulo}</div>
        <div className="text-sm text-gray-700 mt-1">Asiento: <span className="text-black font-medium">{asientoLabel}</span></div>
        <div className="text-sm text-gray-700">Estado: <span className="text-black font-medium">{reserva.estado}</span></div>
        <div className="text-xs text-gray-500 mt-1">Creada: {fecha}</div>
      </div>

      <div className="flex gap-2">
        {reserva.estado !== "pagado" && <button onClick={() => onMarkPaid(reserva.id)} className="bg-black text-white px-3 py-1 rounded text-sm">Marcar pagado</button>}
        {reserva.estado !== "cancelado" && <button onClick={() => onCancel(reserva.id)} className="px-3 py-1 border rounded text-sm">Cancelar</button>}
        <button onClick={() => onDelete(reserva.id)} className="px-3 py-1 border rounded text-sm">Eliminar</button>
      </div>
    </div>
  );
}
