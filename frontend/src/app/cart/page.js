// app/cart/page.js
'use client';

import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotal, getTotalItems, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Tu Carrito</h1>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío</p>
            <div className="flex gap-4 justify-center">
              <Link href="/snacks" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
                Ir a Snacks
              </Link>
              <Link href="/promos" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Ir a Promociones
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tu Carrito</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Vaciar Carrito
          </button>
        </div>
        
        <div className="space-y-4 mb-8">
          {cart.map((item) => (
            <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-6 border rounded-lg bg-white shadow-sm">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-2xl">
                      {item.type === 'snack' ? '🍿' : '🎁'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.nombre}</h3>
                    <p className="text-gray-600 text-sm">
                      {item.type === 'snack' ? 'Snack' : 'Promoción'} • 
                      {item.type === 'snack' ? ` Q${item.precio}` : ' Gratis'}
                    </p>
                    {item.descripcion && (
                      <p className="text-gray-500 text-sm mt-1">{item.descripcion}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <span className="text-lg">-</span>
                  </button>
                  <span className="w-8 text-center font-semibold text-lg">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <span className="text-lg">+</span>
                  </button>
                </div>
                
                <span className="font-semibold text-lg w-24 text-right">
                  Q{((item.type === 'snack' ? item.precio : 0) * item.quantity).toFixed(2)}
                </span>
                
                <button
                  onClick={() => removeFromCart(item.id, item.type)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Eliminar del carrito"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-xl font-semibold">Total ({getTotalItems()} items):</span>
              <p className="text-gray-600 text-sm mt-1">
                {cart.filter(item => item.type === 'snack').length} snacks • 
                {cart.filter(item => item.type === 'promo').length} promociones
              </p>
            </div>
            <span className="text-3xl font-bold">Q{getTotal().toFixed(2)}</span>
          </div>
          
          <div className="flex gap-4">
            <Link href="/snacks" className="flex-1">
              <button className="w-full py-4 px-6 rounded-lg text-black bg-gray-200 hover:bg-gray-300 transition-colors font-semibold">
                Seguir Comprando
              </button>
            </Link>
            <Link href="/checkout" className="flex-1">
              <button className="w-full py-4 px-6 rounded-lg text-white bg-black hover:bg-gray-800 transition-colors font-semibold text-lg">
                Proceder al Pago
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}