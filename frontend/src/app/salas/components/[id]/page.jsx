"use client";
import useFetch from "../../../hooks/useFetch";
import { api } from "../../../services/api";
import Link from "next/link";

export default function SalaDetalle({ params }) {
  const salaId = params.id;
  const { data: sala, loading, error } = useFetch(() => api.getSala(salaId), [salaId]);
  const { data: asientos, loading: loadingAsientos } = useFetch(() => api.getAsientosBySala(salaId), [salaId]);

  if (loading || loadingAsientos) return <div className="p-6 bg-white text-black">Cargando...</div>;
  if (error) return <div className="p-6 bg-white text-red-600">Error: {error.message}</div>;
  if (!sala) return <div className="p-6 bg-white text-black">Sala no encontrada</div>;

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{sala.nombre}</h1>
            <div className="text-sm text-gray-700">Capacidad: <span className="text-black font-medium">{sala.capacidad}</span></div>
            <div className="text-sm text-gray-600">{sala.descripcion}</div>
          </div>

          <div className="flex gap-3">
            <Link href="/salas">
              <button className="px-3 py-2 border rounded text-black">Volver</button>
            </Link>
            <Link href="/asientos">
              <button className="bg-black text-white px-3 py-2 rounded">Ver asientos</button>
            </Link>
          </div>
        </div>

        <section className="bg-white border p-4 rounded">
          <h2 className="font-semibold mb-3">Asientos en esta sala</h2>
          {(!asientos || asientos.length === 0) ? (
            <div className="text-gray-700">No hay asientos registrados en esta sala.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {asientos.map(a => (
                <div key={a.id} className="p-3 border rounded bg-white">
                  <div className="font-medium">{a.fila}{a.numero} <span className="text-sm text-gray-600">({a.tipo})</span></div>
                  <div className="text-sm text-gray-700">Estado: <span className="text-black">{a.estado}</span></div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
