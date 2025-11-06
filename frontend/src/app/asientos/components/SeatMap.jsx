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
                const estado = String(seat.estado || "").toLowerCase();
                const ocupado = estado === "reservado" || estado === "vendido";
                const isVIP = String(seat.tipo || "").toUpperCase() === "VIP";

                cells.push(
                  <button
                    key={seat.id}
                    onClick={() => {
                      if (ocupado) {
                        // no permitir seleccionar, dejar que el padre maneje el mensaje
                        onSeatClick({ ...seat, __occupiedClick: true });
                        return;
                      }
                      onSeatClick(seat);
                    }}
                    title={`${seat.fila}${seat.numero} — ${seat.tipo || "Normal"} — ${seat.estado || "disponible"} — Q${seat.priceQ ?? 40}`}
                    disabled={ocupado}
                    aria-disabled={ocupado}
                    className={[
                      "rounded-md py-2 px-2 text-sm font-medium border focus:outline-none transition transform",
                      ocupado ? "bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed" : "bg-white text-black border-gray-300 hover:scale-105",
                      isVIP ? "ring-2 ring-yellow-300" : "",
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
          <div className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs">Ocupado</div>
          <div className="px-3 py-1 rounded bg-white border text-black text-xs ring-1 ring-yellow-300">VIP</div>
        </div>
        <div className="text-xs text-gray-600">Clic en un asiento para seleccionarlo (los ocupados no se pueden seleccionar).</div>
      </div>
    </div>
  );
}
