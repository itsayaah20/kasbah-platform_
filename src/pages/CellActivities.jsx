import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { cellService } from '../services/cellService';
import { activityService } from '../services/activityService';
import { useAlerts } from '../context/AlertsContext';
import { AsyncContent, EmptyState } from '../components/common/States';
import { Breadcrumbs } from '../components/common/PageHeader';
import { CellHero } from '../features/shared';
import { Card } from '../components/common/Card';
import { ActivityTimeline } from '../components/activity/ActivityTimeline';
import { AlertCard } from '../components/alerts/AlertCard';
import { Segmented, SearchBar } from '../components/common/Controls';
import { normalize } from '../utils/format';
import NotFound from './NotFound';
import { getCellMeta } from '../services/cellService';

async function load(id) {
  const [cell, activities] = await Promise.all([cellService.get(id), activityService.list()]);
  return { cell, activities: activities.filter((a) => a.cellId === id) };
}

export default function CellActivities() {
  const { id } = useParams();
  const state = useAsync(() => load(id), [id]);
  const { alerts, markRead, archive } = useAlerts();
  const [kind, setKind] = useState('all');
  const [query, setQuery] = useState('');
  if (!getCellMeta(id)) return <NotFound />;

  return (
    <AsyncContent state={state}>
      {({ cell, activities }) => {
        const q = normalize(query);
        const list = activities.filter((a) => (kind === 'all' || a.kind === kind) && (!q || normalize(`${a.action} ${a.actor} ${a.details}`).includes(q)));
        const kinds = [...new Set(activities.map((a) => a.kind))];
        const LABEL = { logbook: 'Main courante', evidence: 'Pièces', signal: 'Signaux', message: 'Messages', decision: 'Décisions', document: 'Documents' };
        const own = alerts.filter((a) => a.cellId === id && !a.archived);
        return (
          <>
            <Breadcrumbs items={[{ label: 'Cellules', to: '/cellules' }, { label: cell.fullName, to: `/cellules/${id}` }, { label: 'Activités' }]} />
            <CellHero cell={cell} />
            <div className="grid grid-main-side">
              <Card title={`Activités — ${cell.fullName}`} subtitle={`${activities.length} entrées tirées des documents`}>
                <div className="filter-bar">
                  <Segmented value={kind} onChange={setKind} ariaLabel="Type" options={[{ value: 'all', label: 'Tout', count: activities.length }, ...kinds.map((k) => ({ value: k, label: LABEL[k] || k, count: activities.filter((a) => a.kind === k).length }))]} />
                  <SearchBar value={query} onChange={setQuery} width={220} />
                </div>
                {list.length ? <ActivityTimeline items={list} showCell={false} /> : <EmptyState title="Aucune activité" description="Aucune activité ne correspond aux filtres." />}
              </Card>
              <Card title="Alertes de la cellule" subtitle={`${own.length} alerte(s) active(s)`} flush>
                {own.length ? own.slice(0, 12).map((a) => (
                  <AlertCard key={a.id} alert={a} compact onToggleRead={() => markRead(a.id, !a.read)} onArchive={() => archive(a.id)} />
                )) : <EmptyState title="Aucune alerte" />}
              </Card>
            </div>
          </>
        );
      }}
    </AsyncContent>
  );
}
