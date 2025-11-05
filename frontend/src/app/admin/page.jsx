// app/admin/page.jsx  (o src/app/admin/page.jsx)
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../services/api'; // ajusta ruta si tu estructura es diferente
import { useRouter } from 'next/navigation';

const ENTITIES = [
  'asientos','estrenos','facturas','funciones','historial_puntos',
  'pagos','peliculas','promos','redemptions','reservas','salas',
  'snacks','tarjetas_lealtad','usuarios','venta_items','ventas'
];

const ROUTE_MAP = {
  asientos: '/asientos',
  estrenos: '/estrenos',
  facturas: '/facturas',
  funciones: '/funciones',
  historial_puntos: '/historial-puntos',
  pagos: '/pagos',
  peliculas: '/peliculas',
  promos: '/promos',
  redemptions: '/redemptions',
  reservas: '/reservas',
  salas: '/salas',
  snacks: '/snacks',
  tarjetas_lealtad: '/tarjetas-lealtad',
  usuarios: '/usuarios',
  venta_items: '/venta-items',
  ventas: '/ventas'
};

export default function AdminPage() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // simple guard: si no hay user o no es admin redirige
    const raw = localStorage.getItem('user');
    if (!raw) { router.push('/login'); return; }
    const u = JSON.parse(raw);
    if (!u?.rol || (String(u.rol).toLowerCase() !== 'admin' && String(u.rol).toLowerCase() !== 'administrator')) {
      router.push('/');
      return;
    }

    let mounted = true;
    async function loadCounts() {
      setLoading(true);
      try {
        // Intento simple: consultar cada endpoint /api/{entity} y obtener length
        // Si tienes endpoints para counts más eficientes, úsalos.
        const results = await Promise.allSettled(
          ENTITIES.map(e => fetch(`/api/${e}`).then(r => r.ok ? r.json() : Promise.reject(r.status)))
        );
        if (!mounted) return;
        const map = {};
        ENTITIES.forEach((ent, i) => {
          const r = results[i];
          map[ent] = (r.status === 'fulfilled' && Array.isArray(r.value)) ? r.value.length : null;
        });
        setCounts(map);
      } catch (err) {
        console.warn('Error cargando contadores', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadCounts();
    return () => { mounted = false; };
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-extrabold">CineHa — Admin</div>
            <div className="text-sm text-gray-600">Panel de administración</div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="px-3 py-2 rounded border hover:bg-gray-50">Ver sitio</button>
            </Link>
            <button
              onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/login'); }}
              className="px-3 py-2 rounded bg-black text-white"
            >Cerrar sesión</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="mb-4 text-sm text-gray-600">Navegación</div>
          <nav className="flex flex-col gap-2">
            {ENTITIES.map(ent => (
              <Link key={ent} href={`/${ent}`} className="block">
                <div className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-50">
                  <div className="capitalize">{ent.replace('_',' ')}</div>
                  <div className="text-xs text-gray-500">
                    {loading ? '...' : (counts[ent] === null ? '-' : counts[ent])}
                  </div>
                </div>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <section className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Resumen</h1>
            <div className="text-sm text-gray-500">Bienvenido, administrador</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ENTITIES.slice(0,8).map(e => (
              <div key={e} className="p-4 border rounded-lg">
                <div className="text-sm text-gray-500 capitalize">{e.replace('_',' ')}</div>
                <div className="text-2xl font-bold mt-2">{ loading ? '...' : (counts[e] === null ? '—' : counts[e]) }</div>
                <div className="mt-3">
                  <Link href={`/${e}`}>
                    <button className="px-3 py-1 text-sm bg-black text-white rounded">Administrar</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Accesos rápidos</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/usuarios"><button className="px-3 py-2 border rounded">Usuarios</button></Link>
              <Link href="/reservas"><button className="px-3 py-2 border rounded">Reservas</button></Link>
              <Link href="/funciones"><button className="px-3 py-2 border rounded">Funciones</button></Link>
              <Link href="/peliculas"><button className="px-3 py-2 border rounded">Películas</button></Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
