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
  const [precio, setPrecio] = useState('');
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
        setPrecio(promo.precio.toString());
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
          precio: parseFloat(precio),
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando promoción...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/promos" 
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Promociones
        </Link>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Editar Promoción
            </h1>
            <p className="text-gray-600 mt-2">Actualiza los detalles de la promoción</p>
          </div>

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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black bg-white/80 backdrop-blur-sm transition-all"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black bg-white/80 backdrop-blur-sm transition-all resize-none"
                placeholder="Descripción de la promoción"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black bg-white/80 backdrop-blur-sm transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
                  Precio (Q) *
                </label>
                <input
                  type="number"
                  id="precio"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black bg-white/80 backdrop-blur-sm transition-all"
                  placeholder="0.00"
                />
              </div>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black bg-white/80 backdrop-blur-sm transition-all"
              />
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="activa"
                checked={activa}
                onChange={(e) => setActiva(e.target.checked)}
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="activa" className="ml-3 block text-sm font-medium text-gray-700">
                Promoción activa
              </label>
            </div>

            {error && (
              <div className="bg-red-50/90 border-l-4 border-red-500 text-red-700 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">⚠️</div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              <Link href="/promos" className="flex-1">
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
                className="flex-1 py-3 px-4 rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
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