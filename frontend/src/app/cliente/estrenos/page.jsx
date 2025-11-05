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
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen text-black relative overflow-hidden">
      {/* Burbujas de fondo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float-slow"
            style={{
              width: Math.random() * 70 + 40 + 'px',
              height: Math.random() * 70 + 40 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: `linear-gradient(45deg, 
                ${i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#f59e0b'}, 
                ${i % 3 === 0 ? '#8b5cf6' : i % 3 === 1 ? '#f59e0b' : '#3b82f6'})`,
              animationDelay: Math.random() * 10 + 's',
              animationDuration: Math.random() * 20 + 20 + 's'
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          33% { 
            transform: translateY(-10px) rotate(120deg) scale(1.05);
          }
          66% { 
            transform: translateY(5px) rotate(240deg) scale(0.95);
          }
        }
        .animate-float-slow {
          animation: float-slow infinite ease-in-out;
        }
      `}</style>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Próximos Estrenos
            </h1>
            <p className="mt-2 text-sm text-gray-700 bg-white/60 backdrop-blur-sm p-3 rounded-lg inline-block">
              Descubre las próximas películas — reserva tu asiento dando click en RESERVAR.
            </p>
          </div>
        </header>

        <div className="mb-6">
          {errorUI && <ErrorBox message={errorUI} onClose={() => setErrorUI(null)} />}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-gray-600 bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg inline-block">
              Cargando estrenos...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estrenos.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
                <div className="text-4xl mb-4">🎬</div>
                <p className="text-gray-700 text-xl font-semibold">No hay estrenos disponibles</p>
                <p className="text-gray-500 mt-2">Vuelve pronto para descubrir nuevos estrenos</p>
              </div>
            )}
            {estrenos.map(e => {
              const fechaStr = e._fecha ? e._fecha.toLocaleString() : "Por definir";
              const poster = e._poster;
              const sinopsisPreview = e._sinopsis ? (e._sinopsis.length > 120 ? e._sinopsis.slice(0,120)+"..." : e._sinopsis) : "Sin sinopsis disponible";
              const isUpcoming = e._fecha && e._fecha.getTime() > Date.now();
              const isToday = e._fecha && e._fecha.toDateString() === new Date().toDateString();

              return (
                <div key={e.id} className="bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 group">
                  <div className="flex flex-col h-full">
                    <div className="flex gap-4 items-start mb-4">
                      <div className="w-24 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-lg transition-all">
                        {poster ? (
                          <img src={poster} alt={e._titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-2xl">🎬</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-black transition-colors line-clamp-2">
                            {e._titulo}
                          </h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                            isToday 
                              ? "bg-green-100 text-green-800 border border-green-200" 
                              : isUpcoming 
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}>
                            {isToday ? "HOY" : isUpcoming ? "PRÓXIMO" : "PASADO"}
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600 line-clamp-3">
                          {sinopsisPreview}
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="text-sm text-gray-700 bg-gray-50/80 p-3 rounded-lg mb-4">
                        <div className="font-medium">📅 Fecha del estreno:</div>
                        <div className="font-semibold text-black mt-1">{fechaStr}</div>
                      </div>

                      <div className="flex justify-end">
                        <Link 
                          href={`/reservas?estrenoId=${e.id}`} 
                          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold text-sm"
                        >
                          RESERVAR ASIENTOS
                        </Link>
                      </div>
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