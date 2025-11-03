'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null); // Para mostrar éxito o error
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('http://127.0.0.1:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        // Por seguridad, siempre mostramos este mensaje
        setMessage("Si una cuenta con ese correo existe, hemos enviado un enlace de reseteo.");
      } else {
        setError(data.message || 'Ocurrió un error.');
      }

    } catch (err) {
      setError("No se pudo conectar al servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-4">Recuperar Contraseña</h1>
        <p className="text-center text-gray-600 mb-6">
          Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            />
          </div>

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || message} // Deshabilita si está cargando o si ya se envió
            className="w-full py-2 px-4 rounded-md text-white bg-black hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isLoading ? 'Enviando...' : 'Enviar Enlace'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          <Link href="/login" className="font-medium text-black hover:underline">
            Volver a Iniciar Sesión
          </Link>
        </p>
      </div>
    </main>
  );
}