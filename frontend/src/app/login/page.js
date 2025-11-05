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
        const userRole = (userInfo.rol || userInfo.role || '').toString().toLowerCase();

        // Limpiar y guardar en localStorage
        localStorage.clear();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ 
          id: userInfo.id, 
          nombre: userInfo.nombre,
          email: userInfo.email,
          rol: userInfo.rol || userRole
        }));
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userEmail', userInfo.email);

        // REDIRECCIÓN POR ROL
        if (userRole === 'admin' || userRole === 'administrator' || userRole === 'adm') {
          router.push('/admin');
        } else {
          router.push('/');
        }
               
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8">
        
        <div className="text-center mb-6">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            CineHa
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-gray-800">Iniciar Sesión</h1>
          <p className="text-gray-600 mt-2">Bienvenido de vuelta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white/80 backdrop-blur-sm transition-all"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white/80 backdrop-blur-sm transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="text-center">
            <Link 
              href="/forgot-password" 
              className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
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

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes una cuenta?{' '}
          <Link href="/registro" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}