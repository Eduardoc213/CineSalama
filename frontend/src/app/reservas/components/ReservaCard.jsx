'use client';
import React from 'react';

export default function ReservaCard({ reserva, onMarkPaid, onCancel, onDelete }) {
  const fecha = reserva.createdAt ? new Date(reserva.createdAt).toLocaleString() : '';
  const peliculaTitulo = reserva.Funcion?.Pelicula?.titulo || reserva.Funcion?.pelicula?.titulo || reserva.peliculaTitulo || `Función ${reserva.funcionId}`;
  const asientoLabel = reserva.Asiento ? `${reserva.Asiento.fila || ''}${reserva.Asiento.numero || ''}` : (reserva.asientoId ? `Asiento ${reserva.asientoId}` : '-');
  
  // Formatear el estado para que sea más amigable
  const estadoFormateado = reserva.estado?.charAt(0).toUpperCase() + reserva.estado?.slice(1) || 'Pendiente';

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-4 flex flex-col md:flex-row justify-between gap-4 items-start">
      <div className="flex-1">
        <div className="text-sm text-gray-600">Reserva #<span className="text-black font-medium">{reserva.id}</span></div>
        <div className="text-lg font-semibold text-black mt-1">{peliculaTitulo}</div>
        <div className="text-sm text-gray-700 mt-1">Asiento: <span className="text-black font-medium">{asientoLabel}</span></div>
        <div className="text-sm text-gray-700">
          Estado: <span className={`font-medium ${
            reserva.estado === 'pagado' ? 'text-green-600' :
            reserva.estado === 'cancelado' ? 'text-red-600' :
            'text-yellow-600'
          }`}>{estadoFormateado}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">Creada: {fecha}</div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {reserva.estado !== 'pagado' && reserva.estado !== 'cancelado' && (
          <button 
            onClick={() => onMarkPaid(reserva.id)} 
            className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 transition-colors"
          >
            Marcar como Pagado
          </button>
        )}
        {reserva.estado !== 'cancelado' && reserva.estado !== 'pagado' && (
          <button 
            onClick={() => onCancel(reserva.id)} 
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button 
          onClick={() => onDelete(reserva.id)} 
          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}