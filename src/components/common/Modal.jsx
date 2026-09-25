import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, TriangleAlert } from 'lucide-react';

function useEscape(open, onClose) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
}

export function Modal({ open, onClose, title, subtitle, children, footer, size, className = '', labelledBy }) {
  const ref = useRef(null);
  useEscape(open, onClose);
  useEffect(() => { if (open) ref.current?.focus(); }, [open]);
  if (!open) return null;
  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} tabIndex={-1} className={`modal ${size ? `modal--${size}` : ''} ${className}`} role="dialog" aria-modal="true" aria-label={labelledBy || (typeof title === 'string' ? title : undefined)}>
        {title && (
          <div className="modal__header">
            <div className="grow">
              <h2>{title}</h2>
              {subtitle && <div className="muted small" style={{ marginTop: 4 }}>{subtitle}</div>}
            </div>
            <button type="button" className="btn btn--ghost btn--icon btn--sm" onClick={onClose} aria-label="Fermer"><X size={16} /></button>
          </div>
        )}
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export function ConfirmDialog({ open, onCancel, onConfirm, title, message, confirmLabel = 'Confirmer', danger = false }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      size="sm"
      title={title}
      footer={(
        <>
          <button type="button" className="btn" onClick={onCancel}>Annuler</button>
          <button type="button" className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`} onClick={onConfirm}>{confirmLabel}</button>
        </>
      )}
    >
      <div className="row" style={{ alignItems: 'flex-start', gap: 12 }}>
        {danger && <TriangleAlert size={20} style={{ color: 'var(--critical-text)', flexShrink: 0 }} />}
        <p className="secondary">{message}</p>
      </div>
    </Modal>
  );
}

export function Drawer({ open, onClose, title, children, actions }) {
  useEscape(open, onClose);
  if (!open) return null;
  return createPortal(
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={title}>
        <div className="drawer__header">
          <h2>{title}</h2>
          <div className="row">
            {actions}
            <button type="button" className="btn btn--ghost btn--icon btn--sm" onClick={onClose} aria-label="Fermer"><X size={16} /></button>
          </div>
        </div>
        <div className="drawer__body">{children}</div>
      </aside>
    </>,
    document.body,
  );
}
