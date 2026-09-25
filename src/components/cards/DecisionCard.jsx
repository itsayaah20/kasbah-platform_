import { CheckCircle2, Circle, CornerDownRight } from 'lucide-react';
import { getCellMeta } from '../../services/cellService';
import { Badge } from '../common/Badge';

const TONE_COLOR = { good: 'var(--good-text)', warning: 'var(--warning-text)', critical: 'var(--critical-text)' };

// Décision tracée sur la plateforme : question, options, choix retenu et réactions reçues.
export function DecisionCard({ decision }) {
  const cell = getCellMeta(decision.cellId);
  return (
    <article className="decision-card">
      <header className="row between" style={{ alignItems: 'flex-start', gap: 10 }}>
        <div className="grow">
          <div className="row-wrap" style={{ gap: 6 }}>
            {decision.docRef && <span className="chip">{decision.docRef}</span>}
            <span className="mono small muted">{decision.day} {decision.time}</span>
            {cell && <span className="row small secondary" style={{ gap: 5 }}><span className="cell-dot" style={{ background: cell.color }} />{cell.name}</span>}
          </div>
          <h3 style={{ marginTop: 6, fontSize: 15 }}>{decision.title}</h3>
          <div className="tiny muted">Posée par {decision.askedBy}</div>
        </div>
        <Badge tone="brand" size="sm">Tracée</Badge>
      </header>
      <p className="small secondary" style={{ margin: '10px 0' }}>{decision.question}</p>
      <ul className="decision-card__options">
        {decision.options.map((o, i) => (
          <li key={o} className={i === decision.choice ? 'is-chosen' : ''}>
            {i === decision.choice ? <CheckCircle2 size={15} /> : <Circle size={15} />}
            <span>{o}</span>
            {i === decision.choice && <span className="tiny" style={{ marginLeft: 'auto', fontWeight: 600 }}>choix de la cellule</span>}
          </li>
        ))}
      </ul>
      {decision.note && <p className="tiny muted" style={{ marginTop: 8 }}>{decision.note}</p>}
      {decision.outcome?.length > 0 && (
        <div className="decision-card__outcome">
          {decision.outcome.map((o) => (
            <div key={o.at + o.from} className="row" style={{ alignItems: 'flex-start', gap: 8 }}>
              <CornerDownRight size={14} style={{ color: TONE_COLOR[o.tone], marginTop: 3, flexShrink: 0 }} />
              <div className="small"><strong style={{ fontWeight: 600 }}>{o.from}</strong> <span className="mono tiny muted">{o.at}</span><div className="secondary">{o.text}</div></div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
