'use client';

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import api from "./services/api"; 
import { useCart } from "./context/CartContext";

function CartIcon() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Link href="/cart" className="relative">
      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <span className="text-xl">🛒</span>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>
    </Link>
  );
}

export default function PaginaPrincipal() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [funciones, setFunciones] = useState([]);
  const [peliculas, setPeliculas] = useState([]);
  const [estrenos, setEstrenos] = useState([]);
  const [salasMap, setSalasMap] = useState({});
  const [recomendacionActual, setRecomendacionActual] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const peliculaById = useMemo(() => {
    const m = {};
    (peliculas || []).forEach(p => { m[String(p.id)] = p; });
    return m;
  }, [peliculas]);

  const mostViewed = useMemo(() => {
    if (!funciones || funciones.length === 0) return [];
    const counts = {};
    funciones.forEach(fn => {
      const pid = String(fn.peliculaId ?? (fn.Pelicula?.id) ?? "");
      if (!pid) return;
      counts[pid] = (counts[pid] || 0) + 1;
    });
    const arr = Object.keys(counts).map(pid => ({ peliculaId: pid, count: counts[pid] }));
    arr.sort((a, b) => b.count - a.count);
    const top2 = arr.slice(0, 2).map(x => ({
      pelicula: peliculaById[x.peliculaId] || { id: x.peliculaId, titulo: `Película ${x.peliculaId}` },
      count: x.count
    }));
    return top2;
  }, [funciones, peliculaById]);

  const cartelera = useMemo(() => {
    if (!funciones || funciones.length === 0) return [];
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    const inRange = funciones.filter(f => {
      const d = new Date(f.fecha_hora || f.fecha || f.hora || f.fecha_hora_iso || null);
      if (!d || isNaN(d)) return false;
      return d.getTime() >= start.getTime() && d.getTime() < end.getTime();
    });
    inRange.sort((a, b) => new Date(a.fecha_hora || a.fecha) - new Date(b.fecha_hora || b.fecha));
    return inRange;
  }, [funciones]);

  const upcomingEstrenos = useMemo(() => {
    if (!estrenos || estrenos.length === 0) return [];
    const now = Date.now();
    return (estrenos || [])
      .filter(s => {
        const fecha = new Date(s.fecha_estreno || s.fecha || s.funcionFecha || null);
        return fecha && !isNaN(fecha) && fecha.getTime() > now;
      })
      .sort((a, b) => new Date(a.fecha_estreno) - new Date(b.fecha_estreno));
  }, [estrenos]);

  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        const [fns, pels, strs, salas] = await Promise.allSettled([
          api.getFunciones(),
          api.getPeliculas(),
          api.getEstrenos(),
          api.getSalas()
        ]);

        if (!mounted) return;

        if (fns.status === "fulfilled") setFunciones(fns.value || []);
        else console.warn("getFunciones error:", fns.reason);

        if (pels.status === "fulfilled") setPeliculas(pels.value || []);
        else console.warn("getPeliculas error:", pels.reason);

        if (strs.status === "fulfilled") setEstrenos(strs.value || []);
        else console.warn("getEstrenos error:", strs.reason);

        const salasList = (salas.status === "fulfilled" ? (salas.value || []) : []);
        const map = {};
        (salasList || []).forEach(s => { map[String(s.id)] = s; });
        setSalasMap(map);

      } catch (err) {
        console.error("Error cargando datos iniciales:", err);
        setError("No se pudo cargar la información. Intenta recargar.");
      } finally {
        setLoading(false);
      }
    }

    loadAll();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (mostViewed.length > 0) {
      const topPeliculas = mostViewed.slice(0, 3).map(m => m.pelicula).filter(Boolean);
      if (topPeliculas.length > 0) {
        const recomendacion = topPeliculas[Math.floor(Math.random() * topPeliculas.length)];
        setRecomendacionActual(recomendacion);
      }
    } else if (peliculas.length > 0) {
      const peliculaAleatoria = peliculas[Math.floor(Math.random() * peliculas.length)];
      setRecomendacionActual(peliculaAleatoria);
    }
  }, [mostViewed, peliculas]);

  const cambiarRecomendacion = () => {
    if (mostViewed.length > 0) {
      const topPeliculas = mostViewed.slice(0, 3).map(m => m.pelicula).filter(Boolean);
      if (topPeliculas.length > 0) {
        const nuevaRecomendacion = topPeliculas[Math.floor(Math.random() * topPeliculas.length)];
        setRecomendacionActual(nuevaRecomendacion);
      }
    } else if (peliculas.length > 0) {
      const nuevaRecomendacion = peliculas[Math.floor(Math.random() * peliculas.length)];
      setRecomendacionActual(nuevaRecomendacion);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    router.refresh();
  };

  function peliculaPoster(p) {
    if (!p) return "/placeholder-poster-2.jpg";
    return p.poster || p.Poster || p.posterUrl || "/placeholder-poster-2.jpg";
  }

  function tituloPeliculaFrom(p) {
    if (!p) return "Película";
    return p.titulo || p.title || p.nombre || `Pelicula ${p.id}`;
  }

  function salaLabelFrom(fn) {
    const sid = fn?.salaId ?? (fn.Sala?.id);
    if (!sid) return "Sala: -";
    const s = salasMap[String(sid)];
    if (s) return `${s.nombre ?? `Sala ${s.id}`} (cap ${s.capacidad ?? "-"})`;
    return `Sala ${sid}`;
  }

  function funcDateString(f) {
    const d = new Date(f.fecha_hora || f.fecha || f.hora || f.fecha_hora_iso || "");
    if (!d || isNaN(d)) return "-";
    return d.toLocaleString();
  }

  function reservasLink({ funcion, pelicula }) {
    const params = new URLSearchParams();
    if (funcion?.id) params.set("funcionId", String(funcion.id));
    if (pelicula?.id) params.set("peliculaId", String(pelicula.id));
    return `/reservas?${params.toString()}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-black relative overflow-hidden">
      {/* Burbujas estáticas con rotación suave */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float-slow"
            style={{
              width: Math.random() * 80 + 40 + 'px',
              height: Math.random() * 80 + 40 + 'px',
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

      <header className="border-b bg-white/80 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CineHa
            </div>

            <div className="text-sm">
              <label className="sr-only">Seleccionar Cine</label>
              <select className="border rounded-lg px-3 py-1 text-sm bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                <option>Ciudad Capital</option>
                <option>Alta Verapaz</option>
                <option>Baja Verapaz</option>
                <option>Quetzaltenango</option>
                <option>Escuintla</option>
              </select>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <ul className="flex gap-6 items-center text-sm">
              <li>
                <Link href="/cliente/estrenos" className="hover:underline transition-all hover:text-blue-600">
                  Estrenos
                </Link>
              </li>
              <li>
                <Link href="/snacks" className="hover:underline transition-all hover:text-purple-600">
                  Snacks
                </Link>
              </li>
              <li>
                <Link href="/promos" className="hover:underline transition-all hover:text-orange-600">
                  Promociones
                </Link>
              </li>
            </ul>

            <div className="flex gap-3 items-center">
              <CartIcon />

              {isLoggedIn && user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium hidden sm:block">
                    Hola, {user.nombre}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-black text-sm hover:bg-gray-300 transition-all shadow-sm hover:shadow-md"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link href="/login">
                  <button className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
                    Iniciar Sesión
                  </button>
                </Link>
              )}

              <Link href="/reservas">
                <button className="px-4 py-2 rounded-lg border border-black text-sm hover:bg-black hover:text-white transition-all shadow-sm hover:shadow-md">
                  Reservar
                </button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {loading ? (
          <div className="text-center py-12 text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="animate-pulse">Cargando contenido...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                  Bienvenido
                </h1>
                <p className="text-gray-600 mb-6 bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                  CineHa es un espacio donde puedes comprar y reservar boletos para tus películas favoritas.
                </p>

                <div className="flex gap-4 items-center mb-8">
                  {isLoggedIn ? (
                    <Link href="/perfil">
                      <button className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        Ver Mi Perfil
                      </button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <button className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        Iniciar Sesión
                      </button>
                    </Link>
                  )}

                  <div className="hidden sm:block">
                    <div className="relative">
                      <input
                        type="search"
                        placeholder="Buscar"
                        className="border rounded-full px-4 py-2 w-64 text-sm bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                  <h2 className="text-xl font-semibold mb-3 text-gray-800">Lo más visto</h2>
                  <div className="space-y-3">
                    {mostViewed.length === 0 && <div className="text-sm text-gray-600">Sin datos suficientes.</div>}
                    {mostViewed.map((m, idx) => (
                      <div key={String(m.pelicula?.id || idx)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50 transition-all">
                        <div className="w-16 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-md hover:shadow-lg transition-all">
                          <img src={peliculaPoster(m.pelicula)} alt={tituloPeliculaFrom(m.pelicula)} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{tituloPeliculaFrom(m.pelicula)}</div>
                          <div className="text-xs text-gray-600">{m.count} funciones</div>
                          <div className="mt-2">
                            <Link href={reservasLink({ pelicula: m.pelicula })}>
                              <button className="text-sm px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
                                Comprar / Reservar
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                    Lo más visto
                  </h2>
                  <p className="text-sm text-gray-600">Películas con más funciones esta semana</p>
                </div>

                <div className="flex justify-center gap-6 mb-6">
                  {mostViewed.slice(0, 2).map((m, i) => (
                    <div key={i} className="w-64 h-96 bg-gray-100 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                      <img src={peliculaPoster(m.pelicula)} alt={tituloPeliculaFrom(m.pelicula)} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mb-12">
                  <Link href="/cliente/estrenos">
                    <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Ver estrenos
                    </button>
                  </Link>
                </div>

                <section className="mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">Cartelera (próxima semana)</h3>
                  {cartelera.length === 0 ? (
                    <div className="text-center text-gray-600">No hay funciones en el rango de los próximos 7 días.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {cartelera.map(fn => {
                        const pel = peliculaById[String(fn.peliculaId)] || fn.Pelicula || { id: fn.peliculaId };
                        return (
                          <div key={fn.id} className="p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all border border-white/30 hover:border-blue-200">
                            <div className="flex gap-4 items-center">
                              <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                                <img src={peliculaPoster(pel)} alt={tituloPeliculaFrom(pel)} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-800">{tituloPeliculaFrom(pel)}</div>
                                <div className="text-sm text-gray-600">{salaLabelFrom(fn)}</div>
                                <div className="text-sm text-gray-700 mt-1">Fecha: <span className="text-black font-medium">{funcDateString(fn)}</span></div>
                                <div className="mt-3">
                                  <Link href={reservasLink({ funcion: fn, pelicula: pel })}>
                                    <button className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
                                      Comprar
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            </div>

            <section className="mt-12 grid lg:grid-cols-3 gap-8 items-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl border border-blue-200/50 hover:shadow-2xl transition-all duration-300">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🎬</span>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Recomendado por CineHa
                  </h3>
                  <button 
                    onClick={cambiarRecomendacion}
                    className="ml-2 p-2 rounded-full hover:bg-white transition-all shadow-sm hover:shadow-md"
                    title="Cambiar recomendación"
                  >
                    <span className="text-lg">🔄</span>
                  </button>
                </div>
                
                {recomendacionActual ? (
                  <>
                    <h4 className="text-xl font-semibold mb-3 text-gray-800">
                      {tituloPeliculaFrom(recomendacionActual)}
                    </h4>
                    <p className="text-gray-600 mb-4 bg-white/50 backdrop-blur-sm p-3 rounded-lg">
                      {recomendacionActual.sinopsis || 
                       "Disfruta de esta increíble película recomendada especialmente para ti."}
                    </p>
                    <p className="text-sm font-medium mb-6 text-gray-700">
                      Clasificación: {recomendacionActual.clasificacion || "Por definir"}
                    </p>
                    <div className="flex gap-4">
                      <Link href={reservasLink({ pelicula: recomendacionActual })}>
                        <button className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                          Comprar Boletos
                        </button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-600">
                    <p>Cargando recomendación...</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1 flex justify-center lg:justify-end">
                <div className="w-56 h-80 bg-gray-100 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 hover:rotate-1">
                  {recomendacionActual ? (
                    <img 
                      src={peliculaPoster(recomendacionActual)} 
                      alt={tituloPeliculaFrom(recomendacionActual)}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">Cargando...</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                Próximos estrenos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {upcomingEstrenos.length === 0 && <div className="text-gray-600">No hay próximos estrenos.</div>}
                {upcomingEstrenos.map(s => {
                  const pel = peliculaById[String(s.peliculaId)] || s.Pelicula || { id: s.peliculaId, titulo: s.titulo };
                  const fecha = s.fecha_estreno ? new Date(s.fecha_estreno) : null;
                  return (
                    <div key={s.id} className="group text-center bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/30">
                      <div className="mx-auto w-48 h-72 bg-gray-100 rounded-xl shadow-lg overflow-hidden">
                        <img src={peliculaPoster(pel)} alt={tituloPeliculaFrom(pel)} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300" />
                      </div>
                      <p className="mt-3 font-medium text-gray-800">{tituloPeliculaFrom(pel)}</p>
                      <div className="text-sm text-gray-600">{fecha ? fecha.toLocaleDateString() : "Por definir"}</div>
                      <div className="mt-2">
                        <Link href={reservasLink({ pelicula: pel })}>
                          <button className="mt-2 px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
                            Comprar boletos
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-16 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 shadow-xl border border-orange-200/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Promociones Especiales
                  </h2>
                  <p className="text-gray-600">Aprovecha nuestras ofertas exclusivas</p>
                </div>
                <Link href="/promos">
                  <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Ver Todas las Promociones
                  </button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-orange-200 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-full shadow-sm">
                      <span className="text-orange-600 text-2xl">🎫</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">2x1 en Martes</h3>
                      <p className="text-gray-600 text-sm">Dos entradas por el precio de uno</p>
                      <p className="text-orange-600 font-bold mt-1">50% de descuento</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-orange-200 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-full shadow-sm">
                      <span className="text-orange-600 text-2xl">👨‍👩‍👧‍👦</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">Combo Familiar</h3>
                      <p className="text-gray-600 text-sm">4 entradas + snacks</p>
                      <p className="text-orange-600 font-bold mt-1">30% de descuento</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-20 border-t pt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                Sobre nosotros
              </h3>
              <p className="text-gray-600 max-w-2xl">
                Somos un cine 100% Guatemalteco, fundado en 2025 para traer al público Chapín una amplia variedad de películas y promociones.
              </p>

              <div className="py-6 border-t flex items-center justify-between mt-6">
                <div className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                  CineHa
                </div>
                <div className="flex gap-4 text-gray-600">
                  <a href="#" aria-label="facebook" className="hover:text-blue-600 transition-all hover:scale-110">FB</a>
                  <a href="#" aria-label="linkedin" className="hover:text-blue-700 transition-all hover:scale-110">IN</a>
                  <a href="#" aria-label="youtube" className="hover:text-red-600 transition-all hover:scale-110">YT</a>
                  <a href="#" aria-label="instagram" className="hover:text-pink-600 transition-all hover:scale-110">IG</a>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}