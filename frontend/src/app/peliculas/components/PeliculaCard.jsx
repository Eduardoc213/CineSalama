"use client";
import React from "react";

export default function PeliculaCard({ pelicula, onEdit, onDelete }) {
  return (
    <div className="border border-gray-300 p-4 rounded shadow mb-4 bg-white text-black">
      <h2 className="text-xl font-bold mb-2">{pelicula.titulo}</h2>
      <p><strong>Clasificación:</strong> {pelicula.clasificacion}</p>
      <p><strong>Duración:</strong> {pelicula.duracion} min</p>
      <p><strong>Sinopsis:</strong> {pelicula.sinopsis}</p>
      {pelicula.poster && (
        <img src={pelicula.poster} alt={pelicula.titulo} className="mt-2 w-32 h-auto" />
      )}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onEdit(pelicula)}
          className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(pelicula.id)}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
