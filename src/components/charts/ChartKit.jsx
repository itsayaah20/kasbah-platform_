import { useState } from 'react';
import { BarChart3, Table2 } from 'lucide-react';
import { Card } from '../common/Card';

// Carte de graphique : titre, légende, bascule vers une vue tableau (accessibilité).
export function ChartCard({ title, subtitle, legend, children, table, footer, actions, height = 260 }) {
  const [asTable, setAsTable] = useState(false);
  return (
    <Card
      title={title}
      subtitle={subtitle}
      footer={footer}
      actions={(
        <>
          {actions}
          {table && (
            <button type="button" className="btn btn--ghost btn--icon btn--sm" onClick={() => setAsTable((v) => !v)} title={asTable ? 'Voir le graphique' : 'Voir les données'} aria-label={asTable ? 'Voir le graphique' : 'Voir les données'}>
              {asTable ? <BarChart3 size={15} /> : <Table2 size={15} />}
            </button>
          )}
        </>
      )}
    >
      {legend && !asTable && <div style={{ marginBottom: 10 }}><Legend items={legend} /></div>}
      {asTable && table ? (
        <div className="table-wrap" style={{ maxHeight: height + 30, overflowY: 'auto' }}>
          <table className="table table--compact">
            <thead><tr>{table.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>{table.rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j} className="num">{v}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : (
        <div style={{ width: '100%', height }}>{children}</div>
      )}
    </Card>
  );
}

export function Legend({ items }) {
  return (
    <div className="chart-legend">
      {items.map((it) => (
        <span key={it.label} className="chart-legend__item">
          <span className="chart-legend__swatch" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

export function ChartTooltip({ active, payload, label, unit = '', labelFormatter, valueFormatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__title">{labelFormatter ? labelFormatter(label, payload) : label}</div>
      {payload.map((p) => (
        <div key={p.dataKey || p.name} className="chart-tooltip__row">
          <span className="row" style={{ gap: 6 }}>
            <span className="chart-legend__swatch" style={{ background: p.color || p.payload?.fill }} />
            {p.name}
          </span>
          <strong>{valueFormatter ? valueFormatter(p.value, p) : `${p.value}${unit}`}</strong>
        </div>
      ))}
    </div>
  );
}

// Props communes Recharts : grille et axes discrets.
export const axisProps = { tickLine: false, axisLine: { stroke: 'var(--grid)' }, tick: { fill: 'var(--axis)', fontSize: 11 } };
export const gridProps = { stroke: 'var(--grid)', strokeDasharray: '0', vertical: false };
export const cursorProps = { fill: 'var(--surface-hover)' };
