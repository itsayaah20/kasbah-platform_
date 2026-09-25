import { useMemo, useState } from 'react';
import {
  Gauge, ListChecks, Activity, Workflow, RotateCcw, BookOpen, ShieldOff, Users, Power, AlertTriangle, CheckCircle2, Hourglass, Lock, Zap, Undo2,
} from 'lucide-react';
import { Tabs, Segmented, Select } from '../../components/common/Controls';
import { useTabParam } from '../../hooks/useMisc';
import { Card, Callout } from '../../components/common/Card';
import { ActionStatusBadge, StatusBadge, Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/cards/StatCard';
import { DataTable } from '../../components/tables/DataTable';
import { ActivityTimeline } from '../../components/activity/ActivityTimeline';
import { ConfirmDialog } from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { CellOverviewFooter } from '../shared';
import { STATUS_COLORS } from '../../components/charts/Widgets';

const LEVEL_TONE = { Vital: 'critical', Critique: 'serious', Important: 'warning', Secondaire: 'good' };
const levelTone = (level = '') => LEVEL_TONE[Object.keys(LEVEL_TONE).find((k) => level.startsWith(k))] || 'neutral';

function useActions(actions) {
  const { overrides, setActionStatus, resetOverrides } = useApp();
  const merged = useMemo(() => actions.map((a) => ({ ...a, original: a.status, status: overrides[a.id] || a.status, modified: !!overrides[a.id] && overrides[a.id] !== a.status })), [actions, overrides]);
  return { actions: merged, setActionStatus, resetOverrides, modifiedCount: merged.filter((a) => a.modified).length };
}

function Pilotage({ data, actions }) {
  const count = (s) => actions.filter((a) => a.status === s).length;
  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="grid grid-kpi">
        <StatCard label="Actions réalisées" value={count('fait')} unit={`/ ${actions.length}`} sub="Vérifiées" icon={CheckCircle2} tone="good" provenance="real" source="Plan de containment" />
        <StatCard label="En cours" value={count('en-cours')} sub="Lancées" icon={Activity} tone="info" provenance="real" />
        <StatCard label="À confirmer" value={count('a-confirmer')} sub="Réalisées selon nos informations" icon={Hourglass} tone="warning" provenance="real" />
        <StatCard label="Bloquées" value={count('bloque')} sub="En attente d’une décision ou d’un tiers" icon={Lock} tone="critical" provenance="real" />
      </div>

      <Callout tone="critical" icon={AlertTriangle} title="Écart majeur identifié.">{data.majorGap}</Callout>

      <div className="grid grid-main-side">
        <Card title="Échéances à surveiller" subtitle="Plan de containment, section 2" flush>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Échéance</th><th>Objet</th><th>À faire</th><th>Statut</th></tr></thead>
              <tbody>{data.deadlines.map((d) => (
                <tr key={d.id}>
                  <td className="mono strong nowrap">{d.when}</td><td className="strong">{d.object}</td><td>{d.todo}</td>
                  <td><ActionStatusBadge status={d.status} size="sm" />{d.statusNote && <div className="tiny muted" style={{ marginTop: 4 }}>{d.statusNote}</div>}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Card>
        <Card title="Couper ou maintenir (D2)" subtitle="Proposition du plan (section 9) et décision réellement tracée">
          <div className="row" style={{ gap: 8 }}><Power size={16} style={{ color: 'var(--critical-text)' }} /><strong>{data.cutDecision.proposal}</strong></div>
          <dl className="kv" style={{ marginTop: 12 }}>
            <dt>Pourquoi</dt><dd className="small">{data.cutDecision.why}</dd>
            <dt>Coût métier</dt><dd className="small">{data.cutDecision.cost}</dd>
            <dt>Ce qui continue</dt><dd className="small">{data.cutDecision.continues}</dd>
            <dt>Option rejetée</dt><dd className="small">{data.cutDecision.rejected}</dd>
          </dl>
          <div className="callout callout--info" style={{ marginTop: 12 }}><CheckCircle2 size={15} /><div><strong>Décision tracée (J2 ~12:25) : {data.cutDecision.actual}.</strong> {data.cutDecision.actualDetail}</div></div>
        </Card>
      </div>

      <div className="grid grid-2">
        <Card title="Passerelle IT/OT : critère de coupure" subtitle="Section 10 — « l’enjeu devient la sûreté physique »">
          <ul className="list">{data.otCutCriterion.map((c) => <li key={c} className="row" style={{ alignItems: 'flex-start', gap: 8 }}><Zap size={14} style={{ color: 'var(--warning-text)', marginTop: 3, flexShrink: 0 }} /><span className="small">{c}</span></li>)}</ul>
        </Card>
        <Card title="Déclenchement du PCA" subtitle="Section 4.1 — tous les critères sont atteints ou en cours d’évaluation">
          <ul className="list">{data.pcaTriggers.map((c) => <li key={c} className="row" style={{ gap: 8 }}><CheckCircle2 size={14} style={{ color: 'var(--critical-text)', flexShrink: 0 }} /><span className="small">{c}</span></li>)}</ul>
          <div className="small secondary" style={{ marginTop: 10 }}>La Direction arbitre ; la Continuité propose, chiffre l’impact et suit l’exécution. Point de situation toutes les 2 heures.</div>
        </Card>
      </div>

      <Card title="Situation et hypothèses de travail" subtitle="« Ce que l’on sait ≠ ce que l’on croit »" flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Statut</th><th>Élément</th><th>Conséquence pour la continuité</th></tr></thead>
            <tbody>{data.workingAssumptions.map((w) => (
              <tr key={w.element}><td><StatusBadge size="sm" tone={w.status === 'Fait' ? 'critical' : 'warning'}>{w.status}</StatusBadge></td><td className="strong">{w.element}</td><td>{w.consequence}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </Card>

      <Card title="Conclusion au soir de J2">
        <p className="secondary">{data.containmentConclusion}</p>
      </Card>
    </div>
  );
}

function ContainmentBoard({ actions, setActionStatus, resetOverrides, modifiedCount }) {
  const { toast } = useToast();
  const [view, setView] = useState('board');
  const [group, setGroup] = useState('all');
  const [confirmReset, setConfirmReset] = useState(false);
  const groups = [...new Set(actions.map((a) => a.group))];
  const filtered = actions.filter((a) => group === 'all' || a.group === group);
  const statuses = ['a-faire', 'en-cours', 'a-confirmer', 'bloque', 'fait'];
  const LABEL = { 'a-faire': 'À faire', 'en-cours': 'En cours', 'a-confirmer': 'À confirmer', bloque: 'Bloqué', fait: 'Fait' };

  const change = (a, status) => {
    setActionStatus(a.id, status);
    toast(`Action ${a.id} : ${LABEL[status]}`, { description: 'Modification locale, en attente de synchronisation backend.', tone: 'info' });
  };

  const columns = [
    { key: 'id', header: 'N°', nowrap: true, sortValue: (r) => r.id.padStart(3, '0'), render: (r) => <span className="chip">{r.id}</span> },
    { key: 'action', header: 'Action', strong: true },
    { key: 'owner', header: 'Porteur' },
    { key: 'impact', header: 'Impact / condition', accessor: (r) => r.impact || r.holds || r.condition || r.note },
    {
      key: 'status', header: 'Statut', sortValue: (r) => statuses.indexOf(r.status),
      render: (r) => (
        <div className="stack-sm" style={{ gap: 4 }} onClick={(e) => e.stopPropagation()}>
          <Select value={r.status} onChange={(v) => change(r, v)} ariaLabel={`Statut de l’action ${r.id}`} options={statuses.map((s) => ({ value: s, label: LABEL[s] }))} />
          {r.modified && <span className="tiny" style={{ color: 'var(--info-text)' }}>Modifié (source : {LABEL[r.original]})</span>}
        </div>
      ),
    },
  ];

  return (
    <div className="stack">
      <div className="filter-bar">
        <Segmented value={view} onChange={setView} ariaLabel="Vue" options={[{ value: 'board', label: 'Tableau Kanban' }, { value: 'table', label: 'Liste' }]} />
        <Select value={group} onChange={setGroup} ariaLabel="Lot" options={[{ value: 'all', label: 'Tous les lots' }, ...groups.map((g) => ({ value: g, label: g }))]} />
        <span className="filter-bar__spacer" />
        {modifiedCount > 0 && (
          <button type="button" className="btn btn--sm" onClick={() => setConfirmReset(true)}><Undo2 size={13} /> Annuler {modifiedCount} modification(s)</button>
        )}
      </div>

      {view === 'board' ? (
        <div className="kanban">
          {statuses.map((s) => {
            const col = filtered.filter((a) => a.status === s);
            return (
              <div key={s} className="kanban__col">
                <div className="kanban__head"><span className="chart-legend__swatch" style={{ background: STATUS_COLORS[s] }} />{LABEL[s]}<span className="muted num">{col.length}</span></div>
                {col.map((a) => (
                  <div key={a.id} className="kanban__card">
                    <div className="row between"><span className="chip">{a.id}</span>{a.modified && <Badge tone="info" size="sm">modifié</Badge>}</div>
                    <div className="small" style={{ color: 'var(--text-primary)', marginTop: 6 }}>{a.action}</div>
                    <div className="tiny muted" style={{ marginTop: 6 }}>{a.owner}</div>
                    <div style={{ marginTop: 8 }}>
                      <Select value={a.status} onChange={(v) => change(a, v)} ariaLabel={`Statut de l’action ${a.id}`} options={statuses.map((x) => ({ value: x, label: LABEL[x] }))} />
                    </div>
                  </div>
                ))}
                {col.length === 0 && <div className="tiny muted" style={{ padding: 10 }}>Aucune action</div>}
              </div>
            );
          })}
        </div>
      ) : (
        <Card flush><DataTable rows={filtered} columns={columns} rowKey={(r) => r.id} pageSize={15} exportName="plan-containment" /></Card>
      )}

      <ConfirmDialog
        open={confirmReset}
        title="Annuler les modifications locales ?"
        message="Les statuts reviendront aux valeurs du Plan de containment (soir J2)."
        confirmLabel="Rétablir les statuts d’origine"
        danger
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => { resetOverrides(); setConfirmReset(false); toast('Statuts d’origine rétablis', { tone: 'good' }); }}
      />
    </div>
  );
}

function ImpactAnalysis({ data }) {
  const columns = [
    { key: 'label', header: 'Actif', strong: true, render: (r) => <><strong>{r.label}</strong><div className="tiny muted mono">{r.name}</div></> },
    { key: 'level', header: 'Niveau', accessor: (r) => r.bia.level, sortValue: (r) => ['Vital', 'Critique', 'Important', 'Secondaire'].findIndex((l) => r.bia.level.startsWith(l)), render: (r) => <StatusBadge size="sm" tone={levelTone(r.bia.level)}>{r.bia.level}</StatusBadge> },
    { key: 'dmia', header: 'DMIA (RTO)', accessor: (r) => r.bia.dmia },
    { key: 'pdma', header: 'PDMA (RPO)', accessor: (r) => r.bia.pdma },
    { key: 'justification', header: 'Justification' },
  ];
  return (
    <div className="stack">
      <div className="grid grid-4">
        {data.planDefinitions.map((d) => (
          <div key={d.term} className="card" style={{ padding: 14 }}><Badge tone="brand">{d.term}</Badge><p className="small secondary" style={{ marginTop: 8 }}>{d.def}</p></div>
        ))}
      </div>
      <Callout tone="info" icon={Gauge}>Échelle à quatre niveaux : <strong>Vital</strong> (aucun mode dégradé acceptable), <strong>Critique</strong> (dégâts sérieux sous 24 à 48 h), <strong>Important</strong> (mode dégradé tenable plusieurs jours), <strong>Secondaire</strong>. Les DMIA sont des propositions de la cellule, à valider par la Direction et les métiers.</Callout>
      <Card flush title="Analyse d’impact : activités et actifs critiques" subtitle="PCA / PRA, section 3">
        <DataTable rows={data.bia} columns={columns} rowKey={(r) => r.id} pageSize={20} exportName="analyse-impact" hideSearch />
      </Card>
    </div>
  );
}

function DegradedModes({ data }) {
  return (
    <div className="stack">
      <div className="grid grid-3">
        {data.degradedModes.map((m) => (
          <div key={m.activity} className="card" style={{ padding: 16 }}>
            <div className="row between"><strong>{m.activity}</strong><Badge tone="outline" className="badge--outline" size="sm">{m.holds}</Badge></div>
            <div className="tiny muted mono" style={{ marginTop: 4 }}>{m.system}</div>
            <p className="small secondary" style={{ marginTop: 10 }}>{m.mode}</p>
            <div className="tiny muted" style={{ marginTop: 10 }}>Responsable : {m.owner}</div>
          </div>
        ))}
      </div>
      <Card title="Mesures conservatoires immédiates (H0 à H+4)" subtitle="Principe : protéger avant de restaurer" flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>#</th><th>Mesure</th><th>Actif protégé</th><th>Pourquoi</th><th>Qui</th></tr></thead>
            <tbody>{data.conservatoryMeasures.map((m) => (
              <tr key={m.n}><td className="mono">{m.n}</td><td className="strong">{m.measure}</td><td>{m.asset}</td><td>{m.why}</td><td className="nowrap">{m.owner}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
      <Card title="Communication liée à la continuité" subtitle="La Continuité fournit les faits ; la Communication rédige ; la Direction valide" flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Destinataire</th><th>Message clé</th><th>Canal</th><th>Moment</th></tr></thead>
            <tbody>{data.continuityCommPlan.map((c) => (
              <tr key={c.audience}><td className="strong">{c.audience}</td><td>{c.message}</td><td>{c.channel}</td><td className="nowrap">{c.when}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Recovery({ data }) {
  const [scenario, setScenario] = useState('A');
  const sc = data.recoveryScenarios.find((s) => s.id === scenario);
  const maxDay = 7.5;
  const ticks = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <div className="stack" style={{ gap: 20 }}>
      <Card title="Ordre de reprise (PRA)" subtitle="Section 5.2 — délais visés, conditionnés au feu vert Forensic">
        <div className="gantt">
          <div className="gantt__axis">{ticks.map((t) => <span key={t} style={{ left: `${(t / maxDay) * 100}%` }}>{t === 0 ? 'H0' : `J+${t}`}</span>)}</div>
          {data.recoveryPhases.map((p) => (
            <div key={p.phase} className="gantt__row">
              <div className="gantt__label"><span className="chip">{p.phase}</span> <strong>{p.label}</strong><div className="tiny muted">{p.systems}</div></div>
              <div className="gantt__track">
                {ticks.map((t) => <i key={t} style={{ left: `${(t / maxDay) * 100}%` }} />)}
                <span className={`gantt__bar ${p.phase === 6 ? 'is-dashed' : ''}`} style={{ left: `${(p.start / maxDay) * 100}%`, width: `${((p.end - p.start) / maxDay) * 100}%` }} title={`${p.window} — ${p.goal}`}>
                  <span>{p.window}</span>
                </span>
              </div>
              <div className="gantt__gate tiny">{p.gate}</div>
            </div>
          ))}
        </div>
        <p className="tiny muted" style={{ marginTop: 10 }}>Phase 6 (Tiers) : « Après validation » — sans délai chiffré, positionnée après la phase 5 à titre indicatif.</p>
      </Card>

      <div className="grid grid-main-side">
        <Card title="Deux scénarios selon l’état des sauvegardes" subtitle="Section 5.4" actions={<Segmented value={scenario} onChange={setScenario} ariaLabel="Scénario" options={[{ value: 'A', label: 'A — Veeam sain' }, { value: 'B', label: 'B — Veeam compromis' }]} />}>
          <div className="grid grid-2" style={{ gap: 12 }}>
            <div className="card card--inset" style={{ padding: 14 }}>
              <div className="small muted">Perte de données</div>
              <div style={{ fontSize: 24, fontWeight: 650, color: scenario === 'B' ? 'var(--critical-text)' : 'var(--text-primary)' }}>{sc.dataLoss}</div>
              <div className="loss-scale" aria-hidden="true"><span style={{ width: `${Math.max(2, (Math.log10(sc.lossHours) / Math.log10(2160)) * 100)}%` }} /></div>
              <div className="tiny muted">Échelle logarithmique : 24 h → 3 mois</div>
            </div>
            <div className="card card--inset" style={{ padding: 14 }}>
              <div className="small muted">Condition</div>
              <p className="small" style={{ marginTop: 4 }}>{sc.condition}</p>
            </div>
          </div>
          <p className="secondary small" style={{ marginTop: 12 }}>{sc.actions}</p>
          {sc.actualLoss && <div className="callout callout--warning" style={{ marginTop: 12 }}><AlertTriangle size={15} /><div><strong>Scénario réalisé.</strong> {sc.actualLoss}.</div></div>}
        </Card>
        <Card title="Contrôles avant remise en service" subtitle="Section 5.3">
          <ul className="list">{data.serviceChecks.map((c) => <li key={c} className="row" style={{ alignItems: 'flex-start', gap: 8 }}><CheckCircle2 size={14} style={{ color: 'var(--good-text)', marginTop: 3, flexShrink: 0 }} /><span className="small">{c}</span></li>)}</ul>
        </Card>
      </div>

      <Card title="Constat final sur les sauvegardes et décisions de reprise" subtitle="Inventaire A-06 (J3 09:30), RSSI (J3 12:12), décisions tracées J3">
        <dl className="kv">
          <dt>Sauvegarde en ligne</dt><dd>{data.backupFindings.online}</dd>
          <dt>Copie hors ligne</dt><dd>{data.backupFindings.offline}</dd>
          <dt>Dernière copie</dt><dd>{data.backupFindings.lastCopy} · {data.backupFindings.volume}</dd>
          <dt>Test de restauration</dt><dd>{data.backupFindings.tested}</dd>
          <dt>Délai estimé</dt><dd>{data.backupFindings.restoreTime}</dd>
          <dt>Source restaurée</dt><dd><StatusBadge tone="good" size="sm">Décision</StatusBadge> {data.backupFindings.restoreDecision}</dd>
          <dt>Priorité</dt><dd><StatusBadge tone="good" size="sm">Décision</StatusBadge> {data.backupFindings.priorityDecision}</dd>
        </dl>
      </Card>

      <div className="grid grid-3">
        <Card title="Principes de reprise"><ul className="bullet-list small">{data.recoveryPrinciples.map((p) => <li key={p}>{p}</li>)}</ul></Card>
        <Card title="Critères de sortie du mode dégradé"><ul className="bullet-list small">{data.exitCriteria.map((p) => <li key={p}>{p}</li>)}</ul></Card>
        <Card title="Points à confirmer"><ul className="bullet-list small">{data.pointsToConfirm.map((p) => <li key={p}>{p}</li>)}</ul></Card>
      </div>
    </div>
  );
}

function Logbook({ data }) {
  const [day, setDay] = useState('all');
  const items = data.logbook
    .filter((l) => day === 'all' || l.day === day)
    .map((l, i) => ({ id: i, day: l.day === 'J1' ? 'Jour 1 — Signaux faibles' : 'Jour 2 — L’ultimatum', time: l.time, action: l.event, actor: l.source, cellId: l.cellId, status: l.decision ? 'Décision' : null, evidence: l.evidence }));
  return (
    <Card title="Main courante" subtitle="Chaque action est horodatée avec son auteur (Plan de containment, section 16)" actions={<Segmented value={day} onChange={setDay} ariaLabel="Jour" options={[{ value: 'all', label: 'J1 + J2' }, { value: 'J1', label: 'J1' }, { value: 'J2', label: 'J2' }]} />}>
      <ActivityTimeline items={items} />
    </Card>
  );
}

function Blocking({ data }) {
  const [checked, setChecked] = useState({});
  return (
    <div className="stack">
      <Card title="Indicateurs de compromission à bloquer" subtitle="Plan de containment, section 3" flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Type</th><th>Indicateur</th><th>Source</th><th>Action</th></tr></thead>
            <tbody>{data.iocBlocklist.map((i) => (
              <tr key={i.value}><td className="nowrap">{i.type}</td><td className="mono strong">{i.value}</td><td className="mono small">{i.source}</td><td>{i.action}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
      <div className="grid grid-2">
        <Card title="Critères de fin du containment" subtitle="Liste de vérification (cochage local)">
          <ul className="list">
            {data.containmentEndCriteria.map((c) => (
              <li key={c.criterion}>
                <label className="row" style={{ alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" className="checkbox" checked={!!checked[c.criterion]} onChange={() => setChecked((s) => ({ ...s, [c.criterion]: !s[c.criterion] }))} style={{ marginTop: 2 }} />
                  <span><strong style={{ fontWeight: 500 }}>{c.criterion}</strong><div className="small muted">{c.check}</div></span>
                </label>
              </li>
            ))}
          </ul>
          <div className="small muted" style={{ marginTop: 8 }}>{Object.values(checked).filter(Boolean).length} / {data.containmentEndCriteria.length} critères cochés</div>
        </Card>
        <Card title="Points ouverts du containment" subtitle="Section 17">
          <ul className="bullet-list small">{data.containmentOpenPoints.map((p) => <li key={p}>{p}</li>)}</ul>
        </Card>
      </div>
    </div>
  );
}

export default function ContinuiteDashboard({ cell, data }) {
  const [tab, setTab] = useTabParam('pilotage');
  const { actions, setActionStatus, resetOverrides, modifiedCount } = useActions(data.containmentActions);
  const tabs = [
    { id: 'pilotage', label: 'Pilotage', icon: Gauge },
    { id: 'containment', label: 'Plan de containment', icon: ListChecks, count: actions.length },
    { id: 'impact', label: 'Analyse d’impact', icon: Activity },
    { id: 'degrade', label: 'Modes dégradés', icon: Workflow },
    { id: 'reprise', label: 'Reprise (PRA)', icon: RotateCcw },
    { id: 'blocage', label: 'Blocage & sortie', icon: ShieldOff },
    { id: 'main-courante', label: 'Main courante', icon: BookOpen, count: data.logbook.length },
    { id: 'team', label: 'Équipe & documents', icon: Users },
  ];
  return (
    <>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {tab === 'pilotage' && <Pilotage data={data} actions={actions} />}
      {tab === 'containment' && <ContainmentBoard actions={actions} setActionStatus={setActionStatus} resetOverrides={resetOverrides} modifiedCount={modifiedCount} />}
      {tab === 'impact' && <ImpactAnalysis data={data} />}
      {tab === 'degrade' && <DegradedModes data={data} />}
      {tab === 'reprise' && <Recovery data={data} />}
      {tab === 'blocage' && <Blocking data={data} />}
      {tab === 'main-courante' && <Logbook data={data} />}
      {tab === 'team' && <CellOverviewFooter cell={cell} />}
    </>
  );
}
