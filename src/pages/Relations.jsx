import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Repeat } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { cellService, allCells, getCellMeta } from '../services/cellService';
import { PageHeader } from '../components/common/PageHeader';
import { AsyncContent } from '../components/common/States';
import { Card, Callout } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { CellIcon } from '../components/common/CellIcon';

// Disposition hexagonale fixe (en % du cadre) : Direction au centre-haut.
const POS = {
  direction: [50, 12], risque: [85, 34], communication: [85, 76], continuite: [50, 90], forensics: [15, 76], soc: [15, 34],
};

function RelationGraph({ relations, focus, onFocus }) {
  const active = (r) => !focus || r.from === focus || r.to === focus;
  return (
    <div className="rel-graph">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="rel-graph__svg" aria-hidden="true">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted)" />
          </marker>
        </defs>
        {relations.map((r, i) => {
          const [x1, y1] = POS[r.from];
          const [x2, y2] = POS[r.to];
          const mx = (x1 + x2) / 2 + (y2 - y1) * 0.08;
          const my = (y1 + y2) / 2 - (x2 - x1) * 0.08;
          return <path key={i} d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke={active(r) ? getCellMeta(r.from).color : 'var(--border)'} strokeWidth={active(r) ? 0.5 : 0.3} opacity={active(r) ? 0.9 : 0.4} vectorEffect="non-scaling-stroke" style={{ strokeWidth: active(r) ? 2 : 1 }} markerEnd="url(#arrow)" />;
        })}
      </svg>
      {allCells.map((c) => (
        <button key={c.id} type="button" className={`rel-node ${focus === c.id ? 'is-focus' : ''} ${focus && focus !== c.id ? 'is-dim' : ''}`} style={{ left: `${POS[c.id][0]}%`, top: `${POS[c.id][1]}%`, '--cell-color': c.color }} onClick={() => onFocus(focus === c.id ? null : c.id)}>
          <CellIcon cell={c} size={15} />
          <span>{c.fullName}</span>
        </button>
      ))}
    </div>
  );
}

export default function Relations() {
  const state = useAsync(() => cellService.relations(), []);
  const [focus, setFocus] = useState(null);
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Cellules', to: '/cellules' }, { label: 'Relations' }]}
        eyebrow="Organisation de crise"
        title="Relations entre les cellules"
        description="Uniquement les flux décrits explicitement dans les documents (demandes, retours, faits, validations, feu vert). Cliquez sur une cellule pour isoler ses liens."
      />
      <AsyncContent state={state}>
        {({ relations, rhythm }) => {
          const list = relations.filter((r) => !focus || r.from === focus || r.to === focus);
          return (
            <div className="stack">
              <Callout tone="info" icon={Repeat}>{rhythm}</Callout>
              <div className="grid grid-main-side">
                <Card title="Carte des flux" subtitle={focus ? `Liens de : ${getCellMeta(focus).fullName}` : `${relations.length} flux documentés`}>
                  <RelationGraph relations={relations} focus={focus} onFocus={setFocus} />
                </Card>
                <Card title="Flux documentés" subtitle={`${list.length} flux`} flush>
                  <ul className="list" style={{ padding: '0 18px 8px', maxHeight: 520, overflowY: 'auto' }}>
                    {list.map((r, i) => {
                      const a = getCellMeta(r.from);
                      const b = getCellMeta(r.to);
                      return (
                        <li key={i}>
                          <div className="row-wrap" style={{ gap: 6 }}>
                            <Link to={`/cellules/${a.id}`} className="row" style={{ gap: 5 }}><span className="cell-dot" style={{ background: a.color }} /><strong>{a.name}</strong></Link>
                            <span className="muted">→</span>
                            <Link to={`/cellules/${b.id}`} className="row" style={{ gap: 5 }}><span className="cell-dot" style={{ background: b.color }} /><strong>{b.name}</strong></Link>
                            <Badge size="sm" tone="outline" className="badge--outline">{r.kind}</Badge>
                          </div>
                          <div className="small secondary" style={{ marginTop: 4 }}>{r.label}</div>
                          <div className="tiny muted">{r.source}</div>
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              </div>
            </div>
          );
        }}
      </AsyncContent>
    </>
  );
}
