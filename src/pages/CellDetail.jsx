import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { cellService } from '../services/cellService';
import { cellDashboardService } from '../services/cellDataService';
import { cellDashboards } from '../features/registry';
import { AsyncContent, LoadingState } from '../components/common/States';
import { Breadcrumbs } from '../components/common/PageHeader';
import { CellHero } from '../features/shared';
import NotFound from './NotFound';

async function load(id) {
  const [cell, data] = await Promise.all([cellService.get(id), cellDashboardService[id]()]);
  return { cell, data };
}

export default function CellDetail() {
  const { id } = useParams();
  const known = Boolean(cellDashboardService[id]);
  const state = useAsync(() => (known ? load(id) : Promise.resolve(null)), [id]);
  if (!known) return <NotFound />;
  const Dashboard = cellDashboards[id];

  return (
    <AsyncContent state={state}>
      {({ cell, data }) => (
        <>
          <Breadcrumbs items={[{ label: 'Tableau de bord', to: '/dashboard' }, { label: 'Cellules', to: '/cellules' }, { label: cell.fullName }]} />
          <CellHero cell={cell} />
          <Suspense fallback={<LoadingState variant="block" />}>
            <Dashboard cell={cell} data={data} />
          </Suspense>
        </>
      )}
    </AsyncContent>
  );
}
