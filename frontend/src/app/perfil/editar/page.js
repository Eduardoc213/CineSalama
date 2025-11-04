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
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/user/profile', {
          headers: { 'x-access-token': token },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setNombre(data.data.nombre);
          setTelefono(data.data.telefono || '');
        } else {
          localStorage.removeItem('token');
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
        const user = JSON.parse(localStorage.getItem('user'));
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
      <main className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="text-xl font-medium text-gray-900">Cargando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Editar Perfil
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black placeholder-gray-500"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black placeholder-gray-500"
            />
          </div>
          
          <div className="border-t border-gray-300 pt-6">
            <p className="text-sm text-gray-600 mb-4">
              Cambiar Contraseña (deja en blanco si no quieres cambiarla)
            </p>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black placeholder-gray-500"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black placeholder-gray-500"
              />
            </div>
          </div>

          {/* Mensajes de Éxito o Error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
              {success}
            </div>
          )}
          
          <div className="flex gap-4 pt-4">
            <Link href="/perfil" className="w-1/2">
              <button 
                type="button" 
                className="w-full py-3 px-4 rounded-md text-black bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
              >
                Cancelar
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="w-1/2 py-3 px-4 rounded-md text-white bg-black hover:bg-gray-800 disabled:bg-gray-400 transition-colors duration-300"
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}