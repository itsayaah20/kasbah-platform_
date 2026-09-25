import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Send, Map, GitFork, Gavel, BookOpen, Users, Clock3, Inbox, Lock, FileText, ArrowRight, Flag } from 'lucide-react';
import { Tabs, Segmented, ProgressBar, UserAvatar } from '../../components/common/Controls';
import { useTabParam } from '../../hooks/useMisc';
import { Card, Callout } from '../../components/common/Card';
import { StatusBadge, ActionStatusBadge, Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/cards/StatCard';
import { DataTable } from '../../components/tables/DataTable';
import { ActivityTimeline } from '../../components/activity/ActivityTimeline';
import { CellOverviewFooter } from '../shared';
import { getCellMeta, cellProgress } from '../../services/cellService';
import { CRITICITY_LEVELS, ASSET_STATES } from '../../data/common/assets';
import { documents } from '../../data/common/documents';
import { documentUrl } from '../../services/documentService';
import { useAlerts } from '../../context/AlertsContext';
import { DecisionCard } from '../../components/cards/DecisionCard';

const CRIT_TONE = { C1: 'critical', C2: 'serious', C3: 'warning', C4: 'good' };

function RegisterCard({ d }) {
  return (
    <div className={`decision ${d.status === 'bloque' ? 'is-blocked' : ''}`}>
      <div className="row between">
        <span className="row" style={{ gap: 8 }}><span className="chip">{d.id}</span><span className="mono small muted">{d.when}</span></span>
        <ActionStatusBadge status={d.status} size="sm" />
      </div>
      <div style={{ fontWeight: 600, marginTop: 8 }}>{d.subject}</div>
      <div className="small" style={{ marginTop: 4 }}><span className="muted">Choix :</span> {d.choice}</div>
      <div className="small secondary" style={{ marginTop: 6 }}>{d.rationale}</div>
      {d.options && (
        <div className="row-wrap" style={{ marginTop: 10 }}>
          {d.options.map((o) => <Badge key={o} tone="outline" className="badge--outline" size="sm">{o}</Badge>)}
        </div>
      )}
    </div>
  );
}

function Command({ data }) {
  const { alerts } = useAlerts();
  const blocked = data.decisions.filter((d) => d.status === 'bloque').length;
  const replies = data.cellRequests.filter((r) => r.reply).length;
  const critical = alerts.filter((a) => a.severity === 'critical' && !a.archived && !a.read).length;
  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="grid grid-kpi">
        <StatCard label="Décisions tracées" value={data.cellDecisions.length} sub={`Plateforme · registre D1–D5 : ${blocked} bloquée`} icon={Gavel} tone="info" provenance="real" source="KASBAH · Cellule.pdf" />
        <StatCard label="Retours à la note DC/2026/01" value={replies} unit="/ 5" sub="Retour identifié dans le dossier" icon={Inbox} tone="warning" provenance="derived" />
        <StatCard label="Décision bloquante" value="D5" sub="Rançon : temporisation, 40 BTC avant J3 minuit" icon={Lock} tone="critical" provenance="real" />
        <StatCard label="Alertes critiques non lues" value={critical} sub="Toutes cellules" icon={Flag} tone="critical" provenance="derived" />
      </div>

      <div className="grid grid-main-side">
        <Card title="Situation à consolider" subtitle={`Note ${data.coordinationNote.ref} · ${data.coordinationNote.date}`} flush>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Élément</th><th>Ce que nous savons</th><th>À préciser</th></tr></thead>
              <tbody>{data.coordinationNote.situation.map((s) => <tr key={s.element}><td className="strong">{s.element}</td><td className="small">{s.known}</td><td className="small">{s.toClarify}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
        <Card title="Arbitrages à préparer" subtitle="Consolidation avec Aya Belkhaouad">
          <ul className="list">{data.coordinationNote.consolidationTopics.map((t) => <li key={t} className="row" style={{ gap: 8 }}><ArrowRight size={14} className="muted" />{t}</li>)}</ul>
          <Callout tone="info" icon={FileText}>{data.coordinationNote.caveat}</Callout>
        </Card>
      </div>

      <div>
        <div className="section-title"><h2>Registre des décisions</h2></div>
        <div className="grid grid-3">{data.decisions.map((d) => <RegisterCard key={d.id} d={d} />)}</div>
      </div>

      <div className="grid grid-2">
        <Card title="Échéances" subtitle="Plan de containment" flush>
          <ul className="list" style={{ padding: '0 18px 8px' }}>
            {data.deadlines.map((d) => (
              <li key={d.id} className="row between" style={{ gap: 10 }}>
                <div><div style={{ fontWeight: 500 }}>{d.object}</div><div className="small muted row" style={{ gap: 5 }}><Clock3 size={12} />{d.when}</div></div>
                <ActionStatusBadge status={d.status} size="sm" />
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Priorités proposées aux cellules" subtitle="Cartographie, page 7">
          <ol className="numbered">{data.priorities.map((p) => <li key={p}>{p}</li>)}</ol>
          <p className="small secondary" style={{ marginTop: 10 }}>La présence de deux contrôleurs de domaine ou de plusieurs copies de sauvegarde ne suffit pas, à elle seule, à garantir la continuité.</p>
        </Card>
      </div>
    </div>
  );
}

function CellTracking({ data }) {
  return (
    <div className="stack">
      <Callout tone="info" icon={Send}>La note {data.coordinationNote.ref} demande à chaque cellule un premier état de situation. Seul le retour Risque / Conformité est explicitement identifié comme réponse dans le dossier ; les autres cellules ont produit des documents sans les présenter comme réponse à la note.</Callout>
      <div className="grid grid-2">
        {data.cellRequests.map((r) => {
          const cell = getCellMeta(r.cellId);
          const progress = cellProgress(r.cellId);
          const reply = r.reply ? documents.find((d) => d.id === r.reply.doc) : null;
          const produced = documents.filter((d) => d.cellId === r.cellId);
          return (
            <div key={r.cellId} className="card" style={{ padding: 16, borderTop: `3px solid ${cell.color}` }}>
              <div className="row between">
                <Link to={`/cellules/${r.cellId}`} className="row" style={{ gap: 8 }}><span className="cell-dot" style={{ background: cell.color }} /><strong>{cell.fullName}</strong></Link>
                {reply ? <StatusBadge tone="good" size="sm">Retour reçu {r.reply.when}</StatusBadge> : <StatusBadge tone="neutral" size="sm">Aucun retour identifié</StatusBadge>}
              </div>
              <div className="row small" style={{ gap: 6, marginTop: 8 }}><UserAvatar name={r.respondent} size="sm" /> {r.respondent}</div>
              <div className="small" style={{ marginTop: 10 }}><span className="muted">Attendu :</span> {r.expected}</div>
              <ul className="bullet-list small" style={{ marginTop: 8 }}>{r.items.map((i) => <li key={i}>{i}</li>)}</ul>
              {progress.total > 0 && <div style={{ marginTop: 12 }}><ProgressBar value={progress.pct} label="Actions containment faites" valueLabel={`${progress.done}/${progress.total}`} /></div>}
              <div className="row-wrap" style={{ marginTop: 12 }}>
                {reply && <a className="btn btn--sm" href={documentUrl(reply)} target="_blank" rel="noreferrer"><FileText size={13} /> Lire le retour</a>}
                <span className="tiny muted">{produced.length} document(s) produit(s) par la cellule</span>
              </div>
            </div>
          );
        })}
      </div>
      <Card title="Format commun de réponse" subtitle="Imposé par la note DC/2026/01" flush>
        <div className="table-wrap">
          <table className="table"><thead><tr><th>Rubrique</th><th>Informations attendues</th></tr></thead>
            <tbody>{data.coordinationNote.responseFormat.map((f) => <tr key={f.section}><td className="strong">{f.section}</td><td>{f.expected}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Cartography({ data }) {
  const [level, setLevel] = useState('all');
  const columns = [
    { key: 'label', header: 'Actif', render: (r) => <><strong>{r.label}</strong><div className="tiny muted mono">{r.name}</div></> },
    { key: 'criticity', header: 'Niveau', render: (r) => <StatusBadge tone={CRIT_TONE[r.criticity]} size="sm">{r.criticity}</StatusBadge> },
    { key: 'zone', header: 'Zone' },
    { key: 'state', header: 'État constaté', sortValue: (r) => r.state || 'zz', render: (r) => (r.state ? <StatusBadge size="sm" tone={ASSET_STATES[r.state].tone}>{ASSET_STATES[r.state].label}</StatusBadge> : <span className="muted">N/A</span>) },
    { key: 'justification', header: 'Justification' },
  ];
  return (
    <div className="stack" style={{ gap: 20 }}>
      <Card title="Cartographie simplifiée du SI" subtitle="Zones fonctionnelles — les pointillés (*) signalent les liens ou périmètres à vérifier">
        <div className="si-map">
          {data.siZones.map((z) => (
            <div key={z.id} className={`si-zone si-zone--${z.tone}`}>
              <div className="si-zone__title">{z.label}</div>
              <ul>{z.items.map((i) => <li key={i} className="mono small">{i}</li>)}</ul>
              <div className="tiny muted">{z.note}</div>
            </div>
          ))}
        </div>
        <p className="tiny muted" style={{ marginTop: 10 }}>Cartographie fonctionnelle : les zones ne correspondent pas nécessairement à des segments réseau configurés. Le site public WordPress est hébergé à l’extérieur, sans dépendance documentée avec la production.</p>
      </Card>
      <div className="grid grid-4">
        {Object.entries(CRITICITY_LEVELS).map(([k, v]) => (
          <button key={k} type="button" className={`card card--interactive crit-card ${level === k ? 'is-active' : ''}`} onClick={() => setLevel(level === k ? 'all' : k)}>
            <StatusBadge tone={CRIT_TONE[k]} size="sm">{k}</StatusBadge>
            <div style={{ fontWeight: 600, marginTop: 8 }}>{v.label.split(' — ')[1]}</div>
            <div className="tiny muted">{v.desc}</div>
            <div className="num" style={{ fontSize: 22, fontWeight: 650, marginTop: 6 }}>{data.assets.filter((a) => a.criticity === k).length}</div>
          </button>
        ))}
      </div>
      <Card flush title="Actifs critiques et justification" subtitle="Critères : impact de l’arrêt, nombre de services dépendants, utilité pour la reprise">
        <DataTable rows={data.assets} columns={columns} rowKey={(r) => r.id} filters={{ criticity: level }} pageSize={15} exportName="criticite-actifs" initialSort={{ key: 'criticity', dir: 'asc' }} />
      </Card>
    </div>
  );
}

function Dependencies({ data }) {
  return (
    <div className="grid grid-2">
      {data.dependencies.map((d) => (
        <div key={d.id} className="card" style={{ padding: 16 }}>
          <div className="row" style={{ gap: 8 }}><span className="chip">{d.id}</span><strong>{d.name}</strong></div>
          <p className="small secondary" style={{ marginTop: 8 }}>{d.concern}</p>
          <div className="small" style={{ marginTop: 8 }}><span className="muted">À vérifier :</span> {d.toCheck}</div>
        </div>
      ))}
    </div>
  );
}

function Decisions({ data }) {
  return (
    <div className="stack">
      <div className="section-title"><h2>Registre D1–D5 (Plan de containment, corrigé)</h2></div>
      <div className="grid grid-2">{data.decisions.map((d) => <RegisterCard key={d.id} d={d} />)}</div>
      <div className="section-title"><h2>Les 12 décisions tracées sur la plateforme</h2></div>
      <div className="grid grid-2">{data.cellDecisions.map((d) => <DecisionCard key={d.id} decision={d} />)}</div>
      <Card title="Actions de containment portées par la Direction" flush>
        <ul className="list" style={{ padding: '0 18px 8px' }}>
          {data.actions.filter((a) => a.cells.includes('direction')).map((a) => (
            <li key={a.id} className="row between" style={{ gap: 12 }}>
              <span className="row" style={{ gap: 8 }}><span className="chip">{a.id}</span>{a.action}</span>
              <ActionStatusBadge status={a.status} size="sm" />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function Logbook({ data }) {
  const [day, setDay] = useState('all');
  const items = data.logbook.filter((l) => day === 'all' || l.day === day).map((l, i) => ({ id: i, day: l.day, time: l.time, action: l.event, actor: l.source, cellId: l.cellId, status: l.decision ? 'Décision' : null, evidence: l.evidence }));
  return (
    <Card title="Main courante de la cellule de crise" actions={<Segmented value={day} onChange={setDay} ariaLabel="Jour" options={[{ value: 'all', label: 'Tout' }, { value: 'J1', label: 'J1' }, { value: 'J2', label: 'J2' }]} />}>
      <ActivityTimeline items={items} />
    </Card>
  );
}

export default function DirectionDashboard({ cell, data }) {
  const [tab, setTab] = useTabParam('commandement');
  const tabs = [
    { id: 'commandement', label: 'Poste de commandement', icon: Compass },
    { id: 'cellules', label: 'Suivi des cellules', icon: Send, count: data.cellRequests.length },
    { id: 'actifs', label: 'Cartographie SI', icon: Map, count: data.assets.length },
    { id: 'dependances', label: 'Dépendances', icon: GitFork, count: data.dependencies.length },
    { id: 'decisions', label: 'Décisions', icon: Gavel, count: data.cellDecisions.length },
    { id: 'main-courante', label: 'Main courante', icon: BookOpen },
    { id: 'team', label: 'Équipe & documents', icon: Users },
  ];
  return (
    <>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {tab === 'commandement' && <Command data={data} />}
      {tab === 'cellules' && <CellTracking data={data} />}
      {tab === 'actifs' && <Cartography data={data} />}
      {tab === 'dependances' && <Dependencies data={data} />}
      {tab === 'decisions' && <Decisions data={data} />}
      {tab === 'main-courante' && <Logbook data={data} />}
      {tab === 'team' && <CellOverviewFooter cell={cell} />}
    </>
  );
}
