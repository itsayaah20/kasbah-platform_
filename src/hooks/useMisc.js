import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

// Onglet synchronisé avec ?tab= pour que chaque vue soit partageable par URL.
export function useTabParam(defaultTab) {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || defaultTab;
  const setTab = (next) => {
    const p = new URLSearchParams(params);
    if (next === defaultTab) p.delete('tab'); else p.set('tab', next);
    setParams(p, { replace: true });
  };
  return [tab, setTab];
}

export function useKeyboard(key, handler, { ctrl = false } = {}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      if (ctrl && !(e.ctrlKey || e.metaKey)) return;
      handler(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [key, handler, ctrl]);
}
