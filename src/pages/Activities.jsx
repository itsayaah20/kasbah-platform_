import { useState } from 'react';
import { List, GitCommitVertical } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { activityService } from '../services/activityService';
import { allCells, getCellMeta } from '../services/cellService';
import { PageHeader } from '../components/common/PageHeader';
import { AsyncContent, EmptyState } from '../components/common/States';
import { Card } from '../components/common/Card';
import { Segmented, Select, SearchBar } from '../components/common/Controls';
import { ActivityTimeline } from '../components/activity/ActivityTimeline';
import { DataTable } from '../components/tables/DataTable';
import { Badge, EvidenceChips } from '../components/common/Badge';
import { normalize } from '../utils/format';

const KIND = { logbook: 'Main courante', evidence: 'Pièce qualifiée', signal: 'Signal', message: 'Message', decision: 'Décision', document: 'Document' };

export default function Activities() {
  const state = useAsync(() => activityService.list(), []);
  const [view, setView] = useState('timeline');
  const [cell, setCell] = useState('all');
  const [kind, setKind] = useState('all');
  const [day, setDay] = useState('all');
  const [query, setQuery] = useState('');

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Tableau de bord', to: '/dashboard' }, { label: 'Activités' }]}
        eyebrow="Monitoring"
        title="Activités du système"
        description="Toutes les actions tracées : main courante, fil du SOC, messages, décisions et documents déposés."
        actions={<Segmented value={view} onChange={setView} ariaLabel="Vue" options={[{ value: 'timeline', label: 'Timeline', icon: GitCommitVertical }, { value: 'table', label: 'Tableau', icon: List }]} />}
      />
      <AsyncContent state={state}>
        {(activities) => {
          const q = normalize(query);
          const list = activities.filter((a) => (cell === 'all' || a.cellId === cell) && (kind === 'all' || a.kind === kind) && (day === 'all' || a.day === day) && (!q || normalize(`${a.action} ${a.actor} ${a.details}`).includes(q)));
          const filters = (
            <>
              <Select value={cell} onChange={setCell} ariaLabel="Cellule" options={[{ value: 'all', label: 'Toutes les cellules' }, ...allCells.map((c) => ({ value: c.id, label: c.fullName }))]} />
              <Select value={kind} onChange={setKind} ariaLabel="Type" options={[{ value: 'all', label: 'Tous les types' }, ...Object.entries(KIND).map(([k, v]) => ({ value: k, label: v }))]} />
              <Select value={day} onChange={setDay} ariaLabel="Jour" options={[{ value: 'all', label: 'Tous les jours' }, { value: 'J1', label: 'J1' }, { value: 'J2', label: 'J2' }, { value: 'J3', label: 'J3' }]} />
            </>
          );
          if (view === 'table') {
            const columns = [
              { key: 'when', header: 'Date', sortValue: (a) => a.sortKey, accessor: (a) => `${a.day} ${a.time}`, nowrap: true, render: (a) => <span className="mono small">{a.day} {a.time}</span> },
              { key: 'actor', header: 'Utilisateur / source' },
              { key: 'cell', header: 'Cellule', accessor: (a) => getCellMeta(a.cellId)?.name || '—', render: (a) => { const c = getCellMeta(a.cellId); return c ? <span className="row" style={{ gap: 6 }}><span className="cell-dot" style={{ background: c.color }} />{c.name}</span> : <span className="muted">—</span>; } },
              { key: 'action', header: 'Action', strong: true },
              { key: 'kind', header: 'Type', accessor: (a) => KIND[a.kind] },
              { key: 'status', header: 'Statut', render: (a) => <Badge size="sm">{a.status}</Badge> },
              { key: 'evidence', header: 'Pièces', sortable: false, accessor: (a) => (a.evidence || []).join(' '), render: (a) => <EvidenceChips refs={a.evidence || []} max={3} /> },
            ];
            return <Card flush><DataTable rows={list} columns={columns} rowKey={(a) => a.id} pageSize={15} exportName="kasbah-activites" toolbar={filters} initialSort={{ key: 'when', dir: 'desc' }} /></Card>;
          }
          return (
            <Card>
              <div className="filter-bar">{filters}<span className="filter-bar__spacer" /><SearchBar value={query} onChange={setQuery} width={240} /></div>
              <div className="small muted" style={{ marginBottom: 10 }}>{list.length} activité(s) · les entrées sans heure (messages, documents) portent un jour déduit de l’événement traité.</div>
              {list.length ? <ActivityTimeline items={list} /> : <EmptyState title="Aucune activité" />}
            </Card>
          );
        }}
      </AsyncContent>
    </>
  );
}
