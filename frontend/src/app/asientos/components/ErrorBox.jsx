"use client";
export default function ErrorBox({ title = "Error", message, onClose }) {
  if (!message) return null;
  return (
    <div className="border-l-4 border-red-600 bg-red-50 text-red-800 p-3 rounded-md shadow-sm flex justify-between items-start gap-4">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm mt-1 whitespace-pre-wrap">{message}</div>
      </div>
      <div>
        <button onClick={onClose} className="text-red-700 px-2 py-1 hover:underline">Cerrar</button>
      </div>
    </div>
  );
}
