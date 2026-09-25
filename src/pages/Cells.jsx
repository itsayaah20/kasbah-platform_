import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Eye, Network } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { cellService } from '../services/cellService';
import { activityService } from '../services/activityService';
import { useAlerts } from '../context/AlertsContext';
import { PageHeader } from '../components/common/PageHeader';
import { AsyncContent } from '../components/common/States';
import { Segmented, ProgressBar, UserAvatar } from '../components/common/Controls';
import { CellCard } from '../components/cards/CellCard';
import { Card } from '../components/common/Card';
import { DataTable } from '../components/tables/DataTable';
import { CellIcon } from '../components/common/CellIcon';
import { StatusBadge } from '../components/common/Badge';

async function load() {
  const [cells, activities] = await Promise.all([cellService.list(), activityService.list()]);
  return { cells, activities };
}

export default function Cells() {
  const state = useAsync(load, []);
  const { alerts } = useAlerts();
  const [view, setView] = useState('cards');
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Tableau de bord', to: '/dashboard' }, { label: 'Cellules' }]}
        eyebrow="Organisation de crise"
        title="Cellules de crise"
        description="Chaque cellule dispose de son propre espace, construit à partir de ses documents dans le dossier Data."
        actions={(
          <>
            <Link to="/relations" className="btn"><Network size={15} /> Relations</Link>
            <Segmented value={view} onChange={setView} ariaLabel="Affichage" options={[{ value: 'cards', label: 'Cartes', icon: LayoutGrid }, { value: 'table', label: 'Tableau', icon: List }]} />
          </>
        )}
      />
      <AsyncContent state={state}>
        {({ cells, activities }) => {
          const rows = cells.map((c) => {
            const own = alerts.filter((a) => a.cellId === c.id && !a.archived);
            const last = activities.find((a) => a.cellId === c.id && a.time);
            return {
              ...c,
              alertCount: own.length,
              critical: own.filter((a) => a.severity === 'critical').length,
              activityCount: activities.filter((a) => a.cellId === c.id).length,
              last: last ? `${last.day} ${last.time}` : null,
              lastSort: last?.sortKey ?? -1e9,
            };
          });

          if (view === 'cards') {
            return (
              <div className="grid grid-3">
                {rows.map((c) => <CellCard key={c.id} cell={c} alerts={c.alertCount} criticalAlerts={c.critical} activities={c.activityCount} lastActivity={c.last} />)}
              </div>
            );
          }

          const columns = [
            { key: 'fullName', header: 'Cellule', render: (c) => <span className="row" style={{ gap: 10 }}><CellIcon cell={c} size={15} /><strong>{c.fullName}</strong></span> },
            { key: 'responsible', header: 'Responsable', accessor: (c) => c.responsible?.name, render: (c) => (c.responsible ? <span className="row" style={{ gap: 6 }}><UserAvatar name={c.responsible.name} size="sm" />{c.responsible.name}</span> : 'N/A') },
            { key: 'status', header: 'Statut', sortable: false, render: () => <StatusBadge tone="info" size="sm">Mobilisée</StatusBadge>, exportable: false },
            { key: 'members', header: 'Membres', accessor: (c) => c.members.length, align: 'right' },
            { key: 'docs', header: 'Documents', accessor: (c) => c.documents.length, align: 'right' },
            { key: 'activityCount', header: 'Activités', align: 'right' },
            { key: 'alertCount', header: 'Alertes', align: 'right', render: (c) => <span className="row" style={{ justifyContent: 'flex-end', gap: 6 }}>{c.critical > 0 && <StatusBadge tone="critical" size="sm">{c.critical}</StatusBadge>}{c.alertCount}</span> },
            { key: 'progress', header: 'Actions faites', accessor: (c) => c.progress.pct ?? -1, render: (c) => (c.progress.total ? <div style={{ minWidth: 120 }}><ProgressBar value={c.progress.pct} valueLabel={`${c.progress.done}/${c.progress.total}`} label=" " /></div> : <span className="muted">N/A</span>) },
            { key: 'last', header: 'Dernière activité', sortValue: (c) => c.lastSort, nowrap: true, render: (c) => <span className="mono small">{c.last || 'N/A'}</span> },
            { key: 'view', header: '', sortable: false, exportable: false, render: (c) => <Link className="btn btn--sm" to={`/cellules/${c.id}`} onClick={(e) => e.stopPropagation()}><Eye size={13} /> Ouvrir</Link> },
          ];
          return (
            <Card flush>
              <DataTable rows={rows} columns={columns} onRowClick={(c) => navigate(`/cellules/${c.id}`)} exportName="kasbah-cellules" />
            </Card>
          );
        }}
      </AsyncContent>
    </>
  );
}
