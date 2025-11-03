"use client";
import React, { useMemo } from "react";

export default function SeatMap({ seats = [], salaInfo = null, onSeatClick = () => {} }) {
  // Organizar por fila
  const rows = useMemo(() => {
    const map = {};
    seats.forEach(s => {
      const fila = String(s.fila || "").toUpperCase();
      if (!map[fila]) map[fila] = [];
      map[fila].push(s);
    });
    const keys = Object.keys(map).sort((a, b) => a.localeCompare(b, undefined, { numeric: false }));
    return keys.map(k => ({
      fila: k,
      asientos: map[k].sort((x, y) => {
        const xn = Number(x.numero), yn = Number(y.numero);
        if (!isNaN(xn) && !isNaN(yn)) return xn - yn;
        return String(x.numero).localeCompare(String(y.numero), undefined, { numeric: true });
      })
    }));
  }, [seats]);

  // calcular el número máximo por fila para la grid
  const maxPerRow = useMemo(() => {
    let m = 0;
    rows.forEach(r => { if (r.asientos.length > m) m = r.asientos.length; });
    return Math.max(m, 1);
  }, [rows]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-gray-700">Sala:</div>
          <div className="text-lg font-medium">{salaInfo ? (salaInfo.nombre ?? `Sala ${salaInfo.id}`) : "Todas"}</div>
        </div>
        <div className="text-sm text-gray-500">Vista superior — pantalla arriba</div>
      </div>

      <div className="w-full flex justify-center mb-4">
        <div className="w-4/5 rounded-t-lg bg-black text-white text-sm text-center py-1 select-none">PANTALLA</div>
      </div>

      <div className="overflow-auto">
        <div className="flex flex-col gap-3">
          {rows.length === 0 && <div className="text-gray-600">No hay asientos configurados en esta sala.</div>}

          {rows.map(row => {
            const byNum = {};
            row.asientos.forEach(s => { byNum[String(s.numero)] = s; });

            const cells = [];
            for (let i = 1; i <= maxPerRow; i++) {
              const seat = byNum[String(i)];
              if (seat) {
                cells.push(
                  <button
                    key={seat.id}
                    onClick={() => onSeatClick(seat)}
                    title={`${seat.fila}${seat.numero} — ${seat.tipo} — ${seat.estado}`}
                    className={[
                      "rounded-md py-2 px-2 text-sm font-medium border",
                      seat.estado === "reservado" ? "bg-red-600 text-white border-red-700" : "bg-white text-black border-gray-300",
                      seat.tipo === "VIP" ? "ring-2 ring-yellow-300" : "",
                      "hover:scale-105 transform transition"
                    ].join(" ")}
                  >
                    {seat.numero}
                  </button>
                );
              } else {
                cells.push(
                  <div key={`empty-${row.fila}-${i}`} className="rounded-md py-2 px-2" />
                );
              }
            }

            return (
              <div key={row.fila} className="flex items-center gap-3">
                <div className="w-8 text-center font-medium">{row.fila}</div>
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${maxPerRow}, minmax(36px, 48px))`, alignItems: "center" }}
                >
                  {cells}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm">
          <div className="px-3 py-1 rounded bg-white border text-black text-xs">Disponible</div>
          <div className="px-3 py-1 rounded bg-red-600 text-white text-xs">Reservado</div>
          <div className="px-3 py-1 rounded bg-white border text-black text-xs ring-1 ring-yellow-300">VIP</div>
        </div>
        <div className="text-xs text-gray-600">Clic en un asiento para alternar su estado.</div>
      </div>
    </div>
  );
}

