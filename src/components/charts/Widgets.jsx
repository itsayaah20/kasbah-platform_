import {
  Bar, BarChart, CartesianGrid, Cell, Line, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis, LabelList,
} from 'recharts';
import { ChartCard, ChartTooltip, axisProps, gridProps, cursorProps, Legend } from './ChartKit';
import { nf1 } from '../../utils/format';
import { getCellMeta } from '../../services/cellService';

const fr = (v) => nf1.format(v);

export const STATUS_COLORS = { fait: 'var(--good)', 'en-cours': 'var(--info)', 'a-faire': 'var(--neutral)', 'a-confirmer': 'var(--warning)', bloque: 'var(--critical)' };
export const VERDICT_COLORS = { preuve: 'var(--series-1)', 'fausse-piste': 'var(--series-2)', bruit: 'var(--neutral)' };
const SOURCE_COLORS = { 'FIN-112': 'var(--series-1)', 'FILER-RBT': 'var(--series-2)' };

export function ExfiltrationChart({ data, height = 260 }) {
  return (
    <ChartCard
      title="Exfiltration nocturne par nuit"
      subtitle="Go envoyés vers 45.137.184.62 · proxy Zscaler (A-03) · total 117,8 Go"
      legend={[{ label: 'Source FIN-112', color: SOURCE_COLORS['FIN-112'] }, { label: 'Source FILER-RBT', color: SOURCE_COLORS['FILER-RBT'] }]}
      table={{ columns: ['Nuit', 'Fenêtre', 'Source', 'Go', 'Cumul'], rows: data.map((d) => [d.day, d.window, d.source, fr(d.gb), d.cumulative != null ? fr(d.cumulative) : '—']) }}
      height={height}
    >
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="day" {...axisProps} />
          <YAxis yAxisId="gb" {...axisProps} width={44} tickFormatter={(v) => `${v}`} />
          <Tooltip cursor={cursorProps} content={<ChartTooltip labelFormatter={(l, p) => `${l} · ${p?.[0]?.payload?.window} · ${p?.[0]?.payload?.source}`} valueFormatter={(v) => `${fr(v)} Go`} />} />
          <Bar yAxisId="gb" dataKey="gb" name="Volume" radius={[4, 4, 0, 0]} maxBarSize={28}>
            {data.map((d) => <Cell key={d.day} fill={SOURCE_COLORS[d.source]} />)}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CumulativeExfilChart({ data, height = 220 }) {
  return (
    <ChartCard title="Volume exfiltré cumulé" subtitle="Go cumulés de J-10 à J-1 (A-03)" height={height}
      table={{ columns: ['Nuit', 'Cumul (Go)'], rows: data.map((d) => [d.day, fr(d.cumulative)]) }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 16, right: 16, left: -12, bottom: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="day" {...axisProps} />
          <YAxis {...axisProps} width={44} />
          <Tooltip content={<ChartTooltip valueFormatter={(v) => `${fr(v)} Go`} />} />
          <Line type="monotone" dataKey="cumulative" name="Cumul" stroke="var(--series-1)" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: 'var(--surface-1)' }} activeDot={{ r: 5 }}>
            <LabelList dataKey="cumulative" position="top" formatter={(v) => (v === 117.8 ? '117,8 Go' : '')} style={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function VpnSessionsChart({ data, height = 220 }) {
  return (
    <ChartCard title="Sessions VPN svc_oasisnet" subtitle="Go sortants par session · FortiGate (A-02) · 8/8 sans MFA" height={height}
      legend={[{ label: '196.200.114.41', color: 'var(--series-7)' }, { label: '102.118.53.17', color: 'var(--series-3)' }]}
      table={{ columns: ['Jour', 'Plage', 'IP source', 'MFA', 'Go'], rows: data.map((d) => [d.day, d.window, d.srcIp, 'non', fr(d.outGb)]) }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="day" {...axisProps} />
          <YAxis {...axisProps} width={40} tickFormatter={(v) => fr(v)} />
          <Tooltip cursor={cursorProps} content={<ChartTooltip labelFormatter={(l, p) => `${l} · ${p?.[0]?.payload?.window} · ${p?.[0]?.payload?.srcIp}`} valueFormatter={(v) => `${fr(v)} Go`} />} />
          <Bar dataKey="outGb" name="Sortant" radius={[4, 4, 0, 0]} maxBarSize={26}>
            {data.map((d) => <Cell key={d.day} fill={d.srcIp.startsWith('196') ? 'var(--series-7)' : 'var(--series-3)'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ServerStateBar({ servers }) {
  const parts = [
    { key: 'encrypted', label: 'Chiffrés', value: servers.encrypted, color: 'var(--critical)' },
    { key: 'partial', label: 'Partiels', value: servers.partial, color: 'var(--serious)' },
    { key: 'intact', label: 'Intacts cités', value: servers.intactCited, color: 'var(--good)' },
    { key: 'nd', label: 'Non détaillés', value: servers.notDetailed, color: 'var(--surface-3)' },
  ];
  return (
    <div className="stack-sm">
      <div className="segmented-bar" style={{ height: 14 }} role="img" aria-label={parts.map((p) => `${p.label} ${p.value}`).join(', ')}>
        {parts.map((p) => <span key={p.key} style={{ width: `${(p.value / servers.total) * 100}%`, background: p.color }} title={`${p.label} : ${p.value}`} />)}
      </div>
      <div className="grid grid-4" style={{ gap: 8 }}>
        {parts.map((p) => (
          <div key={p.key}>
            <div className="row small secondary" style={{ gap: 6 }}><span className="chart-legend__swatch" style={{ background: p.color, border: p.key === 'nd' ? '1px solid var(--border-strong)' : undefined }} />{p.label}</div>
            <div style={{ fontSize: 20, fontWeight: 650 }} className="num">{p.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivityByCellChart({ data, height = 240, title = 'Activités par cellule', subtitle = 'Main courante, fil SOC, messages, décisions et documents' }) {
  const rows = data.map((d) => ({ ...d, color: getCellMeta(d.cellId)?.color }));
  return (
    <ChartCard title={title} subtitle={subtitle} height={height}
      table={{ columns: ['Cellule', 'Nombre'], rows: rows.map((r) => [r.name, r.count]) }}>
      <ResponsiveContainer>
        <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 32, left: 8, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" {...axisProps} axisLine={false} width={120} />
          <Tooltip cursor={cursorProps} content={<ChartTooltip />} />
          <Bar dataKey="count" name="Activités" radius={[0, 4, 4, 0]} barSize={16}>
            {rows.map((r) => <Cell key={r.cellId} fill={r.color} />)}
            <LabelList dataKey="count" position="right" style={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ActionStatusChart({ data, height = 260 }) {
  const keys = [
    { key: 'fait', label: 'Fait' }, { key: 'en-cours', label: 'En cours' }, { key: 'a-confirmer', label: 'À confirmer' },
    { key: 'a-faire', label: 'À faire' }, { key: 'bloque', label: 'Bloqué' },
  ];
  const short = (g) => g.split(' — ')[0].replace('Continuité pendant le containment', 'Modes dégradés').replace('Préparation de la reprise', 'Reprise').replace('Communication et obligations', 'Communication');
  const rows = data.map((d) => ({ ...d, name: short(d.group) }));
  return (
    <ChartCard title="Avancement du plan de containment" subtitle="Actions par lot et par statut · situation au soir de J2" height={height}
      legend={keys.map((k) => ({ label: k.label, color: STATUS_COLORS[k.key] }))}
      table={{ columns: ['Lot', ...keys.map((k) => k.label)], rows: rows.map((r) => [r.name, ...keys.map((k) => r[k.key])]) }}>
      <ResponsiveContainer>
        <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }} barCategoryGap={10}>
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis type="category" dataKey="name" {...axisProps} axisLine={false} width={110} />
          <Tooltip cursor={cursorProps} content={<ChartTooltip />} />
          {keys.map((k, i) => (
            <Bar key={k.key} dataKey={k.key} name={k.label} stackId="s" fill={STATUS_COLORS[k.key]} stroke="var(--surface-1)" strokeWidth={2} radius={i === keys.length - 1 ? [0, 4, 4, 0] : 0} barSize={18} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function VerdictChart({ data, height = 220 }) {
  const keys = [{ key: 'preuve', label: 'Preuve' }, { key: 'fausse-piste', label: 'Fausse piste' }, { key: 'bruit', label: 'Bruit' }];
  return (
    <ChartCard title="Verdicts des fiches de traçabilité" subtitle="21 fiches · 9 preuves, 8 bruits, 4 fausses pistes" height={height}
      legend={keys.map((k) => ({ label: k.label, color: VERDICT_COLORS[k.key] }))}
      table={{ columns: ['Jour', ...keys.map((k) => k.label)], rows: data.map((d) => [d.day, ...keys.map((k) => d[k.key])]) }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="day" {...axisProps} />
          <YAxis {...axisProps} allowDecimals={false} width={36} />
          <Tooltip cursor={cursorProps} content={<ChartTooltip />} />
          {keys.map((k) => <Bar key={k.key} dataKey={k.key} name={k.label} fill={VERDICT_COLORS[k.key]} radius={[4, 4, 0, 0]} maxBarSize={30} />)}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function HypothesisChart({ data, height = 260 }) {
  return (
    <ChartCard title="Degré de confiance par hypothèse" subtitle="Cellule d’investigation (v3) · pourcentages non exclusifs" height={height}
      table={{ columns: ['Hypothèse', 'Confiance'], rows: data.map((h) => [h.label, `${h.confidence} %`]) }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 36, left: 8, bottom: 0 }}>
          <XAxis type="number" hide domain={[0, 100]} />
          <YAxis type="category" dataKey="label" {...axisProps} axisLine={false} width={190} tick={{ fill: 'var(--axis)', fontSize: 11 }} />
          <Tooltip cursor={cursorProps} content={<ChartTooltip unit=" %" />} />
          <Bar dataKey="confidence" name="Confiance" fill="var(--series-2)" radius={[0, 4, 4, 0]} barSize={14}>
            <LabelList dataKey="confidence" position="right" formatter={(v) => `${v} %`} style={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RiskScoreChart({ data, height = 260 }) {
  const color = { critique: 'var(--critical)', eleve: 'var(--serious)', moyen: 'var(--warning)', faible: 'var(--good)' };
  return (
    <ChartCard title="Criticité des risques (P × I)" subtitle="Tableau de risques R1–R11 · ≥ 12 critique · 8–11 élevé · 4–7 moyen" height={height}
      legend={[{ label: 'Critique', color: color.critique }, { label: 'Élevé', color: color.eleve }, { label: 'Moyen', color: color.moyen }]}
      table={{ columns: ['Risque', 'P', 'I', 'Criticité'], rows: data.map((r) => [`${r.id} ${r.title}`, r.p, r.i, r.score]) }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 16, right: 8, left: -4, bottom: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="id" {...axisProps} />
          <YAxis {...axisProps} domain={[0, 16]} ticks={[0, 4, 8, 12, 16]} width={36} />
          <Tooltip cursor={cursorProps} content={<ChartTooltip labelFormatter={(l, p) => `${l} — ${p?.[0]?.payload?.title}`} />} />
          <Bar dataKey="score" name="Criticité" radius={[4, 4, 0, 0]} maxBarSize={26}>
            {data.map((r) => <Cell key={r.id} fill={color[r.level]} />)}
            <LabelList dataKey="score" position="top" style={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function MitreTacticChart({ data, height = 220 }) {
  return (
    <ChartCard title="Techniques ATT&CK par tactique" subtitle="13 techniques citées, 10 dans la chaîne MIRAGE" height={height}
      legend={[{ label: 'Dans la chaîne', color: 'var(--series-1)' }, { label: 'Hors chaîne', color: 'var(--neutral)' }]}
      table={{ columns: ['Tactique', 'Techniques'], rows: data.map((d) => [d.tactic, d.count]) }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="tactic" {...axisProps} interval={0} tick={{ fill: 'var(--axis)', fontSize: 10.5 }} />
          <YAxis {...axisProps} allowDecimals={false} width={36} />
          <Tooltip cursor={cursorProps} content={<ChartTooltip />} />
          <Bar dataKey="count" name="Techniques" radius={[4, 4, 0, 0]} maxBarSize={36}>
            {data.map((d) => <Cell key={d.tactic} fill={d.inChain ? 'var(--series-1)' : 'var(--neutral)'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function AlertsByCellChart({ data, height = 240 }) {
  const keys = [
    { key: 'critical', label: 'Critique', color: 'var(--critical)' }, { key: 'warning', label: 'Avertissement', color: 'var(--warning)' },
    { key: 'info', label: 'Information', color: 'var(--info)' }, { key: 'success', label: 'Résolu', color: 'var(--good)' },
  ];
  return (
    <ChartCard title="Alertes par cellule et sévérité" subtitle="Alertes dérivées des signaux, échéances et obligations" height={height}
      legend={keys.map((k) => ({ label: k.label, color: k.color }))}
      table={{ columns: ['Cellule', ...keys.map((k) => k.label)], rows: data.map((d) => [d.name, ...keys.map((k) => d[k.key])]) }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis type="category" dataKey="name" {...axisProps} axisLine={false} width={120} />
          <Tooltip cursor={cursorProps} content={<ChartTooltip />} />
          {keys.map((k, i) => <Bar key={k.key} dataKey={k.key} name={k.label} stackId="a" fill={k.color} stroke="var(--surface-1)" strokeWidth={2} barSize={16} radius={i === keys.length - 1 ? [0, 4, 4, 0] : 0} />)}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export { Legend };
