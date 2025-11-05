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
  
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
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

      const newRes = await api.createReserva(payload);
      setSuccessUI('Reserva creada correctamente.');
      setShowForm(false);
      await load();
    } catch (err) {
      console.error('createReserva error:', err);
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

  const handlePaymentSuccess = async (reservaId) => {
    setTimeout(() => {
      load();
    }, 1000);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
          <div className="animate-pulse text-gray-600">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8 relative overflow-hidden">
      {/* Burbujas de fondo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float-slow"
            style={{
              width: Math.random() * 60 + 30 + 'px',
              height: Math.random() * 60 + 30 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: `linear-gradient(45deg, 
                ${i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#f59e0b'}, 
                ${i % 3 === 0 ? '#8b5cf6' : i % 3 === 1 ? '#f59e0b' : '#3b82f6'})`,
              animationDelay: Math.random() * 10 + 's',
              animationDuration: Math.random() * 20 + 20 + 's'
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mis Reservas
            </h1>
            <p className="mt-2 text-gray-600 bg-white/60 backdrop-blur-sm p-3 rounded-xl inline-block">
              {isAdmin ? 'Todas las reservas del sistema' : `Reservas de ${currentUser.nombre}`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button 
              onClick={() => router.push('/')} 
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Ir al Inicio
            </button>
            <button 
              onClick={() => setShowForm(s => !s)} 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {showForm ? 'Cerrar Formulario' : 'Nueva Reserva'}
            </button>
            <div className="text-xs text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
              {isAdmin ? 'Modo Administrador' : `Conectado como: ${currentUser.nombre}`}
            </div>
          </div>
        </header>

        <div className="space-y-3 mb-6">
          {errorUI && <ErrorBox message={errorUI} onClose={() => setErrorUI(null)} />}
          {successUI && <SuccessBox message={successUI} onClose={() => setSuccessUI(null)} />}

          {deletePendingId && (
            <div className="p-4 bg-yellow-50/90 border-l-4 border-yellow-500 rounded-xl flex items-center justify-between backdrop-blur-sm">
              <div className="text-sm">
                ¿Confirmar eliminación de la reserva <strong className="text-red-600">{deletePendingId}</strong>?
              </div>
              <div className="flex gap-2">
                <button onClick={() => confirmDelete(deletePendingId)} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">Confirmar</button>
                <button onClick={() => setDeletePendingId(null)} className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all">Cancelar</button>
              </div>
            </div>
          )}
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl">
            <ReservaForm
              onCancel={() => setShowForm(false)}
              onSave={handleCreate}
              currentUserId={currentUser.id}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <div className="animate-pulse text-gray-600">Cargando reservas...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {visibleReservas.length === 0 && (
              <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
                <div className="text-4xl mb-4">🎫</div>
                <p className="text-gray-700 text-xl font-semibold">
                  {isAdmin ? 'No hay reservas en el sistema.' : 'No tienes reservas. ¡Haz tu primera reserva!'}
                </p>
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