import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useTable } from '../../hooks/useTable';
import { SearchBar } from '../common/Controls';
import { EmptyState } from '../common/States';

// Tableau générique : recherche, tri, filtres externes, pagination, sélection,
// export CSV. Les colonnes décrivent le rendu ; les données restent brutes.
export function DataTable({
  rows,
  columns,
  pageSize = 10,
  initialSort,
  filters,
  searchPlaceholder = 'Rechercher dans le tableau…',
  toolbar,
  onRowClick,
  selectable = false,
  selected = [],
  onSelectedChange,
  bulkActions,
  rowKey = (r) => r.id,
  compact = false,
  exportName,
  emptyTitle = 'Aucun résultat',
  hideSearch = false,
}) {
  const t = useTable(rows, columns, { pageSize, initialSort, filters });
  const allKeys = t.allRows.map(rowKey);
  const allSelected = selectable && allKeys.length > 0 && allKeys.every((k) => selected.includes(k));

  const toggleAll = () => onSelectedChange(allSelected ? [] : allKeys);
  const toggleOne = (k) => onSelectedChange(selected.includes(k) ? selected.filter((x) => x !== k) : [...selected, k]);

  const exportCsv = () => {
    const cols = columns.filter((c) => c.exportable !== false);
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [cols.map((c) => esc(c.header)).join(';'), ...t.allRows.map((r) => cols.map((c) => esc(c.accessor ? c.accessor(r) : r[c.key])).join(';'))];
    const blob = new Blob([`﻿${lines.join('\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {(!hideSearch || toolbar || exportName) && (
        <div className="filter-bar" style={{ padding: '0 14px' }}>
          {!hideSearch && <SearchBar value={t.query} onChange={t.setQuery} placeholder={searchPlaceholder} width={280} />}
          {toolbar}
          <span className="filter-bar__spacer" />
          <span className="small muted num">{t.total} ligne{t.total > 1 ? 's' : ''}</span>
          {exportName && (
            <button type="button" className="btn btn--sm" onClick={exportCsv} title="Exporter en CSV"><Download size={13} /> CSV</button>
          )}
        </div>
      )}

      {selectable && selected.length > 0 && (
        <div className="bulk-bar">
          <strong>{selected.length} sélectionné{selected.length > 1 ? 's' : ''}</strong>
          {bulkActions}
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => onSelectedChange([])}>Désélectionner</button>
        </div>
      )}

      <div className="table-wrap">
        <table className={`table ${compact ? 'table--compact' : ''}`}>
          <thead>
            <tr>
              {selectable && (
                <th style={{ width: 36 }}>
                  <input type="checkbox" className="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Tout sélectionner" />
                </th>
              )}
              {columns.map((c) => {
                const sortable = c.sortable !== false;
                const sorted = t.sort?.key === c.key;
                const SortIcon = sorted ? (t.sort.dir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th
                    key={c.key}
                    className={`${sortable ? 'is-sortable' : ''} ${sorted ? 'is-sorted' : ''}`}
                    style={{ width: c.width, textAlign: c.align }}
                    onClick={sortable ? () => t.toggleSort(c.key) : undefined}
                    aria-sort={sorted ? (t.sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    {c.header}
                    {sortable && <span className="sort-icon"><SortIcon size={12} /></span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((row) => {
              const k = rowKey(row);
              const isSel = selected.includes(k);
              return (
                <tr key={k} className={`${onRowClick ? 'is-clickable' : ''} ${isSel ? 'is-selected' : ''}`} onClick={onRowClick ? () => onRowClick(row) : undefined}>
                  {selectable && (
                    <td onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="checkbox" checked={isSel} onChange={() => toggleOne(k)} aria-label="Sélectionner la ligne" />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className={c.strong ? 'strong' : undefined} style={{ textAlign: c.align, whiteSpace: c.nowrap ? 'nowrap' : undefined }}>
                      {c.render ? c.render(row) : (c.accessor ? c.accessor(row) : row[c.key]) ?? <span className="muted">N/A</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {t.total === 0 && <EmptyState title={emptyTitle} description="Modifiez la recherche ou les filtres." />}
      </div>

      {t.pageCount > 1 && (
        <div className="table-footer">
          <span>Page {t.page} sur {t.pageCount}</span>
          <div className="pagination">
            <button type="button" className="btn btn--sm btn--icon" disabled={t.page <= 1} onClick={() => t.setPage(t.page - 1)} aria-label="Page précédente"><ChevronLeft size={14} /></button>
            {Array.from({ length: t.pageCount }, (_, i) => i + 1).slice(Math.max(0, t.page - 3), Math.max(0, t.page - 3) + 5).map((p) => (
              <button key={p} type="button" className={`btn btn--sm ${p === t.page ? 'btn--primary' : 'btn--ghost'}`} onClick={() => t.setPage(p)}>{p}</button>
            ))}
            <button type="button" className="btn btn--sm btn--icon" disabled={t.page >= t.pageCount} onClick={() => t.setPage(t.page + 1)} aria-label="Page suivante"><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
