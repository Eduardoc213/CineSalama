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

      if (res.ok && data.success) {
        const userInfo = data.data;
        const token = userInfo.token;
        const userRole = userInfo.rol;

        // Limpiar y guardar en localStorage
        localStorage.clear();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ 
          id: userInfo.id, 
          nombre: userInfo.nombre,
          email: userInfo.email,
          rol: userRole
        }));
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userEmail', userInfo.email);

        // Redirigir a página principal
        router.push('/');

      } else {
        setError(data.message || 'Error en las credenciales.');
      }
    } catch (err) {
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

          <div className="mb-6 text-center">
            <Link 
              href="/forgot-password" 
              className="text-base font-bold hover:underline"
              style={{ color: '#000000' }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

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