// app/snacks/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function SnacksPage() {
  const router = useRouter();
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  
  const [snacks, setSnacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    checkAuth();
    loadSnacks();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      router.push('/login');
      return;
    }

    setIsAdmin(userRole === 'Admin');
  };

  const loadSnacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/snacks', {
        headers: {
          'x-access-token': token,
        },
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setSnacks(data.data);
      } else {
        setError('Error al cargar los snacks');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (snack) => {
    addToCart(snack, 'snack');
    setSuccessMessage(`¡${snack.nombre} agregado al carrito!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleQuantityChange = (snack, newQuantity) => {
    if (newQuantity === 0) {
      updateQuantity(snack.id, 'snack', 0);
    } else {
      updateQuantity(snack.id, 'snack', newQuantity);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este snack?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/snacks/${id}`, {
        method: 'DELETE',
        headers: {
          'x-access-token': token,
        },
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setSnacks(snacks.filter(snack => snack.id !== id));
      } else {
        setError('Error al eliminar el snack');
      }
    } catch (err) {
      setError('Error al eliminar el snack');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <div className="animate-pulse text-gray-600">Cargando snacks...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8 relative overflow-hidden">
      {/* Burbujas de fondo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float-slow"
            style={{
              width: Math.random() * 70 + 40 + 'px',
              height: Math.random() * 70 + 40 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: `linear-gradient(45deg, 
                ${i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#f59e0b'}, 
                ${i % 3 === 0 ? '#8b5cf6' : i % 3 === 1 ? '#f59e0b' : '#3b82f6'})`,
              animationDelay: Math.random() * 10 + 's',
              animationDuration: Math.random() * 20 + 20 + 's'
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Snacks
            </h1>
            <p className="text-gray-600 mt-2 bg-white/60 backdrop-blur-sm p-3 rounded-xl inline-block">
              Deliciosos snacks para disfrutar durante tu película
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/cart">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2">
                <span>🛒 Ver Carrito</span>
              </button>
            </Link>
            
            {isAdmin && (
              <Link href="/snacks/nuevo">
                <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Agregar Snack
                </button>
              </Link>
            )}
          </div>
        </div>

        {successMessage && (
          <div className="bg-green-50/90 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-6 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">✅</div>
              <div className="ml-3">
                <p className="text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50/90 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">⚠️</div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snacks.map((snack) => {
            const cartQuantity = getItemQuantity(snack.id, 'snack');
            
            return (
              <div key={snack.id} className="bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-black transition-colors">
                    {snack.nombre}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    snack.disponible 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {snack.disponible ? 'Disponible' : 'No disponible'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2 bg-gray-50/80 p-3 rounded-xl">
                  {snack.descripcion || 'Sin descripción'}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Q{snack.precio}
                  </span>
                  
                  {cartQuantity > 0 && (
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      {cartQuantity} en carrito
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {cartQuantity > 0 ? (
                    <div className="flex-1 flex gap-2">
                      <button
                        onClick={() => handleQuantityChange(snack, cartQuantity - 1)}
                        className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-all shadow-sm"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center py-2 font-bold bg-white border rounded-xl">
                        {cartQuantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(snack, cartQuantity + 1)}
                        className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-all shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(snack)}
                      disabled={!snack.disponible}
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      {snack.disponible ? 'Agregar al Carrito' : 'No Disponible'}
                    </button>
                  )}
                  
                  {isAdmin && (
                    <div className="flex gap-2 ml-2">
                      <Link href={`/snacks/editar/${snack.id}`}>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
                          Editar
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(snack.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition-all shadow-sm hover:shadow-md"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {snacks.length === 0 && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
            <div className="text-4xl mb-4">🍿</div>
            <p className="text-gray-700 text-xl font-semibold">No hay snacks disponibles</p>
            <Link href="/snacks/nuevo" className="inline-block mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg">
              Crear Primer Snack
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}