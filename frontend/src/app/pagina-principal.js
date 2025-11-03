'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function PaginaPrincipal() {


  // --- NUEVO ---
  const router = useRouter(); // Para manejar el logout
  
  // Estados para saber si el usuario está logueado y quién es
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Este 'useEffect' se ejecuta CUANDO la página carga en el navegador
  useEffect(() => {
    // Revisa el localStorage para ver si hay un token y datos de usuario
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user'); // El que guardamos en el login

    if (token && userData) {
      // Si encontramos ambos, el usuario está logueado
      setIsLoggedIn(true);
      setUser(JSON.parse(userData)); // Convertimos el texto de vuelta a un objeto
    }
  }, []); // El array vacío [] asegura que solo se ejecute una vez

  // Función para cerrar sesión
  const handleLogout = () => {
    // Limpiamos el localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Actualizamos los estados
    setIsLoggedIn(false);
    setUser(null);
    
    // Forzamos un refresh de la página para asegurar que todo se limpie
    router.refresh(); 
  };
// --- FIN NUEVO ---

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-lg font-semibold">CineHa</div>

            <div className="text-sm">
              <label className="sr-only">Seleccionar Cine</label>
              <select className="border rounded px-3 py-1 text-sm bg-white">
                <option>Ciudad Capital</option>
                <option>Alta Verapaz</option>
                <option>Baja Verapaz</option>
                <option>Quetzaltenango</option>
                <option>Escuintla</option>
              </select>
            </div>
          </div>

          <nav className="flex items-center gap-8">
            <ul className="flex gap-6 items-center text-sm">
              <li><Link href="/estrenos">Estrenos</Link></li>
              <li><Link href="/snacks">Snacks</Link></li>
              <li><Link href="/preventa">Pre venta</Link></li>
            </ul>
{/* --- MODIFICADO --- */}
            {isLoggedIn && user ? (
              // Si SÍ está logueado, muestra saludo y botón de logout
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden sm:block">
                  Hola, {user.nombre}
                </span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 rounded bg-gray-200 text-black text-sm hover:bg-gray-300"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              // Si NO está logueado, muestra el botón original
              <Link href="/login">
  <button className="px-4 py-2 rounded bg-black text-white text-sm">
Iniciar Sesión
</button>
</Link>
            )}
            {/* --- FIN MODIFICADO --- */}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left column: title, description, button */}
          <div className="lg:col-span-1">
            <h1 className="text-5xl font-extrabold mb-4">Bienvenido</h1>
            <p className="text-gray-600 mb-6">
              CineHa es un espacio donde puedes comprar y reservar boletos para tus películas favoritas.
            </p>
<div className="flex gap-4 items-center mb-8">
              {/* --- MODIFICADO --- */}
              {isLoggedIn ? (
                // Si está logueado, podríamos llevarlo a su perfil
                <Link href="/perfil">
                  <button className="bg-black text-white px-5 py-3 rounded">Ver Mi Perfil</button>
                </Link>
              ) : (
                // Si no, lo mandamos a login
                <Link href="/login">
                  <button className="bg-black text-white px-5 py-3 rounded">Iniciar Sesión</button>
                </Link>
              )}
              {/* --- FIN MODIFICADO --- */}

              {/* ...el resto del div (input de buscar) se queda igual... */}

              <div className="hidden sm:block">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Buscar"
                    className="border rounded-full px-4 py-2 w-64 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Center column: hero posters */}
          <div className="lg:col-span-2">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Lo más visto</h2>
            </div>

            <div className="flex justify-center gap-6 mb-6">
              <div className="w-64 h-96 bg-gray-100 rounded shadow overflow-hidden">
                <img
                  src="https://via.placeholder.com/400x600?text=Poster+1"
                  alt="poster 1"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-64 h-96 bg-gray-100 rounded shadow overflow-hidden">
                <img
                  src="https://via.placeholder.com/400x600?text=Poster+2"
                  alt="poster 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex justify-center mb-12">
              <Link href="/comprar">
                <button className="bg-black text-white px-6 py-3 rounded">Comprar</button>
              </Link>
            </div>

            <section>
              <h3 className="text-2xl font-semibold text-center mb-8">Cartelera</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="mx-auto w-48 h-72 bg-gray-100 rounded shadow overflow-hidden">
                  <img
                    src="https://via.placeholder.com/300x450?text=Película+1"
                    alt="pelicula 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mx-auto w-48 h-72 bg-gray-100 rounded shadow overflow-hidden">
                  <img
                    src="https://via.placeholder.com/300x450?text=Película+2"
                    alt="pelicula 2"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mx-auto w-48 h-72 bg-gray-100 rounded shadow overflow-hidden">
                  <img
                    src="https://via.placeholder.com/300x450?text=Película+3"
                    alt="pelicula 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* --- CONTINUACIÓN: Recomendado / Próximos estrenos / Sobre nosotros --- */}
        <section className="mt-12 grid lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-2">Recomendado por CineHa</h3>
            <h4 className="text-lg font-semibold mb-3">Los tipos malos 2</h4>
            <p className="text-gray-600 mb-4">
              En esta entrega llena de acción, los ya reformados Tipos Malos deberán realizar un último atraco ideado por unas nuevas criminales: las Tipas Malas.
            </p>
            <p className="text-sm font-medium mb-6">No recomendada para menores de 7 años</p>
            <a href="/comprar" className="inline-block">
              <button className="bg-black text-white px-5 py-2 rounded">Comprar</button>
            </a>
          </div>

          <div className="lg:col-span-1 flex justify-center lg:justify-end">
            <div className="w-56 h-80 bg-gray-100 rounded shadow overflow-hidden">
              <img src="/placeholder-poster-1.jpg" alt="poster" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Próximos estrenos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <a href="/estrenos/tron-ares" className="group text-center">
              <div className="mx-auto w-48 h-72 bg-gray-100 rounded shadow overflow-hidden">
                <img src="/placeholder-poster-2.jpg" alt="Tron Ares" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <p className="mt-3 font-medium">Tron Ares</p>
            </a>

            <a href="/estrenos/the-storm" className="group text-center">
              <div className="mx-auto w-48 h-72 bg-gray-100 rounded shadow overflow-hidden">
                <img src="/placeholder-poster-3.jpg" alt="The Storm" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <p className="mt-3 font-medium">The Storm</p>
            </a>

            <a href="/estrenos/jesus-del-mundo" className="group text-center">
              <div className="mx-auto w-48 h-72 bg-gray-100 rounded shadow overflow-hidden">
                <img src="/placeholder-poster-4.jpg" alt="Jesús del Mundo" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <p className="mt-3 font-medium">Jesús del Mundo</p>
            </a>
          </div>
        </section>

        <section className="mt-20 border-t pt-8">
          <h3 className="text-2xl font-semibold mb-3">Sobre nosotros</h3>
          <p className="text-gray-600 max-w-2xl">
            Somos un cine 100% Guatemalteco, fundado en 2025 para traer al público Chapín una amplia variedad de películas y promociones.
          </p>

          <div className="py-6 border-t flex items-center justify-between mt-6">
            <div className="text-sm">CineHa</div>
            <div className="flex gap-4 text-gray-600">
              <a href="#" aria-label="facebook" className="hover:text-black">FB</a>
              <a href="#" aria-label="linkedin" className="hover:text-black">IN</a>
              <a href="#" aria-label="youtube" className="hover:text-black">YT</a>
              <a href="#" aria-label="instagram" className="hover:text-black">IG</a>
            </div>
          </div>
        </section>
        {/* --- FIN CONTINUACIÓN --- */}

      </main>

      {/* ...existing footer si aplica... */}
    </div>
  );
}
