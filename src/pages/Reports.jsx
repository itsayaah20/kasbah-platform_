import { useState } from 'react';
import { ExternalLink, Download, FileText, FileSpreadsheet, Presentation } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { documentService, documentUrl } from '../services/documentService';
import { allCells, getCellMeta } from '../services/cellService';
import { PageHeader } from '../components/common/PageHeader';
import { AsyncContent } from '../components/common/States';
import { Card } from '../components/common/Card';
import { DataTable } from '../components/tables/DataTable';
import { Select } from '../components/common/Controls';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/cards/StatCard';
import { formatBytes } from '../utils/format';
import { deliverables } from '../data/common/platformFeed';

const TYPE_ICON = { pdf: FileText, docx: FileSpreadsheet, pptx: Presentation };

export default function Reports() {
  const state = useAsync(() => documentService.list(), []);
  const [cell, setCell] = useState('all');
  const [type, setType] = useState('all');

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Tableau de bord', to: '/dashboard' }, { label: 'Rapports & documents' }]}
        eyebrow="Analytics"
        title="Rapports & documents"
        description="Les 27 documents sources du dossier Data, consultables et téléchargeables. Les PDF s’ouvrent dans le navigateur."
      />
      <AsyncContent state={state}>
        {(docs) => {
          const columns = [
            { key: 'type', header: 'Type', nowrap: true, render: (d) => { const I = TYPE_ICON[d.type] || FileText; return <span className="row" style={{ gap: 6 }}><I size={15} className="muted" /><span className="mono small" style={{ textTransform: 'uppercase' }}>{d.type}</span></span>; } },
            { key: 'title', header: 'Document', render: (d) => <><strong>{d.title}</strong><div className="tiny muted">{d.original}</div></> },
            { key: 'cell', header: 'Cellule', accessor: (d) => getCellMeta(d.cellId).name, render: (d) => { const c = getCellMeta(d.cellId); return <span className="row" style={{ gap: 6 }}><span className="cell-dot" style={{ background: c.color }} />{c.name}</span>; } },
            { key: 'kind', header: 'Nature', render: (d) => <Badge size="sm">{d.kind}</Badge> },
            { key: 'day', header: 'Jour', nowrap: true },
            { key: 'size', header: 'Taille', align: 'right', render: (d) => <span className="num small">{formatBytes(d.size)}</span> },
            { key: 'open', header: '', sortable: false, exportable: false, render: (d) => <a className="btn btn--sm" href={documentUrl(d)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>{d.type === 'pdf' ? <><ExternalLink size={13} /> Ouvrir</> : <><Download size={13} /> Télécharger</>}</a> },
          ];
          const total = docs.reduce((s, d) => s + d.size, 0);
          return (
            <div className="stack">
              <div className="grid grid-4">
                <StatCard label="Documents" value={docs.length} sub="Dans 6 dossiers de cellule" icon={FileText} provenance="real" />
                <StatCard label="PDF" value={docs.filter((d) => d.type === 'pdf').length} icon={FileText} />
                <StatCard label="Word / PowerPoint" value={docs.filter((d) => d.type !== 'pdf').length} icon={FileSpreadsheet} />
                <StatCard label="Volume total" value={formatBytes(total)} icon={Download} />
              </div>
              <Card title="Rendus déposés sur la plateforme KASBAH" subtitle="Fichiers remis par le répondant en réponse aux « rendus attendus »" flush>
                <div className="table-wrap">
                  <table className="table">
                    <thead><tr><th>Rendu</th><th>Demandé par</th><th>Fichier déposé</th><th>Dépôt</th><th>Dans Data</th></tr></thead>
                    <tbody>
                      {deliverables.flatMap((d) => d.deposits.map((dep) => (
                        <tr key={dep.file}>
                          <td className="strong">{d.title.replace('Rendu : ', '')}</td>
                          <td>{d.author}</td>
                          <td className="small">{dep.file}</td>
                          <td className="mono small nowrap">{dep.at}</td>
                          <td>{dep.inData ? <Badge size="sm" tone="good">Oui</Badge> : <Badge size="sm" tone="warning">Absent</Badge>}</td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </Card>
              <Card flush>
                <DataTable rows={docs} columns={columns} rowKey={(d) => d.id} filters={{ cellId: cell, type }} pageSize={15} exportName="kasbah-documents"
                  toolbar={(
                    <>
                      <Select value={cell} onChange={setCell} ariaLabel="Cellule" options={[{ value: 'all', label: 'Toutes les cellules' }, ...allCells.map((c) => ({ value: c.id, label: c.fullName }))]} />
                      <Select value={type} onChange={setType} ariaLabel="Type" options={[{ value: 'all', label: 'Tous les formats' }, { value: 'pdf', label: 'PDF' }, { value: 'docx', label: 'Word' }, { value: 'pptx', label: 'PowerPoint' }]} />
                    </>
                  )} />
              </Card>
            </div>
          );
        }}
      </AsyncContent>
    </>
  );
}
