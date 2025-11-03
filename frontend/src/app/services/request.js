export default async function request(path, options = {}) {
  // Prioriza la variable de entorno, si no existe usa la URL del backend por defecto.
  const defaultBackend = "http://localhost:3000";
  const baseFromEnv = (typeof window !== "undefined") ? (process.env.NEXT_PUBLIC_API_BASE || "") : "";
  const base = (baseFromEnv && baseFromEnv.trim()) ? baseFromEnv.replace(/\/$/, "") : defaultBackend;

  // Construir URL completa 
  const fullUrl = path.startsWith("http") ? path : `${base}${path}`;

  // Logs para depuración (muestran la URL usada)
  console.log("[request] ->", options.method || "GET", fullUrl, options.body ? (() => {
    try { return JSON.parse(options.body); } catch { return options.body; }
  })() : "");

  try {
    const res = await fetch(fullUrl, {
      method: options.method || "GET",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      body: options.body,
      credentials: options.credentials || undefined,
    });

    const text = await res.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }

    console.log("[request] <-", res.status, fullUrl, body);

    if (!res.ok) {
      const err = new Error(body?.message || res.statusText || `HTTP ${res.status}`);
      err.status = res.status;
      err.body = body;
      throw err;
    }

    return body;
  } catch (err) {
    console.error("[request] ERROR", fullUrl, err);
    throw err;
  }
}
