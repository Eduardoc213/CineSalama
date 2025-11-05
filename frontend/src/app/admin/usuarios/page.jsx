// app/admin/usuarios/page.jsx
'use client';
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Link from 'next/link';

export default function UsuariosAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getUsuarios ? await api.getUsuarios() : await fetch('/api/usuarios').then(r=>r.json());
        if (!mounted) return;
        setData(res || []);
      } catch (err) {
        setError('No se pudo cargar usuarios');
      } finally { if (mounted) setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Usuarios</h2>
        <Link href="/usuarios/nuevo"><button className="px-3 py-1 bg-black text-white rounded">Nuevo usuario</button></Link>
      </div>

      {loading ? <div>Cargando...</div> : error ? <div className="text-red-600">{error}</div> : (
        <div className="overflow-auto bg-white border rounded">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Nombre</th>
                <th className="p-2">Email</th>
                <th className="p-2">Rol</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.id}</td>
                  <td className="p-2">{u.nombre}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.rol}</td>
                  <td className="p-2">
                    <Link href={`/usuarios/${u.id}`}><button className="px-2 py-1 border rounded mr-2">Ver</button></Link>
                    <Link href={`/usuarios/${u.id}/editar`}><button className="px-2 py-1 border rounded mr-2">Editar</button></Link>
                    {/* Implementa eliminar con confirm y api.deleteUsuario(u.id) */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
