'use client';

// Importamos los hooks necesarios
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Para el botón de volver

export default function PerfilPage() {
  const router = useRouter();

  // Estados para guardar los datos
  const [user, setUser] = useState(null); // Aquí guardaremos la info del usuario
  const [isLoading, setIsLoading] = useState(true); // Para mostrar un "Cargando..."
  const [error, setError] = useState(null); // Para cualquier error

  // Este useEffect se ejecuta cuando la página carga
  useEffect(() => {
    
    // 1. Definimos una función asíncrona para buscar los datos
    const fetchProfile = async () => {
      // 2. Obtenemos el token guardado en el login
      const token = localStorage.getItem('token');

      // 3. Si no hay token, el usuario no está logueado. Lo sacamos de aquí.
      if (!token) {
        router.push('/login');
        return; // Detenemos la ejecución
      }

      try {
        // 4. Hacemos la llamada al backend (al endpoint que ya tienes)
        const res = await fetch('http://127.0.0.1:3000/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // ¡ESTA ES LA PARTE MÁS IMPORTANTE!
            // Enviamos el token en el header que tu middleware espera.
            'x-access-token': token, 
          },
        });

        const data = await res.json();

        // 5. Verificamos la respuesta
        if (res.ok && data.success) {
          // ¡Éxito! Guardamos los datos del usuario en el estado
          setUser(data.data); // data.data porque tu 'sendSuccess' envuelve los datos
        } else {
          // Si el token es inválido o expiró, el backend dará un error
          setError(data.message || 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
          // Limpiamos el localStorage y lo mandamos al login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
      } catch (err) {
        // Error de red (el backend está caído)
        setError('No se pudo conectar al servidor.');
      } finally {
        // 6. Pase lo que pase, dejamos de cargar
        setIsLoading(false);
      }
    };

    // 7. Llamamos a la función que acabamos de definir
    fetchProfile();
    
  }, [router]); // El 'router' se incluye como dependencia

  // --- RENDERIZADO ---

  // Estado 1: Cargando...
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-xl font-medium">Cargando perfil...</div>
      </main>
    );
  }

  // Estado 2: Error
  // (Aunque la mayoría de errores redirigen, es bueno tenerlo)
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <Link href="/login" className="text-blue-600 hover:underline mt-4 block">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </main>
    );
  }

  // Estado 3: Éxito (mostrar el perfil)
  if (user) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            Mi Perfil
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Nombre</label>
              <p className="text-lg font-semibold text-gray-900">{user.nombre}</p>
            </div>
            <hr />
            <div>
              <label className="block text-sm font-medium text-gray-500">Correo Electrónico</label>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>
            <hr />
            <div>
              <label className="block text-sm font-medium text-gray-500">Teléfono</label>
              <p className="text-lg text-gray-900">
                {user.telefono ? user.telefono : 'No especificado'}
              </p>
            </div>
            <hr />
            <div>
              <label className="block text-sm font-medium text-gray-500">Rol</label>
              <p className="text-lg text-gray-900 capitalize">{user.rol}</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">

            {/* --- CÓDIGO NUEVO AÑADIDO AQUÍ --- */}
            <Link href="/perfil/editar">
              <button className="w-full mb-3 py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Editar Perfil
              </button>
            </Link>
            {/* --- FIN DEL CÓDIGO NUEVO --- */}

            <Link href="/">
              <button className="w-full py-2 px-4 rounded-md text-white bg-black hover:bg-gray-800">
                Volver al Inicio
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Por si algo más falla
  return null;
}