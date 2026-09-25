import { useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import { userService } from '../services/userService';
import { allCells, getCellMeta } from '../services/cellService';
import { useTabParam } from '../hooks/useMisc';
import { PageHeader } from '../components/common/PageHeader';
import { AsyncContent } from '../components/common/States';
import { Card } from '../components/common/Card';
import { DataTable } from '../components/tables/DataTable';
import { Tabs, Select, UserAvatar } from '../components/common/Controls';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { KeyValue } from '../components/common/Card';

export default function Users() {
  const state = useAsync(() => userService.list(), []);
  const [tab, setTab] = useTabParam('membres');
  const [cell, setCell] = useState('all');
  const [org, setOrg] = useState('all');
  const [open, setOpen] = useState(null);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Tableau de bord', to: '/dashboard' }, { label: 'Utilisateurs' }]}
        eyebrow="Système"
        title="Utilisateurs & acteurs"
        description="Membres des cellules et acteurs du scénario, tels que nommés dans les documents. Aucun contact n’est inventé."
      />
      <AsyncContent state={state}>
        {({ members, stakeholders }) => (
          <>
            <Tabs value={tab} onChange={setTab} tabs={[{ id: 'membres', label: 'Membres des cellules', count: members.length }, { id: 'acteurs', label: 'Acteurs du scénario', count: stakeholders.length }]} />
            {tab === 'membres' ? (
              <Card flush>
                <DataTable
                  rows={members}
                  rowKey={(m) => m.id}
                  filters={{ cellId: cell }}
                  onRowClick={setOpen}
                  exportName="kasbah-membres"
                  toolbar={<Select value={cell} onChange={setCell} ariaLabel="Cellule" options={[{ value: 'all', label: 'Toutes les cellules' }, ...allCells.map((c) => ({ value: c.id, label: c.fullName }))]} />}
                  columns={[
                    { key: 'name', header: 'Nom', render: (m) => <span className="row" style={{ gap: 8 }}><UserAvatar name={m.name} size="sm" color={m.lead ? getCellMeta(m.cellId).color : undefined} /><strong>{m.name}</strong></span> },
                    { key: 'cell', header: 'Cellule', accessor: (m) => getCellMeta(m.cellId).fullName, render: (m) => { const c = getCellMeta(m.cellId); return <span className="row" style={{ gap: 6 }}><span className="cell-dot" style={{ background: c.color }} />{c.fullName}</span>; } },
                    { key: 'role', header: 'Rôle' },
                    { key: 'lead', header: 'Référent', accessor: (m) => (m.lead ? 'Oui' : ''), render: (m) => (m.lead ? <Badge tone="brand" size="sm">Référent</Badge> : null) },
                    { key: 'source', header: 'Source', render: (m) => <span className="tiny muted">{m.source}</span> },
                    { key: 'email', header: 'E-mail', sortable: false, exportable: false, render: () => <span className="muted">N/A</span> },
                  ]}
                />
              </Card>
            ) : (
              <Card flush>
                <DataTable
                  rows={stakeholders}
                  rowKey={(s) => s.id}
                  filters={{ org }}
                  exportName="kasbah-acteurs"
                  toolbar={<Select value={org} onChange={setOrg} ariaLabel="Organisation" options={[{ value: 'all', label: 'Toutes les organisations' }, ...[...new Set(stakeholders.map((s) => s.org))].map((o) => ({ value: o, label: o }))]} />}
                  columns={[
                    { key: 'name', header: 'Nom', render: (s) => <span className="row" style={{ gap: 8 }}><UserAvatar name={s.name} size="sm" /><strong>{s.name}</strong></span> },
                    { key: 'org', header: 'Organisation', render: (s) => <Badge size="sm">{s.org}</Badge> },
                    { key: 'role', header: 'Rôle' },
                    { key: 'note', header: 'Rôle dans l’incident', render: (s) => <span className="small">{s.note}</span> },
                    { key: 'source', header: 'Source', render: (s) => <span className="tiny muted">{s.source}</span> },
                  ]}
                />
              </Card>
            )}
            {open && (
              <Modal open onClose={() => setOpen(null)} title={open.name} subtitle={open.role} size="sm">
                <div className="row" style={{ gap: 12, marginBottom: 16 }}><UserAvatar name={open.name} size="lg" color={getCellMeta(open.cellId).color} /><div><div style={{ fontWeight: 600 }}>{open.name}</div><div className="small muted">{getCellMeta(open.cellId).fullName}</div></div></div>
                <KeyValue items={[['Cellule', getCellMeta(open.cellId).fullName], ['Rôle', open.role], ['Référent', open.lead ? 'Oui' : 'Non'], ['E-mail', null], ['Téléphone', null], ['Source', open.source]]} />
              </Modal>
            )}
          </>
        )}
      </AsyncContent>
    </>
  );
}
