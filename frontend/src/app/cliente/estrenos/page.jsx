// src/app/cliente/estrenos/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../services/api";
import ErrorBox from "../../components/ErrorBox";

export default function ClienteEstrenosPage() {
  const [estrenos, setEstrenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorUI, setErrorUI] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getEstrenos();
      setEstrenos((data || []).map(e => {
        // normalizar
        const titulo = e.pelicula?.titulo || e.Pelicula?.titulo || e.titulo || "";
        const poster = e.pelicula?.poster || e.Pelicula?.poster || e.poster || null;
        const sinopsis = e.pelicula?.sinopsis || e.Pelicula?.sinopsis || e.sinopsis || "";
        const fechaRaw = e.fecha_estreno ?? e.funcionFecha ?? e.fecha ?? e.fechaHora ?? null;
        const fecha = fechaRaw ? new Date(fechaRaw) : null;
        return { ...e, _titulo: titulo, _poster: poster, _sinopsis: sinopsis, _fecha: fecha };
      }));
    } catch (err) {
      console.error("Error al cargar estrenos", err);
      setErrorUI("No se pudieron cargar los estrenos. Intenta más tarde.");
      setTimeout(() => setErrorUI(null), 6000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Estrenos</h1>
            <p className="mt-1 text-sm text-gray-700">Próximos estrenos — reserva tu asiento dando click en RESERVAR.</p>
          </div>
        </header>

        <div className="mb-4">
          {errorUI && <ErrorBox message={errorUI} onClose={() => setErrorUI(null)} />}
        </div>

        {loading ? (
          <div className="text-gray-600">Cargando estrenos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estrenos.length === 0 && <div className="text-gray-700">No hay estrenos disponibles.</div>}
            {estrenos.map(e => {
              const fechaStr = e._fecha ? e._fecha.toLocaleString() : "Por definir";
              const poster = e._poster;
              const sinopsisPreview = e._sinopsis ? (e._sinopsis.length > 140 ? e._sinopsis.slice(0,140)+"..." : e._sinopsis) : "Sin sinopsis";

              return (
                <div key={e.id} className="p-4 bg-white rounded-xl border shadow-sm flex flex-col">
                  <div className="flex gap-4 items-start">
                    <div className="w-28 h-40 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                      {poster ? <img src={poster} alt={e._titulo} className="object-cover w-full h-full" /> : <div className="text-xs text-gray-500">Sin poster</div>}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{e._titulo}</h3>
                      <div className="text-sm text-gray-600 mt-1">{sinopsisPreview}</div>

                      <div className="mt-3 text-sm text-gray-700">
                        <div>Fecha: <strong>{fechaStr}</strong></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Link href={`/reservas?estrenoId=${e.id}`} className="px-4 py-2 bg-gray text-white rounded">
                      RESERVAR
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
