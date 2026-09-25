import { useMemo, useState } from 'react';
import { normalize } from '../utils/format';

// Recherche, tri, filtres et pagination côté client pour DataTable.
// columns: [{ key, accessor?, sortValue?, searchable? }]
export function useTable(rows, columns, { pageSize = 10, initialSort = null, filters = {} } = {}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);

  const valueOf = (row, col) => (col.accessor ? col.accessor(row) : row[col.key]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return rows.filter((row) => {
      const passFilters = Object.entries(filters).every(([key, val]) => {
        if (val == null || val === 'all' || val === '') return true;
        const v = typeof key === 'string' && key.includes('.') ? key.split('.').reduce((o, k) => o?.[k], row) : row[key];
        return Array.isArray(v) ? v.includes(val) : v === val;
      });
      if (!passFilters) return false;
      if (!q) return true;
      return columns.some((col) => col.searchable !== false && normalize(String(valueOf(row, col) ?? '')).includes(q));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, JSON.stringify(filters)]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    const get = col.sortValue || ((r) => valueOf(r, col));
    return [...filtered].sort((a, b) => {
      const va = get(a);
      const vb = get(b);
      if (va == null) return 1;
      if (vb == null) return -1;
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'fr', { numeric: true });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pageCount);
  const pageRows = sorted.slice((current - 1) * pageSize, current * pageSize);

  const toggleSort = (key) => {
    setSort((s) => (s?.key === key ? (s.dir === 'asc' ? { key, dir: 'desc' } : null) : { key, dir: 'asc' }));
  };

  return {
    query,
    setQuery: (q) => { setQuery(q); setPage(1); },
    sort,
    toggleSort,
    page: current,
    setPage,
    pageCount,
    rows: pageRows,
    total: sorted.length,
    allRows: sorted,
  };
}
