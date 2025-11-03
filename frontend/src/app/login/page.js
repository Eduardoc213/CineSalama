'use client';

// Importamos los 'hooks' de React que necesitamos
import { useState } from 'react';
// Importamos Link para navegar a otras páginas (ej. registro)
import Link from 'next/link';
// Importamos el hook de Next.js para poder redirigir al usuario
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  // Hook para la navegación
  const router = useRouter();

  // Estados para guardar lo que el usuario escribe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para manejar la UI
  const [error, setError] = useState(null); // Para mostrar mensajes de error
  const [isLoading, setIsLoading] = useState(false); // Para deshabilitar el botón mientras carga

  /**
   * Esta función se llama cuando el usuario envía el formulario.
   */
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
    console.log('Respuesta completa del backend:', data); // Para debug

    // Verifica diferentes estructuras de respuesta
    if (res.ok) {
      // Opción 1: Si el token está en data.userInfo.token
      if (data.userInfo && data.userInfo.token) {
        localStorage.setItem('token', data.userInfo.token);
        localStorage.setItem('user', JSON.stringify({ 
          id: data.userInfo.id, 
          nombre: data.userInfo.nombre,
          email: data.userInfo.email 
        }));
        router.push('/');
      }
      // Opción 2: Si el token está directamente en data
      else if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ 
          id: data.id, 
          nombre: data.nombre,
          email: data.email 
        }));
        router.push('/');
      }
      // Opción 3: Si el token está en data.data (común con sendSuccess)
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

  // Este es el formulario visual (JSX)
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            CineHa
          </Link>
          <h1 className="text-3xl font-bold mt-2">Iniciar Sesión</h1>
          <p className="text-gray-600 mt-2">Bienvenido de vuelta.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Campo de Email */}
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
    _         onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              placeholder="tu@correo.com"
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
    _       </label>
            <input
              id="password"
S             type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              placeholder="••••••••"
            />
            
            {/* --- CÓDIGO AÑADIDO --- */}
            <div className="text-right mt-2">
              <Link href="/forgot-password" className="text-sm font-medium text-black hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            {/* --- FIN CÓDIGO AÑADIDO --- */}

          </div>

          {/* Mensaje de Error */}
  m       {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          {/* Botón de Enviar */}
          <div>
            <button
              type="submit"
              disabled={isLoading} // El botón se deshabilita si está cargando
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
s         >
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