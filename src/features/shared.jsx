import { NavLink } from 'react-router-dom';
import { ArrowRight, Download, ExternalLink, FileText, Users, Target, Quote } from 'lucide-react';
import { CellIcon } from '../components/common/CellIcon';
import { Card } from '../components/common/Card';
import { ProgressBar, UserAvatar } from '../components/common/Controls';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/States';
import { getCellMeta } from '../services/cellService';
import { documentUrl } from '../services/documentService';
import { formatBytes } from '../utils/format';

export function CellHero({ cell }) {
  return (
    <div className="cell-hero" style={{ '--cell-color': cell.color }}>
      <div className="cell-hero__top">
        <CellIcon cell={cell} size={22} />
        <div className="grow">
          <div className="page-header__eyebrow" style={{ marginBottom: 4 }}>Cellule · {cell.dataFolder}</div>
          <h1>{cell.fullName}</h1>
          <p className="secondary" style={{ marginTop: 6, maxWidth: 820 }}>{cell.mission}</p>
        </div>
        {cell.progress.total > 0 && (
          <div className="cell-hero__progress">
            <ProgressBar value={cell.progress.pct} label="Actions de containment faites" valueLabel={`${cell.progress.done}/${cell.progress.total}`} tone={cell.progress.pct >= 50 ? 'good' : undefined} />
            <div className="tiny muted" style={{ marginTop: 4 }}>Dérivé du plan de containment (soir J2)</div>
          </div>
        )}
      </div>
      <div className="cell-hero__meta">
        <div><UserAvatar name={cell.responsible?.name} size="sm" color={cell.color} /> {cell.responsible ? <>{cell.responsible.name} <span className="muted">· {cell.responsible.role}</span></> : 'Responsable : N/A'}</div>
        <div><Users size={14} /> {cell.members.length} membre{cell.members.length > 1 ? 's' : ''} cité{cell.members.length > 1 ? 's' : ''}</div>
        <div><FileText size={14} /> {cell.documents.length} document{cell.documents.length > 1 ? 's' : ''}</div>
        <div><Quote size={14} /> <span>{cell.headline} <span className="muted">— {cell.headlineSource}</span></span></div>
      </div>
      <nav className="tabs" style={{ marginTop: 16, marginBottom: -18, borderBottom: 'none' }} aria-label="Sections de la cellule">
        <NavLink end to={`/cellules/${cell.id}`} className="tab">Espace de la cellule</NavLink>
        <NavLink to={`/cellules/${cell.id}/activites`} className="tab">Activités</NavLink>
        <NavLink to={`/cellules/${cell.id}/statistiques`} className="tab">Statistiques</NavLink>
      </nav>
    </div>
  );
}

export function CellTeamCard({ cell }) {
  return (
    <Card title="Équipe" subtitle="Personnes nommées dans les documents de la cellule">
      {cell.members.length === 0 ? <EmptyState title="Aucun membre cité" /> : (
        <ul className="list">
          {cell.members.map((m) => (
            <li key={m.id} className="row" style={{ gap: 10 }}>
              <UserAvatar name={m.name} size="sm" color={m.lead ? cell.color : undefined} />
              <div className="grow">
                <div style={{ fontWeight: 500 }}>{m.name}</div>
                <div className="tiny muted">{m.role} · source : {m.source}</div>
              </div>
              {m.lead && <Badge tone="brand" size="sm">Référent</Badge>}
            </li>
          ))}
        </ul>
      )}
      {cell.members.length <= 1 && <p className="tiny muted" style={{ marginTop: 10 }}>Seul le répondant est nommé dans les sources pour cette cellule.</p>}
    </Card>
  );
}

export function CellDocumentsCard({ cell }) {
  return (
    <Card title="Documents de la cellule" subtitle={`${cell.documents.length} fichier(s) dans ${cell.dataFolder}`} flush>
      <ul className="list" style={{ padding: '0 18px 6px' }}>
        {cell.documents.map((d) => (
          <li key={d.id} className="row" style={{ gap: 10 }}>
            <span className="badge badge--outline badge--sm mono" style={{ textTransform: 'uppercase' }}>{d.type}</span>
            <div className="grow" style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</div>
              <div className="tiny muted">{d.kind} · {d.original} · {formatBytes(d.size)}</div>
            </div>
            <a className="btn btn--ghost btn--icon btn--sm" href={documentUrl(d)} target="_blank" rel="noreferrer" title="Ouvrir" aria-label={`Ouvrir ${d.title}`}>
              {d.type === 'pdf' ? <ExternalLink size={14} /> : <Download size={14} />}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function CellRelationsCard({ cell }) {
  return (
    <Card title="Relations avec les autres cellules" subtitle="Flux explicitement décrits dans les documents" actions={<NavLink to="/relations" className="btn btn--ghost btn--sm">Carte <ArrowRight size={13} /></NavLink>}>
      {cell.relations.length === 0 ? <EmptyState title="Aucune relation documentée" /> : (
        <ul className="list">
          {cell.relations.map((r, i) => {
            const other = getCellMeta(r.from === cell.id ? r.to : r.from);
            const outgoing = r.from === cell.id;
            return (
              <li key={i}>
                <div className="row" style={{ gap: 8 }}>
                  <Badge size="sm" tone={outgoing ? 'info' : 'neutral'}>{outgoing ? 'Vers' : 'Depuis'}</Badge>
                  <span className="cell-dot" style={{ background: other.color }} />
                  <strong style={{ fontWeight: 600 }}>{other.fullName}</strong>
                  <Badge size="sm" tone="outline" className="badge--outline">{r.kind}</Badge>
                </div>
                <div className="small secondary" style={{ marginTop: 4 }}>{r.label}</div>
                <div className="tiny muted">Source : {r.source}</div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

export function CellResponsibilities({ cell }) {
  return (
    <Card title="Rôle et responsabilités" subtitle="Synthèse des missions décrites dans les documents">
      <ul className="bullet-list">
        {cell.responsibilities.map((r) => <li key={r}>{r}</li>)}
      </ul>
      {cell.contribution && (
        <div className="callout" style={{ marginTop: 14 }}>
          <Target size={15} />
          <div><strong>Contribution attendue (Direction / Coordination) :</strong> {cell.contribution}</div>
        </div>
      )}
    </Card>
  );
}

export function CellOverviewFooter({ cell }) {
  return (
    <div className="grid grid-3" style={{ marginTop: 4 }}>
      <CellResponsibilities cell={cell} />
      <CellTeamCard cell={cell} />
      <CellRelationsCard cell={cell} />
      <div className="span-3"><CellDocumentsCard cell={cell} /></div>
    </div>
  );
}

export const cellLink = (id) => getCellMeta(id);
