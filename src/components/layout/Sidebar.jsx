import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Boxes, Bell, Activity, CalendarClock, BarChart3, FileText, Users, Settings, FolderSearch, Network, Gavel,
} from 'lucide-react';
import { allCells } from '../../services/cellService';
import { useAlerts } from '../../context/AlertsContext';
import { useApp } from '../../context/AppContext';
import { incident } from '../../data/common/incident';
import { KasbahMark } from '../common/CellIcon';

function NavItem({ to, icon: Icon, label, count, critical, dot, end }) {
  const { setMobileOpen } = useApp();
  return (
    <NavLink to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)} title={label}>
      {dot ? <span className="cell-dot" style={{ background: dot, margin: '0 4px' }} /> : <Icon size={17} />}
      <span className="nav-link__label">{label}</span>
      {count != null && count > 0 && <span className={`nav-link__count ${critical ? 'is-critical' : ''}`}>{count}</span>}
    </NavLink>
  );
}

export function Sidebar() {
  const { alerts, unreadCount } = useAlerts();
  const { mobileOpen, setMobileOpen } = useApp();
  const criticalByCell = (id) => alerts.filter((a) => a.cellId === id && a.severity === 'critical' && !a.read && !a.archived).length;

  return (
    <>
      {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`} aria-label="Navigation principale">
        <div className="sidebar__brand">
          <KasbahMark />
          <div className="brand-text">
            <span className="brand-name">KASBAH</span>
            <span className="brand-sub">Cellule de crise · AtlasGrid</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          <div className="nav-section">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Tableau de bord" />
          </div>

          <div className="nav-section">
            <div className="nav-section__title">Cellules</div>
            <NavItem to="/cellules" icon={Boxes} label="Vue d’ensemble" end />
            {allCells.map((c) => (
              <NavItem key={c.id} to={`/cellules/${c.id}`} label={c.fullName} dot={c.color} count={criticalByCell(c.id)} critical />
            ))}
            <NavItem to="/relations" icon={Network} label="Relations" />
          </div>

          <div className="nav-section">
            <div className="nav-section__title">Monitoring</div>
            <NavItem to="/alertes" icon={Bell} label="Alertes" count={unreadCount} critical />
            <NavItem to="/activites" icon={Activity} label="Activités" />
            <NavItem to="/evenements" icon={CalendarClock} label="Événements" />
            <NavItem to="/pieces" icon={FolderSearch} label="Pièces à conviction" />
            <NavItem to="/decisions" icon={Gavel} label="Décisions" />
          </div>

          <div className="nav-section">
            <div className="nav-section__title">Analytics</div>
            <NavItem to="/statistiques" icon={BarChart3} label="Statistiques" />
            <NavItem to="/rapports" icon={FileText} label="Rapports & documents" />
          </div>

          <div className="nav-section">
            <div className="nav-section__title">Système</div>
            <NavItem to="/utilisateurs" icon={Users} label="Utilisateurs" />
            <NavItem to="/parametres" icon={Settings} label="Paramètres" />
          </div>
        </nav>

        <div className="sidebar__footer">
          <div className="incident-chip" title={`${incident.title} — ${incident.qualification}`}>
            <span className="incident-chip__dot" aria-hidden="true" />
            <div className="incident-chip__text">
              <div className="incident-chip__title">Incident {incident.code} · {incident.globalRisk}</div>
              <div className="incident-chip__sub">{incident.attacker} : {incident.ransomEscalation.amount} · {incident.ransomEscalation.deadline}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
