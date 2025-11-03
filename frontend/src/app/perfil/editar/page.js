'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditarPerfilPage() {
  const router = useRouter();

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados de la UI
  const [isLoading, setIsLoading] = useState(true); // Cargando datos iniciales
  const [isSaving, setIsSaving] = useState(false);  // Guardando cambios
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 1. Cargar datos del perfil al iniciar
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:3000/api/user/profile', {
          headers: { 'x-access-token': token },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          // Pre-llenamos el formulario con los datos actuales
          setNombre(data.data.nombre);
          setTelefono(data.data.telefono || ''); // Ponemos '' si es null
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

  // 2. Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validación de contraseña
    if (password && password !== confirmPassword) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem('token');

    try {
      // Prepara solo los datos que se van a enviar
      const updateData = { nombre, telefono };
      if (password) { // Solo envía la contraseña si el usuario la escribió
        updateData.password = password;
      }

      const res = await fetch('http://127.0.0.1:3000/api/user/profile', {
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
        // Opcional: actualiza el 'user' en localStorage si el nombre cambió
        const user = JSON.parse(localStorage.getItem('user'));
        user.nombre = nombre;
        localStorage.setItem('user', JSON.stringify(user));

        // Redirige al perfil después de 2 segundos
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

  // Muestra "Cargando..." mientras se obtienen los datos
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div>Cargando...</div>
      </main>
    );
  }

  // Muestra el formulario
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Editar Perfil
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            />
          </div>
          
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            />
          </div>
          
          <hr className="py-2"/>
          
          <p className="text-sm text-gray-500">
            Cambiar Contraseña (deja en blanco si no quieres cambiarla)
          </p>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            />
          </div>

          {/* Mensajes de Éxito o Error */}
          {error && <div className="text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
          {success && <div className="text-green-600 bg-green-100 p-3 rounded-md">{success}</div>}
          
          <div className="flex gap-4 pt-4">
            <Link href="/perfil" className="w-1/2">
              <button type="button" className="w-full py-2 px-4 rounded-md text-black bg-gray-200 hover:bg-gray-300">
                Cancelar
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="w-1/2 py-2 px-4 rounded-md text-white bg-black hover:bg-gray-800 disabled:bg-gray-400"
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}