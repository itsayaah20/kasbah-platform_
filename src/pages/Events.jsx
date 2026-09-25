import { useState } from 'react';
import { Info, FileCheck2, FileX2 } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, Callout } from '../components/common/Card';
import { Segmented, Select } from '../components/common/Controls';
import { ActivityTimeline } from '../components/activity/ActivityTimeline';
import { Badge, EvidenceChips } from '../components/common/Badge';
import { attackChronology } from '../data/soc/feed';
import { logbook } from '../data/common/logbook';
import { attackSequence } from '../data/soc/telemetry';
import { platformFeed, ACTS, closedLeads, deliverables } from '../data/common/platformFeed';
import { AttackSequence } from '../features/soc/SocOverview';
import { allCells } from '../services/cellService';

const KIND_LABEL = { consigne: 'Consigne', signal: 'Signal', piece: 'Pièce', decision: 'Décision', attaquant: 'Attaquant', pression: 'Pression externe', interne: 'Interne / partenaire', 'fin-journee': 'Fin de journée', rendu: 'Rendu attendu' };
const VERDICT = { preuve: 'Preuve', bruit: 'Bruit', 'fausse-piste': 'Fausse piste' };

// Événements de l'incident : fil de la plateforme (fait foi), chronologie technique, main courante.
export default function Events() {
  const [view, setView] = useState('platform');
  const [kind, setKind] = useState('all');
  const [cell, setCell] = useState('all');

  const feedItems = platformFeed
    .filter((f) => (kind === 'all' || f.kind === kind) && (cell === 'all' || f.cellId === cell))
    .map((f) => {
      const act = ACTS.find((a) => a.day === f.day);
      return {
        id: f.id,
        day: `${act.act} — ${act.title}`,
        time: f.time,
        action: f.kind === 'piece' && f.evidence?.length ? `${f.evidence[0]} — ${f.title}` : f.title,
        actor: f.author,
        cellId: f.cellId,
        status: f.kind === 'piece' && f.verdict ? VERDICT[f.verdict] : f.kind === 'decision' ? 'Décision' : f.closes ? 'Piste écartée' : f.kind === 'attaquant' ? 'Attaquant' : KIND_LABEL[f.kind],
        details: f.kind === 'piece' && f.verdict ? `Justification : ${f.justification}` : (f.decoded ? `${f.text} — ${f.decoded}` : f.text),
        evidence: f.evidence || [],
      };
    });
  const attack = attackChronology.map((c, i) => ({ id: `a${i}`, day: c.phase, time: c.when, action: c.text, actor: '', evidence: c.evidence }));
  const log = logbook.map((l, i) => ({ id: `l${i}`, day: l.day === 'J1' ? 'J1 — Signaux faibles' : 'J2 — L’ultimatum', time: l.time, action: l.event, actor: l.source, cellId: l.cellId, status: l.decision ? 'Décision' : null, details: l.docTime !== l.time ? `Heure dans le plan : ${l.docTime}` : null, evidence: l.evidence }));

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Tableau de bord', to: '/dashboard' }, { label: 'Événements' }]}
        eyebrow="Monitoring"
        title="Événements de l’incident"
        description="Le fil de la plateforme KASBAH (ce que la cellule a reçu, qualifié et décidé), la chronologie technique de l’attaque et la main courante."
        actions={<Segmented value={view} onChange={setView} ariaLabel="Vue" options={[{ value: 'platform', label: 'Fil de la plateforme' }, { value: 'attack', label: 'Chronologie de l’attaque' }, { value: 'night', label: 'Nuit de J-1' }, { value: 'log', label: 'Main courante' }]} />}
      />
      <Callout tone="info" icon={Info}>Horodatages relatifs tels que fournis. Le fil de la plateforme fait foi pour les heures ; la main courante du Plan de containment les notait une heure plus tôt et a été réalignée.</Callout>
      <div style={{ marginTop: 16 }}>
        {view === 'platform' && (
          <div className="grid grid-main-side">
            <Card title="Fil de la cellule (Rabat · Cellule 5)" subtitle={`${feedItems.length} entrées · Actes I à III`}>
              <div className="filter-bar">
                <Select value={kind} onChange={setKind} ariaLabel="Type" options={[{ value: 'all', label: 'Tous les types' }, ...Object.entries(KIND_LABEL).map(([k, v]) => ({ value: k, label: v }))]} />
                <Select value={cell} onChange={setCell} ariaLabel="Cellule" options={[{ value: 'all', label: 'Toutes les cellules' }, ...allCells.map((c) => ({ value: c.id, label: c.fullName }))]} />
              </div>
              <ActivityTimeline items={feedItems} />
            </Card>
            <div className="stack">
              <Card title="Pistes écartées" subtitle="Annoncées dans le fil (FP-n)" flush>
                <ul className="list" style={{ padding: '0 18px 8px' }}>
                  {closedLeads.map((l) => (
                    <li key={l.code}>
                      <div className="row between"><span className="chip">{l.code}</span><span className="mono tiny muted">{l.at}</span></div>
                      <div className="small" style={{ marginTop: 4 }}>{l.title}</div>
                      <div className="row-wrap tiny muted" style={{ marginTop: 2 }}>{l.by} <EvidenceChips refs={l.evidence} /></div>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card title="Rendus attendus" subtitle="Fichiers déposés par le répondant" flush>
                <ul className="list" style={{ padding: '0 18px 8px' }}>
                  {deliverables.map((d) => (
                    <li key={d.id}>
                      <div style={{ fontWeight: 500 }}>{d.title.replace('Rendu : ', '')}</div>
                      <div className="tiny muted">Demandé par {d.author}</div>
                      {d.deposits.map((dep) => (
                        <div key={dep.file} className="row small" style={{ gap: 6, marginTop: 4 }}>
                          {dep.inData ? <FileCheck2 size={13} style={{ color: 'var(--good-text)' }} /> : <FileX2 size={13} style={{ color: 'var(--warning-text)' }} />}
                          <span className="grow" style={{ overflowWrap: 'anywhere' }}>{dep.file}</span>
                          <span className="mono tiny muted">{dep.at}</span>
                          {!dep.inData && <Badge size="sm" tone="warning">absent de Data</Badge>}
                        </div>
                      ))}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        )}
        {view === 'attack' && <Card title="Déroulé de l’attaque" subtitle="Chronologie_incident_J1_J2.docx"><ActivityTimeline items={attack} showCell={false} /></Card>}
        {view === 'night' && <Card title="J-1, de 03:11 à 03:16" subtitle="Splunk (A-10) + Defender (A-12)"><AttackSequence steps={attackSequence} /></Card>}
        {view === 'log' && <Card title="Main courante" subtitle="Plan de containment, section 16 · heures réalignées sur la plateforme"><ActivityTimeline items={log} /></Card>}
      </div>
    </>
  );
}
