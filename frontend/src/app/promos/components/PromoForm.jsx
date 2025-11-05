'use client';

import React, { useState, useEffect } from 'react';

export default function PromoForm({ promo, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    descuento: '',
    fecha_expiracion: '',
    imagen: ''
  });

  useEffect(() => {
    if (promo) {
      setFormData({
        nombre: promo.nombre || '',
        descripcion: promo.descripcion || '',
        descuento: promo.descuento || '',
        fecha_expiracion: promo.fecha_expiracion ? promo.fecha_expiracion.split('T')[0] : '',
        imagen: promo.imagen || ''
      });
    }
  }, [promo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      descuento: parseInt(formData.descuento)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {promo ? 'Editar Promoción' : 'Crear Nueva Promoción'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la promoción
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descuento (%)
        </label>
        <input
          type="number"
          name="descuento"
          value={formData.descuento}
          onChange={handleChange}
          min="1"
          max="100"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de expiración
        </label>
        <input
          type="date"
          name="fecha_expiracion"
          value={formData.fecha_expiracion}
          onChange={handleChange}
          required
          min={new Date().toISOString().split('T')[0]}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL de la imagen
        </label>
        <input
          type="url"
          name="imagen"
          value={formData.imagen}
          onChange={handleChange}
          placeholder="https://ejemplo.com/promo.jpg"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          {promo ? 'Actualizar' : 'Crear'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}