import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Moon, PanelLeftClose, PanelLeftOpen, Search, Settings, Sun, UserRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAlerts } from '../../context/AlertsContext';
import { useKeyboard } from '../../hooks/useMisc';
import { getCellMeta } from '../../services/cellService';
import { Dropdown, UserAvatar } from '../common/Controls';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { CommandPalette } from '../search/CommandPalette';
import { incident } from '../../data/common/incident';

export function Topbar() {
  const { theme, toggleTheme, collapsed, setCollapsed, setMobileOpen, user, logout } = useApp();
  const { unreadCount } = useAlerts();
  const [notifOpen, setNotifOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const navigate = useNavigate();

  useKeyboard('k', useCallback((e) => { e.preventDefault(); setPaletteOpen(true); }, []), { ctrl: true });

  const cell = user ? getCellMeta(user.cellId) : null;

  return (
    <header className="topbar">
      <button type="button" className="btn btn--ghost btn--icon mobile-only" onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu"><Menu size={18} /></button>
      <button type="button" className="btn btn--ghost btn--icon desktop-only" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Déplier la barre latérale' : 'Replier la barre latérale'}>
        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </button>

      <button type="button" className="topbar__search" onClick={() => setPaletteOpen(true)} aria-label="Recherche globale">
        <Search size={15} />
        <span>Rechercher dans le dossier…</span>
        <span className="kbd">Ctrl K</span>
      </button>

      <div className="topbar__right">
        <span className="topbar__clock mono" title="Situation arrêtée dans les documents">{incident.situationAsOf}</span>
        <button type="button" className="btn btn--ghost btn--icon" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'} title="Changer de thème">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button type="button" className={`btn btn--ghost btn--icon ${unreadCount ? 'icon-dot' : ''}`} data-count={unreadCount > 99 ? '99+' : unreadCount} onClick={() => setNotifOpen(true)} aria-label={`Notifications (${unreadCount} non lues)`}>
          <Bell size={17} />
        </button>
        <Dropdown
          trigger={({ toggle }) => (
            <button type="button" className="btn btn--ghost" style={{ paddingLeft: 4 }} onClick={toggle} aria-label="Menu du profil">
              <UserAvatar name={user?.name || 'Invité'} size="sm" color={cell?.color} />
              <span className="desktop-only small">{user?.name || 'Invité'}</span>
            </button>
          )}
        >
          <div className="dropdown__label">{user ? `${user.role} · ${cell?.fullName || ''}` : 'Session invité'}</div>
          <button type="button" className="dropdown__item" onClick={() => navigate('/profil')}><UserRound size={14} /> Mon profil</button>
          <button type="button" className="dropdown__item" onClick={() => navigate('/parametres')}><Settings size={14} /> Paramètres</button>
          <div className="dropdown__sep" />
          <button type="button" className="dropdown__item" onClick={() => { logout(); navigate('/login'); }}><LogOut size={14} /> Se déconnecter</button>
        </Dropdown>
      </div>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  );
}
