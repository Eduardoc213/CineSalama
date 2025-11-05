// app/promos/editar/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditarPromoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [descuento, setDescuento] = useState('');
  const [puntosNecesarios, setPuntosNecesarios] = useState('0');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [activa, setActiva] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'Admin') {
      router.push('/login');
      return;
    }

    loadPromo();
  }, [router, id]);

  const loadPromo = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/promos/${id}`, {
        headers: {
          'x-access-token': token,
        },
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        const promo = data.data;
        setNombre(promo.nombre);
        setDescripcion(promo.descripcion || '');
        setDescuento(promo.descuento.toString());
        setPuntosNecesarios(promo.puntos_necesarios.toString());
        setActiva(promo.activa);
        
        if (promo.fecha_expiracion) {
          const fecha = new Date(promo.fecha_expiracion);
          setFechaExpiracion(fecha.toISOString().slice(0, 16));
        }
      } else {
        setError('Error al cargar la promoción');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/promos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          descuento: parseFloat(descuento),
          puntos_necesarios: parseInt(puntosNecesarios),
          fecha_expiracion: fechaExpiracion || null,
          activa,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/promos');
      } else {
        setError(data.message || 'Error al actualizar la promoción');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">Cargando...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/promos" className="text-black hover:underline mb-6 inline-block">
          ← Volver a Promociones
        </Link>

        <h1 className="text-4xl font-bold mb-6 text-gray-900">Editar Promoción</h1>

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
              placeholder="Nombre de la promoción"
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
              placeholder="Descripción de la promoción"
            />
          </div>

          <div>
            <label htmlFor="descuento" className="block text-sm font-medium text-gray-700 mb-2">
              Descuento (%) *
            </label>
            <input
              type="number"
              id="descuento"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              required
              step="0.01"
              min="0"
              max="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="puntosNecesarios" className="block text-sm font-medium text-gray-700 mb-2">
              Puntos Necesarios
            </label>
            <input
              type="number"
              id="puntosNecesarios"
              value={puntosNecesarios}
              onChange={(e) => setPuntosNecesarios(e.target.value)}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="fechaExpiracion" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Expiración
            </label>
            <input
              type="datetime-local"
              id="fechaExpiracion"
              value={fechaExpiracion}
              onChange={(e) => setFechaExpiracion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="activa"
              checked={activa}
              onChange={(e) => setActiva(e.target.checked)}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label htmlFor="activa" className="ml-2 block text-sm text-gray-700">
              Promoción activa
            </label>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Link href="/promos" className="w-1/2">
              <button 
                type="button" 
                className="w-full py-3 px-4 rounded-md text-black bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="w-1/2 py-3 px-4 rounded-md text-white bg-black hover:bg-gray-800 disabled:bg-gray-400"
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}