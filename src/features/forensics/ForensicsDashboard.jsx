import { useState } from 'react';
import { Microscope, Lightbulb, Clock, FolderLock, Server, HelpCircle, GitCommitVertical, Users, AlertTriangle, CheckCircle2, XCircle, Quote, ImageIcon } from 'lucide-react';
import { Tabs, Segmented } from '../../components/common/Controls';
import { useTabParam } from '../../hooks/useMisc';
import { Card, Callout } from '../../components/common/Card';
import { HypothesisChart } from '../../components/charts/Widgets';
import { StatusBadge, VerdictBadge, EvidenceChips, Badge } from '../../components/common/Badge';
import { EvidenceModal } from '../../components/alerts/EvidenceModal';
import { StatCard } from '../../components/cards/StatCard';
import { CellOverviewFooter } from '../shared';
import { documentUrl } from '../../services/documentService';
import { documents } from '../../data/common/documents';

const STATUS_TONE = { Fait: 'critical', Bruit: 'neutral', Hypothèse: 'warning', 'À qualifier': 'info', 'Hypothèse réfutée': 'good', 'Hypothèse ouverte': 'warning' };
const ASSET_TONE = { Compromis: 'critical', 'Compromis, isolé': 'critical', 'Chiffrement actif': 'critical', Neutralisées: 'critical', Inconnu: 'warning', 'Non affecté': 'good', 'Non renseigné': 'neutral' };

function NightConvergence({ rows }) {
  const start = 110;
  const end = 290;
  const pct = (m) => ((m - start) / (end - start)) * 100;
  const ticks = [120, 150, 180, 210, 240, 270];
  const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  return (
    <div className="convergence" role="img" aria-label="Convergence des sources la nuit de J-1 entre 02h00 et 05h00">
      <div className="convergence__axis">
        {ticks.map((t) => <span key={t} style={{ left: `${pct(t)}%` }}>{fmt(t)}</span>)}
      </div>
      {rows.map((r) => (
        <div key={r.label} className="convergence__row">
          <div className="convergence__label">
            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.label}</div>
            <div className="tiny muted">{r.source}</div>
          </div>
          <div className="convergence__track">
            {ticks.map((t) => <i key={t} style={{ left: `${pct(t)}%` }} />)}
            <span
              className={`convergence__bar ${r.status === 'Hypothèse' ? 'is-hypothesis' : ''}`}
              style={{ left: `${pct(r.start)}%`, width: `max(6px, ${pct(r.end) - pct(r.start)}%)` }}
              title={`${fmt(r.start)} → ${fmt(r.end)} · ${r.note}`}
            />
          </div>
          <div className="convergence__note small">
            <StatusBadge size="sm" tone={r.status === 'Fait' ? 'critical' : 'warning'}>{r.status}</StatusBadge>
            <span className="muted">{r.note}</span>
          </div>
        </div>
      ))}
      <div className="convergence__marker" style={{ left: `calc(220px + (100% - 220px - 240px) * ${pct(195) / 100})` }}><span>03:15</span></div>
    </div>
  );
}

function Investigation({ data }) {
  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="grid grid-kpi">
        <StatCard label="Vecteur d’entrée" value="VPN" sub="svc_oasisnet, sans MFA, dès J-21" icon={Microscope} tone="critical" provenance="real" source="A-02" />
        <StatCard label="Hypothèse la plus probable" value="55 %" sub="Identifiants volés côté OasisNet" icon={Lightbulb} tone="warning" provenance="real" source="v3, section 6" />
        <StatCard label="Phases établies" value="3 / 5" sub="Accès, sabotage, impact : Fait" icon={CheckCircle2} tone="good" provenance="derived" />
        <StatCard label="Points ouverts" value={data.openPoints.length} sub="À demander, pas à supposer" icon={HelpCircle} tone="info" provenance="real" />
      </div>

      <Card title="Synthèse de la reconstitution" subtitle="hypothesis_v3.pdf, section 7" flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Phase</th><th>Statut</th><th>Appui</th></tr></thead>
            <tbody>{data.synthesis.map((s) => (
              <tr key={s.phase}><td className="strong">{s.phase}</td><td><StatusBadge size="sm" tone={STATUS_TONE[s.status]}>{s.status}</StatusBadge></td><td>{s.basis}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-2">
        <Card title={data.readingCorrection.title} subtitle="Section 3 — confrontation A-11 / A-01">
          <div className="compare">
            <div className="compare__col"><div className="mono" style={{ fontSize: 20, fontWeight: 600 }}>03:12</div><div className="small muted">J-1 · exécution Mirage.A (A-01)</div></div>
            <div className="compare__vs">avant</div>
            <div className="compare__col"><div className="mono" style={{ fontSize: 20, fontWeight: 600 }}>06:41</div><div className="small muted">J1 · réception du phishing (A-11)</div></div>
          </div>
          <p className="secondary small" style={{ marginTop: 12 }}>{data.readingCorrection.text}</p>
        </Card>
        <Card title="Décision : isolement de FIN-112" subtitle="Section 2.3 — validée par le Forensic (J1 15:05)">
          <div className="row" style={{ gap: 8, marginBottom: 10 }}><CheckCircle2 size={16} style={{ color: 'var(--good-text)' }} /><strong>{data.decisionFin112.choice}</strong></div>
          <blockquote className="quote"><Quote size={14} /> {data.decisionFin112.quote}</blockquote>
          <div className="small muted" style={{ marginTop: 10 }}>Options écartées :</div>
          <ul className="bullet-list small">{data.decisionFin112.rejected.map((r) => <li key={r}>{r}</li>)}</ul>
        </Card>
      </div>

      <Card title="Affirmations contredites par les preuves" subtitle="Section 4 — déclarations « à recouper », pas des constats">
        <div className="grid grid-2">
          {data.contradictions.map((c) => (
            <div key={c.who} className="card card--inset" style={{ padding: 14 }}>
              <div className="row" style={{ gap: 8 }}><XCircle size={15} style={{ color: 'var(--critical-text)' }} /><strong>{c.who}</strong></div>
              <p className="small secondary" style={{ marginTop: 8, fontStyle: 'italic' }}>{c.claim}</p>
              <p className="small" style={{ marginTop: 8 }}><span className="muted">Contredit par :</span> {c.refutedBy}</p>
              <div style={{ marginTop: 8 }}><EvidenceChips refs={c.evidence} /></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Hypotheses({ data }) {
  return (
    <div className="stack">
      <Callout tone="info" icon={Lightbulb} title="Méthode.">Hypothèses classées par confiance décroissante ; les pourcentages ne sont pas exclusifs et ne somment pas à 100. « Non confirmée » traduit un vide d’information, pas une conclusion.</Callout>
      <div className="grid grid-main-side">
        <HypothesisChart data={data.hypotheses.filter((h) => h.confidence != null)} height={300} />
        <Card title="Pistes physiques" subtitle="Badge, caméra, clés USB">
          <ul className="list">
            {data.hypotheses.filter((h) => ['H2', 'H6', 'H7', 'H8'].includes(h.id)).map((h) => (
              <li key={h.id}>
                <div className="row between"><strong style={{ fontWeight: 600 }}>{h.label}</strong><span className="mono">{h.confidence != null ? `${h.confidence} %` : 'n/d'}</span></div>
                <div className="small secondary" style={{ marginTop: 4 }}>{h.justification}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="grid grid-2">
        {data.hypotheses.map((h) => (
          <div key={h.id} className="card" style={{ padding: 16 }}>
            <div className="row between">
              <span className="row" style={{ gap: 8 }}><span className="chip">{h.id}</span><strong>{h.label}</strong></span>
              <StatusBadge size="sm" tone={h.status === 'ouverte' ? 'warning' : h.status === 'bruit' ? 'neutral' : 'info'}>{h.status === 'ouverte' ? 'Ouverte' : h.status === 'bruit' ? 'Bruit' : 'Non chiffrable'}</StatusBadge>
            </div>
            <div className="progress" style={{ margin: '12px 0 8px' }}><div className="progress__bar" style={{ width: `${h.confidence || 0}%`, background: 'var(--series-2)' }} /></div>
            <p className="small secondary">{h.justification}</p>
            {h.evidence.length > 0 && <div style={{ marginTop: 8 }}><EvidenceChips refs={h.evidence} /></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Chronology({ data }) {
  const [period, setPeriod] = useState('critical');
  const rows = period === 'critical' ? data.timelineCritical : data.timelineOverview;
  return (
    <div className="stack">
      <Card title="Convergence de la nuit de J-1" subtitle="Trois sources indépendantes sur la même fenêtre : ce n’est pas une preuve de lien, mais plus un hasard qu’on peut ignorer (v1)">
        <NightConvergence rows={data.nightConvergence} />
      </Card>
      <Card
        title="Frise chronologique — Survenue vs Signalée"
        subtitle="Survenue : horodatage technique · Signalée : prise de connaissance par la cellule · tri par survenue croissante"
        actions={<Segmented value={period} onChange={setPeriod} ariaLabel="Période" options={[{ value: 'critical', label: 'Fenêtre critique J-1 → J1' }, { value: 'overview', label: 'J-21 à J-1' }]} />}
        flush
      >
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Survenue</th><th>Signalée</th><th>Événement</th><th>Statut</th></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.event}>
                <td className="mono nowrap strong">{r.occurred}</td>
                <td className="mono nowrap">{r.reported}</td>
                <td>{r.event}</td>
                <td><StatusBadge size="sm" tone={STATUS_TONE[r.status]}>{r.status}</StatusBadge></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function EvidenceLocker({ data }) {
  const [verdict, setVerdict] = useState('all');
  const [open, setOpen] = useState(null);
  const items = data.evidence.filter((e) => verdict === 'all' || e.verdict === verdict);
  return (
    <div className="stack">
      <div className="filter-bar">
        <Segmented value={verdict} onChange={setVerdict} ariaLabel="Verdict" options={[
          { value: 'all', label: 'Toutes', count: data.evidence.length },
          { value: 'preuve', label: 'Preuves', count: data.evidence.filter((e) => e.verdict === 'preuve').length },
          { value: 'a-confirmer', label: 'À confirmer' },
          { value: 'fausse-piste', label: 'Fausses pistes' },
          { value: 'bruit', label: 'Bruit' },
        ]} />
      </div>
      <div className="locker">
        {items.map((e) => (
          <button key={e.ref} type="button" className="card card--interactive locker__item" onClick={() => setOpen(e)}>
            <div className="locker__thumb">
              {e.image ? <img src={`/evidence/${e.image}`} alt="" loading="lazy" /> : <span className="muted small row" style={{ gap: 6 }}><ImageIcon size={14} /> Sans capture</span>}
            </div>
            <div style={{ padding: 12 }}>
              <div className="row between"><span className="chip">{e.ref}</span><VerdictBadge verdict={e.verdict} size="sm" /></div>
              <div style={{ fontWeight: 600, marginTop: 8, textAlign: 'left' }}>{e.title}</div>
              <div className="tiny muted" style={{ marginTop: 4, textAlign: 'left' }}>{e.tool}</div>
              {e.sha256 && <div className="hash tiny" style={{ marginTop: 6, textAlign: 'left' }}>SHA-256 {e.sha256.slice(0, 16)}…</div>}
            </div>
          </button>
        ))}
      </div>
      <Card title="Preuves à préserver avant toute action" subtitle="Exigées par l’assureur cyber et utiles à une éventuelle plainte">
        <ul className="bullet-list">{data.preservation.map((p) => <li key={p}>{p}</li>)}</ul>
      </Card>
      <EvidenceModal evidence={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function AssetStates({ data }) {
  return (
    <div className="stack">
      <Callout tone="warning" icon={AlertTriangle} title="Ligne à surveiller.">La sauvegarde hors ligne non vérifiée était la seule ligne pouvant transformer l’incident en perte définitive. Mise à jour J3 12:12 : la copie LTO-9 de Settat est intacte (dernière copie J-42, jamais testée).</Callout>
      <Card title="État des actifs mentionnés dans les pièces" subtitle="Ni plus ni moins que ce que les pièces analysées établissent (v3, section 8)" flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Actif</th><th>État</th><th>Appui</th></tr></thead>
            <tbody>{data.assetStates.map((a) => (
              <tr key={a.asset}><td className="strong">{a.asset}</td><td><StatusBadge size="sm" tone={ASSET_TONE[a.state]}>{a.state}</StatusBadge>{a.update && <div style={{ marginTop: 4 }}><StatusBadge size="sm" tone="good">Mis à jour</StatusBadge></div>}</td><td>{a.basis}{a.update && <div className="small" style={{ marginTop: 4, color: 'var(--good-text)' }}>{a.update}</div>}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function OpenPoints({ data }) {
  return (
    <div className="grid grid-2">
      {data.openPoints.map((p, i) => (
        <div key={p.title} className="card" style={{ padding: 16 }}>
          <div className="row" style={{ gap: 8 }}><span className="chip">#{i + 1}</span><strong>{p.title}</strong></div>
          <p className="small secondary" style={{ marginTop: 8 }}>{p.detail}</p>
          {p.evidence.length > 0 && <div style={{ marginTop: 8 }}><EvidenceChips refs={p.evidence} /></div>}
        </div>
      ))}
    </div>
  );
}

function Versions({ data }) {
  return (
    <Card title="Historique du rapport d’investigation" subtitle="Trois versions déposées dans Data/forensics">
      <ol className="versions">
        {[...data.reportVersions].reverse().map((v, i) => {
          const doc = documents.find((d) => d.file === v.file);
          return (
            <li key={v.version} className="versions__item">
              <span className={`versions__dot ${i === 0 ? 'is-current' : ''}`} />
              <div className="grow">
                <div className="row between">
                  <span className="row" style={{ gap: 8 }}><strong>{v.version}</strong> {v.title} {i === 0 && <Badge tone="good" size="sm">Référence</Badge>}</span>
                  {doc && <a className="btn btn--sm" href={documentUrl(doc)} target="_blank" rel="noreferrer">Ouvrir le PDF</a>}
                </div>
                <div className="tiny muted">{v.file} · {v.date}</div>
                <ul className="bullet-list small" style={{ marginTop: 6 }}>{v.changes.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

export default function ForensicsDashboard({ cell, data }) {
  const [tab, setTab] = useTabParam('investigation');
  const tabs = [
    { id: 'investigation', label: 'Enquête', icon: Microscope },
    { id: 'hypotheses', label: 'Hypothèses', icon: Lightbulb, count: data.hypotheses.length },
    { id: 'chronologie', label: 'Chronologie', icon: Clock },
    { id: 'preuves', label: 'Casier à preuves', icon: FolderLock, count: data.evidence.length },
    { id: 'actifs', label: 'État des actifs', icon: Server },
    { id: 'ouverts', label: 'Points ouverts', icon: HelpCircle, count: data.openPoints.length },
    { id: 'versions', label: 'Versions', icon: GitCommitVertical },
    { id: 'team', label: 'Équipe & documents', icon: Users },
  ];
  return (
    <>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {tab === 'investigation' && <Investigation data={data} />}
      {tab === 'hypotheses' && <Hypotheses data={data} />}
      {tab === 'chronologie' && <Chronology data={data} />}
      {tab === 'preuves' && <EvidenceLocker data={data} />}
      {tab === 'actifs' && <AssetStates data={data} />}
      {tab === 'ouverts' && <OpenPoints data={data} />}
      {tab === 'versions' && <Versions data={data} />}
      {tab === 'team' && <CellOverviewFooter cell={cell} />}
    </>
  );
}
