import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard, ChartTooltip, axisProps, cursorProps } from './ChartKit';
import { Card } from '../common/Card';
import { formatDuration } from '../../utils/format';

const LEVEL_COLOR = { critique: 'var(--critical)', eleve: 'var(--serious)', moyen: 'var(--warning)', faible: 'var(--good)' };
const BAND_COLOR = { critique: 'var(--critical)', élevé: 'var(--serious)', moyen: 'var(--warning)', faible: 'var(--good)' };

// Jauge semi-circulaire 0–100 avec les bandes 0–25 / 25–50 / 50–75 / 75–100.
export function RiskGauge({ score, level, size = 220 }) {
  const r = 80;
  const cx = 100;
  const cy = 95;
  const arc = (from, to) => {
    const a0 = Math.PI * (1 - from / 100);
    const a1 = Math.PI * (1 - to / 100);
    return `M ${cx + r * Math.cos(a0)} ${cy - r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy - r * Math.sin(a1)}`;
  };
  const bands = [[0, 25, 'var(--good)'], [25, 50, 'var(--warning)'], [50, 75, 'var(--serious)'], [75, 100, 'var(--critical)']];
  const a = Math.PI * (1 - score / 100);
  return (
    <svg viewBox="0 0 200 118" width={size} role="img" aria-label={`Security Risk Score ${score} sur 100, niveau ${level}`}>
      {bands.map(([f, t, c]) => <path key={f} d={arc(f + 0.8, t - 0.8)} stroke={c} strokeWidth="14" fill="none" opacity="0.28" />)}
      <path d={arc(0.8, Math.max(1.6, score - 0.8))} stroke={BAND_COLOR[level]} strokeWidth="14" fill="none" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + (r - 22) * Math.cos(a)} y2={cy - (r - 22) * Math.sin(a)} stroke="var(--text-primary)" strokeWidth="3" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="5" fill="var(--text-primary)" />
      <text x={cx} y={cy - 26} textAnchor="middle" fontSize="30" fontWeight="700" fill="var(--text-primary)">{score}</text>
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize="11" fill="var(--text-muted)">/ 100 · {level}</text>
    </svg>
  );
}

export function RiskScoreCard({ risk }) {
  return (
    <Card title="Security Risk Score" subtitle={risk.method} footer={<span>Indice dérivé du registre : ce n’est pas un score fourni par les rapports.</span>}>
      <div className="row" style={{ gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        <RiskGauge score={risk.score} level={risk.level} />
        <div className="grow" style={{ minWidth: 220 }}>
          <div className="small muted" style={{ marginBottom: 6 }}>Contribution de chaque risque (points sur 100)</div>
          <div className="stack-sm" style={{ gap: 5 }}>
            {risk.contributions.map((c) => (
              <div key={c.id} className="row" style={{ gap: 8 }} title={c.title}>
                <span className="chip" style={{ width: 44, justifyContent: 'center' }}>{c.id}</span>
                <div className="progress grow" style={{ height: 8 }}><div className="progress__bar" style={{ width: `${(c.score / 16) * 100}%`, background: LEVEL_COLOR[c.level] }} /></div>
                <span className="mono tiny" style={{ width: 34, textAlign: 'right' }}>{String(c.points).replace('.', ',')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function LeadDurationChart({ mttr, height = 280 }) {
  // `ref` est renommé : Recharts transmet les champs des données comme props aux barres.
  const data = mttr.items.map(({ ref: piece, ...l }) => ({ ...l, piece, label: `${l.code} · ${piece}` }));
  return (
    <ChartCard
      title="Délai de résolution par piste écartée"
      subtitle={`Du premier message citant la pièce à la clôture · moyenne ${formatDuration(mttr.meanMin)}, médiane ${formatDuration(mttr.medianMin)}`}
      legend={[{ label: 'Clôturée le même jour', color: 'var(--series-1)' }, { label: 'Clôturée le lendemain', color: 'var(--series-2)' }]}
      table={{ columns: ['Piste', 'Pièce', 'Ouverte', 'Clôturée', 'Délai'], rows: mttr.items.map((l) => [l.code, l.ref, l.openedAt, l.closedAt, formatDuration(l.minutes)]) }}
      height={height}
    >
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 64, left: 8, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" {...axisProps} axisLine={false} width={96} />
          <Tooltip cursor={cursorProps} content={<ChartTooltip labelFormatter={(l, p) => `${l} — ${p?.[0]?.payload?.title}`} valueFormatter={(v) => formatDuration(v)} />} />
          <Bar dataKey="minutes" name="Délai" radius={[0, 4, 4, 0]} barSize={16}>
            {data.map((d) => <Cell key={d.code} fill={d.overnight ? 'var(--series-2)' : 'var(--series-1)'} />)}
            <LabelList dataKey="minutes" position="right" formatter={(v) => formatDuration(v)} style={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
