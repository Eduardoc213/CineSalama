// app/checkout/page.js
'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, getTotal, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    
    // Simulación de pago con PayPal
    setTimeout(() => {
      alert('¡Pago exitoso con PayPal!');
      clearCart();
      router.push('/');
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Checkout</h1>
          <p className="text-gray-600 mb-6">Tu carrito está vacío</p>
          <Link href="/snacks" className="bg-black text-white px-6 py-2 rounded">
            Ir a Comprar
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Resumen del Pedido */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex justify-between">
                  <span>
                    {item.nombre} × {item.quantity}
                  </span>
                  <span>Q{((item.type === 'snack' ? item.precio : 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>Q{getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Método de Pago */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
            
            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded flex items-center justify-center">
                  <span className="text-lg">P</span>
                </div>
                <div>
                  <h3 className="font-semibold">PayPal</h3>
                  <p className="text-sm text-gray-600">Paga de forma segura con PayPal</p>
                </div>
              </div>

              <button
                onClick={handlePayPalPayment}
                disabled={isProcessing}
                className="w-full bg-yellow-400 text-black py-3 rounded font-semibold hover:bg-yellow-500 disabled:bg-gray-400"
              >
                {isProcessing ? 'Procesando...' : 'Pagar con PayPal'}
              </button>
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                Serás redirigido a PayPal para completar tu pago de forma segura
              </p>
            </div>

            <Link href="/cart" className="inline-block mt-4 text-black hover:underline">
              ← Volver al Carrito
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}