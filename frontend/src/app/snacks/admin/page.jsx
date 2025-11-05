'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SnackCard from '../components/SnackCard';
import SnackForm from '../components/SnackForm';

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

export default function AdminSnacksPage() {
  const [snacks, setSnacks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSnack, setEditingSnack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('cliente');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDisponible, setFilterDisponible] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'cliente';
    
    if (role !== 'Admin') {
      alert('No tienes permisos de administrador');
      router.push('/snacks');
      return;
    }

    setUserRole(role);
    
    setTimeout(() => {
      setSnacks(mockSnacks);
      setLoading(false);
    }, 1000);
  }, [router]);

  const handleCreateSnack = () => {
    setEditingSnack(null);
    setShowForm(true);
  };

  const handleEditSnack = (snack) => {
    setEditingSnack(snack);
    setShowForm(true);
  };

  const handleDeleteSnack = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este snack?')) {
      setSnacks(snacks.filter(snack => snack.id !== id));
      alert('Snack eliminado correctamente');
    }
  };

  const handleSubmitSnack = (formData) => {
    if (editingSnack) {
      setSnacks(snacks.map(snack => 
        snack.id === editingSnack.id 
          ? { ...formData, id: editingSnack.id }
          : snack
      ));
      alert('Snack actualizado correctamente');
    } else {
      const newSnack = {
        ...formData,
        id: Date.now()
      };
      setSnacks([...snacks, newSnack]);
      alert('Snack creado correctamente');
    }
    setShowForm(false);
    setEditingSnack(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSnack(null);
  };

  const toggleDisponibilidad = (id) => {
    setSnacks(snacks.map(snack =>
      snack.id === id 
        ? { ...snack, disponible: !snack.disponible }
        : snack
    ));
  };

  const filteredSnacks = snacks.filter(snack => {
    const matchesSearch = snack.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snack.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterDisponible === 'all' ? true :
                         filterDisponible === 'available' ? snack.disponible :
                         !snack.disponible;
    
    return matchesSearch && matchesFilter;
  });

  if (userRole !== 'Admin') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
            <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
            <button 
              onClick={() => router.push('/snacks')}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Volver a Snacks
            </button>
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
            <p className="mt-4 text-gray-600">Cargando administración de snacks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Administración de Snacks</h1>
            <p className="text-gray-600">Gestiona el inventario y precios de snacks</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/snacks')}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              ← Vista Usuario
            </button>
            <button
              onClick={handleCreateSnack}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <span>+</span> Nuevo Snack
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            <SnackForm
              snack={editingSnack}
              onSubmit={handleSubmitSnack}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-blue-600 text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Snacks</p>
                  <p className="text-2xl font-bold">{snacks.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-green-600 text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Disponibles</p>
                  <p className="text-2xl font-bold">
                    {snacks.filter(s => s.disponible).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-full">
                  <span className="text-red-600 text-2xl">❌</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Agotados</p>
                  <p className="text-2xl font-bold">
                    {snacks.filter(s => !s.disponible).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Snacks
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por disponibilidad
              </label>
              <select
                value={filterDisponible}
                onChange={(e) => setFilterDisponible(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los snacks</option>
                <option value="available">Solo disponibles</option>
                <option value="unavailable">Solo agotados</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Lista de Snacks ({filteredSnacks.length})</h2>
          </div>
          
          {filteredSnacks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                {searchTerm || filterDisponible !== 'all' 
                  ? 'No se encontraron snacks con los filtros aplicados' 
                  : 'No hay snacks registrados'}
              </p>
              {!showForm && (
                <button
                  onClick={handleCreateSnack}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Crear primer snack
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Snack
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSnacks.map(snack => (
                    <tr key={snack.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={snack.imagen || '/placeholder-snack.jpg'}
                              alt={snack.nombre}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {snack.nombre}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {snack.descripcion}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">Q{snack.precio}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleDisponibilidad(snack.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            snack.disponible
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {snack.disponible ? 'Disponible' : 'Agotado'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSnack(snack)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteSnack(snack.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}