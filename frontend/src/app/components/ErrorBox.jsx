"use client";
export default function ErrorBox({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-3 rounded-md shadow-sm flex justify-between items-start gap-3">
      <div className="text-sm"><strong>Error:</strong> <span className="block mt-1 whitespace-pre-wrap">{message}</span></div>
      {onClose && <button onClick={onClose} className="text-red-700 px-2 py-1">Cerrar</button>}
    </div>
  );
}
