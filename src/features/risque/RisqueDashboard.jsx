import { useState } from 'react';
import { Scale, Table2, Landmark, Handshake, Building2, Database, Bitcoin, BookMarked, Users, AlertOctagon, ClipboardCheck, Gavel, ExternalLink, ArrowRight } from 'lucide-react';
import { Tabs, Segmented } from '../../components/common/Controls';
import { useTabParam } from '../../hooks/useMisc';
import { Card, Callout, KeyValue } from '../../components/common/Card';
import { StatusBadge, EvidenceChips } from '../../components/common/Badge';
import { StatCard } from '../../components/cards/StatCard';
import { DataTable } from '../../components/tables/DataTable';
import { Modal } from '../../components/common/Modal';
import { RiskScoreChart } from '../../components/charts/Widgets';
import { CellOverviewFooter } from '../shared';
import { riskLevel, NOTIF_STATUS } from '../../data/risque/compliance';
import { decisionsRequested } from '../../data/direction/coordination';
import { metricsSeed } from '../../services/metricsService';
import { RiskScoreCard } from '../../components/charts/Performance';

const LEVEL_TONE = { critique: 'critical', eleve: 'serious', moyen: 'warning', faible: 'good' };
const LEVEL_LABEL = { critique: 'Critique', eleve: 'Élevé', moyen: 'Moyen', faible: 'Faible' };

function RiskHeatmap({ risks, onSelect }) {
  const cellTone = (p, i) => LEVEL_TONE[riskLevel(p * i).level];
  return (
    <div className="heatmap" role="grid" aria-label="Matrice probabilité × impact">
      <div className="heatmap__ylabel">Probabilité</div>
      <div className="heatmap__grid">
        {[4, 3, 2, 1].map((p) => (
          <div key={p} className="heatmap__row" role="row">
            <span className="heatmap__tick">{p}</span>
            {[1, 2, 3, 4].map((i) => {
              const here = risks.filter((r) => r.p === p && r.i === i);
              return (
                <div key={i} role="gridcell" className={`heatmap__cell heatmap__cell--${cellTone(p, i)}`} title={`P${p} × I${i} = ${p * i}`}>
                  <span className="heatmap__score">{p * i}</span>
                  <div className="heatmap__items">
                    {here.map((r) => <button key={r.id} type="button" className="heatmap__risk" onClick={() => onSelect(r)} title={r.title}>{r.id}</button>)}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div className="heatmap__row heatmap__row--axis">
          <span className="heatmap__tick" />
          {[1, 2, 3, 4].map((i) => <span key={i} className="heatmap__tick heatmap__tick--x">{i}</span>)}
        </div>
        <div className="heatmap__xlabel">Impact</div>
      </div>
    </div>
  );
}

function RiskDetail({ risk, onClose }) {
  if (!risk) return null;
  const lvl = riskLevel(risk.score);
  return (
    <Modal open onClose={onClose} title={`${risk.id} — ${risk.title}`} subtitle={<span className="row"><StatusBadge tone={lvl.tone} size="sm">{lvl.label}</StatusBadge> Criticité {risk.p} × {risk.i} = {risk.score}</span>}>
      <KeyValue items={[
        ['Faits / preuves', risk.facts],
        ['Personnes & actifs exposés', risk.exposed],
        ['Cadre légal / contractuel', risk.legal],
        ['Traitement recommandé', risk.treatment],
        ['Responsable', risk.owner],
        ['Pièces', risk.evidence.length ? <EvidenceChips key="e" refs={risk.evidence} /> : null],
      ]} />
    </Modal>
  );
}

function Synthesis({ data, onSelect }) {
  const crit = data.risks.filter((r) => r.score >= 12).length;
  const openObl = data.notificationObligations.filter((o) => (o.update?.status || o.status) !== 'fait').length;
  return (
    <div className="stack" style={{ gap: 20 }}>
      <Callout tone="critical" icon={AlertOctagon} title="Qualification :">{data.riskSynthesis}</Callout>
      <div className="grid grid-kpi">
        <StatCard label="Risques identifiés" value={data.risks.length} sub="Registre R1 – R11" icon={Table2} provenance="real" source="Tableau de risques" />
        <StatCard label="Risques critiques" value={crit} sub="Criticité ≥ 12" icon={AlertOctagon} tone="critical" provenance="derived" />
        <StatCard label="Obligations encore ouvertes" value={openObl} unit={`/ ${data.notificationObligations.length}`} sub="Après mises à jour du soir J2" icon={Landmark} tone="warning" provenance="derived" />
        <StatCard label="Décisions demandées" value={decisionsRequested.length} sub="À la Direction (12:00)" icon={Gavel} tone="info" provenance="real" />
      </div>
      <div className="grid grid-2">
        <Card title="Matrice probabilité × impact" subtitle="Cliquez sur un risque pour le détail · échelle 1 à 4">
          <RiskHeatmap risks={data.risks} onSelect={onSelect} />
        </Card>
        <RiskScoreChart data={data.risks.map((r) => ({ ...r, level: riskLevel(r.score).level }))} height={300} />
      </div>
      <RiskScoreCard risk={metricsSeed().riskScore} />
      <Card title="Décisions demandées à la Direction (12:00)" subtitle="Tableau de risques, section 4">
        <ol className="numbered">{decisionsRequested.map((d) => <li key={d}>{d}</li>)}</ol>
      </Card>
    </div>
  );
}

function Register({ data, onSelect }) {
  const [level, setLevel] = useState('all');
  const rows = data.risks.map((r) => ({ ...r, level: riskLevel(r.score).level }));
  const columns = [
    { key: 'id', header: '#', nowrap: true, sortValue: (r) => Number(r.id.slice(1)), render: (r) => <span className="chip">{r.id}</span> },
    { key: 'title', header: 'Risque', strong: true },
    { key: 'p', header: 'P', align: 'center' },
    { key: 'i', header: 'I', align: 'center' },
    { key: 'score', header: 'Crit.', align: 'center', render: (r) => <StatusBadge tone={LEVEL_TONE[r.level]} size="sm">{r.score}</StatusBadge> },
    { key: 'exposed', header: 'Exposés' },
    { key: 'owner', header: 'Resp.', nowrap: true },
  ];
  return (
    <Card flush>
      <DataTable rows={rows} columns={columns} rowKey={(r) => r.id} initialSort={{ key: 'score', dir: 'desc' }} filters={{ level }} onRowClick={onSelect} exportName="registre-risques" pageSize={11}
        toolbar={<Segmented value={level} onChange={setLevel} ariaLabel="Niveau" options={[{ value: 'all', label: 'Tous' }, ...['critique', 'eleve', 'moyen'].map((l) => ({ value: l, label: LEVEL_LABEL[l], count: rows.filter((r) => r.level === l).length }))]} />} />
    </Card>
  );
}

function Obligations({ data }) {
  return (
    <div className="stack">
      <Card title="Obligations de notification et échéances" subtitle="Statut à J2 ~10:30 (Tableau de risques) et évolution tracée au soir de J2 (Plan de containment)" flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Destinataire</th><th>Fondement</th><th>Échéance</th><th>Contenu minimum</th><th>J2 ~10:30</th><th>Soir J2</th></tr></thead>
            <tbody>{data.notificationObligations.map((o) => (
              <tr key={o.id}>
                <td className="strong">{o.recipient}<div className="tiny muted">{o.owner}</div></td>
                <td className="small">{o.basis}<div className="tiny muted">{o.trigger}</div></td>
                <td className="small">{o.deadline}</td>
                <td className="small">{o.content}</td>
                <td><StatusBadge size="sm" tone={NOTIF_STATUS[o.status].tone}>{NOTIF_STATUS[o.status].label}</StatusBadge></td>
                <td>{o.update ? (<><StatusBadge size="sm" tone={o.update.status === 'fait' ? 'good' : o.update.status === 'a-confirmer' ? 'warning' : 'neutral'}>{o.update.status === 'fait' ? 'Fait' : o.update.status === 'a-confirmer' ? 'À confirmer' : 'À faire'}</StatusBadge><div className="tiny muted" style={{ marginTop: 4 }}>{o.update.note}</div></>) : <span className="muted small">Aucune mise à jour</span>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
      <Callout tone="info" icon={Landmark}>Les textes marocains ne fixent pas de délai chiffré pour notifier une violation à la CNDP (contrairement aux 72 h du RGPD, applicable si des résidents de l’UE sont concernés). La qualification d’AtlasGrid comme infrastructure d’importance vitale (loi 05-20) est à confirmer.</Callout>
      <Card title="Analyse juridique détaillée" subtitle="Retour à la note DC/2026/01 (v3), rubrique 01 — Amina Essafi, J2 16:45" flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Autorité</th><th>Fondement</th><th>Condition</th><th>Délai</th><th>Informations manquantes</th></tr></thead>
            <tbody>{data.legalAnalysis.map((l) => (
              <tr key={l.authority}><td className="strong">{l.authority}</td><td className="small">{l.basis}</td><td className="small">{l.condition}</td><td className="small">{l.delay}</td><td className="small">{l.missing}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SlaCalculator({ sla }) {
  const [period, setPeriod] = useState('month');
  const [down, setDown] = useState(24);
  const allowance = sla[period];
  const ratio = Math.min(100, (down / allowance) * 100);
  const exceeded = down > allowance;
  return (
    <Card title="Calculateur SLA 99,5 %" subtitle="99,5 % ≈ 3,6 h / mois · 10,9 h / trimestre · 43,8 h / an (Retour v3)">
      <div className="stack-sm">
        <Segmented value={period} onChange={setPeriod} ariaLabel="Période de mesure" options={[{ value: 'month', label: 'Mensuelle' }, { value: 'quarter', label: 'Trimestrielle' }, { value: 'year', label: 'Annuelle' }]} />
        <div className="field" style={{ marginTop: 8 }}>
          <label htmlFor="down">Indisponibilité simulée : <strong className="num">{down} h</strong></label>
          <input id="down" type="range" min={0} max={96} step={1} value={down} onChange={(e) => setDown(Number(e.target.value))} className="range" />
        </div>
        <div className="row between small"><span>Tolérance sur la période</span><strong className="num">{String(allowance).replace('.', ',')} h</strong></div>
        <div className={`progress ${exceeded ? 'progress--critical' : 'progress--good'}`} style={{ height: 10 }}><div className="progress__bar" style={{ width: `${ratio}%` }} /></div>
        <StatusBadge tone={exceeded ? 'critical' : 'good'}>{exceeded ? `Seuil dépassé de ${(down - allowance).toFixed(1).replace('.', ',')} h` : 'Sous le seuil'}</StatusBadge>
        <p className="tiny muted">Outil de simulation : la clause réelle (service couvert, période, exclusions) reste à lire au contrat.</p>
      </div>
    </Card>
  );
}

function Clients({ data }) {
  return (
    <div className="stack">
      <div className="grid grid-main-side">
        <Card title="Engagements envers la Chérifienne des Mines" subtitle="Distinguer une demande d’un engagement déjà accepté" flush>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Élément</th><th>Engagement déjà accepté ?</th><th>Ce que nous savons</th><th>À vérifier / faire</th></tr></thead>
              <tbody>{data.clientCommitments.map((c) => <tr key={c.element}><td className="strong">{c.element}</td><td className="small">{c.accepted}</td><td className="small">{c.known}</td><td className="small">{c.todo}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
        <SlaCalculator sla={data.slaAllowance} />
      </div>
    </div>
  );
}

function OasisNet({ data }) {
  return (
    <div className="stack">
      <Callout tone="warning" icon={Building2}>AtlasGrid reste responsable envers la CNDP et les personnes ; recours ensuite contre OasisNet. <strong>Pas de résiliation pendant la crise</strong> (dépendance pour la reprise).</Callout>
      <div className="grid grid-2">
        {data.oasisnetResponsibilities.map((o) => (
          <div key={o.point} className="card" style={{ padding: 16 }}>
            <strong>{o.point}</strong>
            <p className="small secondary" style={{ marginTop: 8 }}>{o.finding}</p>
            <div className="tiny muted" style={{ marginTop: 8 }}>Fondement : {o.basis}</div>
            <div className="row small" style={{ marginTop: 8, gap: 6, alignItems: 'flex-start' }}><ArrowRight size={13} style={{ marginTop: 3, flexShrink: 0 }} />{o.action}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Exposure({ data }) {
  return (
    <div className="stack">
      <div className="grid grid-2">
        {data.dataExposure.map((d) => (
          <div key={d.source} className="card" style={{ padding: 16 }}>
            <div className="row between"><strong>{d.source}</strong><div className="row">{d.sensitive && <StatusBadge tone="critical" size="sm">Données sensibles</StatusBadge>}<StatusBadge tone="warning" size="sm">À confirmer</StatusBadge></div></div>
            <KeyValue items={[['Catégories', d.categories], ['Personnes', d.people], ['Risque', d.risk]]} />
          </div>
        ))}
      </div>
      <Callout tone="info" icon={Database}>Pour conclure, il manque : la liste des fichiers réellement sortis (le volume seul ne suffit pas), l’explication de l’écart 12,5 Go / 117,8 Go, la destination des flux, et une veille des sites de fuite. Demandes adressées à la Forensique.</Callout>
    </div>
  );
}

function Ransom({ data }) {
  const TONE = { Confirmé: 'critical', 'À confirmer': 'warning', 'Non étayé': 'neutral', Réfuté: 'good' };
  return (
    <div className="stack">
      <Card title="Affirmations de l’attaquant confrontées aux preuves" subtitle="Retour v3, rubrique 05" flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Affirmation</th><th>Vérification à ce stade</th><th>Statut</th></tr></thead>
            <tbody>{data.attackerClaims.map((c) => <tr key={c.claim}><td className="strong">{c.claim}</td><td>{c.check}</td><td><StatusBadge size="sm" tone={TONE[c.status]}>{c.status}</StatusBadge></td></tr>)}</tbody>
          </table>
        </div>
      </Card>
      <Card title="Critères d’arbitrage" subtitle="Éléments disponibles et informations manquantes" flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Critère</th><th>Éléments disponibles</th><th>Informations manquantes</th></tr></thead>
            <tbody>{data.ransomCriteria.map((c) => <tr key={c.criterion}><td className="strong">{c.criterion}</td><td className="small">{c.available}</td><td className="small">{c.missing}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
      <Callout tone="critical" icon={Bitcoin} title="Recommandation (R8) :">ne pas payer ; ne pas négocier seul ; décision tracée de la Direction. Sur la plateforme, la cellule a choisi de temporiser puis de faire traîner : SIROCCO a doublé la rançon (40 BTC, échéance J3 minuit) et publié deux lots de données. L’assureur rappelle qu’aucun paiement n’est couvert sans son accord écrit.</Callout>
    </div>
  );
}

function Sources({ data }) {
  return (
    <Card title="Sources des textes cités" subtitle="Liens fournis dans le Retour Risque / Conformité v3">
      <ul className="list">
        {data.legalSources.map((s) => (
          <li key={s.url} className="row between">
            <span>{s.label}</span>
            <a className="btn btn--sm btn--ghost" href={s.url} target="_blank" rel="noreferrer">Consulter <ExternalLink size={12} /></a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function RisqueDashboard({ cell, data }) {
  const [tab, setTab] = useTabParam('synthese');
  const [selected, setSelected] = useState(null);
  const tabs = [
    { id: 'synthese', label: 'Synthèse', icon: Scale },
    { id: 'registre', label: 'Registre des risques', icon: Table2, count: data.risks.length },
    { id: 'obligations', label: 'Obligations', icon: ClipboardCheck, count: data.notificationObligations.length },
    { id: 'clients', label: 'Engagements clients', icon: Handshake },
    { id: 'oasisnet', label: 'OasisNet', icon: Building2 },
    { id: 'donnees', label: 'Données exposées', icon: Database },
    { id: 'rancon', label: 'Arbitrage rançon', icon: Bitcoin },
    { id: 'sources', label: 'Sources', icon: BookMarked },
    { id: 'team', label: 'Équipe & documents', icon: Users },
  ];
  return (
    <>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {tab === 'synthese' && <Synthesis data={data} onSelect={setSelected} />}
      {tab === 'registre' && <Register data={data} onSelect={setSelected} />}
      {tab === 'obligations' && <Obligations data={data} />}
      {tab === 'clients' && <Clients data={data} />}
      {tab === 'oasisnet' && <OasisNet data={data} />}
      {tab === 'donnees' && <Exposure data={data} />}
      {tab === 'rancon' && <Ransom data={data} />}
      {tab === 'sources' && <Sources data={data} />}
      {tab === 'team' && <CellOverviewFooter cell={cell} />}
      <RiskDetail risk={selected} onClose={() => setSelected(null)} />
    </>
  );
}
