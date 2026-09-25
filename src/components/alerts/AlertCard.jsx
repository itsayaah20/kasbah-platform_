import { AlertOctagon, Archive, ArchiveRestore, CheckCircle2, Info, MailOpen, Mail, TriangleAlert } from 'lucide-react';
import { SEVERITIES } from '../../services/alertService';
import { getCellMeta } from '../../services/cellService';
import { EvidenceChips, StatusBadge } from '../common/Badge';

const ICON = { critical: AlertOctagon, warning: TriangleAlert, info: Info, success: CheckCircle2 };

export function AlertCard({ alert, onOpen, onToggleRead, onArchive, compact = false }) {
  const sev = SEVERITIES[alert.severity];
  const Icon = ICON[alert.severity];
  const cell = getCellMeta(alert.cellId);
  return (
    <div className={`alert-card ${!alert.read && !alert.archived ? 'is-unread' : ''} ${alert.archived ? 'is-archived' : ''}`}>
      <span className={`alert-card__icon alert-card__icon--${sev.tone}`} aria-hidden="true"><Icon size={16} /></span>
      <button type="button" className="grow" style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', minWidth: 0 }} onClick={() => onOpen?.(alert)}>
        <div className="alert-card__title">{alert.title}</div>
        {!compact && <div className="alert-card__desc">{alert.description}</div>}
        <div className="alert-card__meta">
          <StatusBadge tone={sev.tone} size="sm">{sev.label}</StatusBadge>
          {cell && <span className="row" style={{ gap: 5 }}><span className="cell-dot" style={{ background: cell.color }} />{cell.name}</span>}
          <span>{alert.source}</span>
          <span className="mono">{[alert.day, alert.time].filter(Boolean).join(' ')}</span>
          {!compact && <EvidenceChips refs={alert.evidence} max={3} />}
        </div>
      </button>
      {(onToggleRead || onArchive) && (
        <div className="alert-card__actions">
          {onToggleRead && (
            <button type="button" className="btn btn--ghost btn--icon btn--sm" onClick={() => onToggleRead(alert)} title={alert.read ? 'Marquer non lu' : 'Marquer comme lu'} aria-label={alert.read ? 'Marquer non lu' : 'Marquer comme lu'}>
              {alert.read ? <Mail size={14} /> : <MailOpen size={14} />}
            </button>
          )}
          {onArchive && (
            <button type="button" className="btn btn--ghost btn--icon btn--sm" onClick={() => onArchive(alert)} title={alert.archived ? 'Restaurer' : 'Archiver'} aria-label={alert.archived ? 'Restaurer' : 'Archiver'}>
              {alert.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
