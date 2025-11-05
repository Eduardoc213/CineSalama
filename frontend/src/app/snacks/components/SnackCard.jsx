'use client';

import React from 'react';
import Image from 'next/image';

export default function SnackCard({ snack, isAdmin = false, onAddToCart }) {
  // Si es admin, no mostrar opciones de compra
  if (isAdmin) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 w-full">
          <Image
            src={snack.imagen || '/placeholder-snack.jpg'}
            alt={snack.nombre}
            fill
            className="object-cover"
          />
          {!snack.disponible && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">AGOTADO</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{snack.nombre}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{snack.descripcion}</p>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-green-600">Q{snack.precio}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              snack.disponible 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {snack.disponible ? 'Disponible' : 'Agotado'}
            </span>
          </div>

          <div className="text-center text-sm text-gray-500 py-2">
            Modo administrador
          </div>
        </div>
      </div>
    );
  }

  // Vista normal de usuario
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={snack.imagen || '/placeholder-snack.jpg'}
          alt={snack.nombre}
          fill
          className="object-cover"
        />
        {!snack.disponible && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">AGOTADO</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{snack.nombre}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{snack.descripcion}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-green-600">Q{snack.precio}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            snack.disponible 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {snack.disponible ? 'Disponible' : 'Agotado'}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(snack)}
          disabled={!snack.disponible}
          className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors ${
            snack.disponible
              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {snack.disponible ? 'Agregar al Carrito' : 'No Disponible'}
        </button>
      </div>
    </div>
  );
}