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
      // Si la cantidad es 0, se elimina del carrito
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
      <main className="min-h-screen bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">Cargando snacks...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Snacks</h1>
            <p className="text-gray-600 mt-2">Deliciosos snacks para disfrutar durante tu película</p>
          </div>
          
          <div className="flex gap-4">
            <Link href="/cart">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <span>🛒 Ver Carrito</span>
              </button>
            </Link>
            
            {isAdmin && (
              <Link href="/snacks/nuevo">
                <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  Agregar Snack
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
          {snacks.map((snack) => {
            const cartQuantity = getItemQuantity(snack.id, 'snack');
            
            return (
              <div key={snack.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{snack.nombre}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      snack.disponible 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {snack.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {snack.descripcion || 'Sin descripción'}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      Q{snack.precio}
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
                          onClick={() => handleQuantityChange(snack, cartQuantity - 1)}
                          className="flex-1 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center py-2 font-medium">
                          {cartQuantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(snack, cartQuantity + 1)}
                          className="flex-1 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(snack)}
                        disabled={!snack.disponible}
                        className="flex-1 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                      >
                        {snack.disponible ? 'Agregar al Carrito' : 'No Disponible'}
                      </button>
                    )}
                    
                    {isAdmin && (
                      <div className="flex gap-1 ml-2">
                        <Link href={`/snacks/editar/${snack.id}`}>
                          <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                            Editar
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(snack.id)}
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

        {snacks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay snacks disponibles</p>
            <Link href="/snacks/nuevo" className="inline-block mt-4 bg-black text-white px-6 py-2 rounded">
              Crear Primer Snack
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}