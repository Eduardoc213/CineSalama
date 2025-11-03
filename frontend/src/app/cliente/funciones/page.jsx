"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../../app/services/api"; 
import ErrorBox from "../../components/ErrorBox";

export default function ClienteFuncionesPage() {
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorUI, setErrorUI] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getFunciones();
      setFunciones((data || []).map(f => {
        const pelicula = f.Pelicula || f.pelicula || {};
        const sala = f.Sala || f.sala || {};
        const fecha = f.fecha_hora ? new Date(f.fecha_hora) : (f.fecha ? new Date(f.fecha) : null);
        return { ...f, _titulo: pelicula.titulo || f.titulo, _poster: pelicula.poster || null, _salaName: sala.nombre || f.salaId || null, _fecha: fecha };
      }));
    } catch (err) {
      console.error("Error cargando funciones", err);
      setErrorUI("No se pudieron cargar las funciones. Intenta de nuevo más tarde.");
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
            <h1 className="text-3xl font-extrabold">Funciones</h1>
            <p className="mt-1 text-sm text-gray-700">Selecciona tu pelicula favorita y reserva tu asiento.</p>
          </div>
        </header>

        <div className="mb-4">{errorUI && <ErrorBox message={errorUI} onClose={() => setErrorUI(null)} />}</div>

        {loading ? (
          <div className="text-gray-600">Cargando funciones...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {funciones.length === 0 && <div className="text-gray-700">No hay funciones disponibles.</div>}
            {funciones.map(f => {
              const fechaStr = f._fecha ? f._fecha.toLocaleString() : "Por definir";
              return (
                <div key={f.id} className="p-4 bg-white rounded-xl border shadow-sm flex gap-4">
                  <div className="w-28 h-40 bg-gray-100 rounded overflow-hidden">
                    {f._poster ? <img src={f._poster} alt={f._titulo} className="w-full h-full object-cover" /> : <div className="text-xs text-gray-500 flex items-center justify-center h-full">Sin poster</div>}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{f._titulo}</h3>
                      <div className="text-sm text-gray-700 mt-1">Sala: <strong className="text-black">{f._salaName ?? "Por definir"}</strong></div>
                      <div className="text-sm text-gray-700">Fecha: <strong className="text-black">{fechaStr}</strong></div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Link href={`/reservas?funcionId=${f.id}`} className="px-4 py-2 bg-gray text-white rounded">RESERVAR ASIENTO</Link>
                    </div>
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
