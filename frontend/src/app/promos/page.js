// app/promos/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function PromosPage() {
  const router = useRouter();
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    checkAuth();
    loadPromos();
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

  const loadPromos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/promos', {
        headers: {
          'x-access-token': token,
        },
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setPromos(data.data);
      } else {
        setError('Error al cargar las promociones');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (promo) => {
    addToCart(promo, 'promo');
    setSuccessMessage(`¡${promo.nombre} agregada al carrito!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleQuantityChange = (promo, newQuantity) => {
    if (newQuantity === 0) {
      updateQuantity(promo.id, 'promo', 0);
    } else {
      updateQuantity(promo.id, 'promo', newQuantity);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta promoción?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/promos/${id}`, {
        method: 'DELETE',
        headers: {
          'x-access-token': token,
        },
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setPromos(promos.filter(promo => promo.id !== id));
      } else {
        setError('Error al eliminar la promoción');
      }
    } catch (err) {
      setError('Error al eliminar la promoción');
    }
  };

  const isPromoActive = (promo) => {
    if (!promo.activa) return false;
    if (promo.fecha_expiracion) {
      return new Date(promo.fecha_expiracion) > new Date();
    }
    return true;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">Cargando promociones...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Promociones</h1>
            <p className="text-gray-600 mt-2">Ofertas especiales y descuentos</p>
          </div>
          
          <div className="flex gap-4">
            <Link href="/cart">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <span>🛒 Ver Carrito</span>
              </button>
            </Link>
            
            {isAdmin && (
              <Link href="/promos/nuevo">
                <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  Crear Promoción
                </button>
              </Link>
            )}
          </div>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((promo) => {
            const isActive = isPromoActive(promo);
            const cartQuantity = getItemQuantity(promo.id, 'promo');
            
            return (
              <div key={promo.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{promo.nombre}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {promo.descripcion || 'Sin descripción'}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Descuento:</span>
                      <span className="font-semibold text-green-600">{promo.descuento}%</span>
                    </div>
                    
                    {promo.puntos_necesarios > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Puntos necesarios:</span>
                        <span className="font-semibold">{promo.puntos_necesarios}</span>
                      </div>
                    )}
                    
                    {promo.fecha_expiracion && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Válida hasta:</span>
                        <span className="font-semibold text-sm">
                          {new Date(promo.fecha_expiracion).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-900">
                      {promo.puntos_necesarios > 0 ? `${promo.puntos_necesarios} pts` : 'Gratis'}
                    </span>
                    
                    {cartQuantity > 0 && (
                      <span className="text-sm text-blue-600 font-medium">
                        {cartQuantity} en carrito
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {cartQuantity > 0 ? (
                      <>
                        <button
                          onClick={() => handleQuantityChange(promo, cartQuantity - 1)}
                          className="flex-1 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center py-2 font-medium">
                          {cartQuantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(promo, cartQuantity + 1)}
                          className="flex-1 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(promo)}
                        disabled={!isActive}
                        className="flex-1 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                      >
                        {isActive ? 'Agregar al Carrito' : 'No Disponible'}
                      </button>
                    )}
                    
                    {isAdmin && (
                      <div className="flex gap-1 ml-2">
                        <Link href={`/promos/editar/${promo.id}`}>
                          <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                            Editar
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {promos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay promociones disponibles</p>
            {isAdmin && (
              <Link href="/promos/nuevo" className="inline-block mt-4 bg-black text-white px-6 py-2 rounded">
                Crear Primera Promoción
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}