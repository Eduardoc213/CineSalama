'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ENTITIES = [
  'asientos','estrenos','facturas','funciones','historial_puntos',
  'pagos','peliculas','promos','redemptions','reservas','salas',
  'snacks','tarjetas_lealtad','usuarios','venta_items','ventas'
];

const ENTITY_NAMES = {
  asientos: 'Asientos',
  estrenos: 'Estrenos',
  facturas: 'Facturas',
  funciones: 'Funciones',
  historial_puntos: 'Historial de Puntos',
  pagos: 'Pagos',
  peliculas: 'Películas',
  promos: 'Promociones',
  redemptions: 'Redenciones',
  reservas: 'Reservas',
  salas: 'Salas',
  snacks: 'Snacks',
  tarjetas_lealtad: 'Tarjetas de Lealtad',
  usuarios: 'Usuarios',
  venta_items: 'Items de Venta',
  ventas: 'Ventas'
};

const ENTITY_ICONS = {
  asientos: '💺',
  estrenos: '🎬',
  facturas: '🧾',
  funciones: '🎭',
  historial_puntos: '⭐',
  pagos: '💳',
  peliculas: '🎞️',
  promos: '🎁',
  redemptions: '🔄',
  reservas: '🎫',
  salas: '🏢',
  snacks: '🍿',
  tarjetas_lealtad: '💎',
  usuarios: '👥',
  venta_items: '🛒',
  ventas: '💰'
};

export default function AdminPage() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) { 
      router.push('/login'); 
      return; 
    }
    
    const u = JSON.parse(raw);
    setUser(u);
    
    if (!u?.rol || u.rol !== 'Admin') {
      router.push('/');
      return;
    }

    let mounted = true;
    async function loadCounts() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const results = await Promise.allSettled(
          ENTITIES.map(e => 
            fetch(`http://localhost:3000/api/${e}`, {
              headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
              }
            }).then(r => r.ok ? r.json() : Promise.reject(r.status))
          )
        );
        
        if (!mounted) return;
        
        const map = {};
        ENTITIES.forEach((ent, i) => {
          const r = results[i];
          map[ent] = (r.status === 'fulfilled' && Array.isArray(r.value?.data || r.value)) 
            ? (r.value.data || r.value).length 
            : null;
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                CineHa — Admin Panel
              </div>
              <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                Panel de administración
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Hola,</span>
                <span className="font-semibold text-gray-800">{user?.nombre || 'Administrador'}</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                  {user?.rol || 'Admin'}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Link href="/">
                  <button className="px-4 py-2 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all shadow-sm hover:shadow-md">
                    Ver Sitio
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span>📊</span> Navegación
            </h3>
            
            <nav className="space-y-2">
              {ENTITIES.map(ent => (
                <Link key={ent} href={`/${ent}`} className="block">
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-blue-50 transition-all group border border-transparent hover:border-blue-200">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{ENTITY_ICONS[ent] || '📁'}</span>
                      <span className="font-medium text-gray-700 group-hover:text-blue-700">
                        {ENTITY_NAMES[ent] || ent.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full min-w-8 text-center">
                      {loading ? '...' : (counts[ent] === null ? '-' : counts[ent])}
                    </div>
                  </div>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                  Resumen General
                </h1>
                <p className="text-gray-600">Bienvenido al panel de control de CineHa</p>
              </div>
              
              <div className="mt-4 lg:mt-0">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Sistema en línea
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {ENTITIES.slice(0, 8).map(e => (
                <div key={e} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl">{ENTITY_ICONS[e] || '📊'}</div>
                    <div className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {ENTITY_NAMES[e] || e}
                    </div>
                  </div>
                  
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {loading ? '...' : (counts[e] === null ? '—' : counts[e])}
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    {counts[e] === 1 ? 'registro' : 'registros'} en total
                  </div>
                  
                  <Link href={`/${e}`}>
                    <button className="w-full py-2 px-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow-md text-sm font-medium group-hover:scale-105 transform transition-transform">
                      Administrar
                    </button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span>⚡</span> Accesos Rápidos
              </h2>
              
              <div className="flex flex-wrap gap-3">
                <Link href="/usuarios">
                  <button className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md border border-gray-300 flex items-center gap-2">
                    <span>👥</span> Usuarios
                  </button>
                </Link>
                
                <Link href="/reservas">
                  <button className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md border border-gray-300 flex items-center gap-2">
                    <span>🎫</span> Reservas
                  </button>
                </Link>
                
                <Link href="/funciones">
                  <button className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md border border-gray-300 flex items-center gap-2">
                    <span>🎭</span> Funciones
                  </button>
                </Link>
                
                <Link href="/peliculas">
                  <button className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md border border-gray-300 flex items-center gap-2">
                    <span>🎞️</span> Películas
                  </button>
                </Link>
                
                <Link href="/snacks">
                  <button className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md border border-gray-300 flex items-center gap-2">
                    <span>🍿</span> Snacks
                  </button>
                </Link>
                
                <Link href="/promos">
                  <button className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md border border-gray-300 flex items-center gap-2">
                    <span>🎁</span> Promociones
                  </button>
                </Link>
              </div>
            </div>

            {/* System Status */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <div className="text-green-600 font-semibold">API</div>
                <div className="text-green-700">Operacional</div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="text-blue-600 font-semibold">Base de Datos</div>
                <div className="text-blue-700">Conectada</div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <div className="text-purple-600 font-semibold">Sistema</div>
                <div className="text-purple-700">Estable</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}