import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, CornerDownLeft } from 'lucide-react';
import { search } from '../../services/searchService';
import { Badge } from '../common/Badge';

const SUGGESTIONS = ['45.137.184.62', 'svc_oasisnet', 'FIN-112', 'T1486', 'CNDP', 'A-12'];

export function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const results = useMemo(() => search(query), [query]);

  useEffect(() => { if (open) { setQuery(''); setActive(0); } }, [open]);
  useEffect(() => { setActive(0); }, [query]);

  if (!open) return null;

  const go = (item) => { onClose(); navigate(item.to); };
  const onKey = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[active]) go(results[active]);
  };

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal palette" role="dialog" aria-modal="true" aria-label="Recherche globale">
        <div className="palette__input">
          <Search size={18} className="muted" />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKey} placeholder="Pièce, IP, hôte, IOC, compte, technique, personne…" aria-label="Recherche globale" />
          <span className="kbd">Échap</span>
        </div>
        <div className="palette__results">
          {query.trim().length < 2 ? (
            <div style={{ padding: 12 }}>
              <div className="small muted" style={{ marginBottom: 8 }}>Essayez :</div>
              <div className="row-wrap">
                {SUGGESTIONS.map((s) => <button key={s} type="button" className="chip" onClick={() => setQuery(s)}>{s}</button>)}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="state"><div className="state__title">Aucun résultat</div><div className="state__desc">Aucune donnée du dossier ne correspond à « {query} ».</div></div>
          ) : (
            results.map((r, i) => (
              <button key={`${r.type}-${r.label}`} type="button" className={`palette__item ${i === active ? 'is-active' : ''}`} onMouseEnter={() => setActive(i)} onClick={() => go(r)}>
                <Badge size="sm" tone="outline" className="badge--outline">{r.type}</Badge>
                <div className="grow">
                  <div className="palette__item-label">{r.label}</div>
                  <div className="palette__item-sub">{r.sub}</div>
                </div>
                {i === active && <CornerDownLeft size={14} className="muted" />}
              </button>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
