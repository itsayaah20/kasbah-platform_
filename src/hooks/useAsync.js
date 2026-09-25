import { useCallback, useEffect, useRef, useState } from 'react';

// Exécute un appel de service et expose { data, loading, error, reload }.
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const callId = useRef(0);

  const run = useCallback(() => {
    const id = ++callId.current;
    setState((s) => ({ data: s.data, loading: true, error: null }));
    fn()
      .then((data) => { if (id === callId.current) setState({ data, loading: false, error: null }); })
      .catch((error) => { if (id === callId.current) setState({ data: null, loading: false, error }); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { run(); }, [run]);

  return { ...state, reload: run };
}
