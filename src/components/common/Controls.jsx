import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

export function ProgressBar({ value = 0, tone, label, valueLabel, height }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div>
      {(label || valueLabel) && (
        <div className="progress-label">
          <span>{label}</span>
          <span className="num">{valueLabel ?? `${v} %`}</span>
        </div>
      )}
      <div className={`progress ${tone ? `progress--${tone}` : ''}`} style={height ? { height } : undefined} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="progress__bar" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} className="tab" onClick={() => onChange(t.id)} type="button">
          {t.icon && <t.icon size={15} />}
          {t.label}
          {t.count != null && <span className="tab__count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Segmented({ options, value, onChange, ariaLabel }) {
  return (
    <div className="segmented" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
          {o.icon && <o.icon size={13} />}
          {o.label}
          {o.count != null && <span className="muted num">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = 'Rechercher…', autoFocus, width }) {
  return (
    <div className="search-bar" style={width ? { width } : undefined}>
      <Search size={15} />
      <input className="input" type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} aria-label={placeholder} />
      {value && (
        <button type="button" className="btn btn--ghost btn--icon btn--sm search-bar__clear" onClick={() => onChange('')} aria-label="Effacer la recherche">
          <X size={13} />
        </button>
      )}
    </div>
  );
}

export function Select({ value, onChange, options, ariaLabel }) {
  return (
    <select className="select" value={value} onChange={(e) => onChange(e.target.value)} aria-label={ariaLabel}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function Switch({ checked, onChange, label }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className="switch" onClick={() => onChange(!checked)} />;
}

export function Tooltip({ content, children }) {
  return (
    <span className="tooltip">
      {children}
      <span role="tooltip" className="tooltip__bubble">{content}</span>
    </span>
  );
}

export function Dropdown({ trigger, children, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);
  return (
    <div className="dropdown" ref={ref}>
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div className="dropdown__menu" style={align === 'left' ? { left: 0, right: 'auto' } : undefined} role="menu" onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}

export function UserAvatar({ name, size, color }) {
  const initials = (name || '?')
    .replace(/[^\p{L}\s.-]/gu, '')
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
  return (
    <span className={`avatar ${size ? `avatar--${size}` : ''}`} title={name} style={color ? { background: color, color: '#fff', borderColor: 'transparent' } : undefined}>
      {initials || '?'}
    </span>
  );
}
