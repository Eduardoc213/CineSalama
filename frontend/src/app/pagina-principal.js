'use client';

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import api from "./services/api"; 
import { useCart } from "./context/CartContext"; // Importar el hook del carrito

// Componente del Icono del Carrito
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
  
  // Estados para datos de la aplicación 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [funciones, setFunciones] = useState([]);
  const [peliculas, setPeliculas] = useState([]);
  const [estrenos, setEstrenos] = useState([]);
  const [salasMap, setSalasMap] = useState({});

  // Efecto para verificar autenticación 
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Efecto para cargar datos de la aplicación 
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

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    router.refresh();
  };

  // Helpers para datos 
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
    <div className="min-h-screen bg-white text-black">
      {/* Header - Combinado */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-lg font-semibold">CineHa</div>

            <div className="text-sm">
              <label className="sr-only">Seleccionar Cine</label>
              <select className="border rounded px-3 py-1 text-sm bg-white">
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
              <li><Link href="/cliente/estrenos" className="hover:underline">Estrenos</Link></li>
              <li><Link href="/snacks" className="hover:underline">Snacks</Link></li>
              <li><Link href="/promos" className="hover:underline">Promociones</Link></li>
              <li><Link href="/preventa" className="hover:underline">Pre venta</Link></li>
            </ul>

            <div className="flex gap-3 items-center">
              {/* Icono del Carrito - Agregado aquí */}
              <CartIcon />

              {/* Sistema de autenticación de tu código */}
              {isLoggedIn && user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium hidden sm:block">
                    Hola, {user.nombre}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 rounded bg-gray-200 text-black text-sm hover:bg-gray-300"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link href="/login">
                  <button className="px-4 py-2 rounded bg-black text-white text-sm">Iniciar Sesión</button>
                </Link>
              )}

              {/* Botón de reservas */}
              <Link href="/reservas">
                <button className="px-4 py-2 rounded border border-black text-sm">Reservar</button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main - */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-12 text-gray-600">Cargando contenido...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <h1 className="text-5xl font-extrabold mb-4">Bienvenido</h1>
                <p className="text-gray-600 mb-6">
                  CineHa es un espacio donde puedes comprar y reservar boletos para tus películas favoritas.
                </p>

                <div className="flex gap-4 items-center mb-8">
                  {/* Botón actualizado con autenticación */}
                  {isLoggedIn ? (
                    <Link href="/perfil">
                      <button className="bg-black text-white px-5 py-3 rounded">Ver Mi Perfil</button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <button className="bg-black text-white px-5 py-3 rounded">Iniciar Sesión</button>
                    </Link>
                  )}

                  <div className="hidden sm:block">
                    <div className="relative">
                      <input
                        type="search"
                        placeholder="Buscar"
                        className="border rounded-full px-4 py-2 w-64 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* MOST VIEWED - */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Lo más visto</h2>
                  <div className="space-y-3">
                    {mostViewed.length === 0 && <div className="text-sm text-gray-600">Sin datos suficientes.</div>}
                    {mostViewed.map((m, idx) => (
                      <div key={String(m.pelicula?.id || idx)} className="flex items-center gap-3">
                        <div className="w-16 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img src={peliculaPoster(m.pelicula)} alt={tituloPeliculaFrom(m.pelicula)} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium">{tituloPeliculaFrom(m.pelicula)}</div>
                          <div className="text-xs text-gray-600">{m.count} funciones</div>
                          <div className="mt-2">
                            <Link href={reservasLink({ pelicula: m.pelicula })}>
                              <button className="text-sm px-3 py-1 bg-black text-white rounded">Comprar / Reservar</button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center column: hero posters + cartelera  */}
              <div className="lg:col-span-2">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold">Lo más visto</h2>
                  <p className="text-sm text-gray-600">Películas con más funciones esta semana</p>
                </div>

                <div className="flex justify-center gap-6 mb-6">
                  {mostViewed.slice(0, 2).map((m, i) => (
                    <div key={i} className="w-64 h-96 bg-gray-100 rounded shadow overflow-hidden">
                      <img src={peliculaPoster(m.pelicula)} alt={tituloPeliculaFrom(m.pelicula)} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mb-12">
                  <Link href="/cliente/estrenos">
                    <button className="bg-black text-white px-6 py-3 rounded">Ver estrenos</button>
                  </Link>
                </div>

                <section className="mb-8">
                  <h3 className="text-2xl font-semibold text-center mb-4">Cartelera (próxima semana)</h3>
                  {cartelera.length === 0 ? (
                    <div className="text-center text-gray-600">No hay funciones en el rango de los próximos 7 días.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {cartelera.map(fn => {
                        const pel = peliculaById[String(fn.peliculaId)] || fn.Pelicula || { id: fn.peliculaId };
                        return (
                          <div key={fn.id} className="p-4 bg-white border rounded shadow flex gap-4 items-center">
                            <div className="w-24 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              <img src={peliculaPoster(pel)} alt={tituloPeliculaFrom(pel)} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{tituloPeliculaFrom(pel)}</div>
                              <div className="text-sm text-gray-600">{salaLabelFrom(fn)}</div>
                              <div className="text-sm text-gray-700 mt-1">Fecha: <span className="text-black font-medium">{funcDateString(fn)}</span></div>
                              <div className="mt-3 flex gap-2">
                                <Link href={reservasLink({ funcion: fn, pelicula: pel })}>
                                  <button className="px-3 py-1 bg-black text-white rounded text-sm">Comprar</button>
                                </Link>
                                <Link href={`/cliente/estrenos#funcion-${fn.id}`}>
                                  <button className="px-3 py-1 border rounded text-sm">Ver detalles</button>
                                </Link>
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

            {/* */}
            <section className="mt-12 grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold mb-2">Recomendado por CineHa</h3>
                <h4 className="text-lg font-semibold mb-3">Los tipos malos 2</h4>
                <p className="text-gray-600 mb-4">
                  En esta entrega llena de acción, los ya reformados Tipos Malos deberán realizar un último atraco ideado por unas nuevas criminales: las Tipas Malas.
                </p>
                <p className="text-sm font-medium mb-6">No recomendada para menores de 7 años</p>
                <Link href="/comprar" className="inline-block">
                  <button className="bg-black text-white px-5 py-2 rounded">Comprar</button>
                </Link>
              </div>

              <div className="lg:col-span-1 flex justify-center lg:justify-end">
                <div className="w-56 h-80 bg-gray-100 rounded shadow overflow-hidden">
                  <img src="/placeholder-poster-1.jpg" alt="poster" className="w-full h-full object-cover" />
                </div>
              </div>
            </section>

            <section className="mt-16">
              <h2 className="text-2xl font-semibold mb-6">Próximos estrenos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {upcomingEstrenos.length === 0 && <div className="text-gray-600">No hay próximos estrenos.</div>}
                {upcomingEstrenos.map(s => {
                  const pel = peliculaById[String(s.peliculaId)] || s.Pelicula || { id: s.peliculaId, titulo: s.titulo };
                  const fecha = s.fecha_estreno ? new Date(s.fecha_estreno) : null;
                  return (
                    <div key={s.id} className="group text-center">
                      <div className="mx-auto w-48 h-72 bg-gray-100 rounded shadow overflow-hidden">
                        <img src={peliculaPoster(pel)} alt={tituloPeliculaFrom(pel)} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      </div>
                      <p className="mt-3 font-medium">{tituloPeliculaFrom(pel)}</p>
                      <div className="text-sm text-gray-600">{fecha ? fecha.toLocaleDateString() : "Por definir"}</div>
                      <div className="mt-2">
                        <Link href={reservasLink({ pelicula: pel })}>
                          <button className="mt-2 px-3 py-1 bg-black text-white rounded text-sm">Comprar boletos</button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Nueva sección para promociones destacadas */}
            <section className="mt-16 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Promociones Especiales</h2>
                  <p className="text-gray-600">Aprovecha nuestras ofertas exclusivas</p>
                </div>
                <Link href="/promos">
                  <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    Ver Todas las Promociones
                  </button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border border-orange-200">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <span className="text-orange-600 text-2xl">🎫</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">2x1 en Martes</h3>
                      <p className="text-gray-600 text-sm">Dos entradas por el precio de uno</p>
                      <p className="text-orange-600 font-bold mt-1">50% de descuento</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border border-orange-200">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <span className="text-orange-600 text-2xl">👨‍👩‍👧‍👦</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Combo Familiar</h3>
                      <p className="text-gray-600 text-sm">4 entradas + snacks</p>
                      <p className="text-orange-600 font-bold mt-1">30% de descuento</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-20 border-t pt-8">
              <h3 className="text-2xl font-semibold mb-3">Sobre nosotros</h3>
              <p className="text-gray-600 max-w-2xl">
                Somos un cine 100% Guatemalteco, fundado en 2025 para traer al público Chapín una amplia variedad de películas y promociones.
              </p>

              <div className="py-6 border-t flex items-center justify-between mt-6">
                <div className="text-sm">CineHa</div>
                <div className="flex gap-4 text-gray-600">
                  <a href="#" aria-label="facebook" className="hover:text-black">FB</a>
                  <a href="#" aria-label="linkedin" className="hover:text-black">IN</a>
                  <a href="#" aria-label="youtube" className="hover:text-black">YT</a>
                  <a href="#" aria-label="instagram" className="hover:text-black">IG</a>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}