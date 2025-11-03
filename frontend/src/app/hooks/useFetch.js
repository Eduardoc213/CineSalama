// src/App/hooks/useFetch.js
"use client";
import { useEffect, useState } from "react";

/**
 * useFetch recibe una función (promiseFactory) que retorna una promesa (ej. () => api.getAsientos())
 * deps: array de dependencias para volver a cargar
 */
export default function useFetch(promiseFactory, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    promiseFactory()
      .then((res) => { if (mounted) setData(res); })
      .catch((err) => { if (mounted) setError(err); })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, setData, loading, error };
}
