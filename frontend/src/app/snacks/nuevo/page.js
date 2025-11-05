// app/snacks/nuevo/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NuevoSnackPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [disponible, setDisponible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'Admin') {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/snacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio: parseFloat(precio),
          disponible,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/snacks');
      } else {
        setError(data.message || 'Error al crear el snack');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/snacks" className="text-black hover:underline mb-6 inline-block">
          ← Volver a Snacks
        </Link>

        <h1 className="text-4xl font-bold mb-6 text-gray-900">Agregar Nuevo Snack</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
              placeholder="Nombre del snack"
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
              placeholder="Descripción del snack"
            />
          </div>

          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
              Precio *
            </label>
            <input
              type="number"
              id="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
              placeholder="0.00"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="disponible"
              checked={disponible}
              onChange={(e) => setDisponible(e.target.checked)}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label htmlFor="disponible" className="ml-2 block text-sm text-gray-700">
              Disponible
            </label>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Link href="/snacks" className="w-1/2">
              <button 
                type="button" 
                className="w-full py-3 px-4 rounded-md text-black bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="w-1/2 py-3 px-4 rounded-md text-white bg-black hover:bg-gray-800 disabled:bg-gray-400"
            >
              {isLoading ? 'Creando...' : 'Crear Snack'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}