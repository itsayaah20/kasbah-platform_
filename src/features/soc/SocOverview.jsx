import { ServerCrash, CloudUpload, Radio, Banknote, DatabaseBackup, Timer, Gauge, Filter, CircleSlash, Activity as ActivityIcon, HelpCircle } from 'lucide-react';
import { StatCard } from '../../components/cards/StatCard';
import { Card } from '../../components/common/Card';
import { ExfiltrationChart, VpnSessionsChart, ServerStateBar } from '../../components/charts/Widgets';
import { Badge } from '../../components/common/Badge';

const KPI_ICON = { servers: ServerCrash, exfil: CloudUpload, c2: Radio, fraud: Banknote, backup: DatabaseBackup, dwell: Timer, mttd: Gauge, triage: Filter, mttr: CircleSlash, score: CircleSlash };
const KPI_TONE = { servers: 'critical', exfil: 'critical', c2: 'critical', fraud: 'good', backup: 'warning', dwell: 'warning', mttd: 'info', triage: 'info' };

export function AttackSequence({ steps }) {
  return (
    <div className="kill-chain" role="list">
      {steps.map((s, i) => (
        <div key={s.time} className={`kill-chain__step ${s.technique === 'T1486' ? 'is-impact' : ''}`} role="listitem">
          <div className="kill-chain__time mono">{s.time}</div>
          <div className="kill-chain__node"><span>{i + 1}</span></div>
          <div className="kill-chain__label">{s.step}</div>
          <div className="kill-chain__event">{s.event}</div>
          <div className="row-wrap" style={{ justifyContent: 'center', gap: 4 }}>
            <span className="tiny muted">{s.source}</span>
            {s.technique && <span className="chip">{s.technique}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SocOverview({ data }) {
  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="grid grid-kpi">
        {data.kpis.map((k) => (
          <StatCard key={k.id} label={k.label} value={k.value} sub={k.sub} icon={KPI_ICON[k.id]} tone={KPI_TONE[k.id]} provenance={k.provenance} source={k.source} />
        ))}
      </div>

      <Card title="Phases de réponse" subtitle="Enquête Mirage — AtlasGrid (synthèse J2)">
        <div className="phase-track">
          {data.phases.map((p, i) => (
            <div key={p} className="phase-track__item">
              <span className="phase-track__n">{i + 1}</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="La nuit de J-1, seconde par seconde" subtitle="index=wineventlog Account=svc_oasisnet OR admin_local · Splunk ES (A-10) + chronologie Defender (A-12)">
        <AttackSequence steps={data.attackSequence} />
        <p className="tiny muted" style={{ marginTop: 12 }}>La centralisation SIEM a survécu à l’effacement local du journal (événement 1102 à 03:16).</p>
      </Card>

      <div className="grid grid-2">
        <ExfiltrationChart data={data.exfiltration} />
        <VpnSessionsChart data={data.vpnSessions} height={260} />
      </div>

      <div className="grid grid-3">
        <Card title="Compte svc_oasisnet" subtitle="Profil attendu contre observé (A-02, A-10)" flush>
          <div className="table-wrap">
            <table className="table table--compact">
              <thead><tr><th>Critère</th><th>Attendu</th><th>Observé</th></tr></thead>
              <tbody>
                {data.accountProfile.map((r) => (
                  <tr key={r.criterion}><td className="strong">{r.criterion}</td><td>{r.expected}</td><td><span style={{ color: 'var(--critical-text)' }}>{r.observed}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Canal C2" subtitle="Pare-feu FGT-RBT-01 (A-09) · proxy (A-03)">
          <dl className="kv">
            <dt>Règle</dt><dd><span className="chip">{data.c2.rule}</span> créée {data.c2.createdAt}</dd>
            <dt>Balise</dt><dd>{data.c2.beacon}</dd>
            <dt>Sessions</dt><dd className="num">{data.c2.sessions.toLocaleString('fr-FR')} ({data.c2.period})</dd>
            <dt>Destination</dt><dd className="mono">{data.exfilMeta.destination}</dd>
            <dt>SNI</dt><dd className="mono">{data.exfilMeta.sni}</dd>
            <dt>JA3</dt><dd className="mono">{data.exfilMeta.ja3}</dd>
            <dt>Catégorie proxy</dt><dd>{data.exfilMeta.category}</dd>
          </dl>
        </Card>
        <Card title="Questions ouvertes" subtitle="Bilan du fil SOC, J2 15:21">
          <ul className="list">
            {data.openQuestions.map((q) => (
              <li key={q} className="row" style={{ alignItems: 'flex-start', gap: 8 }}>
                <HelpCircle size={15} style={{ color: 'var(--warning-text)', flexShrink: 0, marginTop: 2 }} />
                <span className="small">{q}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Parc serveurs" subtitle="Inventaire SCCM (A-13) · J2 10:00" footer={<span>{data.servers.note}</span>}>
        <ServerStateBar servers={data.servers} />
        <div className="row-wrap" style={{ marginTop: 12 }}>
          <ActivityIcon size={14} className="muted" />
          <span className="small muted">Ce qui dépendait du domaine est tombé ; ce qui en était séparé (site public, OT) a tenu.</span>
          <Badge tone="outline" className="badge--outline" size="sm">A-13</Badge>
        </div>
      </Card>
    </div>
  );
}
