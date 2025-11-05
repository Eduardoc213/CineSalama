'use client';

import React from 'react';
import Image from 'next/image';

export default function PromoCard({ promo, onEdit, onDelete }) {
  const isActive = new Date(promo.fecha_expiracion) > new Date();

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={promo.imagen || '/placeholder-promo.jpg'}
          alt={promo.nombre}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            isActive 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-400 text-white'
          }`}>
            {isActive ? 'Activa' : 'Expirada'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{promo.nombre}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{promo.descripcion}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Descuento:</span>
            <span className="text-lg font-bold text-red-600">{promo.descuento}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Válido hasta:</span>
            <span className="text-sm text-gray-700">
              {new Date(promo.fecha_expiracion).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(promo)}
            className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-600 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(promo.id)}
            className="flex-1 bg-red-500 text-white py-2 px-3 rounded-md text-sm hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}