// frontend/src/app/services/request.js
export default async function request(path, options = {}) {
  const defaultBackend = "http://localhost:3000";
  const baseFromEnv = (typeof window !== "undefined") ? (process.env.NEXT_PUBLIC_API_BASE || "") : "";
  const base = (baseFromEnv && baseFromEnv.trim()) ? baseFromEnv.replace(/\/$/, "") : defaultBackend;

  // ✅ CORREGIR: Evitar URLs duplicadas
  const fullUrl = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : "/" + path}`;

  console.log("[request] ->", options.method || "GET", fullUrl);

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