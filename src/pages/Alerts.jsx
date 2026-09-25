import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCheck, Archive, Trash2, RotateCcw, BellRing, AlertOctagon, TriangleAlert, Info, CheckCircle2 } from 'lucide-react';
import { useAlerts } from '../context/AlertsContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/common/PageHeader';
import { Card, KeyValue } from '../components/common/Card';
import { Segmented, Select, SearchBar } from '../components/common/Controls';
import { AlertCard } from '../components/alerts/AlertCard';
import { EmptyState, ErrorState, LoadingState } from '../components/common/States';
import { Modal, ConfirmDialog } from '../components/common/Modal';
import { StatusBadge, EvidenceChips } from '../components/common/Badge';
import { StatCard } from '../components/cards/StatCard';
import { SEVERITIES } from '../services/alertService';
import { allCells, getCellMeta } from '../services/cellService';
import { normalize } from '../utils/format';

const PAGE = 20;

export default function Alerts() {
  const { alerts, loading, error, reload, markRead, archive, remove, resetAll } = useAlerts();
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();
  const [severity, setSeverity] = useState('all');
  const [cell, setCell] = useState('all');
  const [box, setBox] = useState('inbox');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);
  const [limit, setLimit] = useState(PAGE);
  const [confirm, setConfirm] = useState(null);

  const openId = params.get('id');
  const open = alerts.find((a) => a.id === openId) || null;
  useEffect(() => { if (open && !open.read) markRead(open.id); }, [open, markRead]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return alerts.filter((a) => {
      if (box === 'inbox' && a.archived) return false;
      if (box === 'unread' && (a.read || a.archived)) return false;
      if (box === 'archived' && !a.archived) return false;
      if (severity !== 'all' && a.severity !== severity) return false;
      if (cell !== 'all' && a.cellId !== cell) return false;
      if (q && !normalize(`${a.title} ${a.description} ${a.source}`).includes(q)) return false;
      return true;
    });
  }, [alerts, box, severity, cell, query]);

  const count = (sev) => alerts.filter((a) => !a.archived && a.severity === sev).length;
  const visible = filtered.slice(0, limit);
  const allSelected = visible.length > 0 && visible.every((a) => selected.includes(a.id));
  const setOpen = (id) => { const p = new URLSearchParams(params); if (id) p.set('id', id); else p.delete('id'); setParams(p, { replace: true }); };

  const bulk = (fn, label) => { fn(selected); toast(label, { description: `${selected.length} alerte(s)` }); setSelected([]); };

  if (loading && !alerts.length) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Tableau de bord', to: '/dashboard' }, { label: 'Alertes' }]}
        eyebrow="Monitoring"
        title="Centre d’alertes"
        description="Alertes dérivées des signaux du SOC, des échéances, des obligations et des points ouverts. L’état lu / archivé est conservé dans ce navigateur."
        actions={<button type="button" className="btn" onClick={() => setConfirm('reset')}><RotateCcw size={14} /> Réinitialiser</button>}
      />

      <div className="grid grid-kpi" style={{ marginBottom: 18 }}>
        <StatCard label="Critiques" value={count('critical')} icon={AlertOctagon} tone="critical" onClick={() => setSeverity('critical')} sub="Preuves et revendication" />
        <StatCard label="Avertissements" value={count('warning')} icon={TriangleAlert} tone="warning" onClick={() => setSeverity('warning')} sub="À qualifier, échéances, obligations" />
        <StatCard label="Informations" value={count('info')} icon={Info} tone="info" onClick={() => setSeverity('info')} sub="Déclarations, points ouverts" />
        <StatCard label="Résolues" value={count('success')} icon={CheckCircle2} tone="good" onClick={() => setSeverity('success')} sub="Pistes écartées, échéances tenues" />
      </div>

      <Card flush>
        <div className="filter-bar" style={{ padding: '0 14px' }}>
          <Segmented value={box} onChange={(v) => { setBox(v); setSelected([]); }} ariaLabel="Boîte" options={[
            { value: 'inbox', label: 'Actives', count: alerts.filter((a) => !a.archived).length },
            { value: 'unread', label: 'Non lues', count: alerts.filter((a) => !a.read && !a.archived).length },
            { value: 'archived', label: 'Archivées', count: alerts.filter((a) => a.archived).length },
          ]} />
          <Select value={severity} onChange={setSeverity} ariaLabel="Sévérité" options={[{ value: 'all', label: 'Toutes sévérités' }, ...Object.entries(SEVERITIES).map(([k, v]) => ({ value: k, label: v.label }))]} />
          <Select value={cell} onChange={setCell} ariaLabel="Cellule" options={[{ value: 'all', label: 'Toutes les cellules' }, ...allCells.map((c) => ({ value: c.id, label: c.fullName }))]} />
          <span className="filter-bar__spacer" />
          <SearchBar value={query} onChange={setQuery} placeholder="Rechercher une alerte…" width={240} />
        </div>
        <div className="bulk-bar" style={{ background: selected.length ? 'var(--accent-soft)' : 'var(--surface-2)' }}>
          <input type="checkbox" className="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : visible.map((a) => a.id))} aria-label="Tout sélectionner" />
          <span className="small">{selected.length ? `${selected.length} sélectionnée(s)` : `${filtered.length} alerte(s)`}</span>
          <span className="grow" />
          <button type="button" className="btn btn--sm btn--ghost" disabled={!selected.length} onClick={() => bulk((ids) => markRead(ids), 'Marquées comme lues')}><CheckCheck size={13} /> Lu</button>
          {box !== 'archived'
            ? <button type="button" className="btn btn--sm btn--ghost" disabled={!selected.length} onClick={() => bulk((ids) => archive(ids), 'Alertes archivées')}><Archive size={13} /> Archiver</button>
            : <button type="button" className="btn btn--sm btn--ghost" disabled={!selected.length} onClick={() => bulk((ids) => archive(ids, false), 'Alertes restaurées')}><RotateCcw size={13} /> Restaurer</button>}
          <button type="button" className="btn btn--sm btn--ghost" disabled={!selected.length} onClick={() => setConfirm('delete')}><Trash2 size={13} /> Supprimer</button>
        </div>

        {visible.length === 0 ? <EmptyState icon={BellRing} title="Aucune alerte" description="Aucune alerte ne correspond à ces filtres." /> : visible.map((a) => (
          <div key={a.id} className="row" style={{ alignItems: 'stretch', gap: 0 }}>
            <label className="row" style={{ padding: '0 0 0 14px', cursor: 'pointer' }}>
              <input type="checkbox" className="checkbox" checked={selected.includes(a.id)} onChange={() => setSelected((s) => (s.includes(a.id) ? s.filter((x) => x !== a.id) : [...s, a.id]))} aria-label={`Sélectionner ${a.title}`} />
            </label>
            <div className="grow">
              <AlertCard alert={a} onOpen={() => setOpen(a.id)} onToggleRead={() => markRead(a.id, !a.read)} onArchive={() => { archive(a.id, !a.archived); toast(a.archived ? 'Alerte restaurée' : 'Alerte archivée', { tone: 'info' }); }} />
            </div>
          </div>
        ))}
        {filtered.length > limit && (
          <div style={{ padding: 14, textAlign: 'center' }}>
            <button type="button" className="btn btn--sm" onClick={() => setLimit((l) => l + PAGE)}>Afficher plus ({filtered.length - limit} restantes)</button>
          </div>
        )}
      </Card>

      {open && (
        <Modal open onClose={() => setOpen(null)} title={open.title} subtitle={<StatusBadge tone={SEVERITIES[open.severity].tone} size="sm">{SEVERITIES[open.severity].label}</StatusBadge>}
          footer={(
            <>
              <button type="button" className="btn" onClick={() => { markRead(open.id, false); setOpen(null); }}>Marquer non lu</button>
              <button type="button" className="btn" onClick={() => { archive(open.id, !open.archived); setOpen(null); toast(open.archived ? 'Alerte restaurée' : 'Alerte archivée', { tone: 'info' }); }}>{open.archived ? 'Restaurer' : 'Archiver'}</button>
              <button type="button" className="btn btn--primary" onClick={() => setOpen(null)}>Fermer</button>
            </>
          )}>
          <p className="secondary" style={{ marginBottom: 16 }}>{open.description}</p>
          <KeyValue items={[
            ['Horodatage', <span key="t" className="mono">{[open.day, open.time].filter(Boolean).join(' ') || 'N/A'}</span>],
            ['Source', open.source],
            ['Cellule concernée', getCellMeta(open.cellId)?.fullName],
            ['Origine', open.origin],
            ['Statut', open.archived ? 'Archivée' : open.read ? 'Lue' : 'Non lue'],
            ['Pièces', open.evidence?.length ? <EvidenceChips key="e" refs={open.evidence} /> : null],
          ]} />
        </Modal>
      )}

      <ConfirmDialog
        open={confirm === 'delete'}
        title="Supprimer les alertes sélectionnées ?"
        message={`${selected.length} alerte(s) seront masquées de ce navigateur. « Réinitialiser » les rétablit.`}
        confirmLabel="Supprimer"
        danger
        onCancel={() => setConfirm(null)}
        onConfirm={() => { bulk((ids) => remove(ids), 'Alertes supprimées'); setConfirm(null); }}
      />
      <ConfirmDialog
        open={confirm === 'reset'}
        title="Réinitialiser le centre d’alertes ?"
        message="Toutes les alertes redeviennent non lues et les suppressions / archivages sont annulés."
        confirmLabel="Réinitialiser"
        onCancel={() => setConfirm(null)}
        onConfirm={() => { resetAll(); setConfirm(null); toast('Centre d’alertes réinitialisé'); }}
      />
    </>
  );
}
