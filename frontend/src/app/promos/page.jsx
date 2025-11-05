'use client';

import React, { useState, useEffect } from 'react';
import PromoCard from './components/PromoCard';
import PromoForm from './components/PromoForm';

const mockPromos = [
  {
    id: 1,
    nombre: '2x1 en Martes',
    descripcion: 'Dos entradas por el precio de uno todos los martes',
    descuento: 50,
    fecha_expiracion: '2024-12-31',
    imagen: '/promo-2x1.jpg'
  },
  {
    id: 2,
    nombre: 'Combo Familiar',
    descripcion: '4 entradas + 2 combos de snacks grandes',
    descuento: 30,
    fecha_expiracion: '2024-11-30',
    imagen: '/combo-familiar.jpg'
  }
];

export default function PromosPage() {
  const [promos, setPromos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setPromos(mockPromos);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreatePromo = () => {
    setEditingPromo(null);
    setShowForm(true);
  };

  const handleEditPromo = (promo) => {
    setEditingPromo(promo);
    setShowForm(true);
  };

  const handleDeletePromo = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta promoción?')) {
      setPromos(promos.filter(promo => promo.id !== id));
    }
  };

  const handleSubmitPromo = (formData) => {
    if (editingPromo) {
      // Actualizar promoción existente
      setPromos(promos.map(promo => 
        promo.id === editingPromo.id 
          ? { ...formData, id: editingPromo.id }
          : promo
      ));
    } else {
      // Crear nueva promoción
      const newPromo = {
        ...formData,
        id: Date.now() // ID temporal
      };
      setPromos([...promos, newPromo]);
    }
    setShowForm(false);
    setEditingPromo(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPromo(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">Cargando promociones...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Promociones</h1>
          <button
            onClick={handleCreatePromo}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            + Nueva Promoción
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            <PromoForm
              promo={editingPromo}
              onSubmit={handleSubmitPromo}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map(promo => (
            <PromoCard
              key={promo.id}
              promo={promo}
              onEdit={handleEditPromo}
              onDelete={handleDeletePromo}
            />
          ))}
        </div>

        {promos.length === 0 && !showForm && (
          <div className="text-center py-12 text-gray-500">
            No hay promociones disponibles
          </div>
        )}
      </div>
    </div>
  );
}