import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAlerts } from '../context/AlertsContext';
import { getCellMeta } from '../services/cellService';
import { PageHeader } from '../components/common/PageHeader';
import { Card, KeyValue } from '../components/common/Card';
import { UserAvatar } from '../components/common/Controls';
import { AlertCard } from '../components/alerts/AlertCard';
import { EmptyState } from '../components/common/States';

export default function Profile() {
  const { user, session, logout } = useApp();
  const { alerts } = useAlerts();
  const navigate = useNavigate();
  if (!user) return <EmptyState title="Aucun profil" />;
  const cell = getCellMeta(user.cellId);
  const own = alerts.filter((a) => a.cellId === user.cellId && !a.archived && !a.read).slice(0, 6);

  return (
    <>
      <PageHeader breadcrumbs={[{ label: 'Tableau de bord', to: '/dashboard' }, { label: 'Profil' }]} eyebrow="Système" title="Mon profil"
        actions={<button type="button" className="btn" onClick={() => { logout(); navigate('/login'); }}><LogOut size={14} /> Se déconnecter</button>} />
      <div className="grid grid-main-side">
        <Card>
          <div className="row" style={{ gap: 16 }}>
            <UserAvatar name={user.name} size="lg" color={cell.color} />
            <div><h2 style={{ fontSize: 18 }}>{user.name}</h2><div className="muted">{user.role}</div></div>
          </div>
          <div style={{ marginTop: 18 }}>
            <KeyValue items={[
              ['Cellule', <Link key="c" to={`/cellules/${cell.id}`} className="row" style={{ gap: 6 }}><span className="cell-dot" style={{ background: cell.color }} />{cell.fullName}</Link>],
              ['Rôle', user.role],
              ['Référent de cellule', user.lead ? 'Oui' : 'Non'],
              ['Source', user.source],
              ['Session ouverte', new Date(session.at).toLocaleString('fr-FR')],
            ]} />
          </div>
          <Link to={`/cellules/${cell.id}`} className="btn btn--primary" style={{ marginTop: 18 }}>Espace de ma cellule <ArrowRight size={14} /></Link>
        </Card>
        <Card title="Alertes non lues de ma cellule" flush>
          {own.length ? own.map((a) => <AlertCard key={a.id} alert={a} compact onOpen={() => navigate(`/alertes?id=${encodeURIComponent(a.id)}`)} />) : <EmptyState title="Rien à signaler" />}
        </Card>
      </div>
    </>
  );
}
