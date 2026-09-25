import { Radar, Microscope, LifeBuoy, Scale, Compass, Megaphone, Hexagon } from 'lucide-react';

const ICONS = { Radar, Microscope, LifeBuoy, Scale, Compass, Megaphone };

export function CellIcon({ cell, size = 18, boxed = true }) {
  const Icon = ICONS[cell?.icon] || Hexagon;
  if (!boxed) return <Icon size={size} style={{ color: cell?.color }} />;
  return (
    <span className="cell-icon" style={{ background: cell?.color }} aria-hidden="true">
      <Icon size={size} />
    </span>
  );
}

export function KasbahMark({ size = 30 }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--surface-3)" />
      <path d="M6 26V12h3v-3h3v3h2V8h4v4h2V9h3v3h3v14h-6v-6a3 3 0 0 0-6 0v6z" fill="var(--brand)" />
    </svg>
  );
}
