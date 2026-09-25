import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { evidenceService } from '../services/evidenceService';
import { PageHeader } from '../components/common/PageHeader';
import { AsyncContent } from '../components/common/States';
import { Card } from '../components/common/Card';
import { DataTable } from '../components/tables/DataTable';
import { Segmented } from '../components/common/Controls';
import { VerdictBadge, Badge } from '../components/common/Badge';
import { EvidenceModal } from '../components/alerts/EvidenceModal';

export default function Evidence() {
  const state = useAsync(() => evidenceService.list(), []);
  const [params, setParams] = useSearchParams();
  const [verdict, setVerdict] = useState('all');
  const ref = params.get('ref');
  const setRef = (r) => { const p = new URLSearchParams(params); if (r) p.set('ref', r); else p.delete('ref'); setParams(p, { replace: true }); };

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Tableau de bord', to: '/dashboard' }, { label: 'Pièces à conviction' }]}
        eyebrow="Monitoring"
        title="Pièces à conviction"
        description="Les 21 fiches de traçabilité (captures, SHA-256, chaîne de custody), les 6 pièces présentées sur la plateforme KASBAH, et le verdict posé par la cellule sur chacune."
      />
      <AsyncContent state={state}>
        {({ items }) => {
          const open = items.find((e) => e.ref === ref) || null;
          const columns = [
            { key: 'ref', header: 'Pièce', nowrap: true, sortValue: (e) => Number(e.ref.slice(2)), render: (e) => <span className="chip">{e.ref}</span> },
            { key: 'title', header: 'Intitulé', strong: true },
            { key: 'tool', header: 'Source / outil' },
            { key: 'date', header: 'Date', render: (e) => <span className="small">{e.date}</span> },
            { key: 'verdict', header: 'Verdict fiche', render: (e) => <VerdictBadge verdict={e.verdict} size="sm" /> },
            { key: 'cellVerdict', header: 'Verdict cellule', accessor: (e) => e.cellVerdict?.verdict || '', render: (e) => (e.cellVerdict ? <span className="row" style={{ gap: 4 }}><VerdictBadge verdict={e.cellVerdict.verdict} size="sm" />{e.cellVerdict.verdict !== e.verdict && e.verdict !== 'a-confirmer' && <Badge size="sm" tone="warning">≠</Badge>}</span> : <span className="muted small">Non qualifiée</span>) },
            { key: 'hasSheet', header: 'Source', accessor: (e) => (e.hasSheet ? 'Fiche' : e.platform ? 'Plateforme' : 'Citée'), render: (e) => (e.hasSheet ? <Badge size="sm" tone="good">Fiche</Badge> : e.platform ? <Badge size="sm" tone="info">Plateforme</Badge> : <Badge size="sm">Citée</Badge>) },
            { key: 'day', header: 'Jour', nowrap: true },
          ];
          return (
            <>
              <Card flush>
                <DataTable
                  rows={items} columns={columns} rowKey={(e) => e.ref} filters={{ verdict }} onRowClick={(e) => setRef(e.ref)} pageSize={15} exportName="pieces-a-conviction"
                  initialSort={{ key: 'ref', dir: 'asc' }}
                  toolbar={<Segmented value={verdict} onChange={setVerdict} ariaLabel="Verdict" options={[
                    { value: 'all', label: 'Toutes', count: items.length },
                    { value: 'preuve', label: 'Preuves', count: items.filter((e) => e.verdict === 'preuve').length },
                    { value: 'a-confirmer', label: 'À confirmer', count: items.filter((e) => e.verdict === 'a-confirmer').length },
                    { value: 'fausse-piste', label: 'Fausses pistes', count: items.filter((e) => e.verdict === 'fausse-piste').length },
                    { value: 'bruit', label: 'Bruit', count: items.filter((e) => e.verdict === 'bruit').length },
                  ]} />}
                />
              </Card>
              <EvidenceModal evidence={open} onClose={() => setRef(null)} />
            </>
          );
        }}
      </AsyncContent>
    </>
  );
}
