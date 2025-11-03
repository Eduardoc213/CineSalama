'use client';

// Importamos los 'hooks' de React
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  // Hook para la navegación
  const router = useRouter();

  // Estados para guardar lo que el usuario escribe
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState(''); // <-- 1. NUEVO ESTADO
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  
  // Estados para manejar la UI
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Esta función se llama cuando el usuario envía el formulario.
   */
  const handleSubmit = async (e) => {
    // 1. Prevenimos que la página se recargue
    e.preventDefault();

    // 2. Reiniciamos los estados
    setIsLoading(true);
    setError(null);

    // 3. Validación simple en el frontend
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return; // Detenemos la ejecución
    }

    // 4. Hacemos la llamada (fetch) a tu backend
    try {
      const res = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre,
          email: email,
          telefono: telefono, // <-- 2. DATO AÑADIDO AL ENVÍO
          password: password,
        }),
      });

      // 5. Verificamos la respuesta
      if (res.ok) {
        // ¡Éxito!
        router.push('/login');
        
      } else {
        const data = await res.json();
        setError(data.message || 'Error al crear la cuenta.');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor. Inténtalo más tarde.');
    } finally {
      // 6. Pase lo que pase, dejamos de cargar
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
          <h1 className="text-3xl font-bold mt-2">Crear una Cuenta</h1>
          <p className="text-gray-600 mt-2">Únete a la comunidad de CineHa.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Campo de Nombre */}
          <div className="mb-4">
            <label 
              htmlFor="nombre" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre Completo
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              placeholder="Tu nombre"
            />
          </div>

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
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              placeholder="tu@correo.com"
            />
          </div>

          {/* --- 3. CAMPO NUEVO AÑADIDO --- */}
          <div className="mb-4">
            <label 
              htmlFor="telefono" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Teléfono
            </label>
            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required // Tu backend lo necesita, así que lo ponemos como 'required'
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              placeholder="Ej: 55551234"
            />
          </div>
          {/* --- FIN CAMPO NUEVO --- */}

          {/* Campo de Contraseña */}
          <div className="mb-4">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
        	    id="password"
            	type="password"
            	value={password}
            	onChange={(e) => setPassword(e.target.value)}
            	required
            	className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            	placeholder="••••••••"
            />
          </div>

          {/* Campo de Confirmar Contraseña */}
          <div className="mb-6">
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              placeholder="••••••••"
            />
          </div>

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
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="font-medium text-black hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </main>
  );
}