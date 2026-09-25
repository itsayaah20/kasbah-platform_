import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, FileText } from 'lucide-react';
import { CellIcon } from '../common/CellIcon';
import { ProgressBar, UserAvatar } from '../common/Controls';
import { StatusBadge } from '../common/Badge';

export function CellCard({ cell, alerts = 0, criticalAlerts = 0, activities = 0, lastActivity }) {
  const navigate = useNavigate();
  const { progress } = cell;
  return (
    <article
      className="card card--interactive cell-card"
      onClick={() => navigate(`/cellules/${cell.id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/cellules/${cell.id}`); }}
      tabIndex={0}
      role="link"
      aria-label={`Ouvrir la cellule ${cell.fullName}`}
    >
      <div className="cell-card__head">
        <CellIcon cell={cell} />
        <div className="grow">
          <div className="row between">
            <div className="cell-card__name">{cell.fullName}</div>
            <ArrowUpRight size={16} className="muted" />
          </div>
          <div className="cell-card__resp row" style={{ gap: 6, marginTop: 2 }}>
            {cell.responsible ? (<><UserAvatar name={cell.responsible.name} size="sm" /> {cell.responsible.name}</>) : 'Responsable : N/A'}
          </div>
        </div>
      </div>

      <p className="cell-card__mission">{cell.mission}</p>

      <div className="row-wrap">
        <StatusBadge tone="info" size="sm">Mobilisée</StatusBadge>
        {criticalAlerts > 0 && <StatusBadge tone="critical" size="sm">{criticalAlerts} critique{criticalAlerts > 1 ? 's' : ''}</StatusBadge>}
        {progress.blocked > 0 && <StatusBadge tone="serious" size="sm">{progress.blocked} bloquée{progress.blocked > 1 ? 's' : ''}</StatusBadge>}
      </div>

      <div className="cell-card__stats">
        <div className="mini-stat"><div className="mini-stat__v">{cell.members.length}</div><div className="mini-stat__l">Membres cités</div></div>
        <div className="mini-stat"><div className="mini-stat__v">{activities}</div><div className="mini-stat__l">Activités</div></div>
        <div className="mini-stat"><div className="mini-stat__v">{alerts}</div><div className="mini-stat__l">Alertes</div></div>
      </div>

      {progress.total > 0 ? (
        <ProgressBar value={progress.pct} label="Actions containment réalisées" valueLabel={`${progress.done}/${progress.total}`} tone={progress.pct >= 50 ? 'good' : undefined} />
      ) : (
        <div className="small muted">Aucune action de containment assignée</div>
      )}

      <div className="cell-card__foot">
        <span className="row" style={{ gap: 5 }}><FileText size={13} /> {cell.documents.length} document{cell.documents.length > 1 ? 's' : ''}</span>
        {lastActivity && <span className="nowrap">Dernière : {lastActivity}</span>}
      </div>
    </article>
  );
}
