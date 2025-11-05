'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditarPerfilPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/user/profile', {
          headers: { 'x-access-token': token },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setNombre(data.data.nombre);
          setTelefono(data.data.telefono || '');
          
          // ACTUALIZAR LOCALSTORAGE CON DATOS ACTUALIZADOS
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          userData.nombre = data.data.nombre;
          userData.rol = data.data.rol;
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userRole', data.data.rol);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userEmail');
          router.push('/login');
        }
      } catch (err) {
        setError('No se pudo cargar tu información.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password && password !== confirmPassword) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem('token');

    try {
      const updateData = { nombre, telefono };
      if (password) {
        updateData.password = password;
      }

      const res = await fetch('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess('¡Perfil actualizado con éxito!');
        
        // ACTUALIZAR LOCALSTORAGE INMEDIATAMENTE
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.nombre = nombre;
        localStorage.setItem('user', JSON.stringify(user));

        setTimeout(() => {
          router.push('/perfil');
        }, 2000);
      } else {
        setError(data.message || 'No se pudo guardar la información.');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
          <div className="animate-pulse text-gray-600">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-xl mx-auto">
        <Link href="/perfil" className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition-colors mb-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
          ← Volver al Perfil
        </Link>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Editar Perfil
          </h1>
          <p className="text-gray-600 mb-6">Actualiza tu información personal</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white/80 backdrop-blur-sm transition-all"
                required
              />
            </div>
            
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white/80 backdrop-blur-sm transition-all"
              />
            </div>
            
            <div className="border-t border-gray-300 pt-6">
              <p className="text-sm text-gray-600 mb-4 bg-blue-50/80 p-3 rounded-xl">
                Cambiar Contraseña (deja en blanco si no quieres cambiarla)
              </p>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white/80 backdrop-blur-sm transition-all"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white/80 backdrop-blur-sm transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50/90 border-l-4 border-red-500 text-red-700 p-4 rounded-xl">
                <div className="flex">
                  <div className="flex-shrink-0">⚠️</div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            {success && (
              <div className="bg-green-50/90 border-l-4 border-green-500 text-green-700 p-4 rounded-xl">
                <div className="flex">
                  <div className="flex-shrink-0">✅</div>
                  <div className="ml-3">
                    <p className="text-sm">{success}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-4 pt-6">
              <Link href="/perfil" className="w-1/2">
                <button 
                  type="button" 
                  className="w-full py-3 px-4 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Cancelar
                </button>
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="w-1/2 py-3 px-4 rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </span>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}