import { useEffect, useState } from 'react';
export function usePersistentState<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? (JSON.parse(s) as T) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage unavailable */ } }, [key, v]);
  return [v, setV] as const;
}
