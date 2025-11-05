'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = params;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.message || 'Error al restablecer la contraseña. El enlace puede haber expirado.');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-8 relative overflow-hidden">
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

        <div className="max-w-md w-full text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 relative z-10">
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ¡Éxito!
          </h1>
          <p className="mt-4 text-gray-700">Tu contraseña ha sido actualizada correctamente.</p>
          <p className="mt-2 text-gray-600">Serás redirigido al inicio de sesión en 3 segundos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-8 relative overflow-hidden">
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

      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 relative z-10">
        <div className="text-center mb-6">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            CineHa
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-gray-800">Restablecer Contraseña</h1>
          <p className="text-gray-600 mt-2">Crea una nueva contraseña para tu cuenta</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white/80 backdrop-blur-sm transition-all"
              placeholder="Ingresa tu nueva contraseña"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nueva Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white/80 backdrop-blur-sm transition-all"
              placeholder="Confirma tu nueva contraseña"
            />
          </div>

          {error && (
            <div className="bg-red-50/90 border-l-4 border-red-500 text-red-700 p-4 rounded-xl backdrop-blur-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">⚠️</div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Actualizando...
              </span>
            ) : (
              'Actualizar Contraseña'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}