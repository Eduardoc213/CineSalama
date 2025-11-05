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
          
          // ¡IMPORTANTE! Actualizar localStorage con el rol del perfil
          localStorage.setItem('userRole', data.data.rol);
          localStorage.setItem('userEmail', data.data.email);
          
          // Actualizar también el objeto user
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          userData.rol = data.data.rol;
          localStorage.setItem('user', JSON.stringify(userData));

          console.log('Perfil cargado - Rol:', data.data.rol);
        } else {
          setError(data.message || 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
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
      <main className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="text-xl font-medium text-gray-900">Cargando perfil...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="text-center text-gray-900">
          <p>{error}</p>
          <Link href="/login" className="text-black hover:underline mt-4 block">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="min-h-screen bg-white p-8">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            Mi Perfil
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{user.nombre}</p>
            </div>
            <hr className="border-gray-300" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <p className="text-lg text-gray-900 mt-1">{user.email}</p>
            </div>
            <hr className="border-gray-300" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <p className="text-lg text-gray-900 mt-1">
                {user.telefono ? user.telefono : 'No especificado'}
              </p>
            </div>
            <hr className="border-gray-300" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <p className={`text-lg font-semibold mt-1 ${
                user.rol === 'Admin' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {user.rol}
                {user.rol === 'Admin' && ' ⭐'}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-300">
            <Link href="/perfil/editar">
              <button className="w-full py-3 px-4 rounded-md text-white bg-black hover:bg-gray-800 transition-colors duration-300 mb-4">
                Editar Perfil
              </button>
            </Link>

            <Link href="/">
              <button className="w-full py-3 px-4 rounded-md text-white bg-black hover:bg-gray-800 transition-colors duration-300">
                Volver al Inicio
              </button>
            </Link>

            {/* Botón de debug */}
            <button
              onClick={() => {
                const currentRole = localStorage.getItem('userRole');
                alert(`Rol en localStorage: ${currentRole}\nRol en perfil: ${user.rol}`);
              }}
              className="w-full py-2 px-4 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-300 mt-2 text-sm"
            >
              Verificar Rol
            </button>
          </div>
        </div>
      </main>
    );
  }

  return null;
}