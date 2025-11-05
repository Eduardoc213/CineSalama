'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import ReservaForm from './components/ReservaForm';
import ReservaCard from './components/ReservaCard';
import ErrorBox from '../components/ErrorBox';
import SuccessBox from '../components/SuccessBox';
import { useRouter } from 'next/navigation';

export default function ReservasPage() {
  const router = useRouter();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [errorUI, setErrorUI] = useState(null);
  const [successUI, setSuccessUI] = useState(null);
  const [deletePendingId, setDeletePendingId] = useState(null);
  
  // Obtener usuario desde localStorage (tu sistema de autenticación)
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Verificar autenticación al cargar la página
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    } catch (err) {
      console.error('Error parsing user data:', err);
      router.push('/login');
    }
  }, [router]);

  const isAdmin = useMemo(() => {
    return currentUser?.rol?.toLowerCase() === 'admin';
  }, [currentUser]);

  const load = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const data = await api.getReservas();
      const sorted = (data || []).slice().sort((a, b) => 
        new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0)
      );
      setReservas(sorted);
    } catch (err) {
      console.error('Error cargando reservas', err);
      setErrorUI('No se pudieron cargar las reservas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (currentUser) {
      load(); 
    }
  }, [currentUser]);

  // Mostrar reservas: admin -> todas, usuario -> solo las suyas
  const visibleReservas = useMemo(() => {
    if (!currentUser) return [];
    if (isAdmin) return reservas;
    return (reservas || []).filter(r => String(r.usuarioId) === String(currentUser.id));
  }, [reservas, isAdmin, currentUser]);

const handleCreate = async (payload) => {
  if (!currentUser) {
    setErrorUI('Debes iniciar sesión para hacer reservas.');
    return;
  }

  const asientoId = Number(payload.asientoId);
  if (!asientoId) {
    setErrorUI('Asiento inválido.');
    return;
  }

  try {
    setErrorUI(null);
    setSuccessUI(null);
    setLoading(true);

    // Llamamos al endpoint de crear reserva que ahora valida y reserva el asiento en una transacción.
    const newRes = await api.createReserva(payload);
    setSuccessUI('Reserva creada correctamente.');
    setShowForm(false);
    await load();
  } catch (err) {
    console.error('createReserva error:', err);
    // manejar conflicto (409) cuando asiento ya ocupado
    if (err?.status === 409) {
      setErrorUI('No fue posible crear la reserva: el asiento ya está ocupado.');
    } else {
      setErrorUI(err?.body?.message || err?.message || 'No se pudo crear la reserva.');
    }
    await load();
  } finally {
    setLoading(false);
    setTimeout(() => { setErrorUI(null); setSuccessUI(null); }, 6000);
  }
};



  const handleMarkPaid = async (id) => {
    try {
      setErrorUI(null);
      setSuccessUI(null);
      await api.updateReserva(id, { estado: 'pagado' });
      setSuccessUI('Reserva marcada como pagada.');
      await load();
    } catch (err) {
      console.error('Error marcando pagado', err);
      setErrorUI(err?.body?.message || 'No se pudo marcar como pagado.');
    } finally {
      setTimeout(() => { setErrorUI(null); setSuccessUI(null); }, 5000);
    }
  };

  const handleCancel = async (id) => {
    try {
      setErrorUI(null);
      setSuccessUI(null);
      await api.updateReserva(id, { estado: 'cancelado' });
      setSuccessUI('Reserva cancelada.');
      await load();
    } catch (err) {
      console.error('Error cancelando', err);
      setErrorUI(err?.body?.message || 'No se pudo cancelar la reserva.');
      setTimeout(() => setErrorUI(null), 5000);
    }
  };

  const handleDelete = (id) => {
    setDeletePendingId(id);
  };

  const confirmDelete = async (id) => {
    try {
      setErrorUI(null);
      setSuccessUI(null);
      await api.deleteReserva(id);
      setSuccessUI('Reserva eliminada.');
      setDeletePendingId(null);
      await load();
    } catch (err) {
      console.error('Error eliminando reserva', err);
      setErrorUI(err?.body?.message || 'No se pudo eliminar la reserva.');
      setDeletePendingId(null);
    } finally {
      setTimeout(() => { setErrorUI(null); setSuccessUI(null); }, 6000);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-xl font-medium text-gray-900">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Mis Reservas</h1>
            <p className="mt-1 text-sm text-gray-700">
              {isAdmin ? 'Todas las reservas del sistema' : `Reservas de ${currentUser.nombre}`}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button 
              onClick={() => router.push('/')} 
              className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition-colors"
            >
              Ir al Inicio
            </button>
            <button 
              onClick={() => setShowForm(s => !s)} 
              className="bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition-colors"
            >
              {showForm ? 'Cerrar Formulario' : 'Nueva Reserva'}
            </button>
            <div className="text-xs text-gray-500">
              {isAdmin ? 'Modo Administrador' : `Conectado como: ${currentUser.nombre}`}
            </div>
          </div>
        </header>

        <div className="space-y-3 mb-4">
          {errorUI && <ErrorBox message={errorUI} onClose={() => setErrorUI(null)} />}
          {successUI && <SuccessBox message={successUI} onClose={() => setSuccessUI(null)} />}

          {deletePendingId && (
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded flex items-center justify-between">
              <div className="text-sm">
                ¿Confirmar eliminación de la reserva <strong>{deletePendingId}</strong>?
              </div>
              <div className="flex gap-2">
                <button onClick={() => confirmDelete(deletePendingId)} className="px-3 py-1 bg-black text-white rounded">Confirmar</button>
                <button onClick={() => setDeletePendingId(null)} className="px-3 py-1 border rounded">Cancelar</button>
              </div>
            </div>
          )}
        </div>

        {showForm && (
          <div className="mb-6 p-4 bg-white rounded-xl border shadow-sm">
            <ReservaForm
              onCancel={() => setShowForm(false)}
              onSave={handleCreate}
              currentUserId={currentUser.id}
            />
          </div>
        )}

        {loading ? (
          <div className="text-gray-600">Cargando reservas...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {visibleReservas.length === 0 && (
              <div className="text-center py-8 text-gray-700">
                {isAdmin ? 'No hay reservas en el sistema.' : 'No tienes reservas. ¡Haz tu primera reserva!'}
              </div>
            )}
            {visibleReservas.map((reserva) => (
              <ReservaCard
                key={reserva.id}
                reserva={reserva}
                onMarkPaid={handleMarkPaid}
                onCancel={handleCancel}
                onDelete={handleDelete}
                onPaymentSuccess={() => load()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}