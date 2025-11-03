"use client";
export default function SuccessBox({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="bg-green-50 border-l-4 border-green-600 text-green-800 p-3 rounded-md shadow-sm flex justify-between items-start gap-3">
      <div className="text-sm"><strong>Éxito:</strong> <span className="block mt-1 whitespace-pre-wrap">{message}</span></div>
      {onClose && <button onClick={onClose} className="text-green-700 px-2 py-1">Cerrar</button>}
    </div>
  );
}
