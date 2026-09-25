import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCheck } from 'lucide-react';
import { Drawer } from '../common/Modal';
import { Segmented } from '../common/Controls';
import { EmptyState, LoadingState } from '../common/States';
import { AlertCard } from '../alerts/AlertCard';
import { useAlerts } from '../../context/AlertsContext';
import { useToast } from '../../context/ToastContext';

export function NotificationPanel({ open, onClose }) {
  const { alerts, loading, markRead, archive } = useAlerts();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('unread');

  const visible = alerts.filter((a) => !a.archived && (filter === 'all' || !a.read)).slice(0, 30);
  const unreadIds = alerts.filter((a) => !a.read && !a.archived).map((a) => a.id);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Notifications"
      actions={(
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          disabled={!unreadIds.length}
          onClick={() => { markRead(unreadIds); toast('Notifications marquées comme lues', { description: `${unreadIds.length} alerte(s)` }); }}
        >
          <CheckCheck size={14} /> Tout lire
        </button>
      )}
    >
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[{ value: 'unread', label: 'Non lues', count: unreadIds.length }, { value: 'all', label: 'Toutes' }]}
          ariaLabel="Filtrer les notifications"
        />
      </div>
      {loading ? <LoadingState variant="block" /> : visible.length === 0 ? (
        <EmptyState title="Tout est lu" description="Aucune notification non lue." />
      ) : (
        visible.map((a) => (
          <AlertCard
            key={a.id}
            alert={a}
            compact
            onOpen={() => { markRead(a.id); onClose(); navigate(`/alertes?id=${encodeURIComponent(a.id)}`); }}
            onToggleRead={() => markRead(a.id, !a.read)}
            onArchive={() => { archive(a.id); toast('Alerte archivée', { tone: 'info' }); }}
          />
        ))
      )}
      <div style={{ padding: 14 }}>
        <button type="button" className="btn btn--sm" style={{ width: '100%' }} onClick={() => { onClose(); navigate('/alertes'); }}>
          Ouvrir le centre d’alertes
        </button>
      </div>
    </Drawer>
  );
}
