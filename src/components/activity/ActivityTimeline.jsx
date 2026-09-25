import { getCellMeta } from '../../services/cellService';
import { EvidenceChips, Badge } from '../common/Badge';

const STATUS_TONE = {
  Preuve: 'critical', 'Fausse piste': 'info', Bruit: 'neutral', 'À qualifier': 'warning',
  Fait: 'good', Bloqué: 'critical', 'À confirmer': 'warning', Décision: 'brand',
  Envoyé: 'good', Projet: 'warning', Remplacé: 'neutral', Déposé: 'neutral', Tracé: 'neutral',
  'À recouper': 'info', 'À traiter': 'warning', Attaquant: 'critical', Consigne: 'brand', 'Piste écartée': 'good',
  'Fin de journée': 'neutral', Rendu: 'brand', 'Rendu attendu': 'brand', Signal: 'warning', 'Pièce': 'info',
  'Pression externe': 'warning', 'Interne / partenaire': 'info',
};
const DOT_TONE = { critical: 'critical', warning: 'warning', good: 'good', info: 'info', brand: 'brand' };

// Timeline groupée par jour. items: [{ id, day, time, action, actor, cellId, status, details, evidence }]
export function ActivityTimeline({ items, showCell = true, showDetails = true, groupByDay = true }) {
  const groups = [];
  items.forEach((it) => {
    const key = groupByDay ? it.day || '—' : 'all';
    let g = groups.find((x) => x.key === key);
    if (!g) { g = { key, items: [] }; groups.push(g); }
    g.items.push(it);
  });

  return (
    <div>
      {groups.map((g) => (
        <div key={g.key}>
          {groupByDay && <div className="timeline-day">{g.key}</div>}
          <ol className="timeline">
            {g.items.map((it) => {
              const tone = STATUS_TONE[it.status] || 'neutral';
              const cell = showCell ? getCellMeta(it.cellId) : null;
              return (
                <li key={it.id} className="timeline__item">
                  <div className="timeline__when">
                    {it.time || '—'}
                    {it.dayInferred && <div className="tiny" title="Jour déduit de l’événement traité, pas d’horodatage dans la source">déduit</div>}
                  </div>
                  <div className="timeline__rail"><span className={`timeline__dot ${DOT_TONE[tone] ? `timeline__dot--${DOT_TONE[tone]}` : ''}`} /></div>
                  <div style={{ minWidth: 0 }}>
                    <div className="timeline__title">{it.action}</div>
                    <div className="timeline__meta">
                      {it.status && <Badge tone={tone} size="sm">{it.status}</Badge>}
                      <span>{it.actor}</span>
                      {cell && <span className="row" style={{ gap: 5 }}><span className="cell-dot" style={{ background: cell.color }} />{cell.name}</span>}
                      <EvidenceChips refs={it.evidence || []} max={4} />
                    </div>
                    {showDetails && it.details && <div className="timeline__text">{it.details}</div>}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
