'use client';
import React, { useState } from 'react';
import PayPalButton from './PayPalButton';

const SEAT_PRICE_Q = 40; // precio fijo

export default function ReservaCard({ reserva, onMarkPaid, onCancel, onDelete, onPaymentSuccess }) {
  const [showPayPal, setShowPayPal] = useState(false);
  const fecha = reserva.createdAt ? new Date(reserva.createdAt).toLocaleString() : '';
  const peliculaTitulo = reserva.Funcion?.Pelicula?.titulo || reserva.Funcion?.pelicula?.titulo || reserva.peliculaTitulo || `Función ${reserva.funcionId}`;
  const asientoLabel = reserva.Asiento ? `${reserva.Asiento.fila || ''}${reserva.Asiento.numero || ''}` : (reserva.asientoId ? `Asiento ${reserva.asientoId}` : '-');
  
  const estadoFormateado = reserva.estado?.charAt(0).toUpperCase() + reserva.estado?.slice(1) || 'Pendiente';

  const handlePaymentSuccess = (response) => {
    setShowPayPal(false);
    onPaymentSuccess?.(reserva.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-4 flex flex-col md:flex-row justify-between gap-4 items-start">
      <div className="flex-1">
        <div className="text-sm text-gray-600">Reserva #<span className="text-black font-medium">{reserva.id}</span></div>
        <div className="text-lg font-semibold text-black mt-1">{peliculaTitulo}</div>
       <div className="text-sm text-gray-700 mt-1">
          Asiento: <span className="text-black font-medium">{asientoLabel}</span>
          <span className="text-sm text-gray-600 ml-2">• Precio: <strong>Q{SEAT_PRICE_Q}</strong></span>
        </div>
        <div className="text-sm text-gray-700">
          Estado: <span className={`font-medium ${
            reserva.estado === 'pagado' ? 'text-green-600' :
            reserva.estado === 'cancelado' ? 'text-red-600' :
            'text-yellow-600'
          }`}>{estadoFormateado}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">Creada: {fecha}</div>
      </div>

      <div className="flex gap-2 mt-4">
        {reserva.estado !== 'cancelado' && reserva.estado !== 'pagado' && (
          <button 
            onClick={() => onCancel(reserva.id)} 
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            Cancelar
          </button>
        )}
        <button 
          onClick={() => onDelete(reserva.id)} 
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition-all shadow-sm hover:shadow-md"
        >
          Eliminar
        </button>
      </div>

      {reserva.estado === 'pendiente' && (
        <div className="flex gap-2 mt-4 ">
          {showPayPal ? (
            <div className="w-full">
              <PayPalButton
                reservaId={reserva.id}
                amount={15}
                onSuccess={handlePaymentSuccess}
                onError={(err) => {
                  console.error('Error PayPal:', err);
                  setShowPayPal(false);
                }}
              />
              <button
                onClick={() => setShowPayPal(false)}
                className="mt-2 w-full px-3 py-1 border rounded"
              >
                Cancelar Pago
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPayPal(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Pagar Q{SEAT_PRICE_Q} con PayPal
            </button>
          )}
        </div>
      )}
    </div>
  );
}