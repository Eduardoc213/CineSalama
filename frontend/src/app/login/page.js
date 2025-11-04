'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await res.json();
      console.log('Respuesta completa del backend:', data);

      if (res.ok) {
        if (data.userInfo && data.userInfo.token) {
          localStorage.setItem('token', data.userInfo.token);
          localStorage.setItem('user', JSON.stringify({ 
            id: data.userInfo.id, 
            nombre: data.userInfo.nombre,
            email: data.userInfo.email 
          }));
          router.push('/');
        }
        else if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify({ 
            id: data.id, 
            nombre: data.nombre,
            email: data.email 
          }));
          router.push('/');
        }
        else if (data.data && data.data.token) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify({ 
            id: data.data.id, 
            nombre: data.data.nombre,
            email: data.data.email 
          }));
          router.push('/');
        }
        else {
          console.error('Estructura de respuesta inesperada:', data);
          setError('Estructura de respuesta inesperada del servidor.');
        }
      } else {
        setError(data.message || 'Error en las credenciales.');
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError('No se pudo conectar al servidor. Inténtalo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border border-gray-200">
        
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-black">
            CineHa
          </Link>
          <h1 className="text-3xl font-bold mt-2 text-black">Iniciar Sesión</h1>
          <p className="text-gray-600 mt-2">Bienvenido de vuelta.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Campo de Email */}
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-black mb-1"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
              placeholder="tu@correo.com"
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="mb-4">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-black mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
              placeholder="••••••••"
            />
          </div>

          {/* --- ENLACE COMPLETAMENTE NEGRO CON ESTILO FORZADO --- */}
          <div className="mb-6 text-center">
            <Link 
              href="/forgot-password" 
              className="text-base font-bold hover:underline"
              style={{ color: '#000000' }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          {/* --- FIN ENLACE MEJORADO --- */}

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          {/* Botón de Enviar */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
            >
              {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes una cuenta?{' '}
          <Link href="/registro" className="font-medium text-black hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  );
}