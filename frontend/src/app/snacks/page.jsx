'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SnackCard from './components/SnackCard';
import Cart from './components/Cart';

const mockSnacks = [
  {
    id: 1,
    nombre: 'Palomitas Grandes',
    descripcion: 'Palomitas de maíz con mantequilla, tamaño familiar',
    precio: 25.00,
    disponible: true,
    imagen: '/palomitas-grandes.jpg'
  },
  {
    id: 2,
    nombre: 'Hot Dog',
    descripcion: 'Hot dog con todos los ingredientes',
    precio: 18.00,
    disponible: true,
    imagen: '/hotdog.jpg'
  },
  {
    id: 3,
    nombre: 'Nachos con Queso',
    descripcion: 'Nachos crujientes con salsa de queso',
    precio: 22.00,
    disponible: false,
    imagen: '/nachos.jpg'
  }
];

export default function SnacksPage() {
  const [snacks, setSnacks] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('cliente');
  const [showCart, setShowCart] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || 'cliente');
    
    // Si es admin, redirigir a la vista de administración
    if (role === 'Admin') {
      router.push('/snacks/admin');
      return;
    }

    // Cargar snacks
    setTimeout(() => {
      setSnacks(mockSnacks);
      setLoading(false);
    }, 1000);
  }, [router]);

  const handleAddToCart = (snack) => {
    if (!snack.disponible) {
      alert('Este snack no está disponible');
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === snack.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === snack.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...snack, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (snackId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== snackId));
  };

  const handleUpdateQuantity = (snackId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(snackId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === snackId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    alert(`Procesando pago por Q${total.toFixed(2)}\n\nFuncionalidad de pago en desarrollo`);
    
    setCart([]);
    setShowCart(false);
  };

  if (loading && userRole === 'Admin') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Redirigiendo a vista de administración...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Cargando snacks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Snacks</h1>
          
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
          >
            <span>🛒</span>
            Carrito
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snacks.map(snack => (
            <SnackCard
              key={snack.id}
              snack={snack}
              isAdmin={false}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {snacks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay snacks disponibles en este momento
          </div>
        )}

        {showCart && (
          <Cart
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onClose={() => setShowCart(false)}
            onCheckout={handleCheckout}
          />
        )}
      </div>
    </div>
  );
}