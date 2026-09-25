import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { alertService } from '../services/alertService';
import { useAsync } from '../hooks/useAsync';
import { readStore, writeStore } from '../utils/storage';

// Alertes chargées une fois ; l'état lu / archivé / supprimé est propre au
// navigateur (localStorage) en attendant un endpoint PATCH /alerts/:id.
const AlertsContext = createContext(null);
const STATE_KEY = 'kasbah.alertState';

export function AlertsProvider({ children }) {
  const { data, loading, error, reload } = useAsync(() => alertService.list(), []);
  const [state, setState] = useState(() => readStore(STATE_KEY, {}));

  const patch = useCallback((ids, change) => {
    setState((s) => {
      const next = { ...s };
      ids.forEach((id) => { next[id] = { ...next[id], ...change }; });
      writeStore(STATE_KEY, next);
      return next;
    });
  }, []);

  const alerts = useMemo(
    () => (data || [])
      .map((a) => ({ ...a, read: !!state[a.id]?.read, archived: !!state[a.id]?.archived, deleted: !!state[a.id]?.deleted }))
      .filter((a) => !a.deleted),
    [data, state],
  );

  const value = useMemo(() => ({
    alerts,
    loading,
    error,
    reload,
    unreadCount: alerts.filter((a) => !a.read && !a.archived).length,
    markRead: (ids, read = true) => patch([].concat(ids), { read }),
    archive: (ids, archived = true) => patch([].concat(ids), { archived, read: true }),
    remove: (ids) => patch([].concat(ids), { deleted: true }),
    resetAll: () => { writeStore(STATE_KEY, {}); setState({}); },
  }), [alerts, loading, error, reload, patch]);

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export const useAlerts = () => useContext(AlertsContext);
