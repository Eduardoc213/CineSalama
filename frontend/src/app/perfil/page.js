'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setUser(data.data);
          
          // ACTUALIZAR LOCALSTORAGE CON DATOS ACTUALIZADOS DEL SERVER
          const userData = {
            id: data.data.id,
            nombre: data.data.nombre,
            email: data.data.email,
            rol: data.data.rol
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userRole', data.data.rol);
          localStorage.setItem('userEmail', data.data.email);
          
          console.log('Perfil cargado - Rol actualizado:', data.data.rol);
        } else {
          setError(data.message || 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
          // LIMPIAR LOCALSTORAGE COMPLETAMENTE
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userEmail');
          router.push('/login');
        }
      } catch (err) {
        setError('No se pudo conectar al servidor.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
          <div className="animate-pulse text-gray-600">Cargando perfil...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
          <p className="text-gray-700 mb-4">{error}</p>
          <Link href="/login" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
        <div className="max-w-xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mi Perfil
            </h1>
            <p className="text-gray-600 mb-6">Información de tu cuenta</p>
            
            <div className="space-y-6">
              <div className="p-4 bg-blue-50/80 rounded-xl">
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{user.nombre}</p>
              </div>

              <div className="p-4 bg-blue-50/80 rounded-xl">
                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <p className="text-lg text-gray-900 mt-1">{user.email}</p>
              </div>

              <div className="p-4 bg-blue-50/80 rounded-xl">
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <p className="text-lg text-gray-900 mt-1">
                  {user.telefono ? user.telefono : 'No especificado'}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <p className={`text-lg font-semibold mt-1 ${
                  user.rol === 'Admin' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {user.rol}
                  {user.rol === 'Admin' && ' ⭐'}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-300 space-y-4">
              <Link href="/perfil/editar">
                <button className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Editar Perfil
                </button>
              </Link>

              <Link href="/">
                <button className="w-full py-3 px-4 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                  Volver al Inicio
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}