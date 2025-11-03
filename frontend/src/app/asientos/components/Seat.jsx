"use client";
import React from "react";

export default function Seat({ seat, onClick }) {
  // seat: { id, fila, numero, tipo, estado }
  // estados: 'disponible' | 'reservado' | 'vendido'
  const base = "w-9 h-9 rounded flex items-center justify-center text-xs cursor-pointer border select-none";
  let classes = "bg-white text-black border-gray-300";

  if (seat.estado === "reservado") classes = "bg-yellow-200 text-black border-yellow-400";
  if (seat.estado === "vendido") classes = "bg-gray-400 text-white border-gray-500 cursor-not-allowed";
  if (seat.tipo === "vip") classes += " ring-1 ring-yellow-300";

  return (
    <div
      className={`${base} ${classes}`}
      role="button"
      aria-pressed={seat.estado === "reservado"}
      title={`Fila ${seat.fila} - ${seat.numero} (${seat.tipo || "normal"})`}
      onClick={() => { if (seat.estado !== "vendido" && onClick) onClick(seat); }}
    >
      {seat.fila}{seat.numero}
    </div>
  );
}
