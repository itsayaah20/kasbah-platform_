import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readStore, writeStore } from '../utils/storage';
import { SETTINGS_KEY, defaultSettings } from '../services/api';
import { allMembers } from '../services/userService';

// État applicatif côté client : thème, réglages, session, barre latérale et
// modifications locales (statuts d'actions changés depuis l'interface).
const AppContext = createContext(null);

const THEME_KEY = 'kasbah.theme';
const SESSION_KEY = 'kasbah.session';
const OVERRIDES_KEY = 'kasbah.actionOverrides';

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => readStore(THEME_KEY, 'dark'));
  const [settings, setSettingsState] = useState(() => ({ ...defaultSettings, ...readStore(SETTINGS_KEY, {}) }));
  const [session, setSession] = useState(() => readStore(SESSION_KEY, null));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [overrides, setOverrides] = useState(() => readStore(OVERRIDES_KEY, {}));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    writeStore(THEME_KEY, theme);
  }, [theme]);

  const setSettings = useCallback((patch) => {
    setSettingsState((s) => {
      const next = { ...s, ...patch };
      writeStore(SETTINGS_KEY, next);
      return next;
    });
  }, []);

  const login = useCallback((memberId) => {
    const s = { memberId, at: new Date().toISOString() };
    writeStore(SESSION_KEY, s);
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    writeStore(SESSION_KEY, null);
    setSession(null);
  }, []);

  const setActionStatus = useCallback((id, status) => {
    setOverrides((o) => {
      const next = { ...o, [id]: status };
      writeStore(OVERRIDES_KEY, next);
      return next;
    });
  }, []);

  const resetOverrides = useCallback(() => {
    writeStore(OVERRIDES_KEY, {});
    setOverrides({});
  }, []);

  const user = session ? allMembers.find((m) => m.id === session.memberId) || null : null;

  const value = useMemo(() => ({
    theme, setTheme, toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    settings, setSettings,
    session, user, login, logout,
    collapsed, setCollapsed, mobileOpen, setMobileOpen,
    overrides, setActionStatus, resetOverrides,
  }), [theme, settings, session, user, login, logout, collapsed, mobileOpen, overrides, setSettings, setActionStatus, resetOverrides]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
