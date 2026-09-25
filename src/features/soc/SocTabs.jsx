import { useMemo, useState } from 'react';
import { Copy, Shield } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { DataTable } from '../../components/tables/DataTable';
import { EvidenceChips, SeverityBadge, VerdictBadge, StatusBadge, Badge } from '../../components/common/Badge';
import { Segmented, Select } from '../../components/common/Controls';
import { ASSET_STATES } from '../../data/common/assets';
import { ActivityTimeline } from '../../components/activity/ActivityTimeline';
import { useToast } from '../../context/ToastContext';
import { EvidenceModal } from '../../components/alerts/EvidenceModal';
import { formatDuration } from '../../utils/format';
import { sortKey } from '../../utils/time';

const minutesBetween = (a, b) => sortKey(...b.split(' ')) - sortKey(...a.split(' '));

export function SocIncidents({ data }) {
  const columns = [
    { key: 'id', header: 'ID', nowrap: true, render: (r) => <span className="mono strong">{r.id}</span> },
    { key: 'title', header: 'Incident', strong: true },
    { key: 'severity', header: 'Sévérité', sortValue: (r) => ['critical', 'high', 'medium', 'low'].indexOf(r.severity), render: (r) => <SeverityBadge severity={r.severity} size="sm" /> },
    { key: 'status', header: 'Statut' },
    { key: 'openedAt', header: 'Ouvert', nowrap: true, render: (r) => <span className="mono small">{r.openedAt}</span> },
    { key: 'resolved', header: 'Résolu', sortValue: (r) => (r.resolved ? 1 : 0), render: (r) => (r.resolved ? <span><StatusBadge tone="good" size="sm">{r.resolvedAt}</StatusBadge><div className="tiny muted" style={{ marginTop: 3 }}>{formatDuration(minutesBetween(r.openedAt, r.resolvedAt))}</div></span> : <StatusBadge tone="warning" size="sm">Non</StatusBadge>) },
    { key: 'evidence', header: 'Pièces', sortable: false, accessor: (r) => r.evidence.join(' '), render: (r) => <EvidenceChips refs={r.evidence} max={4} /> },
  ];
  return (
    <div className="stack">
      <div className="callout callout--info"><Shield size={15} /><div>Un incident majeur, quatre dossiers distincts. Les rapports ne numérotent pas les incidents : <strong>identifiants et sévérités sont une qualification proposée, à valider</strong>. Analyste assigné : N/A.</div></div>
      <Card flush><DataTable rows={data.incidents} columns={columns} rowKey={(r) => r.id} hideSearch exportName="soc-incidents" /></Card>
      <div className="callout"><Shield size={15} /><div>Taux de résolution : <strong>{data.metrics.resolution.incidents.resolved}/{data.metrics.resolution.incidents.total} incidents contenus ({data.metrics.resolution.incidents.rate} %)</strong>, délai moyen de résolution {formatDuration(data.metrics.mttr.incidentMeanMin)}. L’incident principal (INC-001) est confiné depuis J2 15:58 mais pas résolu : la reprise depuis Settat est en cours.</div></div>
    </div>
  );
}

export function SocTriage({ data }) {
  const [verdict, setVerdict] = useState('all');
  const [day, setDay] = useState('all');
  const [open, setOpen] = useState(null);
  const count = (v) => data.evidence.filter((e) => e.verdict === v).length;
  const columns = [
    { key: 'ref', header: 'Pièce', nowrap: true, render: (r) => <span className="chip">{r.ref}</span> },
    { key: 'title', header: 'Alerte / artefact', strong: true },
    { key: 'tool', header: 'Source / outil' },
    { key: 'verdict', header: 'Verdict fiche', render: (r) => <VerdictBadge verdict={r.verdict} size="sm" /> },
    { key: 'cellVerdict', header: 'Verdict cellule', accessor: (r) => r.cellVerdict?.verdict || '', render: (r) => (r.cellVerdict ? <span className="row" style={{ gap: 4 }}><VerdictBadge verdict={r.cellVerdict.verdict} size="sm" />{r.cellVerdict.verdict !== r.verdict && r.verdict !== 'a-confirmer' && <Badge size="sm" tone="warning">≠</Badge>}</span> : <span className="muted small">Non qualifiée</span>) },
    { key: 'day', header: 'Jour', nowrap: true },
    { key: 'summary', header: 'Ce qui l’établit ou l’écarte', render: (r) => <span className="small">{r.summary}</span> },
  ];
  return (
    <div className="stack">
      <div className="callout"><Shield size={15} /><div>12 pièces sur 21 écartées, chacune par un fait vérifiable. Règle retenue : <strong>en cas de désaccord, la fiche de traçabilité fait foi</strong>. La colonne « Verdict cellule » reprend la qualification posée par la cellule sur la plateforme ; le signe ≠ marque un écart (A-19, A-21, A-40).</div></div>
      <Card flush>
        <DataTable
          rows={data.evidence}
          columns={columns}
          rowKey={(r) => r.ref}
          filters={{ verdict, day }}
          onRowClick={setOpen}
          exportName="soc-triage"
          toolbar={(
            <>
              <Segmented value={verdict} onChange={setVerdict} ariaLabel="Verdict" options={[
                { value: 'all', label: 'Toutes', count: data.evidence.length },
                { value: 'preuve', label: 'Preuves', count: count('preuve') },
                { value: 'bruit', label: 'Bruit', count: count('bruit') },
                { value: 'fausse-piste', label: 'Fausses pistes', count: count('fausse-piste') },
              ]} />
              <Select value={day} onChange={setDay} ariaLabel="Jour" options={[{ value: 'all', label: 'J1 + J2' }, { value: 'J1', label: 'Jour 1' }, { value: 'J2', label: 'Jour 2' }]} />
            </>
          )}
        />
      </Card>
      <EvidenceModal evidence={open} onClose={() => setOpen(null)} />
    </div>
  );
}

export function SocEvents({ data }) {
  const [view, setView] = useState('feed');
  const feedItems = useMemo(() => data.feed.map((f, i) => ({
    id: `f${i}`, day: f.day, time: f.time, action: f.title, actor: f.author, cellId: null,
    status: f.verdict === 'preuve' ? 'Preuve' : f.verdict === 'bruit' ? 'Bruit' : f.verdict === 'fausse-piste' ? 'Fausse piste' : 'À qualifier',
    details: f.text, evidence: f.evidence,
  })), [data.feed]);
  const chronoItems = data.chronology.map((c, i) => ({ id: `c${i}`, day: c.phase, time: c.when, action: c.text, actor: '', status: null, evidence: c.evidence }));

  return (
    <div className="stack">
      <Segmented value={view} onChange={setView} ariaLabel="Vue" options={[
        { value: 'feed', label: 'Fil des annonces', count: data.feed.length },
        { value: 'chrono', label: 'Chronologie de l’attaque', count: data.chronology.length },
        { value: 'backup', label: 'Journal Veeam (A-05)' },
      ]} />
      {view === 'feed' && <Card title="Fil de la journée — annonces du SOC" subtitle="Dans l’ordre où la cellule les a reçues · J1 : 14 annonces, J2 : 21 annonces"><ActivityTimeline items={feedItems} showCell={false} /></Card>}
      {view === 'chrono' && <Card title="Déroulé de l’attaque" subtitle="Chronologie_incident_J1_J2.docx · horodatages relatifs tels que fournis"><ActivityTimeline items={chronoItems} showCell={false} /></Card>}
      {view === 'backup' && (
        <Card title="Historique des travaux Veeam" subtitle="VBR-01 · export J1 15:15" flush>
          <div className="table-wrap">
            <table className="table table--compact">
              <thead><tr><th>Date</th><th>Heure</th><th>Travail</th><th>Statut</th><th>Opérateur</th></tr></thead>
              <tbody>
                {data.backupJobs.map((j, i) => (
                  <tr key={i}>
                    <td className="mono">{j.day}</td><td className="mono">{j.time}</td><td className="strong">{j.job}</td>
                    <td><StatusBadge size="sm" tone={j.status === 'Succès' ? 'good' : j.status === 'Ignoré' || j.status === 'Injoignable' ? 'serious' : 'critical'}>{j.status}</StatusBadge></td>
                    <td className={j.operator === 'svc_oasisnet' ? 'mono' : ''} style={j.operator === 'svc_oasisnet' ? { color: 'var(--critical-text)' } : undefined}>{j.operator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export function SocIntel({ data }) {
  const { toast } = useToast();
  const [type, setType] = useState('all');
  const types = [...new Set(data.iocs.map((i) => i.type))];
  const copy = (v) => {
    navigator.clipboard?.writeText(v).then(() => toast('IOC copié', { description: v, tone: 'info' })).catch(() => toast('Copie impossible', { tone: 'warning' }));
  };
  const columns = [
    { key: 'type', header: 'Type', nowrap: true, render: (r) => <Badge size="sm" tone="outline" className="badge--outline">{r.type}</Badge> },
    { key: 'value', header: 'Valeur', render: (r) => <span className="mono" style={{ color: 'var(--text-primary)' }}>{r.value}</span> },
    { key: 'role', header: 'Rôle' },
    { key: 'evidence', header: 'Pièces', sortable: false, accessor: (r) => r.evidence.join(' '), render: (r) => <EvidenceChips refs={r.evidence} /> },
    { key: 'rep', header: 'Réputation', sortable: false, exportable: false, render: () => <span className="muted">N/A</span> },
    { key: 'copy', header: '', sortable: false, exportable: false, render: (r) => <button type="button" className="btn btn--ghost btn--icon btn--sm" onClick={(e) => { e.stopPropagation(); copy(r.value); }} aria-label="Copier l’IOC"><Copy size={13} /></button> },
  ];
  return (
    <div className="stack">
      <Card flush title="Indicateurs de compromission" subtitle={data.iocNote}>
        <DataTable rows={data.iocs} columns={columns} rowKey={(r) => r.value} filters={{ type }} exportName="soc-ioc" pageSize={15}
          toolbar={<Select value={type} onChange={setType} ariaLabel="Type d’IOC" options={[{ value: 'all', label: 'Tous les types' }, ...types.map((t) => ({ value: t, label: t }))]} />} />
      </Card>
    </div>
  );
}

export function SocMitre({ data }) {
  return (
    <div className="stack">
      <div className="mitre-grid">
        {data.mitre.map((t) => (
          <div key={t.id} className={`mitre-col ${t.inChain ? '' : 'is-outside'}`}>
            <div className="mitre-col__head">{t.label}<span className="muted small">{t.techniques.length}</span></div>
            {t.techniques.map((tech) => (
              <div key={tech.id} className="mitre-cell">
                <div className="mono small" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{tech.id}</div>
                <div className="small">{tech.name}</div>
                <div style={{ marginTop: 6 }}><EvidenceChips refs={tech.evidence} /></div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="tiny muted">T1486 citée par A-01, la fiche « .mirage » et A-12 · T1078 relève aussi de la persistance · rattachement aux tactiques selon le référentiel ATT&CK.</p>
    </div>
  );
}

export function SocAssets({ data }) {
  const [state, setState] = useState('all');
  const columns = [
    { key: 'name', header: 'Hôte', render: (r) => <span className="mono strong">{r.name}</span> },
    { key: 'label', header: 'Rôle' },
    { key: 'state', header: 'État', sortValue: (r) => Object.keys(ASSET_STATES).indexOf(r.state), render: (r) => <StatusBadge size="sm" tone={ASSET_STATES[r.state].tone}>{ASSET_STATES[r.state].label}</StatusBadge> },
    { key: 'stateNote', header: 'Note' },
    { key: 'ip', header: 'Adresse IP', sortable: false, render: () => <span className="muted">N/A</span>, exportable: false },
    { key: 'os', header: 'OS', sortable: false, render: () => <span className="muted">N/A</span>, exportable: false },
  ];
  return (
    <Card flush title="Actifs identifiés" subtitle="Sources : A-01, A-05, A-09, A-13, fiches de triage · adresse IP, OS : non fournis (N/A)">
      <DataTable rows={data.assets} columns={columns} rowKey={(r) => r.id} filters={{ state }} exportName="soc-actifs" pageSize={12}
        toolbar={<Select value={state} onChange={setState} ariaLabel="État" options={[{ value: 'all', label: 'Tous les états' }, ...Object.entries(ASSET_STATES).map(([k, v]) => ({ value: k, label: v.label }))]} />} />
    </Card>
  );
}

export function SocVulns({ data }) {
  const columns = [
    { key: 'title', header: 'Faiblesse constatée', strong: true },
    { key: 'severity', header: 'Sévérité*', sortValue: (r) => ['critical', 'high', 'medium', 'unknown', 'low'].indexOf(r.severity), render: (r) => <SeverityBadge severity={r.severity} size="sm" /> },
    { key: 'evidence', header: 'Pièces', sortable: false, accessor: (r) => r.evidence.join(' '), render: (r) => <EvidenceChips refs={r.evidence} /> },
    { key: 'remediation', header: 'Remédiation' },
    { key: 'cve', header: 'CVE', sortable: false, exportable: false, render: () => <span className="muted">N/A</span> },
  ];
  return (
    <Card flush title="Faiblesses de sécurité" subtitle={data.vulnerabilityNote}>
      <DataTable rows={data.vulnerabilities} columns={columns} rowKey={(r) => r.title} hideSearch exportName="soc-faiblesses" />
    </Card>
  );
}
